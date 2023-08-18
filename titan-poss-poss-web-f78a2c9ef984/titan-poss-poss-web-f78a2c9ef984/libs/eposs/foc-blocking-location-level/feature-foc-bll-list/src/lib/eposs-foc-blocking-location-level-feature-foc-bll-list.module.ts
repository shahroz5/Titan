import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocBllListComponent } from './foc-bll-list/foc-bll-list.component';
import { RouterModule, Routes } from '@angular/router';
import { EpossFocBlockingLocationLevelDataAccessFocBllModule } from '@poss-web/eposs/foc-blocking-location-level/data-access-foc-bll';
import { EpossFocBlockingLocationLevelUiFocBllListModule } from '@poss-web/eposs/foc-blocking-location-level/ui-foc-bll-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

const routes: Routes = [
  {
    path: '',
    component: FocBllListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossFocBlockingLocationLevelDataAccessFocBllModule,
    EpossFocBlockingLocationLevelUiFocBllListModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule
  ],
  declarations: [FocBllListComponent],
  exports: [FocBllListComponent]
})
export class EpossFocBlockingLocationLevelFeatureFocBllListModule {}
