import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcHeaderDetailsComponent } from './bc-header-details/bc-header-details.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiFormattersModule,
    CommonCustomMaterialModule
  ],
  declarations: [BcHeaderDetailsComponent],
  exports: [BcHeaderDetailsComponent]
})
export class PossBcUiBcDetailModule {}
