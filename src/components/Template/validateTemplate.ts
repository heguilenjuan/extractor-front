import type { TemplatePayload, ValidationIssue } from "./templates.types";

export function validateTemplate(template: TemplatePayload): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    if (!template.name?.trim()) issues.push({ path: "name", message: "El nombre de la plantilla es obligatorio" });
    if (!template.boxes.length) issues.push({ path: "boxes", message: "Debe haber al menos un box." });

    const boxIds = new Set(template.boxes.map(b => b.id));
    template.fields.forEach((fields, i) => {
        if (!fields.key?.trim()) issues.push({ path: `fields[${i}].key`, message: "Nombre del campo vacío." });
        if (!boxIds.has(fields.boxId)) issues.push({ path: `fields[${i}].boxId`, message: "boxId no referencia a un box valido."})
        if (fields.regex) { try { new RegExp(fields.regex); } catch {issues.push({ path: `fields[${i}].regex`, message:"Regex inválida"})}};
    });

    template.boxes.forEach((b, i) => {
        if(b.w < 3 || b.h < 3) issues.push({path: `boxes[${i}]`, message: "Box demasiado pequeño."});
    });
    
    return issues;
}