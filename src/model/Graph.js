import Heap from './Heap';

export default class Graph {
  constructor() {
    this.nodes = {};
  }

  addNode(node) {
    this.nodes[node.id] = { node, adjList: [] };
  }

  getNode(id) {
    return this.nodes[id];
  }

  getAllNodes() {
    return this.nodes;
  }

  addEdge(srcId, destId, cost = 1) {
    this.nodes[srcId].adjList.push({ to: destId, cost });

    this.nodes[destId].adjList.push({ to: srcId, cost });
  }

  numEdges() {
    let edges = 0;

    Object.values(this.nodes).forEach((item) => {
      edges += item.adjList.length;
    });

    return edges / 2;
  }

  bfs(callback) {
    const visited = {};

    Object.keys(this.nodes).forEach((s) => {
      if (!visited[s]) {
        this.bfsFromStart(s, visited, callback);
      }
    });

    return visited;
  }

  bfsFromStart(start, visited, callback) {
    const queue = [start];

    visited[start] = true;

    while (queue.length > 0) {
      const u = queue.shift();

      this.nodes[u].adjList.forEach((v) => {
        const { to } = v;

        if (!visited[to]) {
          visited[to] = true;

          callback(this.nodes[u].node, this.nodes[to].node);

          queue.push(to);
        }
      });
    }
  }

  bfsFromStartToDest(start, dest) {
    const visited = {};
    const queue = [[start]];

    visited[start] = true;

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === dest) {
        return path;
      }

      this.nodes[node].adjList.forEach((v) => {
        const { to } = v;

        if (!visited[to]) {
          queue.push([...path, to]);

          visited[to] = true;
        }
      });
    }

    return [];
  }

  dijkstra(start, dest) {
    const path = [];
    const predecessors = this.dijkstra_algorithm(start, dest);

    if (!predecessors[dest]) return null;

    for (;;) {
      path.push(dest);

      if (dest === start) break;

      dest = predecessors[dest];
    }

    return path.reverse();
  }

  dijkstra_algorithm(start, dest) {
    const distances = {};
    const predecessors = {};

    const heap = new Heap('min');
    heap.insert(start, 0);

    while (!heap.isEmpty()) {
      const smallest = heap.remove();
      distances[smallest.id] = smallest.priority;

      if (smallest.id === dest) break;

      this.nodes[smallest.id].adjList.forEach((edge) => {
        const currentDistance = distances[smallest.id] + edge.cost;

        if (distances[edge.to]) {
          if (currentDistance < distances[edge.to]) {
            throw Error('Found better path to already-final vertex');
          }
        } else if (!heap.getItem(edge.to)) {
          heap.insert(edge.to, currentDistance);

          predecessors[edge.to] = smallest.id;
        } else if (currentDistance < heap.getItem(edge.to).priority) {
          heap.changePriority(edge.to, currentDistance);

          predecessors[edge.to] = smallest.id;
        }
      });
    }

    return predecessors;
  }
}
