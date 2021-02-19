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

    this.settingService.getDeleteConfirmationValue().subscribe((value) => {
      this.confirmDeletion = value;
    });

    this.settingService.getSecureUnlockValue().subscribe((value) => {
      this.secureUnlock = value;
    });

  }

  ngOnInit() { }

  onDarkModeToggle(event) {
    if(event.detail.checked)
      this.settingService.setDarkModeValue(true);
    else
      this.settingService.setDarkModeValue(false);
  }

  onNotificationToggle(event) {
    if(event.detail.checked)
      this.settingService.setPushNotificationValue(true);
    else
      this.settingService.setPushNotificationValue(false);
  }

  onConfirmDeleteToggle(event) {
    if(event.detail.checked)
      this.settingService.setDeleteConfirmationValue(true);
    else
      this.settingService.setDeleteConfirmationValue(false);
  }

  onSecureUnlockToggle(event) {
    if(event.detail.checked)
      this.settingService.setSecureUnlockValue(true);
    else
      this.settingService.setSecureUnlockValue(false);
  }
}
