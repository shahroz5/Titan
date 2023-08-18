import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AmendmentConfigDetailsComponent } from './amendment-config-details/amendment-config-details.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [AmendmentConfigDetailsComponent],
  exports: [AmendmentConfigDetailsComponent]
})
export class EpossAmendmentConfigUiAmendmentConfigModule {}
