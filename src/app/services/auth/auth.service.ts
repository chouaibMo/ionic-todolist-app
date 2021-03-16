import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import { MenuController, ModalController} from "@ionic/angular";
import {UiService} from "../ui/ui.service";
import {Router} from "@angular/router";
import {Plugins} from "@capacitor/core";
import '@codetrix-studio/capacitor-google-auth';
import firebase from "firebase";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import User = firebase.User;

import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public usersCollection: AngularFirestoreCollection<any>
    private user : User;

    constructor(public afs: AngularFirestore,
                public fireAuth: AngularFireAuth,
                private modalController: ModalController,
                private menuCtrl: MenuController,
                private uiService: UiService,
                private alertCtrl : AlertController,
                private router: Router) {

        this.usersCollection = this.afs.collection<any>('users');
        this.authStatusListener()
    }


    authStatusListener(){
        this.fireAuth.onAuthStateChanged((credential)=>{
            if(credential)
                this.user = credential
            else
                this.user = null
        })
    }

    public createAccount(username: string, email: string, password: string) {
        this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                userCredential.user.sendEmailVerification();
                this.uiService.presentToast( " Account created successfully.", "success", 3000)
                this.router.navigate(['/login'])
                this.usersCollection.doc().set({
                    username: username,
                    email: email,
                });

            })
            .catch((error) => {
                this.uiService.presentToast( error.message, "danger", 3000)
            });
    }


    public signWithEmail(email: string, password: string) {
        this.fireAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
            //if(userCredential.user.emailVerified){
            this.uiService.presentToast( "Connected successfully.", "success", 3000);
            this.router.navigate(['/home'])
            //}else{
            //this.uiService.presentToast( "Please verify your mail address.", "danger", 3000)
            //}
        })
            .catch((error) => {
                this.uiService.presentToast( error.message, "danger", 3000)
            });
    }


    async signWithGoogle(){
        let googleUser = await Plugins.GoogleAuth.signIn() as any;
        const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        await this.fireAuth.signInWithCredential(credential);
        this.uiService.presentToast( "Connected successfully.", "success", 3000);
        this.router.navigate(['/home'])
    }

    public async signWithApple(){
        const alert = await this.alertCtrl.create({
            header: 'Coming soon 🚧',
            message: 'This feature will be provided soon',
            buttons: ['OK']
          });
          await alert.present();
    }

    public async signWithFacebook(){
        const alert = await this.alertCtrl.create({
            header: 'Coming soon 🚧',
            message: 'This feature will be provided soon',
            buttons: ['OK']
          });
          await alert.present();
    }

    public resetPassword(email: string){
        this.fireAuth.sendPasswordResetEmail(email).then(
            () => {
                this.modalController.dismiss();
                this.uiService.presentToast("Reset email sent successfully.", "success", 4000);
            },
            error => {
                this.uiService.presentToast( "An error occurred, please try again.", "danger", 4000)
            });
    }

    public logout() {
        this.fireAuth.signOut().then(
            () => {
                this.uiService.presentToast( "Logged out successfully.", "success", 3000);
                this.router.navigate(['/login'])
            },
            error => {
                this.uiService.presentToast( "An error occurred, please try again.", "danger", 4000)
            });
    }

    public getCurrentUser(){
        return this.user
    }
}
