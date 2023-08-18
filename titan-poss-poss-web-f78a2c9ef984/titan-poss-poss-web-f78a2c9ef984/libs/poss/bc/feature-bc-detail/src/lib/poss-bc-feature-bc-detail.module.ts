import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcDetailComponent } from './bc-detail/bc-detail.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PossBcDataAccessBcModule } from '@poss-web/poss/bc/data-access-bc';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { PossBcUiBcDetailModule } from '@poss-web/poss/bc/ui-bc-detail';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedPaymentUiPaymentModule } from '@poss-web/shared/payment/ui-payment';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiProductViewModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    PossBcDataAccessBcModule,
    SharedCommonDataAccessCommonModule,
    PossBcUiBcDetailModule,
    SharedComponentsUiFormFieldControlsModule,
    PossSharedProductDataAccessProductModule,
    PossFocDataAccessFocModule,
    SharedPaymentDataAccessPaymentModule,
    SharedPaymentUiPaymentModule
  ],
  declarations: [BcDetailComponent],
  exports: [BcDetailComponent]
})
export class PossBcFeatureBcDetailModule {}
