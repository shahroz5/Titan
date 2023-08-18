import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcpMarketCodeDetailComponent } from './ucp-market-code-detail/ucp-market-code-detail.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule
  ],
  declarations: [UcpMarketCodeDetailComponent],
  exports: [UcpMarketCodeDetailComponent]
})
export class SharedUcpMarketCodeFactorUiUcpMarketCodeFactorDetailModule {}
