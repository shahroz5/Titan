import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ConversionApprovalsFiltersComponent } from './conversion-approvals-filters/conversion-approvals-filters.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ConversionApprovalsFiltersComponent],
  exports: [ConversionApprovalsFiltersComponent]
})
export class EpossConversionApprovalsUiConversionApprovalsFiltersModule {}
