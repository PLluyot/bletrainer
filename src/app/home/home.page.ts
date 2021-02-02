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

  private mensajeEstado: string = "";

  constructor(
    private info: InfoBle, //IMPLEMENTACION CLASE
    private bleTrainer: BleTrainer, //IMPLEMENTACION CLASE
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {
  }

  // ngOnInit() {
  //   this.setMensajeEstado("Inicializando BLETrainer...");
  // }
  ionViewWillEnter() {
    this.getParam();
    this.conectar();

  }
  async conectar() {
    console.log("home - objeto pulso: " + JSON.stringify(this.info.pulso));
    //al entrar comprobamos el estado del objeto (texto)
    if (this.info.pulso.estado == "conectado") {
      console.log("home - (estado) está conectado");
      // si la conexión está establecida:
      if (this.bleTrainer.estaConectado(this.info.pulso.id)) {
        console.log("home - (bleTrainer) está conectado al id del pulso");
        //obtenemos el pulso
        console.log("home - pulso:"+ JSON.stringify(this.info.pulso));
        //this.bleTrainer.subscribirNotificacion(this.info.pulso, this.info.pulso.servicio, this.info.pulso.caracteristica);
         //await this.bleTrainer.pararNotificacion();
         this.leerPulso(this.info.pulso);
        
      } else {
        console.log("home - (bleTrainer) NO está conectado al id del pulso");
        //si la conexión no está establecida, establecemos la conexión y leemos el pulso
        
        await this.bleTrainer.establecerConexionDispositivo(this.info.pulso, this.info.pulso).then(
          (conectado)=>{console.log("C1"+conectado);


          // this.bleTrainer.establecerConexionDispositivo(device, objetoConIdActual).then(
          //   (resultado)=> {console.log("RESULTADO:"+ resultado);
          //               estaConectado = resultado},
          //   (error)=> {console.log("Error conectar"+error)}
          // );

             },
          (error)=>{console.log("C2")}
        );
       // this.leerPulso(this.info.pulso);


      }

    }
  }
  leerPulso(device: any) { //device :any){
    var pulso: any;
    console.log("entramos en leer pulso");
    this.bleTrainer.subscribirNotificacion(device, device.servicio, device.caracteristica);
  }
  cambiarEstado(dispositivo: any) {
    this.ngZone.run(() => {
      //si está desconectado y estamos tratando de conectar
      if (dispositivo.estado == "desconectado") {
        //vamos a conectarnos al último dispositivo
        this.setMensajeEstado("conectando...");
        //comprobamos si tenemos almacenado el id del dispositivo
        if (dispositivo.id) {
          //this.bleTrainer.establecerConexionDispositivo(dispositivo, dispositivo); //el segundo parámetro
          this.info.cambiarEstado(dispositivo);
          this.conectar();
        }
        else {
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
        if (dispositivo.id && this.bleTrainer.estaConectado(dispositivo.id)) {
          this.bleTrainer.desconectarDispositivo(dispositivo.id);
          // this.bleTrainer.estaConectado(dispositivo.id).then((resultado)=>
          // {console.log("despues de llamar a desconectar el dispositivo está: "+ resultado);})
        }
        // y cambiamos su estado (clase InfoBle)
        this.info.cambiarEstado(dispositivo);
      }
    })
  }


  //recuperamos los parámetros de otra ventana y actualizamos el objeto InfoBle
  getParam() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.info) {
        this.info = JSON.parse(params.info);
        // if (params.bleTrainer)
        // this.bleTrainer = params.bleTrainer;
        // if(this.info.pulso.dispositivos[0])
        //   console.log(this.info.pulso.dispositivos[0]);
        // console.log("entra " + this.info.pulso.estado);
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

  setMensajeEstado(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.mensajeEstado = message;
    });
  }

  /******* prueba con promesas */
  mifuncion(max = 10, esperado = 5, tiempo = 1000) {

    return new Promise((resolve, reject) => {
      const numero = Math.floor(Math.random() * max);
      setTimeout(
        () => numero > esperado
          ? resolve(numero)
          : reject(new Error('número menor al esperado')),
        tiempo
      );
    });
  }
  mifuncion2(a = 10, b = 20) {
    var num = 10;
    return new Promise((x, y) => {
      if (a > b)
        x('primer número mayor')
      else
        y('segundo número mayor')
    });
  }
  /* fin pruebas */
  ngOnInit() {
    // this.mifuncion2(20,120).then(resultado=> console.log(resultado),
    // error=> console.log(error));
    this.setMensajeEstado("Inicializando BLETrainer...");
  }
}