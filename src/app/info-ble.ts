export class InfoBle {
    //propiedad
    public bici: any = {
        nombre: "Bicicleta",
        estado: "desconectado",
        color: "danger",
        servicio: "1826",
        id: null,
        //'19:11:8B:94:14:FF',
        caracteristica: "2ad2",
        // mac: null,
        dispositivos: [],
        arrayLectura: null
    };
    public pulso: any = {
        nombre: "Pulsómetro",
        estado: "desconectado",
        color: "danger",
        servicio: "180d",
        id: null,
        // "E3:5E:65:14:16:33",
        caracteristica: "2a37",
        //mac: null,
        dispositivos: [],
        pulsos: {
            registros: [],
            pulsoMin: null,
            pulsoMax: null,
            pulsoMedio: null
        }
    };
    public zonas: any[] = [{
        0: {
            bps: 180
        },
        1: {
            min: 0,
            max: 108,
            p: '60%',
            color: 'white'
        },
        2: {
            min: 109,
            max: 117,
            p: '65%',
            color: 'white'
        },
        3: {
            min: 118,
            max: 135,
            p: '75%',
            color: 'lightyellow'
        },
        4: {
            min: 139,
            max: 148,
            p: '82%',
            color: 'yellow'
        },
        5: {
            min: 140,
            max: 160,
            p: '89%',
            color: 'orange'
        },
        6: {
            min: 161,
            max: 169,
            p: '94%',
            color: 'red'
        },
        7: {
            min: 170,
            max: 180,
            p: '100%',
            color: 'darkred'
        }
    }]
    constructor(
        private newbici: any = null, private newpulso: any = null
    ) {
        if (newbici) this.bici = newbici;
        if (newpulso) this.pulso = newpulso;
    };
    // public dato: string = "pepe";
    //cambio estado
    ponerEstado(componente: any, nuevoEstado: string) {
        if (componente && nuevoEstado == "conectado") {
            componente.estado = "conectado";
            componente.color = "success";
        }
        if (componente && nuevoEstado == "desconectado") {
            componente.estado = "desconectado";
            componente.color = "danger";
        }
    }
    cambiarEstado(componente: any) {
        //console.log("cambio de estado ANTES:" + componente + " - "+ componente.estado);
        //verificamos si el componente existe
        if (componente) {
            if (componente.estado == "conectado") {
                this.ponerEstado(componente, "desconectado")
            }
            else {
                this.ponerEstado(componente, "conectado")
            }
            console.log("infoBle: cambiamos estado del pulso a " + componente.estado);
        }
        //console.log("cambio de estado DESPUES:" + componente + " - "+ componente.estado);

    }
    setInfo(newInfo: InfoBle) {
        this.bici = newInfo.bici;
        this.pulso = newInfo.pulso;
    }
    getInfo() {
        return this;
    }
    setBici(newBici: JSON) {
        this.bici = newBici;
    }
    getBici() {
        return this.bici;
    }
    setPulso(newPulso: JSON) {
        this.pulso = newPulso;
    }
    getPulso() {
        return this.pulso;
    }

    // setPulso(newPulso: any){
    //     this.pulso = newPulso;
    // }
    inicializarPulsos() {
        this.pulso.pulsos.pulsoMin = null;
        this.pulso.pulsos.pulsoMax = null;
        this.pulso.pulsos.pulsoMedio = null;
        this.pulso.pulsos.registros=[];
    }
    registroPulsos(valorPulso: any) {
        //almacenamos el valor mín, max y media
        if (this.pulso.pulsos.pulsoMin == null) this.pulso.pulsos.pulsoMin = valorPulso;
        if (this.pulso.pulsos.pulsoMax == null) this.pulso.pulsos.pulsoMin = valorPulso;
        if (this.pulso.pulsos.pulsoMedio == null) this.pulso.pulsos.pulsoMin = valorPulso;

        if (this.pulso.pulsos.pulsoMin > valorPulso) this.pulso.pulsos.pulsoMin = valorPulso;
        if (this.pulso.pulsos.pulsoMax < valorPulso) this.pulso.pulsos.pulsoMax = valorPulso;
        this.pulso.pulsos.registros.push(valorPulso);
        let long = this.pulso.pulsos.registros.length;
        let sum = this.pulso.pulsos.registros.reduce((previous, current) => current += previous);
        this.pulso.pulsos.pulsoMedio = sum / long;
        console.log("Pulso medio:" + this.pulso.pulsos.pulsoMedio);
    }
}
