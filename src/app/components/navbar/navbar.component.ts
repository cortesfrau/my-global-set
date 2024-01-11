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
    private authStateService: AuthStateService,
    private authService: AuthService,
  ) { }

  /**
   * Initializes the component and subscribes to the authentication state changes.
   * Updates the 'loggedIn' property based on the changes in authentication state.
   */
  ngOnInit() {
    this.authStateService.authStatus.subscribe(value => this.loggedIn = value);
  }

  /**
   * Logs out the user by calling the logout method of the AuthService.
   * @param event The MouseEvent that triggered the logout action.
   */
  logout(event: MouseEvent): void {
    event.preventDefault();
    this.authService.logout();
  }

}
