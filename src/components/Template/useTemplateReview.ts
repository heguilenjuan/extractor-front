import { useCallback, useState } from "react";
import type { Box } from "../Overlay/overlay.types";
import type { Field } from "../Fields/fields.types";
import type { ValidationIssue, Meta, TemplatePayload } from "./templates.types";
import { buildPayload } from "./buildPayload";
import { validateTemplate } from "./validateTemplate";
import { postTemplate } from "./postTemplate";


export function useTemplateReview({
    templateName,
    boxes,
    fieldsByBox,
    meta,
    onSuccess,
    customPost,
}: {
    templateName: string;
    boxes: Box[];
    fieldsByBox: Record<string, Field[]>;
    meta?: Meta;
    onSuccess?: (saved: unknown) => void;
    customPost?: (template: TemplatePayload) => Promise<unknown>;
}) {
    const [reviewOpen, setReviewOpen] = useState(false);
    const [preview, setPreview] = useState<TemplatePayload | null>(null);
    const [issues, setIssues] = useState<ValidationIssue[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const openReview = useCallback(() => {
        const payload = buildPayload({ name: templateName, boxes, fieldsByBox, meta });
        setPreview(payload);
        setIssues(validateTemplate(payload));
        setReviewOpen(true);
    }, [templateName, boxes, fieldsByBox, meta]);

    const closeReview = useCallback(() => setReviewOpen(false), []);
    const submitTemplate = useCallback(async () => {
        if (!preview) return;
        const errs = validateTemplate(preview);
        setIssues(errs);
        if (errs.length) return;

        try {
            setSubmitting(true);
            const postFn = customPost ?? postTemplate;
            const saved = postFn(preview);
            onSuccess?.(saved);
            setReviewOpen(false);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setIssues([{ path: "server", message }]);
        } finally {
            setSubmitting(false);
        }
    }, [preview, customPost, onSuccess]);

    return {
        reviewOpen,
        preview,
        issues,
        submitting,
        openReview,
        closeReview,
        submitTemplate,
        setPreview,
    };
}