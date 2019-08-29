import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UiService } from '../ui/ui.service';
import { take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FbService {
  private user: Observable<firebase.User>;

  constructor(
    private _firebaseAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private uiService: UiService,
    private route: Router
  ) {

      this.user = _firebaseAuth.authState;
      this.updateLoginStatus();
  }

  updateLoginStatus() {
    if (!this.getUidFromLocalStore()) {
      this.user.pipe(take(1)).subscribe(
        user => (user) && this.updateLocalStore(user.uid)
      );
    }
    else this.uiService.isLoggedIn.next(true);
  }

  getUidFromLocalStore() {
    return localStorage.getItem('uid');
  }

  updateLocalStore(uid: string) {
    localStorage.setItem('uid', uid);
  }

  isAuthenticated() {
    if(this.getUidFromLocalStore()) return true;
    else return false;
  }

  getAuthState() {
    return this.user;
  }

  async signIn(email: string, pass: string) {
    return await this._firebaseAuth.auth
      .signInWithEmailAndPassword(email, pass)
      .then(user => this.updateLocalStore(user.user.uid));
  }

  async signUp(email: string, pass: string) {
    return await this._firebaseAuth.auth
      .createUserWithEmailAndPassword(email, pass)
      .then(user => {
        this.updateLocalStore(user.user.uid);
        this.route.navigateByUrl('')
      });
  }

  async signInWithFacebook() {
    return await this._firebaseAuth.auth.signInWithPopup(
      new auth.FacebookAuthProvider())
        .then(
          user => {
          this.updateLocalStore(user.user.uid);
          this.route.navigateByUrl('')
        })
        .catch(err => console.error(err));
  }

  async signInWithGoogle() {
   return await this._firebaseAuth.auth.signInWithPopup(
     new auth.GoogleAuthProvider())
       .then(
         user => {
          this.updateLocalStore(user.user.uid);
          this.route.navigateByUrl('')
        })
        .catch(err => console.error(err));


  }

  signOut() {
    localStorage.removeItem('uid');
    return this._firebaseAuth.auth.signOut();
  }

  userData() {
    return this.getAuthState();
  }

  getCities(uid: string) {
    return this.firestore.collection(uid).valueChanges();
  }

  removeCity(city: string) {
    const uid = this.getUidFromLocalStore();
    this.handleDeleteRequest(uid, city) 
  }

  handleDeleteRequest(uid: string, name: string) {
    this.firestore.collection(uid)
      .doc(name)
      .delete()
      .catch(error => console.error("Error removing document: ", error));
  }

  addCity(city: string) {
    const data = { city, added: new Date() };
    return this.getAuthState().pipe(
      take(1),
      switchMap(user => {
        return this.firestore
          .collection(user.uid)
          .doc(city)
          .set(data);
      })
    );
  }
}
