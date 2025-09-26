export interface Box {
    id: string;
    name:string;
    x: number;
    y: number;
    w: number;
    h: number;
    page?:number;
}
export interface BoxInPercent {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface Point {
    x: number;
    y: number;
}

export interface CurrentBox {
    x: number;
    y: number;
    w: number;
    h: number;
}

export type DragHandle =
  | "move"
  | "nw" | "n" | "ne"
  | "w"  |       "e"
  | "sw" | "s" | "se";
