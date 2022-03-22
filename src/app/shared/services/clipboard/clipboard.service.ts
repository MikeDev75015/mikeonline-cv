import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  /**
   * on Clipboard Copy
   * @param text
   */
  public static onClipboardCopy(text: string): Promise<void> {
    return window.navigator.clipboard.writeText(text);
  }

  /**
   * on Clipboard Paste
   */
  public static onClipboardPaste(): Promise<string> {
    return window.navigator.clipboard.readText();
  }
}
