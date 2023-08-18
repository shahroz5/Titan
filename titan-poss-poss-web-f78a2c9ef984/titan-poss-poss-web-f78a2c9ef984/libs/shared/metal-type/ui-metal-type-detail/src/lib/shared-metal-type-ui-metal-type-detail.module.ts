import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetalTypeDetailsComponent } from './metal-type-details/metal-type-details.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule,SharedComponentsUiDynamicFormModule,CommonCustomMaterialModule],
  declarations:[MetalTypeDetailsComponent]
})
export class SharedMetalTypeUiMetalTypeDetailModule {}
