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