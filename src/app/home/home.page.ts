import { Component, OnInit } from '@angular/core';
// import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public estadoBici: string ="desconectado";
  private estadoPulso: string ="desconectado";
  private datos : any;
  constructor(
    // private estadoBLE: any ,
    private activatedRoute: ActivatedRoute
    // private router: Router
    ) {}

  ngOnInit(){
    //obtenemos un JSON con los parámetros pasados por otra ventana.
    this.activatedRoute.queryParams.subscribe(params => {
      //si existe la sección INFO
      if (params && params.info){
       //convertimos los parámetros a JSON
       this.datos=JSON.parse(params.info);
       
       //llamos a una función para actualizar el estado de la Bici     
       let indice = this.buscarIndiceJSONarray(this.datos.infoBLE,"tipo", "Bici");
       if(indice>=0){
        this.estadoBici= this.datos.infoBLE[indice].estado;
       }
       indice = this.buscarIndiceJSONarray(this.datos.infoBLE,"tipo", "Pulsometro");
       if(indice>=0){
        this.estadoPulso= this.datos.infoBLE[indice].estado;
       }
      }
      
    });
     
  }
  buscarIndiceJSONarray(objeto: any[], campo: any, valor: string){
    console.log("Entra en buscarJSON" + objeto);
    for (let i=0;  i< objeto.length; i++){
      if (objeto[i] && objeto[i].tipo){
        // console.log(i+" :" + objeto[i].tipo + "="+valor);
        if (objeto[i].tipo ==valor)
          return i;
      }
    }
    return null;
  }  
}
