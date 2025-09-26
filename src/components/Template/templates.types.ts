import type { Field } from "../Fields/fields.types";
import type { Box } from "../Overlay/overlay.types";

export type TemplatePayload = {
    name: string;
    meta?: { pageCount?: number; renderWidth?: number; renderHeight?: number };
    boxes: Array<Pick<Box, "id" | "x" | "y" | "w" | "h" | "name" | "page">>;
    fields: Field[];
};

export type ValidationIssue = { path: string; message: string };

export type Meta = { pageCount?: number; renderWidth?: number; renderHeight?: number };