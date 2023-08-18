import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { conversionApprovalsFeatureKey } from './+state/conversion-approvals.state';
import { ConversionApprovalsReducer } from './+state/conversion-approvals.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ConversionApprovalsEffects } from './+state/conversion-approvals.effects';
import { ConversionApprovalsFacade } from './+state/conversion-approvals.facade';
import { ConversionApprovalsService } from './conversion-approvals.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      conversionApprovalsFeatureKey,
      ConversionApprovalsReducer
    ),
    EffectsModule.forFeature([ConversionApprovalsEffects])
  ],
  providers: [ConversionApprovalsFacade, ConversionApprovalsService]
})
export class EpossConversionApprovalsDataAccessConversionApprovalsModule {}
