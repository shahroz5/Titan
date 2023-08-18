import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketCodeDetailsComponent } from './market-code-details/market-code-details.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  declarations: [MarketCodeDetailsComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  exports: [MarketCodeDetailsComponent]
})
export class SharedMarketCodeUiMarketCodeDetailModule {}
