import { UserService } from './../user/user.service';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { UiService } from './../ui/ui.service';
import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/core';
import {AngularFireStorage,} from "@angular/fire/storage";
import firebase from "firebase";
import { AuthService } from '../auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { UserData } from 'src/app/models/userData';
const { Camera } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private uiService: UiService,
              private authService : AuthService,
              private userService: UserService,
              private loadingController: LoadingController,
              private fireStorage: AngularFireStorage) { }


  /**
   * Take a photo using device camera
   * and upload it to firebase storage
   */
  public async takePhoto(source : CameraSource) {
    try {
      var capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          allowEditing: true,
          quality: 90
      })
      this.uploadPhoto(capturedPhoto)
    } 
    catch (error){
      this.uiService.presentToast( "Failed to upload photo.", "danger", 3000)
      console.error(error);
    }
  } 
  
  public async removePhoto(){
    firebase.auth().currentUser.updateProfile({
      photoURL: 'https://images.assetsdelivery.com/compings_v2/2nix/2nix1408/2nix140800145.jpg'
    })
    .then(() => {
      const name = this.authService.getCurrentUser().displayName
      const email = this.authService.getCurrentUser().email
      const url = this.authService.getCurrentUser().photoURL
      this.userService.update(new UserData(name, email, url))
    })
  }

 /**
  * Upload a photo to the user's fire storage ref
  * then update user's data (photoURL) in firestore
  */
 async uploadPhoto(photo: CameraPhoto){
  const loading = await this.loadingController.create({ message: 'Please wait...'});
  await loading.present()
  var photoRef = this.fireStorage.ref('profile/'+ this.authService.getCurrentUser().uid +'/profile_picture.jpg');
  photoRef.putString(photo.base64String, 'base64', {contentType:'image/jpg'})
    .then((snapshot) =>{
      snapshot.ref.getDownloadURL().then(url => {
        firebase.auth().currentUser.updateProfile({
          photoURL: url
        })
      }).then(() => {
        const name = this.authService.getCurrentUser().displayName
        const email = this.authService.getCurrentUser().email
        const url = this.authService.getCurrentUser().photoURL
        this.userService.update(new UserData(name, email, url))
      }) 
      .catch((error) => {
        loading.dismiss()
        this.uiService.presentToast( error, "danger", 3000)
      })                                                 
      loading.dismiss()
      this.uiService.presentToast( "Photo uploaded successfully.", "success", 3000)
    })
    .catch((error) => {
      loading.dismiss()
      this.uiService.presentToast( error, "danger", 3000)
      console.error(error);
  })
 }

}
