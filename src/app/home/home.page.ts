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
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getParam();
    // this.conectar(this.info.pulso);
  }
  /************************************************ */
  /* función conectar
  /* params:  device --> recibe un dispositivo (bici, pulso) que contiene la propiedad id
  /*            al que nos trataremos de conectar
  /* variables:     
  /*        seConecto --> indica si el BLE se conectó o no, es el valor de retorno
  /* funcionamiento:
  /*        comprobamos el estado de la conexión con el dispositivo.
  /*            --> está conectado? --> SI --> leemos su información almacenando en las variables
  /*                                    que correspondan
  /*                                this.bleTrainer.pulsaciones
  /*                                this.bleTrainer.cadencia
  /*                                this.bleTrainer.velocidad
  /*                                this.bleTrainer.potencia
  /*                                --> NO --> si tiene la ppiedad id --> nos conectamos --> SI / NO
  /*                                      --> si no podemos --> NO
  /************************************************** */
  async conectar(device: any) {
    //console.log("home 1 - infoBle" + device.nombre + " está " + device.estado);
    //var seConecto: boolean = false;
    // si la conexión está establecida:
    var conectado = await this.bleTrainer.estaConectado(device.id);
    if (conectado == true) {
      console.log("home 1 - el dispositivo YA estaba conectado");
      //seConecto = true;//estaba conectado
      //leer el pulso
      if (device.nombre == "Pulsómetro") await this.leerPulso(device);
      else console.log("IMPLEMENTAR LECTURA BICI");
    }
    else { //en otro caso nos conectamos
      if (device.id) //si tenemos un device.id
      {
        console.log("home 1 - vamos a conectarnos a :" + device.id + "-" + device.servicio);
        //return (this.bleTrainer.establecerConexionDispositivo(device, device));
        conectado = await this.bleTrainer.establecerConexionDispositivo(device, device);
        console.log("home 1 - estado" + conectado);
        
        if (conectado && device.nombre == "Pulsómetro") await this.leerPulso(device);
      
      } else { //si NO tenemos un device.id
        console.log("llamamos a la página device");
        conectado = false;

      }
     
    }
    return conectado;
  }
  /************************************************ */
  /* función cambiarEstado
  /* params:  dispositivo --> recibe un dispositivo (bici, pulso) para cambiar su estado (conectado o desconectado)
  /* variables:     
  /*        seHaCambiadoEstado --> indica si el dispositivo ha cambiado de estado en esta función
  /* funcionamiento:
            si estaba desconectado --> llamamos a la función conectar --> SI (cambiar el estado)
            si estaba conectado --> desconectamos el dispositivo --> SI (cambiar estado)                                                              NO ()
  /************************************************* */
  async cambiarEstado(dispositivo: any) {
    console.log("home - 2-cambiar_estado -  objeto : " + dispositivo.nombre + " : " + JSON.stringify(dispositivo));
    var seHaCambiadoEstado: boolean = false;
    //si está desconectado y estamos tratando de conectar
    if (dispositivo.estado == "desconectado") {
      //vamos a conectarnos al último dispositivo
      this.setMensajeEstado("conectando...");
      //establecemos la conexión
      const seHaConectado =  await this.conectar(dispositivo);
      console.log("resultado de seha conectado"+ seHaConectado);
      if (seHaConectado==true) this.info.cambiarEstado(dispositivo)
      else this.sendParam('devices');
      
      // .then(
      //   (seHaConectado) => { // SE LLAMA A CONECTAR estando DESCONECTADO
      //     if (seHaConectado) //si se ha podido conectar cambiamos el estado a conectado
      //       this.info.cambiarEstado(dispositivo)
      //     else // si no nos hemos podido conectar,  redirigimos a devices
      //       this.sendParam('devices');
      //   });

    } else {
      //desconectamos el dispositivo en el caso de estar conectado
      if (dispositivo.estado == "conectado") {
        //desconectamos el dispositivo
        var resultado = await this.bleTrainer.desconectarDispositivo(dispositivo.id); //FALLA
        console.log("home - 2 - hemos llamado a desconectar el dispositivo con resultado: " + resultado);
        // y cambiamos su estado (clase InfoBle)
        this.info.cambiarEstado(dispositivo);
      } else
        console.log("home - 2 - No hay cambio de estado;");
    }
  }
  /************************************************ */
  /* función leerPulso ////// CAMBIAR EL NOMBRE
  /* params:  dispositivo --> dispositivo quq contiene el servicio y característica a subscribirse
  /* variables:     
  /*                                                                     NO ()
  /************************************************* */

  leerPulso(device: any) { //device :any){
    console.log("home 3- leer pulso - entramos en leer pulso");
    this.bleTrainer.subscribirNotificacion(device, device.servicio, device.caracteristica);
  }

  //recuperamos los parámetros de otra ventana y actualizamos el objeto InfoBle
  getParam() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.info) {
        this.info = JSON.parse(params.info);
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
  // mifuncion(max = 10, esperado = 5, tiempo = 1000) {

  //   return new Promise((resolve, reject) => {
  //     const numero = Math.floor(Math.random() * max);
  //     setTimeout(
  //       () => numero > esperado
  //         ? resolve(numero)
  //         : reject(new Error('número menor al esperado')),
  //       tiempo
  //     );
  //   });
  // }
  // mifuncion2(a = 10, b = 20) {
  //   var num = 10;
  //   return new Promise((x, y) => {
  //     if (a > b)
  //       x('primer número mayor')
  //     else
  //       y('segundo número mayor')
  //   });
  // }
  /* fin pruebas */

}