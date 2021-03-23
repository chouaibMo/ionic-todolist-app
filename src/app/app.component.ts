import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import {AuthService} from "./services/auth/auth.service";
import {UiService} from "./services/ui/ui.service";
import { Plugins, registerWebPlugin, StatusBarStyle } from '@capacitor/core';
import { FacebookLogin } from '@capacitor-community/facebook-login';
const { StatusBar, SplashScreen, Share, Browser, Network } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private platform: Platform,
              private uiService: UiService,
              private authService : AuthService) {

    this.initializeApp();
    registerWebPlugin(FacebookLogin);
    
    Network.addListener('networkStatusChange', (status) => {
      if(status.connected)
        this.uiService.presentToast('Network connection established sucessfully', 'success',5000)
      else
        this.uiService.presentToast('The network connection was lost', 'danger',5000)
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setStyle({style: (document.body.getAttribute('color-theme') === 'dark') ? StatusBarStyle.Dark : StatusBarStyle.Light});
      StatusBar.setOverlaysWebView({overlay: true});
      SplashScreen.hide();
    });
  }

  logout(){
    this.authService.logout();
  }

  async openBrowser(url : string) {
    await Browser.open({ url: url });
  }

  async shareToApps(){
    let share = await Share.share({
      title: 'Firetask : a shared todolist app',
      text: 'Really awesome app you need to see right now',
      url: 'https://github.com/chouaibMo/ionic-todolist-app',
      dialogTitle: 'Share with buddies'
    });
  }
}
