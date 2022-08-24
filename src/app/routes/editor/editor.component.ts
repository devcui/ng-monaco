import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EditorService} from "./editor.service";
import {Monaco} from "./types";
import {catchError, map} from "rxjs";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild("monacoElementRef", {static: false}) monacoElementRef!: ElementRef<HTMLDivElement>

  monaco?: Monaco

  constructor(private editorService: EditorService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.editorService.loaderScript().pipe(
      catchError((error) => {
        alert(error);
        return error
      }),
      map((monaco: Monaco) => {
        monaco.editor.create(this.monacoElementRef.nativeElement, {theme: 'vs-dark', language: "sql"})
      })
    ).subscribe()
  }

}
