export class UserData {
    name: string;
    email: string;
    photoURL: string;
    phone? : string


    constructor(name: string, email: string, photoURL:string){
        this.name = name;
        this.email = email;
        this.photoURL = photoURL;
    }
}
