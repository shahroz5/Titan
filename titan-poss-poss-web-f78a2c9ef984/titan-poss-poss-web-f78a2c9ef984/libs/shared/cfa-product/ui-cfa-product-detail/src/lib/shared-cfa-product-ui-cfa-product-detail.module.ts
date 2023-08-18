import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CFAProductCodeSteponeComponent } from './details/cfa-product-code-stepone.component';

@NgModule({
  declarations: [CFAProductCodeSteponeComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  exports: [CFAProductCodeSteponeComponent]
})
export class SharedCfaProductUiCfaProductDetailModule {}
