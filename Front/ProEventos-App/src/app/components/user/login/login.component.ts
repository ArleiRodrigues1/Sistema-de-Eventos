import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from 'src/app/models/identity/UserLogin';
import { AccountService } from 'src/app/service/account.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;

  constructor(private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  public login(): void {
    this.accountService.login(this.model).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
        this.toastr.success('Login realizado', 'Sucesso');
      },
      (error: any) => {
       if(error.status == 401) this.toastr.error('Usuário ou Senha inválidos', 'Erro');
       
       else console.error(error);
      }
    );
  }

}
