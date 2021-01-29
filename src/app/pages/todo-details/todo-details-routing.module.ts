import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoDetailsPage } from './todo-details.page';

const routes: Routes = [
  {
    path: '',
    component: TodoDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoDetailsPageRoutingModule {}
