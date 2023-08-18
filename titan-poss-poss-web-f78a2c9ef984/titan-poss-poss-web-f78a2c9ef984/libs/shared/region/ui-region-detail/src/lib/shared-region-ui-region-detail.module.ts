import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionDetailsComponent } from './region-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

@NgModule({
  declarations: [RegionDetailsComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule
  ]
})
export class SharedRegionUiRegionDetailModule {}
