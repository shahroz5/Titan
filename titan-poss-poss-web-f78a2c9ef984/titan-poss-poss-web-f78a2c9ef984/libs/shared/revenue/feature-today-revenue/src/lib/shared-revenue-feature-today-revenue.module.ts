import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodayRevenueComponent } from './today-revenue/today-revenue.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedRevenueDataAccessRevenueModule } from '@poss-web/shared/revenue/data-access-revenue';
import { SharedRevenueUiRevenueModule } from '@poss-web/shared/revenue/ui-revenue';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

const routes: Routes = [
  {
    path: '',
    component: TodayRevenueComponent
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
    SharedComponentsUiLoaderModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [TodayRevenueComponent]
})
export class SharedRevenueFeatureTodayRevenueModule {}
