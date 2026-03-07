/// <reference types="node" />

type PageSize = PredefinedPageSize | CustomPageSize;

interface CustomPageSize {
  width: number;

  height: number | 'auto';
}

interface Position {
  x: number;

  y: number;
}

type PredefinedPageSize =
  | '4A0' | '2A0'
  | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10'
  | 'B0' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'B10'
  | 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' | 'C10'
  | 'RA1' | 'RA2' | 'RA3' | 'RA4'
  | 'SRA1' | 'SRA2' | 'SRA3' | 'SRA4'
  | 'EXECUTIVE' | 'FOLIO' | 'LEGAL' | 'LETTER' | 'TABLOID';

type PageOrientation = 'portrait' | 'landscape';

export type PageBreak = 'before' | 'after';

type Size =
  | number // absolute
  | 'auto'
  | '*'
  | string; // percentage

export interface TDocumentInformation {
  /** the title of the document */
  title?: string;

  /** the name of the author */
  author?: string;

  /** the subject of the document */
  subject?: string;

  /** keywords associated with the document */
  keywords?: string;

  creator?: string;

  producer?: string;

  creationDate?: Date;

  modDate?: Date;

  trapped?: string;
}

type DynamicContent = (
  currentPage: number,
  pageCount: number,
  pageSize: ContextPageSize,
) => Content | null;

type DynamicBackground = (currentPage: number, pageSize: ContextPageSize) => Content | null;

type Margins = number | [number, number] | [number, number, number, number];

type Decoration = 'underline' | 'lineThrough' | 'overline';
type DecorationStyle = 'dashed' | 'dotted' | 'double' | 'wavy';

type Alignment = 'left' | 'right' | 'justify' | 'center';

type DynamicRowSize = (row: number) => number | 'auto';

interface CustomTableLayout {
  hLineWidth?: DynamicLayout<number>;

  vLineWidth?: DynamicLayout<number>;

  hLineColor?: string | DynamicLayout<string>;

  vLineColor?: string | DynamicLayout<string>;

  hLineStyle?: DynamicLayout<LineStyle>;

  vLineStyle?: DynamicLayout<LineStyle>;

  fillColor?: string | DynamicLayout<string>;

  paddingLeft?: DynamicLayout<number>;

  paddingRight?: DynamicLayout<number>;

  paddingTop?: DynamicLayout<number>;

  paddingBottom?: DynamicLayout<number>;

  fillOpacity?: number | DynamicLayout<number>;

  defaultBorder?: boolean;
}

type DynamicLayout<T> = (rowIndex: number, node: ContentTable, columnIndex: number) => T | null;

interface LineStyle {
  dash?: {
    length: number;
    space?: number;
  };
}

type TableCell =
  | {} // Used when another cell spans over this cell
  | (Content & {
  rowSpan?: number;
  colSpan?: number;
  border?: [boolean, boolean, boolean, boolean];
  borderColor?: [string, string, string, string];
  fillOpacity?: number;
});

interface Table {
  body: TableCell[][];

  widths?: '*' | 'auto' | Size[];

  heights?: number | number[] | DynamicRowSize;

  headerRows?: number;

  dontBreakRows?: boolean;

  keepWithHeaderRows?: number;

  layout?: TableLayout;
}

type PredefinedTableLayout = 'noBorders' | 'headerLineOnly' | 'lightHorizontalLines';
type TableLayout = string | PredefinedTableLayout | CustomTableLayout;

interface Style {
  /** name of the font */
  font?: string;

  /** size of the font in pt */
  fontSize?: number;

  // Kept broad to avoid pdfkit type dependency during jsPDF migration.
  fontFeatures?: string[];

  /** the line height (default: 1) */
  lineHeight?: number;

  /** whether to use bold text (default: false) */
  bold?: boolean;

  /** whether to use italic text (default: false) */
  italics?: boolean;

  /** the alignment of the text */
  alignment?: Alignment;

  /** the color of the text (color name e.g., ‘blue’ or hexadecimal color e.g., ‘#ff5500’) */
  color?: string;

  /** the background color of the text */
  background?: string;

  /** the color of the bullets in a buletted list */
  markerColor?: string;

  /** the text decoration to applu (‘underline’ or ‘lineThrough’ or ‘overline’) */
  decoration?: Decoration;

  /** (‘dashed’ or ‘dotted’ or ‘double’ or ‘wavy’) */
  decorationStyle?: DecorationStyle;

  /** the color of the text decoration, see color */
  decorationColor?: string;

  margin?: Margins;

  preserveLeadingSpaces?: boolean;

  opacity?: number;

  characterSpacing?: number;

  leadingIndent?: number;

  // Table-cell properties:
  noWrap?: boolean;

  /** the background color of a table cell */
  fillColor?: string;

  /** the background opacity of a table cell */
  fillOpacity?: number;

  /** optional space between columns */
  columnGap?: Size;

  sup?: boolean;

  sub?: boolean;

  // These properties appear in the documentation but don't do anything:
  // tableCellPadding?: unknown;
  // cellBorder?: unknown;
  // headerCellBorder?: unknown;
  // oddRowCellBorder?: unknown;
  // evenRowCellBorder?: unknown;
  // tableBorder?: unknown;
}

type Content =
  | string
  | ContentText
  | ContentColumns
  | ContentStack
  | ContentUnorderedList
  | ContentOrderedList
  | ContentTable
  | ContentAnchor
  | ContentPageReference
  | ContentTextReference
  | ContentToc
  | ContentTocItem
  | ContentImage
  | ContentSvg
  | ContentQr
  | ContentCanvas;

export interface ContentText extends ContentLink, ContentBase {
  text: Content;
}

interface ContentColumns extends ContentBase {
  columns: Column[];
}

interface ContentStack extends ContentBase {
  /** if true, ensures that the contents of the stack are always on the same page */
  unbreakable?: boolean;

  stack: Content[];
}

/** for numbered lists set the ol key */
interface ContentOrderedList extends ContentBase {
  ol: OrderedListElement[];

  type?: OrderedListType;

  markerColor?: string;

  separator?: string | [string, string];

  reversed?: boolean;

  start?: number;
}

/** to treat a paragraph as a bulleted list, set an array of items under the ul key */
interface ContentUnorderedList extends ContentBase {
  ul: UnorderedListElement[];

  type?: UnorderedListType;

  markerColor?: string;
}

interface ContentCanvas extends ContentBase {
  canvas: CanvasElement[];
}

interface ContentSvg extends ContentBase {
  svg: string;

  width?: number;

  height?: number;

  fit?: [number, number];
}

export interface ContentImage extends ContentLink, ContentBase {
  image: string;

  width?: number;

  height?: number;

  fit?: [number, number];

  cover?: ImageCover;
}

export interface ContentTable extends ContentBase {
  table: Table;

  layout?: TableLayout;
}

interface ContentAnchor extends ContentBase {
  text: string | ContentAnchor;

  id: string;
}

type Styles = string | string[] | Style;

interface ContentTocItem extends ContentBase {
  text: string | ContentTocItem;

  tocItem: boolean | string | string[];

  tocStyle?: Styles;

  tocNumberStyle?: Styles;

  tocMargin?: Margins;
}

interface ContentPageReference extends ContentBase {
  pageReference: string;
}

interface ContentTextReference extends ContentBase {
  textReference: string;
}

interface ContentToc extends ContentBase {
  toc: TableOfContent;
}

interface ContentQr extends ContentBase {
  qr: string;

  foreground?: string;

  fit?: number;

  version?: number;

  eccLevel?: 'L' | 'M' | 'Q' | 'H';

  mode?: 'numeric' | 'alphanumeric' | 'octet';

  mask?: number;
}

interface ContentBase extends Style {
  style?: Styles;

  absolutePosition?: Position;

  relativePosition?: Position;

  pageBreak?: PageBreak;

  pageOrientation?: PageOrientation;

  headlineLevel?: number;
}

interface ContentLink {
  link?: string;

  linkToPage?: number;

  linkToDestination?: string;
}

interface TableOfContent {
  title?: Content;

  textMargin?: Margins;

  textStyle?: Styles;

  numberStyle?: Styles;

  id?: string;
}

type Column = Content & {
  width?: Size;
};

type OrderedListType = 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman' | 'none';
type OrderedListElement = Content & {
  counter?: number;
  listType?: OrderedListType;
};

type UnorderedListType = 'square' | 'circle' | 'none';
type UnorderedListElement = Content & {
  listType?: UnorderedListType;
};

type CanvasElement = CanvasRect | CanvasPolyline | CanvasLine | CanvasEllipse;

interface CanvasRect extends CanvasLineElement, CanvasFilledElement {
  type: 'rect';

  x: number;

  y: number;

  w: number;

  h: number;

  r?: number;
}

interface CanvasPolyline extends CanvasLineElement, CanvasFilledElement {
  type: 'polyline';

  points: Array<{ x: number; y: number }>;

  closePath?: boolean;

  lineCap?: 'round' | 'square';
}

interface CanvasLine extends CanvasLineElement {
  type: 'line';

  x1: number;

  y1: number;

  x2: number;

  y2: number;

  lineCap?: 'round' | 'square';
}

interface CanvasEllipse extends CanvasLineElement, CanvasFilledElement {
  type: 'ellipse';

  x: number;

  y: number;

  r1: number;

  r2?: number;
}

interface CanvasFilledElement {
  color?: string;

  fillOpacity?: number;

  linearGradient?: string[];
}

interface CanvasLineElement {
  lineWidth?: number;

  lineColor?: string;

  dash?: {
    length: number;
    space?: number;
  };
}

type ImageAlignment = 'left' | 'right' | 'center';
type ImageVerticalAlignment = 'top' | 'bottom' | 'center';

interface ImageCover {
  width?: number;

  height?: number;

  align?: ImageAlignment;

  valign?: ImageVerticalAlignment;
}

interface StyleDictionary {
  [name: string]: Style;
}

type PDFVersion = '1.3' | '1.4' | '1.5' | '1.6' | '1.7' | '1.7ext3';

interface Watermark {
  /** watermark text */
  text: string;

  /** opacity of text */
  opacity?: number;

  /** angle of text rotation (minimal version: 0.1.60) */
  angle?: number;

  font?: string;

  /** own font size of text (ideal size is calculated automatically) (minimal version: 0.1.60) */
  fontSize?: number;

  /** color of text */
  color?: string;

  /** bold style of text */
  bold?: boolean;

  /** italics style of text */
  italics?: boolean;
}

export interface PdfDocumentDefinition {
  content: Content[];

  background?: DynamicBackground | Content;

  compress?: boolean;

  defaultStyle?: Style;

  footer?: DynamicContent | Content;

  header?: DynamicContent | Content;

  images?: { [key: string]: string };

  info?: TDocumentInformation;

  pageBreakBefore?: ((
    currentNode: Node,
    followingNodesOnPage: Node[],
    nodesOnNextPage: Node[],
    previousNodesOnPage: Node[],
  ) => boolean);

  pageMargins?: Margins;

  pageOrientation?: PageOrientation;

  pageSize?: PageSize;

  styles?: StyleDictionary;

  userPassword?: string;

  ownerPassword?: string;

  permissions?: {
    printing?: 'highResolution' | 'lowResolution';
    modifying?: boolean;
    copying?: boolean;
    annotating?: boolean;
    fillingForms?: boolean;
    contentAccessibility?: boolean;
    documentAssembly?: boolean;
  };

  version?: PDFVersion;

  watermark?: string | Watermark;
}

interface Node {
  text?: Content;

  ul?: UnorderedListElement[];

  ol?: OrderedListElement[];

  table?: Table;

  image?: string;

  qr?: string;

  canvas?: CanvasElement;

  svg?: string;

  columns?: Column[];

  id?: string;

  headlineLevel?: number;

  style?: Styles;

  pageBreak?: PageBreak;

  pageOrientation?: PageOrientation;

  pageNumbers: number[];

  pages: number;

  stack: boolean;

  startPosition: {
    pageNumber: number;
    pageOrientation: PageOrientation;
    pageInnerHeight: number;
    pageInnerWidth: number;
    left: number;
    top: number;
    verticalRatio: number;
    horizontalRatio: number;
  };
}

interface ContextPageSize {
  height: number;

  width: number;

  orientation: PageOrientation;
}
