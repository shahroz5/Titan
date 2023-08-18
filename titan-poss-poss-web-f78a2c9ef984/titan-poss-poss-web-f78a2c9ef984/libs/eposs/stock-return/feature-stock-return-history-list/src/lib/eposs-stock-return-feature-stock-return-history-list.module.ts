import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReturnHistoryListComponent } from './stock-return-history-list.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossStockIssueDataAccessStockIssueModule } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { EpossStockReturnUiStockReturnHistoryPopupModule } from '@poss-web/eposs/stock-return/ui-stock-return-history-popup';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { EpossStockReturnDataAccessStockReturnModule } from '@poss-web/eposs/stock-return/data-access-stock-return';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';

const routes: Routes = [
  {
    path: '',
    component: StockReturnHistoryListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossStockIssueDataAccessStockIssueModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    EpossStockReturnDataAccessStockReturnModule,
    EpossStockReturnUiStockReturnHistoryPopupModule,
    SharedPermissionUiPermissionModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [StockReturnHistoryListComponent]
})
export class EpossStockReturnFeatureStockReturnHistoryListModule {}
