import { CameraService } from './../../services/camera/camera.service';
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {CameraSource} from '@capacitor/core';
import { UpdateProfilComponent } from 'src/app/modals/update-profil/update-profil.component';
import { UserData } from 'src/app/models/userData';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.page.html',
    styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

    private ownerData : UserData

    constructor(private authService: AuthService,
                private userService: UserService,
                private cameraService: CameraService,
                private modalController: ModalController,
                private actionSheetController: ActionSheetController) { }

    
    ngOnInit() {
        this.ownerData = this.userService.getUserByEmail(this.authService.getCurrentUser().email)
    }

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

   /**
    * Show a modal for profile updating
    */
    async updateModal() {
    const modal = await this.modalController.create({
        component: UpdateProfilComponent,
        componentProps: {}
    });
    return await modal.present();
    } 

}
