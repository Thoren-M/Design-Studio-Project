import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Material,
  MaterialService
} from '../services/material';

@Component({
  selector: 'app-content-library',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './content-library.html',
  styleUrl: './content-library.css'
})
export class ContentLibrary implements OnInit {
  private materialService = inject(MaterialService);

  materials = signal<Material[]>([]);
  loading = signal(false);
  saving = signal(false);
  deletingId = signal<string | null>(null);
  editingId = signal<string | null>(null);
  successMessage = signal('');
  errorMessage = signal('');

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

  // Kept for compatibility with the existing template.
  submittedMaterial: {
    title: string;
    course: string;
    content: string;
  } | null = null;

  ngOnInit() {
    this.loadMaterials();
  }

  loadMaterials() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.materialService.getMaterials().subscribe({
      next: materials => {
        this.materials.set(materials);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Unable to load materials. Check that the backend is running.'
        );
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.saving() || this.deletingId()) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');

    const data = this.contentLibraryForm.getRawValue();

    // Reject fields containing only spaces.
    const values = {
      title: data.title.trim(),
      course: data.course.trim(),
      content: data.content.trim()
    };

    this.contentLibraryForm.setValue(values);

    if (this.contentLibraryForm.invalid) {
      this.contentLibraryForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const id = this.editingId();
    const request = id
      ? this.materialService.updateMaterial(id, values)
      : this.materialService.createMaterial(values);

    request.subscribe({
      next: savedMaterial => {
        this.materials.update(materials =>
          id
            ? materials.map(material =>
                material._id === id ? savedMaterial : material
              )
            : [savedMaterial, ...materials]
        );

        this.contentLibraryForm.reset();
        this.editingId.set(null);
        this.submittedMaterial = savedMaterial;
        this.saving.set(false);

        this.successMessage.set(
          id
            ? 'Material updated successfully.'
            : 'Material created successfully.'
        );
      },
      error: () => {
        this.errorMessage.set(
          'Unable to save the material. Please try again.'
        );
        this.saving.set(false);
      }
    });
  }

  editMaterial(material: Material) {
    if (this.saving() || this.deletingId()) {
      return;
    }

    this.editingId.set(material._id);
    this.contentLibraryForm.reset({
      title: material.title,
      course: material.course,
      content: material.content
    });

    this.submittedMaterial = null;
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  deleteMaterial(material: Material) {
    if (this.saving() || this.deletingId()) {
      return;
    }

    if (!window.confirm(`Delete "${material.title}"?`)) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');
    this.deletingId.set(material._id);

    this.materialService.deleteMaterial(material._id).subscribe({
      next: () => {
        this.materials.update(materials =>
          materials.filter(item => item._id !== material._id)
        );

        if (this.editingId() === material._id) {
          this.contentLibraryForm.reset();
          this.editingId.set(null);
        }

        this.submittedMaterial = null;
        this.deletingId.set(null);
        this.successMessage.set('Material deleted successfully.');
      },
      error: () => {
        this.errorMessage.set(
          'Unable to delete the material. Please try again.'
        );
        this.deletingId.set(null);
      }
    });
  }

  resetForm() {
    if (this.saving() || this.deletingId()) {
      return;
    }

    this.contentLibraryForm.reset();
    this.editingId.set(null);
    this.submittedMaterial = null;
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}