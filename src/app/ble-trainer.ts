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
    /*******************ESTA CONECTADO?************ */
    async estaConectado(deviceId: string) {
        var conectado: boolean = false;
        this.ble.isConnected(deviceId).then(
            () => { conectado = true },
            () => { conectado = false }
        )
        return conectado;
    }
    /******************************************************************** */
    /* ESCANEAR BLE */
    scan(servicios: any[] = null) { //pasar 
        // var servicio: string[] = [];
        // this.zona=zona;
        this.devices = []; // clear list

        this.ble.scan(servicios, 5).subscribe(
            (device) => this.onDeviceDiscovered(device),
            (error) => new Error(error)
        );
        return new Promise(
            (encontrado, error) => {
                setTimeout(
                    () => this.devices
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
    /* objetoConexion: objeto con propiedad id, puede ser obtenido de un scaneo o bien pulso o bici
    /*          con el que vamos a establecer la conexion*/
    /* objetoconIdactual: objeto con id (id actualizado de la ultima conexion)
                si no existe lo vamos aactualizar con el valor pulsado*/
    /* si está conectado a objetoConexion, no hacemos nada
    /* si no lo está usamos el id objetoConIdActual para conectarnos y acrtualiza objetoConexion */

    async  establecerConexionDispositivo(objetoConexion: any, objetoConIdActual?: any) {
        var conectado: boolean = false;
        console.log("tratamos de comprobar la conexion con :" + objetoConexion.id);
        if (objetoConexion && objetoConexion.id) {
            
            await this.estaConectado(objetoConexion.id).then((res)=>conectado=res);
            //si el dispositivo NO está conectado
            if (!conectado){
                console.log("estaba desconectado");
                // if (objetoConIdActual.id && objetoConexion.id != objetoConIdActual.id) {
                //     objetoConIdActual.id = objetoConexion.id; // actualizo el id del objeto pasado
                //    //objetoConexion.id= objetoConIdActual.id;
                //    console.log("actualizamos el id para conectarnos");
                // } else{
                //     console.log("no actualizamos el id porque ya lo tenía bien ")
                // }
                
                await this.conectarDispositivo(objetoConexion, objetoConIdActual); //conectamos
                // dentro de la funcion cambiamos el estado
            }
            else {
                console.log("PPP: El dispositivo ya estaba conectado");
            }
            
        }else
        console.log("Error en la función establecerConexionDispositivo, mal objeto objetoConexion");
        
        await this.estaConectado(objetoConexion.id); //devolvemos si está o no conectado
        return conectado;
    }
    async conectarDispositivo(device: any, objetoConIdActual?: any) {
        console.log("nos conectamos a :" + device.id);
        if (device && device.id) {
            // actualizamos el id del objeto
            this.ble.connect(device.id).subscribe(
                peripheral => {
                    console.log("A"); 
                    this.dispositivoConectado(peripheral);
                    if (objetoConIdActual){
                        objetoConIdActual.estado = "conectado"; //no es correcto
                        objetoConIdActual.color = "success";
                        objetoConIdActual.id=device.id;
                    }
                    
                },
                peripheral => {
                    console.log("dispositivo desconectado");
                    if (objetoConIdActual){
                        objetoConIdActual.estado = "desconectado"; //no es correcto
                        objetoConIdActual.color = "danger";
                    }
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
    desconectarDispositivo(uuid: string) {
        this.ble.isConnected(uuid).then(
            () => { this.ble.disconnect(uuid).then(() => console.log("lo he desconectado")) },
            () => console.log("tratando de desconectar pero el dispositivo no estaba conectado")
        )

    }
    /************************************************************************************* */
    /* NOTIFICACIONES */
    async pararNotificacion(){
        this.ble.stopStateNotifications().then(
            ()=>console.log("paramos las notificaciones"),
            ()=>console.log("error al parar las notificaciones")
        );
    }
    subscribirNotificacion(device: any, servicio: string, caract: string) { //device = pulso o bici
        console.log("tratando de notificar pulso: "+device.id+" S:"+ servicio+" C:"+ caract);
        
        if (device && device.id) {
            this.ble
                .startNotification(device.id,
                    servicio,
                    caract)
                .subscribe(
                    data => {
                        this.onValueChange(data[0]);
                    },
                    // () =>//this.showAlert(
                    //     console.log("Unexpected Error",
                    //         "Failed to subscribe for changes, please try to re-connect."
                    //     )
                    () => {
                        console.log("Error en la subscripción de notificación.");
                    }
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
               //if (this.pulsaciones != dataFromDevice[1])
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
