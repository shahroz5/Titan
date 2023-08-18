import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupMappingPopUpComponent } from './product-group-mapping-pop-up/product-group-mapping-pop-up.component';
import { ProductGroupMappingPopUpService } from './product-group-mapping-pop-up.service';
import { ProductGroupMappingServiceAbstraction } from '@poss-web/shared/models';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ProductGroupSearchPipe } from './product-group-search.pipe';
import { SharedProductGroupMappingDataAccessProductGroupMappingModule } from '@poss-web/shared/product-group-mapping/data-access-product-group-mapping';
import { ProductGroupMappingDiscounFormComponent } from './product-group-mapping-form/product-group-mapping-discount-form/product-group-mapping-discount-form.component';
import { ProductGroupMappingWithFormPopupComponent } from './product-group-mapping-with-form-popup/product-group-mapping-with-form-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { AddDeductionFormComponent } from './product-group-mapping-form/add-deduction-form/add-deduction-form.component';
import { ProductGroupMappingExchangeOfferDiscountFormComponent } from './product-group-mapping-form/product-group-mapping-exchange-offer-discount-form/product-group-mapping-exchange-offer-discount-form.component';
import { TepProductGroupConfigMappingFormComponent } from './product-group-mapping-form/tep-product-group-config-mapping-form/tep-product-group-config-mapping-form.component';
import { WeightTolerancePopUpComponent } from './product-group-mapping-form/weight-tolerance-pop-up/weight-tolerance-pop-up.component';
import { AbOrderPaymentConfigPopupComponent } from './product-group-mapping-form/ab-order-payment-config-popup/ab-order-payment-config-popup.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CoOrderPaymentConfigPopupComponent } from './product-group-mapping-form/co-order-payment-config-popup/co-order-payment-config-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedProductGroupMappingDataAccessProductGroupMappingModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    ProductGroupMappingPopUpComponent,
    ProductGroupMappingWithFormPopupComponent,
    ProductGroupSearchPipe,
    ProductGroupMappingDiscounFormComponent,
    AddDeductionFormComponent,
    ProductGroupMappingExchangeOfferDiscountFormComponent,
    TepProductGroupConfigMappingFormComponent,
    WeightTolerancePopUpComponent,
    AbOrderPaymentConfigPopupComponent,
    CoOrderPaymentConfigPopupComponent
  ],
  entryComponents: [
    ProductGroupMappingPopUpComponent,
    ProductGroupMappingWithFormPopupComponent
  ],
  providers: [
    {
      provide: ProductGroupMappingServiceAbstraction,
      useClass: ProductGroupMappingPopUpService
    }
  ]
})
export class SharedProductGroupMappingFeatureProductGroupMappingModule {}
