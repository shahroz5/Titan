import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RedidualWeightItemsListComponent } from './redidual-weight-items-list/redidual-weight-items-list.component';
import { RedidualWeightItemComponent } from './redidual-weight-item/redidual-weight-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [RedidualWeightItemsListComponent, RedidualWeightItemComponent],
  exports: [RedidualWeightItemsListComponent, RedidualWeightItemComponent]
})
export class EpossResidualWeightConfigUiResidualWeightConfigListingModule {}
