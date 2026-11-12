import { Routes } from '@angular/router';
import { Cards } from './cards/cards';
import { AssignmentManager } from './assignment-manager/assignment-manager';
import { ContentLibrary } from './content-library/content-library';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'content-library',
    pathMatch: 'full'
  },
  {
    path: 'flashcards',
    component: Cards
  },
  {
    path: 'assignments',
    component: AssignmentManager
  },
  {
    path: 'content-library',
    component: ContentLibrary
  },
  {
    path: '**',
    redirectTo: 'content-library'
  }
];