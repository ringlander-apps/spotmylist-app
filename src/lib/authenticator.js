import auth0 from 'auth0-js'
import {
  resolve
} from 'path';

export default class Authenticator {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: "ringlander-apps.eu.auth0.com",
      clientID: "ejByvu6qUsK3Aj8k3XZI1y4ypWM5xlOB",
      redirectUri: "http://localhost:8080/auth",
      audience: "",
      responseType: "token id_token",
      scope: "openid email profile"
    });
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        
        if (err) return reject(err);
        resolve(authResult);
      });
    });
  }
}