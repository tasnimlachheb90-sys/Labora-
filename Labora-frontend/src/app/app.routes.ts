import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Calendar } from './features/calendar/calendar';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { ManageUsers } from './pages/manage-users/manage-users';
import { ManageCourses } from './pages/manage-courses/manage-courses';
import { Profile } from './pages/profile/profile';
import { BookingCheckout } from './booking-checkout/booking-checkout';
import { MyReservations } from './my-reservations/my-reservations';

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

  // Réservations : utilisateurs connectés
  {
    path: 'booking',
    component: BookingCheckout,
    canActivate: [authGuard]
  },

  // Mes réservations : utilisateurs connectés
  {
    path: 'my-reservations',
    component: MyReservations,
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
 , {
  path: 'calendar',
  component: Calendar,
  canActivate: [authGuard]
},

];
