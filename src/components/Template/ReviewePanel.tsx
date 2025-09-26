import type { TemplatePayload, ValidationIssue } from "./templates.types";

export default function ReviewPanel({
    payload,
    issues,
    onClose,
    onSubmit,
    submitting
}: {
    payload: TemplatePayload;
    issues: ValidationIssue[];
    onClose: () => void;
    onSubmit: () => void;
    submitting: boolean;
}) {
    return (
        <div className="w-full max-w-[820px] border rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Revision de plantilla</h3>
                <button className="px-3 py-1 rounded border" onClick={onClose}>Seguir editando</button>
            </div>

            {issues.length > 0 && (
                <div className="rounded border border-red-300 bg-red-50 p-2 text-sm">
                    <b>Corregi estos puntos antes de enviar:</b>
                    <ul className="list-disc ml-5 mt-1">
                        {issues.map((e, i) => ( <li key={i}><code>{e.path}</code>: {e.message}</li>))}
                    </ul>
                </div>
            )}

            <pre className="text-xs bg-gray-50 border rounded p-2 overflow-auto max-h-64">
                {JSON.stringify(payload, null, 2)}
            </pre>

            <div className="flex gap-2">
                <button 
                    className="px-3 py-2 rounded bg-blue-600 text-white disabled:bg-gray-300"
                    onClick={onSubmit}
                    disabled={submitting || issues.length > 0}
                >
                    {submitting ? "Enviando...": "Enviar al backend"}
                </button>
            </div>
        </div>
    );
}