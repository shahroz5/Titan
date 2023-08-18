import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

import { WeightToleranceViewComponent } from './weight-tolerance-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [WeightToleranceViewComponent],
  exports: [WeightToleranceViewComponent]
})
export class EpossWeightToleranceUiWeightToleranceViewModule {}
