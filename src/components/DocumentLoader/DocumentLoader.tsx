import { useState } from "react";
import PdfViewer from "../PdfViewer/PdfViewer";

const DocumentLoader = () => {

    const [file, setFile] = useState<File | undefined>(undefined)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) { setFile(f) }
    };

    const handleSubmit = () => {
        if (file) {
            console.log(`enviando ${file.name}`)
        }
    }

    return (
        <div>

            <label className="grid h-40 place-items-center rounded-xl border-2 border-dashed text-gray-500 m-6 hover:text-blue-500 cursor-pointer" >
                {file ?
                    <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-center p-2">{file.size} KBs</div>
                    </div>
                    :
                    <div>
                        <div className="font-medium">Subir el Archivo</div>
                        <div className="text-xs text-center p-2">Solo .pdf</div>
                    </div>
                }
                <input type="file" accept="application/pdf" className="hidden" onChange={onChange} />
            </label>
            {file ?
                <>
                    <div className="flex items-center justify-center m-4">
                        <button onClick={handleSubmit} className="px-4 py-2 rounded-xl border bg-green-600 hover:bg-green-800 text-white ">Enviar</button>
                        <button onClick={() => { setFile(undefined) }} className="px-4 py-2 rounded-xl border hover:bg-gray-200 ">Cancelar</button>
                    </div>
                    <PdfViewer file={file} />
                </>

                : null
            }


        </div>
    )
}

export default DocumentLoader