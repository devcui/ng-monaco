import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {Monaco} from "./types";

@Injectable({providedIn: "root"})
export class EditorService {


  constructor(
    http: HttpClient,
    @Inject(DOCUMENT) protected doc: Document,
  ) {
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

}
