import { Component } from '@angular/core';
import {List} from "../models/list";
import {ListService} from "../services/list/list.service";
import {AlertController, IonRouterOutlet, ModalController} from "@ionic/angular";
import {CreateListComponent} from "../modals/create-list/create-list.component";
import {Todo} from "../models/todo";
import {SettingService} from "../services/setting/setting.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    private lists: List[]
    private searchResult
    private deleteConfirmation : boolean

    constructor(private listService: ListService,
                private routerOutlet: IonRouterOutlet,
                private settingService : SettingService,
                private alertController: AlertController,
                private modalController: ModalController) {

        this.settingService.getDeleteConfirmationValue().subscribe((value) => {
            this.deleteConfirmation = value;
        });

        const nbLists = Math.floor(Math.random() * (40 - 20)) + 20;
        for (let i=0; i<nbLists; i++){
            this.listService.create("my list number"+ i);
        }
        this.lists = this.listService.getAll();

        this.lists.forEach(function (list) {
            const nb = Math.floor(Math.random() * (20));
            for (let i=0; i<nb; i++){
                list.addTodo(new Todo("my todo number "+i, "description of my todo number "+i))
            }
        });

        this.searchResult = this.lists
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
        if(this.deleteConfirmation){
            if(list.todos.length > 0)
                this.presentListAlert(list)
            else
                this.listService.delete(list)
        }
        else{
            this.listService.delete(list)
        }
    }

    async presentListAlert(list: List) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Delete '+list.name,
            message: 'This list contains one or more tasks.\nAre you sure you want to delete this list?',
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

    onSearchChange(event: any) {
        const keyword = event.detail.value
        this.searchResult = this.lists
        if(keyword == '')
            return this.lists
        if(keyword && keyword.trim() != ''){
            this.searchResult = this.searchResult.filter((item) => {
                return (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
            })
        }
    }
}
