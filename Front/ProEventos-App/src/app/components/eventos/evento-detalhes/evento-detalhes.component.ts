import { Component, EnvironmentInjector, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig  ,BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/service/evento.service';
import { LoteService } from 'src/app/service/lote.service';
import { DatePipe } from '@angular/common';
import { Lote } from 'src/app/models/Lote';
import { add } from 'ngx-bootstrap/chronos';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evento-detalhes',
  templateUrl: './evento-detalhes.component.html',
  styleUrls: ['./evento-detalhes.component.scss'],
  providers: [ DatePipe ]
  
})

export class EventoDetalhesComponent implements OnInit {
  evento = {} as Evento;
  eventoId: number;
  form: FormGroup;
  stateSave = 'post';
  themeEvento: string;
  modalRef: BsModalRef;
  modalService: BsModalService;
  loteCurrent = {id: 0, nome: '', index: 0};
  imagemURL = 'assets/upload.jpg';
  file: File;

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      showWeekNumbers: false
    };
  }

  public editMode(): boolean {
    return this.stateSave === 'put';
  }

  get lotes(): FormArray {
    return (this.form.get('lotes') as FormArray);
  }

  get f(): any {
    return this.form.controls;
    
  }

  constructor(private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private bsModalService: BsModalService)
    {
      this.localeService.use('pt-br');
    }


  ngOnInit(): void {
    this.loadEvent();
    this.validation();
  }
  

  public loadEvent(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.stateSave = 'put';

      this.eventoService
        .getEventoById(this.eventoId).subscribe(
          (evento: Evento) => {
            this.evento = { ...evento };
            this.form.patchValue(this.evento);
            if (this.evento.imagemURL !== '' ) {
              this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
            }
            this.loadLotes();
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }  

  public loadLotes(): void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe({
      next:(returnLotes: Lote[]) => {
        returnLotes.forEach(lote => {
          this.lotes.push(this.createLote(lote));
        });
      },
      error: () => {
        this.toastr.error('Erro ao tentar carregar lotes', 'Erro!');
        console.error();
      },
    }).add(() => this.spinner.hide());
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campForm: FormControl | AbstractControl): any {
    return {'is-invalid': campForm.errors && campForm.touched};
  }

  public saveEvento(): void {
    this.evento = (this.stateSave === 'post') ?{ ...this.form.value } : { id: this.eventoId, ...this.form.value };

    this.eventoService[this.stateSave](this.evento).subscribe({
      next: (returnEvents: Evento) => {
        this.toastr.success('Evento salvo com sucesso', 'Sucesso!');
        this.router.navigate([`eventos/detalhe/${returnEvents.id}`]);
      },
      error: () => {
        console.error();
        this.toastr.error('Ocorreu um erro ao salvar o evento', 'Erro!');
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  
  public createLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }
  
  public addLote(): void {
    this.lotes.push(this.createLote({id: 0} as Lote));
  }

  public saveLote(): void{
    this.spinner.show();

    if(this.form.controls['lotes'].valid){
      this.loteService.saveLotes(this.eventoId, this.form.value.lotes).subscribe({
          next: () => {
            this.toastr.success('Lotes salvos com Sucesso!', 'Sucesso!');
          },
          error: (error: any) => {
            this.toastr.error('Erro ao tentar salvar lotes.', 'Erro');
            console.error(error);
          }
      }).add(() => this.spinner.hide());
    }
  }

  public excluirLote(template: TemplateRef<any>,
    index: number): void {

    this.loteCurrent.id = this.lotes.get(index + '.id').value;
    this.loteCurrent.nome = this.lotes.get(index + '.nome').value;
    this.loteCurrent.index = index;

    this.modalRef = this.bsModalService.show(template, {class: 'modal-sm' });
  }

  confirmDelete(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteCurrent.id)
      .subscribe({
        next: () => {
          this.toastr.success('Lote deletado com sucesso', 'Sucesso');
          this.lotes.removeAt(this.loteCurrent.index);
        },
        error: (error: any) => {
          this.toastr.error(`Erro ao tentar deletar o Lote ${this.loteCurrent.id}`, 'Erro');
          console.error(error);
        }
      }).add(() => this.spinner.hide());
  }
  
  public declineDelete():void {
    this.modalRef.hide();
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.loadEvent();
        this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error('Erro ao fazer upload de imagem', 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

}