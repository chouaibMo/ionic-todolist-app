import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {UiService} from "../../services/ui/ui.service";
import { MenuController } from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  dataForm: FormGroup;

  constructor(private authService: AuthService,
              private menuCtrl: MenuController,
              private formBuilder: FormBuilder,
              private uiService: UiService) {

      this.dataForm = this.formBuilder.group({
          fullName: new FormControl('', Validators.compose([
              Validators.required,
              Validators.pattern("^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$")
          ])),
          password: new FormControl('', Validators.compose([
              Validators.maxLength(25),
              Validators.minLength(6),
              Validators.required
          ])),
          confirmPassword: new FormControl('', Validators.compose([
              Validators.maxLength(25),
              Validators.minLength(6),
              Validators.required
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

    /**
     * Check whether passwords provided by the user are the same
     */
    checkPasswords() {
        let pass = this.dataForm.get('password').value;
        let confirmPass = this.dataForm.get('confirmPassword').value;
        return pass === confirmPass ? null : { notSame: true }
    }

    createAccount(){
        if(this.dataForm.get('password').value === this.dataForm.get('confirmPassword').value){
            this.authService.createAccount(this.dataForm.get('fullName').value,
                                           this.dataForm.get('email').value,
                                           this.dataForm.get('password').value)
        }
        else {
            this.uiService.presentToast( "password and confirmation should be the same", "danger", 3000)
        }
        this.dataForm.reset()
    }

}
