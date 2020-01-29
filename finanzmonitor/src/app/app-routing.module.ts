import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';



const routes: Routes = [
  {path:'', component: AuthenticatedComponent, children: [
    {path:'dashboard', component: DashboardComponent},
    {path:'', redirectTo:'dashboard', pathMatch: 'full'},
    {path:'profile', component: ProfileComponent},

  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
