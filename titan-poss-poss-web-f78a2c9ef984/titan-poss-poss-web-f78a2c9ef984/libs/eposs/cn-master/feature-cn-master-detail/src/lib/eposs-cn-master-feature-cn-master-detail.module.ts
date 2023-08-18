import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnMasterDetailComponent } from './cn-master-detail/cn-master-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossCnMasterUiCnMasterDetailModule } from '@poss-web/eposs/cn-master/ui-cn-master-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossCnMasterDataAccessCnMasterModule } from '@poss-web/eposs/cn-master/data-access-cn-master';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: CnMasterDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossCnMasterUiCnMasterDetailModule,
    RouterModule.forChild(routes),
    EpossCnMasterDataAccessCnMasterModule
  ],
  declarations: [CnMasterDetailComponent]
})
export class EpossCnMasterFeatureCnMasterDetailModule {}
