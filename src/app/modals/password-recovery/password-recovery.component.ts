import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
  email: string

  constructor(private authService: AuthService,
              private modalController: ModalController
              ) {}

  ngOnInit() {}

  resetPassword(){
    this.authService.resetPassword(this.email)
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
