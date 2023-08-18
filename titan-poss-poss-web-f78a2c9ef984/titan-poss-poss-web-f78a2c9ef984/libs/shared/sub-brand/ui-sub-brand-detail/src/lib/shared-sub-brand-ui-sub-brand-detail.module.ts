import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubbrandDetailsComponent } from './subbrand-details/subbrand-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

@NgModule({
  imports: [CommonModule,CommonCustomMaterialModule,SharedComponentsUiDynamicFormModule],
  declarations:[SubbrandDetailsComponent],
  entryComponents:[SubbrandDetailsComponent]

})
export class SharedSubBrandUiSubBrandDetailModule {}
