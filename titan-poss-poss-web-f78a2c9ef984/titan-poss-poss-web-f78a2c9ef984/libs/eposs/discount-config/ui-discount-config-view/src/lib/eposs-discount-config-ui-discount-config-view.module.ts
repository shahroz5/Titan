import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountHeaderDetailsViewComponent } from './discount-header-details-view/discount-header-details-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { ProductCategoryMappingViewComponent } from './product-category-mapping-view/product-category-mapping-view.component';
import { DiscountEmpowerConfigViewComponent } from './discount-empower-config-view/discount-empower-config-view.component';
import { DiscountExcludeConfigViewComponent } from './discount-exclude-config-view/discount-exclude-config-view.component';
import { ProductGroupMappingViewComponent } from './product-group-mapping-view/product-group-mapping-view.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { ReferBestDealDiscountViewComponent } from './refer-best-deal-discount-view/refer-best-deal-discount-view.component';
import { LotBinAgeConfigViewComponent } from './lot-bin-age-config-view/lot-bin-age-config-view.component';
import { MaxAllowedValueViewComponent } from './max-allowed-value-view/max-allowed-value-view.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { DiscountApplicableThemeViewComponent } from './discount-applicable-theme-view/discount-applicable-theme-view.component';
import { EmpDiscountLocationViewComponent } from './emp-discount-location-view/emp-discount-location-view.component';
import { DiscountExchangeOfferConfigViewComponent } from './discount-exchange-offer-config-view/discount-exchange-offer-config-view.component';
import { DiscountTssConfigViewComponent } from './discount-tss-config-view/discount-tss-config-view.component';
import { DiscountSlabConfigViewComponent } from './discount-slab-config-view/discount-slab-config-view.component';
import { CategoryDiscountProductgroupMappingViewComponent } from './category-discount-productgroup-mapping-view/category-discount-productgroup-mapping-view.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { ClubbingOfferViewComponent } from './disc-applicable/clubbing-offer-view/clubbing-offer-view.component';
import { BasicDiscountCategoryViewComponent } from './disc-applicable/basic-discount-category-view/basic-discount-category-view.component';
import { ClubbingDiscountsViewComponent } from './disc-applicable/clubbing-discounts-view/clubbing-discounts-view.component';
import { CumulativeDiscountsViewComponent } from './disc-applicable/cumulative-discounts-view/cumulative-discounts-view.component';
import { GrnConfigViewComponent } from './disc-applicable/grn-config-view/grn-config-view.component';
import { DiscApplicableViewComponent } from './disc-applicable/disc-applicable-view.component';
import { TepRecoveryConfigViewComponent } from './disc-applicable/tep-recovery-config-view/tep-recovery-config-view.component';
import { AbCoConfigViewComponent } from './disc-applicable/ab-co-config-view/ab-co-config-view.component';
import { TableViewDialogService } from '@poss-web/shared/components/ui-table-view-dialog';
import { ExchangeOfferDiscountPgmViewComponent } from './exchange-offer-discount-pgm-view/exchange-offer-discount-pgm-view.component';
import { DiscountLocationMappingViewComponent } from './discount-location-mapping-view/discount-location-mapping-view.component';
import { AbCoDiscountViewComponent } from './discount-slab-config-view/ab-co-discount-view/ab-co-discount-view.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { AddMaxAllowedValueViewComponent } from './add-max-allowed-value-view/add-max-allowed-value-view.component';
import { RivaahAshirwaadPgmViewComponent } from './rivaah-ashirwaad-pgm-view/rivaah-ashirwaad-pgm-view.component';
import { SchemeMappingViewComponent } from './scheme-mapping-view/scheme-mapping-view.component';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFileUploadModule
  ],
  declarations: [
    DiscountHeaderDetailsViewComponent,
    ProductCategoryMappingViewComponent,
    DiscountEmpowerConfigViewComponent,
    DiscountExcludeConfigViewComponent,
    ProductGroupMappingViewComponent,
    ReferBestDealDiscountViewComponent,
    LotBinAgeConfigViewComponent,
    MaxAllowedValueViewComponent,
    DiscountApplicableThemeViewComponent,
    EmpDiscountLocationViewComponent,
    DiscountExchangeOfferConfigViewComponent,
    DiscountTssConfigViewComponent,
    DiscountSlabConfigViewComponent,
    DiscApplicableViewComponent,
    CategoryDiscountProductgroupMappingViewComponent,
    BasicDiscountCategoryViewComponent,
    ClubbingOfferViewComponent,
    ClubbingDiscountsViewComponent,
    CumulativeDiscountsViewComponent,
    GrnConfigViewComponent,
    TepRecoveryConfigViewComponent,
    AbCoConfigViewComponent,
    ExchangeOfferDiscountPgmViewComponent,
    DiscountLocationMappingViewComponent,
    AbCoDiscountViewComponent,
    AddMaxAllowedValueViewComponent,
    RivaahAshirwaadPgmViewComponent,
    SchemeMappingViewComponent
  ],
  exports: [
    DiscountHeaderDetailsViewComponent,
    ProductCategoryMappingViewComponent,
    DiscountEmpowerConfigViewComponent,
    DiscountExcludeConfigViewComponent,
    ProductGroupMappingViewComponent,
    ReferBestDealDiscountViewComponent,
    LotBinAgeConfigViewComponent,
    MaxAllowedValueViewComponent,
    DiscountApplicableThemeViewComponent,
    EmpDiscountLocationViewComponent,
    DiscountExchangeOfferConfigViewComponent,
    DiscountTssConfigViewComponent,
    DiscountSlabConfigViewComponent,
    DiscApplicableViewComponent,
    CategoryDiscountProductgroupMappingViewComponent,
    ClubbingOfferViewComponent,
    ClubbingDiscountsViewComponent,
    CumulativeDiscountsViewComponent,
    GrnConfigViewComponent,
    TepRecoveryConfigViewComponent,
    AbCoConfigViewComponent,
    ExchangeOfferDiscountPgmViewComponent,
    DiscountLocationMappingViewComponent,
    AddMaxAllowedValueViewComponent,
    RivaahAshirwaadPgmViewComponent,
    SchemeMappingViewComponent
  ],
  providers: [TableViewDialogService]
})
export class EpossDiscountConfigUiDiscountConfigViewModule {}
