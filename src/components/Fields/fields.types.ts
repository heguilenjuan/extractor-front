export type Normalizer = 'trim' | 'toUpper' | 'toLower' | 'removeSpaces' | 'keepDigits';

export type Field = {
    id:string;
    boxId: string;
    key: string;
    regex?: string;
    required?: boolean;
    normalizers?: Normalizer[];
}