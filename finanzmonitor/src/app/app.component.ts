import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'finanzmonitor';
  items: Observable<any[]>;
  db: AngularFirestore;

  constructor(db: AngularFirestore,public afAuth: AngularFireAuth, public authService: AuthService) {
    this.items = db.collection('User').valueChanges();
    this.db = db;
  }  
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  getCurrentUser(){
    return this.afAuth.auth.currentUser;
  }
}
