import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginServer } from './login.server';
import { HelpingService } from '../services/HelpingServices/helpingService';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})

export class LoginPage implements OnInit {
  
  log_in = true;
  sign_in = false;
  user: any = {
    name: null,
    email: null,
    password: null
  };

  constructor(
    private http: HttpClient,
    private loginServer: LoginServer,
    private helpingService: HelpingService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { 
    this.loginServer = loginServer;
  }

  ngOnInit() {
    this.log_in = true;
    this.sign_in = false;

    if (this.route.snapshot.queryParamMap.has('sessionExpired')) {
      this.helpingService.showToast('Sua sessão expirou. Entre novamente.');
    }
  }

  store(){
    if (!this.user.name?.trim()) {
      this.helpingService.showToast('Preencha seu nome.');
      return;
    }

    if (!this.user.email?.trim()) {
      this.helpingService.showToast('Preencha seu email.');
      return;
    }

    if (!this.user.password?.trim()) {
      this.helpingService.showToast('Preencha sua senha.');
      return;
    }

    this.loginServer.createUser(this.user).subscribe({
      next: (response: any)=>{
        this.helpingService.showToast("Criado!", "success");
      },
      error: (err) => {
        this.helpingService.showToast(err.error.message);
      }
      
    })
  }


  login() {
    if (!this.user.email?.trim() || !this.user.password?.trim()) {
      this.helpingService.showToast('Informe seu email e senha.');
      return;
    }

    this.authService.login(this.user).subscribe({

      next: (response) => {

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/home');

      },

      error: (err) => {

        this.helpingService.showToast(err.error?.message ?? 'Não foi possível entrar.');

      }

    });

  }
  

}
