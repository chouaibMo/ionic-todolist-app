import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from "@angular/router";
import {IonRouterOutlet, MenuController, ModalController, ToastController} from "@ionic/angular";
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import {PasswordRecoveryComponent} from "../../modals/password-recovery/password-recovery.component";

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
  
  constructor(private fireAuth: AngularFireAuth,
              private routerOutlet: IonRouterOutlet,
              private modalController: ModalController,
              private menuCtrl: MenuController,
              private toastController: ToastController,
              private router: Router) {
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
    this.routerOutlet.swipeGesture = false;

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  signWithEmail(){
    this.fireAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
        .then((userCredential) => {
            var user = userCredential.user;
            //if(user.emailVerified){
            if(true){
              this.presentToast( user.email + " connected successfully.", "success", 3000)
              this.router.navigate(['/home'])
            }
            else{
              this.presentToast( "Please verify your mail address.", "danger", 3000)

            }
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

  async passwordRecoveryModal() {
    const modal = await this.modalController.create({
      component: PasswordRecoveryComponent,
    });
    return await modal.present();
  }

}
