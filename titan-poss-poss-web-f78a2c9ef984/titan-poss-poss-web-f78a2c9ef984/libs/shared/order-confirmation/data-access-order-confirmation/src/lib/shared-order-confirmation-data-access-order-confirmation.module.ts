import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  orderConfirmationFeatureKey,
  orderConfirmationReducer
} from './+state/order-confirmation.reducer';
import { OrderConfirmationEffects } from './+state/order-confirmation.effects';
import { EffectsModule } from '@ngrx/effects';
import { OrderConfirmationFacade } from './+state/order-confirmation.facade';
import { OrderConfirmationService } from './order-confirmation.service';
import { OrderService } from './order.service';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      orderConfirmationFeatureKey,
      orderConfirmationReducer
    ),
    EffectsModule.forFeature([OrderConfirmationEffects]),
    PossSharedProductDataAccessProductModule
  ],
  providers: [OrderConfirmationFacade, OrderConfirmationService, OrderService],
  declarations: []
})
export class SharedOrderConfirmationDataAccessOrderConfirmationModule {}
