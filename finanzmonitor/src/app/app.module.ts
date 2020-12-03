import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatSelectModule} from '@angular/material/select'; 
import {ReactiveFormsModule} from '@angular/forms'
import { ChartsModule } from 'ng2-charts';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {NgxChartsModule} from '@swimlane/ngx-charts';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthService } from './auth/auth.service';
import { RegisterComponent } from './auth/register/register/register.component';
import { Database } from 'src/database/database';


@NgModule({
  declarations: [
    AppComponent,
    AuthenticatedComponent,
    DashboardComponent,
    AuthComponent,
    ProfileComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgxChartsModule,
  ],
  providers: [AuthService, Database, DashboardComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
