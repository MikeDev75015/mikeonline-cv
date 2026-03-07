import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ClipboardService } from './clipboard.service';

describe('ClipboardGenService', () => {
  let writeTextSpy: any;
  let readTextSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({});

  });

  beforeAll(() => {
    Object.defineProperty(window, 'navigator', {
      value: {
        clipboard: {
          writeText: vi.fn(),
          readText: vi.fn(),
        },
      },
    });

    writeTextSpy = vi.spyOn(window.navigator.clipboard, 'writeText');
    readTextSpy = vi.spyOn(window.navigator.clipboard, 'readText');
  });

  it('should be created', () => {
    const service: ClipboardService = TestBed.inject(ClipboardService);
    expect(service).toBeTruthy();
  });

  describe('onClipboardCopy', () => {
    it('should call writeText clipboard method with text passed as argument', async () => {
      await ClipboardService.onClipboardCopy('toto');
      expect(writeTextSpy).toHaveBeenCalledTimes(1);
      expect(writeTextSpy).toHaveBeenCalledWith('toto');
    });
  });

  describe('onClipboardPaste', () => {
    it('should call readText clipboard method', async () => {
      await ClipboardService.onClipboardPaste();
      expect(readTextSpy).toHaveBeenCalledTimes(1);
    });
  });
});
