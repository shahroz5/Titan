import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerViewComponent } from './customer-view/customer-view.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CustomerViewComponent],
  exports: [CustomerViewComponent]
})
export class SharedManualCmRequestUiCustomerViewModule {}
