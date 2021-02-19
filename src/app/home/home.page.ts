import { Component } from '@angular/core';
import {List} from "../models/list";
import {ListService} from "../services/list/list.service";
import {AlertController, IonRouterOutlet, ModalController} from "@ionic/angular";
import {CreateListComponent} from "../modals/create-list/create-list.component";
import {Todo} from "../models/todo";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    public lists: List[]

    constructor(private listService: ListService,
                private routerOutlet: IonRouterOutlet,
                private alertController: AlertController,
                private modalController: ModalController) {
        const nbLists = Math.floor(Math.random() * (40 - 20)) + 20;
        for (let i=0; i<nbLists; i++){
            this.listService.create("my list number"+ i);
        }
        this.lists = this.listService.getAll();

        this.lists.forEach(function (list) {
            const nb = Math.floor(Math.random() * (11));
            for (let i=0; i<nb; i++){
                list.addTodo(new Todo("my todo number i", "decription of my todo number i"))
            }
        });
    }

    ngOnInit(){
        this.routerOutlet.swipeGesture = false;
    }

    ionViewWillLeave() {
        this.routerOutlet.swipeGesture = true;
    }

    async presentModal(){
        const modal = await this.modalController.create({
            component: CreateListComponent,
        });
        return await modal.present();
    }

    delete(list: List): void {
        this.presentListAlert(list)
        //this.listService.delete(list)
    }

    async presentListAlert(list: List) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Delete '+list.name,
            message: 'Are you sure you want to delete this list?\nThis list will be permanently deleted',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {}
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.listService.delete(list)
                    }
                }
            ]
        });

        await alert.present();
    }
}
