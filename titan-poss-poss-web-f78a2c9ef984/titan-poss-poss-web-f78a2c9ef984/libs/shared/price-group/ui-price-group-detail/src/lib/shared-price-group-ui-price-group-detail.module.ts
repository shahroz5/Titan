import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceGroupDetailComponent } from './price-group-detail/price-group-detail.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [PriceGroupDetailComponent],
  entryComponents: [PriceGroupDetailComponent]
})
export class SharedPriceGroupUiPriceGroupDetailModule {}
