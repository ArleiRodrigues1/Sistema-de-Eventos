import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth implements CanActivate {
  constructor(private toastr: ToastrService, private router: Router) { }
  canActivate(): boolean {
    if (localStorage.getItem('user') !== null) 
    return true;

    this.toastr.info('Entre com sua conta!');
    this.router.navigate(['user/login']);
    
    return false;
  }
}