import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditNoteComponent } from './credit-note/credit-note.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CreditNoteComponent],
  exports: [CreditNoteComponent]
})
export class SharedPaymentFeatureCreditNoteModule {}
