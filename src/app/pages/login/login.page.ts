import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
