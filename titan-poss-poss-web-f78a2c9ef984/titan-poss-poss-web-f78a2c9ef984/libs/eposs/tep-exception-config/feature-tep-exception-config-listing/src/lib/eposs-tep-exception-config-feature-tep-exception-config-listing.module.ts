import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossTepExceptionConfigDataAccessTepExceptionConfigModule } from '@poss-web/eposs/tep-exception-config/data-access-tep-exception-config'
import { EpossTepExceptionConfigUiTepExceptionConfigListModule } from '@poss-web/eposs/tep-exception-config/ui-tep-exception-config-list'
import { TepExceptionConfigListingComponent } from './tep-exception-config-listing.component';

const routes: Route[] = [{ path: '', component: TepExceptionConfigListingComponent }];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossTepExceptionConfigDataAccessTepExceptionConfigModule,
    EpossTepExceptionConfigUiTepExceptionConfigListModule
  ],
  declarations: [TepExceptionConfigListingComponent]
})
export class EpossTepExceptionConfigFeatureTepExceptionConfigListingModule { }
