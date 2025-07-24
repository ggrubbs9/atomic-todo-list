import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
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
            type="text"
            placeholder="Add a new task..."
            [(ngModel)]="newTask"
            (keydown.enter)="addTask()"
            class="task-input"
          />
          <button (click)="addTask()" class="add-button">
            <svg
              class="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Tasks List -->
        <div class="tasks-container">
          <div *ngIf="tasks.length === 0" class="empty-state">
            No tasks yet. Add one above!
          </div>

          <div
            *ngFor="let task of tasks"
            class="task-item"
            [class.completed]="task.completed"
          >
            <input
              type="checkbox"
              [id]="'task-' + task.id"
              [checked]="task.completed"
              (change)="toggleTaskCompletion(task.id)"
              [disabled]="editingTaskId === task.id"
              class="task-checkbox"
            />

            <!-- Edit Mode -->
            <ng-container *ngIf="editingTaskId === task.id; else displayMode">
              <input
                type="text"
                [(ngModel)]="editingText"
                (keydown.enter)="saveEdit()"
                (keydown.escape)="cancelEdit()"
                class="edit-input"
                #editInput
              />
              <button
                (click)="saveEdit()"
                class="action-button save-button"
                title="Save edit"
              >
                <svg
                  class="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </button>
              <button
                (click)="cancelEdit()"
                class="action-button cancel-button"
                title="Cancel edit"
              >
                <svg
                  class="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </ng-container>

            <!-- Display Mode -->
            <ng-template #displayMode>
              <label
                [for]="'task-' + task.id"
                class="task-label"
                [class.completed-text]="task.completed"
              >
                {{ task.text }}
              </label>
              <button
                (click)="startEditing(task)"
                class="action-button edit-button"
                title="Edit task"
              >
                <svg
                  class="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button
                (click)="removeTask(task.id)"
                class="action-button delete-button"
                title="Remove task"
              >
                <svg
                  class="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </ng-template>
          </div>
        </div>

        <!-- Task Summary -->
        <div *ngIf="tasks.length > 0" class="task-summary">
          {{ getCompletedTasksCount() }} of {{ tasks.length }} tasks completed
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  tasks: Task[] = [];
  newTask: string = '';
  editingTaskId: number | null = null;
  editingText: string = '';

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
      const editInput = document.querySelector(
        '.edit-input'
      ) as HTMLInputElement;
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
