import { Component, OnInit } from '@angular/core';
// import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';

import { InfoBle } from '../info-ble';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // public componentes =[
  //   {
  //     tipo: "bici",
  //     nombre: "Bicicleta",
  //     estado: "desconectado",
  //     color: "danger",
  //     servicio: "1826",
  //     uuid: null,
  //     mac: null
  //   },
  //   { tipo: "pulso",
  //     nombre: "Pulsómetro",
  //     estado: "desconectado",
  //     color: "danger",
  //     servicio: "1111",
  //     uuid: null,
  //     mac: null
  //   }
  // ];
  public info2 = {
    bici: {
      nombre: "Bicicleta",
      estado: "desconectado",
      color: "danger",
      servicio: "1826",
      uuid: null,
      mac: null
    },
    pulso: {
      nombre: "Pulsómetro",
      estado: "desconectado",
      color: "danger",
      servicio: "1111",
      uuid: null,
      mac: null
    }
  };


  constructor(
    private info: InfoBle, //IMPLEMENTACION FUTURA CLASE
    private activatedRoute: ActivatedRoute,
    private router: Router
    // private router: Router
  ) { 
   
  }

  ngOnInit() {
    
    // //obtenemos un JSON con los parámetros pasados por otra ventana.
    // this.activatedRoute.queryParams.subscribe(params => {
    //   //si existe la sección INFO
    //   if (params && params.info){
    //    //convertimos los parámetros a JSON
    //    this.datos=JSON.parse(params.info);

    //    //llamos a una función para actualizar el estado de la Bici     
    //    let indice = this.buscarIndiceJSONarray(this.datos.infoBLE,"tipo", "Bici");
    //    if(indice>=0){
    //     this.estadoBici= this.datos.infoBLE[indice].estado;
    //    }
    //    indice = this.buscarIndiceJSONarray(this.datos.infoBLE,"tipo", "Pulsometro");
    //    if(indice>=0){
    //     this.estadoPulso= this.datos.infoBLE[indice].estado;
    //    }
    //   }

    // });

  }
  // buscarIndiceJSONarray(objeto: any[], campo: any, valor: string){
  //   console.log("Entra en buscarJSON" + objeto);
  //   for (let i=0;  i< objeto.length; i++){
  //     if (objeto[i] && objeto[i].tipo){
  //       // console.log(i+" :" + objeto[i].tipo + "="+valor);
  //       if (objeto[i].tipo ==valor)
  //         return i;
  //     }
  //   }
  //   return null;
  // }

   ionViewWillEnter() {

     this.activatedRoute.queryParams.subscribe((params) => {
       if (params && params.info) {
         this.info = JSON.parse(params.info);
         console.log("entra " + this.info.bici.estado);
         //convertimos info en un objeto InfoBle
          this.info = new InfoBle(this.info.bici, this.info.pulso);
         
       }
     }
     );
   }
  /* prueba cambiando JSON */
  // cambiarEstado(componente) {
  //   if (componente.estado == "conectado") {
  //     componente.estado = "desconectado";
  //     componente.color = "danger"
  //   }
  //   else {
  //     componente.estado = "conectado";
  //     componente.color = "success";
  //   }

  // }

  sendParam(page: string) {
    let paramRouter: NavigationExtras = {
      queryParams: {
        //special: JSON.stringify(this.componentes),
        info: JSON.stringify(this.info)
      }
    };
    this.router.navigate([page], paramRouter);
  }

}
