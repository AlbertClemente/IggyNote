import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Mensaje } from '../interfaces/mensaje.interface';

//Añadimos esto para dar retro compatibilidad a la map() y no dé error de compilación
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


//Login Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

@Injectable()

export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;


  public chats: Mensaje[];
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {
                this.afAuth.authState.subscribe( user => {
                  console.log('Estado del usuario: ', user);

                  if(!user){
                    return;
                  }
                  this.usuario.nombre = user.displayName;
                  this.usuario.foto = user.photoURL;
                  this.usuario.uid = user.uid;
                });
              }
  
  login(platformProvider: string) {
    if(platformProvider === 'google'){
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    if (platformProvider === 'twitter') {
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
    if (platformProvider === 'facebook') {
      this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  //Recuperar mensajes
  loadMsgs(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc')
                                                                           .limit(5));

    return this.itemsCollection.valueChanges()
                               .map( (mensajes: Mensaje[]) => {
                                 console.log(mensajes);
                                 
                                 this.chats = [];

                                 for(let mensaje of mensajes){
                                   this.chats.unshift(mensaje);
                                 }
                                 
                                 return this.chats;
                                 //this.chats = mensajes;
                               } )
  }

  //Agregar mensajes
  addMsgs( txt: string){
    var fechaActual = new Date();
    var fechaHora = fechaActual.getDate() + "/"
                  + (fechaActual.getMonth() + 1) + "/"
                  + fechaActual.getFullYear() + " @ "
                  + fechaActual.getHours() + ":"
                  + fechaActual.getMinutes() + ":"
                  + fechaActual.getSeconds();
    let mensaje: Mensaje = {
      username: this.usuario.nombre,
      mensaje: txt,
      fecha: fechaHora,
      uid: this.usuario.uid,
      foto: this.usuario.foto
    }
    return this.itemsCollection.add( mensaje ); 
  }
}
