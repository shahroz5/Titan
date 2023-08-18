import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReceiveHistoryComponent } from './stock-receive-history/stock-receive-history.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { EpossInventoryHomeDataAccessInventoryHomeModule } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossStockReceiveDataAccessStockReceiveModule } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import {
  EpossStockReceiveUiStockReceivePopupModule,
} from '@poss-web/eposs/stock-receive/ui-stock-receive-popup';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';

@NgModule({
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild([
      { path: '', component: StockReceiveHistoryComponent }
    ]),
    //loading the Shared Components
    SharedComponentsUiCardListModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    EpossStockReceiveDataAccessStockReceiveModule,
    EpossInventoryHomeDataAccessInventoryHomeModule,
    EpossStockReceiveUiStockReceivePopupModule,
    SharedPermissionUiPermissionModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [StockReceiveHistoryComponent]
})
export class EpossStockReceiveFeatureStockReceiveHistoryModule {}
