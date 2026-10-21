import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-content-library',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './content-library.html',
  styleUrl: './content-library.css'
})
export class ContentLibrary {
  contentLibraryForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    course: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    content: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  submittedMaterial: {
    title: string;
    course: string;
    content: string;
  } | null = null;

  onSubmit() {
    if (this.contentLibraryForm.invalid) {
      this.contentLibraryForm.markAllAsTouched();
      return;
    }

    this.submittedMaterial = this.contentLibraryForm.getRawValue();
  }

  resetForm() {
    this.contentLibraryForm.reset();
    this.submittedMaterial = null;
  }
}