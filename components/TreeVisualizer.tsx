import React, { useState } from "react";
import { GraphNode, GraphEdge, GraphCanvasProps } from "reagraph";
import dynamic from "next/dynamic";
import { FrequencyTreeNode, getHuffmanTree } from "../functions/getHuffmanTree";
const GraphCanvas = dynamic<GraphCanvasProps>(
  () => import("reagraph").then((x) => x.GraphCanvas),
  {
    ssr: false,
  }
);

export default function TreeVisualizer(props: { random_world: string }) {
  const { random_world } = props;
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  // ! THIS TREE DOES NOT SHOW CORRECTLY LEFT/RIGHT (EVEN IF THEY ARE ANALYZED IN CORRECT ORDER)
  function loadHuffmanTree() {
    const huffmanTree = getHuffmanTree(random_world);
    if (!huffmanTree) return;

    const queue: FrequencyTreeNode[] = [huffmanTree];
    const new_nodes: GraphNode[] = [];
    const new_edges: GraphEdge[] = [];

    while (queue.length > 0) {
      const new_node = queue.shift();
      if (!new_node) return;

      new_nodes.push({
        id: `${new_node.id}`,
        label: new_node.letter ?? "",
      });

      if (new_node.parent) {
        new_edges.push({
          id: `${new_node.parent}->${new_node.id}`,
          source: `${new_node.parent}`,
          target: `${new_node.id}`,
          label: `${new_node.parent}->${new_node.id}`,
        });
      }

      if (new_node.left) queue.push(new_node.left);
      if (new_node.right) queue.push(new_node.right);
    }

    setNodes(new_nodes);
    setEdges(new_edges);
  }

  return (
    <>
      <button onClick={() => loadHuffmanTree()}>Load Tree</button>
      {nodes.length > 0 && edges.length > 0 && (
        <div
          style={{
            border: "solid 1px black",
            height: "100vh",
            width: "100%",
            position: "relative",
          }}
        >
          <GraphCanvas nodes={nodes} edges={edges} layoutType="treeTd2d" />
        </div>
      )}
    </>
  );
}
