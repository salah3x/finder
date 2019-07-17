import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  UrlTree,
  RouterStateSnapshot
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private authService: AngularFireAuth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.authState.pipe(
      take(1),
      map(user => !!user),
      tap(isAuhtenticated => {
        if (!isAuhtenticated) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.authState.pipe(
      take(1),
      map(user => !!user),
      tap(isAuhtenticated => {
        if (!isAuhtenticated) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
