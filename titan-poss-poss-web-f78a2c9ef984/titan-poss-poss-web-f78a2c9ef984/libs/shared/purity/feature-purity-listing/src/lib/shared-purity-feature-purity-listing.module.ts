import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { PurityListComponent } from './purity-list/purity-list.component';
import { SharedPurityDataAccessPurityModule } from '@poss-web/shared/purity/data-access-purity';
import { SharedPurityUiPurityListModule } from '@poss-web/shared/purity/ui-purity-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedPurityUiPurityDetailModule } from '@poss-web/shared/purity/ui-purity-detail';
const route: Route[] = [{ path: '', component: PurityListComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPurityDataAccessPurityModule,
    SharedPurityUiPurityListModule,
    RouterModule.forChild(route),
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule,
    SharedPurityUiPurityDetailModule
  ],
  declarations: [PurityListComponent]
})
export class SharedPurityFeaturePurityListingModule {}
