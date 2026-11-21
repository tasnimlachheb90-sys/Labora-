import { Routes } from '@angular/router';
import { SearchPage } from './features/search/search-page/search-page';
import { Calendar } from './features/calendar/calendar';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'search', component: SearchPage },
  { path: 'calendar', component: Calendar },
];