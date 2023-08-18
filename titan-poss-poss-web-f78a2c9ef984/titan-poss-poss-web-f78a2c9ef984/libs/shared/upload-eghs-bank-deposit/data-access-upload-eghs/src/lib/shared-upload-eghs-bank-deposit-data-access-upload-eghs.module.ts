import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  UploadeGHSReducer,
  UPLOAD_EGHS_FEATURE_KEY
} from './+state/upload-eghs.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UploadeGHSEffects } from './+state/upload-eghs.effect';
import { UploadeGHSFacade } from './+state/upload-eghs.facade';
import { UploadeGHSService } from './upload-eghs.service';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(UPLOAD_EGHS_FEATURE_KEY, UploadeGHSReducer),
    EffectsModule.forFeature([UploadeGHSEffects])
  ],
  providers: [UploadeGHSFacade, UploadeGHSService]
})
export class SharedUploadEghsBankDepositDataAccessUploadEghsModule {}
