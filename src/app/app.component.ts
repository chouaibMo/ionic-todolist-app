import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from "./services/auth/auth.service";
import { Plugins } from '@capacitor/core';
import {UiService} from "./services/ui/ui.service";
const { Browser, Network } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private uiService: UiService,
              private authService : AuthService) {

    this.initializeApp();
    Network.addListener('networkStatusChange', (status) => {
      if(status.connected)
        this.uiService.presentToast('Network connection established sucessfully', 'success',5000)
      else
        this.uiService.presentToast('The network connection was lost', 'danger',5000)
    })
  }

  initializeApp() {
    document.body.setAttribute('color-theme', 'dark');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){
    this.authService.logout();
  }

  async openBrowser(url : string) {
    await Browser.open({ url: url });
  }
}
