import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketCodeViewComponent } from './market-code-view/market-code-view/market-code-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [MarketCodeViewComponent],
  exports: [MarketCodeViewComponent]
})
export class SharedMarketCodeUiMarketCodeViewModule {}
