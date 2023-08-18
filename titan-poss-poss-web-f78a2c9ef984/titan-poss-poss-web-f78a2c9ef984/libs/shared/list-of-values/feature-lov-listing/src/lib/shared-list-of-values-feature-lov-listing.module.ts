import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LovmasterListingContainerComponent } from './lovmaster-listing-container.component';
import { SharedListOfValuesUiLovListModule } from '@poss-web/shared/list-of-values/ui-lov-list';
import { SharedListOfValuesUiLovmasterViewModule } from '@poss-web/shared/list-of-values/ui-lovmaster-view';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { SharedListOfValuesDataAccessLovModule } from '@poss-web/shared/list-of-values/data-access-lov';

import {
  SharedListOfValuesUiLovDetailModule,
  LovmasterDetailsComponent
} from '@poss-web/shared/list-of-values/ui-lov-detail';
const routes: Routes = [
  {
    path: '',
    component: LovmasterListingContainerComponent
  }
];
@NgModule({
  declarations: [LovmasterListingContainerComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedListOfValuesDataAccessLovModule,
    SharedListOfValuesUiLovDetailModule,
    SharedListOfValuesUiLovListModule,
    SharedListOfValuesUiLovmasterViewModule
  ],
  providers: [LovmasterDetailsComponent]
})
export class SharedListOfValuesFeatureLovListingModule {}
