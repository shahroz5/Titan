import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestHistoryComponent } from './request-history/request-history.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RequestHistoryComponent],
  exports: [RequestHistoryComponent]
})
export class SharedManualCmRequestUiRequestHistoryModule {}
