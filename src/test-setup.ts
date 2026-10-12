import '@angular/compiler';
import './test/vitest-zone-patch';
import { ɵgetCleanupHook as getCleanupHook, getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeEach } from 'vitest';

// Reset the TestBed (and the fake async zone) around every test, then boot the zone-based test environment once.
beforeEach(getCleanupHook(false));
afterEach(getCleanupHook(true));
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

const mockStorage = () => {
  let storage: { [key: string]: string } = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mockStorage(), writable: false });
Object.defineProperty(window, 'sessionStorage', { value: mockStorage(), writable: false });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({ enumerable: true, configurable: true }),
});
