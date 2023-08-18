import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BinGroupListingComponent } from './bin-group-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedBinGroupDataAccessBinGroupModule } from '@poss-web/shared/bin-group/data-access-bin-group';
import { SharedBinGroupUiBinGroupListModule } from '@poss-web/shared/bin-group/ui-bin-group-list';
import {
  BinGroupDetailsComponent,
  SharedBinGroupUiBinGroupDetailModule
} from '@poss-web/shared/bin-group/ui-bin-group-detail';
import { SharedBinGroupUiBinGroupViewModule } from '@poss-web/shared/bin-group/ui-bin-group-view';
import { CommonModule } from '@angular/common';

const route = [
  { path: '', component: BinGroupListingComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [BinGroupListingComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedBinGroupUiBinGroupListModule,
    SharedBinGroupDataAccessBinGroupModule,
    SharedBinGroupUiBinGroupDetailModule,
    SharedBinGroupUiBinGroupViewModule
  ],
  entryComponents: [BinGroupDetailsComponent]
})
export class SharedBinGroupFeatureBinGroupModule {}
