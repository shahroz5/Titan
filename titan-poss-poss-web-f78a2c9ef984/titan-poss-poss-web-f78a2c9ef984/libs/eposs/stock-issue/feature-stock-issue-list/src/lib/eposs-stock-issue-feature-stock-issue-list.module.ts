import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossStockReturnDataAccessStockReturnModule } from '@poss-web/eposs/stock-return/data-access-stock-return';
import { StockIssueListComponent } from './stock-issue-list.component';
import { EpossStockIssueDataAccessStockIssueModule } from '@poss-web/eposs/stock-issue/data-access-stock-issue';

import { EpossInventoryHomeDataAccessInventoryHomeModule } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
// TODo change to advanced Search module
import { EpossSharedUiOutOfStockPopupModule } from '@poss-web/eposs/shared/ui-out-of-stock-popup';
import { CommonModule } from '@angular/common';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';

@NgModule({
  declarations: [StockIssueListComponent],

  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossInventoryHomeDataAccessInventoryHomeModule,
    EpossStockReturnDataAccessStockReturnModule,
    EpossStockIssueDataAccessStockIssueModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedPermissionUiPermissionModule,
    // TODo change to advanced Search module
    EpossSharedUiOutOfStockPopupModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  exports: [StockIssueListComponent]
})
export class EpossStockIssueFeatureStockIssueListModule {}
