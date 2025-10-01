import { Injectable, Renderer2, RendererFactory2, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PlatFormService } from '../platform/platform';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory2 = inject(RendererFactory2);
  private readonly platformService = inject(PlatFormService);

  private readonly STORAGE_KEY = 'theme';
  renderer!: Renderer2;

  theme = signal<'light' | 'dark'>('light');

  constructor() {
    this.renderer = this.rendererFactory2.createRenderer(null, null);
    this.initializeTheme();
    this.setupThemeListener();
  }

  toggle(): void {
    this.theme.update((value) => (value === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
  }

  private initializeTheme(): void {
    if (!this.platformService.isBrowser()) return;

    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as 'light' | 'dark' | null;

    if (savedTheme) {
      this.theme.set(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }

    this.applyTheme(this.theme());
  }

  private setupThemeListener(): void {
    effect(() => {
      const currentTheme = this.theme();
      if (this.platformService.isBrowser()) {
        localStorage.setItem(this.STORAGE_KEY, currentTheme);
      }
      this.applyTheme(currentTheme);
    });
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (!this.platformService.isBrowser()) return;

    const html = this.document.documentElement;

    this.renderer.removeClass(html, 'light-mode');
    this.renderer.removeClass(html, 'dark-mode');

    if (theme === 'dark') {
      this.renderer.addClass(html, 'dark-mode');
    } else {
      this.renderer.addClass(html, 'light-mode');
    }
  }
}
