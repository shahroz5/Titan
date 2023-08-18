import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryViewComponent } from './summary-view/summary-view.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SummaryViewComponent],
  exports: [SummaryViewComponent]
})
export class PossGrfRequestStatusUiSummaryViewModule {}
