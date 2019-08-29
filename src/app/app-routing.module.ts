import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { DetailsComponent } from './components/pages/details/details.component';
import { AddComponent } from './components/pages/add/add.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { AuthGuard } from './_guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:city', 
    component: DetailsComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'add', 
    component: AddComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'signup', 
    component: SignupComponent
  },
  {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
