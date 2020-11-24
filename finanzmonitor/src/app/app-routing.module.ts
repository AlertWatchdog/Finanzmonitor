import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthService } from './auth/auth.service';
import { AuthComponent } from './auth/auth.component';
import { Observable } from 'rxjs';

const routes: Routes = [
  {path:'', component: AuthenticatedComponent, children: [
    {path:'dashboard', component: DashboardComponent},
    {path:'', redirectTo:'dashboard', pathMatch: 'full'},
    {path:'profile', component: ProfileComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }