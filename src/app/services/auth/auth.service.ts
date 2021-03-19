import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {ModalController, AlertController, LoadingController} from "@ionic/angular";
import {UiService} from "../ui/ui.service";
import {Router} from "@angular/router";
import {Plugins} from "@capacitor/core";
import '@codetrix-studio/capacitor-google-auth';
import firebase from "firebase";
import User = firebase.User;


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public usersCollection: AngularFirestoreCollection<any>
    private user : User;

    constructor(public afs: AngularFirestore,
                public fireAuth: AngularFireAuth,
                private modalController: ModalController,
                private loadingController: LoadingController,
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

    public async createAccount(username: string, email: string, password: string) {
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                loading.dismiss()
                userCredential.user.sendEmailVerification();
                this.uiService.presentToast( " Account created successfully.", "success", 3000)
                this.router.navigate(['/login'])
                this.usersCollection.doc().set({
                    username: username,
                    email: email,
                });

            })
            .catch((error) => {
                loading.dismiss()
                //loading.onDidDismiss();
                this.uiService.presentToast( error.message, "danger", 3000)
            }).then()
    }


    public async signWithEmail(email: string, password: string) {
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        this.fireAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
            loading.dismiss()
            //if(userCredential.user.emailVerified){
            this.uiService.presentToast( "Connected successfully.", "success", 3000);
            this.router.navigate(['/home'])
            //}else{
            //this.uiService.presentToast( "Please verify your mail address.", "danger", 3000)
            //}
        })
            .catch((error) => {
                loading.dismiss()
                this.uiService.presentToast( error.message, "danger", 3000)
            });
    }


    async signWithGoogle(){
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        let googleUser = await Plugins.GoogleAuth.signIn() as any;
        const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        await this.fireAuth.signInWithCredential(credential).then(() =>{
            loading.dismiss()
        });
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

    public async resetPassword(email: string){
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        this.fireAuth.sendPasswordResetEmail(email).then(
            async () => {
                await loading.dismiss()
                this.modalController.dismiss();
                this.uiService.presentToast("Reset email sent successfully.", "success", 4000);
            },
            async error => {
                await loading.dismiss()
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
