import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FileEffect } from './+state/file.effects';
import { FileFacade } from './+state/file.facade';
import { FileReducer, FILE_FEATURE_KEY } from './+state/file.reducer';
import { FileService } from './file.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(FILE_FEATURE_KEY, FileReducer),
    EffectsModule.forFeature([FileEffect])
  ],
  providers: [FileFacade, FileService]
})
export class SharedFileUploadDataAccessFileUploadModule {}
