import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { SearchPage } from './features/search/search-page/search-page';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'search', component: SearchPage },
];