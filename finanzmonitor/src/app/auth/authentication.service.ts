import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private angularFireAuth: AngularFireAuth
  ) {
  }

  /**
   * Gets the image of the user provided by Firebase Authentication.
   * The users profile photo url has nothing to do with this method
   * because the authentication.service.ts should know nothing about profiles.
   * A disadvantage of the returned photoURL is that the user cannot change it.
   * For a customizable photoURL, use the profile.service.ts.
   */
  getPhotoUrlOfCurrentUserProvidedByFirebaseAuth$(): Observable<string> {
    return this.angularFireAuth.authState.pipe(
      map(user => user ? user.photoURL : '')
    );
  }

  getIdOfCurrentUser$(): Observable<string> {
    return this.angularFireAuth.authState.pipe(
      map(user => user ? user.uid : '')
    );
  }

  getIsUserAuthenticated$(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      map(user => !!user)
    );
  }

  logout(): Promise<void> {
    return this.angularFireAuth.auth.signOut();
  }
}