import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router
} from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirstVisitGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return Plugins.Storage.get({ key: 'visited' }).then(value =>
      !!value.value ? true : this.router.createUrlTree(['welcome'])
    );
  }
}
