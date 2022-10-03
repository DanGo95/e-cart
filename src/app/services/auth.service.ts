import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interfaces/user';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: string;

  constructor( private auth: AngularFireAuth ) {
    this.auth.authState.subscribe( user => {
      if (!user) { return; }
      this.user = user.uid;
    });
  }

  login( user: User ) {
    return from(this.auth.signInWithEmailAndPassword( user.email, user.password ));
  }

  register( user: User ) {
    return from(this.auth.createUserWithEmailAndPassword( user.email, user.password ));
  }

  logout() {
    this.user = '';
    return this.auth.signOut();
  }
}
