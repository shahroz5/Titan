import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchCoItemsComponent } from './fetch-co-items/fetch-co-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CoProductGridComponent } from './co-product-grid/co-product-grid.component';
import { CoDetailsComponent } from './co-details/co-details.component';
import { SearchCoItemsComponent } from './search-co-items/search-co-items.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { AddNomineePopupComponent } from './add-nominee-popup/add-nominee-popup.component';
import { CoDetailsPopupComponent } from './co-details-popup/co-details-popup.component';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [
    FetchCoItemsComponent,
    CoProductGridComponent,
    CoDetailsComponent,
    SearchCoItemsComponent,
    AddNomineePopupComponent,
    CoDetailsPopupComponent
  ],
  exports: [
    FetchCoItemsComponent,
    CoProductGridComponent,
    CoDetailsComponent,
    SearchCoItemsComponent
  ]
})
export class PossCustomerOrderUiCoModule {}
