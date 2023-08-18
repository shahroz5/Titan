import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoToleranceListComponent } from './co-tolerance-list/co-tolerance-list.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossCoToleranceConfigDataAccessCoToleranceConfigModule } from '@poss-web/eposs/co-tolerance-config/data-access-co-tolerance-config';
import { EpossCoToleranceConfigUiCoToleranceConfigListingModule } from '@poss-web/eposs/co-tolerance-config/ui-co-tolerance-config-listing';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

const route: Route[] = [{ path: '', component: CoToleranceListComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossCoToleranceConfigDataAccessCoToleranceConfigModule,
    EpossCoToleranceConfigUiCoToleranceConfigListingModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [CoToleranceListComponent]
})
export class EpossCoToleranceConfigFeatureCoToleranceConfigListingModule {}
