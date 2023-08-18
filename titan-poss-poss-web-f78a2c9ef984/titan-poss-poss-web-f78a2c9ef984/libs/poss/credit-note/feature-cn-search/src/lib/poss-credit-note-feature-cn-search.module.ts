import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CNSearchComponent } from './cn-search/cn-search.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossCreditNoteUiCnSearchResultListModule } from '@poss-web/poss/credit-note/ui-cn-search-result-list';
import { PossCreditNoteDataAccessCnModule } from '@poss-web/poss/credit-note/data-access-cn';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiApprovalsTemplateModule } from '@poss-web/shared/components/ui-approvals-template';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
const routes: Routes = [
  {
    path: '',
    component: CNSearchComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    PossCreditNoteUiCnSearchResultListModule,
    PossCreditNoteDataAccessCnModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiApprovalsTemplateModule,
    SharedUtilFieldValidatorsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [CNSearchComponent]
})
export class PossCreditNoteFeatureCnSearchModule {}
