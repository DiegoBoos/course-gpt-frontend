import { Injectable } from '@angular/core';
import { MessageResponse } from '@interfaces/message.response';
import { environment } from 'environments/environment.development';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  saveTextMessages(
    chatHistoryId: string,
    messages: MessageResponse[]
  ): Observable<{ ok: boolean }> {
    return from(
      fetch(`${environment.backendApi}/messages/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistoryId,
          messages,
        }),
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error saving chat history');
          return { ok: true };
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }

  getChatHistory(chatHistoryId: string): Observable<any> {
    return from(
      fetch(`${environment.backendApi}/messages/${chatHistoryId}`, {
        method: 'GET',
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error fetching chat history');
          return resp.json();
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }

  deleteChatHistory(chatId: string): Observable<{ ok: boolean }> {
    return from(
      fetch(`${environment.backendApi}/messages/${chatId}`, {
        method: 'DELETE',
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error deleting chat history');
          return { ok: true };
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }
}
