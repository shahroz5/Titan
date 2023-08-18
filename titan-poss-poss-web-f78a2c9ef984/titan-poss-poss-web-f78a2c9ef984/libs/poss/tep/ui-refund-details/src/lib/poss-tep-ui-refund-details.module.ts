import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TepRefundDetailsComponent } from './tep-refund-details/tep-refund-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [TepRefundDetailsComponent],
  exports: [TepRefundDetailsComponent]
})
export class PossTepUiRefundDetailsModule {}
