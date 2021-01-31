import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {UiService} from "../../services/ui/ui.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  dataUser = {
      username:'',
      email: '',
      password: '',
  }

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private uiService: UiService,) { }

  ngOnInit() {
  }

  createAccount(){
    this.fireAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
        .then((userCredential) => {
          var user = userCredential.user;
          user.sendEmailVerification();
          this.router.navigate(['/login'])
          this.uiService.presentToast( " Account created successfully.", "success", 3000)
        })
        .catch((error) => {
            this.uiService.presentToast( error.message, "danger", 3000)
        });
    this.dataUser.email = ''
    this.dataUser.password = ''
  }

}
