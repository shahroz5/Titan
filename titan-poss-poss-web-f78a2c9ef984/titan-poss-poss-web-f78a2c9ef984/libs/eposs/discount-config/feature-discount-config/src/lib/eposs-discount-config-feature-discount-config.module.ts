import { EpossDiscountConfigUiDiscountSlabConfigModule } from '@poss-web/eposs/discount-config/ui-discount-slab-config';
import { EpossDiscountConfigUiDiscountExcludeConfigModule } from '@poss-web/eposs/discount-config/ui-discount-exclude-config';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { EpossDiscountConfigUiDiscountProductCategoryMappingModule } from '@poss-web/eposs/discount-config/ui-discount-product-category-mapping';
import { EpossDiscountConfigUiDiscountProductGroupMappingModule } from '@poss-web/eposs/discount-config/ui-discount-product-group-mapping';
import { EpossDiscountConfigUiDiscountApplicableModule } from '@poss-web/eposs/discount-config/ui-discount-applicable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { DiscountConfigComponent } from './discount-config/discount-config.component';
import { EpossDiscountConfigDataAccessDiscountConfigModule } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { EpossDiscountConfigUiDiscountExchangeOfferConfigModule } from '@poss-web/eposs/discount-config/ui-discount-exchange-offer-config';
import { EpossDiscountConfigUiDiscountLocationMappingModule } from '@poss-web/eposs/discount-config/ui-discount-location-mapping';
import { EpossDiscountConfigUiCategoryDiscountProductGroupMappingModule } from '@poss-web/eposs/discount-config/ui-category-discount-product-group-mapping';
import { EpossDiscountConfigUiDiscountExchangeOfferPgMapModule } from '@poss-web/eposs/discount-config/ui-discount-exchange-offer-pg-map';
import { EpossDiscountConfigUiDiscountConfigHeaderModule } from '@poss-web/eposs/discount-config/ui-discount-config-header';
import { EpossDiscountConfigUiDiscountRivaahAshirwaadPgMapModule } from '@poss-web/eposs/discount-config/ui-discount-rivaah-ashirwaad-pg-map';
import { EpossDiscountConfigUiDiscountReferBestDealModule } from '@poss-web/eposs/discount-config/ui-discount-refer-best-deal';
import { EpossDiscountConfigUiDiscountLotBinAgeConfigModule } from '@poss-web/eposs/discount-config/ui-discount-lot-bin-age-config';
import { EpossDiscountConfigUiDiscountMaxAllowedValueModule } from '@poss-web/eposs/discount-config/ui-discount-max-allowed-value';
import { EpossDiscountConfigUiDiscountTsssConfigModule } from '@poss-web/eposs/discount-config/ui-discount-tsss-config';

import { EpossDiscountConfigUiEmpDiscountLocationModule } from '@poss-web/eposs/discount-config/ui-emp-discount-location';
import { EpossDiscountConfigUiDiscountApplicableThemeModule } from '@poss-web/eposs/discount-config/ui-discount-applicable-theme';

import { SharedProductGroupMappingDataAccessProductGroupMappingModule } from '@poss-web/shared/product-group-mapping/data-access-product-group-mapping';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { EpossDiscountConfigUiDiscountEmpowermentConfigModule } from '@poss-web/eposs/discount-config/ui-discount-empowerment-config';
import { EpossDiscountConfigUiDiscountConfigViewModule } from '@poss-web/eposs/discount-config/ui-discount-config-view';
import { EpossDiscountConfigUiDiscountSchemeMappingModule } from '@poss-web/eposs/discount-config/ui-discount-scheme-mapping'

const routes: Routes = [
  {
    path: '',
    component: DiscountConfigComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossDiscountConfigDataAccessDiscountConfigModule,
    EpossDiscountConfigUiDiscountApplicableModule,
    EpossDiscountConfigUiDiscountProductCategoryMappingModule,
    EpossDiscountConfigUiDiscountProductGroupMappingModule,
    EpossDiscountConfigUiDiscountExchangeOfferConfigModule,
    EpossDiscountConfigUiDiscountRivaahAshirwaadPgMapModule,
    EpossDiscountConfigUiDiscountSchemeMappingModule,
    EpossDiscountConfigUiDiscountLocationMappingModule,
    SharedComponentsUiToggleButtonModule,
    EpossDiscountConfigUiCategoryDiscountProductGroupMappingModule,
    EpossDiscountConfigUiDiscountExchangeOfferPgMapModule,
    EpossDiscountConfigUiDiscountExcludeConfigModule,
    EpossDiscountConfigUiDiscountConfigHeaderModule,
    EpossDiscountConfigUiDiscountReferBestDealModule,
    EpossDiscountConfigUiDiscountLotBinAgeConfigModule,
    EpossDiscountConfigUiDiscountMaxAllowedValueModule,
    EpossDiscountConfigUiEmpDiscountLocationModule,
    EpossDiscountConfigUiDiscountApplicableThemeModule,
    SharedProductGroupMappingDataAccessProductGroupMappingModule,
    SharedFileUploadDataAccessFileUploadModule,
    EpossDiscountConfigUiDiscountTsssConfigModule,
    EpossDiscountConfigUiDiscountSlabConfigModule,
    EpossDiscountConfigUiDiscountEmpowermentConfigModule,
    EpossDiscountConfigUiDiscountConfigViewModule
  ],
  declarations: [DiscountConfigComponent]
})
export class EpossDiscountConfigFeatureDiscountConfigModule {}
