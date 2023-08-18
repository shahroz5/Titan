import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FocBclListComponent } from './foc-bcl-list/foc-bcl-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossFocBlockingCustomerLevelUiFocBclListModule } from '@poss-web/eposs/foc-blocking-customer-level/ui-foc-bcl-list';
import { EpossFocBlockingCustomerLevelDataAccessFocBclModule } from '@poss-web/eposs/foc-blocking-customer-level/data-access-foc-bcl';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: FocBclListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossFocBlockingCustomerLevelUiFocBclListModule,
    EpossFocBlockingCustomerLevelDataAccessFocBclModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule
  ],
  declarations: [FocBclListComponent]
})
export class EpossFocBlockingCustomerLevelFeatureFocBclListModule {}
