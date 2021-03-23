import { UiService } from './../../services/ui/ui.service';
import { AuthService } from './../../services/auth/auth.service';
import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import firebase from "firebase";
import { UserData } from 'src/app/models/userData';

@Component({
  selector: 'app-update-profil',
  templateUrl: './update-profil.component.html',
  styleUrls: ['./update-profil.component.scss'],
})
export class UpdateProfilComponent implements OnInit {
  dataForm: FormGroup;

  constructor(private uiService: UiService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private modalController: ModalController) {

  this.dataForm = this.formBuilder.group({
    firstName: new FormControl('', Validators.compose([
                                   Validators.required,
    ])),
    lastName: new FormControl('', Validators.compose([
                                  Validators.required
    ])),
    phone: new FormControl('', Validators.compose([
                               Validators.minLength(10),
                               Validators.maxLength(18),
                               Validators.pattern("[- +()0-9]+")
    ])),
  });
  }

  ngOnInit() {}

 /** 
  * 
  */
  onSubmit(){
    const firstName = this.dataForm.get('firstName').value;
    const lastName = this.dataForm.get('lastName').value;
    const phone = this.dataForm.get('phone').value;
    console.log(phone)
    firebase.auth().currentUser.updateProfile({
      displayName: (firstName + " " + lastName)
    })
    .then(() => {
      const name = this.authService.getCurrentUser().displayName
      const email = this.authService.getCurrentUser().email
      const url = this.authService.getCurrentUser().photoURL
      var user = new UserData(name, email, url)
      if(phone)
        user.phone = phone
      this.userService.update(user)
      this.dismissModal()
    })
    .catch((error) => {
      this.uiService.presentToast( error.message, "danger", 3000)
    })

  }

 /**
  * 
  */
  dismissModal() {
    this.modalController.dismiss();
  }

}
