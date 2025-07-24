import { Injectable } from '@angular/core';
import { Task } from '../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'todo-app-tasks';

  /**
   * Save tasks to localStorage
   */
  saveTasks(tasks: Task[]): void {
    try {
      const tasksJson = JSON.stringify(tasks);
      localStorage.setItem(this.STORAGE_KEY, tasksJson);
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  /**
   * Load tasks from localStorage
   */
  loadTasks(): Task[] {
    try {
      const tasksJson = localStorage.getItem(this.STORAGE_KEY);
      if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        // Validate the loaded data structure
        if (Array.isArray(tasks) && this.validateTasksStructure(tasks)) {
          return tasks;
        }
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
    }
    return [];
  }

  /**
   * Clear all tasks from localStorage
   */
  clearTasks(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tasks from localStorage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; available: boolean } {
    if (!this.isLocalStorageAvailable()) {
      return { used: 0, available: false };
    }

    try {
      const tasksJson = localStorage.getItem(this.STORAGE_KEY);
      const used = tasksJson ? new Blob([tasksJson]).size : 0;
      return { used, available: true };
    } catch {
      return { used: 0, available: false };
    }
  }

  /**
   * Validate that loaded data has correct Task structure
   */
  private validateTasksStructure(tasks: Task[]): boolean {
    return tasks.every(
      (task) =>
        typeof task === 'object' &&
        typeof task.id === 'number' &&
        typeof task.text === 'string' &&
        typeof task.completed === 'boolean',
    );
  }
}
