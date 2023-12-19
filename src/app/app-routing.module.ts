import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { AuthGuard } from './services/auth-guard.service';
import { CollectionListComponent } from './components/collection/collection-list/collection-list.component';
import { CollectionDetailComponent } from './components/collection/collection-detail/collection-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardType: 'beforeLogin' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
    data: { authGuardType: 'beforeLogin' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { authGuardType: 'afterLogin' }
  },
  {
    path: 'collections',
    component: CollectionListComponent,
    canActivate: [AuthGuard],
    data: { authGuardType: 'afterLogin' }
  },
  {
    path: 'collection/:id',
    component: CollectionDetailComponent,
    canActivate: [AuthGuard],
    data: { authGuardType: 'afterLogin' }
  },
  {
    path: 'request-password-reset',
    component: RequestResetComponent
  },
  {
    path: 'response-password-reset',
    component: ResponseResetComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
