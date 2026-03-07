import jsPDF from 'jspdf';

/**
 * PdfBuilder - Adapter class to bridge pdfmake API to jsPDF
 * This allows gradual migration from pdfmake to jsPDF
 */
export class PdfBuilder {
  private doc: jsPDF;
  private currentY: number = 20;
  private readonly pageHeight: number;
  private readonly pageWidth: number;
  private readonly margin: number = 15;
  private readonly lineHeight: number = 7;
  private readonly contentWidth: number;

  constructor(orientation: 'p' | 'l' = 'p', unit: 'mm' | 'cm' | 'in' | 'pt' | 'px' | 'em' | 'ex' = 'mm') {
    this.doc = new jsPDF({ orientation, unit });
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.contentWidth = this.pageWidth - (2 * this.margin);
  }

  /**
   * Add text to PDF
   */
  addText(text: string, options?: { bold?: boolean; fontSize?: number; color?: string; alignment?: 'left' | 'center' | 'right' }): void {
    if (this.currentY > this.pageHeight - 20) {
      this.doc.addPage();
      this.currentY = 20;
    }

    const fontSize = options?.fontSize || 12;
    this.doc.setFontSize(fontSize);
    this.doc.setFont('Helvetica', options?.bold ? 'bold' : 'normal');

    if (options?.color) {
      const rgb = this.hexToRgb(options.color);
      this.doc.setTextColor(rgb.r, rgb.g, rgb.b);
    }

    const alignment = options?.alignment === 'center' ? 'center' : options?.alignment === 'right' ? 'right' : 'left';
    const x = alignment === 'center' ? this.pageWidth / 2 : alignment === 'right' ? this.pageWidth - this.margin : this.margin;

    this.doc.text(text, x, this.currentY, { align: alignment, maxWidth: this.contentWidth });
    this.currentY += this.lineHeight;
  }

  /**
   * Add heading/title
   */
  addHeading(text: string, color: string = '#024873'): void {
    this.currentY += 5;
    this.addText(text, { fontSize: 16, bold: true, color });
    this.currentY += 5;
  }

  /**
   * Add section title
   */
  addSectionTitle(text: string, bgColor: string = '#CCCCCC'): void {
    this.currentY += 10;

    // Draw background rectangle
    const rgb = this.hexToRgb(bgColor);
    this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
    this.doc.rect(this.margin, this.currentY - 4, this.contentWidth, 8, 'F');

    this.addText(text, { fontSize: 14, bold: true, color: '#024873' });
  }

  /**
   * Add item with header and content
   */
  addItem(title: string, subtitle: string, date: string, content: string[]): void {
    this.currentY += 8;

    // Title and date on same line
    this.doc.setFont('Helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text(title, this.margin, this.currentY);
    this.doc.text(date, this.pageWidth - this.margin, this.currentY, { align: 'right' });

    this.currentY += this.lineHeight;

    // Subtitle
    this.doc.setFont('Helvetica', 'italic');
    this.doc.setTextColor(85, 85, 85);
    this.doc.setFontSize(11);
    this.doc.text(subtitle, this.margin, this.currentY);
    this.currentY += this.lineHeight;

    // Content
    this.doc.setFont('Helvetica', 'normal');
    this.doc.setTextColor(2, 72, 115);
    this.doc.setFontSize(11);
    content.forEach(line => {
      const wrappedLines = this.doc.splitTextToSize(line, this.contentWidth) as string[];
      wrappedLines.forEach((wrappedLine: string) => {
        this.addText(wrappedLine);
      });
    });
  }

  /**
   * Add image
   */
  addImage(imageData: string, x: number = this.margin, y: number = this.currentY, width: number = 50, height: number = 50): void {
    try {
      this.doc.addImage(imageData, 'PNG', x, y, width, height);
      this.currentY = Math.max(this.currentY + this.lineHeight, y + height + 5);
    } catch (error) {
      console.warn('Failed to add image:', error);
    }
  }

  /**
   * Add a simple table
   */
  addTable(headers: string[], rows: string[][], columnWidths?: number[]): void {
    this.currentY += 5;

    const tableStartY = this.currentY;
    const cellHeight = 8;
    const defaultColWidth = this.contentWidth / (headers.length || 1);
    const colWidths = columnWidths || headers.map(() => defaultColWidth);

    // Draw headers
    this.doc.setFont('Helvetica', 'bold');
    this.doc.setFillColor(200, 200, 200);
    let currentX = this.margin;

    headers.forEach((header, idx) => {
      this.doc.rect(currentX, tableStartY, colWidths[idx], cellHeight, 'FD');
      this.doc.text(header, currentX + 2, tableStartY + 5);
      currentX += colWidths[idx];
    });

    // Draw rows
    this.doc.setFont('Helvetica', 'normal');
    let currentY = tableStartY + cellHeight;

    rows.forEach(row => {
      currentX = this.margin;
      row.forEach((cell, idx) => {
        this.doc.rect(currentX, currentY, colWidths[idx], cellHeight);
        const text = typeof cell === 'string' ? cell : String(cell);
        this.doc.text(text, currentX + 2, currentY + 5);
        currentX += colWidths[idx];
      });
      currentY += cellHeight;
    });

    this.currentY = currentY + 5;
  }

  /**
   * Add page break
   */
  addPageBreak(): void {
    this.doc.addPage();
    this.currentY = 20;
  }

  /**
   * Add footer
   */
  addFooter(text: string): void {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(10);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(
        text + ` - Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
    }
  }

  /**
   * Get the PDF document
   */
  getDocument(): jsPDF {
    return this.doc;
  }

  /**
   * Download PDF
   */
  download(filename: string = 'document.pdf'): void {
    this.doc.save(filename);
  }

  /**
   * Helper: Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 };
  }
}

