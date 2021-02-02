
export class User {

    constructor(private _id: string,
                private _email: string,
                private _imagePath: string = "",
                private _firstName: string = "",
                private _lastName: string  = "" ){
    }

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get imagePath(): string {
        return this._imagePath;
    }

    set imagePath(value: string) {
        this._imagePath = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

}
