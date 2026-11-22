import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'http://localhost:3001/api/chat';

  sendMessage(message: string, history: ChatTurn[]): Observable<string> {
    return this.http
      .post<ChatResponse>(this.endpoint, { message, history })
      .pipe(map(({ reply }) => reply));
  }
}
