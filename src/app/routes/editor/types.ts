import * as monaco from "monaco-editor";

import {editor} from "monaco-editor";

export type Monaco = typeof monaco;
export type  ICodeEditor = editor.ICodeEditor;
export type ITextModel = editor.ITextModel
export type Position = monaco.Position
export type CompletionContext = monaco.languages.CompletionContext
export type CancellationToken = monaco.CancellationToken
export type ProviderResult<T> = monaco.languages.ProviderResult<T>
export interface CompletionList extends monaco.languages.CompletionList {
}

