import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty tasks array', () => {
      expect(component.tasks).toEqual([]);
    });

    it('should initialize with empty newTask string', () => {
      expect(component.newTask).toBe('');
    });

    it('should initialize with null editingTaskId', () => {
      expect(component.editingTaskId).toBeNull();
    });

    it('should initialize with empty editingText string', () => {
      expect(component.editingText).toBe('');
    });
  });

  describe('Template Rendering', () => {
    it('should render the title', () => {
      const titleElement = fixture.debugElement.query(By.css('.title'));
      expect(titleElement.nativeElement.textContent).toBe('Todo List');
    });

    it('should render the input field with correct placeholder', () => {
      const inputElement = fixture.debugElement.query(By.css('.task-input'));
      expect(inputElement.nativeElement.placeholder).toBe('Add a new task...');
    });

    it('should render the add button', () => {
      const addButton = fixture.debugElement.query(By.css('.add-button'));
      expect(addButton).toBeTruthy();
    });

    it('should show empty state when no tasks exist', () => {
      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState.nativeElement.textContent.trim()).toBe(
        'No tasks yet. Add one above!'
      );
    });

    it('should not show task summary when no tasks exist', () => {
      const taskSummary = fixture.debugElement.query(By.css('.task-summary'));
      expect(taskSummary).toBeNull();
    });
  });

  describe('Adding Tasks', () => {
    it('should add a task when addTask() is called with valid input', () => {
      component.newTask = 'Test task';
      component.addTask();

      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0].text).toBe('Test task');
      expect(component.tasks[0].completed).toBe(false);
      expect(component.newTask).toBe('');
    });

    it('should not add a task when input is empty', () => {
      component.newTask = '';
      component.addTask();

      expect(component.tasks.length).toBe(0);
    });

    it('should not add a task when input contains only whitespace', () => {
      component.newTask = '   ';
      component.addTask();

      expect(component.tasks.length).toBe(0);
    });

    it('should trim whitespace from task text', () => {
      component.newTask = '  Test task  ';
      component.addTask();

      expect(component.tasks[0].text).toBe('Test task');
    });

    it('should generate unique IDs for tasks', fakeAsync(() => {
      component.newTask = 'Task 1';
      component.addTask();

      tick(1000); // if tasks added at some time Date.now() creates identical id and this will error 

      component.newTask = 'Task 2';
      component.addTask();

      expect(component.tasks[0].id).not.toBe(component.tasks[1].id);
    }));

    it('should add task when Enter key is pressed in input field', () => {
      const inputElement = fixture.debugElement.query(By.css('.task-input'));
      component.newTask = 'Test task';
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      inputElement.nativeElement.dispatchEvent(enterEvent);

      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0].text).toBe('Test task');
    });

    it('should add task when add button is clicked', () => {
      const addButton = fixture.debugElement.query(By.css('.add-button'));
      component.newTask = 'Test task';
      fixture.detectChanges();

      addButton.nativeElement.click();

      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0].text).toBe('Test task');
    });
  });

  describe('Task Display', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
      ];
      fixture.detectChanges();
    });

    it('should render all tasks', () => {
      const taskElements = fixture.debugElement.queryAll(By.css('.task-item'));
      expect(taskElements.length).toBe(2);
    });

    it('should display task text correctly', () => {
      const taskLabels = fixture.debugElement.queryAll(By.css('.task-label'));
      expect(taskLabels[0].nativeElement.textContent.trim()).toBe('Task 1');
      expect(taskLabels[1].nativeElement.textContent.trim()).toBe('Task 2');
    });

    it('should show completed tasks with completed styling', () => {
      const taskItems = fixture.debugElement.queryAll(By.css('.task-item'));
      expect(taskItems[0].nativeElement.classList.contains('completed')).toBe(
        false
      );
      expect(taskItems[1].nativeElement.classList.contains('completed')).toBe(
        true
      );
    });

    it('should render checkboxes with correct checked state', () => {
      const checkboxes = fixture.debugElement.queryAll(
        By.css('.task-checkbox')
      );
      expect(checkboxes[0].nativeElement.checked).toBe(false);
      expect(checkboxes[1].nativeElement.checked).toBe(true);
    });

    it('should hide empty state when tasks exist', () => {
      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeNull();
    });

    it('should show task summary when tasks exist', () => {
      const taskSummary = fixture.debugElement.query(By.css('.task-summary'));
      expect(taskSummary.nativeElement.textContent.trim()).toBe(
        '1 of 2 tasks completed'
      );
    });
  });

  describe('Task Completion', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
      ];
      fixture.detectChanges();
    });

    it('should toggle task completion when toggleTaskCompletion() is called', () => {
      component.toggleTaskCompletion(1);
      expect(component.tasks[0].completed).toBe(true);

      component.toggleTaskCompletion(1);
      expect(component.tasks[0].completed).toBe(false);
    });

    it('should not affect other tasks when toggling completion', () => {
      const originalTask2State = component.tasks[1].completed;
      component.toggleTaskCompletion(1);
      expect(component.tasks[1].completed).toBe(originalTask2State);
    });

    it('should toggle completion when checkbox is clicked', () => {
      const checkbox = fixture.debugElement.query(By.css('.task-checkbox'));
      checkbox.nativeElement.click();
      fixture.detectChanges();

      expect(component.tasks[0].completed).toBe(true);
    });

    it('should update task summary when completion changes', () => {
      component.toggleTaskCompletion(1);
      fixture.detectChanges();

      const taskSummary = fixture.debugElement.query(By.css('.task-summary'));
      expect(taskSummary.nativeElement.textContent.trim()).toBe(
        '2 of 2 tasks completed'
      );
    });
  });

  describe('Task Deletion', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
        { id: 3, text: 'Task 3', completed: false },
      ];
      fixture.detectChanges();
    });

    it('should remove task when removeTask() is called', () => {
      component.removeTask(2);
      expect(component.tasks.length).toBe(2);
      expect(component.tasks.find((task) => task.id === 2)).toBeUndefined();
    });

    it('should not affect other tasks when removing a task', () => {
      const originalTask1 = { ...component.tasks[0] };
      const originalTask3 = { ...component.tasks[2] };

      component.removeTask(2);

      expect(component.tasks[0]).toEqual(originalTask1);
      expect(component.tasks[1]).toEqual(originalTask3);
    });

    it('should remove task when delete button is clicked', () => {
      const deleteButtons = fixture.debugElement.queryAll(
        By.css('.delete-button')
      );
      deleteButtons[0].nativeElement.click();

      expect(component.tasks.length).toBe(2);
      expect(component.tasks.find((task) => task.id === 1)).toBeUndefined();
    });

    it('should update task summary after deletion', () => {
      component.removeTask(2); // Remove completed task
      fixture.detectChanges();

      const taskSummary = fixture.debugElement.query(By.css('.task-summary'));
      expect(taskSummary.nativeElement.textContent.trim()).toBe(
        '0 of 2 tasks completed'
      );
    });
  });

  describe('Task Editing', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
      ];
      fixture.detectChanges();
    });

    it('should enter edit mode when startEditing() is called', () => {
      component.startEditing(component.tasks[0]);

      expect(component.editingTaskId).toBe(1);
      expect(component.editingText).toBe('Task 1');
    });

    it('should enter edit mode when edit button is clicked', () => {
      const editButtons = fixture.debugElement.queryAll(By.css('.edit-button'));
      editButtons[0].nativeElement.click();
      fixture.detectChanges();

      expect(component.editingTaskId).toBe(1);
      expect(component.editingText).toBe('Task 1');
    });

    it('should hide task label when in edit mode', () => {
      component.startEditing(component.tasks[0]);
      fixture.detectChanges();

      const taskLabels = fixture.debugElement.queryAll(By.css('.task-label'));
      expect(taskLabels.length).toBe(1); // Only the non-editing task should have a label
    });

    it('should disable checkbox when in edit mode', () => {
      component.startEditing(component.tasks[0]);
      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(
        By.css('.task-checkbox')
      );
      expect(checkboxes[0].nativeElement.disabled).toBe(true);
    });

    it('should save edit when saveEdit() is called', () => {
      component.startEditing(component.tasks[0]);
      component.editingText = 'Updated Task 1';
      component.saveEdit();

      expect(component.tasks[0].text).toBe('Updated Task 1');
      expect(component.editingTaskId).toBeNull();
      expect(component.editingText).toBe('');
    });

    it('should not save empty text when saveEdit() is called', () => {
      const originalText = component.tasks[0].text;
      component.startEditing(component.tasks[0]);
      component.editingText = '   ';
      component.saveEdit();

      expect(component.tasks[0].text).toBe(originalText);
      expect(component.editingTaskId).toBeNull();
    });

    it('should trim whitespace when saving edit', () => {
      component.startEditing(component.tasks[0]);
      component.editingText = '  Updated Task 1  ';
      component.saveEdit();

      expect(component.tasks[0].text).toBe('Updated Task 1');
    });

    it('should cancel edit when cancelEdit() is called', () => {
      const originalText = component.tasks[0].text;
      component.startEditing(component.tasks[0]);
      component.editingText = 'This should not be saved';
      component.cancelEdit();

      expect(component.tasks[0].text).toBe(originalText);
      expect(component.editingTaskId).toBeNull();
      expect(component.editingText).toBe('');
    });

    it('should save edit when Enter key is pressed', () => {
      component.startEditing(component.tasks[0]);
      component.editingText = 'Updated Task 1';
      fixture.detectChanges();

      const editInput = fixture.debugElement.query(By.css('.edit-input'));
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      editInput.nativeElement.dispatchEvent(enterEvent);

      expect(component.tasks[0].text).toBe('Updated Task 1');
      expect(component.editingTaskId).toBeNull();
    });

    it('should cancel edit when Escape key is pressed', () => {
      const originalText = component.tasks[0].text;
      component.startEditing(component.tasks[0]);
      component.editingText = 'This should not be saved';
      fixture.detectChanges();

      const editInput = fixture.debugElement.query(By.css('.edit-input'));
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      editInput.nativeElement.dispatchEvent(escapeEvent);

      expect(component.tasks[0].text).toBe(originalText);
      expect(component.editingTaskId).toBeNull();
    });

    it('should save edit when save button is clicked', () => {
      component.startEditing(component.tasks[0]);
      component.editingText = 'Updated Task 1';
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('.save-button'));
      saveButton.nativeElement.click();

      expect(component.tasks[0].text).toBe('Updated Task 1');
      expect(component.editingTaskId).toBeNull();
    });

    it('should cancel edit when cancel button is clicked', () => {
      const originalText = component.tasks[0].text;
      component.startEditing(component.tasks[0]);
      component.editingText = 'This should not be saved';
      fixture.detectChanges();

      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
      cancelButton.nativeElement.click();

      expect(component.tasks[0].text).toBe(originalText);
      expect(component.editingTaskId).toBeNull();
    });
  });

  describe('Task Summary', () => {
    it('should return correct completed tasks count', () => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
        { id: 3, text: 'Task 3', completed: true },
        { id: 4, text: 'Task 4', completed: false },
      ];

      expect(component.getCompletedTasksCount()).toBe(2);
    });

    it('should return 0 when no tasks are completed', () => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: false },
      ];

      expect(component.getCompletedTasksCount()).toBe(0);
    });

    it('should return correct count when all tasks are completed', () => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: true },
        { id: 2, text: 'Task 2', completed: true },
      ];

      expect(component.getCompletedTasksCount()).toBe(2);
    });

    it('should return 0 when no tasks exist', () => {
      component.tasks = [];
      expect(component.getCompletedTasksCount()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle toggling completion of non-existent task', () => {
      component.tasks = [{ id: 1, text: 'Task 1', completed: false }];
      const originalTasks = [...component.tasks];

      component.toggleTaskCompletion(999);

      expect(component.tasks).toEqual(originalTasks);
    });

    it('should handle removing non-existent task', () => {
      component.tasks = [{ id: 1, text: 'Task 1', completed: false }];
      const originalTasks = [...component.tasks];

      component.removeTask(999);

      expect(component.tasks).toEqual(originalTasks);
    });

    it('should handle editing non-existent task', () => {
      component.tasks = [{ id: 1, text: 'Task 1', completed: false }];
      component.editingTaskId = 999;
      component.editingText = 'Updated text';
      const originalTasks = [...component.tasks];

      component.saveEdit();

      expect(component.tasks).toEqual(originalTasks);
      expect(component.editingTaskId).toBeNull();
    });

    it('should handle multiple rapid task additions', () => {
      for (let i = 1; i <= 5; i++) {
        component.newTask = `Task ${i}`;
        component.addTask();
      }

      expect(component.tasks.length).toBe(5);
      expect(component.tasks.map((t) => t.text)).toEqual([
        'Task 1',
        'Task 2',
        'Task 3',
        'Task 4',
        'Task 5',
      ]);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.tasks = [{ id: 1, text: 'Task 1', completed: false }];
      fixture.detectChanges();
    });

    it('should have proper labels for checkboxes', () => {
      const checkbox = fixture.debugElement.query(By.css('.task-checkbox'));
      const label = fixture.debugElement.query(By.css('.task-label'));

      expect(checkbox.nativeElement.id).toBe('task-1');
      expect(label.nativeElement.getAttribute('for')).toBe('task-1');
    });

    it('should have proper title attributes for buttons', () => {
      const editButton = fixture.debugElement.query(By.css('.edit-button'));
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));

      expect(editButton.nativeElement.title).toBe('Edit task');
      expect(deleteButton.nativeElement.title).toBe('Remove task');
    });

    it('should have proper title attributes for edit mode buttons', () => {
      component.startEditing(component.tasks[0]);
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('.save-button'));
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));

      expect(saveButton.nativeElement.title).toBe('Save edit');
      expect(cancelButton.nativeElement.title).toBe('Cancel edit');
    });
  });
});
