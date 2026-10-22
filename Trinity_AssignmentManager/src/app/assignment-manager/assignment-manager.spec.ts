import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentManager } from './assignment-manager';

describe('AssignmentManager', () => {
  let component: AssignmentManager;
  let fixture: ComponentFixture<AssignmentManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentManager]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require all assignment fields', () => {
    component.assignmentForm.setValue({
      title: '',
      course: '',
      description: '',
      dueDate: '',
      status: 'Not Started'
    });

    expect(component.assignmentForm.invalid).toBe(true);
  });
});
