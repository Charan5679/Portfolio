// public/workers/force-worker.js
// Runs d3-force simulation off the main thread via Web Worker

importScripts("https://cdn.jsdelivr.net/npm/d3-force@3/dist/d3-force.umd.min.js");

let simulation = null;
let nodes = [];
let links = [];

self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === "INIT") {
    nodes = payload.nodes;
    links = payload.links;

    simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(62)
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody().strength(-190))
      .force("center", d3.forceCenter(payload.width / 2, payload.height / 2))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => (d.id.startsWith("hub:") ? 28 : 20))
      )
      .alphaDecay(0.022)
      .on("tick", () => {
        // Send node positions back every tick
        self.postMessage({
          type: "TICK",
          nodes: nodes.map((n) => ({ id: n.id, x: n.x, y: n.y, group: n.group })),
        });
      })
      .on("end", () => {
        self.postMessage({ type: "END" });
      });
  }

  if (type === "DRAG_START") {
    const node = nodes.find((n) => n.id === payload.id);
    if (node) { node.fx = payload.x; node.fy = payload.y; }
    simulation?.alphaTarget(0.3).restart();
  }

  if (type === "DRAG") {
    const node = nodes.find((n) => n.id === payload.id);
    if (node) { node.fx = payload.x; node.fy = payload.y; }
  }

  if (type === "DRAG_END") {
    const node = nodes.find((n) => n.id === payload.id);
    if (node) { node.fx = null; node.fy = null; }
    simulation?.alphaTarget(0);
  }

  if (type === "RESIZE") {
    simulation?.force("center", d3.forceCenter(payload.width / 2, payload.height / 2));
    simulation?.alpha(0.3).restart();
  }
};
