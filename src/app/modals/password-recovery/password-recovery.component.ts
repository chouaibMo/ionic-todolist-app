import { Component, OnInit } from '@angular/core';
import {ListService} from "../../services/list.service";
import {ModalController, ToastController} from "@ionic/angular";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
  email: string

  constructor(private fireAuth: AngularFireAuth,
              private listService: ListService,
              private modalController: ModalController,
              private toastController: ToastController) {}

  ngOnInit() {}

  onSubmit(){
    this.fireAuth.sendPasswordResetEmail(this.email).then(
        () => {
          this.modalController.dismiss();
          this.presentToast("Reset email sent successfully.", "success", 4000);

        },
        error => {
          this.presentToast( "An error occurred, please try again.", "danger", 4000)
        });
  }

  dismissModal() {
    this.modalController.dismiss();
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
