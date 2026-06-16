import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Copa } from '../models/copa.model';
import { Partida } from '../models/partida.model';

@Injectable({
  providedIn: 'root'
})
export class CopaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Iniciar a copa (POST)
  iniciarCopa(idTime: number): Observable<Copa> {
    return this.http.post<Copa>(`${this.apiUrl}/copa`, { idTimeEscolhido: idTime });
  }

  // Buscar estado atual da copa (GET)
  buscarCopa(idCopa: number): Observable<Copa> {
    return this.http.get<Copa>(`${this.apiUrl}/copa/${idCopa}`);
  }

  // Salvar placar (PUT)
  salvarPlacar(idPartida: number, placar: { placarCasa: number, placarFora: number }): Observable<Partida> {
    return this.http.put<Partida>(`${this.apiUrl}/partidas/${idPartida}`, placar);
  }
  
  excluirCopa(idCopa: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/copa/${idCopa}`);
  }
  
  trocarTime(idCopa: number, idNovoTime: number): Observable<Copa> {
    return this.http.put<Copa>(`${this.apiUrl}/copa/${idCopa}/time/${idNovoTime}`, {});
  }
}