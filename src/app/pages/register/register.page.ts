import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  dataUser = {
      username:'',
      email: '',
      password: '',
  }

  constructor(private authService: AuthService) { }


  ngOnInit() {}

  createAccount(){
    this.authService.createAccount(this.dataUser.email, this.dataUser.password)
    this.dataUser.email = ''
    this.dataUser.password = ''
  }

}
