import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListService} from "../../services/list/list.service";
import {ModalController} from "@ionic/angular";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  listForm: FormGroup;

  constructor(private listService: ListService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private modalController: ModalController) {

    this.listForm = this.formBuilder.group({
      listName: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit(){
    this.listService.create(this.listForm.get('listName').value, this.authService.getCurrentUser().email);
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
