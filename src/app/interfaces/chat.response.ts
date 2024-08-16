import { CourseResponse } from './course.response';
import { MessageResponse } from './message.response';

export interface ChatResponse {
  chatHistoryId: string;
  course: CourseResponse;
  messages?: MessageResponse[];
}
