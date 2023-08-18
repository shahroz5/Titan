import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RivaahTabsComponent } from './rivaah-tabs/rivaah-tabs.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonCustomMaterialModule,
    SharedCommonDataAccessCommonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [RivaahTabsComponent],
  exports: [RivaahTabsComponent]
})
export class EpossRivaahEligibilityConfigFeatureRivaahTabsModule {}
