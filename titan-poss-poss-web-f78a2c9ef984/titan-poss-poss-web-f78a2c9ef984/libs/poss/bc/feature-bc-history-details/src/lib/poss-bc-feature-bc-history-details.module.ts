import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryDetailsComponent } from './history-details/history-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PossBcDataAccessBcModule } from '@poss-web/poss/bc/data-access-bc';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { PossBcUiBcHistoryDetailsModule } from '@poss-web/poss/bc/ui-bc-history-details';
import { PossBcUiBcHistoryModule } from '@poss-web/poss/bc/ui-bc-history';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiProductViewModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    PossBcDataAccessBcModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormFieldControlsModule,
    PossSharedProductDataAccessProductModule,
    PossCashMemoDataAccessCashMemoModule,
    PossBcUiBcHistoryDetailsModule,
    PossFocDataAccessFocModule,
    SharedPaymentDataAccessPaymentModule,
    PossBcUiBcHistoryModule
    //RouterModule.forChild([{ path: '', component: HistoryDetailsComponent }])
  ],
  declarations: [HistoryDetailsComponent],
  exports: [HistoryDetailsComponent]
})
export class PossBcFeatureBcHistoryDetailsModule {}
