import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; //recibir
import { Router, NavigationExtras } from '@angular/router'; //enviar

import { InfoBle } from '../info-ble';

//pruebas con BLE
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  private info: InfoBle;
  private devices : any[] =[];

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private ble: BLE,
    private ngZone: NgZone) {

    //recibimos el objeto InfoBle por parámetros
    this.activatedRoute.queryParams.subscribe((params) => {
      this.info = JSON.parse(params.info);
      console.log(this.info.bici);
      //convertimos info en un objeto InfoBle
      this.info = new InfoBle(this.info.bici, this.info.pulso);
    }
    );
    

    
  }
  scan() {
    this.devices = []; // clear list

    this.ble.scan(['180d'], 10).subscribe(
      device => this.onDeviceDiscovered(device),
      error => console.log(error)
    );
    console.log("ppp:"+this.devices[0])
    // this.ble.connect('E3:5E:65:14:16:33')
  }
  onDeviceDiscovered(device){
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }
  
  ionViewDidEnter() {
   // this.scan();
  }
  
  ngOnInit() {
  }


  sendParam() {
    let paramRouter: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(this.info)
      }
    };
    this.router.navigate(['/home'], paramRouter);
  }
}
