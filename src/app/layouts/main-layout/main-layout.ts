import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { MainHeader } from './components/main-header/main-header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, MainHeader],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
