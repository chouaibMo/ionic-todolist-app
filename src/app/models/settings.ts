
export class User {
     darkMode: boolean
     notification: boolean
     haptics: boolean
     vibrations: boolean
     confirmation: boolean
     textToSpeech: boolean
     speechLang: string
     speechVolume: number

    constructor(){
         this.darkMode = false
         this.notification = false
         this.haptics = false
         this.vibrations = false
         this.confirmation = false
         this.textToSpeech = false
         this.speechLang = ''
         this.speechVolume = 1
    }

}
