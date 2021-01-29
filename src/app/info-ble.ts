export class InfoBle {
    //propiedad
    public bici: any = {
        nombre: "Bicicleta",
        estado: "desconectado",
        color: "danger",
        servicio: "1826",
        id: null,
        caracteristica: "",
        mac: null
    };
    public pulso: any = {
        nombre: "Pulsómetro",
        estado: "desconectado",
        color: "danger",
        servicio: "180d",
        id: null,
        caracteristica: "2a37",
        mac: null
    };
    
    constructor(
        private newbici: any = null, private newpulso: any = null
    ){
        if (newbici) this.bici=newbici;
        if (newpulso) this.pulso=newpulso;
    };
    // public dato: string = "pepe";
    //cambio estado
    cambiarEstado(componente: any) {
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
