import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { PaymentComponent } from './payment.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPaymentUiPaymentModule } from '@poss-web/shared/payment/ui-payment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedUserAgentDataAccessUserAgentModule } from '@poss-web/shared/user-agent/data-access-user-agent';
import { SharedUtilCommonModule } from 'libs/shared/util-common/src/lib/shared-util-common.module';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { PossSharedViewTcsFeatureViewTcsModule } from '@poss-web/poss/shared/view-tcs/feature-view-tcs';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    SharedPaymentUiPaymentModule,
    SharedPaymentDataAccessPaymentModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    CommonCustomMaterialModule,
    SharedCustomerDataAccessCustomerModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedUserAgentDataAccessUserAgentModule,
    SharedUtilCommonModule,
    SharedCommonDataAccessCommonModule,
    SharedBodEodDataAccessBodEodModule,
    PossSharedViewTcsFeatureViewTcsModule,
    PossSharedViewTcsUiViewTcsModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],

  declarations: [PaymentComponent],
  exports: [PaymentComponent]
})
export class SharedPaymentFeaturePaymentModule {}
