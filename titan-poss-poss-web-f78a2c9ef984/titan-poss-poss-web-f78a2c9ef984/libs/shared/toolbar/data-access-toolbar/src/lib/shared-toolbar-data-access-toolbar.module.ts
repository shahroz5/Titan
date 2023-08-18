import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { toolbarReducer, TOOLBAR_FEATURE_KEY } from './+state/toolbar.reducer';
import { ToolbarService } from './toolbar.service';
import { ToolbarFacade } from './+state/toolbar.facade';
import { ToolbarEffect } from './+state/toolbar.effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(TOOLBAR_FEATURE_KEY, toolbarReducer),
    EffectsModule.forFeature([ToolbarEffect])
  ],
  providers: [ToolbarFacade, ToolbarService]
})
export class SharedToolbarDataAccessToolbarModule {}
