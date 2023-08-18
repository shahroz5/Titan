import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcpMarketCodeListComponent } from './ucp-market-code-list/ucp-market-code-list.component';
import { SharedUcpMarketCodeFactorUiUcpMarketCodeFactorModule } from '@poss-web/shared/ucp-market-code-factor/ui-ucp-market-code-factor';
import { SharedUcpMarketCodeFactorDataAccessUcpMarketCodeFactorModule } from '@poss-web/shared/ucp-market-code-factor/data-access-ucp-market-code-factor';
import { SharedUcpMarketCodeFactorUiUcpMarketCodeFactorDetailModule } from '@poss-web/shared/ucp-market-code-factor/ui-ucp-market-code-factor-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { Route, RouterModule } from '@angular/router';
import { SharedUcpMarketCodeFactorUiUcpMarketCodeFactorViewModule } from '@poss-web/shared/ucp-market-code-factor/ui-ucp-market-code-factor-view';
const routes: Route[] = [
  {
    path: '',
    component: UcpMarketCodeListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedUcpMarketCodeFactorUiUcpMarketCodeFactorModule,
    SharedUcpMarketCodeFactorUiUcpMarketCodeFactorDetailModule,
    SharedUcpMarketCodeFactorDataAccessUcpMarketCodeFactorModule,
    SharedUcpMarketCodeFactorUiUcpMarketCodeFactorViewModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UcpMarketCodeListComponent]
})
export class SharedUcpMarketCodeFactorFeatureUcpMarketCodeFactorModule {}
