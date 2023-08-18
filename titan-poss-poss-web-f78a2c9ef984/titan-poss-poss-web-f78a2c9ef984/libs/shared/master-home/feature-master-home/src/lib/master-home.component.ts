import { ScrollService } from '@poss-web/shared/util-common';
import {
  CardMenu,
  CardSubMenu,
  MasterMenuKeyEnum,
  AppTypesEnum
} from '@poss-web/shared/models';
import {
  getLOVMasterDashboardRouteUrl,
  getProductMasterBrandListRouteUrl,
  getProductMasterSubBrandListRouteUrl,
  getProductMasterProductCategoryListRouteUrl,
  getCFAProductsRouteUrl,
  getProductMasterItemRouteUrl,
  getCorporateTownListRouteUrl,
  getMarketCodesListRouteUrl,
  getRegionListRouteUrl,
  getSubRegionListRouteUrl,
  getBinGroupRouteUrl,
  getCourierDetailsListRouteUrl,
  getBinCodeRouteUrl,
  getProductMasterMetalTypeRouteUrl,
  getProductMasterStoneTypeRouteUrl,
  getProductMasterStoneRouteUrl,
  getProductMastersRouteUrl,
  getProductAttributesMasterRouteUrl,
  getLocationMasterRouteUrl,
  getInventoryConfigMasterRouteUrl,
  getProductMasterPurityRouteUrl,
  getProductPricingRouteUrl,
  getProductPricinglistRouteUrl,
  getProductMasterComplexityPriceGroupRouteUrl,
  getTaxMastersRouteUrl,
  getTaxMasterRouteUrl,
  getStateListRouteUrl,
  getCountryMasterListRouteUrl,
  getLocationMasterListRouteUrl,
  getTaxClassRouteUrl,
  getCurrencyistRouteUrl,
  getComplexityCodeListRouteUrl,
  getPaymentMastersRouteUrl,
  getTransactionTypeMasterRouteUrl,
  getPaymentMasterRouteUrl,
  getBankingRouteurl,
  getBankPriorityMasterRouteUrl,
  // getPayeeBankMasterRouteUrl,
  getMaterialPriceListRoutingUrl,
  getBoutiqueMasterStoneRouteUrl,
  getBoutiqueMasterItemRouteUrl,
  getCustomerTownListRouteUrl,
  getCatchmentDashboardRouteUrl,
  getOfflineMetalRatesUpdateRouteUrl,
  getPriceGroupMappingRouteUrl,
  getUcpMarketCodelistRouteUrl,
  getVendorMasterListRouteUrl
} from '@poss-web/shared/util-site-routes';

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-dashboard',
  templateUrl: './master-home.component.html'
})
export class MasterHomeComponent implements OnInit {
  productMasterSubMenuPath = getProductMastersRouteUrl();
  productAttributeSubMenuPath = getProductAttributesMasterRouteUrl();
  productPricingSubMenuPath = getProductPricingRouteUrl();
  locationSetupSubMenuPath = getLocationMasterRouteUrl();
  inventoryConfigurationSubMenuPath = getInventoryConfigMasterRouteUrl();
  taxSubMenuPath = getTaxMastersRouteUrl();
  paymentsSubMenuPath = getPaymentMastersRouteUrl();
  bankingSubMenuPath = getBankingRouteurl();

  permissions$: Observable<any[]>;

  menu: CardMenu[] = [
    {
      menuKey: MasterMenuKeyEnum.PRODUCT_MASTERS_MENU_KEY,
      titleTranslationKey: 'pw.productMasters.product',
      subTitleTranslationKey: 'pw.productMasters.masters',
      hasChild: true,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Master Home - Product Masters Menu',
      child: [
        {
          elementName: 'Product Masters - Brand SubMenu',
          titleTranslationKey: 'pw.productMasters.brandMaster',
          hasChild: false,
          path: getProductMasterBrandListRouteUrl()
        },
        {
          elementName: 'Product Masters - SubBrand SubMenu',
          titleTranslationKey: 'pw.productMasters.subBrand',
          hasChild: false,
          path: getProductMasterSubBrandListRouteUrl()
        },
        {
          elementName: 'Product Masters - ItemMaster SubMenu',
          titleTranslationKey: 'pw.productMasters.itemMaster',
          hasChild: false,
          path: getProductMasterItemRouteUrl()
        },
        {
          elementName: 'Product Masters - StoneMaster SubMenu',
          titleTranslationKey: 'pw.productMasters.stoneMaster',
          hasChild: false,
          path: getProductMasterStoneRouteUrl()
        },
        {
          elementName: 'Product Masters - ProductCategory SubMenu',
          titleTranslationKey: 'pw.productMasters.productCategory',
          hasChild: false,
          path: getProductMasterProductCategoryListRouteUrl()
        },
        {
          elementName: 'Product Masters - ProductGroup SubMenu',
          titleTranslationKey: 'pw.productMasters.productGroup',
          hasChild: false,
          path: getCFAProductsRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.PRODUCT_ATTRIBUTES_MENU_KEY,
      titleTranslationKey: 'pw.productAttributes.product',
      subTitleTranslationKey: 'pw.productAttributes.attributes',
      hasChild: true,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Master Home - Product Attributes Menu',
      child: [
        {
          elementName: 'Product Attributes - PurityMaster SubMenu',
          titleTranslationKey: 'pw.productAttributes.purityMaster',
          hasChild: false,
          path: getProductMasterPurityRouteUrl()
        },
        {
          elementName: 'Product Attributes - StoneType SubMenu',
          titleTranslationKey: 'pw.productAttributes.stoneType',
          hasChild: false,
          path: getProductMasterStoneTypeRouteUrl()
        },
        {
          elementName: 'Product Attributes - MaterialType SubMenu',
          titleTranslationKey: 'pw.productAttributes.materialType',
          hasChild: false,
          path: getProductMasterMetalTypeRouteUrl()
        },
        {
          elementName: 'Product Attributes - Complexity SubMenu',
          titleTranslationKey: 'pw.productAttributes.complexity',
          hasChild: false,
          path: getComplexityCodeListRouteUrl()
        },

        {
          elementName: 'Product Attributes - VendorMaster SubMenu',
          titleTranslationKey: 'pw.productAttributes.vendorMaster',
          hasChild: false,
          path: getVendorMasterListRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.PRODUCT_PRICING_MENU_KEY,
      titleTranslationKey: 'pw.productPricing.product',
      subTitleTranslationKey: 'pw.productPricing.pricing',
      hasChild: true,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Master Home - Product Pricing Menu',
      child: [
        {
          elementName: 'Product Pricing - ComplexityPriceGroupMapping SubMenu',
          titleTranslationKey: 'pw.productPricing.complexityPriceGroupMapping',
          hasChild: false,
          path: getProductMasterComplexityPriceGroupRouteUrl()
        },
        {
          elementName: 'Product Pricing - PriceGroup SubMenu',
          titleTranslationKey: 'pw.productPricing.priceGroup',
          hasChild: false,
          path: getProductPricinglistRouteUrl()
        },
        {
          elementName: 'Product Pricing - MarketMetalMapping SubMenu',
          titleTranslationKey: 'pw.productPricing.marketMetalMapping',
          hasChild: false,
          path: getMaterialPriceListRoutingUrl('gold')
        },
        {
          elementName: 'Product Pricing - MarketMetalMapping SubMenu',
          titleTranslationKey: 'F2 Margin Table',
          hasChild: false,
          path: '/master/product-pricing/f2-margin-list'
        },

        {
          elementName: 'Product Pricing - PriceGroup SubMenu',
          titleTranslationKey: 'UCP Market Code Factor',
          hasChild: false,
          path: getUcpMarketCodelistRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.LOCATION_MENU_KEY,
      titleTranslationKey: 'pw.locationMasters.location',
      subTitleTranslationKey: 'pw.locationMasters.masters',
      hasChild: true,
      iconClass: 'pw-i-64 pw-location-icon-64',
      elementName: 'Master Home - Location Masters Menu',
      child: [
        {
          elementName: 'Location Masters - MarketMaster SubMenu',
          titleTranslationKey: 'pw.locationMasters.marketMaster',
          hasChild: false,
          path: getMarketCodesListRouteUrl()
        },
        {
          elementName: 'Location Masters - Location SubMenu',
          titleTranslationKey: 'pw.locationMasters.locationMaster',
          hasChild: false,
          path: getLocationMasterListRouteUrl()
        },
        {
          elementName: 'Location Masters - TownMaster SubMenu',
          titleTranslationKey: 'pw.locationMasters.townMaster',
          hasChild: false,
          path: getCorporateTownListRouteUrl()
        },
        {
          elementName: 'Location Masters - RegionMaster SubMenu',
          titleTranslationKey: 'pw.locationMasters.regionMaster',
          hasChild: false,
          path: getRegionListRouteUrl()
        },
        {
          elementName: 'Location Masters - SubRegion SubMenu',
          titleTranslationKey: 'pw.locationMasters.subRegion',
          hasChild: false,
          path: getSubRegionListRouteUrl()
        },
        {
          elementName: 'Location Masters - StateMaster SubMenu',
          titleTranslationKey: 'pw.locationMasters.stateMaster',
          hasChild: false,
          path: getStateListRouteUrl()
        },
        {
          elementName: 'Location Masters - CountryMaster SubMenu',
          titleTranslationKey: 'pw.locationMasters.countryMaster',
          hasChild: false,
          path: getCountryMasterListRouteUrl()
        },
        {
          elementName: 'Location Masters - CurrencyMaster SubMenu',
          titleTranslationKey: 'pw.locationMasters.currencyMaster',
          hasChild: false,
          path: getCurrencyistRouteUrl()
        },
        {
          elementName: 'Location Masters - locationPriceGroupMapping SubMenu',
          titleTranslationKey: 'pw.locationMasters.locationPriceGroupMapping',
          hasChild: false,
          path: getPriceGroupMappingRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.INVENTORY_MENU_KEY,
      titleTranslationKey: 'pw.inventoryMasters.inventory',
      subTitleTranslationKey: 'pw.inventoryMasters.masters',
      hasChild: true,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Master Home - Inventory Masters Menu',
      child: [
        {
          elementName: 'Inventory Masters - BinGroup SubMenu',
          titleTranslationKey: 'pw.inventoryMasters.binGroup',
          hasChild: false,
          path: getBinGroupRouteUrl()
        },
        {
          elementName: 'Inventory Masters - BinCode SubMenu',
          titleTranslationKey: 'pw.inventoryMasters.binCode',
          hasChild: false,
          path: getBinCodeRouteUrl()
        },
        {
          elementName: 'Inventory Masters - CourierMaster SubMenu',
          titleTranslationKey: 'pw.inventoryMasters.courierMaster',
          hasChild: false,
          path: getCourierDetailsListRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.TAX_MENU_KEY,
      titleTranslationKey: 'pw.taxMasters.tax',
      subTitleTranslationKey: 'pw.taxMasters.masters',
      hasChild: true,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Master Home - Tax Masters Menu',
      child: [
        {
          elementName: 'Tax Masters - TaxMaster SubMenu',
          titleTranslationKey: 'pw.taxMasters.taxMaster',
          hasChild: false,
          path: getTaxMasterRouteUrl()
        },
        {
          elementName: 'Tax Masters - TaxClass SubMenu',
          titleTranslationKey: 'pw.taxMasters.taxClass',
          hasChild: false,
          path: getTaxClassRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.PAYMENT_MENU_KEY,
      titleTranslationKey: 'pw.paymentMasters.payment',
      subTitleTranslationKey: 'pw.paymentMasters.masters',
      hasChild: true,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Master Home - Payment Masters Menu',
      child: [
        {
          elementName: 'Payment Masters - PaymentMode SubMenu',
          titleTranslationKey: 'pw.paymentMasters.paymentMode',
          hasChild: false,
          path: getPaymentMasterRouteUrl()
        },
        {
          elementName: 'Payment Masters - TransactionTypeMaster SubMenu',
          titleTranslationKey: 'pw.paymentMasters.transactionTypeMaster',
          hasChild: false,
          path: getTransactionTypeMasterRouteUrl()
        }
        // {
        //   elementName: 'Payment Masters - PayeeBankMaster SubMenu',
        //   titleTranslationKey: 'pw.paymentMasters.payeeBankMaster',
        //   hasChild: false,
        //   path: getPayeeBankMasterRouteUrl()
        // },
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.BOUTIQUE_MENU_KEY,
      titleTranslationKey: 'pw.boutiqueMasters.boutique',
      subTitleTranslationKey: 'pw.boutiqueMasters.masters',
      hasChild: true,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Master Home - Boutique Masters Menu',
      child: [
        {
          elementName: 'Boutique Masters - Customer Town Master SubMenu',
          titleTranslationKey: 'pw.boutiqueMasters.customerTownMaster',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: getCustomerTownListRouteUrl()
        },
        {
          elementName: 'Boutique Masters - CatchmentMaster SubMenu',
          titleTranslationKey: 'pw.boutiqueMasters.catchmentMaster',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: getCatchmentDashboardRouteUrl()
        },
        {
          elementName: 'Product Masters - BoutiqueItemMaster SubMenu',
          titleTranslationKey: 'pw.productMasters.itemMaster',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: getBoutiqueMasterItemRouteUrl()
        },
        {
          elementName: 'Product Masters - BoutiqueStoneMaster SubMenu',
          titleTranslationKey: 'pw.productMasters.stoneMaster',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: getBoutiqueMasterStoneRouteUrl()
        },
        {
          elementName: 'Master_BoutiqueMasters_MetalRateUpdateSubMenu',
          titleTranslationKey: 'pw.boutiqueMasters.metalRateUpdate',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: getOfflineMetalRatesUpdateRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.COMPANY_MENU_KEY,
      titleTranslationKey: 'pw.boutiqueMasters.company',
      subTitleTranslationKey: 'pw.boutiqueMasters.related',
      hasChild: true,
      iconClass: 'pw-i-64 pw-company-icon-64',
      elementName: 'Master Home - Company Related Menu',
      child: [
        {
          elementName: 'Company Related - Bank Priority Master SubMenu',
          titleTranslationKey: 'pw.boutiqueMasters.bankPriority',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: getBankPriorityMasterRouteUrl()
        }
      ]
    },
    {
      menuKey: MasterMenuKeyEnum.LOV_MENU_KEY,
      titleTranslationKey: 'pw.inventoryMasters.listOfValue',
      subTitleTranslationKey: 'pw.inventoryMasters.related',
      hasChild: false,
      iconClass: 'pw-i-64 pw-lov-icon-64',
      elementName: 'Master Home - LOV Related Menu',
      path: getLOVMasterDashboardRouteUrl()
    }
  ];

  subMenu: CardSubMenu[] = [];

  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
}
