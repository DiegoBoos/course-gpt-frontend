import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarMenuItemComponent } from '../../components/sidebarMenuItem/sidebarMenuItem.component';
import { ChatService } from 'app/presentation/services/chat.service';
import { CourseService } from 'app/presentation/services/course.service';
import { filter } from 'rxjs';
import { MessageResponse } from '../../../interfaces/message.response';
import { ChatHistoryService } from '../../services/chat-history.service';
import { ChatResponse } from '@interfaces/chat.response';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarMenuItemComponent],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  public pathname = '';
  public chats = signal<ChatResponse[]>([]);
  public isLoading = signal(false);
  public isActive = signal(false);
  public courseService = inject(CourseService);
  public chatService = inject(ChatService);
  public chatHistoryService = inject(ChatHistoryService);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.pathname = this.getLastRouteSegment();
      });

    effect(
      () => {
        if (
          this.pathname === this.courseService.courseCode() ||
          this.pathname === this.courseService.chatHistoryId()
        ) {
          this.isActive.set(
            this.pathname === this.courseService.chatHistoryId()
          );

          this.loadChats(this.courseService.courseCode());
        }
      },
      { allowSignalWrites: true }
    );
  }

  getLastRouteSegment(): string {
    const urlSegments = this.router.url.split('/');
    return urlSegments[urlSegments.length - 1];
  }

  loadChats(courseCode: string) {
    this.isLoading.set(true);

    this.chatService.getChats(courseCode).subscribe((resp) => {
      this.loadMessages(resp);
    });
  }

  loadMessages(chats: ChatResponse[]) {
    if (chats.length === 0) {
      this.isLoading.set(false);
      this.chats.set([]);
      return;
    }

    chats.forEach((chat) => {
      this.chatHistoryService
        .getChatHistory(chat.chatHistoryId)
        .subscribe((resp) => {
          this.isLoading.set(false);
          const messages: MessageResponse[] = resp;

          this.chats.set(
            chats.map((chat) => ({
              ...chat,
              messages: messages.map((msg) => ({
                ...msg,
              })),
            }))
          );
        });
    });
  }

  addNewChat() {
    this.chatService
      .saveChat(this.courseService.courseCode())
      .subscribe((resp: ChatResponse) => {
        const { course, chatHistoryId } = resp;

        this.router.navigateByUrl(
          `course/${course.courseCode}/${chatHistoryId}`
        );
        this.loadChats(this.courseService.courseCode());
      });
  }

  deleteChat(chatHistoryId: string) {
    this.chatService.deleteChat(chatHistoryId).subscribe(() => {
      this.router.navigateByUrl(`course/${this.courseService.courseCode()}`);
      this.loadChats(this.courseService.courseCode());
    });
  }
}
