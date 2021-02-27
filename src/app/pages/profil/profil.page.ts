import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {ActionSheetController, AlertController} from "@ionic/angular";
import {Plugins, CameraResultType, CameraPhoto, CameraSource} from '@capacitor/core';
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/storage";
import firebase from "firebase";

import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

const { Camera } = Plugins;

@Component({
    selector: 'app-profil',
    templateUrl: './profil.page.html',
    styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

    private storageReference: AngularFireStorageReference | undefined;
    private captureDataUrl: string;


    constructor(private authService : AuthService,
               // private camera : Camera,
                private alertController: AlertController,
                private firebaseStorage: AngularFireStorage,
                private actionSheetController: ActionSheetController) { }

    ngOnInit() {}

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [
                {
                    text: 'Take photo',
                    handler: () => {
                        this.takePhoto();
                    }
                },
                {
                    text: 'Choose from library',
                    handler: () => {
                        //
                    }
                },
                {
                    text: 'Remove current photo',
                    role: 'destructive',
                    handler: () => {}
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => undefined
                }
            ]
        });
        await actionSheet.present();
    }


    public async takePhoto() {
        var capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        }).then(
            (capturedPhoto) => {
                console.log("photo taken :" + capturedPhoto.webPath);
                this.captureDataUrl = 'data:image/jpeg;base64,' + capturedPhoto;
            });
        console.log("1");
        const currentUserId = this.authService.getCurrentUser().uid;
        console.log("2");
        var storageRef = firebase.storage().ref();
        console.log("3");
        var photoRef = storageRef.child("profile/"+ currentUserId +"/profile_picture.jpg");
        console.log("4");

        photoRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then(
            (snapshot: UploadTaskSnapshot) => {
                console.log("5");
                this.presentAlert()
                this.captureDataUrl = ""
            },
            (err: Error) => {
                this.presentAlertError()
                console.log('Error during upload: ' + err.message);
            }
        );

    }

    async presentAlert() {
        const alert = await this.alertController.create({
            header: 'Uploaded',
            subHeader: 'Picture is uploaded to Firebase',
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentAlertError() {
        const alert = await this.alertController.create({
            header: 'Error',
            subHeader: 'failed to upload photo',
            buttons: ['OK']
        });

        await alert.present();
    }

}
