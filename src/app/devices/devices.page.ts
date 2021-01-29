import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { InfoBle } from '../info-ble';
import { ToastController } from '@ionic/angular';
//pruebas con BLE
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
  private info: InfoBle;
  private devices: any[] = [];
  private peripheral: any = {};
  dataFromDevice: any;
  private pulsaciones  = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private ble: BLE,
    private ngZone: NgZone,
    private toastCtrl: ToastController) {

    //recibimos el objeto InfoBle por parámetros
    this.activatedRoute.queryParams.subscribe((params) => {
      this.info = JSON.parse(params.info);
      console.log(this.info.bici);
      //convertimos info en un objeto InfoBle
      this.info = new InfoBle(this.info.bici, this.info.pulso);
    }
    );
  }
  scan(componente: any) {
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
  onDeviceDiscovered(device) {
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }
  //conexión
  establecerConexionDispositivo(device: any) {
    console.log("tratamos de comprobar la conexion con :" + device.id);
    if (device && device.id) {
      //si el dispositivo ya está conectado
      this.ble.isConnected(device.id).then(
        () => console.log("conectado"),
        () => {
          console.log("desconectado");
          this.conectarDispositivo(device);
        }
      )
    }
  }

  conectarDispositivo(device: any) {
    console.log("nos conectamos a :" + device.id);


    if (device && device.id) {

      this.info.pulso.id = device.id;
      this.ble.connect(this.info.pulso.id).subscribe(
        peripheral => {
          console.log("A"); this.dispositivoConectado(peripheral);
          device.estado = "conectado";
          device.color = "success";
        },
        peripheral => { console.log("B"); this.dispositivoDesconectado(peripheral) }
      );
    }
  }

  dispositivoConectado(peripheral) {
    this.ngZone.run(() => {
      this.peripheral = peripheral;
    });
    console.log('dispositivoConectado ' + JSON.stringify(this.peripheral));
    //actualizamos el estado 
  }

  async dispositivoDesconectado(peripheral) {
    const toast = await this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  /************************************************************ */
  //      PULSO Y CADENCIA Y VELOCIDAD
  /************************************************************ */
  obtenerPulso() { //device :any){
    var pulso: any;
    this.subscribe();
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
  ionViewDidEnter() {

    //this.scan("");
    this.ble.isConnected(this.info.pulso.id).then(
      () => console.log("conectado a pulso"),
      () => console.log("NO conectado a pulso"),

    )
  }

  ngOnInit() {
    //this.scan("");
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

      function (data){
        //console.log("READ:" + String.fromCharCode.apply(null, new Uint8Array(data)));
        console.log ("Read" + JSON.stringify(data));
      }, function(error) {
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

  escriboDato() {
    var inputdata = new Uint8Array(3);
    inputdata[0] = 0x53; // S
    inputdata[1] = 0x54; // T
    inputdata[2] = 0x0a; // LF
    this.ble.writeWithoutResponse(

      this.info.pulso.id,
      '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
      inputdata.buffer
    )
      .then(
        data => {


          console.log("retorno:" + data);
          //debugger;
          this.obtenerPulso()
        },
        () =>

          //this.showAlert(
          console.log("Unexpected Error",
            "Failed to subscribe for changes, please try to re-connect.")
      )
    }
    /*************************************************************** */
    encenderBle (){
      this.ble.enable().then(
        ()=>console.log("enciendo BLE")
        ,
        ()=>console.log("error al encender")
      );

    }


    /************************************** */
    /****************************************** */
    subscribe() {
    
      this.ble
          .startNotification(this.info.pulso.id,
          '180d', '2a37')
          .subscribe(
              data => {
               // console.log("aqui"+data[0]);
                  this.onValueChange(data[0]);
                  
              },
              () =>
             
      //this.showAlert(
      console.log(         "Unexpected Error",
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
            this.dataFromDevice= new Uint8Array(buffer);
            this.pulsaciones = this.dataFromDevice[1];
              //if (this.dataFromDevice == undefined)
              //         this.dataFromDevice = this.bytesToString(buffer).replace(/\s+/g, " ");

             // else this.dataFromDevice += ' ' + this.bytesToString(buffer).replace(/\s+/g, " ");
              console.log("R:"+(this.pulsaciones)+"bpm" + "- "+this.dataFromDevice);
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
}