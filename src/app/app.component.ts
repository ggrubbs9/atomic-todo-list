import { Component } from '@angular/core';
import { TodoComponent } from './ui/todo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoComponent],
  template: `
    <app-todo></app-todo>
  `
})
export class AppComponent {
  title = 'todo-app';
}