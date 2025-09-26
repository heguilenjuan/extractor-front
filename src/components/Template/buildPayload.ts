import type { Field } from "../Fields/fields.types";
import type { Box } from "../Overlay/overlay.types";
import type { TemplatePayload } from "./templates.types";

export function buildPayload(args: { name: string; boxes: Box[]; fieldsByBox: Record<string, Field[]>; meta?: TemplatePayload["meta"] }): TemplatePayload {

    const { name, boxes, fieldsByBox, meta } = args;
    const fields = Object.values(fieldsByBox).flat();
    const cleanBoxes = boxes.map(({ id, x, y, w, h, name, page }) => ({ id, x, y, w, h, name, page }));

    return { name, meta, boxes: cleanBoxes, fields };
};