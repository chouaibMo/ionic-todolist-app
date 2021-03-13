import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../services/storage/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {

  constructor(private router: Router,
              private storageService : StorageService) {}

  ngOnInit() {}

  tutorialFinished(){
    this.storageService.setObject('tutorialFinished', true)
    this.router.navigate(['login'])
  }

}
