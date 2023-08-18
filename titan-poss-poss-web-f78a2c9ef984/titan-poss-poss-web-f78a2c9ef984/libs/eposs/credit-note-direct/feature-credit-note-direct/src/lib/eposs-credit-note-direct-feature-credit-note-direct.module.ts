import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CreditNoteDirectComponent } from './credit-note-direct/credit-note-direct.component';
import { EpossCreditNoteDirectUiCreditNoteDirectModule } from '@poss-web/eposs/credit-note-direct/ui-credit-note-direct';
import { EpossCreditNoteDirectDataAccessCreditNoteDirectModule } from '@poss-web/eposs/credit-note-direct/data-access-credit-note-direct';
import { SharedComponentsUiErrorGridPopupModule } from '@poss-web/shared/components/ui-error-grid-popup';

const route: Route[] = [
  {
    path: '',
    component: CreditNoteDirectComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedUtilFieldValidatorsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    EpossCreditNoteDirectUiCreditNoteDirectModule,
    EpossCreditNoteDirectDataAccessCreditNoteDirectModule,
    SharedComponentsUiErrorGridPopupModule
  ],
  declarations: [CreditNoteDirectComponent]
})
export class EpossCreditNoteDirectFeatureCreditNoteDirectModule {}
