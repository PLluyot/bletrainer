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
  private devices: any[] = [];
  //pruebas
  public devicesPulso: any[] = [];
  public devicesBici: any[] = [];


  private peripheral: any = {};
  dataFromDevice: any;
  private pulsaciones = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private info: InfoBle, //IMPLEMENTACION CLASE
    private bleTrainer: BleTrainer, //IMPLEMENTACION CLASE
    private ble: BLE, // QUITAR
    private ngZone: NgZone, //QUITAR
    private toastCtrl: ToastController) {

    //recibimos el objeto InfoBle por parámetros
    this.activatedRoute.queryParams.subscribe((params) => {
      this.info = JSON.parse(params.info);
      console.log(this.info.pulso);
      //convertimos info en un objeto InfoBle
      this.info = new InfoBle(this.info.bici, this.info.pulso);
    }
    );
  }
  /******************INICIO************ */
  ionViewDidEnter() {

    //this.scan("");
    this.ble.isConnected(this.info.pulso.id).then(
      () => {
        console.log("conectado a pulso"),
        this.setMensajeEstado("conectado a pulso")
      },
      () => {
        console.log("NO conectado a pulso"),
        this.setMensajeEstado("NO conectado a pulso")
      }

    )
  }

  ngOnInit() {
    //this.scan(this.info.bici);
    //this.scan(this.info.pulso);
  }
  /*******************ESCANEAR************ */
  scanConectarPulso() {


    this.ngZone.run(() => {
      this.scan(this.info.pulso); // meter promesa
      //this.devicesPulso = this.devices;

      if (this.info.pulso.dispositivos[0]) {
        console.log(this.info.pulso.dispositivos[0]);
        // this.info.pulso.id=this.info.pulso.dispositivos[0].id; // actualizo el id con el primero
        // this.bleTrainer.establecerConexionDispositivo(this.info.pulso.dispositivos[0].id,this.info.pulso)
        //this.leerPulso(this.info.pulso);
      }

    })

  }
  scan(componente: any) { //pasamos el componente bici o pulso (this.info.bici o pulso)
    var servicio: string[] = []; //inicializamos el array de servicios
    this.devices = []; // clear list

    console.log("entramos en SCAN");
    if (componente) { //si existe el componente, obtenemos los servicios
      servicio = [componente.servicio];
      componente.dispositivos = []; //borramos el listado de dispositivos encontrados previamente
      console.log("filtramos por servicios y borramos array");
    }
    else {
      servicio = []; //si no existe el componente borramos los servicios previos
      console.log("no existe el componente borramos los servicios previos, buscamos todo");
    }

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
  conectar(device: any, objetoConIdActual?: any) {
    var estaConectado = false;
    console.log("estado una vez llamado a conectar ANTES:" + objetoConIdActual.estado);
    
      this.bleTrainer.establecerConexionDispositivo(device, objetoConIdActual).then(
        (resultado)=> {console.log("RESULTADO:"+ resultado);
                    estaConectado = resultado},
        (error)=> {console.log("Error conectar"+error)}
      );
      console.log("Está conectado? "+estaConectado);
      if ((estaConectado && objetoConIdActual.estado == "desconectado") ||
        (!estaConectado && objetoConIdActual.estado == "conectado")) // si NO coincide camniamos su estado
        this.info.cambiarEstado(objetoConIdActual);
      console.log("estado una vez llamado a conectar DESPUES:" + objetoConIdActual.estado);
    
    
  }


    /*scan(componente: any) {
      var servicio: string[] = [];
  
      this.devices = []; // clear list
  
      if (componente) {
        servicio = [componente.servicio];
      }
      else servicio = [];
  
      this.ble.scan(servicio, 5).subscribe(
        device => this.onDeviceDiscovered(device),
        error => console.log(error)
      );
  
  
      // this.ble.connect('E3:5E:65:14:16:33')
    }
    */
    // onDeviceDiscovered(device) {
    //   this.ngZone.run(() => {
    //     this.devices.push(device);
    //   });
    // }
    //conexión
    // establecerConexionDispositivo(device: any) {
    //   console.log("tratamos de comprobar la conexion con :" + device.id);
    //   if (device && device.id) {
    //     //si el dispositivo ya está conectado
    //     this.ble.isConnected(device.id).then(
    //       () => console.log("ya estaba conectado"),
    //       () => {
    //         console.log("desconectado");
    //         this.conectarDispositivo(device);
    //       }
    //     )
    //   }
    // }

    // conectarDispositivo(device: any) {
    //   console.log("nos conectamos a :" + device.id);


    //   if (device && device.id) {

    //     this.info.pulso.id = device.id;
    //     this.ble.connect(this.info.pulso.id).subscribe(
    //       peripheral => {
    //         console.log("A"); this.dispositivoConectado(peripheral);
    //         device.estado = "conectado";
    //         device.color = "success";
    //       },
    //       peripheral => { console.log("B"); this.dispositivoDesconectado(peripheral) }
    //     );
    //   }
    // }

    // dispositivoConectado(peripheral) {
    //   this.ngZone.run(() => {
    //     this.peripheral = peripheral;
    //   });
    //   console.log('dispositivoConectado ' + JSON.stringify(this.peripheral));
    //   //actualizamos el estado 
    // }

    // async dispositivoDesconectado(peripheral) {
    //   const toast = await this.toastCtrl.create({
    //     message: 'The peripheral unexpectedly disconnected',
    //     duration: 3000,
    //     position: 'middle'
    //   });
    //   toast.present();
    // }

    /************************************************************ */
    //      PULSO Y CADENCIA Y VELOCIDAD
    /************************************************************ */
    leerPulso(device: any) { //device :any){
      var pulso: any;
      console.log("entramos en leer pulso");
      this.bleTrainer.subscribirNotificacion(device, device.servicio, device.caracteristica);


      //this.subscribe();


      // this.ble.startNotification(
      //   this.info.pulso.id,
      //   '180d',
      //   '2a37')
      //   .subscribe(buffer => {
      //     //pulso= String.fromCharCode.apply(null, new Uint8Array(buffer));
      //     //pulso = new Uint8Array(buffer);
      //     console.log("Notification:" + JSON.stringify(String.fromCharCode.apply(null, new Uint32Array(buffer))));
      //     //console.log("resultado : " + JSON.stringify(pulso[0]) + "#" +
      //     //  JSON.stringify(pulso[1]) + "valor:"+ pulso[0]+ "#" +pulso[1]);
      //     this.lectura('180d', '2a02');

      //   });
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


    desconectar(uuid: string) {
      this.ble.isConnected(uuid).then(() =>
        this.ble.disconnect(uuid).then(() => console.log("lo he desconectado")))

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