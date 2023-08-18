import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxClassDetailsComponent } from './tax-class-details.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [TaxClassDetailsComponent],
  exports: [TaxClassDetailsComponent],
  entryComponents: [TaxClassDetailsComponent]
})
export class SharedTaxClassUiTaxClassDetailModule {}
