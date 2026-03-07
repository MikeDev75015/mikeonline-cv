import { Component, EventEmitter } from '@angular/core';

export function MockComponent(options: {
  selector: string;
  template?: string;
  inputs?: string[];
  outputs?: string[];
  exportAs?: string;
}) {
  const metadata: any = {
    standalone: false,
    template: '',
    inputs: [],
    outputs: [],
    exportAs: '',
    ...options,
  };

  class Mock {}

  (metadata.outputs || []).forEach((outputName: string) => {
    (Mock.prototype as any)[outputName] = new EventEmitter<any>();
  });

  // Apply Angular metadata at runtime to avoid static decorator literal constraints.
  return Component({
    selector: metadata.selector,
    template: metadata.template,
    inputs: metadata.inputs,
    outputs: metadata.outputs,
    exportAs: metadata.exportAs,
    standalone: false,
  })(Mock as any);
}
