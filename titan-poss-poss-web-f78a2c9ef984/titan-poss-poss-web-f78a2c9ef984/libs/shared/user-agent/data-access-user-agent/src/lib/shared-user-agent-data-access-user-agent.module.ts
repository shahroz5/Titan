import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UAFacade } from './+state/user-agent.facade';

import { UAEffects } from './+state/user-agent.effects';
import { EffectsModule } from '@ngrx/effects';
import { UAReducer, UA_FEATURE_KEY } from './+state/user.agent.reducer';
import { StoreModule } from '@ngrx/store';
import { UserAgentService } from './user-agent.service';
@NgModule({
  imports: [
    CommonModule,
    
    StoreModule.forFeature(UA_FEATURE_KEY, UAReducer),
    EffectsModule.forFeature([UAEffects])
  ],
  providers: [UAFacade, UserAgentService]
})
export class SharedUserAgentDataAccessUserAgentModule {}
