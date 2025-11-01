const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Vehicle = require("../models/Vehicle");
const { findShortestPath } = require("../utils/dijkstra");

// Allocate nearest free slot
router.post("/allocate", async (req, res) => {
  const { registrationNumber, entryNode } = req.body;

  if (!registrationNumber)
    return res.status(400).json({ error: "Registration number required" });

  const vehicle = await Vehicle.findOne({ registrationNumber });
  if (vehicle && vehicle.slotId)
    return res.json({ message: "Already allocated", slotId: vehicle.slotId });

  const freeSlots = await Slot.find({ occupied: false }).lean();
  if (!freeSlots.length)
    return res.status(404).json({ error: "No free slots" });

  // Graph-based pathfinding
  const graph = buildGraph(freeSlots); // build adjacency list
  const { nearestSlotId, path } = findShortestPath(graph, entryNode, freeSlots);

  const chosenSlot = await Slot.findOne({ id: nearestSlotId });
  chosenSlot.occupied = true;
  await chosenSlot.save();

  const newVehicle = await Vehicle.create({
    registrationNumber,
    slotId: chosenSlot.id,
  });

  res.json({
    message: "Slot allocated successfully",
    slotId: chosenSlot.id,
    route: path,
  });
});

// Utility to convert slot layout to graph (simple grid)
function buildGraph(slots) {
  const graph = {};
  slots.forEach(slot => {
    const neighbors = slots.filter(
      s =>
        (Math.abs(s.x - slot.x) === 1 && s.y === slot.y) ||
        (Math.abs(s.y - slot.y) === 1 && s.x === slot.x)
    );
    graph[slot.id] = neighbors.map(n => n.id);
  });
  return graph;
}

module.exports = router;
