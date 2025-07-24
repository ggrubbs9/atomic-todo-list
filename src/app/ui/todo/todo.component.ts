import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService, Task } from '../../services/local-storage/local-storage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  tasks: Task[] = [];
  newTask = '';
  editingTaskId: number | null = null;
  editingText = '';
  storageAvailable = true;
  storageUsed = 0;

  private saveTimeout: number | undefined;
  private localStorageService = inject(LocalStorageService);

  OnInit(): void {
    this.storageAvailable = this.localStorageService.isLocalStorageAvailable();
    this.loadTasks();
    this.updateStorageInfo();
  }

  OnDestroy(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
  }

  /**
   * Load tasks from localStorage on component initialization
   */
  private loadTasks(): void {
    if (this.storageAvailable) {
      this.tasks = this.localStorageService.loadTasks();
    }
  }

  /**
   * Save tasks to localStorage with debouncing
   */
  private saveTasks(): void {
    if (!this.storageAvailable) {
      return;
    }

    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Debounce saves to avoid excessive localStorage writes
    this.saveTimeout = setTimeout(() => {
      this.localStorageService.saveTasks(this.tasks);
      this.updateStorageInfo();
    }, 300);
  }

  /**
   * Update storage usage information
   */
  private updateStorageInfo(): void {
    if (this.storageAvailable) {
      const info = this.localStorageService.getStorageInfo();
      this.storageUsed = info.used;
    }
  }

  addTask(): void {
    if (this.newTask.trim() !== '') {
      const task: Task = {
        id: Date.now(),
        text: this.newTask.trim(),
        completed: false,
      };
      this.tasks.push(task);
      this.newTask = '';
      this.saveTasks();
    }
  }

  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
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
        this.saveTasks();
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

  /**
   * Clear all tasks with confirmation
   */
  clearAllTasks(): void {
    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      this.tasks = [];
      this.localStorageService.clearTasks();
      this.updateStorageInfo();
    }
  }

  /**
   * Export tasks as JSON file
   */
  exportTasks(): void {
    const dataStr = JSON.stringify(this.tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
