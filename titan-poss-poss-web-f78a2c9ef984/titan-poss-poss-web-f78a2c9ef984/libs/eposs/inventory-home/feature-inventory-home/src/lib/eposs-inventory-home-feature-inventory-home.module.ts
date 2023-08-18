import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryHomeComponent } from './inventory-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossInventoryHomeDataAccessInventoryHomeModule } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import { EpossDataUploadDataAccessDataUploadModule } from '@poss-web/eposs/data-upload/data-access-data-upload';

const route: Routes = [{ path: '', component: InventoryHomeComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossInventoryHomeDataAccessInventoryHomeModule,
    EpossDataUploadDataAccessDataUploadModule,
    SharedComponentsUiFocusableListModule,
    SharedPermissionUiPermissionModule,
  ],
  declarations: [InventoryHomeComponent]
})
export class EpossInventoryHomeFeatureInventoryHomeModule {}
