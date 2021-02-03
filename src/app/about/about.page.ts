import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit, NgZone , ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router'; //recibir
import { Router, NavigationExtras } from '@angular/router'; //enviar
//mis clases
import { InfoBle } from '../info-ble';
import { BleTrainer} from '../ble-trainer';

//pruebas con chars
import { Chart } from 'chart.js';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  // private info: InfoBle;
  private devices : any[] =[];
  @ViewChild('barChart') barChart;
  bars: any;
  colorArray: any;
 // private bleTrainer: BleTrainer; 
  // private aboutZone: NgZone;
  private pruebaValor:number=100;

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
    this.createBarChart();
   }
   createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Pulso', 'Cadencia', 'Velocidad', 'Potencia', 'FTP'],
        datasets: [{
          label: 'Viewers in millions',
          data: [this.pruebaValor, 134, 22, 132, 67],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        },{
          label: 'Viewers in millions2',
          data: [180, 80, 19, 180, 30],
          backgroundColor: ["lightred","blue","yellow"],// array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes:[{
            stacked: true
          }] 
        }
      }
    });
  }
   
   ngOnInit() {
   }
   
  sendParam() {
     let paramRouter: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(this.info)
        //bleTrainer: this.bleTrainer
      }
    };
    this.router.navigate(['/home'], paramRouter);
  }
}
