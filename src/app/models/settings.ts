
export class Settings {
     darkMode: boolean
     notification: boolean
     haptics: boolean
     vibrations: boolean
     confirmation: boolean
     passcode : boolean
     textToSpeech: boolean
     speechLangId: number
     speechLang: string
     speechVolume: number

    constructor(){
         this.darkMode = false /*document.body.getAttribute('color-theme') === 'dark'*/
         this.notification = false
         this.haptics = false
         this.vibrations = false
         this.confirmation = false
         this.textToSpeech = false
         this.passcode = false
         this.speechLangId = 0
         this.speechLang = ''
         this.speechVolume = 1
    }

}
