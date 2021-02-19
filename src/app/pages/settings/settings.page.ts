import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  isDarkMode : boolean

  constructor() {
    const theme = document.body.getAttribute('color-theme')
    if(theme == 'dark')
      this.isDarkMode = true;
    else if(theme == 'light')
      this.isDarkMode = false;
  }

  ngOnInit() { }

  onDarkModeToggle(event) {
    if(event.detail.checked){
      this.isDarkMode = true;
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      this.isDarkMode = false;
      document.body.setAttribute('color-theme', 'light');
    }
  }
}
