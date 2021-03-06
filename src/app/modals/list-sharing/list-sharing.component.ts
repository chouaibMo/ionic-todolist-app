import {Component, Input, OnInit} from '@angular/core';
import {ListService} from "../../services/list/list.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {ModalController, NavParams} from "@ionic/angular";
import {List} from "../../models/list";
import {Todo} from "../../models/todo";

@Component({
  selector: 'app-list-sharing',
  templateUrl: './list-sharing.component.html',
  styleUrls: ['./list-sharing.component.scss'],
})
export class ListSharingComponent implements OnInit {
  @Input() list_id : string
  writePerm: boolean;
  deletePerm: boolean;

  shareForm: FormGroup;

  constructor(private listService: ListService,
              private formBuilder: FormBuilder,
              private navParams: NavParams,
              private modalController: ModalController) {

    this.shareForm = this.formBuilder.group({
      username: ['', Validators.required],
    });

    console.log(navParams.get('list_id'));
  }

  ngOnInit() {}

  onSubmit(){
    this.listService.listsCollection.doc(this.list_id).collection('readers').doc().set({
      email: this.shareForm.get('username').value
    })
    if(this.writePerm){
      this.listService.listsCollection.doc(this.list_id).collection('writers').doc().set({
        email: this.shareForm.get('username').value
      })
    }
    this.dismissModal()
  }

  dismissModal() {
    this.modalController.dismiss();

  }
}
