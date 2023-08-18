import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  routerReducer,
  StoreRouterConnectingModule,
  RouterStateSerializer, DefaultRouterStateSerializer
} from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { RouterEffects } from './router.effects';
import { CustomSerializer } from './router-state.serializer';
import { RouterFacade } from './router.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('router', routerReducer),
    EffectsModule.forFeature([RouterEffects]),
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer, stateKey: 'router' })
  ],
  providers: [
    RouterEffects,
    [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
    RouterFacade
  ]
})
export class SharedNgrxRouterDataAccessRouterModule {}
