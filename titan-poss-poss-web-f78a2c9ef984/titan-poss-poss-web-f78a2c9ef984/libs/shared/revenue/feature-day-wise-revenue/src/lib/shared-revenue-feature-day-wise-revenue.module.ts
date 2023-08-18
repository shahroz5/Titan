import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayWiseRevenueComponent } from './day-wise-revenue/day-wise-revenue.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedRevenueDataAccessRevenueModule } from '@poss-web/shared/revenue/data-access-revenue';
import { SharedRevenueUiRevenueModule } from '@poss-web/shared/revenue/ui-revenue';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

const routes: Routes = [
  {
    path: '',
    component: DayWiseRevenueComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedRevenueDataAccessRevenueModule,
    SharedRevenueUiRevenueModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [DayWiseRevenueComponent]
})
export class SharedRevenueFeatureDayWiseRevenueModule {}
