import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { Route, RouterModule } from '@angular/router';
import { EpossTepExceptionConfigDataAccessTepExceptionConfigModule } from '@poss-web/eposs/tep-exception-config/data-access-tep-exception-config';
import { EpossTepExceptionConfigUiTepExceptionConfigDetailModule } from '@poss-web/eposs/tep-exception-config/ui-tep-exception-config-detail';
import { EpossTepExceptionConfigUiTepExceptionConfigViewModule } from '@poss-web/eposs/tep-exception-config/ui-tep-exception-config-view';
import { SharedBrandUiBrandDetailModule } from '@poss-web/shared/brand/ui-brand-detail';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { TepExceptionDetailsComponent } from './tep-exception-details.component';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const routes: Route[] = [
  {
    path: '',
    component: TepExceptionDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    EpossTepExceptionConfigDataAccessTepExceptionConfigModule,
    EpossTepExceptionConfigUiTepExceptionConfigDetailModule,
    EpossTepExceptionConfigUiTepExceptionConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedBrandUiBrandDetailModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TepExceptionDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossTepExceptionConfigFeatureTepExceptionConfigDetailModule {}
