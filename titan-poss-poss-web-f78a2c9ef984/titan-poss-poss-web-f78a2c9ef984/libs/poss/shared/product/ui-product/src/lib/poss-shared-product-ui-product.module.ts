import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from './product-grid/product-grid.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { ProductOutOfStockPopupComponent } from './product-out-of-stock-popup/product-out-of-stock-popup.component';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { LotNumberSelectionPopupComponent } from './lot-number-selection-popup/lot-number-selection-popup.component';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { ProductRsoPopupComponent } from './product-rso-popup/product-rso-popup.component';
import { LotAndQuantityChangePopupComponent } from './lot-and-quantity-change-popup/lot-and-quantity-change-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiSelectionDialogModule,
    PossSharedViewTcsUiViewTcsModule
  ],
  declarations: [
    ProductGridComponent,
    ProductOutOfStockPopupComponent,
    LotNumberSelectionPopupComponent,
    ProductRsoPopupComponent,
    LotAndQuantityChangePopupComponent
  ],
  exports: [
    ProductGridComponent,
    ProductOutOfStockPopupComponent,
    LotNumberSelectionPopupComponent,
    ProductRsoPopupComponent,
    LotAndQuantityChangePopupComponent
  ],
  entryComponents: [
    ProductOutOfStockPopupComponent,
    LotNumberSelectionPopupComponent,
    LotAndQuantityChangePopupComponent
  ]
})
export class PossSharedProductUiProductModule {}
