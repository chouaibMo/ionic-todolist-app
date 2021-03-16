import { map } from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {SettingService} from "../../services/setting/setting.service";
import {PickerController} from "@ionic/angular";
import {Settings} from "../../models/settings";
import '@capacitor-community/text-to-speech';
import {Plugins} from '@capacitor/core';
const { TextToSpeech } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  private settings : Settings
  private supportedVoices;
  private languages = []
  
  constructor(private settingService : SettingService,
              private pickerController: PickerController) {
  }

  ngOnInit() { 
    this.settingService.getSettings().subscribe(value => this.settings = value)
    TextToSpeech.getSupportedVoices().then(async result => {
      this.supportedVoices = result.voices
      await this.supportedVoices.map((voice,index) => {
        const text = voice.name+" ("+ voice.lang.split('-')[0].toUpperCase()+')'
        this.languages.push({text: text, value: index})
      })
    });
    
  }


  async onLanguageChange() {
    let options = {
      buttons: [
        {
          text:'ok',
          handler:(value:any) => {
            this.settings.speechLang = value.languages.text
            this.settings.speechLangId = value.languages.value
            this.settingService.setSettings(this.settings)

          }
        }
      ],
      columns:[{
        name:'languages',
        options: this.languages
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  /**
   * Enable/disable dark mode
   * @param event
   */
  onDarkModeToggle(event) {
    this.settings.darkMode = !!event.detail.checked
    this.settingService.setSettings(this.settings);

  }

  /**
   * Enable/disable push notif
   * @param event
   */
  onNotificationToggle(event) {
    this.settings.notification = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable delete confirmation
   * @param event
   */
  onConfirmDeleteToggle(event) {
    this.settings.confirmation = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable secure unlock
   * @param event
   */
  onSecureUnlockToggle(event) {
    this.settings.passcode = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable haptics
   * @param event
   */
  onHapticsToggle(event) {
    this.settings.haptics = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable vibrations
   * @param event
   */
  onVibrationsToggle(event) {
    this.settings.vibrations = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Change speech language
   * @param event
   */
  onSpeechLanguageChange(event) {
  }

  /**
   * Enable/disable text to speech
   * @param event
   */
  onSpeechToggle(event) {
    this.settings.textToSpeech = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Change speech speed
   * @param event
   */
  onRangeChange(event) {
    this.settings.speechVolume = event.detail.value
    this.settingService.setSettings(this.settings);
  }

}
