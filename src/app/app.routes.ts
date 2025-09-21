import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login.component';

export const routes: Routes = [
  // test the login route and register route
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: LoginComponent, // reuse login component to test redirect
  },
];
