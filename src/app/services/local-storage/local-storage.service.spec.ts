import { TestBed } from '@angular/core/testing';
import { LocalStorageService, Task } from '../local-storage//local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const mockTasks: Task[] = [
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('localStorage Availability', () => {
    it('should detect localStorage availability', () => {
      expect(service.isLocalStorageAvailable()).toBe(true);
    });

    it('should handle localStorage unavailability gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jasmine.createSpy().and.throwError('localStorage not available');

      expect(service.isLocalStorageAvailable()).toBe(false);

      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Save Tasks', () => {
    it('should save tasks to localStorage', () => {
      service.saveTasks(mockTasks);

      const savedData = localStorage.getItem('todo-app-tasks');
      expect(savedData).toBeTruthy();

      const parsedTasks = JSON.parse(savedData!);
      expect(parsedTasks).toEqual(mockTasks);
    });

    it('should handle save errors gracefully', () => {
      const originalSetItem = Storage.prototype.setItem;
      const consoleSpy = spyOn(console, 'error');
      Storage.prototype.setItem = jasmine.createSpy().and.throwError('Storage error');

      service.saveTasks(mockTasks);

      expect(consoleSpy).toHaveBeenCalledWith('Error saving tasks to localStorage:', jasmine.any(Error));

      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });

    it('should save empty array', () => {
      service.saveTasks([]);

      const savedData = localStorage.getItem('todo-app-tasks');
      const parsedTasks = JSON.parse(savedData!);
      expect(parsedTasks).toEqual([]);
    });
  });

  describe('Load Tasks', () => {
    it('should load tasks from localStorage', () => {
      localStorage.setItem('todo-app-tasks', JSON.stringify(mockTasks));

      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual(mockTasks);
    });

    it('should return empty array when no data exists', () => {
      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual([]);
    });

    it('should return empty array when data is corrupted', () => {
      localStorage.setItem('todo-app-tasks', 'invalid json');

      const consoleSpy = spyOn(console, 'error');
      const loadedTasks = service.loadTasks();

      expect(loadedTasks).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading tasks from localStorage:', jasmine.any(Error));
    });

    it('should validate task structure and return empty array for invalid data', () => {
      const invalidTasks = [
        { id: 'invalid', text: 'Task 1', completed: false },
        { id: 2, text: 123, completed: true },
      ];
      localStorage.setItem('todo-app-tasks', JSON.stringify(invalidTasks));

      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual([]);
    });

    it('should handle non-array data', () => {
      localStorage.setItem('todo-app-tasks', JSON.stringify({ not: 'an array' }));

      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual([]);
    });

    it('should handle localStorage getItem errors', () => {
      const originalGetItem = Storage.prototype.getItem;
      const consoleSpy = spyOn(console, 'error');
      Storage.prototype.getItem = jasmine.createSpy().and.throwError('Storage error');

      const loadedTasks = service.loadTasks();

      expect(loadedTasks).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading tasks from localStorage:', jasmine.any(Error));

      // Restore original method
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('Clear Tasks', () => {
    it('should clear tasks from localStorage', () => {
      localStorage.setItem('todo-app-tasks', JSON.stringify(mockTasks));

      service.clearTasks();

      const savedData = localStorage.getItem('todo-app-tasks');
      expect(savedData).toBeNull();
    });

    it('should handle clear errors gracefully', () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      const consoleSpy = spyOn(console, 'error');
      Storage.prototype.removeItem = jasmine.createSpy().and.throwError('Storage error');

      service.clearTasks();

      expect(consoleSpy).toHaveBeenCalledWith('Error clearing tasks from localStorage:', jasmine.any(Error));

      // Restore original method
      Storage.prototype.removeItem = originalRemoveItem;
    });
  });

  describe('Storage Info', () => {
    it('should return storage usage info when localStorage is available', () => {
      service.saveTasks(mockTasks);

      const info = service.getStorageInfo();
      expect(info.available).toBe(true);
      expect(info.used).toBeGreaterThan(0);
    });

    it('should return zero usage when no tasks are stored', () => {
      const info = service.getStorageInfo();
      expect(info.available).toBe(true);
      expect(info.used).toBe(0);
    });

    it('should handle localStorage unavailability in storage info', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jasmine.createSpy().and.throwError('localStorage not available');

      const info = service.getStorageInfo();
      expect(info.available).toBe(false);
      expect(info.used).toBe(0);

      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle errors when calculating storage usage', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jasmine.createSpy().and.throwError('Storage error');

      const info = service.getStorageInfo();
      expect(info.available).toBe(false);
      expect(info.used).toBe(0);

      // Restore original method
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('Task Structure Validation', () => {
    it('should validate correct task structure', () => {
      localStorage.setItem('todo-app-tasks', JSON.stringify(mockTasks));

      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual(mockTasks);
    });

    it('should reject tasks with missing properties', () => {
      const invalidTasks = [
        { id: 1, text: 'Task 1' }, // missing completed
        { text: 'Task 2', completed: false }, // missing id
      ];
      localStorage.setItem('todo-app-tasks', JSON.stringify(invalidTasks));

      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual([]);
    });

    it('should reject tasks with wrong property types', () => {
      const invalidTasks = [
        { id: '1', text: 'Task 1', completed: false }, // id should be number
        { id: 2, text: 123, completed: true }, // text should be string
        { id: 3, text: 'Task 3', completed: 'yes' }, // completed should be boolean
      ];
      localStorage.setItem('todo-app-tasks', JSON.stringify(invalidTasks));

      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual([]);
    });

    it('should reject non-object tasks', () => {
      const invalidTasks = ['not an object', 123, null, undefined];
      localStorage.setItem('todo-app-tasks', JSON.stringify(invalidTasks));

      const loadedTasks = service.loadTasks();
      expect(loadedTasks).toEqual([]);
    });
  });
});
