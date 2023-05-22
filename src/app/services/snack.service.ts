import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(
    private snackBar: MatSnackBar, 
    private router: Router
  ) { }

  authError() {
    const ref = this.snackBar.open('You must be logged in!', 'Okay', {
      duration: 5000
    });

    return ref
      .onAction()
      .pipe(tap(_ => this.router.navigate(['/login'])))
      .subscribe();
  }
}
