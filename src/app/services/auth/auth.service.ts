import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {ModalController, AlertController, LoadingController, NavController, Platform} from "@ionic/angular";
import {UiService} from "../ui/ui.service";
import {Router} from "@angular/router";
import {Plugins} from "@capacitor/core";
import '@codetrix-studio/capacitor-google-auth';
import firebase from "firebase";
import User = firebase.User;
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public usersCollection: AngularFirestoreCollection<any>
    private user : User;

    constructor(public afs: AngularFirestore,
                public fireAuth: AngularFireAuth,
                private navController: NavController,
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

    /**
     * Sign up with email & password using firebase
     * @param name user's full name
     * @param email user's email
     * @param password user's password
     */
    public async createAccount(name: string, email: string, password: string) {
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                loading.dismiss()
                userCredential.user.sendEmailVerification();
                if(userCredential.additionalUserInfo.isNewUser){
                    this.usersCollection.doc(userCredential.user.email).set({
                        username: name,
                        email: email,
                        photo: '',
                    })
                }  
                await userCredential.user.updateProfile({
                    displayName: name
                  })
                this.fireAuth.signOut()
                this.uiService.presentToast( " Account created successfully.", "success", 3000)
                this.navController.navigateBack('login')
            })
            .catch((error) => {
                loading.dismiss()
                this.uiService.presentToast( error.message, "danger", 3000)
            })
    }


    /**
     * Sign in with email & password using firebase
     * @param email user's email
     * @param password user's password
     */
    public async signWithEmail(email: string, password: string) {
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        this.fireAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
            loading.dismiss()
            if(userCredential.user.emailVerified){
                this.uiService.presentToast( "Connected successfully.", "success", 3000);
                this.router.navigate(['/home'])
            }else{
                this.fireAuth.signOut()     
                this.uiService.presentToast( "Please verify your mail address.", "danger", 3000)
            }
        })
        .catch((error) => {
            loading.dismiss()
            this.uiService.presentToast( error.message, "danger", 3000)
        });
    }


    /**
     * Login with Google
     */
    async signWithGoogle(){
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        let googleUser = await Plugins.GoogleAuth.signIn() as any
        const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        await this.fireAuth.signInWithCredential(credential).then((userCredential) => {
            if(userCredential.additionalUserInfo.isNewUser){
                this.usersCollection.doc(userCredential.user.email).set({
                    username: userCredential.user.displayName,
                    email: userCredential.user.email,
                    photo: userCredential.user.photoURL,
                })
            } 
            loading.dismiss()
            this.uiService.presentToast( "Connected successfully.", "success", 3000);
            this.router.navigate(['/home'])
        })
        .catch((error) => {
            loading.dismiss()
            this.uiService.presentToast( error.message, "danger", 3000)
        });
    }

    /**
     * Login with Facebook : first of all, we use FacebookLogin to signin
     * then we use the access token as a credential to signin using firebase
     */
    public async signWithFacebook(){
        const loading = await this.loadingController.create({ message: 'Please wait...'})
        const result =  await Plugins.FacebookLogin.login({ permissions: ['email', 'public_profile'] })

        if (result && result.accessToken) {
            await loading.present()
            var credential = firebase.auth.FacebookAuthProvider.credential(result.accessToken.token)
            this.fireAuth.signInWithCredential(credential).then(async (userCredential) => {
                await userCredential.user.updateProfile({
                    photoURL: userCredential.user.photoURL + '?type=large&access_token=' + environment.fbAccessToken
                })
                if(userCredential.additionalUserInfo.isNewUser){
                    this.usersCollection.doc(userCredential.user.email).set({
                        username: userCredential.user.displayName,
                        email: userCredential.user.email,
                        photo: userCredential.user.photoURL,
                    })
                }
                loading.dismiss()
                this.uiService.presentToast( "Connected successfully.", "success", 3000);
                this.router.navigate(['/home'])
            })
            .catch((error) => {
                loading.dismiss()
                this.uiService.presentToast( error.message, "danger", 3000)
            })
        }      
    }

    /**
     * Login with Apple 
     */
    public async signWithApple(){
        const alert = await this.alertCtrl.create({
            header: 'Coming soon 🚧',
            message: 'This feature will be provided soon',
            buttons: ['OK']
            });
        await alert.present();
    }

    /**
     * Reset user passwork
     * @param email user email
     */
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

    /**
     * Log out
     */
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

    /**
     * the current state of the user
     * @returns a User object
     */
    public getCurrentUser(){
        return this.user
    }

    /**
     * Get user's data from firestore
     * @param email : user's email
     * @returns 
     */
    public getOne(email: string) : Observable<any>{
        return this.usersCollection.doc(email).snapshotChanges().pipe(
            map(value => this.singleMapper<any>(value))
        );
    }

    private singleMapper<T>(actions) {
        const data = actions.payload.data();
        const id = actions.payload.id;
        return { id, ...data} as T;
    }
}
