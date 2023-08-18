import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillHistoryComponent } from './bill-history/bill-history.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BillHistoryComponent],
  exports: [BillHistoryComponent]
})
export class EpossGrfManualRequestUiBillHistoryModule {}
