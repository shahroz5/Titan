import { PaymentModesConfig } from '@poss-web/shared/models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface PaymentModeConfigEntity extends EntityState<PaymentModesConfig> { }

export const paymentModeAdaptor = createEntityAdapter<PaymentModesConfig>({
    selectId: paymentModes =>
        paymentModes.title
});

export const paymentModeSelector = paymentModeAdaptor.getSelectors();