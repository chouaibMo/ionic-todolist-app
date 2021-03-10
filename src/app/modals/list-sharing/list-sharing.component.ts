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
  @Input() list : List
  writePerm: boolean = false;
  deletePerm: boolean = false;

  shareForm: FormGroup;

  constructor(private listService: ListService,
              private formBuilder: FormBuilder,
              private navParams: NavParams,
              private modalController: ModalController) {

    this.shareForm = this.formBuilder.group({
      username: ['', Validators.required],
    });

    this.list = this.navParams.get('list')

  }

  ngOnInit() {}

  onSubmit(){
    this.list.readers.push(this.shareForm.get('username').value)
    if(this.writePerm)
      this.list.writers.push(this.shareForm.get('username').value)
    if(this.deletePerm)
      this.list.deleters.push(this.shareForm.get('username').value)

    this.listService.update(this.list)
    this.dismissModal()
  }

  dismissModal() {
    this.modalController.dismiss();

  }
}
