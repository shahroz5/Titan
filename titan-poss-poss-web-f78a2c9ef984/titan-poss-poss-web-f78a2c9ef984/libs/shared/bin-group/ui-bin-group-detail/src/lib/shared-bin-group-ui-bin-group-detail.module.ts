import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinGroupDetailsComponent } from './bin-group-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

@NgModule({
  declarations: [BinGroupDetailsComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule
  ]
})
export class SharedBinGroupUiBinGroupDetailModule {}
