import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { Route, RouterModule } from '@angular/router';
import { EpossTepValidationConfigDataAccessTepValidationConfigModule } from '@poss-web/eposs/tep-validation-config/data-access-tep-validation-config';
import { EpossTepValidationConfigUiTepValidationConfigDetailModule } from '@poss-web/eposs/tep-validation-config/ui-tep-validation-config-detail';
import { EpossTepValidationConfigUiTepValidationConfigViewModule } from '@poss-web/eposs/tep-validation-config/ui-tep-validation-config-view';
import { SharedBrandUiBrandDetailModule } from '@poss-web/shared/brand/ui-brand-detail';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

import { TepValidationConfigDetailComponent } from './tep-validation-config-detail.component';

const routes: Route[] = [
  {
    path: '',
    component: TepValidationConfigDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedBrandUiBrandDetailModule,
    RouterModule.forChild(routes),
    EpossTepValidationConfigDataAccessTepValidationConfigModule,
    EpossTepValidationConfigUiTepValidationConfigDetailModule,
    EpossTepValidationConfigUiTepValidationConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [TepValidationConfigDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossTepValidationConfigFeatureTepValidationConfigDetailModule {}
