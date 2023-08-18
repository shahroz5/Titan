/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.datasync.config.service.ConfigLovSyncService;
import com.titan.poss.datasync.config.service.DiscountSyncService;
import com.titan.poss.datasync.config.service.ExchangeConfigDetailsSyncService;
import com.titan.poss.datasync.config.service.ExchangeConfigExcludeMappingSyncService;
import com.titan.poss.datasync.config.service.ExchangeConfigLocationSyncService;
import com.titan.poss.datasync.config.service.ExchangeConfigMasterSyncService;
import com.titan.poss.datasync.config.service.ExchangeConfigProductMappingSyncService;
import com.titan.poss.datasync.config.service.ExchangeConfigStoneSyncService;
import com.titan.poss.datasync.config.service.FocSyncService;
import com.titan.poss.datasync.config.service.RangeMasterSyncService;
import com.titan.poss.datasync.config.service.RivaahProductMappingSyncService;
import com.titan.poss.datasync.config.service.RuleLocationMappingSyncService;
import com.titan.poss.datasync.config.service.RuleMarketMappingSyncService;
import com.titan.poss.datasync.config.service.RuleMasterSyncService;
import com.titan.poss.datasync.config.service.RuleProductMappingSyncService;
import com.titan.poss.datasync.config.service.RuleRangeMappingSyncService;
import com.titan.poss.datasync.integration.service.IntegrationSyncService;
import com.titan.poss.datasync.integration.service.VendorConfigsSyncService;
import com.titan.poss.datasync.inventory.service.BinCodeLocationMappingSyncService;
import com.titan.poss.datasync.inventory.service.BinGroupSyncService;
import com.titan.poss.datasync.inventory.service.BinSyncService;
import com.titan.poss.datasync.inventory.service.InventoryDetailsSyncService;
import com.titan.poss.datasync.location.service.BrandSyncService;
import com.titan.poss.datasync.location.service.CountrySyncService;
import com.titan.poss.datasync.location.service.CurrencySyncService;
import com.titan.poss.datasync.location.service.LocationLovSyncService;
import com.titan.poss.datasync.location.service.LocationPriceGroupMappingSyncService;
import com.titan.poss.datasync.location.service.LocationSyncService;
import com.titan.poss.datasync.location.service.MarketMarkupMappingSyncService;
import com.titan.poss.datasync.location.service.MarketSyncService;
import com.titan.poss.datasync.location.service.MarketUcpPriceMappingSyncService;
import com.titan.poss.datasync.location.service.MetalPriceLocationMappingSyncService;
import com.titan.poss.datasync.location.service.OrganizationSyncService;
import com.titan.poss.datasync.location.service.PincodeSyncService;
import com.titan.poss.datasync.location.service.RegionSyncService;
import com.titan.poss.datasync.location.service.StateSyncService;
import com.titan.poss.datasync.location.service.StateTaxDetailsSyncService;
import com.titan.poss.datasync.location.service.StateTaxMappingSyncService;
import com.titan.poss.datasync.location.service.TaxClassSyncService;
import com.titan.poss.datasync.location.service.TaxConfigsSyncService;
import com.titan.poss.datasync.location.service.TownSyncService;
import com.titan.poss.datasync.payment.service.CashBackCardSyncService;
import com.titan.poss.datasync.payment.service.CashBackOfferDetailsSyncService;
import com.titan.poss.datasync.payment.service.CashbackProductSyncService;
import com.titan.poss.datasync.payment.service.CashbackSyncService;
import com.titan.poss.datasync.payment.service.ConfigSyncService;
import com.titan.poss.datasync.payment.service.CreditNoteMasterSyncService;
import com.titan.poss.datasync.payment.service.PayeeBankLocationSyncService;
import com.titan.poss.datasync.payment.service.PayeeBankSyncService;
import com.titan.poss.datasync.payment.service.PayerBankLocationSyncService;
import com.titan.poss.datasync.payment.service.PayerBankSyncService;
import com.titan.poss.datasync.payment.service.PayerConfigSyncService;
import com.titan.poss.datasync.payment.service.PayerDetailsSyncService;
import com.titan.poss.datasync.payment.service.PaymentCategorySyncService;
import com.titan.poss.datasync.payment.service.PaymentConfigLocationSyncService;
import com.titan.poss.datasync.payment.service.PaymentCustomerSyncService;
import com.titan.poss.datasync.payment.service.PaymentHostnameSyncService;
import com.titan.poss.datasync.payment.service.PaymentLovSyncService;
import com.titan.poss.datasync.payment.service.PaymentProductSyncService;
import com.titan.poss.datasync.payment.service.PaymentSyncService;
import com.titan.poss.datasync.products.service.ComplexityPriceGroupSyncService;
import com.titan.poss.datasync.products.service.ComplexitySyncService;
import com.titan.poss.datasync.products.service.ItemMaterialMappingSyncService;
import com.titan.poss.datasync.products.service.ItemStoneMappingSyncService;
import com.titan.poss.datasync.products.service.ItemSyncService;
import com.titan.poss.datasync.products.service.LotMaterialDetailsSyncService;
import com.titan.poss.datasync.products.service.LotStoneDetailsSyncService;
import com.titan.poss.datasync.products.service.MaterialSyncService;
import com.titan.poss.datasync.products.service.MaterialTypeSyncService;
import com.titan.poss.datasync.products.service.PriceGroupSyncService;
import com.titan.poss.datasync.products.service.PriceSyncService;
import com.titan.poss.datasync.products.service.ProductCategorySyncService;
import com.titan.poss.datasync.products.service.ProductGroupSyncService;
import com.titan.poss.datasync.products.service.ProductLovSyncService;
import com.titan.poss.datasync.products.service.ProductPriceMappingSyncService;
import com.titan.poss.datasync.products.service.PuritySyncService;
import com.titan.poss.datasync.products.service.StoneSyncService;
import com.titan.poss.datasync.products.service.StoneTypeSyncService;
import com.titan.poss.datasync.sales.service.AccountDetailsSyncService;
import com.titan.poss.datasync.sales.service.AdvanceSyncService;
import com.titan.poss.datasync.sales.service.BankDepositSyncService;
import com.titan.poss.datasync.sales.service.BusinessDaySyncService;
import com.titan.poss.datasync.sales.service.CancelSyncService;
import com.titan.poss.datasync.sales.service.CashMemoSyncService;
import com.titan.poss.datasync.sales.service.CnWorkflowSyncService;
import com.titan.poss.datasync.sales.service.CreditNoteEpossSyncService;
import com.titan.poss.datasync.sales.service.CreditNoteSyncService;
import com.titan.poss.datasync.sales.service.CustomerDocumentSyncService;
import com.titan.poss.datasync.sales.service.CustomerPaymentEpossSyncService;
import com.titan.poss.datasync.sales.service.CustomerVisitSyncService;
import com.titan.poss.datasync.sales.service.CutPieceTepSyncService;
import com.titan.poss.datasync.sales.service.DocNumberFailAuditEpossSyncService;
import com.titan.poss.datasync.sales.service.GepAndTepSyncService;
import com.titan.poss.datasync.sales.service.GoodsReturnSyncService;
import com.titan.poss.datasync.sales.service.InvoiceDocsSyncService;
import com.titan.poss.datasync.sales.service.OnlineCustomerSyncService;
import com.titan.poss.datasync.sales.service.OrderConfigDetailsSyncService;
import com.titan.poss.datasync.sales.service.OrderSyncService;
import com.titan.poss.datasync.sales.service.PIFSeriesSyncService;
import com.titan.poss.datasync.sales.service.PaymentRequestSyncService;
import com.titan.poss.datasync.sales.service.SalesDiscountsSyncService;
import com.titan.poss.datasync.sales.service.SalesDocSyncService;
import com.titan.poss.datasync.sales.service.SalesJobSyncService;
import com.titan.poss.datasync.store.service.BankPrioritySyncService;
import com.titan.poss.datasync.store.service.CatchmentSyncService;
import com.titan.poss.datasync.store.service.CustomerTownSyncService;
import com.titan.poss.datasync.store.service.PrinterSyncService;
import com.titan.poss.datasync.user.service.RoleSyncService;
import com.titan.poss.datasync.user.service.SchedularUserSyncService;
import com.titan.poss.datasync.user.service.UserSyncService;
import com.titan.poss.datasync.util.OperationCodesEnum;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SyncFactory {

	@Autowired
	private CountrySyncService countrySyncService;

	@Autowired
	private PayerDetailsSyncService payerDetailsSynService;

	@Autowired
	private CurrencySyncService currencySyncService;

	@Autowired
	private LocationPriceGroupMappingSyncService locationPriceGroupMappingSyncService;

	@Autowired
	private LocationSyncService locationSyncService;

	@Autowired
	private MarketSyncService marketSyncService;

	@Autowired
	private MetalPriceLocationMappingSyncService metalPriceLocationMappingSyncService;

	@Autowired
	private PincodeSyncService pincodeSyncService;

	@Autowired
	private RegionSyncService regionSyncService;

	@Autowired
	private StateSyncService stateSyncService;

	@Autowired
	private StateTaxMappingSyncService stateTaxMappingSyncService;

	@Autowired
	private TaxConfigsSyncService taxConfigsSyncService;

	@Autowired
	private TaxClassSyncService taxClassSyncService;

	@Autowired
	private TownSyncService townSyncService;

	@Autowired
	private OrganizationSyncService organizationSyncService;

	@Autowired
	private BrandSyncService brandSyncService;

	@Autowired
	private ComplexitySyncService complexitySyncService;

	@Autowired
	private ComplexityPriceGroupSyncService complexityPriceGroupSyncService;

	@Autowired
	private ItemSyncService itemSyncService;

	@Autowired
	private ItemStoneMappingSyncService itemStoneSyncService;

	@Autowired
	private ItemMaterialMappingSyncService itemMaterialSyncService;

	@Autowired
	private MaterialTypeSyncService materialTypeSyncService;

	@Autowired
	private MaterialSyncService materialSyncService;

	@Autowired
	private PriceGroupSyncService priceGroupSyncService;

	@Autowired
	private PriceSyncService priceSyncService;

	@Autowired
	private ProductCategorySyncService productCategorySyncService;

	@Autowired
	private ProductGroupSyncService productGroupSyncService;

	@Autowired
	private PuritySyncService puritySyncService;

	@Autowired
	private StoneSyncService stoneSyncService;

	@Autowired
	private StoneTypeSyncService stoneTypeSyncService;

	@Autowired
	private BinGroupSyncService binGroupSyncService;

	@Autowired
	private BinSyncService binSyncService;

	@Autowired
	private BinCodeLocationMappingSyncService binCodeLocationMappingSyncService;

	@Autowired
	private UserSyncService userSyncService;

	@Autowired
	private RoleSyncService roleSyncService;

	@Autowired
	private RuleMasterSyncService ruleMasterSyncService;

	@Autowired
	private RuleLocationMappingSyncService ruleLocationMappingSyncService;

	@Autowired
	private RuleProductMappingSyncService ruleProductMappingSyncService;

	@Autowired
	private PaymentLovSyncService paymentLovSyncService;

	@Autowired
	private PayerBankSyncService payerBankSyncService;

	@Autowired
	private PayeeBankSyncService payeeBankSyncService;

	@Autowired
	private PayerConfigSyncService payerConfigSyncService;

	@Autowired
	private PayerBankLocationSyncService payerBankLocationSyncService;

	@Autowired
	private PayeeBankLocationSyncService payeeBankLocationSyncService;

	@Autowired
	private PaymentSyncService paymentSyncService;

	@Autowired
	private PaymentCategorySyncService paymentCategorySyncService;

	@Autowired
	private PaymentProductSyncService paymentProductSyncService;

	@Autowired
	private ConfigSyncService configSyncService;

	@Autowired
	private PaymentConfigLocationSyncService paymentConfigLocationSyncService;

	@Autowired
	private CashbackSyncService cashbackSyncService;

	@Autowired
	private CashBackOfferDetailsSyncService cashBackOffer;

	@Autowired
	private CashbackProductSyncService cashBackProduct;

	@Autowired
	private BankPrioritySyncService storeSyncService;

	@Autowired
	private CatchmentSyncService cathmentSyncService;

	@Autowired
	private CustomerTownSyncService cstomerTownSyncService;

	@Autowired
	private AdvanceSyncService advSyncService;

	@Autowired
	private CashMemoSyncService csMemoSyncService;

	@Autowired
	private CancelSyncService canclSyncService;

	@Autowired
	private GepAndTepSyncService gpSyncService;

	@Autowired
	private RangeMasterSyncService rangeMasterSyncService;

	@Autowired
	private InventoryDetailsSyncService inventoryDetailsService;

	@Autowired
	private OrderSyncService orderSynService;

	@Autowired
	private BankDepositSyncService bankDepositeSyncService;

	@Autowired
	private PIFSeriesSyncService pifSeries;

	@Autowired
	private ExchangeConfigDetailsSyncService gepConfigDetailsSyncService;

	@Autowired
	private ExchangeConfigMasterSyncService gepConfigMasterSyncService;

	@Autowired
	private ExchangeConfigLocationSyncService gepConfigLocationSyncService;

	@Autowired
	private ExchangeConfigProductMappingSyncService gepProductMappingSyncService;

	@Autowired
	private ExchangeConfigExcludeMappingSyncService gepConfigExcludeMappingSyncService;

	@Autowired
	private OnlineCustomerSyncService customerSynService;

	@Autowired
	private LotMaterialDetailsSyncService lotMaterialDetailsSyncService;

	@Autowired
	private LotStoneDetailsSyncService lotStoneDetailsSyncService;

	@Autowired
	private BusinessDaySyncService businessDaySyncService;

	@Autowired
	private CustomerVisitSyncService customerVisitSynService;

	@Autowired
	private RuleMarketMappingSyncService ruleMarketMappingSyncService;

	@Autowired
	private ExchangeConfigStoneSyncService exchangeConfigStoneSyncService;

	@Autowired
	private PrinterSyncService printerSynService;

	@Autowired
	private StateTaxDetailsSyncService stateTaxDetailsSyncService;

	@Autowired
	private PaymentCustomerSyncService paymentCustomerSyncService;

	@Autowired
	private DiscountSyncService discountSyncService;

	@Autowired
	private FocSyncService focSyncService;

	@Autowired
	private PaymentHostnameSyncService paymentHostnameSyncService;

	@Autowired
	private MarketMarkupMappingSyncService marketMarkupMappingSyncService;

	@Autowired
	private SalesDocSyncService saleDocSyncService;

	@Autowired
	private GoodsReturnSyncService goodReturnSyncService;

	@Autowired
	private ConfigLovSyncService configLovSyncService;

	@Autowired
	private LocationLovSyncService locationLovSyncService;

	@Autowired
	private ProductLovSyncService productLovSyncService;

	@Autowired
	private RuleRangeMappingSyncService ruleRangeMappingSyncService;

	@Autowired
	private AccountDetailsSyncService accountDetailsService;

	@Autowired
	private SchedularUserSyncService schedularSyncService;

	@Autowired
	private IntegrationSyncService integrateSyncService;

	@Autowired
	private SalesJobSyncService jobSyncService;

	@Autowired
	private CustomerDocumentSyncService custDocumentSyncService;

	@Autowired
	private VendorConfigsSyncService vendorConfigsSyncService;

	@Autowired
	private MarketUcpPriceMappingSyncService marketUcpPriceMappingSyncService;

	@Autowired
	private ProductPriceMappingSyncService productPriceMappingSyncService;

	@Autowired
	private CreditNoteEpossSyncService cnEpossSyncServce;

	@Autowired
	private CreditNoteSyncService creditNoteSyncService;

	@Autowired
	private CnWorkflowSyncService cnWorkflowSyncService;

	@Autowired
	private RivaahProductMappingSyncService rivaahProductMappingSyncService;

	@Autowired
	private CutPieceTepSyncService cutPieceTepSyncService;

	@Autowired
	private CreditNoteMasterSyncService creditNoteMasterSyncService;

	@Autowired
	private SalesDiscountsSyncService salesDiscountsSyncService;

	@Autowired
	private CashBackCardSyncService cashBackCardSyncService;

	@Autowired
	private OrderConfigDetailsSyncService orderConfigDetailsSyncService;
	
	@Autowired
	private CustomerPaymentEpossSyncService customerPaymentEpossSyncService;
	
	@Autowired
	private PaymentRequestSyncService paymentRequestSyncService;
	
	@Autowired
	private DocNumberFailAuditEpossSyncService docNumberFailAuditEpossSyncService;
	
	@Autowired
	private InvoiceDocsSyncService invoiceDocsSyncService;
	

	public SyncOperation getSyncOperation(OperationCodesEnum operationCode) {

		switch (operationCode) {

		case COUNTRY:
			return countrySyncService;

		case CURRENCY:
			return currencySyncService;

		case LOCATION_PRICE_GROUP_MAPPING:
			return locationPriceGroupMappingSyncService;

		case LOCATION:
			return locationSyncService;

		case MARKET:
			return marketSyncService;

		case METAL_PRICE_LOCATION_MAPPING:
			return metalPriceLocationMappingSyncService;

		case PINCODE:
			return pincodeSyncService;

		case REGION:
			return regionSyncService;

		case STATE:
			return stateSyncService;

		case STATETAX:
			return stateTaxMappingSyncService;

		case TAXCLASS:
			return taxClassSyncService;

		case TAXCONFIGS:
			return taxConfigsSyncService;

		case TOWN:
			return townSyncService;

		case ORGANIZATION:
			return organizationSyncService;

		case BRAND:
			return brandSyncService;

		case COMPLEXITY:
			return complexitySyncService;

		case ITEM:
			return itemSyncService;

		case MATERIAL_TYPE:
			return materialTypeSyncService;

		case MATERIAL:
			return materialSyncService;

		case PRICE_GROUP:
			return priceGroupSyncService;

		case PRICE:
			return priceSyncService;

		case PRODUCT_CATEGORY:
			return productCategorySyncService;

		case PRODUCT_GROUP:
			return productGroupSyncService;

		case PURITY:
			return puritySyncService;

		case STONE:
			return stoneSyncService;

		case STONE_TYPE:
			return stoneTypeSyncService;

		case COMPLEXITY_PRICEGROUP:
			return complexityPriceGroupSyncService;

		case ITEM_STONE:
			return itemStoneSyncService;

		case ITEM_MATERIAL:
			return itemMaterialSyncService;

		case BINGROUP:
			return binGroupSyncService;

		case BIN:
			return binSyncService;

		case BIN_LOCATION_MAPPING:
			return binCodeLocationMappingSyncService;

		case CHANGEPSWD:
			return userSyncService;

		case VERIFYOTP:
			return userSyncService;

		case CORPUSER:
			return userSyncService;

		case STOREUSER:
			return userSyncService;

		case STORETEMPORARYUSER:
			return userSyncService;

		case ROLE:
			return roleSyncService;

		case RULE:
			return ruleMasterSyncService;

		case RULE_LOC_MAPPING:
			return ruleLocationMappingSyncService;

		case RULE_PGRP_MAPPING:
			return ruleProductMappingSyncService;

		case RIVAAH_PGRP_MAPPING:
			return rivaahProductMappingSyncService;

		case CASHBACK:
			return cashbackSyncService;

		case CASHBACK_PRODUCT:
			return cashBackProduct;

		case CASHBACK_CARD_DETAILS:
			return cashbackSyncService;

		case CASHBACK_OFFER_DETAILS:
			return cashBackOffer;

		case PAYMENT_LOV:
			return paymentLovSyncService;

		case PAYER_BANK:
			return payerBankSyncService;

		case PAYEE_BANK:
			return payeeBankSyncService;

		case PAYER_BANK_CONFIG:
			return payerConfigSyncService;

		case PAYER_BANK_LOCATION:
			return payerBankLocationSyncService;

		case PAYEE_BANK_LOCATION:
			return payeeBankLocationSyncService;

		case PAYMENT:
			return paymentSyncService;

		case PAYMENT_CATEGORY:
			return paymentCategorySyncService;

		case PAYMENT_CATEGORY_PRODUCT:
			return paymentProductSyncService;

		case PAYMENT_CONFIG:
			return configSyncService;

		case PAYMENT_CONFIG_DETAILS:
			return configSyncService;

		case PAYMENT_CONFIG_LOCATION:
			return paymentConfigLocationSyncService;

		case CATCHMENT:
			return cathmentSyncService;

		case CUSTOMER_TOWN:
			return cstomerTownSyncService;

		case PAYER_BANK_PRIORITY_MAPPING:
			return storeSyncService;

		case ADVANCE_CONFIRM:
			return advSyncService;

		case GRF_UPDATE:
			return advSyncService;

		case CASHMEMO:
			return csMemoSyncService;

		case CANCEL_CONFIRM:
			return canclSyncService;

		case GEP_CONFIRM:
			return gpSyncService;

		case TEP_CONFIRM:
			return gpSyncService;

		case RANGE:
			return rangeMasterSyncService;

		case INV:
			return inventoryDetailsService;

		case ORDER:
			return orderSynService;

		case PIF_SERIES_UPDATE:
			return pifSeries;

		case BANK_DEPOSIT:
			return bankDepositeSyncService;

		case EXCHANGE_CONFIG_DETAILS:
			return gepConfigDetailsSyncService;

		case EXCHANGE_CONFIG:
			return gepConfigMasterSyncService;

		case EXCHANGE_CONFIG_LOCATION:
			return gepConfigLocationSyncService;

		case EXCHANGE_CONFIG_PRODUCT:
			return gepProductMappingSyncService;

		case EXCHANGE_CONFIG_THEME:
			return gepConfigExcludeMappingSyncService;

		case EXCHANGE_CONFIG_ITEMS:
			return gepConfigExcludeMappingSyncService;

		case CUSTOMER:
			return customerSynService;

		case PENDING_FOC_CM:
			return csMemoSyncService;

		case LOT_MATERIAL_DETAILS:
			return lotMaterialDetailsSyncService;

		case LOT_STONE_DETAILS:
			return lotStoneDetailsSyncService;

		case BUSINESS_DAY:
			return businessDaySyncService;

		case CUSTOMER_VISIT:
			return customerVisitSynService;

		case RULE_MARKET_MAPPING:
			return ruleMarketMappingSyncService;

		case EXCHANGE_CONFIG_STONE:
			return exchangeConfigStoneSyncService;

		case PRINTER_CONFIGURATION:
			return printerSynService;

		case PAYER_CONFIG_DETAILS_UPDATE:
			return payerDetailsSynService;

		case STATETAXDETAILS:
			return stateTaxDetailsSyncService;

		case PAYMENT_CUSTOMER_MAPPING:
			return paymentCustomerSyncService;

		case DISCOUNT_PUBLISH:
			return discountSyncService;

		case FOC_PUBLISH:
			return focSyncService;

		case MANUAL_FOC:
			return focSyncService;

		case PAYMENT_HOSTNAME_MAPPING:
			return paymentHostnameSyncService;

		case MARKET_MARKUP_MAPPING:
			return marketMarkupMappingSyncService;

		case SALES_DOC:
			return saleDocSyncService;

		case GRN_CONFIRM:
			return goodReturnSyncService;

		case CONFIG_LOV:
			return configLovSyncService;

		case LOCATION_LOV:
			return locationLovSyncService;

		case PRODUCT_LOV:
			return productLovSyncService;

		case RULE_RANGE_MAPPING:
			return ruleRangeMappingSyncService;

		case DISCOUNT_CLUB_MAPPING:
			return discountSyncService;

		case ITEM_GROUP_LEVEL_DISCOUNT:
			return discountSyncService;

		case ACCOUNT_DETAILS:
			return accountDetailsService;

		case SCHEDULAR:
			return schedularSyncService;

		case INVENTORY_JOB:
			return integrateSyncService;

		case JOB:
			return jobSyncService;

		case DEPOSITE_SUMMARY:
			return bankDepositeSyncService;

		case GRF_MERGE:
			return advSyncService;

		case VENDOR_CONFIGS:
			return vendorConfigsSyncService;

		case CREDIT_NOTE:
			return csMemoSyncService;

		case CUSTOMER_DOCUMENT:
			return custDocumentSyncService;

		case MARKET_UCP_PRICE_MAPPING:
			return marketUcpPriceMappingSyncService;

		case PRODUCT_PRICE_MAPPING:
			return productPriceMappingSyncService;

		case CN_EPOSS:
			return cnEpossSyncServce;

		case CN_WORKFLOW:
			return cnWorkflowSyncService;

		case CN_REVERSE:
			return creditNoteSyncService;

		case CUTPIECE_CONFIRM:
			return cutPieceTepSyncService;

		case CREDIT_NOTE_UPDATE:
			return creditNoteMasterSyncService;

		case SALES_DISCOUNT:
			return salesDiscountsSyncService;

		case CASHBACK_CARD:
			return cashBackCardSyncService;

		case SALES_ORDER_CONFIG:
			return orderConfigDetailsSyncService;
	    
		case CUSTOMER_PAYMENT_DETAILS:
			return customerPaymentEpossSyncService;
			
		case PAYMENT_REQUEST:
		    return paymentRequestSyncService;	
		 
		case DOC_NUMBER_FAIL_AUDIT:
			return docNumberFailAuditEpossSyncService;
			
		case SALES_INVOICE_DOCUMENTS:
			return invoiceDocsSyncService;

		default:
			throw new IllegalArgumentException("Invalid class type");
		}

	}

}
