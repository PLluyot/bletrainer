import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { InfoBle } from '../info-ble';
import { BleTrainer } from '../ble-trainer';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  private _storage: Storage | null = null;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private info: InfoBle, //IMPLEMENTACION CLASE
    private bleTrainer: BleTrainer, //IMPLEMENTACION CLASE
    private storage: Storage
  ) { }

  /******************INICIO************ */
  async ngOnInit() {
    
    const storage = await this.storage.create();
    this._storage = storage;
  }
  ionViewWillEnter() {
    this.getParam();
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
  sendParam() {
    let paramRouter: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(this.info)
      }
    };
    this.router.navigate(['/home'], paramRouter);
  }

  setValorStorage(clave:string ,valor: any){
    this._storage.set(clave, valor)
  }
  getValorStorage(clave:string){
    this._storage.get(clave).then((valor)=>console.log(valor));
    
  }
}
