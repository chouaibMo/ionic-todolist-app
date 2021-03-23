import { UserData } from './../../models/userData';
import { AuthService } from './../../services/auth/auth.service';
import {Component, Input, OnInit} from '@angular/core';
import {ListService} from "../../services/list/list.service";
import { UiService } from './../../services/ui/ui.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalController, NavParams} from "@ionic/angular";
import {List} from "../../models/list";
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-list-sharing',
  templateUrl: './list-sharing.component.html',
  styleUrls: ['./list-sharing.component.scss'],
})
export class ListSharingComponent implements OnInit {
  @Input() list : List
  writePerm: boolean = false;
  sharePerm: boolean = false;

  shareForm: FormGroup;
  selectedUser: UserData;
  usersResult: UserData[];

  constructor(private listService: ListService,
              private formBuilder: FormBuilder,
              private navParams: NavParams,
              private uiService: UiService,
              private AuthService: AuthService,
              private userService: UserService,
              private modalController: ModalController) {

    this.shareForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]))
    });

    this.list = this.navParams.get('list')

  }

  ngOnInit() {}

  onSubmit(){
    if(!(this.selectedUser.email == this.list.owner) && !(this.selectedUser.email == this.AuthService.getCurrentUser().email)){
        this.list.readers.push(this.selectedUser.email)
        if(this.writePerm)
          this.list.writers.push(this.selectedUser.email)
        if(this.sharePerm)
          this.list.sharers.push(this.selectedUser.email)
    
        this.listService.update(this.list)
        this.uiService.presentToast("Permissions granted sucessfully", "success", 3000)
        this.dismissModal()
    }
    else if( (this.selectedUser.email == this.AuthService.getCurrentUser().email) ){
        this.uiService.presentToast("User email should be different from yours", "danger", 3000)
        this.writePerm = false;
        this.sharePerm = false;
        this.shareForm.reset()
    }
    else{
      this.uiService.presentToast("The owner already has all the permissions", "danger", 3000)
      this.writePerm = false;
      this.sharePerm = false;
      this.shareForm.reset()
    }
  }

  dismissModal() {
    this.modalController.dismiss();

  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.trim() != '') {
      this.usersResult = this.userService.users.filter((user) => {
        return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      })
    } else {
      this.usersResult = [];
    }
  }

  /**
   * Triggered when a user is selected
   * @param user the selected user
   */
  onUserSelect(user) {
    this.selectedUser = user;
    this.usersResult = [];
  }
}
