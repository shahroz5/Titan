import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { EpossTepValidationConfigDataAccessTepValidationConfigModule } from '@poss-web/eposs/tep-validation-config/data-access-tep-validation-config';
import { EpossTepValidationConfigUiTepValidationConfigListModule } from '@poss-web/eposs/tep-validation-config/ui-tep-validation-config-list';

import { TepValidationListingComponent } from './tep-validation-listing.component';

const routes: Route[] = [
  { path: '', component: TepValidationListingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossTepValidationConfigDataAccessTepValidationConfigModule,
    EpossTepValidationConfigUiTepValidationConfigListModule
  ],
  declarations: [TepValidationListingComponent]
})
export class EpossTepValidationConfigFeatureTepValidationConfigListingModule {}
