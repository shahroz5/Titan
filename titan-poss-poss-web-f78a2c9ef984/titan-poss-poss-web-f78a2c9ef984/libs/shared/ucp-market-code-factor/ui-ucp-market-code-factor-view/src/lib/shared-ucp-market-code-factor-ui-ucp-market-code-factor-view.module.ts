import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcpMarketCodeFactorViewComponent } from './ucp-market-code-factor-view/ucp-market-code-factor-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [UcpMarketCodeFactorViewComponent],
  exports: [UcpMarketCodeFactorViewComponent],
  entryComponents: [UcpMarketCodeFactorViewComponent]
})
export class SharedUcpMarketCodeFactorUiUcpMarketCodeFactorViewModule {}
