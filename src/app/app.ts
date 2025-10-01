import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { ThemeService } from './core/services/themes/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly _themeService = inject(ThemeService);
  protected readonly title = signal('engaz-hr-new');
}
