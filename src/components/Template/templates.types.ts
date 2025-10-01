import type { Field } from "../Fields/fields.types";
import type { Box } from "../Overlay/overlay.types";

export type TemplatePayload = {
    name: string;
    meta: Meta;
    boxes: Array<Pick<Box, "id" | "x" | "y" | "w" | "h" | "name" | "page">>;
    fields: Field[];
};

export type ValidationIssue = { path: string; message: string };

export type PageMeta = {
    renderWidth: number;
    renderHeight: number;
    pdfWidthBase: number;
    pdfHeightBase: number;
    viewportScale: number;
    rotation: number;
    anchors?: Anchor[]
};

export type Meta = {
    pageCount?: number;
    pages: Record<number, PageMeta>;
};

export type Anchor = {
    x: number;
    y: number;
    page: number;
    name: string;
    id: string;
    kind: Text;
    pattern: string;
    expected: { x: number; y: number };
    refPoint?: 'topleft' | 'center' | 'baselineStart';
    searchBox?: { x: number; y: number; w: number; h: number };
    tolerance?: { dx?: number; dy?: number };
    weight?: number;
    ocr?: { enabled: boolean; lang?: string };
    caseSensitive?: boolean;
};

export type SearchBox = { x: number; y: number; w: number; h: number };