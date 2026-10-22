import { Component } from '@angular/core';
import { AssignmentManager } from './assignment-manager/assignment-manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AssignmentManager],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
