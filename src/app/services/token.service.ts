import { Injectable } from '@angular/core';

/**
 * Service for managing authentication tokens.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  /**
   * Defines the expected issuer URLs for login and signup.
   */
  private iss = {
    login: 'http://myglobalset-back.test/api/auth/login',
    signup: 'http://myglobalset-back.test/api/auth/signup'
  }

  constructor() { }

  /**
   * Handles the received token by storing it in local storage.
   * @param token - The authentication token to be handled.
   */
  handle(token: string) {
    this.set(token);
  }

  /**
   * Sets the authentication token in local storage.
   * @param token - The authentication token to be stored.
   */
  set(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Retrieves the authentication token from local storage.
   * @returns The authentication token.
   */
  get() {
    return localStorage.getItem('token');
  }

  /**
   * Removes the authentication token from local storage.
   */
  remove() {
    localStorage.removeItem('token');
  }

  /**
   * Checks if the authentication token is valid.
   * @returns A boolean indicating the validity of the token.
   */
  isValid() {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        // Check if the token has expired and if the issuer is valid.
        const isExpired = payload.exp ? Date.now() >= payload.exp * 1000 : false;
        const isIssuerValid = Object.values(this.iss).indexOf(payload.iss) > -1;
        return !isExpired && isIssuerValid;
      }
    }
    return false;
  }

  /**
   * Gets the payload from the authentication token.
   * @param token - The authentication token.
   * @returns The payload of the token.
   */
  payload(token: string) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  /**
   * Decodes the base64-encoded payload of the authentication token.
   * @param payload - The base64-encoded payload.
   * @returns The decoded payload as a JSON object.
   */
  decode(payload: string) {
    return JSON.parse(atob(payload));
  }

  /**
   * Checks if the user is logged in by verifying the validity of the authentication token.
   * @returns A boolean indicating if the user is logged in.
   */
  loggedIn() {
    return this.isValid();
  }

}
