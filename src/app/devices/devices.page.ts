import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
  // private datos = {
  //   infoBLE: [
  //     {
  //       uuid: "valor",
  //       tipo: "Bici",
  //       nombre: "SMB1",
  //       estado: "conectado"
  //     },
  //     {
  //       uuid: "valor2",
  //       tipo: "Pulsometro",
  //       nombre: "PULS",
  //       estado: "desconectado"
  //     }
  //   ]
  // };
  private info: any;
  constructor(private router: Router, private activatedRoute :ActivatedRoute) {
     this.activatedRoute.queryParams.subscribe((params) => {
       this.info = JSON.parse(params.info);
     }
     );
  }

  ngOnInit() {
  }

  sendParam() {
    let paramRouter: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(this.info)

      }
    };
    // console.log("vvvv:",paramRouter);
    this.router.navigate(['home'], paramRouter);
  }

  cambiarEstado(dispositivo: string) {
    //let this.estadoBici=dispositivo;
    
    if (dispositivo = "desconectado") {
      dispositivo = "conectado";
    }
    else {
      dispositivo = "desconectado";
    }
    
  }
}
