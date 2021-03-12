
export class Settings {
     darkMode: boolean
     notification: boolean
     haptics: boolean
     vibrations: boolean
     confirmation: boolean
     passcode : boolean
     textToSpeech: boolean
     speechLang: string
     speechVolume: number

    constructor(){
         this.darkMode = true
         this.notification = false
         this.haptics = false
         this.vibrations = false
         this.confirmation = false
         this.textToSpeech = false
         this.passcode = false
         this.speechLang = 'english (UK)'
         this.speechVolume = 1
    }

}
