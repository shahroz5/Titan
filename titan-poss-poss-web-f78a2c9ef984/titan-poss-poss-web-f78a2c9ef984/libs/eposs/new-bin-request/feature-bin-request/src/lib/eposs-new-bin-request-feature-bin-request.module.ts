import { EpossNewBinRequestUiBinRequestBinListModule } from '@poss-web/eposs/new-bin-request/ui-bin-request-bin-list';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { NewBinRequestComponent } from './new-bin-request.component';
import { EpossNewBinRequestDataAccessBinRequestModule } from '@poss-web/eposs/new-bin-request/data-access-bin-request';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';


@NgModule({
  declarations: [NewBinRequestComponent],
  imports: [
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    // RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,

    //loading the app specific shared components
    EpossNewBinRequestUiBinRequestBinListModule,
    EpossNewBinRequestDataAccessBinRequestModule,
    SharedPermissionUiPermissionModule
  ],
  exports: [NewBinRequestComponent]
})
export class EpossNewBinRequestFeatureBinRequestModule {}
