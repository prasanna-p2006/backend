const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Slot = require("../models/Slot");
const QRCode = require("qrcode");

// Generate QR at entry kiosk
router.post("/generate-qr", async (req, res) => {
  const { registrationNumber } = req.body;
  if (!registrationNumber)
    return res.status(400).json({ error: "Registration required" });

  // QR encodes URL + registration number
  const url = `https://easepark.local/?reg=${registrationNumber}`;
  const qr = await QRCode.toDataURL(url);

  res.json({ qr });
});

// Find vehicle slot and route
router.post("/find", async (req, res) => {
  const { registrationNumber, entryNode } = req.body;
  const vehicle = await Vehicle.findOne({ registrationNumber });
  if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

  const slot = await Slot.findOne({ id: vehicle.slotId });
  if (!slot) return res.status(404).json({ error: "Slot not found" });

  // Compute route back to slot
  const graph = buildGraph(await Slot.find());
  const { path } = findShortestPath(graph, entryNode, [slot]);

  res.json({ slotId: slot.id, route: path });
});

// Helper: build graph again
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
