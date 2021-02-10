import { Component, OnInit, NgZone } from '@angular/core'; //, OnChanges, SimpleChanges 
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';

import { InfoBle } from '../info-ble';
import { BleTrainer } from '../ble-trainer';
//pruebas con chars
import { InfoCharts } from '../info-charts';
import { timer } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private mensajeEstado: string = "";
  private chartPulso: InfoCharts;
  public chartNivel: InfoCharts;
  private chartTrack: InfoCharts;
  private nivelBici = 0;
  ////private numeros=timer(3000,10000);

  constructor(
    private info: InfoBle, //IMPLEMENTACION CLASE
    private bleTrainer: BleTrainer, //IMPLEMENTACION CLASE
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone) {
      this.chartPulso = new InfoCharts("pulso");
      this.chartNivel = new InfoCharts("nivel");
      this.chartTrack = new InfoCharts("track");
  }
  ngOnInit() {
///this.numeros.subscribe(x => console.log(x));
  }
  ionViewWillEnter() {
    this.getParam();
    //metemos una zona asincrona, el valor del nivel de la bici para que lo pinte en la gráfica
    
    //console.log(this.chartNivel.chartData);
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   for (let propName in changes) {
  //     let change = changes[propName];
  //     let curVal = JSON.stringify(change.currentValue);
  //     let prevVal = JSON.stringify(change.previousValue);

  //     console.log("CAMBIO: " + prevVal + " nuevovalor: " + curVal);

  //   }
  // }


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
      else await this.leerBicicleta(device);
    }
    else { //en otro caso nos conectamos
      if (device.id) //si tenemos un device.id
      {
        console.log("home 1 - vamos a conectarnos a :" + device.id + "-" + device.servicio);
        //return (this.bleTrainer.establecerConexionDispositivo(device, device));
        conectado = await this.bleTrainer.establecerConexionDispositivo(device, device);
        console.log("home 1 - estado" + conectado);

        if (conectado && device.nombre == "Pulsómetro") await this.leerPulso(device);
        if (conectado && device.nombre == "Bicicleta") await this.leerBicicleta(device);

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
      const seHaConectado = await this.conectar(dispositivo);
      console.log("resultado de seha conectado" + seHaConectado);
      // if (seHaConectado) this.info.cambiarEstado(dispositivo)
      // else this.sendParam('devices');
      if (seHaConectado) this.info.ponerEstado(dispositivo, "conectado")
      else this.sendParam('devices');

    } else {
      //desconectamos el dispositivo en el caso de estar conectado
      if (dispositivo.estado == "conectado") {
        //desconectamos el dispositivo
        await this.bleTrainer.cancelarSubscripcion(dispositivo, dispositivo.servicio, dispositivo.caracteristica);
        var resultado = await this.bleTrainer.desconectarDispositivo(dispositivo.id); //FALLA
        console.log("home - 2 - hemos llamado a desconectar el dispositivo con resultado: " + resultado);
        // y cambiamos su estado (clase InfoBle)
        this.info.ponerEstado(dispositivo, "desconectado");
      };
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
  leerBicicleta(device: any) {
    console.log("home 3- leer bici - entramos en leer bici :" + device.nombre);

    this.bleTrainer.subscribirNotificacion(device, device.servicio, device.caracteristica);

  }

  //recuperamos los parámetros de otra ventana y actualizamos el objeto InfoBle
  getParam() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.info) {
        this.info = JSON.parse(params.info);
        this.info = new InfoBle(this.info.bici, this.info.pulso);
        console.log("(1-home) Entramos en la página y pintamos info.bici" + JSON.stringify(this.info.bici));
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
  async escribirBici() { //inicia petición para poder manejar los niveles.

    //mandamos señal de petición 
    var datos = new Uint8Array(1);
    datos[0] = 0x00;
    var res = await this.bleTrainer.write(this.info.bici, this.info.bici.servicio, '2ad9', datos.buffer);
    console.log("Primer resultado: " + res);

    //mandamos de nuevo señal para iniciar training
    datos[0] = 0x07;
    res = await this.bleTrainer.write(this.info.bici, this.info.bici.servicio, '2ad9', datos.buffer);
    console.log("Segundo resultado: " + res);

  }
  // async escribirNivel(){

  //   var datos =new Uint8Array(3);
  //   datos[0]= 0x04;
  //   datos[1]= 0x1E;// 4 1 :26    0 1 : 25
  //   datos[2]= 0x01;// 255



  //   var res = await this.bleTrainer.write(this.info.bici, this.info.bici.servicio, '2ad9', datos.buffer);
  //   console.log("Primer resultado: "+res);
  // }
  subirNivel() {
    
    if (this.nivelBici >= 32) this.nivelBici = 32;
    else {
      if (this.escribirNuevoNivel(this.nivelBici+1)){
      //actualizamos la gráfica
        this.nivelBici++; //subimos el nivel
        this.chartNivel.chartData[0].data[0] = this.nivelBici;
        this.chartNivel.chartData = this.chartNivel.chartData.slice();
      }
    }
  }
  bajarNivel() {
  if (this.nivelBici <= 1) this.nivelBici = 1;
    else {
      if (this.escribirNuevoNivel(this.nivelBici-1)){
      //actualizamos la gráfica
        this.nivelBici--; //subimos el nivel
        this.chartNivel.chartData[0].data[0] = this.nivelBici;
        this.chartNivel.chartData = this.chartNivel.chartData.slice();
      }
    }
  }
  async escribirNuevoNivel(num: number) {
    if (num > 32) num = 32;
    if (num < 0) num = 0;
    var res = await this.bleTrainer.write(this.info.bici, this.info.bici.servicio, '2ad9', this.info.nivel[num].buffer);
    return res;
 
  }
  movergraf(){
    this.chartTrack.temporizador();
    
    
    //this.chartTrack.
  }
}