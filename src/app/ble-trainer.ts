import { NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

export class BleTrainer {
    public devices: any[] = [];
    public peripheral: any = {};
    public pulsaciones: any;
    public cadencia : any;
    public biciNivel: any;
    public biciVel: any;
    public biciVelMed: any;
    public power;

    public ble: BLE;
    public zona: NgZone;

    constructor() {
        this.ble = new BLE();
        this.zona = new NgZone({});
        this.pulsaciones = 0;
        this.biciNivel = null;
        this.biciVel = null;
        this.biciVelMed = null;
        this.power=0;
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

    async establecerConexionDispositivo(objetoConexion: any, objetoConIdActual: any) {
        var conectado: boolean = false;
        console.log("ENRTAMOS segundo paramerto:" +objetoConIdActual);
        console.log("tratamos de comprobar la conexion con :" + objetoConexion.id);
        if (objetoConexion && objetoConexion.id) {

            conectado = await this.estaConectado(objetoConexion.id);
            //si el dispositivo NO está conectado
            if (!conectado) {
                console.log("estaba desconectado");
                // if (objetoConIdActual.id && objetoConexion.id != objetoConIdActual.id) {
                //     objetoConIdActual.id = objetoConexion.id; // actualizo el id del objeto pasado
                //    //objetoConexion.id= objetoConIdActual.id;
                //    console.log("actualizamos el id para conectarnos");
                // } else{
                //     console.log("no actualizamos el id porque ya lo tenía bien ")
                // }

                conectado = await this.conectarDispositivo(objetoConexion, objetoConIdActual); //conectamos
                // dentro de la funcion cambiamos el estado
                console.log("(BLE) conectarDispositivo devuelve -->" + conectado + " (dentro de establecerConexionDispositivo) ");
            }
            else {
                console.log("PPP: El dispositivo ya estaba conectado");
            }

        } else
            console.log("Error en la función establecerConexionDispositivo, mal objeto objetoConexion");

        ///////// conectado= await this.estaConectado(objetoConexion.id);
        return conectado;
    }
    async conectarDispositivo(device: any, objetoConIdActual?: any) {
        console.log("00: nos conectamos a :" + device.id + " y actualizamos el objetoConIdActual" + objetoConIdActual.nombre);
        var resultado: boolean = false;
        if (device && device.id) {
            // actualizamos el id del objeto
            resultado = await new Promise(resolve =>
                this.ble.connect(device.id).subscribe(
                    peripheral => {

                        this.dispositivoConectado(peripheral);
                        if (objetoConIdActual) {
                            objetoConIdActual.estado = "conectado"; //no es correcto
                            objetoConIdActual.color = "success";
                            objetoConIdActual.id = device.id;
                            console.log("ver objetoConIdActual: id->" + objetoConIdActual.id);

                        }
                        console.log("AA");
                        resolve(true);

                    },
                    peripheral => {
                        console.log("dispositivo desconectado");
                        if (objetoConIdActual) {
                            objetoConIdActual.estado = "desconectado"; //no es correcto
                            objetoConIdActual.color = "danger";

                        }
                        console.log("BB");
                        resolve(false);

                        //this.dispositivoDesconectado(peripheral) 
                    }

                )

            );


            // this.ble.connect(device.id).subscribe(
            //     peripheral => {

            //         this.dispositivoConectado(peripheral);
            //         if (objetoConIdActual){
            //             objetoConIdActual.estado = "conectado"; //no es correcto
            //             objetoConIdActual.color = "success";
            //             objetoConIdActual.id=device.id;
            //             console.log("ver objetoConIdActual: id->"+objetoConIdActual.id);

            //         }
            //         console.log("AA");


            //     },
            //     peripheral => {
            //         console.log("dispositivo desconectado");
            //         if (objetoConIdActual){
            //             objetoConIdActual.estado = "desconectado"; //no es correcto
            //             objetoConIdActual.color = "danger";

            //         }
            //         console.log("BB");
            //         resultado= false;

            //         //this.dispositivoDesconectado(peripheral) 
            //     }

            // );


        }
        else {
            console.log("CC: conectarDispositivo: Error al pasar el id del dispositivo a conectar");
            
        }
        console.log("DD: antes de devolver vale-->" + resultado);
        return resultado;



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
        var seDesconecto: boolean = false;
        this.ble.isConnected(uuid).then(
            () => {
                this.ble.disconnect(uuid).then(() => {
                    console.log("lo he desconectado");
                    seDesconecto = true;
                })
            },
            () => console.log("tratando de desconectar pero el dispositivo no estaba conectado")
        )
        return seDesconecto;
    }
    /************************************************************************************* */
    /* NOTIFICACIONES */
    async pararNotificacion() {
        this.ble.stopStateNotifications().then(
            () => console.log("paramos las notificaciones"),
            () => console.log("error al parar las notificaciones")
        );
    }
    subscribirNotificacion(device: any, servicio: string, caract: string) { //device = pulso o bici
        console.log("tratando de notificar bici: " + device.nombre + " - " + device.id + " S:" + servicio + " C:" + caract);

        if (device && device.id) {
            this.ble
                .startNotification(device.id,
                    servicio,
                    caract)
                .subscribe(
                    data => {
                        if (device.nombre=="Pulsómetro")
                            this.onValueChange(data[0], device);
                        else
                            this.onValueChange(data[0], device);
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
    onValueChange(buffer: ArrayBuffer, device:any) { //hay que meter en la zona asíncrona
        var dataFromDevice: any;
        this.zona.run(() => {
            try {
                //console.log("entra en valuechange " + device.nombre);
                //if (this.pulsaciones != dataFromDevice[1])
                if (device.nombre=="Pulsómetro") {
                    dataFromDevice = new Uint8Array(buffer);
                    this.pulsaciones = dataFromDevice[1];
                }
                else {
                    console.log("ENTRA");
                    dataFromDevice = new Uint8Array(buffer);
                    //dataFromDevice = String.fromCharCode.apply(null, new Uint8Array(buffer));
                    //console.log("16 datos A-->"+JSON.stringify(dataFromDevice));
                     console.log("datos0-->"+dataFromDevice);
                    
                     device.arrayLectura = dataFromDevice;
                    this.biciNivel=(dataFromDevice[9]+dataFromDevice[10]*256)/10;
                    this.biciVel = (dataFromDevice[2]+dataFromDevice[3]*256)/100;
                    this.biciVelMed = (dataFromDevice[7]); 
                    this.cadencia = (dataFromDevice[4]+dataFromDevice[5]*256)/2;
                    this.power = (dataFromDevice[11]+dataFromDevice[12]*256);

                    //this.cadencia= dataFromDevice;
                    // if (dataFromDevice == undefined)
                    //     dataFromDevice = this.bytesToString(buffer).replace(/\s+/g, " ");
                    // else dataFromDevice += ' ' + this.bytesToString(buffer).replace(/\s+/g, " ");
                   // 84 --> 10000100
                }
                
                //console.log("R:" + (this.pulsaciones) + "bpm" + "- " + dataFromDevice);
                //console.log("R:---" + "- " + dataFromDevice[1]);
               
               
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
