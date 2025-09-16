import axios from "axios";
import type { TemplateDTO, WordBlock, ExtractionResponse } from "../types";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
})

export interface IExtractorApi {
    extractText(file: File): Promise<ExtractionResponse>;
}

export interface ITemplatesApi {
    saveTemplate(tpl: TemplateDTO): Promise<any>;
    listTemplates(): Promise<{ templates: string[] }>;
    getTemplate(id: string): Promise<TemplateDTO>;
    applyTemplate(id: string, blocks: WordBlock[]): Promise<{ values: Record<string, any> }>;
}

export const extractorApi: IExtractorApi = {
    async extractText(file: File) {
        const form = new FormData();
        form.append('file', file);
        const { data } = await api.post('/extract-text', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data as ExtractionResponse;
    }
};

export const templatesApi: ITemplatesApi = {
    async saveTemplate(tpl) {
        const { data } = await api.post('/tamplates', tpl);
        return data;
    },
    async listTemplates() {
        const { data } = await api.get('/templates')
        return data as { templates: string[] };
    },
    async getTemplate(id) {
        const { data } = await api.get(`/templates/${id}`)
        return data as TemplateDTO;
    },
    async applyTemplate(id, blocks) {
        const { data } = await api.post(`/templates/${id}/apply`, { blocks });
        return data as { values: Record<string, any> };
    }

}