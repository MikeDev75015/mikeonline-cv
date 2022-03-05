export class PdfDefinition {
  info?: {
    title?: string; // the title of the document
    author?: string; // the name of the author
    subject?: string; // the subject of the document
    keywords?: string; // keywords associated with the document
    creator?: string; // the creator of the document (default is ‘pdfmake’)
    producer?: string; // the producer of the document (default is ‘pdfmake’)
    creationDate?: string; // the date the document was created (added automatically by pdfmake)
    modDate?: string; // the date the document was last modified
    trapped?: string; // the trapped flag in a PDF document indicates whether the document has been “trapped”,
    // i.e. corrected for slight color miss registrations

    // Custom properties:
    // You can add custom properties. Key of property not contain spaces.
  };
  userPassword?: string;
  ownerPassword?: string;
  permissions?: {
    printing?: 'highResolution' | 'lowResolution', // whether printing is allowed. Specify "lowResolution" to allow degraded printing,
    // or "highResolution" to allow printing with high resolution
    modifying?: boolean, // whether modifying the file is allowed. Specify true to allow modifying document content
    copying?: boolean, // whether copying text or graphics is allowed. Specify true to allow copying
    annotating?: boolean, // whether annotating, form filling is allowed. Specify true to allow annotating and form filling
    fillingForms?: boolean, // whether form filling and signing is allowed. Specify true to allow filling in form fields and signing
    contentAccessibility?: boolean, // whether copying text for accessibility is allowed. Specify true to allow copying for accessibility
    documentAssembly?: boolean, // whether assembling document is allowed. Specify true to allow document assembly
  };
  compress?: boolean; // Compression of PDF is enabled by default, use compress: false for disable
  pageSize = 'A4'; // // a string or { width: number, height: number }
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
  defaultStyle?: {
    font?: string; // name of the font
    fontSize?: number; // size of the font in pt
    fontFeatures?: string[]; // array of advanced typographic features supported in TTF fonts (supported features depend on font file)
    lineHeight?: number; // the line height (default: 1)
    bold?: boolean; // whether to use bold text (default: false)
    italics?: boolean; // whether to use italic text (default: false)
    alignment?: string; // (‘left’ or ‘center’ or ‘right’) the alignment of the text
    characterSpacing?: number; // size of the letter spacing in pt
    color?: string; // the color of the text (color name e.g., ‘blue’ or hexadecimal color e.g., ‘#ff5500’)
    background?: string; // the background color of the text
    markerColor?: string; // the color of the bullets in a bulleted list
    decoration?: string; // the text decoration to apply (‘underline’ or ‘lineThrough’ or ‘overline’)
    decorationStyle?: string; // the style of the text decoration (‘dashed’ or ‘dotted’ or ‘double’ or ‘wavy’)
    decorationColor?: string; // the color of the text decoration, see color
  };
  styles?: any;
  content = [];
  header?: any;
  footer?: any;

  constructor() {
  }
}
