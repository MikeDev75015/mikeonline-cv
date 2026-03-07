export class PdfDefinition {
  info?: {
    title?: string; // the title of the document
    author?: string; // the name of the author
    subject?: string; // the subject of the document
    keywords?: string; // keywords associated with the document
  };

  pageSize: 'A4' = 'A4'; // // a string or { width: number, height: number }
  /* Page sizes
   '4A0', '2A0', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
   'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
   'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10',
   'RA0', 'RA1', 'RA2', 'RA3', 'RA4',
   'SRA0', 'SRA1', 'SRA2', 'SRA3', 'SRA4',
   'EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'
   */

  pageOrientation: 'portrait' | 'landscape' = 'portrait';

  pageMargins: number[] | number = [20, 20, 20, 20]; // [left, top, right, bottom] or [horizontal, vertical]
  // or just a number for equal margins
  content: any[] = [];
  header?: any;
  footer?: any;
}
