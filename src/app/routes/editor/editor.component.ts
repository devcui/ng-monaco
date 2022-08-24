import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EditorService} from "./editor.service";
import {CancellationToken, CompletionContext, ICodeEditor, ITextModel, Monaco, Position} from "./types";
import {catchError, forkJoin, map} from "rxjs";
import {conf, language} from "./sql.language";

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
    forkJoin(
      this.editorService.loaderScript(),
      this.editorService.fetchDbKeywords(),
      this.editorService.fetchSchemaKeywords(),
      this.editorService.fetchTableKeywords(),
      this.editorService.fetchVariableKeywords()
    )
      .pipe(
        catchError((error) => {
          alert(error);
          return error
        }),
        map((results: any) => {
          const monaco: Monaco = results[0] as Monaco
          const lanKeyWords = [
            ...language["keywords"],
            ...language["operators"],
            ...language["builtinFunctions"],
            ...language["builtinVariables"]
          ]
          const dataSource = [
            {detail: 'SQL', keywords: lanKeyWords},
            {detail: 'Database', keywords: Array.from(results[1] as string[])},
            {detail: 'Table', keywords: Array.from(results[2] as string[])},
            {detail: 'Column', keywords: Array.from(results[3] as string [])},
            {detail: 'Variable', keywords: Array.from(results[4] as string[])},
          ];

          monaco.editor.onDidCreateEditor((codeEditor: ICodeEditor) => {
            monaco.languages.register({id: "sql"})
            monaco.languages.setLanguageConfiguration("sql", conf)
            monaco.languages.setMonarchTokensProvider("sql", language)
            monaco.languages.registerCompletionItemProvider("sql", {
              provideCompletionItems: (model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken) => {
                return this.editorService.provideCompletionItems(model, position, context, token, dataSource)
              }
            })
          })
          monaco.editor.create(this.monacoElementRef.nativeElement, {theme: 'vs-dark', language: "sql"})
        })
      ).subscribe()
  }

}
