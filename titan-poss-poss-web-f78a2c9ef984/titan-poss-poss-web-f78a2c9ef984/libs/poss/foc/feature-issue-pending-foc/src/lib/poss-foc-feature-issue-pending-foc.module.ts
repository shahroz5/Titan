import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingFOCComponent } from './pending-foc/pending-foc.component';
import { PossFocUiPendingFocProductGridModule } from '@poss-web/poss/foc/ui-pending-foc-product-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { PossCashMemoUiAddFocPopupModule } from '@poss-web/poss/cash-memo/ui-add-foc-popup';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossFocUiFocPopupsModule } from '@poss-web/poss/foc/ui-foc-popups';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossSharedProductUiProductModule } from '@poss-web/poss/shared/product/ui-product';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossFocUiPendingFocProductGridModule,
    PossFocDataAccessFocModule,
    PossCashMemoUiAddFocPopupModule,
    PossSharedProductDataAccessProductModule,
    SharedComponentsUiLoaderModule,
    PossFocUiFocPopupsModule,
    PossSharedProductUiProductModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedComponentsUiProductViewModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [PendingFOCComponent],
  exports: [PendingFOCComponent]
})
export class PossFocFeatureIssuePendingFocModule {}
