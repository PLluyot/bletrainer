export class InfoBle {
    //propiedad
    public bici: any = {
        nombre: "Bicicleta",
        estado: "desconectado",
        color: "danger",
        servicio: "1826",
        id: null,
        caracteristica: "",
        mac: null,
        dispositivos: []
    };
    public pulso: any = {
        nombre: "Pulsómetro",
        estado: "desconectado",
        color: "danger",
        servicio: "180d",
        id: null,
        caracteristica: "2a37",
        mac: null,
        dispositivos: []
    };
    public zonas:any[]=[{
        0:{
            bps:180
        },
        1:{
            min:0,
            max:108,
            p:'60%',
            color:'white'
        },
        2:{
            min:109,
            max:117,
            p:'65%',
            color:'white'
        },
        3:{
            min:118,
            max:135,
            p:'75%',
            color:'lightyellow'
        },
        4:{
            min:139,
            max:148,
            p:'82%',
            color:'yellow'
        },
        5:{
            min:140,
            max:160,
            p:'89%',
            color:'orange'
        },
        6:{
            min:161,
            max:169,
            p:'94%',
            color:'red'
        },
        7:{
            min:170,
            max:180,
            p:'100%',
            color:'darkred'
        }
    }]
    constructor(
        private newbici: any = null, private newpulso: any = null
    ){
        if (newbici) this.bici=newbici;
        if (newpulso) this.pulso=newpulso;
    };
    // public dato: string = "pepe";
    //cambio estado
    cambiarEstado(componente: any) {
        console.log("cambio de estado ANTES:" + componente + " - "+ componente.estado);
        //verificamos si el componente existe
        if (componente) {
            if (componente.estado == "conectado") {
                componente.estado = "desconectado";
                componente.color = "danger"
            }
            else {
                componente.estado = "conectado";
                componente.color = "success";
            }
        }
        console.log("cambio de estado DESPUES:" + componente + " - "+ componente.estado);
        
    }
    setInfo (newInfo: InfoBle) {
        this.bici = newInfo.bici;
        this.pulso = newInfo.pulso;
    }
    getInfo (){
        return this;
    }
    setBici(newBici: JSON){
        this.bici = newBici;
    }
    getBici(){
        return this.bici;
    }
    setPulso(newPulso: JSON){
        this.pulso = newPulso;
    }
    getPulso(){
        return this.pulso;
    }

    // setPulso(newPulso: any){
    //     this.pulso = newPulso;
    // }





}
