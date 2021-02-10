//pruebas con chars
import { R3TargetBinder, rendererTypeName } from '@angular/compiler';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { timer } from 'rxjs';

export class InfoCharts {
    // ChartsData
    public chartData: ChartDataSets[] = [];
    public chartLabels: Label[] = [];
    // Options
    public chartOptions: ChartOptions = {};
    public chartColors: Color[] = [];
    public chartType: ChartType = 'bar';
    public showLegend = false;
    /***************************** fin gráficos */
    constructor(tipo: string) {
        switch (tipo) {
            case "pulso":
                this.getChartPulso();
                break;
            case "nivel":
                this.getChartNivel();
                break;
            case "track":
                this.getChartTrack();
                break;
        }

    }
    getChartPulso() {
        this.chartData = [
            { data: [100], label: 'Pulsos' },
            { data: [180], label: 'Pulsos' }
        ];
        this.chartLabels = ['1'];
        // Options
        this.chartOptions = {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        display: false,
                        ticks: {
                            display: false,
                            beginAtZero: true
                        }
                    }
                ],
                xAxes: [{
                    display: false,
                    stacked: true
                }]
            },
            title: {
                display: false,
                text: 'Historico Pulso'
            }

        };
        this.chartColors = [
            {
                borderColor: '#000000',
                backgroundColor: 'purple'
            },
            {
                borderColor: '#000000',
                backgroundColor: 'lightgray'
            }
        ];
        this.chartType = 'bar';
        this.showLegend = false;
    }
    getChartNivel() {
        this.chartData = [
            { data: [23], label: 'Nivel' },
            { data: [32], label: 'Nivel' }
        ];
        this.chartLabels = ['Nivel'];        
        this.chartOptions = {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        display: false,
                        ticks: {
                            display: false,
                            beginAtZero: true
                        }
                    }
                ],
                xAxes: [{
                    display: false,
                    stacked: true,
                    
                }]
            },
            title: {
                display: false,
                text: 'NivelBici'
            }

        };
        this.chartColors = [
            {
                borderColor: '#000000',
                backgroundColor: 'purple'
            },
            {
                borderColor: '#000000',
                backgroundColor: 'lightgray'
            }
        ];
        this.chartType = 'bar';
        this.showLegend = false;
    }
    getChartTrack() {
        this.chartData = [
            {
                data: [30, 45, 55, 60, 65, 65, 70, 70, 75, 80, 70, 85, 80, 90, 90, 70, 80, 90, 80, 80, 100, 70, 100, 105, 70, 70, 105, 110, 70, 70, 105, 115, 75, 120, 125, 70, 70, 60],
                label: 'track1',
                // steppedLine: true,
                //                barPercentage:2
                // maxBarThickness: 100
                /*fillColor: "rgba(151,205,187,0.2)",
                strokeColor: "rgba(151,205,187,1)",
                pointColor: "rgba(151,205,187,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,205,187,1)",*/
            },
            {
                data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], label: 'ftp',
                fill: "unfilled"
            }
        ];
        this.etiquetasTiempo(20);
        /*var tiempo = new Date(0);
        this.chartLabels=[];
        this.chartLabels.push(tiempo.toString());
         for (let i = 0; i < 20; i++) {
             tiempo.setSeconds(tiempo.getSeconds()+30);
             this.chartLabels.push(tiempo.toString());
         }*/
        //this.chartLabels = ['0:1', '0:30', '0:35'];
        // Options
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            display: true,
                            //beginAtZero: true
                        }
                    }
                ],
                xAxes: [
                    {
                        display: true,
                        stacked: true,
                        type: 'time',
                        time: {
                             unit: 'second',
                             unitStepSize: 30,
                             displayFormats: {
                                 'second': "mm:ss" //this.person.Use24h ? 'HH:mm' : 'hh:mm A'
                             }
                         },
                         

                        // type: "time",
                        // time: {
                        //     //min: moment(new Date()).add(-5, 'days'),
                        //     unit: 'day30
                        //   },
                        ticks: {
                            display: true,
                            beginAtZero: true
                        }

                    }
                ]
            },
            title: {
                display: true,
                text: 'Workout-prueba'
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0
                }
            }
        };
        this.chartColors = [
            {
                // borderColor: 'purple',
                borderColor: '#f7d7f4',

                backgroundColor: '#f9d9f944'


                // pointBackgroundColor: 'rgba(148,159,177,1)',
                // pointBorderColor: '#fff',
                // pointHoverBackgroundColor: '#fff',
                // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            },
            {
                backgroundColor: "#55555511"
            }
        ];

        this.chartType = 'line';
        this.showLegend = false;
    }
    etiquetasTiempo(numEtiquetas: number, tiempoInicial: Date=new Date(0), intervalo:number=30, vaciar:boolean=true){
      
        if (vaciar){
            this.chartLabels=[]; //si nos piden vaciar el array
             // añadimos al array de etiquetas el tiempo inicial
            this.chartLabels.push(tiempoInicial.toString());
           }
       
        for (let i = 0; i < numEtiquetas; i++) {
            tiempoInicial.setSeconds(tiempoInicial.getSeconds()+intervalo);
            this.chartLabels.push(tiempoInicial.toString());
        }
        return tiempoInicial;
    }
    

    temporizador(){
        var temp=timer(1000,1000);// comienza a 1 s y se repite cada 30 seg
        var tiempoInicial = null;
        let subscripcion  = temp.subscribe(x => {
            console.log(x),
            this.chartData[0].data.shift();
            this.chartLabels.shift(); //eliminamos una etiqueta
            
            this.chartData[0].data.push(10*x);
            if (!tiempoInicial)
                tiempoInicial = new Date(this.chartLabels[this.chartLabels.length-1].toString());
            tiempoInicial=this.etiquetasTiempo(1, tiempoInicial, 30, false);//metemos una etiqueta nueva
            console.log("DATOS: "+this.chartData[0].data );
            this.chartData = this.chartData.slice();
            if (x>10) subscripcion.unsubscribe();
            
        });
    }
}
