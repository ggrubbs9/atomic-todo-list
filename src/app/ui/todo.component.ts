import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="todo-wrapper">
        <h1 class="title">Todo List</h1>

        <!-- Add Task Section -->
        <div class="add-task-section">
          <input
            class="task-input"
            placeholder="Add a new task..."
            type="text"
            [(ngModel)]="newTask"
            (keydown.enter)="addTask()" />
          <button class="add-button" type="button" (click)="addTask()">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
        </div>

        <!-- Tasks List -->
        <div class="tasks-container">
          <!-- @if (tasks.length === 0) {
            <div class="empty-state">No tasks yet. Add one above!</div>
          } -->
          @for (task of tasks; track task.id) {
            <div class="task-item" [class.completed]="task.completed">
              <input
                class="task-checkbox"
                type="checkbox"
                [checked]="task.completed"
                [disabled]="editingTaskId === task.id"
                [id]="'task-' + task.id"
                (change)="toggleTaskCompletion(task.id)" />

              @if (editingTaskId === task.id) {
                <!-- Edit Mode -->
                <input
                  #editInput
                  class="edit-input"
                  type="text"
                  [(ngModel)]="editingText"
                  (keydown.enter)="saveEdit()"
                  (keydown.escape)="cancelEdit()" />
                <button class="action-button save-button" title="Save edit" type="button" (click)="saveEdit()">
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </button>
                <button class="action-button cancel-button" title="Cancel edit" type="button" (click)="cancelEdit()">
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </button>
              } @else {
                <!-- Display Mode -->
                <label class="task-label" [class.completed-text]="task.completed" [for]="'task-' + task.id">
                  {{ task.text }}
                </label>
                <button class="action-button edit-button" title="Edit task" type="button" (click)="startEditing(task)">
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2" />
                  </svg>
                </button>
                <button
                  class="action-button delete-button"
                  title="Remove task"
                  type="button"
                  (click)="removeTask(task.id)">
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2" />
                  </svg>
                </button>
              }
            </div>
          } @empty {
            <div class="empty-state">No tasks yet. Add one above!</div>
          }
        </div>

        <!-- Task Summary -->
        @if (tasks.length > 0) {
          <div class="task-summary">{{ getCompletedTasksCount() }} of {{ tasks.length }} tasks completed</div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  tasks: Task[] = [];
  newTask = '';
  editingTaskId: number | null = null;
  editingText = '';

  addTask(): void {
    if (this.newTask.trim() !== '') {
      const task: Task = {
        id: Date.now(),
        text: this.newTask.trim(),
        completed: false,
      };
      this.tasks.push(task);
      this.newTask = '';
    }
  }

  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  startEditing(task: Task): void {
    this.editingTaskId = task.id;
    this.editingText = task.text;

    setTimeout(() => {
      const editInput = document.querySelector('.edit-input') as HTMLInputElement;
      if (editInput) {
        editInput.focus();
        editInput.select();
      }
    });
  }

  saveEdit(): void {
    if (this.editingText.trim() !== '') {
      const task = this.tasks.find((t) => t.id === this.editingTaskId);
      if (task) {
        task.text = this.editingText.trim();
      }
    }
    this.editingTaskId = null;
    this.editingText = '';
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editingText = '';
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }
}
