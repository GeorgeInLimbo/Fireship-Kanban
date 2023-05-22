import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { SnackService } from '../services/snack.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private auth: Auth,
//     private snack: SnackService
//   ) {}

//   async canActivate(
//     // next: ActivatedRouteSnapshot,
//     // state: RouterStateSnapshot
//   ): Promise<boolean> {

//     const user = await this.auth.currentUser; // Is this line correct?
//     const isLoggedIn = !!user;

//     return isLoggedIn;

//   }
  
  
// }


export function authentationGuard(): CanActivateFn {
  return () => {
    const auth: Auth = inject(Auth);
    const snack: SnackService = inject(SnackService);

    const user = auth.currentUser;
    const isLoggedIn = !!user;

    return isLoggedIn;
  }
}
