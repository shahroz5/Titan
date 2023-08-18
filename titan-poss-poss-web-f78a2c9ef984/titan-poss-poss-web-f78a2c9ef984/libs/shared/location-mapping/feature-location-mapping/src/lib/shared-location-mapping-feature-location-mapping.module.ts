import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { LocationMappingPopupComponent } from './location-mapping-popup/location-mapping-popup.component';
import { LocationMappingService } from './location-mapping.service';
import { LocationMappingServiceAbstraction } from '@poss-web/shared/models';
import { LocationSearchPipe } from './location-search.pipe';
import { LocationFilterComponent } from './location-filter/location-filter.component';
import { LocationFilterPopupComponent } from './location-filter-popup/location-filter-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { LocationMappingWithFormPopupComponent } from './location-mapping-with-form-popup/location-mapping-with-form-popup.component';
import { LocationMappingDiscountFormComponent } from './location-mapping-form/location-mapping-discount-form/location-mapping-discount-form.component';
import { FocBlockingLocationLevelFormComponent } from './location-mapping-form/foc-blocking-location-level-form/foc-blocking-location-level-form.component';
import { FocBlockingCustLevelFormComponent } from './location-mapping-form/foc-blocking-cust-level-form/foc-blocking-cust-level-form.component';
import { LocationMappingFocConfigFormComponent } from './location-mapping-form/location-mapping-foc-config-form/location-mapping-foc-config-form.component';

import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { EmpDiscountLocationFormComponent } from './location-mapping-form/emp-discount-location-form/emp-discount-location-form.component';
import { LocationSelectionPopUpComponent } from './location-selection-pop-up/location-selection-pop-up.component';
@NgModule({
  declarations: [
    LocationMappingPopupComponent,
    LocationSearchPipe,
    LocationFilterComponent,
    LocationFilterPopupComponent,
    LocationMappingWithFormPopupComponent,
    LocationMappingDiscountFormComponent,
    FocBlockingLocationLevelFormComponent,
    FocBlockingCustLevelFormComponent,
    LocationMappingFocConfigFormComponent,
    EmpDiscountLocationFormComponent,
    LocationSelectionPopUpComponent
  ],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiLoaderModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiToggleButtonModule
  ],
  entryComponents: [
    LocationMappingPopupComponent,
    LocationFilterPopupComponent,
    LocationMappingWithFormPopupComponent,
    LocationSelectionPopUpComponent
  ],
  providers: [
    {
      provide: LocationMappingServiceAbstraction,
      useClass: LocationMappingService
    }
  ]
})
export class SharedLocationMappingFeatureLocationMappingModule {}
