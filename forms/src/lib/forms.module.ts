import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FORMLY_CONFIG, FormlyConfig } from '@ngx-formly/core';
import { FormsConfig } from './forms.config';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({})
  ],
  providers:[
    { provide: FORMLY_CONFIG, multi: true, useFactory: FormsConfig, deps: [FormlyConfig] },
  ]
})
export class FormsConfigModule { }
