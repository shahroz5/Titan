import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureCommonComponent } from './feature-common/feature-common.component';
import { SharedToolbarUiToolbarModule } from '@poss-web/shared/toolbar/ui-toolbar';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarDataAccessToolbarModule } from '@poss-web/shared/toolbar/data-access-toolbar';

@NgModule({
  imports: [
    CommonModule,
    SharedToolbarUiToolbarModule,
    CommonCustomMaterialModule,
    SharedCommonDataAccessCommonModule,
    SharedToolbarDataAccessToolbarModule
  ],
  declarations: [FeatureCommonComponent],
  exports: [FeatureCommonComponent]
})
export class PossSharedFeatureCommonModule {}
