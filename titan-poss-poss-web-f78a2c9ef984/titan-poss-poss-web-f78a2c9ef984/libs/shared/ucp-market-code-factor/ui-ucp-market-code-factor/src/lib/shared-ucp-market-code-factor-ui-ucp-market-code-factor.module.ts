import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcpMarketCodeListItemsComponent } from './ucp-market-code-list-items/ucp-market-code-list-items.component';
import { UcpMarketCodeListItemComponent } from './ucp-market-code-list-item/ucp-market-code-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [
    UcpMarketCodeListItemsComponent,
    UcpMarketCodeListItemComponent
  ],
  exports: [UcpMarketCodeListItemsComponent, UcpMarketCodeListItemComponent]
})
export class SharedUcpMarketCodeFactorUiUcpMarketCodeFactorModule {}
