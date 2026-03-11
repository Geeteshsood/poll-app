import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollApi } from '../services/poll-api';
import { Poll } from '../types/poll.model';
import { FormsModule } from '@angular/forms';
import { UploadComponent } from './upload/upload.component';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [FormsModule, CommonModule, UploadComponent],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.scss',
})
export class PollComponent implements OnInit {
  public newPoll = signal<Poll>({
    id: null,
    question: '',
    options: [
      { optionText: '', voteCount: 0 },
      { optionText: '', voteCount: 0 },
    ],
  });

  public polls = signal<Poll[]>([]);
  
  private pollService = inject(PollApi);

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls() {
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls.set(data);
      },
      error: (error) => {
        console.error('Error fetching polls: ', error);
      },
    });
  }

  addOption() {
     this.newPoll.update((poll) => {
      return {
        ...poll,
        options: [...poll.options , { optionText: '', voteCount: 0 }]
      }
     })
  }

  createPoll() {
    this.pollService.createPoll(this.newPoll()).subscribe({
      next: (createdPoll) => {
        this.polls.set([...this.polls(), createdPoll]);
        this.resetPoll();
      },
      error: (error) => {
        console.error('Error creating polls: ', error);
      },
    });
  }

  resetPoll() {
    this.newPoll.set({
      id: null,
      question: '',
      options: [
        { optionText: '', voteCount: 0 },
        { optionText: '', voteCount: 0 },
      ],
    });
  }

  vote(pollId: number | null, optionIndex: number) {
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: () => {
          const updatedPolls = this.polls().map(p => {
            if(p.id === pollId) {
              const updatedOptions = [...p.options];
              updatedOptions[optionIndex].voteCount += 1;
              return { ...p, options: updatedOptions };
            }
            return p;
          });
          this.polls.set(updatedPolls);
      },
      error: (error) => {
        console.error('Error voting on a poll: ', error);
      },
    });
  }
}
