import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  otherIssueFeatureKey,
  otherIssuesReducer
} from './+state/other-issues.reducer';
import { OtherIssuesEffect } from './+state/other-issues.effects';
import { OtherIssueService } from './other-issues.service';
import { OtherIssuesFacade } from './+state/other-issues.facade';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(otherIssueFeatureKey, otherIssuesReducer),
    EffectsModule.forFeature([OtherIssuesEffect])
  ],
  providers: [OtherIssuesFacade, OtherIssueService]
})
export class EpossOtherIssueDataAccessOtherIssueModule {}
