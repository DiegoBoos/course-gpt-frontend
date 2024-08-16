import { Injectable } from '@angular/core';
import { ChatResponse } from '@interfaces/chat.response';
import { environment } from 'environments/environment.development';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  getChats(courseCode: string): Observable<ChatResponse[]> {
    return from(
      fetch(`${environment.backendApi}/chat/${courseCode}`, {
        method: 'GET',
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error fetching chats');
          return resp.json() as Promise<ChatResponse[]>;
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }

  saveChat(courseCode: string): Observable<any> {
    return from(
      fetch(`${environment.backendApi}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseCode }),
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error saving chat');
          return resp.json();
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }

  deleteChat(chatId: string): Observable<void> {
    return from(
      fetch(`${environment.backendApi}/chat/${chatId}`, {
        method: 'DELETE',
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error deleting chat');
          return;
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }
}
