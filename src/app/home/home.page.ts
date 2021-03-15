import { Component } from '@angular/core';
import {List} from "../models/list";
import {ListService} from "../services/list/list.service";
import {AlertController, IonRouterOutlet, ModalController} from "@ionic/angular";
import {CreateListComponent} from "../modals/create-list/create-list.component";
import {SettingService} from "../services/setting/setting.service";
import {ListSharingComponent} from "../modals/list-sharing/list-sharing.component";
import {AuthService} from "../services/auth/auth.service";
import {takeUntil} from "rxjs/operators";
import {UiService} from "../services/ui/ui.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    private ownedLists: List[]
    private sharedLists: List[]
    private ownedResult: List[]
    private sharedResult: List[]
    private deleteConfirmation : boolean

    constructor(private listService: ListService,
                private routerOutlet: IonRouterOutlet,
                private settingService : SettingService,
                private authService: AuthService,
                private uiService : UiService,
                private alertController: AlertController,
                private modalController: ModalController) {}

    ngOnInit(){
        this.routerOutlet.swipeGesture = false;

        this.settingService.getSettings().subscribe((value) => {
            this.deleteConfirmation = value.confirmation;
        });

        this.listService.getAll().subscribe(values => {
            this.ownedLists = values
            this.ownedResult = this.ownedLists
        });
        this.listService.getAllShared().subscribe(values => {
            this.sharedLists = values
            this.sharedResult = this.sharedLists
        });

    }

    ionViewWillLeave() {
        this.routerOutlet.swipeGesture = true;
    }

    /**
     * Show a modal to create or share a list
     * @param action: create or share
     * @param list: the list to share in case of share action (optionnal param)
     */
    async presentModal(action: string, list?: List){
        if(action == "create"){
            const modal = await this.modalController.create({
                component: CreateListComponent,
            });
            return await modal.present();
        }
        if(action == "share"){
            const modal = await this.modalController.create({
                component: ListSharingComponent,
                componentProps: { list : list }
            });
            return await modal.present();
        }
    }

    /**
     *  Triggered when delete option is clicked
     *  @param list: the list to be deleted
     */
    delete(list: List): void {
        if(this.deleteConfirmation){
            if(list.todos?.length > 0)
                this.presentListAlert(list)
            else
                this.listService.delete(list)
        }
        else{
            this.listService.delete(list)
        }
    }

    /**
     *  Triggered when a keyword is typed in the searchbar,
     *  and show tasks matching this keyword
     *  @param event
     */

    onSearchChange(event: any) {
        const keyword = event.detail.value
        this.ownedResult = this.ownedLists
        this.sharedResult = this.sharedLists
        if(keyword == ''){
            this.ownedResult = this.ownedLists
            this.sharedResult = this.sharedLists
        }
        if(keyword && keyword.trim() != ''){
            this.ownedResult = this.ownedResult.filter((item) => {
                return (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
            })
            this.sharedResult = this.sharedResult.filter((item) => {
                return (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
            })
        }
    }

    /**
     *  Triggered when share button's option is clicked
     *  Show a modal for list sharing
     *  @param list: the list to be shared
     */
    share(list: List) {
        this.presentModal('share', list)
    }

    /**
     * Show an alert when delete button is clicked
     * @param list: the list to be deleted
     */
    async presentListAlert(list: List) {
        this.uiService.vibration()
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
}
