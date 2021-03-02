import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { ParametrosService } from '../../../servicios/parametros.service';
import { ComunesService } from 'src/app/servicios/comunes.service';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { PatologiaProcedimientoModelo } from '../../../modelos/patologiaProcedimiento.modelo';
import { PacientesService } from '../../../servicios/pacientes.service';
import { AntecedentesService } from '../../../servicios/antecedentes.service';
import { AlergiasService } from '../../../servicios/alergias.service';
import { HistorialesClinicosService } from '../../../servicios/historialesClinicos.service';
import { InsumosService } from '../../../servicios/insumos.service';
import { StocksService } from '../../../servicios/stocks.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonaModelo } from 'src/app/modelos/persona.modelo';
import { AntecedenteModelo } from 'src/app/modelos/antecedente.modelo';
import { AlergiaModelo } from 'src/app/modelos/alergia.modelo';
import { HistorialClinicoModelo } from 'src/app/modelos/historialClinico.modelo';
import { InsumoModelo } from 'src/app/modelos/insumo.modelo';
import { StockModelo } from 'src/app/modelos/stock.modelo';
import { AnamnesisModelo } from 'src/app/modelos/anamnesis.modelo';
import { Observable, Subject } from 'rxjs';
import { DiagnosticoModelo } from 'src/app/modelos/diagnostico.modelo';
import { TratamientoModelo } from 'src/app/modelos/tratamiento.modelo';
import { ProcesoDiagnosticoTratamientoModelo } from 'src/app/modelos/procesoDiagnosticoTratamiento.modelo';
import { ProcesoDiagnosticoTratamientosService } from 'src/app/servicios/procesoDiagnosticoTratamiento.service';
import { TratamientoInsumoModelo } from 'src/app/modelos/tratamientoInsumo.modelo';
import { ConsultaModelo } from 'src/app/modelos/consulta.modelo';
import { ConsultasService } from 'src/app/servicios/consultas.service';
import { DataTableDirective } from 'angular-datatables';
import { UploadFileService } from 'src/app/servicios/upload-file.service';
import { MotivoConsultaModelo } from 'src/app/modelos/motivoConsulta.modelo';
import { MotivosConsultaService } from 'src/app/servicios/motivosConsulta.service';
import { SignoVitalModelo } from 'src/app/modelos/signoVital.modelo';
import { SignosVitalesService } from 'src/app/servicios/signosVitales.service';
import { FichaMedicaModelo } from 'src/app/modelos/fichaMedica.modelo';
import { AlergenosService } from 'src/app/servicios/alergenos.service';
import { AlergenoModelo } from 'src/app/modelos/alergeno.modelo';
import { PatologiasProcedimientosService } from 'src/app/servicios/patologiasProcedimientos.service';
import { EnfermedadCie10Modelo } from 'src/app/modelos/enfermedadCie10.modelo';
import { EnfermedadesCie10Service } from 'src/app/servicios/enfermedadesCie10.service';

@Component({
  selector: 'app-consultorio',
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css']
})

export class ConsultorioComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})  
  dtElement: DataTableDirective;
  crear = false;
  personaForm: FormGroup;
  pacienteForm: FormGroup;
  buscadorForm: FormGroup;
  historialClinicoForm: FormGroup;
  buscadorModalForm: FormGroup;
  stockForm: FormGroup;
  buscadorStockForm: FormGroup;
  buscadorEnfermedadesCie10Form: FormGroup;
  anamnesisForm: FormGroup;
  diagnosticoPrimarioForm: FormGroup;
  diagnosticoSecundarioForm: FormGroup;
  selectFichaMedicaForm: FormGroup;
  planTrabajoForm: FormGroup;
  tratamientoFarmacologicoForm: FormGroup;
  tratamientoNoFarmacologicoForm: FormGroup;  
  pacientes: PacienteModelo[] = [];
  patologiasProcedimientos: PatologiaProcedimientoModelo[] = [];
  antecedentes: AntecedenteModelo[] = [];
  antecedentesFamiliares: AntecedenteModelo[] = [];
  alergias: AlergiaModelo[] = [];
  diagnosticoAlergias: AlergenoModelo[] = [];
  diagnosticoAntecPatolProc: PatologiaProcedimientoModelo[] = [];
  paciente: PacienteModelo = new PacienteModelo();
  listaEstadoCivil: ParametroModelo[] = [];
  listaSexo: ParametroModelo[] = [];
  listaNacionalidad: ParametroModelo[] = [];
  listaMotivosConsulta: MotivoConsultaModelo;
  stocks: StockModelo[] = [];
  consultas: ConsultaModelo[] = new Array();
  enfermedadesCie10: EnfermedadCie10Modelo[] = [];
  enfermedadCie10PrincipalSeleccionada: EnfermedadCie10Modelo = new EnfermedadCie10Modelo();
  enfermedadCie10SecundariaSeleccionada: EnfermedadCie10Modelo = new EnfermedadCie10Modelo();
  tratamientosInsumos: TratamientoInsumoModelo[] = [];
  signosVitales: SignoVitalModelo[] = [];
  fichaMedica: FichaMedicaModelo[] = [];
  cargando = false;
  alert:boolean=false;
  guardarBtn = true;
  alertMedicamentos:boolean=false;
  alertGeneral:boolean=false;
  tipoDiagnostico: String = null;
  mensajeGeneral: String = null;
  historialClinicoId: any = null;
  dtOptionsBuscadorStock: any = {};
  dtOptionsBuscador: any = {};
  dtOptionsPatologias: any = {};  
  dtOptionsAntecedentes: any = {};
  dtOptionsAntecedentesFamiliares: any = {};
  dtOptionsAlergias: any = {};
  dtOptionsStock: any = {};  
  dtOptionsEnfermedadCie10: any = {};
  dtOptionsConsultas: any = {};
  dtOptionsMedicamentos: any = {};
  dtOptionsSignosVitales: any = {};
  dtOptionsFichaMedica: any = {};
  dtTriggerMedicamentos : Subject<any> = new Subject<any>();
  dtTriggerStock : Subject<any> = new Subject<any>();
  dtTriggerConsultas : Subject<any> = new Subject<any>();
  dtTriggerAlergias : Subject<any> = new Subject<any>();
  dtTriggerAntecedentes : Subject<any> = new Subject<any>();
  dtTriggerAntecedentesFamiliares : Subject<any> = new Subject<any>();
  dtTriggerPatologias : Subject<any> = new Subject<any>();
  dtTriggerSignosVitales : Subject<any> = new Subject<any>();
  dtTriggerFichaMedica : Subject<any> = new Subject<any>();
  hcid = 0;
  fileInfos: Observable<any>;
  hiddenAlergenos = true;
  hiddenAntePatProc = true;

  constructor( private historialClinicosService: HistorialesClinicosService,
               private parametrosService: ParametrosService,
               private comunes: ComunesService,
               private pacientesService: PacientesService,
               private antecedentesService: AntecedentesService,
               private alergiaService: AlergiasService,
               private alergenosService: AlergenosService,
               private patologiasProcedimientosService: PatologiasProcedimientosService,
               private modalService: NgbModal,
               private insumosService: InsumosService,
               private stockService: StocksService,
               private enfermedadesCie10Service: EnfermedadesCie10Service,
               private consultasService: ConsultasService,
               private signosVitalesService: SignosVitalesService,
               private uploadService: UploadFileService,
               private motivosConsultaService: MotivosConsultaService,
               private procesoDiagnosticoTratamientoService: ProcesoDiagnosticoTratamientosService,
               private fb: FormBuilder,
               private fb2: FormBuilder,
               private fb3: FormBuilder,
               private fb4: FormBuilder,
               private fb5: FormBuilder,
               private fb6: FormBuilder,
               private fb7: FormBuilder,
               private fb8: FormBuilder,
               private fb9: FormBuilder,
               private fb10: FormBuilder,
               private fb11: FormBuilder,
               private fb12: FormBuilder,
               private fb13: FormBuilder,
               private fb14: FormBuilder) { 
    this.crearFormulario();
    this.ngOnInit();
  }              

  ngOnInit() {
    this.obtenerParametros();
    this.listarMotivosConsultas();
    this.crearTablaPatologias();
    this.crearTablaAntecedentes();
    this.crearTablaAlergias();
    this.crearTablaAntecedentesFamiliares();
    this.crearTablaMedicamentos();
    this.crearTablaModel();
    this.crearTablaModelStock();
    this.crearTablaModelTerminoEstandar();
    this.crearTablaConsultas();
    this.crearSignosVitales();
    this.crearFichaMedica();
  }

  obtenerParametros() {
    var estadoCivilParam = new ParametroModelo();
    estadoCivilParam.codigoParametro = "EST_CIVIL";
    estadoCivilParam.estado = "A";
    var orderBy = "descripcionValor";
    var orderDir = "asc";

    this.parametrosService.buscarParametrosFiltros( estadoCivilParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo[]) => {
        this.listaEstadoCivil = resp;
    });

    var sexoParam = new ParametroModelo();
    sexoParam.codigoParametro = "SEXO";
    sexoParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( sexoParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo[]) => {
        this.listaSexo = resp;
    });

    var nacionalidadParam = new ParametroModelo();
    nacionalidadParam.codigoParametro = "NACIONALIDAD";
    nacionalidadParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( nacionalidadParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo[]) => {
        this.listaNacionalidad = resp;
    });    
  }

  listarMotivosConsultas() {
    var orderBy = "descripcion";
    var orderDir = "asc";
    var motivoConsulta = new MotivoConsultaModelo();
    motivoConsulta.estado = "A";

    this.motivosConsultaService.buscarMotivosConsultaFiltros(motivoConsulta, orderBy, orderDir )
      .subscribe( (resp: MotivoConsultaModelo) => {
        this.listaMotivosConsulta = resp;
    });
  }

  buscarPaciente(event) {
    event.preventDefault();    
    var paciente = new PacienteModelo();
    var persona = new PersonaModelo();

    var cedula = this.buscadorForm.get('cedulaBusqueda').value;

    if( cedula ){
      persona.cedula = cedula;
      paciente.personas = persona;
    }else{
      paciente.personas = null;
    }
    
    paciente.pacienteId = this.buscadorForm.get('pacienteIdBusqueda').value;
    this.limpiar(event);

    Swal.fire({
      title: 'Espere',
      text: 'Buscando...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.pacientesService.buscarPacientesFiltros(paciente)
    .subscribe( resp => { 
      if(resp.length <= 0){
        Swal.fire({
          icon: 'info',
          title: 'No se encontró paciente',
        })
      }else{
        Swal.close();
        for (let i = 0; i < this.listaSexo.length; i++) {
          if( this.listaSexo[i].valor == resp[0].personas.sexo ){
            resp[0].personas.sexo = this.listaSexo[i].descripcionValor;
            break;
          }
        }
        for (let i = 0; i < this.listaEstadoCivil.length; i++) {
          if( this.listaEstadoCivil[i].valor == resp[0].personas.estadoCivil ){
            resp[0].personas.estadoCivil = this.listaEstadoCivil[i].descripcionValor;
            break;
          }
        }
        for (let i = 0; i < this.listaNacionalidad.length; i++) {
          if( this.listaNacionalidad[i].valor == resp[0].personas.nacionalidad ){
            resp[0].personas.nacionalidad = this.listaNacionalidad[i].descripcionValor;
            break;
          }
        }
        this.paciente = resp[0];
        
        this.pacienteForm.patchValue(this.paciente);
        this.buscadorForm.get('pacienteIdBusqueda').setValue(this.paciente.pacienteId);
        this.buscadorForm.get('cedulaBusqueda').setValue(this.paciente.personas.cedula);

        this.historialClinicoId = this.pacienteForm.get('historialClinico').get('historialClinicoId').value;
        this.ageCalculator();
        if( this.paciente.pacienteId ){
          this.obtenerHistorialClinico();          
          this.obtenerFichaMedica();
          this.obtenerConsultas();
          this.obtenerSignosVitales();
          this.guardarBtn = false;
        }else{
          this.alertGeneral = true;
          this.mensajeGeneral = "El paciente aun no cuenta con Historial Clinico definido";
        }
      }
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      //this.cargando = false;
    });   

    /*this.pacientesService.buscarPacientesFiltros( Number(id) )
        .subscribe( (resp: PacienteModelo) => {  
          this.pacienteForm.patchValue(resp);
          var cedula = this.pacienteForm.get('personas').get('cedula').value;
          this.fileInfos = this.uploadService.getFilesName(cedula + '_', "I");
        });*/
  }

  ageCalculator(){
    var fechaNacimiento = this.pacienteForm.get('personas').get('fechaNacimiento').value;//toString();
    if( fechaNacimiento ){
      const convertAge = new Date(fechaNacimiento);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());

      this.pacienteForm.get('personas').get('edad').setValue(Math.floor((timeDiff / (1000 * 3600 * 24))/365));
    }
  }

  obtenerHistorialClinico() {   
    var historialClinico = new HistorialClinicoModelo();

    historialClinico.pacientes.pacienteId = this.paciente.pacienteId;
    
    this.historialClinicosService.buscarHistorialClinicosFiltros(historialClinico)
    .subscribe( resp => {
      if(resp.length > 0){
        this.historialClinicoForm.patchValue(resp[0]);
        if ( resp[0].historialClinicoId != null ){
          this.hcid = this.historialClinicoForm.get('historialClinicoId').value;
          var cedula = this.pacienteForm.get('personas').get('cedula').value;
          var areaId = this.historialClinicoForm.get('areas').get('areaId').value;
          this.fileInfos = this.uploadService.getFilesName(cedula + '_' + areaId + '_', "H");
        }
      }
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  obtenerFichaMedica(){
    this.obtenerAntecedentes();
    this.obtenerAntecedentesFamiliares();
    this.obtenerAlergias();
  }

  obtenerPatologiasProcedimientosActual() {   
    var patologiaProcedimiento = new PatologiaProcedimientoModelo();

    /*patologiaProcedimiento. = this.buscadorForm.get('cedulaBusqueda').value;
    if(!pacientePersona.cedula){
      paciente.personas = null;
    }else{
      paciente.personas = pacientePersona;
    }
    paciente.pacienteId = this.buscadorForm.get('pacienteIdBusqueda').value;
    if(paciente.personas == null && !paciente.pacienteId){
      paciente = null;
    }      
 
    buscador.pacientes = this.paciente;

    this.historialClinicosService.buscarHistorialClinicosFiltros(buscador)
    .subscribe( resp => {     

      if(resp.length <= 0){
        Swal.fire({
          icon: 'info',
          title: 'No se encontro paciente',
          text: 'No se encontro paciente'
        })
      }else{
        this.historialClinicoForm.patchValue(resp[0]);
        //this.buscadorForm.get('pacienteIdBusqueda').setValue(resp[0].pacienteId);
        //this.buscadorForm.get('cedulaBusqueda').setValue(resp[0].personas.cedula);
      }
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });*/
  }

  obtenerAntecedentes() {
    var antecedente = new AntecedenteModelo();

    this.antecedentes = [];
    $('#tableAntecedentes').DataTable().destroy();

    antecedente.pacienteId = this.paciente.pacienteId;
    antecedente.tipo = "P";//antecedentes personales
    this.antecedentesService.buscarAntecedentesFiltros(antecedente)
    .subscribe( resp => {

      this.antecedentes = resp;
      this.dtTriggerAntecedentes.next();
     
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  obtenerAntecedentesFamiliares() {
    var antecedente = new AntecedenteModelo();

    this.antecedentesFamiliares = [];
    $('#tableAntecedentesFamiliares').DataTable().destroy();

    antecedente.pacienteId = this.paciente.pacienteId;
    antecedente.tipo = "F";//antecedentes familiares
    this.antecedentesService.buscarAntecedentesFiltros(antecedente)
    .subscribe( resp => {

      this.antecedentesFamiliares = resp;
      this.dtTriggerAntecedentesFamiliares.next();
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  obtenerAlergias() {
    var alergias = new AlergiaModelo();

    this.alergias = [];
    $('#tableAlergias').DataTable().destroy();

    alergias.pacienteId = this.paciente.pacienteId;

    this.alergiaService.buscarAlergiasFiltros(alergias)
    .subscribe( resp => {

      this.alergias = resp;
      this.dtTriggerAlergias.next();
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  listarAlergenos() {
    //var alergias = new AlergiaModelo();

    //alergias.pacienteId = this.paciente.pacienteId;

    this.alergenosService.getAlergenos()
    .subscribe( resp => {

      this.diagnosticoAlergias = resp;
      //this.dtTriggerFichaMedica.next();
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      //this.cargando = false;
    });
  }

  listarPatologiasProcedimientos() {
    //var alergias = new AlergiaModelo();

    //alergias.pacienteId = this.paciente.pacienteId;

    this.patologiasProcedimientosService.getPatologiasProcedimientos()
    .subscribe( resp => {

      this.diagnosticoAntecPatolProc = resp;
      //this.dtTriggerFichaMedica.next();
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      //this.cargando = false;
    });
  }

  agregarAficha(event){
    var ficha: FichaMedicaModelo  = new FichaMedicaModelo();
    
    var opcionFicha = this.selectFichaMedicaForm.get('selectOpcionFicha').value;    
    var idAlergeno = this.selectFichaMedicaForm.get('selectAlergeno').value;
    var idAntecedente = this.selectFichaMedicaForm.get('selectAntecPatologiasProcedimientos').value;

    if( opcionFicha == "ALE"){
      for (let i = 0; i < this.diagnosticoAlergias.length; i++) {
        if(this.diagnosticoAlergias[i].alergenoId == Number(idAlergeno)){
          ficha.id = this.diagnosticoAlergias[i].alergenoId;
          ficha.codigo = this.diagnosticoAlergias[i].codigo;
          ficha.descripcion = this.diagnosticoAlergias[i].descripcion;
          ficha.tipo = opcionFicha;
          ficha.pacienteId = this.paciente.pacienteId;

          $('#tableFichaMedica').DataTable().destroy();
          this.fichaMedica.push(ficha);
          this.dtTriggerFichaMedica.next();
        }
      }
    }else if( opcionFicha == "P/P"){
      for (let i = 0; i < this.diagnosticoAntecPatolProc.length; i++) {
        if(this.diagnosticoAntecPatolProc[i].patologiaProcedimientoId== Number(idAntecedente)){
          ficha.id = this.diagnosticoAntecPatolProc[i].patologiaProcedimientoId;
          ficha.codigo = this.diagnosticoAntecPatolProc[i].codigo;
          ficha.descripcion = this.diagnosticoAntecPatolProc[i].descripcion;
          ficha.tipo = opcionFicha;
          ficha.pacienteId = this.paciente.pacienteId;

          $('#tableFichaMedica').DataTable().destroy();
          this.fichaMedica.push(ficha);
          this.dtTriggerFichaMedica.next();
        }
      }
    }
        
     /* }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
        }
      );*/
  }

  /*obtenerAnamnesis() {
    var anamnesis = new AnamnesisModelo();
    anamnesis.pacienteId = this.paciente.pacienteId;

    this.anamnesisService.buscarAnamnesisFiltrosTabla(anamnesis)
    .subscribe( resp => {     

      if(resp != null && resp.length > 0){
        this.anamnesisForm.patchValue(resp[0]);
      }
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }*/

  obtenerConsultas() {
    var consultas = new ConsultaModelo();
    consultas.pacienteId = this.paciente.pacienteId;

    this.consultas = [];
    $('#tableConsultas').DataTable().destroy();

    this.consultasService.buscarConsultasFiltrosTabla(consultas)
    .subscribe( resp => {     

      this.consultas = resp;
      this.dtTriggerConsultas.next();
      
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  obtenerSignosVitales() {
    var signoVital = new SignoVitalModelo();
    signoVital.pacientes.pacienteId = this.paciente.pacienteId;
    signoVital.funcionarios = null;
    //signoVital.

    this.signosVitales = [];
    $('#tableSignosVitales').DataTable().destroy();

    this.signosVitalesService.buscarSignosVitalesFiltros(signoVital)
    .subscribe( resp => {     

      this.signosVitales = resp;
      this.dtTriggerSignosVitales.next();
      
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  obtenerInsumo(event) {
    event.preventDefault();
    var id = this.stockForm.get('insumos').get('insumoId').value;
    this.insumosService.getInsumo( id )
    .subscribe( (resp: InsumoModelo) => {

        //this.stockForm.get('insumos').patchValue(resp);

      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e),
          })
          this.stockForm.get('insumos').get('insumoId').setValue(null);
        }
      );
  }

  opcionFicha(event: any){
    var opcion = event.target.value;
    if( opcion == "ALE" ){
      this.listarAlergenos();
      this.hiddenAlergenos = false;
      this.hiddenAntePatProc = true;   
    }else if( opcion == "P/T" ){      
      this.hiddenAlergenos = true; 
      this.hiddenAntePatProc = true;  
    }else if( opcion == "P/P" ){
      this.listarPatologiasProcedimientos();
      this.hiddenAlergenos = true;
      this.hiddenAntePatProc = false;
    }else if( opcion == "null" ){
      this.hiddenAlergenos = true;
      this.hiddenAntePatProc = true;
    }
  }

  crearFormulario() {
    this.pacienteForm = this.fb.group({
      pacienteId  : [null, [] ],
      historialClinico: this.fb.group({
        historialClinicoId: [null, [] ]
      }),
      personas : this.fb.group({
        personaId  : [null, [] ],
        cedula  : [null, [] ],
        nombres  : [null, [] ],
        apellidos: [null, [] ],
        fechaNacimiento: [null, [] ],
        edad: [null, [] ],
        direccion: [null, [] ],
        sexo: [null, [] ],
        estadoCivil: [null, [] ],
        nacionalidad: [null, [] ],
        telefono: [null, [] ],
        email  : [null, [] ],
        celular: [null, [] ],
        observacion: [null, [] ],
        carreras: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        departamentos: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        dependencias: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        estamentos: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        fechaCreacion: [null, [] ],
        fechaModificacion: [null, [] ],
        usuarioCreacion: [null, [] ],
        usuarioModificacion: [null, [] ]   
      }),
      grupoSanguineo  : [null, [] ],
      seguroMedico  : [null, [] ]        
    });

    this.historialClinicoForm = this.fb2.group({
      historialClinicoId  : [null, [] ],         
      areas  : this.fb2.group({
        areaId: [null, [] ],
        descripcion: [null, [] ]
      }),     
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });
    
    this.buscadorModalForm = this.fb3.group({
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });

    this.buscadorForm = this.fb4.group({
      pacienteIdBusqueda  : ['', [] ],
      cedulaBusqueda  : ['', [] ]
    });

    //this.pacienteForm.get('pacienteId').disable();

    this.stockForm = this.fb5.group({
      insumos : this.fb5.group({
        insumoId  : [null, [ Validators.required] ]
      }),
    });

    this.buscadorStockForm = this.fb6.group({
      insumoId  : [null, [] ],
      codigo  : [null, [] ],
      descripcion  : [null, [] ],
      fechaVencimiento: [null, [] ]
    });
    
    this.buscadorEnfermedadesCie10Form = this.fb7.group({      
      enfermedadCie10Id  : [null, [] ],
      codigo  : [null, [] ],
      descripcion  : [null, [] ],
    });
    
    this.anamnesisForm = this.fb8.group({
      anamnesisId  : [null, [] ],
      motivoConsultaId: [null, [ Validators.required]  ],
      antecedentes  : [null, [] ],
      antecedentesRemotos  : [null, [] ]
    });

    this.diagnosticoPrimarioForm = this.fb9.group({
      diagnosticoPrincipal  : [null, [ Validators.required]  ],
      terminoEstandarPrincipal  : [null, [] ]
    });

    this.diagnosticoSecundarioForm = this.fb10.group({
      diagnosticoSecundario  : [null, [] ],
      terminoEstandarSecundario  : [null, [] ]
    });

    this.selectFichaMedicaForm  = this.fb11.group({
      selectOpcionFicha  : [null, [] ],
      selectAlergeno  : [null, [] ],
      selectAntecPatologiasProcedimientos  : [null, [] ]
    });

    this.tratamientoFarmacologicoForm = this.fb12.group({
      prescripcionFarm  : [null, [] ]
    });

    this.tratamientoNoFarmacologicoForm = this.fb13.group({
      descripcionTratamiento  : [null, [] ]
    });

    this.planTrabajoForm = this.fb14.group({
      descripcionPlan  : [null, [] ]
    });
  }

  crearTablaModel(){
    this.dtOptionsBuscador = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },     
      searching: false,
      processing: true,
      columns: [ { data: 'pacienteId' }, { data: 'cedula' }, 
      { data: 'nombres' }, { data: 'apellidos' }]      
    };
  }

  crearTablaPatologias(){
    this.dtOptionsPatologias = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false, 
      info : true,     
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'patologiaId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'estado'},
        {data:'Editar'}
      ]
    };
  }

  crearTablaAntecedentes(){
    this.dtOptionsAntecedentes = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      info : true,
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'antecedenteId'}, {data:'patologiasProcedimientos.descripcion'} ,
        {data:'tipo'}
      ]
    };
  }

  crearTablaAntecedentesFamiliares(){
    this.dtOptionsAntecedentesFamiliares = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      info : true,
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'antecedenteId'}, {data:'patologiasProcedimientos.descripcion'} ,
        {data:'tipo'}
      ]
    };
  }

  crearTablaAlergias(){
    this.dtOptionsAlergias = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,      
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'alergiaId'},
        {data:'alergenos.descripcion'}
      ]
    };
  }

  crearTablaModelStock(){
    this.dtOptionsStock = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },     
      searching: false,
      processing: true,
      columns: [ {data:'stockId'}, {data:'insumos.codigo'}, 
      {data:'insumos.descripcion'}, {data:'insumos.tipo'},
      {data:'cantidad'}, {data:'insumo.fechaVencimiento'}, 
      {data:'unidadMedida'}]      
    };
  }

  crearTablaModelTerminoEstandar(){
    this.dtOptionsEnfermedadCie10 = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },     
      searching: false,
      processing: true,
      columns: [ {data:'id'}, {data:'codigoUnico'}, 
      {data:'termino'}]      
    };
  }
  
  crearTablaConsultas(){
    this.dtOptionsConsultas = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      order: [0,"desc"],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },
      processing: true,
      columns: [ {data:'consultaId'}, {data:'fecha'}, 
      {data:'anamnesis.descripcion'},
      {data:'diagnosticos.enfermedadCie10Primaria.codigo'},
      {data:'diagnosticos.enfermedadCie10Secundaria.codigo'},
      {data:'diagnosticos.diagnosticoPrincipal'},      
      {data:'diagnosticos.diagnosticoSecundario'}, 
      {data:'tratamientos.descripcionTratamiento'},
      {data:'areas.codigo'}, {data:'ver'}]      
    };
  }

  crearSignosVitales(){
    this.dtOptionsSignosVitales = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      order: [0,"desc"],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },
      processing: true,
      columns: [ {data:'signoVitalId'}, {data:'fecha'}, 
      {data:'frecuenciaCardiaca'},
      {data:'frecuenciaRespiratoria'},
      {data:'presionArterial'},
      {data:'temperatura'},      
      {data:'peso'}, 
      {data:'talla'}, {data:'funcionarios.personas.nombres'}, {data:'ver'}]      
    };
  }

  crearFichaMedica(){
    this.dtOptionsFichaMedica = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      order: [0,"desc"],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },
      processing: true,
      columns: [ {data:'#'}, {data:'id'}, {data:'codigo'}, 
      {data:'descripcion'},
      {data:'tipo'}, {data:'quitar'}]      
    };
  }

  crearTablaMedicamentos(){
    this.dtOptionsMedicamentos = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,  
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
        "emptyTable":" "
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'insumoId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'fechaVencimiento'}, 
        {data:'cantidad'}, 
        {data:'quitar'}
      ]      
    };
  }

  buscadorPacientes(event) {
    event.preventDefault();
    
    var persona: PersonaModelo = new PersonaModelo();
    var buscadorPaciente: PacienteModelo = new PacienteModelo();

    persona.cedula = this.buscadorModalForm.get('cedula').value;
    persona.nombres = this.buscadorModalForm.get('nombres').value;
    persona.apellidos = this.buscadorModalForm.get('apellidos').value;
    buscadorPaciente.personas = persona;

    if(!buscadorPaciente.personas.cedula 
      && !buscadorPaciente.personas.nombres && !buscadorPaciente.personas.apellidos){
      this.alert=true;
      return;
    }
    this.cargando = true;
    this.pacientesService.buscarPacientesFiltros(buscadorPaciente)
    .subscribe( resp => {
      this.pacientes = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  quitarMedicamento(event, tratamientoInsumo: TratamientoInsumoModelo ) {

    for (let i = 0; i < this.tratamientosInsumos.length; i++) {
      if( this.tratamientosInsumos[i].insumos.insumoId == tratamientoInsumo.insumos.insumoId ){
        $('#tableMedicamentos').DataTable().destroy();
        this.tratamientosInsumos.splice(i, 1);        
        this.dtTriggerMedicamentos.next();
        break;
      }
    }
  }
  quitarFicha(event, ficha: FichaMedicaModelo ) {

    for (let i = 0; i < this.fichaMedica.length; i++) {
      if( this.fichaMedica[i].id == ficha.id ){
        $('#tableFichaMedica').DataTable().destroy();
        this.fichaMedica.splice(i, 1);        
        this.dtTriggerFichaMedica.next();
        break;
      }
    }
  }

  buscadorStock(event) {
    event.preventDefault();
    var buscador = new StockModelo();
    var insumo = new InsumoModelo();
    insumo = this.buscadorStockForm.getRawValue();

    if( !insumo.codigo && !insumo.descripcion ){
      this.alert=true;
      return;
    }
    buscador.insumos = insumo;
    this.stockService.buscarStocksFiltrosTabla(buscador)
    .subscribe( resp => {
      this.stocks = resp;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  buscadorEnfermedadCie10(event) {
    event.preventDefault();
    var buscador = new EnfermedadCie10Modelo();

    buscador = this.buscadorEnfermedadesCie10Form.getRawValue();

    if( !buscador.enfermedadCie10Id && !buscador.codigo && !buscador.descripcion ){
      this.alert=true;
      return;
    }
    this.enfermedadesCie10Service.buscarEnfermedadesCie10FiltrosTabla(buscador)
    .subscribe( resp => {
      this.enfermedadesCie10 = resp;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  selectStock(event, stock: StockModelo){
    this.modalService.dismissAll();
   
    this.insumosService.getInsumo( stock.insumos.insumoId )
      .subscribe( (resp: InsumoModelo) => {

        var tratamientoInsumo: TratamientoInsumoModelo  = new TratamientoInsumoModelo();
        tratamientoInsumo.insumos = resp;

        if(this.tratamientosInsumos.length > 0){
          for (let i = 0; i < this.tratamientosInsumos.length; i++) {
            if(this.tratamientosInsumos[i].insumos.insumoId == resp.insumoId){
              this.alertMedicamentos=true;
              return null;
            }
          }
          $('#tableMedicamentos').DataTable().destroy();
          this.tratamientosInsumos.push(tratamientoInsumo);
          this.dtTriggerMedicamentos.next();
        }else{
          $('#tableMedicamentos').DataTable().destroy();
          this.tratamientosInsumos.push(tratamientoInsumo);
          this.dtTriggerMedicamentos.next();
         
        }
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
        }
      );
  }

  selectEnfermedadCie10(event, enfermedadCie10: EnfermedadCie10Modelo){
    this.modalService.dismissAll();

    this.enfermedadesCie10Service.getEnfermedadCie10( enfermedadCie10.enfermedadCie10Id )
      .subscribe( (resp: EnfermedadCie10Modelo) => {
        if ( this.tipoDiagnostico == "P" ){
          this.enfermedadCie10PrincipalSeleccionada = resp;
        }else if ( this.tipoDiagnostico == "S" ){
          this.enfermedadCie10SecundariaSeleccionada = resp;
        }
        this.tipoDiagnostico = null;
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
        }
      );
  }

  limpiarModal(event) {
    event.preventDefault();
    this.buscadorModalForm.reset();
  }

  limpiarModalStock(event) {
    event.preventDefault();
    this.buscadorStockForm.reset();
  }

  limpiarModalTerminoEstandar(event) {
    event.preventDefault();
    this.buscadorEnfermedadesCie10Form.reset();
    this.enfermedadesCie10 = [];
  }

  limpiar(event){
    event.preventDefault();
    this.pacienteForm.reset();
    this.historialClinicoForm.reset();
    this.buscadorForm.reset();
    this.anamnesisForm.reset();
    this.antecedentes = [];
    $('#tableAntecedentes').DataTable().destroy();
    this.antecedentesFamiliares = [];
    $('#tableAntecedentesFamiliares').DataTable().destroy();
    this.alergias = [];
    $('#tableAlergias').DataTable().destroy();
    this.consultas = [];
    $('#tableConsultas').DataTable().destroy();
    this.signosVitales = [];
    $('#tableSignosVitales').DataTable().destroy();
    this.diagnosticoPrimarioForm.reset();
    this.diagnosticoSecundarioForm.reset();
    this.tratamientoFarmacologicoForm.reset();
    this.tratamientoNoFarmacologicoForm.reset();
    this.planTrabajoForm.reset();
    this.enfermedadCie10PrincipalSeleccionada = new EnfermedadCie10Modelo();
    this.enfermedadCie10SecundariaSeleccionada = new EnfermedadCie10Modelo();
    this.alertGeneral=false;
    this.guardarBtn = true;
  }

  limpiarDiagnosticoTratamiento() {
    this.diagnosticoPrimarioForm.reset();
    this.diagnosticoSecundarioForm.reset();
    this.tratamientoFarmacologicoForm.reset();
    this.tratamientoNoFarmacologicoForm.reset();
    this.selectFichaMedicaForm.reset();
    this.planTrabajoForm.reset();
    this.anamnesisForm.reset();
    this.tratamientosInsumos = [];
    $('#tableMedicamentos').DataTable().destroy();
    this.dtTriggerMedicamentos.next();
    $('#tableFichaMedica').DataTable().destroy();
    this.dtTriggerFichaMedica.next();
    this.enfermedadCie10PrincipalSeleccionada = new EnfermedadCie10Modelo();
    this.enfermedadCie10SecundariaSeleccionada = new EnfermedadCie10Modelo();    
  }

  cerrarAlert(){
    this.alert=false;
  }
  cerrarAlertMedicamento(){
    this.alertMedicamentos=false;
  }
  cerrarAlertGeneral(){
    this.alertGeneral=false;
  }

  openModal(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorModalForm.patchValue({
      pacienteId: '',
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.pacientes = [];
    this.alert=false;    
  }

  openModalStock(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorStockForm.patchValue({
      insumoId: null,
      codigo: null,
      descripcion: null,
      fechaVencimiento: null
    });
    this.stocks = [];
    this.alert=false;
  }

  openModalTerminoEstandar(targetModal, tipo) {
    this.tipoDiagnostico = tipo;
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorEnfermedadesCie10Form.patchValue({
      enfermedadCie10Id  : null,
      codigo  : null,
      descripcion  : null
    });
    this.enfermedadesCie10 = [];
    this.alert=false;
  }

  selectPaciente(event, paciente: PacienteModelo){
    this.modalService.dismissAll();
    if(paciente.pacienteId){
      this.buscadorForm.get('pacienteIdBusqueda').setValue(paciente.pacienteId);
    }
    this.pacientesService.getPaciente( paciente.pacienteId )
      .subscribe( (resp: PacienteModelo) => {         
        //this.pacienteForm.patchValue(resp);
        this.buscadorForm.get('cedulaBusqueda').setValue(resp.personas.cedula);
        this.buscadorForm.get('pacienteIdBusqueda').setValue(resp.pacienteId);
        this.buscarPaciente(event);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.buscadorForm.get('pacienteIdBusqueda').setValue(null);
        }
      );
  }

  onSubmit() {
    this.modalService.dismissAll();
  }

  /*guardarAnamnesis(event){
    event.preventDefault();
    if ( this.anamnesisForm.invalid ) {

      return Object.values( this.anamnesisForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;
    var anamnesis: AnamnesisModelo;
    anamnesis = this.anamnesisForm.getRawValue();

    if ( anamnesis.anamnesisId ) {
      //Modificar
      anamnesis.pacienteId = this.paciente.pacienteId;
      anamnesis.usuarioModificacion = 'admin';
      peticion = this.anamnesisService.actualizarAnamnesis( anamnesis );
    } else {
      //Agregar
      anamnesis.pacienteId = this.paciente.pacienteId;
      anamnesis.usuarioCreacion = 'admin';
      peticion = this.anamnesisService.crearAnamnesis( anamnesis );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: anamnesis.anamnesisId ? anamnesis.anamnesisId.toString(): null,
                text: resp.mensaje,
              }).then( resp => {       

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
       }
    );
  }*/

  guardarDiagnosticoTratamiento(event){
    event.preventDefault();
    if ( this.diagnosticoPrimarioForm.invalid ) {

      return Object.values( this.diagnosticoPrimarioForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.diagnosticoSecundarioForm.invalid ) {

      return Object.values( this.diagnosticoSecundarioForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.anamnesisForm.invalid ) {

      return Object.values( this.anamnesisForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.tratamientoFarmacologicoForm.invalid ) {

      return Object.values( this.tratamientoFarmacologicoForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.tratamientoNoFarmacologicoForm.invalid ) {

      return Object.values( this.tratamientoNoFarmacologicoForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.planTrabajoForm.invalid ) {

      return Object.values( this.planTrabajoForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;
    var diagnostico: DiagnosticoModelo = new DiagnosticoModelo();
    var tratamiento: TratamientoModelo = new TratamientoModelo();
    var procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo = new ProcesoDiagnosticoTratamientoModelo();
    var tratamientoInsumoList: TratamientoInsumoModelo[] = new Array();
    var fichaMedicaList: FichaMedicaModelo[] = new Array();
    var consulta: ConsultaModelo = new ConsultaModelo();
    //var enfermedadCie10Principal = new EnfermedadCie10Modelo();
    var anamnesis: AnamnesisModelo;
    var motivoConsulta : MotivoConsultaModelo = new MotivoConsultaModelo;

    anamnesis = this.anamnesisForm.getRawValue();
    motivoConsulta.motivoConsultaId = this.anamnesisForm.get('motivoConsultaId').value;
    anamnesis.motivoConsulta = motivoConsulta;
    anamnesis.usuarioCreacion = 'admin';

    //enfermedadCie10Principal.enfermedadCie10Id = this.enfermedadCie10PrincipalSeleccionada.enfermedadCie10Id;
    /*if( !this.enfermedadCie10PrincipalSeleccionada.enfermedadCie10Id ){
      enfermedadCie10Principal = null;
    }*/
    diagnostico.diagnosticoPrincipal = this.diagnosticoPrimarioForm.get('diagnosticoPrincipal').value;
    diagnostico.diagnosticoSecundario = this.diagnosticoSecundarioForm.get('diagnosticoSecundario').value;
    diagnostico.enfermedadCie10PrimariaId = this.enfermedadCie10PrincipalSeleccionada.enfermedadCie10Id;
    diagnostico.enfermedadCie10SecundariaId = this.enfermedadCie10SecundariaSeleccionada.enfermedadCie10Id;
    diagnostico.usuarioCreacion = 'admin';

    tratamiento.prescripcionFarm = this.tratamientoFarmacologicoForm.get('prescripcionFarm').value;
    tratamiento.descripcionTratamiento = this.tratamientoNoFarmacologicoForm.get('descripcionTratamiento').value;
    tratamiento.descripcionPlanTrabajo = this.planTrabajoForm.get('descripcionPlan').value;
    tratamiento.usuarioCreacion = 'admin';

    var rows =  $('#tableMedicamentos').DataTable().rows().data();  
    var cantidades = rows.$('input').serializeArray();

    for (let i = 0; i < cantidades.length; i++) {
      this.tratamientosInsumos[i].cantidad = Number(cantidades[i].value);
    }    

    tratamientoInsumoList = this.tratamientosInsumos;
    fichaMedicaList = this.fichaMedica;

    consulta.pacienteId = this.paciente.pacienteId;
    consulta.areas.areaId = 83;//cambiar por el area del funcionario
    consulta.funcionarios.funcionarioId = 3; //cambiar por el id del funcionario
    consulta.usuarioCreacion = 'admin';

    procesoDiagnosticoTratamiento.diagnostico = diagnostico;
    procesoDiagnosticoTratamiento.tratamiento = tratamiento;
    procesoDiagnosticoTratamiento.tratamientoInsumoList = tratamientoInsumoList;
    procesoDiagnosticoTratamiento.consulta = consulta;
    procesoDiagnosticoTratamiento.anamnesis = anamnesis;
    procesoDiagnosticoTratamiento.fichaMedicaList = fichaMedicaList;

    peticion = this.procesoDiagnosticoTratamientoService.crearProcesoDiagnosticoTratamiento(procesoDiagnosticoTratamiento);
    
    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                text: resp.mensaje,
      }).then( resp => {       
                this.limpiarDiagnosticoTratamiento();
                this.obtenerConsultas();
                this.obtenerFichaMedica();
      });

    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
       }
    );
  }

  get antecedentesNoValido() {
    return this.anamnesisForm.get('antecedentes').invalid 
    && this.anamnesisForm.get('antecedentes').touched
  }

  get antecedentesRemotosNoValido() {
    return this.anamnesisForm.get('antecedentesRemotos').invalid 
    && this.anamnesisForm.get('antecedentesRemotos').touched
  }

  get motivoNoValido() {
    return this.anamnesisForm.get('motivoConsultaId').invalid 
    && this.anamnesisForm.get('motivoConsultaId').touched
  }

  get diagnosticoNoValido() {
    return this.diagnosticoPrimarioForm.get('diagnosticoPrincipal').invalid 
    && this.diagnosticoPrimarioForm.get('diagnosticoPrincipal').touched
  }

}
