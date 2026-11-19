
import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { ManageUsers } from './pages/manage-users/manage-users';
import { ManageCourses } from './pages/manage-courses/manage-courses';
import { Profile } from './pages/profile/profile';

import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Page de connexion
  { path: '', component: Login },

  // Page d'inscription
  { path: 'register', component: Register },

  // Dashboard : utilisateurs connectés
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  // Profil : utilisateurs connectés
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },

  // Gestion des utilisateurs : Admin uniquement
  {
    path: 'manage-users',
    component: ManageUsers,
    canActivate: [adminGuard]
  },

  // Gestion des cours : Admin uniquement
  {
    path: 'manage-courses',
    component: ManageCourses,
    canActivate: [adminGuard]
  }

];
