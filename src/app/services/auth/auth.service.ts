import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import { MenuController, ModalController} from "@ionic/angular";
import {UiService} from "../ui/ui.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth,
              private modalController: ModalController,
              private menuCtrl: MenuController,
              private uiService: UiService,
              private router: Router) { }


  public createAccount(email: string, password: string) {
      this.fireAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.sendEmailVerification();
            this.uiService.presentToast( " Account created successfully.", "success", 3000)
            this.router.navigate(['/login'])
        })
        .catch((error) => {
            this.uiService.presentToast( error.message, "danger", 3000)
        });
  }


  public signWithEmail(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            if(userCredential.user.emailVerified){
                this.uiService.presentToast( "Connected successfully.", "success", 3000);
                this.router.navigate(['/home'])
            }else{
                this.uiService.presentToast( "Please verify your mail address.", "danger", 3000)
            }
        })
        .catch((error) => {
          this.uiService.presentToast( error.message, "danger", 3000)
        });
  }

  public signWithGoogle(){
    console.log('sign with Google')
  }

  public signWithApple(){
    console.log('sign with Apple')
  }

  public signWithFacebook(){
    console.log('sign with Facebook')
  }

  public resetPassword(email: string){
     this.fireAuth.sendPasswordResetEmail(email).then(
        () => {
            this.modalController.dismiss();
            this.uiService.presentToast("Reset email sent successfully.", "success", 4000);
        },
        error => {
            this.uiService.presentToast( "An error occurred, please try again.", "danger", 4000)
        });
  }

}
