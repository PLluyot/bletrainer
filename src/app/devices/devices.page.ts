import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ToastController } from '@ionic/angular';
//pruebas con BLE
import { BLE } from '@ionic-native/ble/ngx';
//mis clases
import { InfoBle } from '../info-ble';
import { BleTrainer } from '../ble-trainer';


@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
  private mensajeEstado: string = ""; // mensaje para la barra de estados

  /**********************dispositivos********************************* */
  private devices: any[] = []; //array de dispositivos encontrados (temporal, no se muestra)
  //pruebas
  public devicesPulso: any[] = []; //array de dispositivos (pulsómetros)
  public devicesBici: any[] = []; //array de dispositivos (bici)

  private peripheral: any = {}; //json que almacena cada uno de los dispositivos encontrados (temporal)
  dataFromDevice: any; //datos recogidos de un dispositivo
  /*********************información leida***************************** */
  private pulsaciones = 0; //almacena las pulsaciones actuales
  private cadencia = 0;
  private velocidad = 0;
  private potencia = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private info: InfoBle, //IMPLEMENTACION CLASE
    private bleTrainer: BleTrainer, //IMPLEMENTACION CLASE
    private ble: BLE, // QUITAR
    private ngZone: NgZone, //QUITAR
    private toastCtrl: ToastController) {


  }
  /******************INICIO************ */
  ngOnInit() {
  }
  ionViewDidEnter() {
    //recuperamos los parámetros de otra página
    this.getParam();

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
  /*******************ESCANEAR************ */
  // Escanea en busca de algún servicio o en general.
  // si el componente contiene servicios, filtramos por el
  scan(componente: any) { //pasamos el componente bici o pulso (this.info.bici o pulso)
    var servicio: string[] = []; //inicializamos el array de servicios
    this.devices = []; // clear list

    console.log("entramos en SCAN");
    if (componente) { //si existe el componente, obtenemos los servicios
      servicio = [componente.servicio];
      componente.dispositivos = []; //borramos el listado de dispositivos encontrados previamente
      console.log("filtramos por servicios y borramos array");
    }
    // no es necesario lo siguiente:
    // else {
    //   servicio = []; //si no existe el componente borramos los servicios previos
    //   console.log("no existe el componente borramos los servicios previos, buscamos todo");
    // }

    // this.ngZone.run(() => {
    this.bleTrainer.scan(servicio).then(
      (dispositivosEncontrados: any[]) => {
        this.devices = dispositivosEncontrados;
        if (componente) { // si le pasamos pulso o bici, almacenamos el array de componentes en su JSON
          componente.dispositivos = this.devices; //agregamos al JSON del componente los dispositivos encontrados
        }
      },
      (error) => console.log(error)
    ); //escaneamos el componente

  }
  /*****************CONECTAR************* 
   * conectamos a un ble y cambiamos el estado.
   * *****************************************/
  async conectar(device: any, objetoConIdActual?: any) {
    console.log("DEVICES-CONECTAR");
    var estaConectado: boolean = false;
    // console.log("estado una vez llamado a conectar ANTES:" + objetoConIdActual.estado);

    estaConectado = await this.bleTrainer.establecerConexionDispositivo(device, objetoConIdActual);
    if (estaConectado && objetoConIdActual.nombre=="Pulsómetro")
    await this.leerPulso(device);
    
    console.log("CAMBIAMOS EL ESTADO. Está conectado? " + estaConectado);
    
    if ((estaConectado && objetoConIdActual.estado == "desconectado") ||
       (!estaConectado && objetoConIdActual.estado == "conectado")) // si NO coincide camniamos su estado
     this.info.cambiarEstado(objetoConIdActual);
    // console.log("estado una vez llamado a conectar DESPUES:" + objetoConIdActual.estado);

    return estaConectado;
  }
    /************************************************************ */
  //      PULSO Y CADENCIA Y VELOCIDAD
  /************************************************************ */
  leerPulso(device: any) { //device :any){
    console.log("DEVICES-LEERPULSO");
    var pulso: any;
    console.log("entramos en leer pulso");
    this.bleTrainer.subscribirNotificacion(device, device.servicio, device.caracteristica);

  }
    
  sendParam() {
    let paramRouter: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(this.info)
      }
    };
    this.router.navigate(['/home'], paramRouter);
  }

  lectura(servicio: string, caracteristica: string) {
    this.ble.read(this.info.pulso.id, servicio, caracteristica).then(

      function (data) {
        //console.log("READ:" + String.fromCharCode.apply(null, new Uint8Array(data)));
        console.log("Read" + JSON.stringify(data));
      }, function (error) {
        console.log("Error Read" + JSON.stringify(error));
      }




      // (data) => {

      //   console.log("leemos:" + JSON.stringify(String.fromCharCode.apply(null, new Uint8Array(data))));
      //   //console.log("leemos -->(" + servicio + ", " + caracteristica + ") " + data + " valor:" + this.bytesToString(data).replace(/\s+/g, " "));
      //   //this.onValueChange(data);
      // },
      // (err) => {
      //   "mal:" + console.log(err);
      //   //this.desconectar(this.info.pulso.id);

      // }

    );
  }


  desconectar(deviceId: string) {
    this.ble.isConnected(deviceId).then(() =>
      this.ble.disconnect(deviceId).then(() => console.log("lo he desconectado")))

  }

  // escriboDato() {
  //   var inputdata = new Uint8Array(3);
  //   inputdata[0] = 0x53; // S
  //   inputdata[1] = 0x54; // T
  //   inputdata[2] = 0x0a; // LF
  //   this.ble.writeWithoutResponse(

  //     this.info.pulso.id,
  //     '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  //     '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
  //     inputdata.buffer
  //   )
  //     .then(
  //       data => {


  //         console.log("retorno:" + data);
  //         //debugger;
  //         this.obtenerPulso(this.info.pulso)
  //       },
  //       () =>

  //         //this.showAlert(
  //         console.log("Unexpected Error",
  //           "Failed to subscribe for changes, please try to re-connect.")
  //     )
  // }
  /*************************************************************** */
  encenderBle() {
    this.ble.enable().then(
      () => console.log("enciendo BLE")
      ,
      () => console.log("error al encender")
    );

  }


  /************************************** */
  /****************************************** */
  subscribe() {

    this.ble
      .startNotification(this.info.pulso.id,
        this.info.pulso.servicio, this.info.pulso.caracteristica)
      .subscribe(
        data => {
          // console.log("aqui"+data[0]);
          this.onValueChange(data[0]);

        },
        () =>

          //this.showAlert(
          console.log("Unexpected Error",
            "Failed to subscribe for changes, please try to re-connect."
          )
      );

  }
  /*********************************************
   *  TRADUCCION
   ***************************************/
  onValueChange(buffer: ArrayBuffer) {
    this.ngZone.run(() => {
      try {
        this.dataFromDevice = new Uint8Array(buffer);
        this.pulsaciones = this.dataFromDevice[1];
        //if (this.dataFromDevice == undefined)
        //         this.dataFromDevice = this.bytesToString(buffer).replace(/\s+/g, " ");

        // else this.dataFromDevice += ' ' + this.bytesToString(buffer).replace(/\s+/g, " ");
        console.log("R:" + (this.pulsaciones) + "bpm" + "- " + this.dataFromDevice);
        //console.log("datos leidos: " + this.dataFromDevice);
        //Simply assign data to variable dataFromDevice and string concat
      } catch (e) {
        console.log(e);
      }
    });
  }
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
  /* no quitar*/
  setMensajeEstado(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.mensajeEstado = message;
    });

  }
}