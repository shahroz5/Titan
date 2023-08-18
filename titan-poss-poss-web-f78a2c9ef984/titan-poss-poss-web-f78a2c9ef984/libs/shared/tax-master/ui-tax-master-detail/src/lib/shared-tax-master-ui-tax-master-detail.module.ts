import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxMasterDetailsComponent } from './tax-master-details/tax-master-details.component';
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
  exports: [TaxMasterDetailsComponent],
  declarations: [TaxMasterDetailsComponent],
  entryComponents: [TaxMasterDetailsComponent]
})
export class SharedTaxMasterUiTaxMasterDetailModule { }
