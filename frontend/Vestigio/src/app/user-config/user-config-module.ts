import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';

import { UserConfigRoutingModule } from './user-config-routing-module';
import { UserConfig } from './user-config';


@NgModule({
  declarations: [
    UserConfig
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserConfigRoutingModule
  ]
})
export class UserConfigModule { }
