import { CameraService } from './../../services/camera/camera.service';
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {ActionSheetController, AlertController} from "@ionic/angular";
import {CameraSource} from '@capacitor/core';
import { AngularFireStorageReference} from "@angular/fire/storage";
import firebase from "firebase";
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

@Component({
    selector: 'app-profil',
    templateUrl: './profil.page.html',
    styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {


    constructor(private authService: AuthService,
                private cameraService: CameraService,
                private actionSheetController: ActionSheetController) { }

    
    ngOnInit() {}

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [
                {
                    text: 'Take photo',
                    handler: () => {
                        this.cameraService.takePhoto(CameraSource.Camera);
                    }
                },
                {
                    text: 'Choose from library',
                    handler: () => {
                        this.cameraService.takePhoto(CameraSource.Photos);
                    }
                },
                {
                    text: 'Remove current photo',
                    role: 'destructive',
                    handler: () => {
                        this.cameraService.removePhoto()
                    }
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
}
