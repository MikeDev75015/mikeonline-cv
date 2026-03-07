/**
 * PdfCreatorServiceAdapter - Maintains compatibility with existing code
 * while using jsPDF under the hood
 *
 * This is a transitional file to help migrate from pdfmake to jsPDF
 * The goal is to keep the external API the same while switching implementations
 */

import jsPDF from 'jspdf';
import { PdfBuilder } from './pdf-builder';

export class PdfCreatorServiceAdapter {
  private pdfBuilder: PdfBuilder;

  constructor() {
    this.pdfBuilder = new PdfBuilder('p', 'mm');
  }

  /**
   * Initialize PDF document (mirrors old pdfmake style)
   */
  initPdf(): void {
    this.pdfBuilder = new PdfBuilder('p', 'mm');
  }

  /**
   * Generate PDF from CV data (main entry point)
   */
  generatePdf(fileName: string = 'CV.pdf'): void {
    // The PDF has already been built through the add* methods
    this.pdfBuilder.download(fileName);
  }

  /**
   * Add heading (main CV title)
   */
  addHeading(text: string): void {
    this.pdfBuilder.addHeading(text);
  }

  /**
   * Add section title
   */
  addSectionTitle(title: string, bgColor?: string): void {
    this.pdfBuilder.addSectionTitle(title, bgColor);
  }

  /**
   * Add item (experience/formation entry)
   */
  addItem(title: string, subtitle: string, date: string, content: string[]): void {
    this.pdfBuilder.addItem(title, subtitle, date, content);
  }

  /**
   * Add text
   */
  addText(text: string): void {
    this.pdfBuilder.addText(text);
  }

  /**
   * Add image (profile picture, etc.)
   */
  addImage(imageData: string, width?: number, height?: number): void {
    this.pdfBuilder.addImage(imageData, 15, undefined, width, height);
  }

  /**
   * Add footer
   */
  addFooter(text: string): void {
    this.pdfBuilder.addFooter(text);
  }

  /**
   * Get underlying jsPDF document
   */
  getDocument(): jsPDF {
    return this.pdfBuilder.getDocument();
  }

  /**
   * Reset builder for new PDF
   */
  reset(): void {
    this.initPdf();
  }
}

