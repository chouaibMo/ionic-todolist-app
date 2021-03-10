import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import {PasswordRecoveryComponent} from "../../modals/password-recovery/password-recovery.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoginPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [
      LoginPage,
      PasswordRecoveryComponent,
  ]
})
export class LoginPageModule {}
