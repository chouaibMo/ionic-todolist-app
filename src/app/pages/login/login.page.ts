import { Component, OnInit } from '@angular/core';
import {IonRouterOutlet, MenuController, ModalController} from "@ionic/angular";
import {PasswordRecoveryComponent} from "../../modals/password-recovery/password-recovery.component";
import {AuthService} from "../../services/auth/auth.service";
import '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  dataUser = {
    email: '',
    password: '',
  }
  
  constructor(private routerOutlet: IonRouterOutlet,
              private modalController: ModalController,
              private menuCtrl: MenuController,
              public authService: AuthService) {

  }

  ngOnInit() {  this.routerOutlet.swipeGesture = false; }
  ionViewWillEnter() { this.menuCtrl.enable(false); }
  ionViewWillLeave() { this.menuCtrl.enable(true); }

  signWithEmail(){
    this.authService.signWithEmail(this.dataUser.email, this.dataUser.password)
    this.dataUser.email = ''
    this.dataUser.password = ''
  }

  async passwordRecoveryModal() {
    const modal = await this.modalController.create({
      component: PasswordRecoveryComponent,
    });
    return await modal.present();
  }

  signinWithFacebook(){

  }

}
