import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossStockIssueTepGepUiStockIssueTepGepItemListModule } from '@poss-web/eposs/stock-issue-tep-gep/ui-stock-issue-tep-gep-item-list';
import { EpossStockIssueTepGepDataAccessStockIssueTepGepModule } from '@poss-web/eposs/stock-issue-tep-gep/data-access-stock-issue-tep-gep';
import { StockIssueTEPComponent } from './stock-issue-tep-gep.component';
import {
  CourierDetailsPopupComponent,
  EpossSharedUiCourierDetailsPopupModule,
} from '@poss-web/eposs/shared/ui-courier-details-popup';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

const routes: Routes = [
  {
    path: '',
    component: StockIssueTEPComponent,
  },
];

@NgModule({
  declarations: [StockIssueTEPComponent],
  imports: [
    //loading Angular Material and ngx-translate modules
    CommonModule,
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,

    //loading the app specific shared components
    EpossStockIssueTepGepUiStockIssueTepGepItemListModule,
    EpossStockIssueTepGepDataAccessStockIssueTepGepModule,
    EpossSharedUiCourierDetailsPopupModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormattersModule,
  ],
  entryComponents: [CourierDetailsPopupComponent],
})
export class EpossStockIssueTepGepFeatureStockIssueTepGepDetailsModule {}
