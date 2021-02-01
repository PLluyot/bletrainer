import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; //recibir
import { Router, NavigationExtras } from '@angular/router'; //enviar
//mis clases
import { InfoBle } from '../info-ble';
import { BleTrainer} from '../ble-trainer';

//pruebas con BLE
// import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  // private info: InfoBle;
  private devices : any[] =[];
 // private bleTrainer: BleTrainer; 
  // private aboutZone: NgZone;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private info: InfoBle, //IMPLEMENTACION CLASE
    private bleTrainer: BleTrainer, //IMPLEMENTACION CLASE
    private ngZone: NgZone)
     {

    //recibimos el objeto InfoBle por parámetros
    this.activatedRoute.queryParams.subscribe((params) => {
      this.info = JSON.parse(params.info);
      console.log(this.info.bici);
      //convertimos info en un objeto InfoBle
      this.info = new InfoBle(this.info.bici, this.info.pulso);
    
    }
    );
  }
  ionViewDidEnter() {
    
   }
   
   ngOnInit() {
   }
  scan() {
    this.bleTrainer.encenderBle();
    var pruebaservicios: any[]=[];
    //  ['1826','1827','1800'];
    this.devices = []; // clear list
    console.log("entra");
   // this.ngZone.run(() => {
      this.bleTrainer.scan(pruebaservicios).then(
        (dispositivosEncontrados: any[]=[]) => this.devices=dispositivosEncontrados,
        (error) => console.log(error)
        );  
   // });
    
    //console.log("ppp:"+this.devices[0])
    // this.ble.connect('E3:5E:65:14:16:33')
  }
  // onDeviceDiscovered(device){
  //   this.ngZone.run(() => {
  //     this.devices.push(device);
  //   });
  // }
  
  sendParam() {
    console.log("aaaa----"+this.bleTrainer.devices[0].id);
    let paramRouter: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(this.info)
        //bleTrainer: this.bleTrainer
      }
    };
    this.router.navigate(['/home'], paramRouter);
  }
}
