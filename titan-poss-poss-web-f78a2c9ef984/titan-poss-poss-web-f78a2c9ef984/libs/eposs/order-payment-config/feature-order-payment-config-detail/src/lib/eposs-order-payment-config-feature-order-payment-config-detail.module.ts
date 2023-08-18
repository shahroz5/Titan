import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPaymentConfigDetailsComponent } from './order-payment-config-details/order-payment-config-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { EpossOrderPaymentConfigDataAccessOrderPaymentConfigModule } from '@poss-web/eposs/order-payment-config/data-access-order-payment-config';
import { RouterModule, Route } from '@angular/router';
import { EpossOrderPaymentConfigUiOrderPaymentConfigDetailModule } from '@poss-web/eposs/order-payment-config/ui-order-payment-config-detail';
import { EpossOrderPaymentConfigUiOrderPaymentConfigViewModule } from '@poss-web/eposs/order-payment-config/ui-order-payment-config-view';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';

const routes: Route[] = [
  { path: '', component: OrderPaymentConfigDetailsComponent }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossOrderPaymentConfigDataAccessOrderPaymentConfigModule,
    SharedComponentsUiFormattersModule,
    EpossOrderPaymentConfigUiOrderPaymentConfigDetailModule,
    SharedComponentsUiToggleButtonModule,
    EpossOrderPaymentConfigUiOrderPaymentConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [OrderPaymentConfigDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossOrderPaymentConfigFeatureOrderPaymentConfigDetailModule {}
