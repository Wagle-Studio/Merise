import type { FlowDTOInterface, TypedEdge, TypedNode } from "../types";

export default class FlowDTO implements FlowDTOInterface {
  private nodes: TypedNode[] = [];
  private edges: TypedEdge[] = [];

  constructor(nodes: TypedNode[] = [], edges: TypedEdge[] = []) {
    this.nodes = nodes;
    this.edges = edges;
  }

  getNodes = (): TypedNode[] => {
    return this.nodes;
  };

  getEdges = (): TypedEdge[] => {
    return this.edges;
  };

  cloneWithAddedEdge = (edge: TypedEdge): FlowDTOInterface => {
    return new FlowDTO(this.nodes, [...this.edges, edge]);
  };

  cloneWithAddedNode = (node: TypedNode): FlowDTOInterface => {
    return new FlowDTO([...this.nodes, node], this.edges);
  };

  cloneWithUpdatedEdges = (edges: TypedEdge[]): FlowDTOInterface => {
    return new FlowDTO(this.nodes, edges);
  };

  cloneWithUpdatedNodes = (nodes: TypedNode[]): FlowDTOInterface => {
    return new FlowDTO(nodes, this.edges);
  };

  cloneWithUpdatedEdgesAndNodes = (edges: TypedEdge[], nodes: TypedNode[]): FlowDTOInterface => {
    return new FlowDTO(nodes, edges);
  };
}
