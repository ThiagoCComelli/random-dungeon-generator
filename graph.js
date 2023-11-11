class Edge {
  constructor(start, end, weight) {
    this.start = start;
    this.end = end;
    this.weight = weight;
  }
}

class Vertex {
  constructor(obj) {
    this.obj = obj;
    this.edges = [];
  }

  getCenter() {
    return [this.obj.x + this.obj.width / 2, this.obj.y + this.obj.height / 2];
  }
}

class Graph {
  constructor() {
    this.vertices = [];
    this.edges = [];

    this.delaunay = null;
    this.mst = null;
  }

  calculateDistance(start, end) {
    return Math.sqrt(
      Math.pow(end.obj.x - start.obj.x, 2) +
        Math.pow(end.obj.y - start.obj.y, 2)
    );
  }

  getVertex(obj) {
    for (const vertex of this.vertices) {
      if (vertex.obj === obj) {
        return vertex;
      }
    }
    return null;
  }

  addVertex(obj) {
    const vertex = new Vertex(obj);
    this.vertices.push(vertex);
    return vertex;
  }

  addEdge(start, end, weight) {
    const edgeS = new Edge(start, end, weight);
    this.edges.push(edgeS);
    start.edges.push(edgeS);

    const edgeE = new Edge(end, start, weight);
    this.edges.push(edgeE);
    end.edges.push(edgeE);
  }

  generateMST() {
    this.edges = [];

    const reachedVertices = [];
    const unreachedVertices = [...this.vertices];

    reachedVertices.push(unreachedVertices.shift());
    let maxIterations = unreachedVertices.length * 2;

    while (unreachedVertices.length && maxIterations) {
      maxIterations -= 1;

      let minWeight = Infinity;
      let minEdge = null;

      for (const reachedVertex of reachedVertices) {
        for (const edge of reachedVertex.edges) {
          if (edge.weight < minWeight && !reachedVertices.includes(edge.end)) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }

      if (minEdge) {
        reachedVertices.push(minEdge.end);
        unreachedVertices.splice(unreachedVertices.indexOf(minEdge.end), 1);
        this.addEdge(minEdge.start, minEdge.end, minEdge.weight);
      }
    }

    // TODO: EXIST SOME FUCKING BUG IN THE PRISM ALGORITHM ABOVE,
    // THIS CODE BELOW IS TEMP FIX. SOME TIMES ONE OR TWO VERTICES ARE
    // UNREACHABLE, BUT THIS MAKES NO SENSE
    for (const unreachedVertice of unreachedVertices) {
      let minWeight = Infinity;
      let minEdge = null;

      for (const edge of unreachedVertice.edges) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }

      if (minEdge) {
        this.addEdge(minEdge.start, minEdge.end, minEdge.weight);
      }
    }

    if (unreachedVertices.length) {
      console.log("not all vertices were reached");
    }
  }

  generateDelaunay() {
    const mainRoomsVertices = this.vertices.map((vertex) =>
      this.getVertex(vertex.obj)
    );
    const points = mainRoomsVertices.map((vertex) => vertex.getCenter());

    const getByCoordinates = (x, y) => {
      for (const vertex of this.vertices) {
        let center = vertex.getCenter();
        if (center[0] === x && center[1] === y) {
          return vertex;
        }
      }
    };

    this.delaunay = Delaunator.from(points);

    const triangles = this.delaunay.triangles;
    for (let i = 0; i < triangles.length; i += 3) {
      let vertices = [
        points[triangles[i]],
        points[triangles[i + 1]],
        points[triangles[i + 2]]
      ].map((coord) => getByCoordinates(coord[0], coord[1]));

      for (const vertex of vertices) {
        for (const otherVertex of vertices) {
          if (vertex !== otherVertex) {
            this.addEdge(
              vertex,
              otherVertex,
              this.calculateDistance(vertex, otherVertex)
            );
          }
        }
      }
    }

    // TODO: ANOTHER BUG HERE, SOME VERTICES IS DUPLICATED, THIS IS A TEMP FIX
    for (const vertex of this.vertices) {
      for (const edge of vertex.edges) {
        for (const otherEdge of vertex.edges) {
          if (edge !== otherEdge) {
            if (
              (edge.start === otherEdge.start && edge.end === otherEdge.end) ||
              (edge.start === otherEdge.end && edge.end === otherEdge.start)
            ) {
              vertex.edges.splice(vertex.edges.indexOf(edge), 1);
            }
          }
        }
      }
    }
  }
}
