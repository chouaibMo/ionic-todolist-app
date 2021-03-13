import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {StorageService} from "../services/storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class SlidesGuard implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) {
  }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.storageService.getObject('tutorialFinished').then(value => {
      if (value != null && value) {
        this.router.navigate(['login'])
        return false
      }
      else {
        return true
      }
    });
  }


  
}
