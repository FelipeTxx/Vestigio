import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginServer } from './login.server';
import { HelpingService } from '../services/HelpingServices/helpingService';
import { Router } from '@angular/router';
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
    private authService: AuthService,
  ) { 
    this.loginServer = loginServer;
  }

  ngOnInit() {
  }

  store(){
    console.log(this.user)
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
        this.router.navigate(['/home']);
        
      },
      error: (err) => {
        this.helpingService.showToast(err.error.message);
      }
      
    })
  }

  log(){
    if (!this.user.email?.trim()) {
      this.helpingService.showToast('Preencha seu email.');
      return;
    }

    if (!this.user.password?.trim()) {
      this.helpingService.showToast('Preencha sua senha.');
      return;
    }

    this.loginServer.bad_login(this.user).subscribe({
      next: (response: any)=>{
        this.helpingService.showToast("Acessou!", "success");
        this.router.navigate(['/home']);
        
      },
      error: (err) => {
        this.helpingService.showToast(err.error.message);
      }
      
    })
  }

  login() {

    this.authService.login(this.user).subscribe({

      next: (response) => {

        // Login realizado e token armazenado.
        console.log('Usuário autenticado!', response.user);

        // Redireciona para a página principal.
        this.router.navigate(['/home']);

      },

      error: (err) => {

        // Exibe o erro retornado pelo Laravel.
        console.log(err.error.message);

      }

    });

  }
  

}
