import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from "@angular/router";
import {IonRouterOutlet, MenuController, ModalController} from "@ionic/angular";
import {PasswordRecoveryComponent} from "../../modals/password-recovery/password-recovery.component";
import {UiService} from "../../services/ui/ui.service";

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
              private uiService: UiService,
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
              this.uiService.presentToast( user.email + " connected successfully.", "success", 3000)
              this.router.navigate(['/home'])
            }
            else{
              this.uiService.presentToast( "Please verify your mail address.", "danger", 3000)

            }
        })
        .catch((error) => {
          this.uiService.presentToast( error.message, "danger", 3000)
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

  async passwordRecoveryModal() {
    const modal = await this.modalController.create({
      component: PasswordRecoveryComponent,
    });
    return await modal.present();
  }

}
