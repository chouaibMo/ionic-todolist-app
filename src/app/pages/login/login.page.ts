import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isConnected : boolean
  dataUser = {
    email: '',
    password: '',
  }
  
  constructor(private fireAuth: AngularFireAuth, private router: Router, private toastController: ToastController) {
    this.fireAuth.authState.subscribe(auth => {
      if(auth){
        this.isConnected = true;
        //this.router.navigate(['/home'])
      }else {
        this.isConnected = false;

      }
    })
  }

  ngOnInit() {
  }


  signWithEmail(){
    this.fireAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
        .then((userCredential) => {
            var user = userCredential.user;
            this.presentToast( user.email + " Connected", "success", 3000)
            this.router.navigate(['/home'])
        })
        .catch((error) => {
            this.presentToast( error.message, "danger", 3000)
        });
    this.dataUser.email = ''
    this.dataUser.password = ''
  }

  signWithGoogle(){
    console.log('sign with Google')
  }

  signWithApple(){
    console.log('sign with Apple')
  }

  signWithFacebook(){
    console.log('sign with Facebook')
  }

  async presentToast(message : string, color: string, duration : number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.color = color
    toast.present();
  }

}
