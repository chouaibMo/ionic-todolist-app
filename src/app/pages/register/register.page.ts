import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  dataUser = {
      email: '',
      password: '',
  }

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private toastController: ToastController) { }

  ngOnInit() {
  }

  createAccount(){
    this.fireAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
        .then((userCredential) => {
          var user = userCredential.user;
          this.router.navigate(['/home'])
          this.presentToast( user.email + " created successfully.", "success", 3000)
        })
        .catch((error) => {
          this.presentToast( error.message, "danger", 3000)
        });
    this.dataUser.email = ''
    this.dataUser.password = ''
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
