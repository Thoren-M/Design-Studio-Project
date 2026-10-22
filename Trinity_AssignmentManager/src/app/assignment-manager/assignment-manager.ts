import { Component } from '@angular/core';
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

  submittedAssignment: {
    title: string;
    course: string;
    description: string;
    dueDate: string;
    status: string;
  } | null = null;

  onSubmit() {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    this.submittedAssignment = this.assignmentForm.getRawValue();
  }

  resetForm() {
    this.assignmentForm.reset({ status: 'Not Started' });
    this.submittedAssignment = null;
  }
}
