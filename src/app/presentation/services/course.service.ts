import { Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment.development';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  public courseCode = signal<string>('');
  public chatHistoryId = signal<string>('');

  getCourseData(): Observable<any> {
    return from(
      fetch(`${environment.backendApi}/course`, {
        method: 'GET',
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('Error fetching courses');
          return resp.json();
        })
        .catch((error) => {
          throw new Error('Unexpected error');
        })
    );
  }
}
