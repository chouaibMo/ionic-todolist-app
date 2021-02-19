import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  darkMode : BehaviorSubject<boolean>;
  secureUnlock : BehaviorSubject<boolean>;
  confirmDeletion : BehaviorSubject<boolean>;
  pushNotification : BehaviorSubject<boolean>;

  constructor() {
    const theme = document.body.getAttribute('color-theme')
    console.log("initial theme : "+ theme)
    if(theme == 'dark')
      this.darkMode = new BehaviorSubject<boolean>(true);
    else if(theme == 'light')
      this.darkMode = new BehaviorSubject<boolean>(false);

    this.confirmDeletion = new BehaviorSubject<boolean>(false);
    this.pushNotification = new BehaviorSubject<boolean>(false);
    this.secureUnlock = new BehaviorSubject<boolean>(false);
  }

  // SETTERS :

  setDarkModeValue(newValue): void {
    this.darkMode.next(newValue);
    if (newValue)
      document.body.setAttribute('color-theme', 'dark');
    else
      document.body.setAttribute('color-theme', 'light');
  }

  setConfirmDeletionValue(newValue): void {
    this.confirmDeletion.next(newValue);
  }

  setPushNotificationValue(newValue): void {
    this.pushNotification.next(newValue);
  }

  setSecureUnlockValue(newValue): void {
    this.secureUnlock.next(newValue);
  }

  // GETTERS :

  getDarkModeValue(): Observable<boolean> {
    return this.darkMode.asObservable();
  }

  getConfirmDeletionValue(): Observable<boolean> {
    return this.confirmDeletion.asObservable();
  }

  getPushNotificationValue(): Observable<boolean> {
    return this.pushNotification.asObservable();
  }

  getSecureUnlockValue(): Observable<boolean> {
    return this.secureUnlock.asObservable();
  }

}