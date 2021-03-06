import { Component } from '@angular/core';
import {List} from "../models/list";
import {ListService} from "../services/list/list.service";
import {AlertController, IonRouterOutlet, ModalController} from "@ionic/angular";
import {CreateListComponent} from "../modals/create-list/create-list.component";
import {SettingService} from "../services/setting/setting.service";
import {ListSharingComponent} from "../modals/list-sharing/list-sharing.component";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    private lists: List[]
    private searchResult: List[]
    private deleteConfirmation : boolean

    constructor(private listService: ListService,
                private routerOutlet: IonRouterOutlet,
                private settingService : SettingService,
                private alertController: AlertController,
                private modalController: ModalController) {

        this.settingService.getDeleteConfirmationValue().subscribe((value) => {
            this.deleteConfirmation = value;
        });
    }

    ngOnInit(){
        this.routerOutlet.swipeGesture = false;
        this.listService.getAll().subscribe(values => {
            this.lists = values
            this.searchResult = this.lists
            console.log("home")
        });
    }

    ionViewWillLeave() {
        this.routerOutlet.swipeGesture = true;
    }

    async presentModal(action: string, list_id?: string){
        if(action == "create"){
            const modal = await this.modalController.create({
                component: CreateListComponent,
            });
            return await modal.present();
        }
        if(action == "share"){
            const modal = await this.modalController.create({
                component: ListSharingComponent,
                componentProps: { list_id : list_id }
            });
            return await modal.present();
        }
    }

    /**
     *  Triggered when delete option is clicked
     */
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

    /**
     *  Triggered when a keyword is typed in the searchbar,
     *  and show tasks matching this keyword
     */
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

    /**
     *  Triggered when share button's option is clicked
     *  Show a modal for list sharing
     */
    share(list: List) {

    }
}
