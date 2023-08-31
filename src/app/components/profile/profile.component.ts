import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

  // users: any[] = [];
  // uid: string | undefined;
  userProfile: any;

  constructor(private authService: AuthService, private firestore: FirestoreService){}

  async ngOnInit() {
    // this.getUid()
    const currentUser = this.authService.getCurrentUser()
    if(currentUser) {
      this.firestore.getPerson(currentUser.uid).subscribe(personData =>{
        this.userProfile = personData
      })
    }
  }

  // async getUid() {
  //   const uid = await this.authService.getUid()
  //   if(uid){
  //     this.uid = uid
  //     alert(`Hola ID: ${uid}`)
  //   }
  // }

}