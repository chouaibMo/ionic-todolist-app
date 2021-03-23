import { UiService } from './../../services/ui/ui.service';
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
  
  constructor(private uiService: UiService,
              private settingService: SettingService,
              private pickerController: PickerController) {}
              

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
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    let options = {
      buttons: [
        {
          text:'ok',
          handler:(value:any) => {
            this.settings.speechLang = value.languages.text
            this.settings.speechLangId = value.languages.value
            this.settingService.setSettings(this.settings)
            if(this.settings.haptics)
              this.uiService.hapticsImpactMedium()
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
    picker.addEventListener('ionPickerColChange', async (event: any) => {
      if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    }) 
  }

  /**
   * Enable/disable dark mode
   * @param event
   */
  onDarkModeToggle(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()

    this.settings.darkMode = !!event.detail.checked
    this.settingService.setSettings(this.settings);

  }

  /**
   * Enable/disable push notif
   * @param event
   */
  onNotificationToggle(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    this.settings.notification = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable delete confirmation
   * @param event
   */
  onConfirmDeleteToggle(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    this.settings.confirmation = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable secure unlock
   * @param event
   */
  onSecureUnlockToggle(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    this.settings.passcode = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable haptics
   * @param event
   */
  onHapticsToggle(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    this.settings.haptics = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable vibrations
   * @param event
   */
  onVibrationsToggle(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    this.settings.vibrations = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable text to speech
   * @param event
   */
  onSpeechToggle(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactMedium()
    this.settings.textToSpeech = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Change speech speed
   * @param event
   */
  onRangeChange(event) {
    if(this.settings.haptics)
      this.uiService.hapticsImpactLight()
    this.settings.speechVolume = event.detail.value
    this.settingService.setSettings(this.settings);
  }

}
