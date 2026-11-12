import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginServer } from './login.server';


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
    private loginServer: LoginServer
  ) { 
    this.loginServer = loginServer;
  }

  ngOnInit() {
  }

  store(){
    console.log(this.user)
    if(Object.values(this.user).some(value => value === null)){
      alert("Vazio!");
      return;
    }
    this.loginServer.createUser(this.user).subscribe({
      next: (response: any)=>{
        console.log(response)
      }
    })
  }
  

}
