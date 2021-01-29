import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ListDetailsPageRoutingModule } from './list-details-routing.module';
import { ListDetailsPage } from './list-details.page';
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ListDetailsPageRoutingModule,
  ],
  declarations: [
      ListDetailsPage,
      CreateTodoComponent,
  ]
})
export class ListDetailsPageModule {}
