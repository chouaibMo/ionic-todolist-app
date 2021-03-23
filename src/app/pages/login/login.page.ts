import { Component, OnInit } from '@angular/core';
import {MenuController, ModalController} from "@ionic/angular";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PasswordRecoveryComponent} from "../../modals/password-recovery/password-recovery.component";
import {AuthService} from "../../services/auth/auth.service";
import '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  dataForm: FormGroup;
  
  constructor(private modalController: ModalController,
              private menuCtrl: MenuController,
              private formBuilder: FormBuilder,
              public authService: AuthService) {

    this.dataForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
                                    Validators.required,
                                    Validators.minLength(6)
      ])),
      email: new FormControl('', Validators.compose([
                                 Validators.required,
                                 Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]))
    });
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    this.menuCtrl.enable(false); 
  }

  signWithEmail(){
    this.authService.signWithEmail(this.dataForm.get('email').value, this.dataForm.get('password').value)
    this.dataForm.reset()
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
