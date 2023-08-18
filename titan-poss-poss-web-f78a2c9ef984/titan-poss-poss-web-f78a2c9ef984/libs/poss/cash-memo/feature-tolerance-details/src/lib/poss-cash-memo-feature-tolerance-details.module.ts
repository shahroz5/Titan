import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToleranceDetailsComponent } from './tolerance-details/tolerance-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [ToleranceDetailsComponent],
  exports: [ToleranceDetailsComponent]
})
export class PossCashMemoFeatureToleranceDetailsModule {}
