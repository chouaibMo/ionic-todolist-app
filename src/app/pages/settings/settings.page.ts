import { Component, OnInit } from '@angular/core';
import {SettingService} from "../../services/setting/setting.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  isDarkMode : boolean
  pushNotification : boolean
  confirmDeletion : boolean
  secureUnlock : boolean

  constructor(private settingService : SettingService) {
    this.settingService.getDarkModeValue().subscribe((value) => {
      this.isDarkMode = value;
    });

    this.settingService.getPushNotificationValue().subscribe((value) => {
      this.pushNotification = value;
    });

    this.settingService.getConfirmDeletionValue().subscribe((value) => {
      this.confirmDeletion = value;
    });

    this.settingService.getSecureUnlockValue().subscribe((value) => {
      this.secureUnlock = value;
    });

  }

  ngOnInit() { }

  onDarkModeToggle(event) {
    if(event.detail.checked){
      //this.isDarkMode = true;
      //document.body.setAttribute('color-theme', 'dark');
      this.settingService.setDarkModeValue(true);
    }
    else{
      //this.isDarkMode = false;
      //document.body.setAttribute('color-theme', 'light');
      this.settingService.setDarkModeValue(false);
    }
  }

  onNotificationToggle(event) {
    if(event.detail.checked)
      this.settingService.setPushNotificationValue(true);
    else
      this.settingService.setPushNotificationValue(false);
  }

  onConfirmDeleteToggle(event) {
    if(event.detail.checked)
      this.settingService.setConfirmDeletionValue(true);
    else
      this.settingService.setConfirmDeletionValue(false);
  }

  onSecureUnlockToggle(event) {
    if(event.detail.checked)
      this.settingService.setSecureUnlockValue(true);
    else
      this.settingService.setSecureUnlockValue(false);
  }
}
