import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poll } from '../types/poll.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollApi {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/app/polls';

  public getPolls():Observable<Poll[]> {
    return this.httpClient.get<Poll[]>(this.baseUrl);
  }

  public createPoll(poll: Poll): Observable<Poll> {
    return this.httpClient.post<Poll>(this.baseUrl, poll);
  }

  public vote(pollId: number | null, optionIndex: number): Observable<void> {
    const url = `${this.baseUrl}/vote`;
    return this.httpClient.post<void>(url, { pollId, optionIndex });
  }
}
