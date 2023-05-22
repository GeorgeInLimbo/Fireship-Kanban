import { Component } from '@angular/core';
import { Auth, authState, signOut } from '@angular/fire/auth';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
authState = authState(this.auth);
  
  constructor (private auth: Auth) {}

  signOut() {
    signOut(this.auth)
  }



}
