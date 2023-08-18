import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnipayConfigurationComponent } from './unipay-config.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [UnipayConfigurationComponent],
  exports: [UnipayConfigurationComponent]
})
export class EpossUnipayConfigurationUiUnipayConfigurationItemListModule {}
