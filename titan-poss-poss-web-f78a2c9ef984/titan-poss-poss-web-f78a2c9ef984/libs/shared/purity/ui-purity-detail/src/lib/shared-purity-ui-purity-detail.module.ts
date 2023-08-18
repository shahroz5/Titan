import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurityDetailsComponent } from './purity-details/purity-details.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [PurityDetailsComponent],
  entryComponents: [PurityDetailsComponent]
})
export class SharedPurityUiPurityDetailModule {}
