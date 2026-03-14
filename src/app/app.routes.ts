import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';

export const routes: Routes = [
     {path: '', component: HomePage},
     {path: 'poll', loadComponent: () => import('./components/poll/poll.component').then(m => m.PollComponent)},
     {path: 'profile-pic', loadComponent: () => import('./components/profile-pic/profile-pic.component').then(m => m.ProfilePicComponent)}
];
