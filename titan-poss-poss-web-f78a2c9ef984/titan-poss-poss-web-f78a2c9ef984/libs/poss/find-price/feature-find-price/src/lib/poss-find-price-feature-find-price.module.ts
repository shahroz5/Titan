import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { FindPriceComponent } from './find-price/find-price.component';
import { RouterModule } from '@angular/router';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossFindPriceDataAccessFindPriceModule } from '@poss-web/poss/find-price/data-access-find-price';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiSelectionDialogModule,
    SharedCommonDataAccessCommonModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    SharedComponentsUiFormattersModule,
    PossSharedProductDataAccessProductModule,
    PossFindPriceDataAccessFindPriceModule,
    RouterModule.forChild([{ path: '', component: FindPriceComponent, pathMatch: 'full' }]),
  ],
  exports: [FindPriceComponent],
  declarations: [FindPriceComponent]
})
export class PossFindPriceFeatureFindPriceModule {}