import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';



const routes: Routes = [
  {path:'', component: AuthenticatedComponent, children: [
    {path:'dashboard', component: DashboardComponent},
    {path:'', redirectTo:'dashboard', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
