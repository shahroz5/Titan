import { ScrollService } from '@poss-web/shared/util-common';
import {
  AppTypesEnum,
  CardMenu,
  CardSubMenu,
  ConfigurationsMenuKeyEnum
} from '@poss-web/shared/models';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import {
  getGlobalConfigRouteUrl,
  getL3InventoryConfigRouteUrl,
  getConversionConfigurationRouteUrl,
  getCashPaymentConfigurationRouteUrl,
  getAccessMappingConfigurationRouteUrl,
  getEncircleProdcutGroupMappingRouteUrl,
  getPayerBankConfigurationRouteUrl,
  getCPGProductGroupConfigForQCGCRouteUrl,
  getStateTaxConfigurationRouteUrl,
  getCustomerTransactionConfigUrl,
  getAirpayHostConfigurationRouteUrl,
  getPasswordConfigRouteUrl,
  getGepPurityConfigurationRouteUrl,
  getAirpayConfigurationRouteUrl,
  getGVStatusUpdateRouteUrl,
  getIBTConfigListRouteUrl,
  getWeightToleranceListRouteUrl,
  getPaymentConfigListRouteUrl,
  getCashBackOfferConfigListRouteUrl,
  getGLBoutiqueLocatonConfigRouteUrl,
  getGSTMappingUrl,
  getGLLocatonPaymentConfigRouteUrl,
  getWeightValueConfigListRouteUrl,
  getFocConfigurationListRouteUrl,
  getDiscountConfigListRouteUrl,
  getFOCBLLRouteUrl,
  getFOCBCLRouteUrl,
  getResidualWeightToleranceConfigRouteUrl,
  getOrderPaymentConfigListRouteUrl,
  getClubbingDiscountConfigRouteUrl,
  getCreditNoteMasterListRouteUrl,
  getCreditNoteValidationListRouteUrl,
  getGrnInterboutiqueConfigRouteUrl,
  getRangeConfigRouteUrl,
  getCreditNotePriorityListRouteUrl,
  getAdavanceBookingToleranceConfigListRouteUrl,
  getGrnApprovalConfigListRouteUrl,
  getTEPExceptionConfigurationRouteUrl,
  getTepProductGroupConfigListRouteUrl,
  getPrinterConfigurationRouteUrl,
  getGRNWeightValueConfigListRouteUrl,
  getMaxFlatTepConfigurationRouteUrl,
  getBgrConfigListRouteUrl,
  getBgrToleranceConfigListRouteUrl,
  getTEPValidationConfigurationRouteUrl,
  getCutPieceConfigurationRouteUrl,
  getTEPStoneConfigurationRouteUrl,
  getFtepApprovalConfigListRouteUrl,
  getRazorpayHostConfigurationRouteUrl,
  getPayeeBankRouteUrl,
  getRazorpayVendorConfigurationRouteUrl,
  getPayerBankMasterRouteUrl,
  getCutPieceTotRouteUrl,
  getRivaahAllowedRouteUrl,
  getDiscountConfigRquestRouteUrl,
  getAmendmentConfigRouteUrl,
  getEmployeeLoanConfigRouteUrl,
  getCustomerOrderPaymentConfigListRouteUrl,
  getCOResidualWeightToleranceConfigRouteUrl,
  getCustomerOrderToleranceConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
@Component({
  selector: 'poss-web-configuration-home',
  templateUrl: './configuration-home.component.html'
})
export class ConfigurationHomeComponent implements OnInit {
  permissions$: Observable<any[]>;

  menu: CardMenu[] = [
    {
      menuKey: ConfigurationsMenuKeyEnum.INVENTORY_CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.configurations.inventory',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'Configurations Home - Inventory Configurations Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.ibtconfiguration',
          hasChild: false,
          elementName: 'Inventory Configurations - IbtConfiguration SubMenu',
          path: getIBTConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.weightTolerance',
          hasChild: false,
          elementName: 'Inventory Configurations - WeightTolerance SubMenu',
          path: getWeightToleranceListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.conversion',
          hasChild: false,
          elementName: 'Inventory Configurations - Conversion SubMenu',
          path: getConversionConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.L3Invoice',
          hasChild: false,
          elementName: 'Inventory Configurations - L3Invoice SubMenu',
          path: getL3InventoryConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.inventoryGlobalConfiguration',
          hasChild: false,
          elementName:
            'Inventory Configurations - InventoryGlobalConfiguration SubMenu',
          path: getGlobalConfigRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.ADVANCE_BOOKING_TRANSACTION_MENU_KEY,
      titleTranslationKey: 'pw.configurations.advanceBooking',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_AdvanceBooking_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.orderPaymentConfigMenu',
          hasChild: false,
          elementName:
            'AdvanceBookingConfigurations_OrderPaymentConfig_SubMenu',
          path: getOrderPaymentConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.residualWeightTolerance',
          hasChild: false,
          elementName:
            'AdvanceBookingConfigurations_ResidualWeightTolerance_SubMenu',
          path: getResidualWeightToleranceConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.advanceBookingToleranceMenu',
          hasChild: false,
          elementName: 'AdvanceBookingConfigurations_AB_Tolerance_SubMenu',
          path: getAdavanceBookingToleranceConfigListRouteUrl('frozen')
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.CUSTOMER_ORDER_MENU_KEY,
      titleTranslationKey: 'pw.configurations.customerOrder',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_CustomerOrder_Menu',
      child: [
        {
          titleTranslationKey:
            'pw.configurations.customerOrderPaymentConfigMenu',
          hasChild: false,
          elementName: 'CustomerOrderConfigurations_OrderPaymentConfig_SubMenu',
          path: getCustomerOrderPaymentConfigListRouteUrl()
        },
        {
          titleTranslationKey:
            'pw.configurations.customerOrderResidualWeightTolerance',
          hasChild: false,
          elementName:
            'CustomerOrderConfigurations_ResidualWeightTolerance_SubMenu',
          path: getCOResidualWeightToleranceConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.customerOrderToleranceMenu',
          hasChild: false,
          elementName: 'CustomerOrderConfigurations_CO_Tolerance_SubMenu',
          path: getCustomerOrderToleranceConfigListRouteUrl('frozen')
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.CREDIT_NOTE_CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.configurations.creditNote',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_CreditNote_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.creditNoteMasterMenu',
          hasChild: false,
          elementName: 'CreditNoteConfigurations_CreditNoteMaster_SubMenu',
          path: getCreditNoteMasterListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.cnPriorityConfigMenu',
          hasChild: false,
          elementName: 'CreditNoteConfigurations_CreditNotePriority_SubMenu',
          path: getCreditNotePriorityListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.creditNoteValidationMenu',
          hasChild: false,
          elementName: 'CreditNoteConfigurations_CreditNoteValidation_SubMenu',
          path: getCreditNoteValidationListRouteUrl()
        },
        {
          titleTranslationKey: 'CREDIT NOTE DIRECT',
          hasChild: false,
          elementName: 'CreditNoteConfigurations_CreditNoteDirect_SubMenu',
          path: '/configuration/credit-note-configuration/credit-note-direct'
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.GRN_CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.configurations.grn',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_GRNConfigurations_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.grnApprovalAccessMenu',
          hasChild: false,
          elementName: 'GRNConfigurations_GRNApprovalAccess_SubMenu',
          path: getGrnApprovalConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.grnInterBoutique',
          hasChild: false,
          elementName: 'GRNConfigurations_GRNInterboutique_SubMenu',
          path: getGrnInterboutiqueConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.grnTolerance',
          hasChild: false,
          elementName: 'GRNConfigurations_GRNWeightValueTolerance_SubMenu',
          path: getGRNWeightValueConfigListRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.BGR_CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.configurations.bestGoldRate',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_BGRConfigurations_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.bgrConfiguration',
          hasChild: false,
          elementName: 'BGRConfigurations_BGRConfiguration_SubMenu',
          path: getBgrConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.bgrTolerance',
          hasChild: false,
          elementName: 'BGRConfigurations_BGRTolerance_SubMenu',
          path: getBgrToleranceConfigListRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY,
      titleTranslationKey: 'pw.configurations.customer',
      subTitleTranslationKey: 'pw.configurations.transactions',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'Configurations Home - Customer Transactions Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.grfTolerance',
          hasChild: false,
          elementName: 'Customer Transactions - GRFTolerance SubMenu',
          path: getWeightValueConfigListRouteUrl()
        },

        {
          titleTranslationKey: 'pw.configurations.unipayAccessMapping',
          hasChild: false,
          elementName: 'Customer Transactions - UnipayAccessMapping SubMenu',
          path: getAccessMappingConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.productGroupMapping',
          hasChild: false,
          elementName: 'Customer Transactions - ProductGroupMapping SubMenu',
          path: getEncircleProdcutGroupMappingRouteUrl()
        },

        {
          titleTranslationKey: 'pw.configurations.cpgProductGroupConfiguration',
          hasChild: false,
          elementName:
            'Customer Transactions - CpgProductGroupConfiguration SubMenu',
          path: getCPGProductGroupConfigForQCGCRouteUrl()
        },
        {
          titleTranslationKey:
            'pw.configurations.customerTransactionConfiguration',
          hasChild: false,
          elementName:
            'Customer Transactions - CustomerTransactionConfiguration SubMenu',
          path: getCustomerTransactionConfigUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.airpayHostConfiguration',
          hasChild: false,
          elementName:
            'Customer Transactions - AirpayHostConfiguration SubMenu',
          path: getAirpayHostConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.gstMappingConfiguration',
          hasChild: false,
          elementName:
            'Customer Transactions - GstMappingConfiguration SubMenu',
          path: getGSTMappingUrl()
        },
        {
          // Temp on hold
          titleTranslationKey: 'pw.configurations.GVStatusUpdate',
          hasChild: false,
          elementName: 'Customer Transactions - GVStatusUpdate SubMenu',
          path: getGVStatusUpdateRouteUrl()
        },
        // {
        //   // Temp on hold
        //   titleTranslationKey: 'pw.configurations.gvRedemption',
        //   hasChild: false,
        //   elementName: 'Customer Transactions - GV Redemption SubMenu',
        //   path: getGVRedemptionConfigurationRouteUrl()
        // },

        {
          titleTranslationKey: 'pw.configurations.ftepApprovalMenu',
          hasChild: false,
          elementName: 'Customer Transactions - FTEP Approval SubMenu',
          path: getFtepApprovalConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.razorpayHostConfiguration',
          hasChild: false,
          elementName:
            'Customer Transactions - RazorpayHostConfiguration SubMenu',
          path: getRazorpayHostConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.razorpayVendorConfiguration',
          hasChild: false,
          elementName:
            'Customer Transactions - RazorpayVendorConfiguration SubMenu',
          path: getRazorpayVendorConfigurationRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.TAX_CONFIGURATIONS_MENU_KEY,
      titleTranslationKey: 'pw.configurations.tax',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'Configurations Home - Tax Configurations Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.stateTaxConfiguration',
          hasChild: false,
          elementName: 'Tax Configurations - StateTaxConfiguration SubMenu',
          path: getStateTaxConfigurationRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.DISCOUNTS,
      titleTranslationKey: 'pw.configurations.discountMenu',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_DiscountConfigurations_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.discountConfigMenu',
          hasChild: false,
          elementName:
            'DiscountConfigurations_DiscountOfferConfiguration_SubMenu',
          path: getDiscountConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.clubbingOfDiscountsSubMenu',
          hasChild: false,
          elementName: 'DiscountConfigurations_ClubbingDiscounts_SubMenu',
          path: getClubbingDiscountConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.rivaahEligibilitySubMenu',
          hasChild: false,
          elementName:
            'DiscountConfigurations_RivaahEligibiltyConfiguration_SubMenu',
          path: getRivaahAllowedRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.discountRequests',
          hasChild: false,
          elementName: 'DiscountConfigurations_discountRequest_SubMenu',
          path: getDiscountConfigRquestRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.FOC,
      titleTranslationKey: 'pw.configurations.foc',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_FocConfigurations_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.focScheme',
          hasChild: false,
          elementName: 'FocConfigurations_FocScheme_SubMenu',
          path: getFocConfigurationListRouteUrl()
        },
        {
          titleTranslationKey:
            'pw.configurations.focBlockingAtLocationTransaction',
          hasChild: false,
          elementName:
            'FocConfigurations_FocBlockingAtLocationTransaction_SubMenu',
          path: getFOCBLLRouteUrl()
        },
        {
          // Temp on hold
          titleTranslationKey:
            'pw.configurations.focBlockingAtCustomerTransaction',
          hasChild: false,
          elementName:
            'FocConfigurations_FocBlockingAtCustomerTransaction_SubMenu',
          path: getFOCBCLRouteUrl()
        }
      ]
    },

    {
      menuKey: ConfigurationsMenuKeyEnum.GEP_CONFIGURATIONS_MENU_KEY,
      titleTranslationKey: 'pw.configurations.gep',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_GepConfigurations_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.gepPurity',
          hasChild: false,
          elementName: 'GepConfigurations_GEP_Purity_SubMenu',
          path: getGepPurityConfigurationRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.TEP_CONFIGURATIONS_MENU_KEY,
      titleTranslationKey: 'pw.configurations.tep',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'ConfigurationsHome_TepConfigurations_Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.tepException',
          hasChild: false,
          elementName: 'TepConfigurations_TepException_SubMenu',
          path: getTEPExceptionConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.tepValidationConfiguration',
          hasChild: false,
          elementName: 'TepConfigurations_TepValidation_SubMenu',
          path: getTEPValidationConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.tepStoneConfiguration',
          hasChild: false,
          elementName: 'TepConfigurations_TepStone_SubMenu',
          path: getTEPStoneConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.maxFlatTep',
          hasChild: false,
          elementName: 'TepConfigurations_MaxFlatTEP_SubMenu',
          path: getMaxFlatTepConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.tepProductGroupConfiguration',
          hasChild: false,
          elementName: 'TepConfigurations_TepProductGroup_SubMenu',
          path: getTepProductGroupConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.cutPieceConfiguration',
          hasChild: false,
          elementName: 'TepConfigurations_CutPieceConfiguration_SubMenu',
          path: getCutPieceConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.cutPieceTOT',
          hasChild: false,
          elementName: 'TepConfigurations_CutPieceTot_SubMenu',
          path: getCutPieceTotRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.GLOBAL_CONFIGURATIONS_MENU_KEY,
      titleTranslationKey: 'pw.configurations.global',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'Configurations Home - Global Configurations Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.airpayIntegration',
          hasChild: false,
          elementName: 'Global Configurations - AirpayIntegration SubMenu',
          path: getAirpayConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.generateBoutiquePassword',
          hasChild: false,
          elementName:
            'Global Configurations - GenerateBoutiquePassword SubMenu',
          path: getPasswordConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.printerConfiguration',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          elementName: 'Global Configurations - Printer Configuration SubMenu',
          path: getPrinterConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.ranges',
          hasChild: false,
          elementName: 'Global Configurations - Ranges Configuration SubMenu',
          path: getRangeConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.amendmentConfiguration',
          hasChild: false,
          elementName:
            'Global Configurations - Amendment Configuration SubMenu',
          path: getAmendmentConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.employeeLoanConfig',
          hasChild: false,
          elementName:
            'Global Configurations - Employee Loan Configuration SubMenu',
          path: getEmployeeLoanConfigRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.PAYMENT_CONFIGURATIONS_MENU_KEY,
      titleTranslationKey: 'pw.configurations.payment',
      subTitleTranslationKey: 'pw.configurations.configurations',
      hasChild: true,
      iconClass: 'pw-i-64 pw-company-icon-64',
      elementName: 'Configurations Home - Payment Configurations Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.cashPayment',
          hasChild: false,
          elementName: 'Payment Configurations - CashPayment SubMenu',
          path: getCashPaymentConfigurationRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.cashBackOffer',
          hasChild: false,
          elementName: 'Payment Configurations - CashBackOffer SubMenu',
          path: getCashBackOfferConfigListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.paymentConfiguration',
          hasChild: false,
          elementName: 'Payment Configurations - PaymentConfiguration SubMenu',
          path: getPaymentConfigListRouteUrl()
        }
      ]
    },
    {
      menuKey: ConfigurationsMenuKeyEnum.BANKING_REVENUE_MENU_KEY,
      titleTranslationKey: 'pw.configurations.banking',
      subTitleTranslationKey: 'pw.configurations.revenue',
      hasChild: true,
      iconClass: 'pw-i-64 pw-company-icon-64',
      elementName: 'Configurations Home - Configuration Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.glBoutiqueLocation',
          hasChild: false,
          elementName: 'Configurations Home - Configuration Menu',
          path: getGLBoutiqueLocatonConfigRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.glLocationPayment',
          hasChild: false,
          elementName: 'Configurations Home - Configuration Menu',
          path: getGLLocatonPaymentConfigRouteUrl()
        },
        {
          elementName: 'Banking and Revenue - PayeeBank SubMenu',
          titleTranslationKey: 'pw.configurations.payeeBank',
          hasChild: false,
          path: getPayeeBankRouteUrl()
        },
        {
          elementName: 'Banking-Revenue - PayerBankMaster SubMenu',
          titleTranslationKey: 'pw.paymentMasters.payerBankMaster',
          hasChild: false,
          path: getPayerBankMasterRouteUrl()
        },
        {
          titleTranslationKey: 'pw.configurations.payerBankConfiguration',
          hasChild: false,
          elementName: 'Banking-Revenue - PayerBankConfiguration SubMenu',
          path: getPayerBankConfigurationRouteUrl()
        }
      ]
    }
  ];

  subMenu: CardSubMenu[] = [
    // {
    //   menuKey: ConfigurationsMenuKeyEnum.OFFER_CONFIGURATIONS_MENU_KEY,
    //   subMenuPath: this.discountsSubMenuPath,
    //   titleTranslationKey: 'pw.configurations.discountMenu',
    //   subMenu: [
    //     {
    //       elementName:
    //         'DiscountConfigurations_DiscountOfferConfiguration_SubMenu',
    //       titleTranslationKey: 'pw.configurations.discountConfigMenu',
    //       path: getDiscountConfigListRouteUrl()
    //     },
    //     {
    //       elementName:
    //         'DiscountConfigurations_ClubbingDiscounts_SubMenu',
    //       titleTranslationKey: 'pw.configurations.clubbingOfDiscountsSubMenu',
    //       path: getClubbingDiscountConfigRouteUrl()
    //     }
    //   ]
    // }
  ];

  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
}
