import { HistorialClinicoModelo } from './historialClinico.modelo';
import { PersonaModelo } from './persona.modelo';

export class PacienteModelo {

    pacienteId: number;
    grupoSanguineo: string;
    seguroMedico: string;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;
    personas: PersonaModelo = new PersonaModelo();

    constructor() {
    }

}