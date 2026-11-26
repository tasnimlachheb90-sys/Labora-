
import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Calendar } from './features/calendar/calendar';
import { Equipment } from './features/equipment/equipment';
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
  { path: '', component: Login },
  { path: 'register', component: Register },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'booking',
    component: BookingCheckout,
    canActivate: [authGuard]
  },
  {
    path: 'my-reservations',
    component: MyReservations,
    canActivate: [authGuard]
  },
  {
    path: 'manage-users',
    component: ManageUsers,
    canActivate: [adminGuard]
  },
  {
    path: 'manage-courses',
    component: ManageCourses,
    canActivate: [adminGuard]
  },
  {
    path: 'calendar',
    component: Calendar,
    canActivate: [authGuard]
  },
  {
    path: 'equipment',
    component: Equipment,
    canActivate: [authGuard]
  }
];
