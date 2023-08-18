import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossTepUiTepDetailsModule } from '@poss-web/poss/tep/ui-tep-details';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { AgGridModule } from 'ag-grid-angular';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { PossTepDataAccessTepModule } from '@poss-web/poss/tep/data-access-tep';
import { TepCancelComponent } from './tep-cancel/tep-cancel.component';
import { RouterModule } from '@angular/router';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    RouterModule,
    PossTepUiTepDetailsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedComponentsUiFormattersModule,
    PossTepDataAccessTepModule,
    AgGridModule.withComponents(),
    SharedBodEodDataAccessBodEodModule,
    RouterModule.forChild([{ path: '', component: TepCancelComponent }])
  ],
  declarations: [TepCancelComponent],
  exports: [TepCancelComponent]
})
export class PossTepFeatureTepCancelModule {}
