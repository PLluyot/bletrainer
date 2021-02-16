//pruebas con chars
import { R3TargetBinder, rendererTypeName } from '@angular/compiler';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { timer } from 'rxjs';
import 'chartjs-plugin-zoom';

export class InfoCharts {
    // ChartsData
    public chartData: ChartDataSets[] = [];
    public chartLabels: Label[] = [];
    // Options
    public chartOptions: ChartOptions = {};
    public chartColors: Color[] = [];
    public chartType: ChartType = 'bar';
    public showLegend = false;

    public cadenciaData: any[] = [];
    public sesionData: any = {};

    /***************************** fin gráficos */
    constructor(tipo: string = null) {
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
        this.etiquetasTiempo(20); // actualiza this.chartLabels
        //this.chartLabels = this.arrayEtiquetasTiempo(20);
        // Options
        //console.log(this.chartLabels);
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
                            //maxTicksLimit:4,
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
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                        rangeMin: {
                            // Format of min pan range depends on scale type
                            x: 0,
                            y: null
                        },
                        rangeMax: {
                            // Format of max pan range depends on scale type
                            x: null,
                            y: null
                        },

                        // On category scale, factor of pan velocity
                        speed: 15,

                        // Minimal pan distance required before actually applying pan
                        //threshold: 10
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                        drag: false,
                        speed: 0.05,
                        //   limits: {
                        //     max: 10,
                        //     min: 0.5
                        //   }

                        // // Minimal zoom distance required before actually applying zoom
                        // threshold: 2,

                        // // On category scale, minimal zoom level before actually applying zoom
                        // sensitivity: 3
                    }
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
    arrayEtiquetasTiempo(numEtiquetas: number, tiempoInicial: Date = new Date(0), intervalo: number = 30, vaciar: boolean = true) {
        this.etiquetasTiempo(numEtiquetas, tiempoInicial, intervalo, vaciar);
        return this.chartLabels;
    }
    etiquetasTiempo(numEtiquetas: number, tiempoInicial: Date = new Date(0), intervalo: number = 30, vaciar: boolean = true) {

        if (vaciar) {
            this.chartLabels = []; //si nos piden vaciar el array
            // añadimos al array de etiquetas el tiempo inicial
            this.chartLabels.push(tiempoInicial.toString());
        }

        for (let i = 0; i < numEtiquetas; i++) {
            //tiempoInicial.setSeconds(tiempoInicial.getSeconds()+intervalo);
            tiempoInicial = this.sumarTiempoSegundos(tiempoInicial, intervalo);
            this.chartLabels.push(tiempoInicial.toString());
            //console.log("añadimos ("+i+")="+this.chartLabels);
        }
        let tiempoFinal = tiempoInicial;
        return tiempoFinal;//devuelve el tiempo último
    }
    sumarTiempoSegundos(tiempoInicial: Date, segundos: number = 30) {
        tiempoInicial.setSeconds(tiempoInicial.getSeconds() + segundos);
        return tiempoInicial;
    }

    temporizador() {
        var temp = timer(1000, 1000);// comienza a 1 s y se repite cada 30 seg
        var tiempoInicial = null;
        let subscripcion = temp.subscribe(x => {
            //console.log(x),
            this.chartData[0].data.shift();
            this.chartLabels.shift(); //eliminamos una etiqueta

            this.chartData[0].data.push(10 * x);
            if (!tiempoInicial)
                tiempoInicial = new Date(this.chartLabels[this.chartLabels.length - 1].toString());
            tiempoInicial = this.etiquetasTiempo(1, tiempoInicial, 30, false);//metemos una etiqueta nueva
            //console.log("DATOS: "+this.chartData[0].data );
            this.chartData = this.chartData.slice();
            if (x > 10) subscripcion.unsubscribe();

        });

    }
    getChartsSesion(nivelBici = 20) {
        var nivel = {
                     0: Math.round(nivelBici * (1 / 7)),//muy bajo
                     1: Math.round(nivelBici * (2 / 7)),//bajo
                     2: Math.round(nivelBici * (3 / 7)),//bajo
                     3: Math.round(nivelBici * (4 / 7)),//medio
                     4: Math.round(nivelBici * (5 / 7)),//bajo
                     5: Math.round(nivelBici * (6 / 7)),//medio-alto
                     6: nivelBici, //alto
                     7: Math.round(nivelBici * (8 / 7)), //alto
                     8: Math.round(nivelBici * (9 / 7)),//bajo
                     9: Math.round(nivelBici * (10 / 7)) //muy alto
                 }
                 var arrayBase = [];
                 for (let i = 0; i < 60; i++) {
                     arrayBase.push(nivelBici);
     }
        this.sesionData = {
            nivel: [nivel[0], nivel[0], nivel[1], nivel[2], nivel[2], nivel[3], nivel[3], nivel[4], nivel[5], nivel[5], 
                nivel[4], nivel[6], nivel[4], nivel[6], nivel[7], nivel[7], nivel[7], nivel[6], nivel[5], nivel[4], 
                nivel[4], nivel[5], nivel[7], nivel[7], nivel[8], nivel[5], nivel[4], nivel[4], nivel[6], nivel[6], 
                nivel[6], nivel[7], nivel[5], nivel[4], nivel[3], nivel[5], nivel[6], nivel[8], nivel[8], nivel[4],
                nivel[5], nivel[7], nivel[8], nivel[3], nivel[4], nivel[6], nivel[8], nivel[9], nivel[5], nivel[5], 
                nivel[6], nivel[7], nivel[6], nivel[6], nivel[5], nivel[4], nivel[4], nivel[3], nivel[3], nivel[2], nivel[1]],
            cadencia: [70, 75, 85, 90, 100, 100, 100, 80, 75, 73, 
                        75, 85, 70, 70, 70, 70, 70, 70, 70, 70,
                        68, 68, 68, 68, 68, 68, 70, 70, 70, 70, 
                        70, 70, 70, 70, 65, 65, 65, 65, 65, 65, 
                        65, 65, 68, 70, 65, 65, 65, 65, 65, 65, 
                        65, 65, 65, 65, 75, 80, 80, 75, 70, 70, 60],
            potencia: [100,120,130,140,160,170,170,160,160,166,
                        170,180,160,190,200,120,126,166,175,
                        170,180,160,210,200,120,226,266,275,
                        170,180,160,190,200,120,126,166,175,
                        170,180,160,210,200,198,226,266,275,
                        80,90,100,110,120,120,130,134,150,166,
                        80,90,100,110,120,120,130,134,150,166,123]
        };
        this.chartLabels = this.arrayEtiquetasTiempo(this.sesionData.nivel.length-1);

        this.chartData = [{
            data: this.sesionData.potencia, lineTension: 0
        },
        { data: this.sesionData.cadencia },
        {data: []}];

        this.chartType = 'line';
        this.showLegend = false;
        this.chartOptions = this.getCommonChartOptions();
    }
    getChartsPotencia() {
     
        this.chartLabels = this.arrayEtiquetasTiempo(1800,new Date(0),1);

        this.chartData = [{
            data: []
        },
        {data: []}];

        this.chartType = 'line';
        this.showLegend = false;
        this.chartOptions = this.getCommonChartOptions(3);
    }
    getChartsSpinningNivel() {
     
        this.chartLabels = this.arrayEtiquetasTiempo(1800,new Date(0),1);

        this.chartData = [{
            data: []
        },
        {data: []}];

        this.chartType = 'line';
        this.showLegend = false;
        this.chartOptions = this.getCommonChartOptions(2);
    }
    // getChartsSesion(nivelBici = 20) {
    //     var nivel = {
    //         0: Math.round(nivelBici * (1 / 7)),//muy bajo
    //         1: Math.round(nivelBici * (2 / 7)),//bajo
    //         2: Math.round(nivelBici * (3 / 7)),//bajo
    //         3: Math.round(nivelBici * (4 / 7)),//medio
    //         4: Math.round(nivelBici * (5 / 7)),//bajo
    //         5: Math.round(nivelBici * (6 / 7)),//medio-alto
    //         6: nivelBici, //alto
    //         7: Math.round(nivelBici * (8 / 7)), //alto
    //         8: Math.round(nivelBici * (9 / 7)),//bajo
    //         9: Math.round(nivelBici * (10 / 7)) //muy alto
    //     }
    //     var arrayBase = [];
    //     for (let i = 0; i < 60; i++) {
    //         arrayBase.push(nivelBici);
    //     }
    //     /* JSON con datos para generar gráfica de Spinning prueba */
    //     this.chartLabels = this.arrayEtiquetasTiempo(60);
    //     this.chartData = [{
    //         data: [nivel[0], nivel[0], nivel[1], nivel[2], nivel[2], nivel[3], nivel[3], nivel[4], nivel[5], nivel[5], nivel[4], nivel[6], nivel[4], nivel[6],
    //         nivel[7], nivel[7], nivel[7], nivel[6], nivel[5], nivel[4], nivel[4], nivel[5], nivel[7], nivel[7], nivel[8], nivel[5], nivel[4], nivel[4], nivel[6],
    //         nivel[6], nivel[6], nivel[7], nivel[5], nivel[4], nivel[3], nivel[5], nivel[6], nivel[8], nivel[8], nivel[4],
    //         nivel[5], nivel[7], nivel[8], nivel[3], nivel[4], nivel[6], nivel[8], nivel[9], nivel[5], nivel[5], nivel[6], nivel[7]
    //             , nivel[6], nivel[6], nivel[5], nivel[4], nivel[4], nivel[3], nivel[3], nivel[2], nivel[1]],
    //         label: "nivel"
    //     }, {
    //         data: arrayBase,
    //         label: "base"
    //     }, {
    //         data: [],
    //         label: "actual"
    //     }
    //     ];



    //     this.cadenciaData = [70, 75, 85, 90, 100, 100, 100, 80, 75, 73, 75, 85, 70, 70, 70, 70, 70, 70, 70, 70,
    //         68, 68, 68, 68, 68, 68, 70, 70, 70, 70, 70, 70, 70, 70, 65, 65, 65, 65, 65, 65, 65, 65,
    //         68, 70, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 75, 80, 80, 75, 70, 70, 60, 60];
    //     this.chartType = 'line';
    //     this.showLegend = false;
    //     this.chartColors = [{ borderColor: '#f7d7f4', backgroundColor: '#f9d9f966' }, { backgroundColor: "#55555501" }, { backgroundColor: "red" }];
    //     this.chartOptions = {
    //         responsive: true,
    //         maintainAspectRatio: true,
    //         aspectRatio: 2,
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     display: true, stepSize: 4,

    //                     max: 32
    //                 }
    //             }],
    //             xAxes: [{
    //                 display: true,
    //                 stacked: true,
    //                 type: 'time',
    //                 time: {
    //                     unit: 'second',
    //                     unitStepSize: 300,
    //                     displayFormats: {
    //                         'second': "mm:ss" //this.person.Use24h ? 'HH:mm' : 'hh:mm A'
    //                     }
    //                 },
    //                 ticks: {
    //                     display: true,
    //                     //maxTicksLimit:4,
    //                     beginAtZero: true
    //                 }
    //             }
    //             ]
    //         },
    //         title: {
    //             display: true,
    //             text: 'Workout-prueba'
    //         },
    //         elements: {
    //             point: {
    //                 radius: 0
    //             }
    //         },
    //         layout: {
    //             padding: {
    //                 left: 0,
    //                 right: 0
    //             }
    //         },
    //         // tooltips: {
    //         //     mode: 'index'
    //         // },
    //         plugins: {
    //             zoom: {
    //                 pan: {
    //                     enabled: true,
    //                     mode: 'x',
    //                     rangeMin: {
    //                         // Format of min pan range depends on scale type
    //                         x: 0,
    //                         y: null
    //                     },
    //                     rangeMax: {
    //                         // Format of max pan range depends on scale type
    //                         x: null,
    //                         y: null
    //                     },

    //                     // On category scale, factor of pan velocity
    //                     speed: 15,

    //                     // Minimal pan distance required before actually applying pan
    //                     //threshold: 10
    //                 },
    //                 zoom: {
    //                     enabled: true,
    //                     mode: 'x',
    //                     drag: false,
    //                     speed: 0.05,

    //                 }
    //             }
    //         }
    //     };
    // }
    getCommonChartOptions(aspect: any=2, unidad:any='minute', saltos:any=5){
        var array : ChartOptions = {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: aspect,
            scales: {
                yAxes: [{
                    ticks: {
                        display: true, 
                        stepSize: 10,

                        max: 300
                    }
                }],
                xAxes: [{
                    display: true,
                    stacked: true,
                    type: 'time',
                    time: {
                        unit: unidad,
                        //stepSize: 4,
                        unitStepSize: saltos,
                        displayFormats: {
                            'minute': "mm",//this.person.Use24h ? 'HH:mm' : 'hh:mm A'
                        
                        }
                        
                    },
                    ticks: {
                        display: true,
                        //maxTicksLimit:4,
                        beginAtZero: true,

                       
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
            },
            // tooltips: {
            //     mode: 'index'
            // },
            // plugins: {
            //     zoom: {
            //         pan: {
            //             enabled: true,
            //             mode: 'x',
            //             rangeMin: {
            //                 // Format of min pan range depends on scale type
            //                 x: 0,
            //                 y: null
            //             },
            //             rangeMax: {
            //                 // Format of max pan range depends on scale type
            //                 x: null,
            //                 y: null
            //             },

            //             // On category scale, factor of pan velocity
            //             speed: 15,

            //             // Minimal pan distance required before actually applying pan
            //             //threshold: 10
            //         },
            //         zoom: {
            //             enabled: true,
            //             mode: 'x',
            //             drag: false,
            //             speed: 0.05,

            //         }
            //     }
            // }
        };
        return array;
    }
}
