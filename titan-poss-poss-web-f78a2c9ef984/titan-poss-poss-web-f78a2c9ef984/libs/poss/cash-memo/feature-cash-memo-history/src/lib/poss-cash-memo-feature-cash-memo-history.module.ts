import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashMemoHistoryComponent } from './cash-memo-history.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { PossCashMemoUiCashMemoHistoryModule } from '@poss-web/poss/cash-memo/ui-cash-memo-history';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    PossCashMemoUiCashMemoHistoryModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormFieldControlsModule,
    RouterModule.forChild([{ path: '', component: CashMemoHistoryComponent }])
  ],
  declarations: [CashMemoHistoryComponent],
  exports: [CashMemoHistoryComponent]
})
export class PossCashMemoFeatureCashMemoHistoryModule {}
