import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

  users: any[] = [];
  uid: string | undefined;

  constructor(private authService: AuthService, private firestore: FirestoreService){}

  async ngOnInit() {
    this.getUid()
    this.users = await this.firestore.getUsers();
  }

  async getUid() {
    const uid = await this.authService.getUid()
    if(uid){
      this.uid = uid
      alert(`Hola ID: ${uid}`)
    }
  }

}