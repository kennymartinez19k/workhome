import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, where, getDocs, query } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';
import {Observable, from, map} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AuthService, private firestore: Firestore) {}

  async addUser({username, email, role}: any): Promise<void> {
    const user = await this.auth.getUserUid()
    if(user) {
      const userRef = collection(this.firestore, 'usuarios')
      const userData = {
        uid: user,
        username, email,
        role: 'usuario'
      }
      await addDoc(userRef, userData)
    }
  }
  getUser(): Observable<User[]> {
    const q = query(
      collection(this.firestore, 'usuarios'),
      where('uid', '==', this.auth.getCurrentUser()?.uid)
    );
  
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const usuario: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as User;
          usuario.push(data);
        });
        return usuario;
      })
    );
  }
}
