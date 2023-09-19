import { Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { AccountService } from 'src/app/service/account.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit {
    
    constructor(public accountService: AccountService,
                private router: Router) {}
                
    ngOnInit(): void {}

    public showMenu(): boolean{
        return this.router.url !== '/user/login' && this.router.url !== '/user/registration';
    }

    public logout(): void {
        this.accountService.logout();
        this.router.navigateByUrl('/user/login');
    }
}
