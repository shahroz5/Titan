import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WalkInsRecordComponent } from './walk-ins-record/walk-ins-record.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { PossWalkInsDataAccessWalkInsRecordModule } from '@poss-web/poss/walk-ins/data-access-walk-ins-record';
import { PossBodEodDataAccessBodEodModule } from '@poss-web/poss/bod-eod/data-access-bod-eod';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

const routes: Routes = [
  {
    path: '',
    component: WalkInsRecordComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedUtilFieldValidatorsModule,
    PossWalkInsDataAccessWalkInsRecordModule,
    PossBodEodDataAccessBodEodModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [WalkInsRecordComponent]
})
export class PossWalkInsFeatureWalkInsRecordModule {}
