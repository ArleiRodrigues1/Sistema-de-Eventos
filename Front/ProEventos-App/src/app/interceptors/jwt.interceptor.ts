import { Observable, take } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/identity/User';
import { AccountService } from '../service/account.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    let currentUser: User;

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      currentUser = user;

      if (currentUser != null) {
        request = request.clone({
          setHeaders : {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
      }
    });

    return next.handle(request);
  }
}
