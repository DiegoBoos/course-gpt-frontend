import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseResponse } from '@interfaces/course.response';
import { CourseService } from 'app/presentation/services/course.service';
import { ChatMessageComponent } from '../../components/chat-bubbles/chatMessage/chatMessage.component';

@Component({
  selector: 'app-pros-cons-page',
  standalone: true,
  imports: [CommonModule, ChatMessageComponent, RouterModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {
  public courses = signal<CourseResponse[]>([]);
  public isLoading = signal(false);
  public courseService = inject(CourseService);

  constructor() {
    this.isLoading.set(true);
    this.courseService.getCourseData().subscribe((resp) => {
      this.isLoading.set(false);
      this.courses.set(resp);
    });
  }
}
