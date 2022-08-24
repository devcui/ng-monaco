import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { EditorComponent } from './editor.component';
import {EditorRoutingModule} from "./editor-routing";

@NgModule({
  declarations: [
    EditorComponent
  ],
  imports: [
    SharedModule,
    EditorRoutingModule
  ]
})
export class EditorModule { }
