import { Injectable } from '@angular/core';
import { LlmResponse } from '@interfaces/llm.response';
import { environment } from 'environments/environment.development';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LlmService {
  ragChat(input: string): Observable<LlmResponse> {
    return from(
      fetch(`${environment.backendPythonAPI}/chat/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error getting model response');
          return resp.json() as Promise<LlmResponse>;
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }

  conversationalChat(
    prompt: string,
    chatHistoryId: string
  ): Observable<LlmResponse> {
    return from(
      fetch(`${environment.backendPythonAPI}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, session_id: chatHistoryId }),
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error getting model response');
          return resp.json() as Promise<LlmResponse>;
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }
}
