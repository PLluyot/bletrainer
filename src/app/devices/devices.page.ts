import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras} from '@angular/router';
//import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
  private estadoBici : string = "desconectado";
  private estadoPulso : string = "desconectado";
  private datos = {infoBLE:[
                        {
                          uuid:"valor",
                          tipo:"Bici",
                          nombre:"SMB1",
                          estado:"conectado"
                        },
                        {
                          uuid:"valor2",
                          tipo:"Pulsometro",
                          nombre:"PULS",
                          estado:"desconectado"
                        }
                            ]
                  };
    constructor(private router : Router) {
      console.log("entra:" + JSON.stringify(this.datos));
     }

  ngOnInit() {
  }
  
  sendParam(){
    let paramRouter : NavigationExtras = {
      queryParams: {
                      info: JSON.stringify(this.datos)
                    
                  }
      };
      // console.log("vvvv:",paramRouter);
    this.router.navigate(['home'], paramRouter);  
   }
  
    cambiarEstado(dispositivo: string){
      //let this.estadoBici=dispositivo;
      console.log("A-Bici:"+this.estadoBici);
      if (dispositivo="desconectado"){
        dispositivo="conectado";
      }
      else {
        dispositivo="desconectado";
      }
      console.log("D-Bici:"+this.estadoBici);
    }
}
