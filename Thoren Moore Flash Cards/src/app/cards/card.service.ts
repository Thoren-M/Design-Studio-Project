import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CreateCardDto, UpdateCardDto } from './card.model';


@Injectable({
  providedIn: 'root',
})
export class CardService {
  private  http = inject(HttpClient);
  private  apiUrl = 'http://localhost:8000/cards';

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  createCard(payload: CreateCardDto): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, payload);
  }

  updateCard(id: number | string, updates: UpdateCardDto): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, updates);
  }

  deleteCard(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}