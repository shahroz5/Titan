import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { DataUploadEffect } from './+state/data-upload.effects';
import {
  dataUploadReducer,
  dataUploadFeatureKey
} from './+state/data-upload.reducers';
import { DataUploadFacade } from './+state/data-upload.facade';
import { DataUploadService } from './data-upload.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(dataUploadFeatureKey, dataUploadReducer),
    EffectsModule.forFeature([DataUploadEffect])
  ],
  providers: [DataUploadFacade, DataUploadService]
})
export class EpossDataUploadDataAccessDataUploadModule {}
