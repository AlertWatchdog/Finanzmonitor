import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  ui: firebaseui.auth.AuthUI;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    const uiConfig = {
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: this
          .onLoginSuccessful
          .bind(this)
      },
    };

    // Initialize the FirebaseUI Widget using Firebase.
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    this.ui.start('#firebase-auth-container', uiConfig);
  }

  ngOnDestroy(): void {
    this.ui.delete();
  }

  onLoginSuccessful() {
    this.ngZone.run(() => this.router.navigateByUrl('/'));
  }
}
