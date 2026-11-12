import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginServer } from './login.server';
import { HelpingService } from '../HelpingService/helpingService';


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
    private helpingService: HelpingService
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
        console.log(response)
      },
      error: (err) => {
        this.helpingService.showToast(err.error.message);
      }
      
    })
  }

  log(){

  }
  

}
