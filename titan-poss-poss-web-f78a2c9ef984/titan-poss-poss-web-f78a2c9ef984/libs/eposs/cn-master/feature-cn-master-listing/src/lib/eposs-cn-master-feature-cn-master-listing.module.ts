import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnMasterListComponent } from './cn-master-list/cn-master-list.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossCnMasterDataAccessCnMasterModule } from '@poss-web/eposs/cn-master/data-access-cn-master';
import { EpossCnMasterUiCnMasterListingModule } from '@poss-web/eposs/cn-master/ui-cn-master-listing';

const route: Route[] = [{ path: '', component: CnMasterListComponent }];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossCnMasterDataAccessCnMasterModule,
    EpossCnMasterUiCnMasterListingModule
  ],
  declarations: [CnMasterListComponent]
})
export class EpossCnMasterFeatureCnMasterListingModule {}
