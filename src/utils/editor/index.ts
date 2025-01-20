import { CSSProperties } from "react";

export const isInsideNode = (
  from: number,
  to: number,
  pos: any,
  nodeSize: number,
) => from > pos && to < pos + nodeSize + 1;

export const hiddenStyle = {
  opacity: 0,
  overflow: "hidden",
  position: "absolute",
  width: "0px",
  height: "0px",
} as CSSProperties;
