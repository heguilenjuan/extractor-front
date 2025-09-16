export type Box = [number, number, number, number]; 

export interface WordBlock {
    page: number;
    block_number: number;
    coordinates: Box;
    text: string;
    type: number;
    flags: number;
}

export type CastKind = 'text' | 'number' | 'currency' | 'date';

export interface TemplateField {
    page: number;
    box: Box;
    pad?: number;
    join_with_space?: boolean;
    regex?: string | null;
    cast?: CastKind | null;
}

export interface TemplateDTO {
    id: string;
    fields: Record<string, TemplateField>;
    meta?: Record<string, any>;
}

export interface ExtractionResponse {
    total_pages: number;
    pages: { page_number: number; blocks: WordBlock[] }[];
}
