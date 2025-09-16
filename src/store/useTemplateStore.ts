import { create } from 'zustand';
import type { Box, TemplateDTO, TemplateField, WordBlock } from '../types';

type Mode = 'word' | 'marquee';

interface TemplateState {
  pdfFile: File | null;
  pdfUrl: string | null;
  page: number;
  scale: number;
  wordsByPage: Record<number, WordBlock[]>;
  fields: Record<string, TemplateField>;
  activeField?: string;
  mode: Mode;
  meta: { id: string; proveedor?: string; version?: number };
}

interface TemplateActions {
  setPdf(file: File | null): void;
  setPage(p: number): void;
  setScale(s: number): void;
  setWords(page: number, words: WordBlock[]): void;
  upsertField(name: string, field: TemplateField): void;
  deleteField(name: string): void;
  setActive(name?: string): void;
  setMode(m: Mode): void;
  setTemplateMeta(meta: TemplateState['meta']): void;
  reset(): void;
}

export const useTemplateStore = create<TemplateState & TemplateActions>((set, get) => ({
  pdfFile: null,
  pdfUrl: null,
  page: 0,
  scale: 1,
  wordsByPage: {},
  fields: {},
  activeField: undefined,
  mode: 'word',
  meta: { id: 'factura.ejemplo.v1' },

  setPdf(file) {
    const prev = get().pdfUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      pdfFile: file,
      pdfUrl: file ? URL.createObjectURL(file) : null,
      page: 0,
      wordsByPage: {}
    });
  },
  setPage: (p) => set({ page: p }),
  setScale: (s) => set({ scale: s }),

  setWords(page, words) {
    set({ wordsByPage: { ...get().wordsByPage, [page]: words } });
  },

  upsertField(name, field) {
    set({ fields: { ...get().fields, [name]: field }, activeField: name });
  },

  deleteField(name) {
    const { [name]: _, ...rest } = get().fields;
    set({ fields: rest, activeField: undefined });
  },

  setActive: (n) => set({ activeField: n }),
  setMode: (m) => set({ mode: m }),
  setTemplateMeta: (meta) => set({ meta }),

  reset() {
    const prev = get().pdfUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      pdfFile: null,
      pdfUrl: null,
      page: 0,
      scale: 1,
      wordsByPage: {},
      fields: {},
      activeField: undefined,
      mode: 'word',
      meta: { id: 'factura.ejemplo.v1' }
    });
  }
}));
