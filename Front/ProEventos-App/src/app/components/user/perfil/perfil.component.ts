import { ValidatorField } from './../../../helpers/ValidatorField';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserUpdate } from '../../../models/identity/UserUpdate';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validation();
    this.loadUser();
  }

  private loadUser(): void {
      this.spinner.show();
      this.accountService.getUser().subscribe({
        next: (useReturn: UserUpdate) => {
          console.log(useReturn);
          this.userUpdate = useReturn;
          this.form.patchValue(this.userUpdate);
          this.toastr.success('Usuário Carregado', 'Sucesso');
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Usuário não Carregado', 'Erro');
          this.router.navigate(['/dashboard']);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
  
  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword'),
    };

    this.form = this.fb.group(
      {
        userName: [''],
        title: ['NaoInformado', Validators.required],
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
        descricao: ['', Validators.required],
        function: ['NaoInformado', Validators.required],
        password: ['', [Validators.minLength(4), Validators.nullValidator]],
        confirmPassword: ['', Validators.nullValidator],
      },
      formOptions
    );
  }

  // Conveniente para pegar um FormField apenas com a letra F
  get f(): any {
    return this.form.controls;
  }


  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public onSubmit(): void {
    this.updateUser();
  }

  public updateUser(): void{
    this.userUpdate = { ...this.form.value }
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => {
        this.toastr.success('Usuario atualizado!', 'Sucesso');
      },
      (error) => {
          this.toastr.error(error.error);
          console.error(error);
      }, 
      () => {
        this.spinner.hide();
      }
    )
  }
}