import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { CardService } from './card.service';
import { Card } from './card.model';

@Component({
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-cards',
  styleUrl: './cards.css',
  templateUrl: './cards.html',
})
export class Cards implements OnInit {
  private  cardService = inject(CardService);
  private  fb = inject(FormBuilder);



  // Reactive state management
  cards = signal<Card[]>([]);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  editingCardId = signal<number | string | null>(null);
  isProcessing = signal<boolean>(false);

  // Form setup with basic validations
  cardForm = this.fb.nonNullable.group({
    front: ['', [Validators.required]],
    back: ['', [Validators.required]],
  });

  editForm = this.fb.nonNullable.group({
    front: ['', [Validators.required]],
    back: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadInitialCards();
  }

  private loadInitialCards(): void {
    this.cardService.getCards().subscribe({
      next: (data) => this.cards.set(data),
      error: (err) => this.errorMessage.set('Failed to load cards.'),
    });
  }

  onSubmit(): void {
    if (this.cardForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = this.cardForm.getRawValue();

    this.cardService.createCard(payload).subscribe({
      next: (createdCard) => {
        // Append the new entry to the state signal immutably
        this.cards.update((currentCards) => [...currentCards, createdCard]);

        // Reset form and UI state
        this.cardForm.reset();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to create card. Please try again.');
        this.isSubmitting.set(false);
      },
    });
  }

  startEdit(card: Card): void {
    this.editingCardId.set(card._id || card.id);
    this.editForm.setValue({
      front: card.front,
      back: card.back,
    });
  }

  cancelEdit(): void {
    this.editingCardId.set(null);
    this.editForm.reset();
  }

  saveEdit(card: Card): void {
    const cardId = card._id || card.id;
    if (this.editForm.invalid || !cardId) return;

    this.isProcessing.set(true);
    this.errorMessage.set(null);

    const payload = this.editForm.getRawValue();

    this.cardService.updateCard(cardId, payload).subscribe({
      next: (updatedCard) => {
        // Replace updated item immutably in state
        this.cards.update((list) =>
          list.map((item) => ((item._id ?? item.id) === cardId ? updatedCard : item))
        );
        this.cancelEdit();
        this.isProcessing.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to update card.');
        this.isProcessing.set(false);
      },
    });
  }

  onDelete(card: Card): void {
    console.log('Attempting delete for card:', card);

    const cardId = card._id || card.id;
    if (!cardId) {
    console.error('Delete aborted: No valid ID provided.', cardId);
    return;
  }
    if (!confirm('Are you sure you want to delete this card?')) return;

    this.isProcessing.set(true);
    this.errorMessage.set(null);

    this.cardService.deleteCard(cardId).subscribe({
      next: () => {
        // Filter out deleted item from state
        this.cards.update((list) => list.filter((item) => (item._id || item.id) !== cardId));
        this.isProcessing.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to delete card.');
        this.isProcessing.set(false);
      },
    });
  }
}