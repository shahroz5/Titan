import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossTepStoneConfigDataAccessTepStoneConfigModule } from '@poss-web/eposs/tep-stone-config/data-access-tep-stone-config';
import { EpossTepStoneConfigUiTepStoneConfigListModule } from '@poss-web/eposs/tep-stone-config/ui-tep-stone-config-list';
import { TepStoneListingComponent } from './tep-stone-listing.component';

const routes: Route[] = [{ path: '', component: TepStoneListingComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossTepStoneConfigDataAccessTepStoneConfigModule,
    EpossTepStoneConfigUiTepStoneConfigListModule
  ],
  declarations: [TepStoneListingComponent]
})
export class EpossTepStoneConfigFeatureTepStoneConfigListingModule {}
