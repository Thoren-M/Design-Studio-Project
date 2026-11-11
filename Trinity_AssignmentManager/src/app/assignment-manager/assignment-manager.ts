import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-assignment-manager',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './assignment-manager.html',
  styleUrl: './assignment-manager.css'
})
export class AssignmentManager {
  private readonly apiUrl = 'http://localhost:3000/api/assignments';

  assignments: Assignment[] = [];
  editingId: string | null = null;
  message = '';

  constructor(private http: HttpClient) {
    this.loadAssignments();
  }

  assignmentForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    course: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    dueDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    status: new FormControl('Not Started', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  onSubmit() {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    const assignment = this.assignmentForm.getRawValue();

    if (this.editingId) {
      this.http.put<Assignment>(`${this.apiUrl}/${this.editingId}`, assignment)
        .subscribe({
          next: () => {
            this.message = 'Assignment updated successfully.';
            this.resetForm();
            this.loadAssignments();
          },
          error: () => this.message = 'Unable to update the assignment.'
        });
      return;
    }

    this.http.post<Assignment>(this.apiUrl, assignment).subscribe({
      next: () => {
        this.message = 'Assignment saved successfully.';
        this.resetForm();
        this.loadAssignments();
      },
      error: () => this.message = 'Unable to save the assignment.'
    });
  }

  loadAssignments() {
    this.http.get<Assignment[]>(this.apiUrl).subscribe({
      next: (assignments) => this.assignments = assignments,
      error: () => this.message = 'Unable to load assignments.'
    });
  }

  editAssignment(assignment: Assignment) {
    this.editingId = assignment._id;
    this.assignmentForm.setValue({
      title: assignment.title,
      course: assignment.course,
      description: assignment.description,
      dueDate: assignment.dueDate.slice(0, 10),
      status: assignment.status
    });
    this.message = 'Editing assignment.';
  }

  deleteAssignment(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.message = 'Assignment deleted successfully.';
        this.loadAssignments();
      },
      error: () => this.message = 'Unable to delete the assignment.'
    });
  }

  resetForm() {
    this.assignmentForm.reset({ status: 'Not Started' });
    this.editingId = null;
  }
}

interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  status: string;
}
