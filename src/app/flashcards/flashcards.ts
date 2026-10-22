import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-flashcards',
  styleUrl: './flashcards.css',
  templateUrl: './flashcards.html',
})
export class Flashcards {
cardFront = ['Mongo'];
cardBack = ['The M in the MEAN stack'];
newcardFront ='';
newcardBack ='';

addCard() {
  if((this.newcardFront.trim() == '') ||(this.newcardBack.trim() == '')){
    alert('Please fill out both fields');
    return;
  }

this.cardFront = [...this.cardFront, this.newcardFront];
this.cardBack= [...this.cardBack, this.newcardBack];

this.newcardFront = '';
this.newcardBack = '';
 
}

displaycardForm = new FormGroup({
  cardIndex: new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
    Validators.max(this.cardFront.length -1)
  ]),
});

selectedCard: string | null=null;
errorMessage: string | null=null;



displayCardfront() {
  if (this.displaycardForm.invalid) {
  this.selectedCard = null;
  this.errorMessage = 'Please enter the number of the card from your current list'
  return;
}

const index = this.displaycardForm.controls.cardIndex.value;

if (index !== null && index >=0 && index < this.cardFront.length) {
  this.selectedCard = this.cardFront[index];
  this.errorMessage = null;
  return;
}
}

displayCardback() {
 if (this.displaycardForm.invalid) {
  this.selectedCard = null;
  this.errorMessage = 'Please enter the number of the card from your current list'
  return;
}

const index = this.displaycardForm.controls.cardIndex.value;

if (index !== null && index >=0 && index < this.cardBack.length) {
  this.selectedCard = this.cardBack[index];
  this.errorMessage = null;
  return;
}
}
}
