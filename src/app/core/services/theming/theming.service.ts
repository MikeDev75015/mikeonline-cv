import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  private readonly themeElement = document.getElementById('theme') as HTMLLinkElement;

  private readonly themeList: string[] = [
    'arya-blue',
    'arya-green',
    'arya-orange',
    'arya-purple',
    'bootstrap4-dark-blue',
    'bootstrap4-dark-purple',
    'bootstrap4-light-blue',
    'bootstrap4-light-purple',
    'fluent-light',
    'lara-dark-blue',
    'lara-dark-indigo',
    'lara-dark-purple',
    'lara-dark-teal',
    'lara-light-blue',
    'lara-light-indigo',
    'lara-light-purple',
    'lara-light-teal',
    'luna-amber',
    'luna-blue',
    'luna-green',
    'luna-pink',
    'md-dark-deeppurple',
    'md-dark-indigo',
    'md-light-deeppurple',
    'md-light-indigo',
    'mdc-dark-deeppurple',
    'mdc-dark-indigo',
    'mdc-light-deeppurple',
    'mdc-light-indigo',
    'nova',
    'nova-accent',
    'nova-alt',
    'rhea',
    'saga-blue',
    'saga-green',
    'saga-orange',
    'saga-purple',
    'tailwind-light',
    'vela-blue',
    'vela-green',
    'vela-orange',
    'vela-purple',
  ];

  public getThemeList(): string[] {
    return this.themeList;
  }

  public getThemeName(): string {
    return this.themeElement.href.split('/themes/')[1].split('.css')[0];
  }

  public setTheme(name: string): void {
    this.themeElement.href = `${this.themeElement.href.split('/themes/')[0]}/themes/${name}.css`;
  }
}
