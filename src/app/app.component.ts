import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoComponent } from './ui/todo/todo.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [TodoComponent],
  template: ` <app-todo /> `,
})
export class AppComponent {
  title = 'todo-app';
}
