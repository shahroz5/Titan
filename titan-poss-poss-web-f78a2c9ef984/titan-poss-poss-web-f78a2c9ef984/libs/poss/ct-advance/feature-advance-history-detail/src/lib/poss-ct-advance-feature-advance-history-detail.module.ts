import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AdvanceHistoryDetailComponent } from './advance-history-detail/advance-history-detail.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossCtAdvanceDataAccessCtAcceptAdvanceModule } from '@poss-web/poss/ct-advance/data-access-ct-accept-advance';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    PossCtAdvanceDataAccessCtAcceptAdvanceModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [AdvanceHistoryDetailComponent],
  exports: [AdvanceHistoryDetailComponent]
})
export class PossCtAdvanceFeatureAdvanceHistoryDetailModule {}
