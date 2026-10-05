import type { GraphEdge, GraphNode, StoreGraph } from '../../types'

export class GraphService {
  private readonly graph: StoreGraph

  public constructor(graph: StoreGraph) {
    this.graph = graph
  }

  getNode(id: string): GraphNode | null {
    return this.graph.nodes.find((node) => node.id === id) ?? null
  }

  getEdges(nodeId: string): GraphEdge[] {
    return this.graph.edges.filter((edge) => (
      edge.from === nodeId || (edge.bidirectional && edge.to === nodeId)
    ))
  }

  getNeighbors(nodeId: string): GraphNode[] {
    return this.getEdges(nodeId)
      .map((edge) => this.getNode(edge.from === nodeId ? edge.to : edge.from))
      .filter((node): node is GraphNode => node !== null)
  }

  getEdge(from: string, to: string): GraphEdge | null {
    return this.graph.edges.find((edge) => (
      (edge.from === from && edge.to === to)
      || (edge.bidirectional && edge.from === to && edge.to === from)
    )) ?? null
  }
}
