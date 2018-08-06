import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public _cs:ChatService) { }

  //Método iniciar sesión
  login( platformProvider: string ){
    console.log(platformProvider);
    this._cs.login(platformProvider);
  }
}
