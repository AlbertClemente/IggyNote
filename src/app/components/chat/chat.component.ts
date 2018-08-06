import { Component, OnInit } from '@angular/core';

import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje : string = "";
  elemento : any;

  constructor( public _cs: ChatService ) { 
    this._cs.loadMsgs().subscribe(() => {
      setTimeout(()=>{
        this.elemento.scrollTop = this.elemento.scrollHeight;
      },20);
    });
  }

  ngOnInit(){
    this.elemento = document.getElementById('app-mensajes');
  }

  sendMsg(){
    //Esta función recoge lo que escribimos en el input
    console.log(this.mensaje);

    if(this.mensaje.length === 0){
      return; //no devuelve nada. Por tanto, no agrega nada a la db.
    }
    this._cs.addMsgs(this.mensaje)
            .then(
              //Mensaje enviado. Vaciamos el input.
              ()=>this.mensaje = ""
            )
            .catch(
              //Error al enviar el mensaje. Mostramos error.
              ()=>console.error('Error al enviar')
            );
  }
}
