import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';

import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

import { GepHistoryComponent } from './gep-history/gep-history.component';

import { PossGepUiGepDetailsModule } from '@poss-web/poss/gep/ui-gep-details';
import { PossGepDataAccessGepModule } from '@poss-web/poss/gep/data-access-gep';
import { PossGepUiGepSearchModule } from '@poss-web/poss/gep/ui-gep-search';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild([{ path: '', component: GepHistoryComponent }]),
    SharedComponentsUiFormFieldControlsModule,
    SharedBodEodDataAccessBodEodModule,
    SharedComponentsUiLoaderModule,
    SharedCommonDataAccessCommonModule,
    PossGepUiGepDetailsModule,
    PossGepDataAccessGepModule,
    PossGepUiGepSearchModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [GepHistoryComponent],
  exports: [GepHistoryComponent]

})
export class PossGepFeatureGepHistoryModule {}
