import { ValidatorField } from './../../../helpers/ValidatorField';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/identity/User';
import { AccountService } from 'src/app/service/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {  NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  user = {} as User;
  form!: FormGroup;

  constructor(public fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  get f(): any { return this.form.controls; }

  ngOnInit(): void {
    this.validation();
  } 

  private validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword')
    };

    this.form = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['',
        [Validators.required, Validators.email]
      ],
      userName: ['', Validators.required],
      password: ['',
        [Validators.required, Validators.minLength(6)]
      ],
      confirmPassword: ['', Validators.required],
    }, formOptions);
  }

  public register(): void {
    this.user = { ...this.form.value };
    this.accountService.register(this.user).subscribe(
      () => {
        this.spinner.show();
        this.router.navigateByUrl('/dashboard');
        this.toastr.success('Usuário criado com sucesso', 'Sucesso');
        this.spinner.hide();
      },
      (error: any) => {
        this.toastr.error('Erro ao criar conta', 'Erro');
      }
    )
  }

}