import { NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

export class BleTrainer {
    public devices: any[] = [];
    public peripheral: any = {};
    public pulsaciones: any;

    public ble: BLE;
    public zona: NgZone;

    constructor() {
        this.ble = new BLE();
        this.zona = new NgZone({});
        this.pulsaciones = 0;
    }
    /* ENCENDER BLE */
    encenderBle() {
        this.ble.enable().then(
            () => console.log("enciendo BLE")
            ,
            () => console.log("error al encender")
        );
    }
    /******************************************************************** */
    /* ESCANEAR BLE */
    scan(servicios: any[] = null) { //pasar 
        // var servicio: string[] = [];
        // this.zona=zona;
        this.devices = []; // clear list

        this.ble.scan(servicios, 5).subscribe(
            (device) => this.onDeviceDiscovered(device),
            (error) =>  new Error(error)
        );
        return new Promise(
            (encontrado, error) => {
                setTimeout(
                    ()=> this.devices
                         ? encontrado(this.devices)
                         : error(new Error("mal")),
                    1000
                )
            }
        );
    }
    onDeviceDiscovered(device) {
        this.zona.run(() => {
            this.devices.push(device);
        });
    }
    /********************************************************************* */
    /* CONECTAR CON DISPOSITIVO BLE */
    establecerConexionDispositivo(device: any, objetoConIdActual?: any) {
        console.log("tratamos de comprobar la conexion con :" + device.id);
        if (device && device.id) {
            //si el dispositivo ya está conectado
            this.ble.isConnected(device.id).then(
                () => console.log("ya estaba conectado"),
                () => {
                    if (objetoConIdActual && device.id != objetoConIdActual.id) {
                        objetoConIdActual.id = device.id; // actualizo el id del objeto pasado
                    }
                    console.log("desconectado");
                    this.conectarDispositivo(device);
                }
            )
        }
    }
    conectarDispositivo(device: any) {
        console.log("nos conectamos a :" + device.id);
        if (device && device.id) {
            // actualizamos el id del objeto
            this.ble.connect(device.id).subscribe(
                peripheral => {
                    console.log("A"); this.dispositivoConectado(peripheral);
                    device.estado = "conectado";
                    device.color = "success";
                },
                peripheral => {
                    console.log("dispositivo desconectado");
                    //this.dispositivoDesconectado(peripheral) 
                }
            );

        }
        else
            console.log("conectarDispositivo: Error al pasar el id del dispositivo a conectar");
    }

    dispositivoConectado(peripheral) {
        this.zona.run(() => {
            this.peripheral = peripheral;
        });
        console.log('dispositivoConectado ' + JSON.stringify(this.peripheral));
        //actualizamos el estado 
    }

    /*async dispositivoDesconectado(peripheral) {
        const toast = await this.toastCtrl.create({
            message: 'The peripheral unexpectedly disconnected',
            duration: 3000,
            position: 'middle'
        });
        toast.present();
    }*/

    /* DESCONECTAR DISPOSITIVO */
    desconectarBle(uuid: string) {
        this.ble.isConnected(uuid).then(
            () => { this.ble.disconnect(uuid).then(() => console.log("lo he desconectado")) },
            () => console.log("tratando de desconectar pero el dispositivo no estaba conectado")
        )

    }
    /************************************************************************************* */
    /* NOTIFICACIONES */
    subscribirNotificacion(device: any, servicio: string, caract: string) { //device = pulso o bici
        if (device && device.id) {
            this.ble
                .startNotification(device.id,
                    servicio,
                    caract)
                .subscribe(
                    data => {
                        this.onValueChange(data[0]);
                    },
                    () =>//this.showAlert(
                        console.log("Unexpected Error",
                            "Failed to subscribe for changes, please try to re-connect."
                        )
                );
        }
        else
            console.log("no podemos subscribirnos, parametros incorrectos");
    }
    onValueChange(buffer: ArrayBuffer) { //hay que meter en la zona asíncrona
        var dataFromDevice: any;
        this.zona.run(() => {
            try {
                dataFromDevice = new Uint8Array(buffer);
                if (this.pulsaciones!=dataFromDevice[1])
                this.pulsaciones = dataFromDevice[1];
                //if (this.dataFromDevice == undefined)
                //         this.dataFromDevice = this.bytesToString(buffer).replace(/\s+/g, " ");

                // else this.dataFromDevice += ' ' + this.bytesToString(buffer).replace(/\s+/g, " ");
                console.log("R:" + (this.pulsaciones) + "bpm" + "- " + dataFromDevice);
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

    /***************************************************************************************
     * 
     *                          PULSO
     * 
     * *************************************************************************************
     */
    // leerPulso(device: any) { //dispositivo con id, servicio y caracteristica
    //     this.ble
    //         .startNotification(device.id,
    //             device.servicio, device.caracteristica)
    //         .subscribe(
    //             data => {
    //                 // console.log("aqui"+data[0]);
    //                 this.onValueChange(data[0]);

    //             },
    //             () =>

    //                 //this.showAlert(
    //                 console.log("Unexpected Error",
    //                     "Failed to subscribe for changes, please try to re-connect."
    //                 )
    //         );
    // }
}
