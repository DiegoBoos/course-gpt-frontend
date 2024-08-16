import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseService } from 'app/presentation/services/course.service';
import { environment } from 'environments/environment.development';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [MarkdownModule, RouterModule],
  templateUrl: './chatMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  public readonly backendUrl = environment.backendApi;
  @Input({ required: true }) text!: string;
  @Input() source?: string[];

  constructor(private courseService: CourseService) {}

  public openSource(source: string): void {
    const url = `${
      this.backendUrl
    }/files/course?courseCode=${this.courseService.courseCode()}&fileName=${source}`;

    window && window.open
      ? window.open(url, '_blank')
      : alert('Please enable popups for this website');
  }
}
