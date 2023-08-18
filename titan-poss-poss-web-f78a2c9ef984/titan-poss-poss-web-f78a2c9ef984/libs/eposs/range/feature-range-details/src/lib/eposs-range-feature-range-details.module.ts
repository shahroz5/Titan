import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDetailsComponent } from './range-details/range-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { EpossRangeDataAccessRangeModule } from '@poss-web/eposs/range/data-access-range';
import { EpossRangeUiRangeDetailsModule } from '@poss-web/eposs/range/ui-range-details';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
const routes: Routes = [
  {
    path: '',
    component: RangeDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossRangeDataAccessRangeModule,
    EpossRangeUiRangeDetailsModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [RangeDetailsComponent]
})
export class EpossRangeFeatureRangeDetailsModule {}
