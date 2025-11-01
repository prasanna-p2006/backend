function findShortestPath(graph, start, freeSlots) {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];

    // if this node is a free slot
    if (freeSlots.some(s => s.id === node))
      return { nearestSlotId: node, path };

    const neighbors = graph[node] || [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }

  return { nearestSlotId: null, path: [] };
}

module.exports = { findShortestPath };
