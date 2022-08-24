import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {forkJoin, from, map, Observable, of, zip} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {
  CancellationToken,
  CompletionContext,
  CompletionList,
  ITextModel,
  Monaco,
  Position,
  ProviderResult
} from "./types";
import * as monaco from "monaco-editor";

@Injectable({providedIn: "root"})
export class EditorService {


  constructor(
    http: HttpClient,
    @Inject(DOCUMENT) protected doc: Document,
  ) {
  }

  fetchVariableKeywords(): Observable<Array<string>> {
    return of(["admin", "master", "user", "role"])
  }

  fetchDbKeywords(): Observable<Array<string>> {
    return of(["db1", "db2", "db3", "db4"])
  }

  fetchSchemaKeywords(): Observable<Array<string>> {
    return of(["info", "flow", "teach", "project"])
  }

  fetchTableKeywords(): Observable<Array<string>> {
    return of(["usersTable", "rolesTable", "teacherTable", "studentTable"])
  }


  loaderScript(): Observable<any> {
    return from(new Promise((resolve, reject) => {
      const win: any = window;
      const loaderScript = this.doc.createElement('script') as HTMLScriptElement;
      loaderScript.type = 'text/javascript';
      loaderScript.src = `assets/monaco-editor/min/vs/loader.js`;
      loaderScript.onload = () => {
        win.require.config({paths: {vs: "assets/monaco-editor/min/vs"}})
        win.require(
          ["vs/editor/editor.main"],
          (monaco: Monaco) => {
            resolve(monaco)
          },
          () => {
            reject(`Unable to load editor/editor.main module, please check your network environment.`);
          }
        )
      };
      loaderScript.onerror = () => reject(`Unable to load ${loaderScript.src}, please check your network environment.`);
      this.doc.getElementsByTagName('head')[0].appendChild(loaderScript);
    }))
  }

  provideCompletionItems(model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken, dataSource: Array<any>): monaco.languages.ProviderResult<CompletionList> {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };
    return {
      suggestions: dataSource
        .filter(({keywords}) => !!keywords)
        .reduce<monaco.languages.CompletionItem[]>(
          (arr, {detail, keywords}) =>
            arr.concat(
              keywords!.map((str: string) => ({
                label: str,
                detail,
                kind: 17,
                insertText: detail === 'Variable' ? `$${str}$` : str,
                range,
              })),
            ),
          [],
        )
    }
  }

}
