import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RivaahEligibilityConfigComponent } from './rivaah-eligibility-config/rivaah-eligibility-config.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SetLimitTabComponent } from './set-limit-tab/set-limit-tab.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SelectCheckAllComponent } from './select-check-all/select-check-all.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [RivaahEligibilityConfigComponent, SetLimitTabComponent, SelectCheckAllComponent],
  exports: [RivaahEligibilityConfigComponent],
  entryComponents: [RivaahEligibilityConfigComponent]
})
export class EpossRivaahEligibilityConfigUiRivaahEligibilityConfigModule {}
