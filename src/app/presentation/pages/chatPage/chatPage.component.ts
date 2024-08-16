import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
  TextMessageBoxFileComponent,
  TextMessageBoxSelectComponent,
} from '@components/index';

import { MessageResponse } from '@interfaces/message.response';
import { ChatHistoryService } from 'app/presentation/services/chat-history.service';
import { ChatService } from 'app/presentation/services/chat.service';
import { CourseService } from 'app/presentation/services/course.service';
import { LlmService } from 'app/presentation/services/llm.service';

@Component({
  selector: 'app-pros-cons-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './chatPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatPageComponent implements OnInit {
  public messages = signal<MessageResponse[]>([]);
  public isLoading = signal(false);
  public llamaService = inject(LlmService);
  public courseService = inject(CourseService);
  public chatService = inject(ChatService);
  public chatHistoryService = inject(ChatHistoryService);
  private cdr: ChangeDetectorRef;

  constructor(private route: ActivatedRoute, cdr: ChangeDetectorRef) {
    this.cdr = cdr;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const courseCode = params.get('courseCode');
      const chatHistoryId = params.get('chatHistoryId');
      this.courseService.courseCode.set(courseCode ?? '');
      this.courseService.chatHistoryId.set(chatHistoryId ?? '');

      this.loadChatHistory(chatHistoryId);
    });
  }

  loadChatHistory(chatHistoryId: string | null): void {
    if (!chatHistoryId) return;

    this.chatHistoryService.getChatHistory(chatHistoryId).subscribe((resp) => {
      let messages = resp.map((msg: any) => ({
        isLLM: msg.isLLM,
        text: msg.text,
        sources: msg.source,
      }));

      this.messages.set(messages);
      this.cdr.markForCheck();
    });
  }

  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [
      ...prev,
      { isLLM: false, text: prompt, source: [], title: '' },
    ]);

    this.llamaService
      .conversationalChat(prompt, this.courseService.chatHistoryId())
      .subscribe((resp) => {
        this.messages.update((prev) => [
          ...prev,
          {
            isLLM: true,
            text: resp.answer,
            source: resp.source,
            title: resp.title,
          },
        ]);

        this.saveTextMessages();
      });
  }

  saveTextMessages() {
    this.chatHistoryService
      .saveTextMessages(this.courseService.chatHistoryId(), this.messages())
      .subscribe(() => {
        this.isLoading.set(false);
      });
  }
}
