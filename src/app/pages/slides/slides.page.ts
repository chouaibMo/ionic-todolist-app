import { Component, OnInit } from '@angular/core';
import {MenuController} from "@ionic/angular";
import {StorageService} from "../../services/storage/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {

  constructor(private router: Router,
              private menuCtrl: MenuController,
              private storageService : StorageService) {}

 
  ngOnInit() {}

  ionViewWillEnter() { 
    this.menuCtrl.enable(false); 
  }


  tutorialFinished(){
    this.storageService.setObject('tutorialFinished', true)
    this.router.navigate(['login'])
  }

}
