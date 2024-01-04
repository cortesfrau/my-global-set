import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

/**
 * Service responsible for managing and providing the authentication state.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  // BehaviorSubject to track the authentication state
  private loggedIn = new BehaviorSubject<boolean>(this.Token.loggedIn());

  // Observable to subscribe to changes in the authentication state
  authStatus = this.loggedIn.asObservable();

  /**
   * Notifies subscribers about a change in the authentication status.
   * @param value - The new authentication status.
   */
  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  /**
   * Constructor of AuthStateService.
   * @param Token - An instance of the TokenService for handling token-related operations.
   */
  constructor(
    private Token: TokenService,
  ) {}

}
