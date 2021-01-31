import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';

import { InfoBle } from '../info-ble';
import { BleTrainer } from '../ble-trainer';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private mensajeEstado : string ="";

  constructor(
    private info: InfoBle, //IMPLEMENTACION CLASE
    private bleTrainer: BleTrainer, //IMPLEMENTACION CLASE
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.setMensajeEstado("Inicializando BLETrainer...");
  }
  ionViewWillEnter() {
    //recuperamos los parámetros de otra ventana y actualizamos el objeto InfoBle
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.info) {
        this.info = JSON.parse(params.info);
        console.log("entra " + this.info.bici.estado);
        //convertimos info en un objeto InfoBle (con los parámetros obtenidos de otra ventana)
        this.info = new InfoBle(this.info.bici, this.info.pulso);
      }
    }
    );
  }
  //navegación a las distintas páginas (función generica--> meter en nueva clase)
  sendParam(page: string) {
    let paramRouter: NavigationExtras = {
      queryParams: {
        //mandamos como parámetros el objeto InfoBle
        info: JSON.stringify(this.info)
      }
    };
    this.router.navigate([page], paramRouter);
  }
  cambiarEstado(dispositivo: any) {
    this.ngZone.run(() => {
      //si está desconectado y estamos tratando de conectar
      if (dispositivo.estado == "desconectado") {
        //vamos a conectarnos al último dispositivo
        this.setMensajeEstado("conectando...");
        //comprobamos si tenemos almacenado el id del dispositivo
          if (dispositivo.id){
            this.bleTrainer.establecerConexionDispositivo(dispositivo.id);
            this.info.cambiarEstado(dispositivo);
          }
          else{
            //primero intentamos ir a la página de configuracion para que se conecte a un dispositivo
            this.sendParam('devices');
            this.setMensajeEstado("No se puede conectar al dispositivo");
          
          }
            
        //si no nos conectamos --> no cambiamos el estado
        //si nos conectamos--> cambiamos estado
        
        // this.setMensajeEstado("");
      }
      else {
        //desconectamos el dispositivo en el caso de estar conectado
        // y cambiamos su estado
        this.info.cambiarEstado(dispositivo);
      }
    })
  }
  setMensajeEstado(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.mensajeEstado = message;
    });
    
  }
}
