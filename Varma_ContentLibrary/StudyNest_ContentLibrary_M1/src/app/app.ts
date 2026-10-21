import { Component } from '@angular/core';
import { ContentLibrary } from './content-library/content-library';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContentLibrary],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}