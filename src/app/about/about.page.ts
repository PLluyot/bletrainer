import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; //recibir
import { Router, NavigationExtras } from '@angular/router'; //enviar

import { InfoBle } from '../info-ble';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  private info: InfoBle;


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.info = JSON.parse(params.info);
      console.log(this.info.bici);
      //convertimos info en un objeto InfoBle
      this.info = new InfoBle(this.info.bici, this.info.pulso);

    }
    );
  }

  ngOnInit() {
  }

  sendParam() {
      /*if (this.info && this.info.bici){
      this.info.bici.estado="prueba";
      console.log("prueba: "+JSON.stringify(this.info.bici.estado));
    }*/
    let paramRouter: NavigationExtras = {
      queryParams: {
        //special: JSON.stringify(this.componentes),
        info: JSON.stringify(this.info)
      }
    };

    this.router.navigate(['/home'], paramRouter);
  }
}
