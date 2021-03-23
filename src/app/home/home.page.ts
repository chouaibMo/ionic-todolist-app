import { MapService } from './../services/map/map.service';
import { Component } from '@angular/core';
import {List} from "../models/list";
import {ListService} from "../services/list/list.service";
import {AlertController, MenuController, IonRouterOutlet, ModalController} from "@ionic/angular";
import {CreateListComponent} from "../modals/create-list/create-list.component";
import {SettingService} from "../services/setting/setting.service";
import {ListSharingComponent} from "../modals/list-sharing/list-sharing.component";
import {AuthService} from "../services/auth/auth.service";
import {UiService} from "../services/ui/ui.service";
import { UserService } from '../services/user/user.service';
import { NotificationService } from '../services/notification/notification.service';
import { Settings } from '../models/settings';

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
    private settings : Settings

    constructor(private uiService : UiService,
                private mapService: MapService,
                private listService: ListService,
                private AuthService: AuthService,
                private userService: UserService,
                private menuCtrl: MenuController,
                private routerOutlet: IonRouterOutlet,
                private settingService : SettingService,
                private alertController: AlertController,
                private modalController: ModalController,
                private notifService: NotificationService,) {}

    ngOnInit(){
        this.mapService.initCurrentPosition()
        this.routerOutlet.swipeGesture = false;
        this.settingService.getSettings().subscribe(value => {
            this.settings = value
        })
        this.AuthService.fireAuth.onAuthStateChanged((credential)=>{
            if(credential){
                this.listService.getAll().subscribe(async values => {
                    this.ownedLists = values
                    this.ownedResult = this.ownedLists
                    if(this.settings.notification)
                        this.notifService.setNotifications(1, 'Are you eady for today ?', 'You have '+ this.countActiveLists(this.ownedLists) +' active lists')
                    else    
                        this.notifService.cancelNotifications('1')
                })
                this.listService.getAllShared().subscribe(values => {
                    this.sharedLists = values
                    this.sharedResult = this.sharedLists
                    if(this.settings.notification)
                        this.notifService.setNotifications(2, 'Are you eady for today ?', 'You have '+ this.countActiveLists(this.sharedLists) +' active shared lists')
                    else    
                        this.notifService.cancelNotifications('2')    
                })
            }
            else{
                this.clearLists()
            }
        })
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    /**
     * Clear the content of all the lists
     */
    clearLists(){
        this.ownedLists = []
        this.ownedResult = []
        this.sharedLists = []
        this.sharedResult = []
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
        if(this.listService.hasWritePermission(list, this.AuthService.getCurrentUser().email)){
            if(this.settings.confirmation){
                this.presentListAlert(list)
            }
            else{
                this.listService.delete(list)
            }
        }
        else{
            this.uiService.presentToast("You don't have permission to perform this operation", "danger", 3000)
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
        if(this.listService.hasSharePermission(list, this.AuthService.getCurrentUser().email))
            this.presentModal('share', list)
        else{
            this.uiService.presentToast("You don't have permission to perform this operation", "danger", 3000)
        }    
    }

    /**
     * Show an alert when delete button is clicked
     * @param list: the list to be deleted
     */
    async presentListAlert(list: List) {
        if(this.settings.haptics)
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
    
    countActiveLists(lists: List[]){
        var active = 0;
        lists.map(list => {
            if(list.nbChecked < list.size)
                active++
        })
        return active
    }
}
