import { Component } from '@angular/core';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  public loggedIn: boolean | undefined;

  constructor(
    private AuthState: AuthStateService,
    private Auth: AuthService,
  ){ }

  ngOnInit() {

    this.AuthState.authStatus.subscribe(value => this.loggedIn = value);
  }

  logout(event: MouseEvent): void {
    event.preventDefault();
    this.Auth.logout();
  }

}
