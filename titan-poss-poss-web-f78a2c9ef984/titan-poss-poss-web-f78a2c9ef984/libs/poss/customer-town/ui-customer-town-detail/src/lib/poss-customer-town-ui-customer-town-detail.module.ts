import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTownDetailComponent } from './customer-town-detail/customer-town-detail.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [CustomerTownDetailComponent],
  exports: [CustomerTownDetailComponent]
})
export class PossCustomerTownUiCustomerTownDetailModule {}
