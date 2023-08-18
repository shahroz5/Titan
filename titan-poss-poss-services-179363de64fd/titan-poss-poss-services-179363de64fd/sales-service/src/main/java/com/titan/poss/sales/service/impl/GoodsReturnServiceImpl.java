/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.io.StringReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.config.dto.FocItemDto;
import com.titan.poss.core.discount.dto.DigiGoldTanishqDiscountDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.FocSchemeRequestDto;
import com.titan.poss.core.discount.dto.GhsDiscountVoucherDto;
import com.titan.poss.core.discount.dto.GhsExcludeProductGroupDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.GrnApprovalProcessTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BrandTcsDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceItemDetailsDto;
import com.titan.poss.core.dto.EventGRNDetailsDto;
import com.titan.poss.core.dto.EventGRNDto;
import com.titan.poss.core.dto.EventPaymentDetailsDto;
import com.titan.poss.core.dto.FocSchemeAllDto;
import com.titan.poss.core.dto.FocSchemeDetailsDto;
import com.titan.poss.core.dto.FocSchemeGrnDto;
import com.titan.poss.core.dto.FocSchemeItemMappingDto;
import com.titan.poss.core.dto.FocSchemeItemResponseDto;
import com.titan.poss.core.dto.FocSchemeProductMappingDto;
import com.titan.poss.core.dto.GRNOwnerTypeConfigDto;
import com.titan.poss.core.dto.GrnApprovalAccessConfigDto;
import com.titan.poss.core.dto.GrnApprovalAccessConfigDtoJson;
import com.titan.poss.core.dto.GrnConfig;
import com.titan.poss.core.dto.GrnDetails;
import com.titan.poss.core.dto.GrnItemDetials;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.LegacyCmDetailsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MakingChargeDetailsDto;
import com.titan.poss.core.dto.ManualFocSchemeItemDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.PurchaseItemRequestDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.dto.TaxDetails;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DiscountConfigDetailsDao;
import com.titan.poss.sales.dao.DiscountDetailsDao;
import com.titan.poss.sales.dao.DiscountItemDetailsDao;
import com.titan.poss.sales.dao.DiscountVoucherDao;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.FocDetailsDao;
import com.titan.poss.sales.dao.FocDetailsDaoExt;
import com.titan.poss.sales.dao.FocSchemesDao;
import com.titan.poss.sales.dao.GepConfigDetailsDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.GrnDaoExt;
import com.titan.poss.sales.dao.GrnDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CNLiteDto;
import com.titan.poss.sales.dto.CancelSyncDtoExt;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.CashMemoEntity;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.CustomerEpossSearchDto;
import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.FocDetailsAndSchemeDto;
import com.titan.poss.sales.dto.FocDetailsDtoEntity;
import com.titan.poss.sales.dto.FocSchemeDetailsJsonDto;
import com.titan.poss.sales.dto.GRNDtoSalesTxnItemsBusinessDay;
import com.titan.poss.sales.dto.GRNMultipleDiscountDto;
import com.titan.poss.sales.dto.GhsAccountDiscountDetailsDto;
import com.titan.poss.sales.dto.GrnCnDetails;
import com.titan.poss.sales.dto.GrnDetailsSyncExt;
import com.titan.poss.sales.dto.GrnFocDto;
import com.titan.poss.sales.dto.GrnSyncDtoExt;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.OtherChargeDetailsDto;
import com.titan.poss.sales.dto.ReturnableItemsDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.FocStatusEnum;
import com.titan.poss.sales.dto.constants.GRNCancellationTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnSourceType;
import com.titan.poss.sales.dto.constants.TxnStatusCancelEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.dto.print.GRNItemPrintDto;
import com.titan.poss.sales.dto.print.GRNReturnHeaderInfo;
import com.titan.poss.sales.dto.print.GoodsReturnPrintDto;
import com.titan.poss.sales.dto.request.BaseCancelGRNDto;
import com.titan.poss.sales.dto.request.BaseGrnItemDto;
import com.titan.poss.sales.dto.request.ConfirmGRNDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.FrozenRatesDetails;
import com.titan.poss.sales.dto.request.GRNConfirmAfterApprovalDto;
import com.titan.poss.sales.dto.request.GRNRequestDto;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.response.CancelAdvancePendingDto;
import com.titan.poss.sales.dto.response.CancelGRNResponseDto;
import com.titan.poss.sales.dto.response.CoinOfferDiscountDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.GRNInitateResponseDto;
import com.titan.poss.sales.dto.response.GRNItemDetailsDto;
import com.titan.poss.sales.dto.response.GRNResponseDto;
import com.titan.poss.sales.dto.response.GepPurityDiscountDto;
import com.titan.poss.sales.dto.response.GhsDiscountVoucherDetailDto;
import com.titan.poss.sales.dto.response.GoodsReturnReqAprovedDto;
import com.titan.poss.sales.dto.response.GoodsReturnReqHeaderDto;
import com.titan.poss.sales.dto.response.GrnPriceDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.ItemLotGrnDto;
import com.titan.poss.sales.dto.response.KaratExchangeDiscountDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.ReqApprovalDetailsDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CashMemoDetailsRepository;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepository;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepository;
import com.titan.poss.sales.repository.DiscountDetailsRepository;
import com.titan.poss.sales.repository.DiscountItemDetailsRepository;
import com.titan.poss.sales.repository.DiscountVoucherRepository;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.FocDetailsRepository;
import com.titan.poss.sales.repository.FocSchemesRepository;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GrnDetailsRepositoryExt;
import com.titan.poss.sales.repository.GrnRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.PaymentItemMappingRepository;
import com.titan.poss.sales.repository.PaymentItemMappingRepositoryExt;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CashMemoEpossService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CommonTxnSycnService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.FileService;
import com.titan.poss.sales.service.GoodsReturnService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.InventoryUtilService;
import com.titan.poss.sales.service.LocationService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesInvoiceDocService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.DocNoFailAuditThreadLocal;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("SalesGRNService")
public class GoodsReturnServiceImpl implements GoodsReturnService {

	@Autowired
	IntegrationServiceClient integrationServiceClient;

	@Autowired
	private IntegrationService intgService;

	@Autowired
	private CommonTransactionServiceImpl commonTxnService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private EpossCallServiceImpl legacyCallServiceImpl;

	@Autowired
	private EngineService engineService;

	@Autowired
	private LocationService locationService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	SalesDocService salesDocService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private CashMemoRepository cashMemoRepo;

	@Autowired
	private CashMemoDetailsRepository cashMemoDetailsRepo;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepoExt;

	@Autowired
	private CustomerTxnRepository custTxnRepo;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private PaymentDetailsRepository paymentDetailsRepo;

	@Autowired
	private SalesTxnRepository salesTxnRepo;

	@Autowired
	private GrnDetailsRepositoryExt grnDetailsRepo;

	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Autowired
	private GrnRepositoryExt grnRepo;

	@Autowired
	private FocSchemesRepository focSchemeRepo;

	@Autowired
	private FocDetailsRepository focDetailsRepo;

	@Autowired
	private CancellationRepositoryExt cancelRepo;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private GoodsReturnServiceImpl grnService;

	@Autowired
	private CashMemoEpossService cashMemoEpossService;

	@Autowired
	private InventoryUtilService inventoryUtil;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private CommonCashMemoService cashMemoCommonService;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnRepositoryExt;

	@Autowired
	private FileService fileService;

	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	@Autowired
	private CashMemoRepository cashMemoRepository;

	@Autowired
	CashMemoEpossServiceImpl cashMemoEpossServiceImpl;

	@Autowired
	private CustomerTcsDetailsRepositoryExt customerTcsDetailsRepository;

	@Autowired
	private TepServiceImpl tepServiceImpl;

	@Autowired
	private GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepo;

	@Autowired
	private DiscountConfigDetailsRepository discountConfigDetailsRepository;

	@Autowired
	private DiscountDetailsRepository discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepository discountItemDetailsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private PaymentItemMappingRepositoryExt paymentItemMappingRepository;

	@Autowired
	private PaymentItemMappingRepository paymentItemMappingRepo;

	@Autowired
	private DiscountVoucherRepository discountVoucherRepository;

	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditDaoRepositoryExt;
	
	@Autowired
	private CommonTxnSycnService commonTxnSycnService;
	
	@Autowired
	private SalesInvoiceDocService salesInvoiceDocService;

	@Value("${app.name}")
	private String appName;

	@Autowired
	BusinessDayRepositoryExt businessDayRepository;

	private static final String EPOSS_CM_BASE_URL = "/cash-memos/eposs";
	// same if customer not found
	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	public static final String ERR_SALE_075 = "ERR-SALE-075";
	public static final String NO_CUST_DETAILS_IN_THE_TRANSACTION = "No customer details found in the transaction.";

	public static final String ERR_SALE_076 = "ERR-SALE-076";
	public static final String NO_PAYMENT_FOUND_IN_THE_TRANSACTION = "No payment(s) found in the transaction.";

	public static final String ERR_SALE_134 = "ERR-SALE-134";
	public static final String GRN_NOT_ALLOWED_INTERBTQ_OWNERTYPE_CONFIG = "GRN not allowed due to inter-owner type config";

	public static final String ERR_SALE_129 = "ERR-SALE-129";
	public static final String CUSTOMER_NOT_FOUND = "Customer record not found";

	public static final String ERR_SALE_126 = "ERR-SALE-126";
	public static final String GRN_CONFIG_NOT_THERE = "GRN configuration not there";

	public static final String ERR_SALE_167 = "ERR-SALE-167";
	public static final String CONFIG_NOT_FOUND_FOR_CRITERIA = "Provided role code & approval type is not allowed.";

	private static final String ERR_SALE_098 = "ERR-SALE-098";
	private static final String REQUEST_IS_NOT_APPROVED = "Request is not approved.";

	private static final String ERR_SALE_121 = "ERR-SALE-121";
	private static final String ITEMS_NOT_BELONG_TO_TXN_ID = "Some provided item(s) not belong to this txnId";

	private static final String CREDIT_NOTE_NOT_FOUND = "No credit note found";
	private static final String ERR_SALE_154 = "ERR-SALE-154";

	public static final String LOCAL_GRN_CONFIG = "location GRN Config";

	private static final String INITIATE_GRN = "INITIATE_GRN";
	private static final String CONFIRM_WO_APPROVAL = "CONFIRM_WO_APPROVAL";
	private static final String REQUEST_OR_CONFIRM_APPROVAL = "REQUEST_OR_CONFIRM_APPROVAL";

	private static final String TXN_TYPE = "txnType";
	private static final String LOCATION_CODE = "locationCode";

	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String MOBILE_NO = "mobileNo";
	private static final String EMAIL_ID = "emailId";
	private static final String CUSTOMER_NAME = "customerName";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

//	private static final String ERR_CORE_342 = "ERR-SALE-342";
//	private static final String TEP_DONE = "TEP has already been done for {itemCode}";
//
//	private static final String ERR_CORE_343 = "ERR-SALE-343";
//	private static final String GRN_DONE = "GRN has already been done for {itemCode}";
//	
	private static final String GRN_TEP_DONE = "{itemCode} is returned via GRN or TEP";
	private static final String ERR_CORE_344 = "ERR-CORE-344";

	private void validateTxnAndSubTxnType(String txnType, String subTxnType) {

		commonTxnService.validateTxnAndSubTxnTypeCancel(List.of(TxnTypeCancelEnum.GRN.name()), txnType, subTxnType);
	}

	// =================CONTROLLER METHOD START=================

	@SuppressWarnings("unchecked")
	@Override
	public ListResponse<ItemDetailsResponseDto> listItemsAllowedForReturnByGrnCn(String cnId) {

		CreditNoteDaoExt cn = creditNoteService.getByIdAndLocationCode(cnId, CommonUtil.getStoreCode());
		if (!cn.getCreditNoteType().equals(CNType.GRN.name()))
			throw new ServiceException(CREDIT_NOTE_NOT_FOUND, ERR_SALE_154, "CnType: " + cn.getCreditNoteType());

		if (!CNStatus.OPEN.name().equals(cn.getStatus())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, "Status: " + cn.getStatus(),
					Map.of(SalesConstants.DOC_NO, cn.getDocNo().toString()));
		}

		String txnId = cn.getSalesTxn().getId();
		String txnType = TxnTypeCancelEnum.GRN.name();

		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug("EPOSS APP ?: {}", isEpossApp);

		ListResponse<ItemDetailsResponseDto> items;

		String locationCode = null;
		GrnCnDetails grnCnDetails = null;
		if (!StringUtil.isBlankJsonStr(cn.getGrnDetails())) {

			JsonData jd = MapperUtil.mapObjToClass(cn.getGrnDetails(), JsonData.class);
			if (!StringUtil.isBlankJsonData(jd)) {
				grnCnDetails = MapperUtil.mapObjToClass(jd.getData(), GrnCnDetails.class);
				locationCode = grnCnDetails.getLocationCode();
			}
		}
		// if location code not available in GRN CN
		// old GRN CN
		if (locationCode == null)
			throw new ServiceException("Incorrect data defined in database", "ERR-CORE-036",
					"locationCode of salesTxn in CN's GrnDetails not available");

		if (isEpossApp) {

			items = cashMemoEpossService.listItemsAllowedForReturn(txnId, locationCode, txnType);
		} else {

			Map<String, String> reqParams = Map.of("cmId", txnId, LOCATION_CODE, locationCode, TXN_TYPE, txnType);

			items = epossCallService.callEposs(HttpMethod.GET,
					SalesUtil.SALES_BASE_SERVICE_URL + EPOSS_CM_BASE_URL + "/returable-items", reqParams, null,
					ListResponse.class);
		}
		return items;
	}

	@Override
	@Transactional
	public GRNInitateResponseDto initiateGRNWithValidation(String locationCode, Integer refDocNo, Short refFiscalYear,
			String txnType, String subTxnType) {

		validateTxnAndSubTxnType(txnType, subTxnType);

		if (StringUtils.isBlank(locationCode)) {
			locationCode = CommonUtil.getStoreCode();
		}
		boolean isDiffStore = isDiffStore(locationCode);
		boolean isLegacyCM = false;
		// ****************** LOCATION CONFIG CHECK **********************//
		GrnDetails locationGRNConfig = null;
		if (isDiffStore)
			locationGRNConfig = checkConfigIfInterBtqAllowed();
		// ********************** CONFIG CHECK **************************//

		CashMemoEntities cashMemoEntities = null;

		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug("EPOSS APP ?: {}", isEpossApp);
		if (isEpossApp) {

			log.debug("get cashMemo data from same DB");

			// if EPOSS app, get GRN items at one shot from DB (last parameter)
			cashMemoEntities = cashMemoEpossService.getCashMemoEntityDetails(txnType, locationCode, refDocNo,
					refFiscalYear, isEpossApp, null);
			if (cashMemoEntities != null && cashMemoEntities.getOriginalTxn() != null) {
				if (cashMemoEntities.getOriginalTxn().getCashMemoDetails() != null
						&& !cashMemoEntities.getOriginalTxn().getCashMemoDetails().isEmpty()) {
					isLegacyCM = cashMemoEntities.getOriginalTxn().getCashMemoDetails().get(0).getCashMemoDao()
							.getIsMigrated();
				}
			}
		} else {

			// @formatter:off
			// call EPOSS API to get cash memo details
			Map<String, String> reqParams = Map.of(LOCATION_CODE, locationCode, "refDocNo", String.valueOf(refDocNo),
					"refFiscalYear", String.valueOf(refFiscalYear), TXN_TYPE, txnType);

			// if same btq, get GRN items at one shot from DB (last parameter)
			if (!isDiffStore) {
				cashMemoEntities = cashMemoEpossService.getCashMemoEntityDetails(txnType, locationCode, refDocNo,
						refFiscalYear, Boolean.TRUE,null);
				
				CashMemoEntities epossCashMemoEntities  = epossCallService.callEposs(HttpMethod.GET,
						SalesUtil.SALES_BASE_SERVICE_URL + EPOSS_CM_BASE_URL, reqParams, null, CashMemoEntities.class);
				
				if (epossCashMemoEntities != null && epossCashMemoEntities.getOriginalTxn() != null) {
					
					if(epossCashMemoEntities.getOriginalTxn()!=null && epossCashMemoEntities.getOriginalTxn().getCashMemoDetails()!=null) {
					for(CashMemoDetailsDao epossCMDetails : epossCashMemoEntities.getOriginalTxn().getCashMemoDetails()) {
						if(cashMemoEntities!=null && cashMemoEntities.getOriginalTxn()!=null) {
							if(cashMemoEntities.getOriginalTxn().getCashMemoDetails()!=null) {
						for(CashMemoDetailsDao cmDetails:cashMemoEntities.getOriginalTxn().getCashMemoDetails()) {
							if(epossCMDetails.getItemCode().equals(cmDetails.getItemCode())) {
								cmDetails.setNoOfItemsReturned(epossCMDetails.getNoOfItemsReturned());
								isLegacyCM = cmDetails.getCashMemoDao().getIsMigrated();
							}

						}
							}
						}
					}
					}
					cashMemoDetailsRepo.saveAll(cashMemoEntities.getOriginalTxn().getCashMemoDetails());
				}

			}
			else {
				//log.debug("fetch cash memo entities from Eposs service");
				cashMemoEntities = epossCallService.callEposs(HttpMethod.GET,
						SalesUtil.SALES_BASE_SERVICE_URL + EPOSS_CM_BASE_URL, reqParams, null, CashMemoEntities.class);
				//log.debug("cashMemoEntities received from Legacy db {}", cashMemoEntities);
//				if (cashMemoEntities != null && cashMemoEntities.getOriginalTxn() != null) {
//					cashMemoEntities = cashMemoEpossService.getCashMemoEntityDetails(txnType, locationCode, refDocNo,
//							refFiscalYear, Boolean.TRUE,null);
//					if(cashMemoEntities.getOriginalTxn()!=null && cashMemoEntities.getOriginalTxn().getCashMemoDetails()!=null) {
//					for(CashMemoDetailsDao epossCMDetails : cashMemoEntities.getOriginalTxn().getCashMemoDetails()) {
//						if(cashMemoEntities!=null && cashMemoEntities.getOriginalTxn()!=null) {
//							if(cashMemoEntities.getOriginalTxn().getCashMemoDetails()!=null) {
//						for(CashMemoDetailsDao cmDetails:cashMemoEntities.getOriginalTxn().getCashMemoDetails()) {
//							cmDetails.setNoOfItemsReturned(epossCMDetails.getNoOfItemsReturned());
//							isLegacyCM = cmDetails.getCashMemoDao().getIsMigrated();
//						}
//							}
//						}
//					}
//					
//					}
//					cashMemoDetailsRepo.saveAll(cashMemoEntities.getOriginalTxn().getCashMemoDetails());
//				}
				
				log.info("cashMemoEntities "+MapperUtil.getJsonString(cashMemoEntities));
				
				if (cashMemoEntities != null && cashMemoEntities.getOriginalTxn() != null) {
					if (cashMemoEntities.getOriginalTxn().getCashMemoDetails() != null
							&& !cashMemoEntities.getOriginalTxn().getCashMemoDetails().isEmpty()) {
						isLegacyCM = cashMemoEntities.getOriginalTxn().getCashMemo()
								.getIsMigrated();
						log.info("Empty cashMemoEntities");
						cashMemoDetailsRepo.saveAll(cashMemoEntities.getOriginalTxn().getCashMemoDetails());
					}
				}
			}
			
		}
		if (cashMemoEntities == null || cashMemoEntities.getOriginalTxn() == null || isLegacyCM) {
			log.info("call legacy API to get cashMemoEntities");
			cashMemoEntities = legacyCallServiceImpl.callLegacyCashMemo(locationCode, refDocNo, refFiscalYear,false);
		}
		verifyIfCashMemoAndConfirmed(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao());

		Date purchasedDate = cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getDocDate();

		// ****************** CONFIG CHECK START ******************//

		// TEST TEMP COMMENT
		validateGrnDates(purchasedDate, null, INITIATE_GRN, locationGRNConfig, null);

		Integer grnCustomerId = null;
		SalesTxnDao salesTxn = cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao();
		if (isDiffStore) {

			// validate if inter owner type is allowed
			checkIfInterOwnerTypeAllowed(salesTxn.getLocationCode());

			// ****************** CONFIG CHECK END ******************//

			// assumption both mobileNo, ulpId has not been changed

			// save sales txn related customer data (customerDao, customerUlpDao)
			// save customer location mapping of sales txn, new entry for new location
			CustomerEpossSearchDto customerInvoiceInfo = cashMemoEntities.getCustomer();
			CustomerDao customer = customerInvoiceInfo.getCustomer();
			log.info("CustomerInvoiceInfo "+MapperUtil.getJsonString(customerInvoiceInfo));
			log.info("customer "+MapperUtil.getJsonString(customer));

			// save customer info as it is not EPOSS
			if (!CommonUtil.isEpossApp() && !cashMemoEntities.getOriginalTxn().getCashMemo().getIsMigrated()) {
				customerService.saveCustomerAndUp(customer, customerInvoiceInfo.getCustomerUlp());
				customerService.saveCustomerLocationMapping(salesTxn.getCustomerId(), salesTxn.getLocationCode(),
						customer);
			}

			grnCustomerId = customerService.getLocationMapping(customer, CommonUtil.getStoreCode())
					.getCustomerLocationMappingId().getCustomerId();
			
			log.info("grnCustomerId "+grnCustomerId);

		} else {

			grnCustomerId = cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getCustomerId();
		}
		log.info("IsMigrated"+MapperUtil.getJsonString(cashMemoEntities.getOriginalTxn().getCashMemo().getIsMigrated()));
		if (!cashMemoEntities.getOriginalTxn().getCashMemo().getIsMigrated())
			saveCashMemoEntitiesToDB(cashMemoEntities);

		// if not EPOSS, get POSS returned items also
		// fallback when data sync fails then also it will not allow to return the item
		// again
		if (!CommonUtil.isEpossApp()) {
			List<ReturnableItemsDto> possReturnedItemsData = listReturnedItemIdsForGRN(
					cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getId());
			if (cashMemoEntities.getReturnedItems() == null)
				cashMemoEntities.setReturnedItems(possReturnedItemsData);
			else
				cashMemoEntities.getReturnedItems().addAll(possReturnedItemsData);
		}

	
		validateTepAndGepDone(cashMemoEntities);
		
		return mapToDtoInitateGRN(cashMemoEntities, grnCustomerId);

	}

	private void validateTepAndGepDone(CashMemoEntities cashMemoEntities) {
		List<ReturnableItemsDto> possReturnedItemsData = cashMemoEntities.getReturnedItems();
		List<ReturnableItemsDto> possReturnedItemsDataList = new ArrayList<>();
		List<ReturnableItemsDto> returnedItemsData = new ArrayList<>();
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = goodsExchangeDetailsRepo
				.findAllByCashMemoTxnIdAndStatusIn(cashMemoEntities.getOriginalTxn().getCashMemo().getId(),
						List.of(TransactionStatusEnum.CONFIRMED.name(), TransactionStatusEnum.APPROVAL_PENDING.name()));
		if (goodsExchangeDetailsList != null && !CollectionUtil.isEmpty(goodsExchangeDetailsList)) {
			for(GoodsExchangeDetailsDaoExt record:goodsExchangeDetailsList)
			{
				if (record.getCashMemoDetails() != null && record.getCashMemoDetails().getId() != null) {
					short totalTepQuantity = (short) tepServiceImpl
							.getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(
									record.getCashMemoDetails().getId());
					short totalGrnQuantity = (short) tepServiceImpl
							.getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(record.getCashMemoDetails().getId());
					short totalLegacyReturnQty = (record.getCashMemoDetails().getNoOfItemsReturned() == null) ? 0 : record.getCashMemoDetails().getNoOfItemsReturned();
//					if (record.getCashMemoDetails().getTotalQuantity() - totalTepQuantity >= 0) {
						for (ReturnableItemsDto id : possReturnedItemsData) {
							
							if (id.getCashMemoDetailsId().equals(record.getCashMemoDetails().getId()) 
									&& returnedItemsData.contains(id.getCashMemoDetailsId())) {
								if (record.getCashMemoDetails().getTotalQuantity() - totalTepQuantity >= 0) {
									id.setTotalQuantity(id.getTotalQuantity() + totalTepQuantity);
								}
								if (record.getCashMemoDetails().getTotalQuantity() - totalLegacyReturnQty>= 0) {
									id.setTotalQuantity(id.getTotalQuantity() +totalLegacyReturnQty);
								}
								//id.setTotalQuantity(id.getTotalQuantity() + totalTepQuantity);
							} else {
								ReturnableItemsDto returnableItemsDto = new ReturnableItemsDto();
								returnableItemsDto.setCashMemoDetailsId(record.getCashMemoDetails().getId());
								returnableItemsDto.setTotalQuantity(totalTepQuantity);
								returnedItemsData.add(returnableItemsDto);
							}
						}
						if (CollectionUtils.isEmpty(possReturnedItemsData)) {
							ReturnableItemsDto returnableItemsDto = new ReturnableItemsDto();
							returnableItemsDto.setCashMemoDetailsId(record.getCashMemoDetails().getId());
							returnableItemsDto.setTotalQuantity(totalTepQuantity);
							returnedItemsData.add(returnableItemsDto);
						}
					}
				}
			//}
			
			possReturnedItemsData.addAll(returnedItemsData);
		}

		for(CashMemoDetailsDao cmDetail:cashMemoEntities.getOriginalTxn().getCashMemoDetails()) {
			short totalLegacyReturnQty = (cmDetail.getNoOfItemsReturned() == null) ? 0 : cmDetail.getNoOfItemsReturned();
			if(totalLegacyReturnQty>0) {
				if(possReturnedItemsData!=null && !CollectionUtil.isEmpty(possReturnedItemsData)) {
				for (ReturnableItemsDto id : possReturnedItemsData) {
					if (id.getCashMemoDetailsId().equals(cmDetail.getId()) && returnedItemsData.contains(id.getCashMemoDetailsId()) ) {
						id.setTotalQuantity(id.getTotalQuantity() + totalLegacyReturnQty);
					} else {
						ReturnableItemsDto returnableItemsDto = new ReturnableItemsDto();
						returnableItemsDto.setCashMemoDetailsId(cmDetail.getId());
						returnableItemsDto.setTotalQuantity(totalLegacyReturnQty);
						possReturnedItemsDataList.add(returnableItemsDto);
					}
				}
				}else {
					ReturnableItemsDto returnableItemsDto = new ReturnableItemsDto();
					returnableItemsDto.setCashMemoDetailsId(cmDetail.getId());
					returnableItemsDto.setTotalQuantity(totalLegacyReturnQty);
					possReturnedItemsDataList.add(returnableItemsDto);
				}
			}
		}
		if(possReturnedItemsDataList!=null && !CollectionUtil.isEmpty(possReturnedItemsDataList)) {
			possReturnedItemsData.addAll(possReturnedItemsDataList);
		}
		
		

		if (cashMemoEntities.getReturnedItems() != null)
			cashMemoEntities.setReturnedItems(possReturnedItemsData);

	}

	private void saveCashMemoEntitiesToDB(CashMemoEntities cashMemoEntities) {

		// set FK value
		addFkValueToEntity(cashMemoEntities.getOriginalTxn());

		// persist all entity
		log.trace("salesTxn: {}", cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao());
		SalesTxnDao salesTxn = salesTxnRepo.save(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao());

		cashMemoRepo.save(cashMemoEntities.getOriginalTxn().getCashMemo());
		//log.info("cashMemoEntities : "+MapperUtil.getJsonString(cashMemoEntities));

		cashMemoDetailsRepo.saveAll(cashMemoEntities.getOriginalTxn().getCashMemoDetails());
		
		log.info("cashMemoDetails Saved  ");
		

		paymentDetailsRepo.saveAll(cashMemoEntities.getOriginalTxn().getPaymentDetails());

		custTxnRepo.save(cashMemoEntities.getOriginalTxn().getCustomerTxn());

		focSchemeRepo.saveAll(cashMemoEntities.getOriginalTxn().getFocSchemes());

		if(cashMemoEntities.getOriginalTxn().getPaymentItemMappingDaoDetails()!=null) {
			paymentItemMappingRepo.saveAll(cashMemoEntities.getOriginalTxn().getPaymentItemMappingDaoDetails());
		}

		
		
		
		saveAllFoc(cashMemoEntities.getOriginalTxn(), salesTxn);

		if (cashMemoEntities.getIssueFocTxn() != null) {

			CashMemoEntity issueFocTxn = cashMemoEntities.getIssueFocTxn();

			addFkValueToIssuePendingFocEntity(issueFocTxn);

			salesTxnRepo.save(issueFocTxn.getCashMemo().getSalesTxnDao());
			
			cashMemoRepo.save(issueFocTxn.getCashMemo());

			if (issueFocTxn.getCustomerTxn() != null)
				custTxnRepo.save(cashMemoEntities.getOriginalTxn().getCustomerTxn());

			saveAllFoc(cashMemoEntities.getIssueFocTxn(), issueFocTxn.getCashMemo().getSalesTxnDao());
		}

		if (!CollectionUtil.isEmpty(cashMemoEntities.getOriginalTxn().getDiscountItemDetails())) {
			discountConfigDetailsRepository.saveAll(cashMemoEntities.getOriginalTxn().getDiscountConfigDetails());
			discountDetailsRepository.saveAll(cashMemoEntities.getOriginalTxn().getDiscountDetails());
			discountItemDetailsRepository.saveAll(cashMemoEntities.getOriginalTxn().getDiscountItemDetails());
		}
		log.info("saved CashMemoEntitiesToDB");
	}

	private void saveAllFoc(CashMemoEntity cashMemoEntity, SalesTxnDao salesTxn) {

		if (CollectionUtil.isNotEmpty(cashMemoEntity.getFocDetails())) {

			// @formatter:off
			List<FocDetailsDao> focDetails = cashMemoEntity.getFocDetails().stream().map(focDetailDto -> {
				FocDetailsDao focDetail = (FocDetailsDao) MapperUtil.getDtoMapping(focDetailDto, FocDetailsDao.class);
				focDetail.setSalesTxn(salesTxn);
				focDetail.setFocScheme(new FocSchemesDao(focDetailDto.getFocSchemeId()));
				return focDetail;
			}).collect(Collectors.toList());
			// @formatter:on
			focDetailsRepo.saveAll(focDetails);
		}
	}

	@Override
	public GrnPriceDto calculateFinalPrice(@Valid BaseGrnItemDto grnItemDto, String txnType, String subTxnType) {

		validateTxnAndSubTxnType(txnType, subTxnType);

		List<ReturnableItemsDto> itemIdsToReturn = new ArrayList<>(grnItemDto.getItems());

		String cmId = grnItemDto.getRefTxnId();
		CashMemoDao cashMemo = getByCashMemoIdWithErrorCheck(cmId);
		SalesTxnDao salesTxn = cashMemo.getSalesTxnDao();
		BigDecimal finalValues = BigDecimal.ZERO;
		// get all items of CM
		List<CashMemoDetailsDao> items = cashMemoDetailsRepo.findByCashMemoDaoId(cmId);
		Short totalReturnQuantity = 0;
		// get CM items info for items which are to return
		// @formatter:off
		List<CashMemoDetailsDao> itemsToReturn = new ArrayList<>();
		for (CashMemoDetailsDao cmd : items) {
			for (ReturnableItemsDto id : grnItemDto.getItems()) {
				if (cmd.getId().equalsIgnoreCase(id.getCashMemoDetailsId())) {

					if (!SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {
						itemsToReturn.add(cmd);
						totalReturnQuantity = (short) (totalReturnQuantity + cmd.getTotalQuantity());
					} else {
						ItemDetailsResponseDto itemDetails = getItemDetails(grnItemDto.getRefTxnId(), id);
						itemsToReturn.add(cmd);
						totalReturnQuantity = (short) (totalReturnQuantity + id.getTotalQuantity());

						finalValues = finalValues.add(itemDetails.getFinalValue());

					}
				}
			}
		}
		// @formatter:on

		// items which are allowed to return or returned
		List<ReturnableItemsDto> returnableItemsList = grnItemDto.getItems();
		List<String> returnItems = new ArrayList<String>();
		Set<String> returnItemId = new HashSet<>();
		for (ReturnableItemsDto id : returnableItemsList) {
			returnItemId.add(id.getCashMemoDetailsId());
			returnItems.add(id.getCashMemoDetailsId());
		}

	//	List<ReturnableItemsDto> returnableItems = verifyGrnElligibleItem(cmId, returnItemId);
		
		List<ReturnableItemsDto> returnableItems = listReturnedItemIdsForGRN(salesTxn.getId());

		SalesTxnDaoExt salesTxnExt = (SalesTxnDaoExt) MapperUtil.getDtoMapping(salesTxn, SalesTxnDaoExt.class);

		GrnFocDto grnFocDto = getFocWiseFinalCalculation(salesTxnExt, returnableItems, items, returnItems);
		// FOC wise detail deduction calculation
		BigDecimal focDeductionValue = grnFocDto.getFocDeductionAmt();

		// total sum value of items which are going to be returned
		BigDecimal sumFinalValueOfItemToBeReturned = getFinalAmountFromListDetails(itemsToReturn);
		for (CashMemoDetailsDao cmd : itemsToReturn) {

			if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {
				sumFinalValueOfItemToBeReturned = sumFinalValueOfItemToBeReturned.subtract(cmd.getFinalValue());
						
			}

		}
		sumFinalValueOfItemToBeReturned = sumFinalValueOfItemToBeReturned.add(finalValues);
		BigDecimal finalValue = sumFinalValueOfItemToBeReturned.subtract(focDeductionValue);
		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(finalValue);
		finalValue = finalValue.add(roundingVariance);

		// Start of TCS Credit Note
		AtomicReference<BigDecimal> tcsCNAmt = new AtomicReference<BigDecimal>();
		tcsCNAmt.set(BigDecimal.ZERO);
		AtomicReference<BigDecimal> finalValueRef = new AtomicReference<BigDecimal>();
		finalValueRef.set(finalValue);
		Optional<CashMemoDao> cashMemoDao = cashMemoRepository.findById(salesTxn.getId());
		cashMemoDao.ifPresent(cashmemo -> {
			Optional.ofNullable(cashmemo.getTcsAmount()).ifPresent(tcsAmount -> {
				if (tcsAmount.compareTo(BigDecimal.ZERO) > 0) {
					if (getTcsRefundAmount(cashmemo).compareTo(BigDecimal.ZERO) > 0) {
						if (salesTxn.getTxnSource() != null && salesTxn.getTxnSource().toString().equals("LEGACY")) {
							tcsCNAmt.set(cashmemo.getTcsAmount());
						} else {
							CustomerTcsDetailsDaoExt customerTcsDetailsDao = customerTcsDetailsRepository
									.findBySalesTxnDaoId(salesTxn.getId());
							if (customerTcsDetailsDao != null) {
								BigDecimal netInvoiceAmount = customerTcsDetailsDao.getNetInvoiceAmount();
								BigDecimal tcsCollected = customerTcsDetailsDao.getTcsAmountPaid();

								BigDecimal tcsAmt = BigDecimal.ZERO;
								if (finalValueRef.get().compareTo(netInvoiceAmount) == 0) {
									tcsAmt = tcsCollected;
								} else {
									tcsAmt = finalValueRef.get().divide(netInvoiceAmount, 2, RoundingMode.HALF_UP);
									tcsAmt = tcsAmt.multiply(new BigDecimal(100));
									tcsAmt = tcsCollected.multiply(tcsAmt);
									tcsAmt = tcsAmt.divide(new BigDecimal(100));
									BigDecimal tcsRoundingVariance = commonTransactionService
											.getRoundingVariance(tcsAmt);
									tcsAmt = tcsAmt.add(tcsRoundingVariance);
								}

								tcsCNAmt.set(tcsAmt);
							}

						}

					}
				}
			});
		});
		// End Of TCS Credit Note

		BigDecimal encriclePointValue = BigDecimal.ZERO;
		// adding encircle amount

		if (salesTxnExt.getTxnSource() != null && salesTxnExt.getTxnSource().equals("LEGACY")) {
			List<CashMemoDetailsDaoExt> cashMemoDetails = cashMemoDetailsRepoExt.findByCashMemoDaoId(salesTxn.getId());
			for (CashMemoDetailsDaoExt cashMemoDetailsDaoExt : cashMemoDetails) {
				List<ReturnableItemsDto> returnableItemsDtoList = grnItemDto.getItems();
				for (ReturnableItemsDto returnableItemsDto : returnableItemsDtoList) {
					if (cashMemoDetailsDaoExt.getId().equals(returnableItemsDto.getCashMemoDetailsId())) {
						LegacyCmDetailsDto legacyCMDetails = MapperUtil
								.mapObjToClass(cashMemoDetailsDaoExt.getLegacyCmDetails(), LegacyCmDetailsDto.class);
						if (legacyCMDetails != null && legacyCMDetails.getEncirclePoints() != null) {
							encriclePointValue = encriclePointValue
									.add(new BigDecimal(legacyCMDetails.getEncirclePoints()));
						}
					}
				}
			}
		} else {
			List<PaymentItemMappingDaoExt> paymentItemMappingList = paymentItemMappingRepository
					.getByTxnIdAndLocationCodeAndStatusIn(salesTxn.getId(), salesTxn.getLocationCode(),
							List.of(PaymentStatusEnum.COMPLETED.toString()), null);
			if (!CollectionUtil.isEmpty(paymentItemMappingList)) {

				for (PaymentItemMappingDaoExt paymentItemMappingDaoExt : paymentItemMappingList) {
					if (PaymentCodeEnum.ENCIRCLE.getPaymentcode()
							.equals(paymentItemMappingDaoExt.getPaymentDetailsDao().getPaymentCode())) {
						List<ReturnableItemsDto> returnableItemsDtoList = grnItemDto.getItems();
						for (ReturnableItemsDto returnableItemsDto : returnableItemsDtoList) {
							if (paymentItemMappingDaoExt.getItemId()
									.equals(returnableItemsDto.getCashMemoDetailsId())) {
								encriclePointValue = encriclePointValue.add(paymentItemMappingDaoExt.getAmount());
							}
						}
					}
				}
			}

		}

		return new GrnPriceDto(sumFinalValueOfItemToBeReturned, focDeductionValue, finalValue, totalReturnQuantity,
				encriclePointValue.setScale(0, RoundingMode.DOWN), tcsCNAmt.get());
	}

	@Transactional(value = "chainedTransaction")
	public PublishResponse confirmWithOutApprovalTransactional(ConfirmGRNDto cancelGRNDto, String txnType,
			String subTxnType) {

		// No of items in GRN request should be equal to no fo items in CM
		// In case of Bill Cancellation with Unipay
		if (BooleanUtils.isTrue(cancelGRNDto.getIsVoid())) {
			int noOfitems = cashMemoDetailsRepo.noOfItemsInCM(cancelGRNDto.getRefTxnId());
			if (cancelGRNDto.getItems().size() != noOfitems) {
				throw new ServiceException(SalesConstants.ONLY_FULL_GRN_IS_ALLOWED, SalesConstants.ERR_SALE_446);
			}
		}

		// PENDING if it is a dummy customer & location code is different
		// then do data sync of the customer as it gets created, ORDER 0
		validateTxnAndSubTxnType(txnType, subTxnType);

		GRNCancellationTypeEnum cancelType = GRNCancellationTypeEnum.valueOf(cancelGRNDto.getCancelType());

		// if MFG defect selected, throw error
		mffDefectNotAllowedWoApprovalCheck(cancelType);
		List<ReturnableItemsDto> itemIdsToReturned = new ArrayList<>(cancelGRNDto.getItems());
		List<String> itemIdsToReturn = new ArrayList<>();
		Set<String> returnItemId = new HashSet<>();
		for (ReturnableItemsDto id : itemIdsToReturned) {
			returnItemId.add(id.getCashMemoDetailsId());
			itemIdsToReturn.add(id.getCashMemoDetailsId());
		}

		String processType = CONFIRM_WO_APPROVAL;
		String cmId = cancelGRNDto.getRefTxnId();

		// =================SAME (PART1)=================
		GRNDtoSalesTxnItemsBusinessDay data = validateCashMemoItemsAndConfigBasic(cmId, cancelType, processType,
				returnItemId);

		SalesTxnDao salesTxn = data.getSalesTxn();
		Integer customerId = getCustomerIdBySalesTxn(salesTxn);
		SalesTxnDaoExt salesTxnExt = data.getSalesTxnExt();
		Date businessDay = data.getBusinessDay();
		List<CashMemoDetailsDao> items = data.getItems();
		List<CashMemoDetailsDao> itemsToReturn = data.getItemsToReturn();
		CashMemoDao cashMemo = getByCashMemoIdWithErrorCheck(cmId);

		GrnFocDto grnPriceDeductionAndFocConfig = getFocWiseFinalCalculation(salesTxnExt, data.getReturnableItems(),
				items, itemIdsToReturn);
		BigDecimal focAmtToRecover = grnPriceDeductionAndFocConfig.getFocDeductionAmt();
		Map<String, ReturnableItemsDto> returnItems = new HashMap<>();
		for (ReturnableItemsDto cancel : cancelGRNDto.getItems()) {
			returnItems.put(cancel.getCashMemoDetailsId(), cancel);
		}
//		=================SAME END (PART1)=================
		BigDecimal grnTotalWeight = BigDecimal.ZERO;
		for (CashMemoDetailsDao singleItem : itemsToReturn) {

			if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(singleItem.getProductGroupCode())) {
				// System.out.println("The index is :"+ itemsToReturn.indexOf(singleItem));
				grnTotalWeight = grnTotalWeight.add(singleItem.getTotalWeight()
						.multiply(new BigDecimal(returnItems.get(singleItem.getId()).getTotalQuantity())));
			} else {
				grnTotalWeight = grnTotalWeight.add(singleItem.getTotalWeight());

			}

		}

		BigDecimal sumFinalValueOfItemsToBeReturned = getFinalAmountFromListDetails(itemsToReturn);
		for (CashMemoDetailsDao cmd : itemsToReturn) {
			ItemDetailsResponseDto itemDetails = getItemDetails(cmd.getCashMemoDao().getId(),
					returnItems.get(cmd.getId()));
			if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {
				sumFinalValueOfItemsToBeReturned =sumFinalValueOfItemsToBeReturned
						.subtract(cmd.getFinalValue()).add(itemDetails.getFinalValue());
			}
		}
		BigDecimal finalVal = sumFinalValueOfItemsToBeReturned.subtract(focAmtToRecover);

		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(finalVal);

		BigDecimal sumFinalValueOfAllItem = getFinalAmountFromListDetails(items);
		log.info("sumFinalValueOfItemsToBeReturned-----------------------{}", sumFinalValueOfItemsToBeReturned);
		log.info("sumFinalValueOfAllItem-------------------------{}", sumFinalValueOfAllItem);
		BigDecimal rationOfAmtToBeReturned = getPriceRatio(sumFinalValueOfItemsToBeReturned, sumFinalValueOfAllItem);
		log.info("rationOfAmtToBeReturned-------------------------{}", rationOfAmtToBeReturned);
		CancelGRNResponseDto cancelResponse = new CancelGRNResponseDto();

		TxnStatusCancelEnum txnStatus = TxnStatusCancelEnum.CONFIRMED;
		String remarks = cancelGRNDto.getRemarks();

		CancelDaoExt cancel = createCancelObj(cancelGRNDto, remarks, cancelType, salesTxn, txnStatus, businessDay,
				customerId);

		setQtyWeightValuesInCancels(items, itemsToReturn, finalVal, cancel, cancelGRNDto.getItems());

		GrnCnDetails grnCn = getGrnCn(cancel, itemIdsToReturn, false);

//		=================SAME (PART2)=================
		cancel = cancelRepo.save(cancel);

		List<GrnDetailsDaoExt> grnItems = saveGrnAndItemsEntity(salesTxn, itemsToReturn, cancel, focAmtToRecover,
				cancelGRNDto.getItems());
//		=================SAME END (PART2)=================
		JsonData cnDiscount = itemGhsDiscount(itemsToReturn, returnItems, cancel, salesTxnExt);
		CreditNoteDiscountDetailsDto creditNoteDiscountDetailsDto = null;
		if (cnDiscount != null) {
			creditNoteDiscountDetailsDto = MapperUtil.mapObjToClass(cnDiscount.getData(),
					CreditNoteDiscountDetailsDto.class);
		}

		if (creditNoteDiscountDetailsDto == null || creditNoteDiscountDetailsDto.getGhsAccountDiscount()
				.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name())) {
			cnDiscount = itemDiscount(itemsToReturn, returnItems, cancel, salesTxnExt);
		}
		itemGhsDiscountVoucher(cancelGRNDto, salesTxn);
		updatePayment(cancelResponse, cmId, finalVal, rationOfAmtToBeReturned, salesTxnExt, cancel, grnCn,
				grnPriceDeductionAndFocConfig.getFocCnConfigs(), grnTotalWeight, cnDiscount);
		// update inventory, & GRN detail also will get created/ updated here

		List<InventoryDetailsDao> newInvItems = inventoryItemAddAndUpdateInvId(salesTxnExt, itemsToReturn, cancel,
				grnItems);

		// PENDING create GRN object
		cancelResponse.setId(cancel.getId());
		cancelResponse.setDocNo(cancel.getDocNo());
		GrnDaoExt grn = new GrnDaoExt();
		if (!grnItems.isEmpty()) {
			grn = grnItems.get(0).getGrn();
			grn.setRoundingVariance(roundingVariance);
		}

		CustomerLocationMappingDao clmTxn = customerService.checkIfCustomerExists(cancel.getCustomerId(),
				cancel.getLocationCode());
		List<CreditNoteDaoExt> creditNoteList = creditNoteRepo.findByCancelTxnId(cancel.getId());
		SyncStagingDto syncDto = null;

		// Update CashMemo Pulled Reason for GRN Type
		commonTransactionService.saveSalesTxnForLegacyPulledCM(salesTxnExt, TxnTypeCancelEnum.GRN.name());

		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = grnService.syncStagging(grn, grnItems, cancel, creditNoteList, newInvItems, clmTxn, null,
					SalesOperationCode.GRN_CONFIRM);
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(cancelResponse);

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		if (locationCacheDto != null && locationCacheDto.getStoreDetails().getIsDial()) {
			List<PaymentDetailsDao> paymentList = paymentDetailsRepo
					.getBySalesTxnDaoIdAndStatus(cancelGRNDto.getRefTxnId(), PaymentStatusEnum.COMPLETED.name());
			dialIntegration(cancelGRNDto.getRefTxnId(), grnItems, paymentList, salesTxnExt);
		}
		eInvoiceCheck(salesTxn, cancel, grnItems);
		if (cashMemo.getIsMigrated()) {
			updateLegacyGrnItems(salesTxn, grnItems);
		}
		return response;
	}

	private void itemGhsDiscountVoucher(ConfirmGRNDto cancelGRNDto, SalesTxnDao salesTxn) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		if (salesTxn.getDiscountTxnDetails() != null) {
			String data = salesTxn.getDiscountTxnDetails();
			DiscountTransactionDetails discountTransactionDetails = MapperUtil.mapObjToClass(data,
					DiscountTransactionDetails.class);
			if (discountTransactionDetails.getGhsDiscountDetails() != null
					&& discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails() != null) {
				List<GhsDiscountVoucherDto> voucherDetails = discountTransactionDetails.getGhsDiscountDetails()
						.getVoucherDetails();
				for (GhsDiscountVoucherDto ghsDiscountVoucherDto : voucherDetails) {
					DiscountVoucherDao discountVoucherDao = discountVoucherRepository
							.findOneByVoucherNoVoucherTypeLocationCode(ghsDiscountVoucherDto.getVoucherNo(),
									VendorCodeEnum.GHS.name(), locationCacheDto.getLocationCode());
					if (discountVoucherDao != null
							&& discountVoucherDao.getStatus().equals(DiscountSalesStatusEnum.REDEEMED.toString())) {
						discountVoucherDao.setStatus(DiscountSalesStatusEnum.OPEN.toString());
						discountVoucherRepository.saveAll(List.of(discountVoucherDao));
						intgService.updateDiscountVoucher(VendorCodeEnum.GHS.name(),
								ghsDiscountVoucherDto.getVoucherNo().toString(),
								Integer.valueOf(ghsDiscountVoucherDto.getAccountNo()), salesTxn.getDocNo().toString(),
								DiscountSalesStatusEnum.OPEN.toString());
					}
				}
			}
		}
	}

	private GrnCnDetails getGrnCn(CancelDaoExt cancel, List<String> itemIdsToReturn, Boolean isCmGoldRate) {
		GrnCnDetails grnCn = new GrnCnDetails();
		grnCn.setLocationCode(cancel.getLocationCode());
		grnCn.setDocDate(cancel.getDocDate());
		grnCn.setReturningItemIds(itemIdsToReturn);
		grnCn.setIsCMGoldRate(isCmGoldRate);

		return grnCn;
	}

	private JsonData itemGhsDiscount(List<CashMemoDetailsDao> itemsToReturn,
			Map<String, ReturnableItemsDto> returnItems, CancelDaoExt cancel, SalesTxnDaoExt salesTxn) {
		JsonData cnDiscountDetails = null;

		if (salesTxn.getTxnSource() != null
				&& salesTxn.getTxnSource().equalsIgnoreCase(TxnSourceType.LEGACY.toString())) {

			return getLegacyCMGhsDiscount(itemsToReturn, returnItems);
		}

		List<DiscountItemDetailsDao> discountItemDetails = discountItemDetailsRepository
				.findAllByItemIdInAndDiscountDetailDiscountTypeIn(
						itemsToReturn.stream().map(CashMemoDetailsDao::getId).collect(Collectors.toList()),
						List.of(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name(),
								DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()));

		if (CollectionUtil.isEmpty(discountItemDetails)) {
			return cnDiscountDetails;
		}
		Map<String, CashMemoDetailsDao> itemsToReturnMap = itemsToReturn.stream()
				.collect(Collectors.toMap(CashMemoDetailsDao::getId, Function.identity()));
		BigDecimal bonus = BigDecimal.ZERO;
		DiscountDetailsDao ghsBonusDiscountDetail = null;
		DiscountDetailsDao ghsRivaahDiscountDetail = null;
		Map<String, GhsExcludeProductGroupDetailsDto> rivaahDiscountDetails = new HashMap<>();
		// for GHS Bonus and Rivaah Aashirwad discount
		for (DiscountItemDetailsDao itemDiscount : discountItemDetails) {
			GhsExcludeProductGroupDetailsDto basinGhsDetails = MapperUtil.mapObjToClass(
					itemDiscount.getDiscountDetail().getDiscountConfig().getGhsExcludeProductGroupDetails(),
					GhsExcludeProductGroupDetailsDto.class);
			// NOTE: filter only GHS ACCOUNT payment discount
			if (checkGhsBasicDetail(basinGhsDetails)
					&& !PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(basinGhsDetails.getPaymentCode())) {
				continue;
			}
			if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
					.equals(itemDiscount.getDiscountDetail().getDiscountType())) {
				ghsRivaahDiscountDetail = itemDiscount.getDiscountDetail();
				rivaahDiscountDetails.put(basinGhsDetails.getAccountNo(), basinGhsDetails);

			} else if (DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name()
					.equals(itemDiscount.getDiscountDetail().getDiscountType())) {
				if (ghsBonusDiscountDetail == null) {
					ghsBonusDiscountDetail = itemDiscount.getDiscountDetail();
				}
				bonus = getItemBonus(returnItems, itemsToReturnMap, bonus, itemDiscount);
			}
		}

		if (ghsBonusDiscountDetail == null && ghsRivaahDiscountDetail == null) {
			return cnDiscountDetails;
		}

		// if GHS bonus exists and Rivaah GHS discount also exists, then priority is to
		// GHS bonus
		if (ghsBonusDiscountDetail != null) {
			return setGhsDiscountDetails(bonus, ghsBonusDiscountDetail, null);
		}

		return setGhsDiscountDetails(bonus, ghsRivaahDiscountDetail,
				getValidRivaahDiscountToPick(cancel, salesTxn, rivaahDiscountDetails));
	}

	private JsonData getLegacyCMGhsDiscount(List<CashMemoDetailsDao> itemsToReturn,
			Map<String, ReturnableItemsDto> returnItems) {

		JsonData cnGhsDiscountDetails = null;

		GhsAccountDiscountDetailsDto ghsAccountDiscountDetailsDto = new GhsAccountDiscountDetailsDto();
		BigDecimal ghsDiscount = BigDecimal.ZERO;

		for (CashMemoDetailsDao cmDetails : itemsToReturn) {

			JsonReader reader = new JsonReader(new StringReader(cmDetails.getLegacyCmDetails()));
			reader.setLenient(true);
			JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
			log.info("jsonObject : {}", jsonObject);
			if (jsonObject != null && !jsonObject.get("ghsDiscount").isJsonNull()) {
				log.info("jsonObject ghsDiscount: {}", jsonObject.get("ghsDiscount"));
				ghsDiscount = ghsDiscount.add(jsonObject.get("ghsDiscount").getAsBigDecimal());
			}
		}

		DiscountBillLevelRequestDto discountBillLevelRequest = new DiscountBillLevelRequestDto();
		discountBillLevelRequest.setDiscountType(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.toString());
		discountBillLevelRequest.setBusinessDate(businessDayService.getBusinessDay().getBusinessDate());
		DiscountBillLevelResponseDto discountBillLevelResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequest);

		log.info("ghsDiscount: {}", ghsDiscount);

		if (ghsDiscount.compareTo(BigDecimal.ZERO) > 0 && discountBillLevelResponseDto != null) {

			log.info("inside if ghsDiscount: {}", ghsDiscount);

			ghsAccountDiscountDetailsDto.setDiscountValue(ghsDiscount);
			ghsAccountDiscountDetailsDto
					.setDiscountId(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountId());
			ghsAccountDiscountDetailsDto
					.setDiscountType(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountType());
			ghsAccountDiscountDetailsDto
					.setDiscountCode(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountCode());
			ghsAccountDiscountDetailsDto.setDiscountMcPct(BigDecimal.ZERO.intValue());
			ghsAccountDiscountDetailsDto.setDiscountUcpPct(BigDecimal.ZERO.intValue());

		} else {
			log.info("inside else ghsDiscount: {}", ghsDiscount);
			return cnGhsDiscountDetails;
		}

		Map<String, Object> ghsAccountDiscountObj = new HashMap<>();
		ghsAccountDiscountObj.put("ghsAccountDiscount", ghsAccountDiscountDetailsDto);
		log.info("ghsAccountDiscount: {}", ghsAccountDiscountDetailsDto);
		return new JsonData("CN_DISCOUNT_DETAILS", ghsAccountDiscountObj);
	}

	private boolean checkGhsBasicDetail(GhsExcludeProductGroupDetailsDto basinGhsDetails) {
		return basinGhsDetails == null || StringUtils.isEmpty(basinGhsDetails.getSchemeType());
	}

	private BigDecimal getItemBonus(Map<String, ReturnableItemsDto> returnItems,
			Map<String, CashMemoDetailsDao> itemsToReturnMap, BigDecimal bonus, DiscountItemDetailsDao itemDiscount) {
		if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(itemDiscount.getProductGroupCode())
				&& itemsToReturnMap.get(itemDiscount.getItemId()).getTotalQuantity() > 1) {
			BigDecimal totalQty = new BigDecimal(itemsToReturnMap.get(itemDiscount.getItemId()).getTotalQuantity());
			BigDecimal qtyToReturn = new BigDecimal(returnItems.get(itemDiscount.getItemId()).getTotalQuantity());
			bonus = bonus.add((itemDiscount.getDiscountValue().divide(totalQty, DomainConstants.PRICE_SCALE,
					DomainConstants.ROUNDIND_MODE)).multiply(qtyToReturn).setScale(DomainConstants.PRICE_SCALE,
							DomainConstants.ROUNDIND_MODE));
		} else {
			bonus = bonus.add(itemDiscount.getDiscountValue());
		}
		return bonus;
	}

	private JsonData setGhsDiscountDetails(BigDecimal bonus, DiscountDetailsDao discountDetail,
			GhsExcludeProductGroupDetailsDto basinGhsDetails) {
		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountDetail.getDiscountType())
				&& basinGhsDetails == null) {
			// then no discount applied
			return null;
		}
		if (basinGhsDetails == null) {
			basinGhsDetails = MapperUtil.mapObjToClass(
					discountDetail.getDiscountConfig().getGhsExcludeProductGroupDetails(),
					GhsExcludeProductGroupDetailsDto.class);
		}
		if (checkGhsBasicDetail(basinGhsDetails)) {
			return null;
		}

		GhsAccountDiscountDetailsDto ghsAccountDiscountDetailsDto = new GhsAccountDiscountDetailsDto();
		ghsAccountDiscountDetailsDto.setDiscountValue(bonus);
		ghsAccountDiscountDetailsDto.setDiscountId(discountDetail.getDiscountId());
		ghsAccountDiscountDetailsDto.setDiscountCode(discountDetail.getDiscountCode());
		ghsAccountDiscountDetailsDto.setDiscountType(discountDetail.getDiscountType());

		// product group list
		ghsAccountDiscountDetailsDto.setProductGroupCodesRestricted(basinGhsDetails.getGhsExcludeProductGroups());
		ghsAccountDiscountDetailsDto.setDiscountMcPct(basinGhsDetails.getMakingChargeDiscountPercent().intValue());
		ghsAccountDiscountDetailsDto.setDiscountUcpPct(basinGhsDetails.getUcpDiscountPercent().intValue());
		ghsAccountDiscountDetailsDto.setSchemeType(basinGhsDetails.getSchemeType());
		ghsAccountDiscountDetailsDto.setSchemeCode(basinGhsDetails.getSchemeCode());
		Map<String, Object> ghsAccountDiscountObj = new HashMap<>();
		ghsAccountDiscountObj.put("ghsAccountDiscount", ghsAccountDiscountDetailsDto);

		return new JsonData("CN_DISCOUNT_DETAILS", ghsAccountDiscountObj);
	}

	@SuppressWarnings("unchecked")
	private GhsExcludeProductGroupDetailsDto getValidRivaahDiscountToPick(CancelDaoExt cancel, SalesTxnDaoExt salesTxn,
			Map<String, GhsExcludeProductGroupDetailsDto> rivaahDiscountDetails) {
		if (rivaahDiscountDetails.isEmpty())
			return null;

		// NOTE: filter only GHS ACCOUNT payment discount(reason ->One level. If GRN
		// credit note is adjusted in cash memo, GHS bonus will be given one more time.
		// If that cash memo is again cancelled, GHS bonus will not be given. So one
		// level only)
		Map<String, RivaahGhsDiscountDto> txnRivaahDetail = discountUtilService.getDiscountTxnDetails(salesTxn)
				.getRivaahGhsDiscountDetails().getRivaahGhs().stream()
				.filter(rd -> (rd.getPaymentCode() != null
						&& PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(rd.getPaymentCode())))
				.collect(Collectors.toMap(RivaahGhsDiscountDto::getAccountNo, Function.identity()));

		GhsExcludeProductGroupDetailsDto basicGhs = null;
		List<RivaahGhsDiscountDto> returnedRivaahDetails;
		if (CommonUtil.isEpossApp()) {
			log.info("In EPOSS, hence calling the function directly");
			returnedRivaahDetails = cashMemoEpossService.getReturnedRivaahGhsDetails(salesTxn.getId()).getResults();
		} else {
			log.info("In POSS, hence calling the EPOSS to get details");
			returnedRivaahDetails = epossCallService.callEposs(HttpMethod.GET,
					SalesUtil.SALES_BASE_SERVICE_URL + EPOSS_CM_BASE_URL + "/" + salesTxn.getId() + "/discount",
					Map.of(), null, ListResponse.class).getResults();
		}

		// if list size is same, then no more discounts, return rull
		if (!CollectionUtil.isEmpty(returnedRivaahDetails) && returnedRivaahDetails.size() == txnRivaahDetail.size()) {
			return basicGhs;
		}

		if (!CollectionUtil.isEmpty(returnedRivaahDetails)) {
			rivaahDiscountDetails.remove(returnedRivaahDetails.get(0).getAccountNo());
			txnRivaahDetail.remove(returnedRivaahDetails.get(0).getAccountNo());
		}
		// if 2 rivaah details are there, then pick max one
		if (rivaahDiscountDetails.size() > 0) {
			basicGhs = pickMaxRivaahGhs(rivaahDiscountDetails);
			cancel.setCancellationDetails(MapperUtil.getStringFromJson(txnRivaahDetail.get(basicGhs.getAccountNo())));
		}

		return basicGhs;
	}

	private GhsExcludeProductGroupDetailsDto pickMaxRivaahGhs(
			Map<String, GhsExcludeProductGroupDetailsDto> rivaahDiscountDetails) {
		List<GhsExcludeProductGroupDetailsDto> ghsList = rivaahDiscountDetails.values().stream()
				.collect(Collectors.toList());
		if (ghsList.size() == 1) {
			return ghsList.get(0);
		}

		/// if first total is max, then return it
		if ((ghsList.get(0).getMakingChargeDiscountPercent().add(ghsList.get(0).getUcpDiscountPercent())).compareTo(
				ghsList.get(1).getMakingChargeDiscountPercent().add(ghsList.get(1).getUcpDiscountPercent())) > 0) {
			return ghsList.get(0);
		}
		return ghsList.get(1);
	}

	private JsonData itemDiscount(List<CashMemoDetailsDao> itemsToReturn, Map<String, ReturnableItemsDto> returnItems,
			CancelDaoExt cancel, SalesTxnDaoExt salesTxn) {
		JsonData cnDiscountDetails = null;
		List<DiscountItemDetailsDao> discountItemDetails = discountItemDetailsRepository
				.findAllByItemIdInAndDiscountDetailDiscountTypeIn(
						itemsToReturn.stream().map(CashMemoDetailsDao::getId).collect(Collectors.toList()),
						List.of(DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name(), DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name(),
								DiscountTypeEnum.COIN_OFFER_DISCOUNT.name(),
								DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name(),
								DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name(),
								DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name()));
		if (CollectionUtil.isEmpty(discountItemDetails)) {
			return cnDiscountDetails;
		}
		Map<String, CashMemoDetailsDao> itemsToReturnMap = itemsToReturn.stream()
				.collect(Collectors.toMap(CashMemoDetailsDao::getId, Function.identity()));
		// BigDecimal bonus = BigDecimal.ZERO;
		BigDecimal digiBonus = BigDecimal.ZERO;
		BigDecimal systemBonus = BigDecimal.ZERO;
		BigDecimal coinBonus = BigDecimal.ZERO;
		BigDecimal gepBonus = BigDecimal.ZERO;
		BigDecimal karatageBonus = BigDecimal.ZERO;
		BigDecimal ghsBonus = BigDecimal.ZERO;
		DiscountDetailsDao digiGoldDiscountDetail = null;
		DiscountDetailsDao systemDiscountDetail = null;
		DiscountDetailsDao coinOfferDiscount = null;
		DiscountDetailsDao gepPurityDiscount = null;
		DiscountDetailsDao KaratageDiscount = null;
		DiscountDetailsDao ghsBonusDiscount = null;
		List<String> discountTypeList = new ArrayList<String>();
		List<BigDecimal> discountValueList = new ArrayList<BigDecimal>();
		Set<String> discountDetailsIdSet = new HashSet<>();
		for (DiscountItemDetailsDao itemDiscount : discountItemDetails) {
			if (DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name().equals(itemDiscount.getDiscountDetail().getDiscountType())) {
				digiGoldDiscountDetail = itemDiscount.getDiscountDetail();
				digiBonus = getItemBonus(returnItems, itemsToReturnMap, digiBonus, itemDiscount);
				discountValueList.add(itemDiscount.getDiscountValue());
				discountTypeList.add(DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name());
				discountDetailsIdSet.add(digiGoldDiscountDetail.getId());

			} else if (DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name()
					.equals(itemDiscount.getDiscountDetail().getDiscountType())) {

				if (itemDiscount.getDiscountDetail().getRefPayment() == null) {
					systemDiscountDetail = itemDiscount.getDiscountDetail();
					systemBonus = getItemBonus(returnItems, itemsToReturnMap, systemBonus, itemDiscount);
					discountValueList.add(itemDiscount.getDiscountValue());
					discountTypeList.add(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name());
					discountDetailsIdSet.add(systemDiscountDetail.getId());

				}
			} else if (DiscountTypeEnum.COIN_OFFER_DISCOUNT.name()
					.equals(itemDiscount.getDiscountDetail().getDiscountType())) {
				coinOfferDiscount = itemDiscount.getDiscountDetail();
				coinBonus = getItemBonus(returnItems, itemsToReturnMap, coinBonus, itemDiscount);
				discountValueList.add(itemDiscount.getDiscountValue());
				discountTypeList.add(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name());
				discountDetailsIdSet.add(coinOfferDiscount.getId());
			} else if (DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name()
					.equals(itemDiscount.getDiscountDetail().getDiscountType())) {
				KaratageDiscount = itemDiscount.getDiscountDetail();
				karatageBonus = getItemBonus(returnItems, itemsToReturnMap, karatageBonus, itemDiscount);
				discountValueList.add(itemDiscount.getDiscountValue());
				discountTypeList.add(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name());
				discountDetailsIdSet.add(KaratageDiscount.getId());
			} else if (DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name()
					.equals(itemDiscount.getDiscountDetail().getDiscountType())) {
				boolean isGrnDiscount = checkGepPurityForGrnRecovery(
						itemDiscount.getDiscountDetail().getDiscountValueDetails());
				if (!isGrnDiscount) {
					gepPurityDiscount = itemDiscount.getDiscountDetail();
					gepBonus = getItemBonus(returnItems, itemsToReturnMap, gepBonus, itemDiscount);
					discountValueList.add(itemDiscount.getDiscountValue());
					discountTypeList.add(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name());
					discountDetailsIdSet.add(gepPurityDiscount.getId());
				}
			} else if (DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name()
					.equals(itemDiscount.getDiscountDetail().getDiscountType())) {
				if (ghsBonusDiscount == null) {
					ghsBonusDiscount = itemDiscount.getDiscountDetail();
				}
				ghsBonus = getItemBonus(returnItems, itemsToReturnMap, ghsBonus, itemDiscount);
				discountValueList.add(itemDiscount.getDiscountValue());
				discountTypeList.add(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name());
				discountDetailsIdSet.add(ghsBonusDiscount.getId());
			}

//			digiBonus = BigDecimal.ZERO;
//			systemBonus = BigDecimal.ZERO;
//			coinBonus = BigDecimal.ZERO;
//			gepBonus = BigDecimal.ZERO;
//			karatageBonus = BigDecimal.ZERO;
//			ghsBonus = BigDecimal.ZERO;
		}
		if (discountDetailsIdSet.size() == 0) {
			return cnDiscountDetails;
		}
		BigDecimal totalDiscountValue = BigDecimal.ZERO;
		for (BigDecimal bigDecimal : discountValueList) {
			totalDiscountValue = totalDiscountValue.add(bigDecimal);
		}

		DigiGoldTanishqDiscountDto digiGoldDetails = new DigiGoldTanishqDiscountDto();
		// GhsDiscountVoucherResponseDto systemDiscountDetails = new
		// GhsDiscountVoucherResponseDto();
		GhsDiscountVoucherDetailDto systemDiscountDetails = new GhsDiscountVoucherDetailDto();
		CoinOfferDiscountDto coinOfferDiscountDto = new CoinOfferDiscountDto();
		GepPurityDiscountDto gepPurityDiscountDto = new GepPurityDiscountDto();
		KaratExchangeDiscountDto karatExchangeDiscountDto = new KaratExchangeDiscountDto();
		GhsAccountDiscountDetailsDto ghsAccountDiscountDetailsDto = new GhsAccountDiscountDetailsDto();
		digiGoldDetails.setDiscountValue(digiBonus);

		if (ghsBonusDiscount != null) {
			ghsAccountDiscountDetailsDto.setDiscountValue(ghsBonus);
			ghsAccountDiscountDetailsDto.setDiscountId(ghsBonusDiscount.getDiscountId());
			ghsAccountDiscountDetailsDto.setDiscountCode(ghsBonusDiscount.getDiscountCode());
			ghsAccountDiscountDetailsDto.setDiscountType(ghsBonusDiscount.getDiscountType());

			GhsExcludeProductGroupDetailsDto basinGhsDetails = MapperUtil.mapObjToClass(
					ghsBonusDiscount.getDiscountConfig().getGhsExcludeProductGroupDetails(),
					GhsExcludeProductGroupDetailsDto.class);

			if (checkGhsBasicDetail(basinGhsDetails)) {
				return null;
			}
			// product group list
			ghsAccountDiscountDetailsDto.setProductGroupCodesRestricted(basinGhsDetails.getGhsExcludeProductGroups());
			ghsAccountDiscountDetailsDto.setDiscountMcPct(basinGhsDetails.getMakingChargeDiscountPercent().intValue());
			ghsAccountDiscountDetailsDto.setDiscountUcpPct(basinGhsDetails.getUcpDiscountPercent().intValue());
			ghsAccountDiscountDetailsDto.setSchemeType(basinGhsDetails.getSchemeType());
			ghsAccountDiscountDetailsDto.setSchemeCode(basinGhsDetails.getSchemeCode());

		}
		// GhsDiscountVocherDetails
		if (systemDiscountDetail != null) {
			systemDiscountDetails.setDiscountValue(systemBonus);
			systemDiscountDetails.setDiscountCode(systemDiscountDetail.getDiscountCode());
			systemDiscountDetails.setDiscountId(systemDiscountDetail.getDiscountId());
			systemDiscountDetails.setDiscountType(systemDiscountDetail.getDiscountType());
			JsonData discountValueDetails = MapperUtil.mapObjToClass(systemDiscountDetail.getDiscountValueDetails(),
					JsonData.class);
			GhsDiscountVoucherResponseDto ghsDiscountVocherDto = MapperUtil
					.mapObjToClass(discountValueDetails.getData(), GhsDiscountVoucherResponseDto.class);
			systemDiscountDetails.setIsGoldCoinAllowed(ghsDiscountVocherDto.getIsGoldCoinAllowed());
		}

		coinOfferDiscountDto.setDiscountValue(coinBonus);
		List<CoinOfferDiscountDto> coinOfferDiscountDtoList = new ArrayList<CoinOfferDiscountDto>();
		coinOfferDiscountDtoList.add(coinOfferDiscountDto);
		karatExchangeDiscountDto.setOneKTDiscountValue(karatageBonus);
		List<KaratExchangeDiscountDto> karatExchangeDiscountDtoList = new ArrayList<KaratExchangeDiscountDto>();
		karatExchangeDiscountDtoList.add(karatExchangeDiscountDto);
		List<GepPurityDiscountDto> gepPurityDiscountDtoList = new ArrayList<GepPurityDiscountDto>();
		if (gepPurityDiscount != null) {
			gepPurityDiscountDto.setDiscountValue(gepBonus);
			gepPurityDiscountDto.setGepItemPurity(BigDecimal.ZERO);
			gepPurityDiscountDto.setDiscountCode(gepPurityDiscount.getDiscountCode());
			gepPurityDiscountDto.setDiscountId(gepPurityDiscount.getDiscountId());
			gepPurityDiscountDto.setDiscountType(gepPurityDiscount.getDiscountType());
			gepPurityDiscountDto.setGepConfigDetailsId(gepPurityDiscount.getGepConfigDetailsId());
			gepPurityDiscountDtoList.add(gepPurityDiscountDto);
		}
		Map<String, Object> cnDetailsMap = new HashMap<String, Object>();
		for (String discountType : discountTypeList) {
			if (DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name().equals(discountType)) {
				cnDetailsMap.put("digiGoldDiscount", digiGoldDetails);
			} else if (DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name().equals(discountType)) {
				cnDetailsMap.put("systemDiscountDv", systemDiscountDetails);
			} else if (DiscountTypeEnum.COIN_OFFER_DISCOUNT.name().equals(discountType)) {
				cnDetailsMap.put("coinOfferDiscount", coinOfferDiscountDtoList);
			} else if (DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name().equals(discountType)) {
				cnDetailsMap.put("karatageExchangeDiscount", karatExchangeDiscountDtoList);
			} else if (DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name().equals(discountType)) {
				cnDetailsMap.put("gepPurityDiscount", gepPurityDiscountDtoList);
			} else if (DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name().equals(discountType)) {
				cnDetailsMap.put("ghsAccountDiscount", ghsAccountDiscountDetailsDto);
			}
		}

		if (discountDetailsIdSet.size() > 1) {
			GRNMultipleDiscountDto grnMultipleDiscountDto = new GRNMultipleDiscountDto();
			grnMultipleDiscountDto.setDiscountType(DiscountTypeEnum.GRN_MULTIPLE_DISCOUNT.name());
			grnMultipleDiscountDto.setDiscountValue(totalDiscountValue);
			return new JsonData("CN_DISCOUNT_DETAILS", Map.of("grnMultipleDiscount", grnMultipleDiscountDto));
		}

		return new JsonData("CN_DISCOUNT_DETAILS", cnDetailsMap);

	}

	private boolean checkGepPurityForGrnRecovery(String gepDiscountValueDetails) {
		CreditNoteDiscountDetailsDto itemGepDiscount;
		boolean isGrnDiscount = false;
		if (!StringUtil.isBlankJsonStr(gepDiscountValueDetails)) {
			ObjectMapper mapper = MapperUtil.getObjectMapperInstance();
			JsonNode root;
			try {
				root = mapper.readTree(gepDiscountValueDetails);
				JsonNode dataNode = root.path("data").path("discountValueDetails");
				itemGepDiscount = MapperUtil.mapObjToClass(dataNode, CreditNoteDiscountDetailsDto.class);

				if (itemGepDiscount != null && itemGepDiscount.getGepPurityDiscount() != null
						&& !CollectionUtil.isEmpty(itemGepDiscount.getGepPurityDiscount())
						&& itemGepDiscount.getGepPurityDiscount().size() == 1 && BigDecimal.ZERO
								.compareTo(itemGepDiscount.getGepPurityDiscount().get(0).getGepItemPurity()) == 0) {
					isGrnDiscount = true;
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		return isGrnDiscount;
	}

	private void eInvoiceCheck(SalesTxnDao salesTxn, CancelDaoExt cancel, List<GrnDetailsDaoExt> grnItems) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxn.getLocationCode());
		StoreDetails storeDetails = locationCacheDto.getStoreDetails();
		if (BooleanUtils.isTrue(storeDetails.getIsEinvoiceEnabled())
				&& !StringUtils.isEmpty(locationCacheDto.getTaxDetails().getGstRegisterationNo())) {
			CustomerTxnDao customerTxnDao = custTxnRepo.findOneBySalesTxnDaoId(salesTxn.getId());
			SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = salesInvoiceDocumentsRepository
					.findByReferenceIdAndTransactionType(cancel.getId(), EinvoiceTransactionTypeEnum.GRN.name());
			if (salesInvoiceDocumentsDao == null) {
				EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = generateInvoice(customerTxnDao,
						cancel.getId(), salesTxn.getDocNo(), salesTxn.getDocDate(), grnItems, salesTxn.getWeightUnit());
				if (BooleanUtils.isTrue(einvoiceIrnDetailsResponseDto.getStatus())) {
					salesInvoiceDocumentsDao = MapperUtil.mapObjToClass(einvoiceIrnDetailsResponseDto,
							SalesInvoiceDocumentsDao.class);
					salesInvoiceDocumentsDao.setReferenceId(cancel.getId());
					salesInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.GRN.name());
					salesInvoiceDocService.syncDataInvoiceDocs(salesInvoiceDocumentsDao);
				}
			}
		}
	}

	private EinvoiceIrnDetailsResponseDto generateInvoice(CustomerTxnDao customerTxnDao, String transactionId,
			Integer docNo, Date docDate, List<GrnDetailsDaoExt> grnItems, String unit) {
		EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = new EinvoiceIrnDetailsResponseDto();
		if (!StringUtils.isEmpty(customerTxnDao.getInstiTaxNo())) {
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto = commonTxnService.getCustomerDetails(
					customerTxnDao.getInstiTaxNo(), customerTxnDao.getCustomerName(),
					customerTxnDao.getCustomerDetails(), docNo, docDate);
			einvoiceIrnDetailsDto.setTransactionId(transactionId);
			List<EinvoiceItemDetailsDto> einvoiceItemDetailsDto = new ArrayList<>();
			grnItems.forEach(grn -> {
				EinvoiceItemDetailsDto einvoiceItemDetails = new EinvoiceItemDetailsDto();
				einvoiceItemDetails.setSerialNo(grnItems.indexOf(grn) + 1);
				List<String> itemCodes = new ArrayList<>();
				itemCodes.add(grn.getItemCode());
				Map<String, ItemDetailsDto> itemsDetailMap = engineService.listItemDetails(itemCodes);
				ItemDetailsDto itemDetailsDto = itemsDetailMap.get(grn.getItemCode());
				if (itemDetailsDto.getHsnCode() != null)
					einvoiceItemDetails.setHsnCode(itemDetailsDto.getHsnCode());
				einvoiceItemDetails.setQuantity(grn.getTotalQuantity().intValue());
				einvoiceItemDetails.setUnit(unit);
				einvoiceItemDetails
						.setUnitPrice(grn.getFinalValue().divide(BigDecimal.valueOf(grn.getTotalQuantity())));
				einvoiceItemDetailsDto.add(einvoiceItemDetails);
			});
			einvoiceIrnDetailsDto.setEinvoiceItemDetailsDto(einvoiceItemDetailsDto);
			einvoiceIrnDetailsResponseDto = integrationServiceClient.generateIrn(VendorCodeEnum.IRN_ASPTAX.name(),
					EinvoiceTransactionTypeEnum.GRN.name(), einvoiceIrnDetailsDto);
		}
		return einvoiceIrnDetailsResponseDto;
	}

	private Integer getCustomerIdBySalesTxn(SalesTxnDao salesTxn) {

		Integer customerId = null;
		if (salesTxn.getLocationCode().equals(CommonUtil.getStoreCode()))
			customerId = salesTxn.getCustomerId();
		else {

			CustomerLocationMappingDao clmTxn = customerService.checkIfCustomerExists(salesTxn.getCustomerId(),
					salesTxn.getLocationCode());

			CustomerLocationMappingDao clmTxnNewStore = customerService.getLocationMapping(clmTxn.getCustomer(),
					CommonUtil.getStoreCode());
			Assert.notNull(clmTxnNewStore, "Customer data for new location is not available. Again do initiate GRN.");

			customerId = clmTxnNewStore.getCustomerLocationMappingId().getCustomerId();
		}
		return customerId;
	}

	@Transactional
	public PublishResponse requestForApprovalTransactional(GRNRequestDto grnRequestDto, String txnType,
			String subTxnType) {

		// No of items in GRN request should be equal to no fo items in CM
		// In case of Bill Cancellation with Unipay
		if (BooleanUtils.isTrue(grnRequestDto.getIsVoid())) {
			int noOfitems = cashMemoDetailsRepo.noOfItemsInCM(grnRequestDto.getRefTxnId());
			if (grnRequestDto.getItems().size() != noOfitems) {
				throw new ServiceException(SalesConstants.ONLY_FULL_GRN_IS_ALLOWED, SalesConstants.ERR_SALE_446);
			}
		}

		validateTxnAndSubTxnType(txnType, subTxnType);

		// throw error if more than one sending for request
		// moreThanOneItemInApprovalCheck(grnRequestDto);

		GRNCancellationTypeEnum cancelType = GRNCancellationTypeEnum.valueOf(grnRequestDto.getCancelType());

		List<ReturnableItemsDto> itemIdsToReturned = new ArrayList<>(grnRequestDto.getItems());
		List<String> itemIdsToReturn = new ArrayList<String>();
		Set<String> returnItemId = new HashSet<>();
		for (ReturnableItemsDto id : itemIdsToReturned) {
			returnItemId.add(id.getCashMemoDetailsId());
			itemIdsToReturn.add(id.getCashMemoDetailsId());
		}

		String processType = REQUEST_OR_CONFIRM_APPROVAL;
		String cmId = grnRequestDto.getRefTxnId();

//		=================SAME=================
		GRNDtoSalesTxnItemsBusinessDay data = validateCashMemoItemsAndConfigBasic(cmId, cancelType, processType,
				returnItemId);

		SalesTxnDao salesTxn = data.getSalesTxn();
		Integer customerId = getCustomerIdBySalesTxn(salesTxn);
		SalesTxnDaoExt salesTxnExt = data.getSalesTxnExt();
		Date businessDay = data.getBusinessDay();
		List<CashMemoDetailsDao> items = data.getItems();
		List<CashMemoDetailsDao> itemsToReturn = data.getItemsToReturn();

		BigDecimal focAmtToRecover = getFocWiseFinalCalculation(salesTxnExt, data.getReturnableItems(), items,
				itemIdsToReturn).getFocDeductionAmt();

//		=================SAME END=================

		Map<String, ReturnableItemsDto> itemReturned = new HashMap<>();
		for (ReturnableItemsDto item : grnRequestDto.getItems()) {
			itemReturned.put(item.getCashMemoDetailsId(), item);
		}
		BigDecimal sumFinalValueOfItemsToBeReturned = getFinalAmountFromListDetails(itemsToReturn);
		for (CashMemoDetailsDao cmd : itemsToReturn) {

			if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {
				ItemDetailsResponseDto itemDetails = getItemDetails(cmd.getCashMemoDao().getId(),
						itemReturned.get(cmd.getId()));
				sumFinalValueOfItemsToBeReturned = getFinalAmountFromListDetails(itemsToReturn)
						.subtract(cmd.getFinalValue()).add(itemDetails.getFinalValue());
			}
		}
		BigDecimal finalVal = sumFinalValueOfItemsToBeReturned.subtract(focAmtToRecover);

		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(finalVal);

		// approver verification from configuration
		Short noOfDays = (short) CalendarUtils.getDayDiff(salesTxn.getDocDate(), businessDay);
		verifyApproverRoleAndTypeConfig(grnRequestDto, finalVal, noOfDays);

		TxnStatusCancelEnum txnStatus = TxnStatusCancelEnum.PENDING;
		String remarks = null;
		CancelDaoExt cancel = createCancelObj(grnRequestDto, remarks, cancelType, salesTxn, txnStatus, businessDay,
				customerId);
		setQtyWeightValuesInCancels(items, itemsToReturn, finalVal, cancel, grnRequestDto.getItems());
		// check if request is raised already
		List<CancelDaoExt> existingCancelDaoList = cancelRepo.findByRefSalesTxnAndLocationCodeAndStatus(cmId,
				CommonUtil.getLocationCode(), TxnStatusCancelEnum.PENDING.name());

		if (!existingCancelDaoList.isEmpty()) {
			CancelDaoExt existingCancelDao = checkReqStatus(existingCancelDaoList.get(0));

			// if previous request is not rejected, then throw error
			if (!TxnStatusCancelEnum.REJECTED.name().equals(existingCancelDao.getStatus())) {
				throw new ServiceException("GRN Request already raised ", "ERR-SALE-399");
			}
			// else, update previous cancel DAO
			cancelRepo.save(existingCancelDao);
			cancelRepo.flush();
		}
//		=================SAME (PART2)=================
		cancel = cancelRepo.save(cancel);

		List<GrnDetailsDaoExt> grnItems = saveGrnAndItemsEntity(salesTxn, itemsToReturn, cancel, focAmtToRecover,
				grnRequestDto.getItems());
//		=================SAME END (PART2)=================

		if (grnRequestDto.getTempFileIds() != null) {

			String newId;
			for (Map.Entry<String, List<String>> entry : grnRequestDto.getTempFileIds().entrySet()) {
				for (String tempId : entry.getValue()) {
					newId = fileService.updateTempFile(salesTxn.getId(), cancel.getCustomerId(),
							UploadFileDocTypeEnum.GRN.name(), entry.getKey(), tempId);
					log.trace("Updated temp file to permanent one. tempId: {} Id: {}", entry.getValue(), newId);
				}
			}

		}

		log.debug("cancel record to insert: " + cancel);
		// request for approval
		String requestDocNo = createWorkflowProcess(cancel, grnItems, salesTxnExt, grnRequestDto, itemsToReturn);
		cancelRepo.save(cancel);

		GrnDaoExt grn = new GrnDaoExt();
		if (!grnItems.isEmpty()) {
			grn = grnItems.get(0).getGrn();
			grn.setRoundingVariance(roundingVariance);
		}

		CustomerLocationMappingDao clmTxn = customerService.checkIfCustomerExists(cancel.getCustomerId(),
				cancel.getLocationCode());
		List<CustomerDocumentsDao> customerDocList = customerDocRepo
				.findByTxnIdAndLocationCodeAndIsActiveTrue(salesTxn.getId(), CommonUtil.getLocationCode());
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = grnService.syncStagging(grn, grnItems, cancel, null, null, clmTxn, customerDocList,
					SalesOperationCode.GRN_CONFIRM_REQ);
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(new CancelAdvancePendingDto(cancel.getId(), cancel.getDocNo(), requestDocNo));
		return response;
	}

	private CancelDaoExt checkReqStatus(CancelDaoExt cancel) {
		ReqApprovalDetailsDto reqApprovalDetailsDto = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(cancel.getCancellationDetails()), ReqApprovalDetailsDto.class);
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = checkGRNRequestStatus(
				reqApprovalDetailsDto.getProcessId());
		// if status is REJECTED, then update object
		if (WorkflowProcessStatusEnum.REJECTED.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			cancel.setStatus(TxnStatusCancelEnum.REJECTED.name());
		}
		return cancel;
	}

	private WorkflowProcessGetResponseDto checkGRNRequestStatus(String processId) {
		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.GOODS_RETURN.name());
		return epossCallService.callEposs(HttpMethod.GET, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId, reqParams,
				null, WorkflowProcessGetResponseDto.class);
	}

	@Transactional(value = "chainedTransaction")
	public PublishResponse confirmAfterApprovalTransactional(String id,
			GRNConfirmAfterApprovalDto grnConfirmAfterApprovalDto, String txnType, String subTxnType) {

		// check if item is still returnable??

		// PENDING if it is a dummy customer & location code is different
		// then do data sync of the customer as it gets created, ORDER 0

		validateTxnAndSubTxnType(txnType, subTxnType);

		GrnDaoExt grn = getGRNWithErrorCheck(id);
		CancelDaoExt cancel = grn.getCancel();

		if (!cancel.getStatus().equals(TxnStatusCancelEnum.PENDING.name()))
			throw new ServiceException(SalesConstants.PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS,
					SalesConstants.ERR_SALE_053, cancel.getStatus());

		ReqApprovalDetailsDto reqApprovalDetails = MapperUtil.mapObjToClass(cancel.getCancellationDetails(),
				ReqApprovalDetailsDto.class);

		WorkflowProcessGetResponseDto processDetails = epossCallService
				.getProcessDetails(reqApprovalDetails.getProcessId(), WorkflowTypeEnum.GOODS_RETURN);
		JsonData jsonData = MapperUtil.mapObjToClass(processDetails.getApprovedData(), JsonData.class);
		GoodsReturnReqAprovedDto approvalDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				GoodsReturnReqAprovedDto.class);

		WorkflowProcessStatusEnum workflowStatus = WorkflowProcessStatusEnum
				.valueOf(processDetails.getApprovalStatus());
		checkIfNotApproved(cancel, workflowStatus);
		JsonUtils.validateDto(approvalDetails, "ERR-SALE-178", "Invalid workflow approved data");

		SalesTxnDaoExt salesTxn = cancel.getRefSalesTxn();
		CashMemoDao cashMemo = getByCashMemoIdWithErrorCheck(salesTxn.getId());

		String cmId = cashMemo.getId();

		// update cancel DAO
		cancel.setRemarks(grnConfirmAfterApprovalDto.getRemarks());
		cancel.setDocDate(businessDayService.getBusinessDay().getBusinessDate());

		List<GrnDetailsDaoExt> grnItems = grnDetailsRepo.findByGrnId(id);
		List<String> itemIdsToReturn = grnItems.stream().filter(gr -> gr.getCashMemoDetailsId() != null)
				.map(GrnDetailsDaoExt::getCashMemoDetailsId).collect(Collectors.toList());

		List<CashMemoDetailsDao> items = cashMemoDetailsRepo.findByCashMemoDaoId(cmId);
		List<CashMemoDetailsDao> itemsToReturn = items.stream().filter(cmd -> itemIdsToReturn.contains(cmd.getId()))
				.collect(Collectors.toList());

		List<InventoryDetailsDao> newInvItems = inventoryItemAddAndUpdateInvId(salesTxn, itemsToReturn, cancel,
				grnItems);

		// update the status of workflow to CLOSED
		epossCallService.closeWorkflow(reqApprovalDetails.getProcessId(), WorkflowTypeEnum.GOODS_RETURN);
		Map<String, GrnDetailsDaoExt> grnReturnItems = new HashMap<>();
		for (GrnDetailsDaoExt grnItem : grnItems) {
			grnReturnItems.put(grnItem.getCashMemoDetailsId(), grnItem);
		}

		BigDecimal grnTotalWeight = BigDecimal.ZERO;
		for (CashMemoDetailsDao singleItem : itemsToReturn) {

			if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(singleItem.getProductGroupCode())) {
				// System.out.println("The index is :"+ itemsToReturn.indexOf(singleItem));
				grnTotalWeight = grnTotalWeight.add(singleItem.getTotalWeight()
						.multiply(new BigDecimal(grnReturnItems.get(singleItem.getId()).getTotalQuantity())));
			} else {
				grnTotalWeight = grnTotalWeight.add(singleItem.getTotalWeight());
			}

		}

		BigDecimal sumFinalValueOfItemToBeReturned = getFinalAmountFromListDetails(itemsToReturn);
		for (CashMemoDetailsDao cmd : itemsToReturn) {

			if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {

				ReturnableItemsDto returnableItems = new ReturnableItemsDto();
				returnableItems.setCashMemoDetailsId(grnReturnItems.get(cmd.getId()).getCashMemoDetailsId());
				returnableItems.setTotalQuantity(grnReturnItems.get(cmd.getId()).getTotalQuantity());
				ItemDetailsResponseDto itemDetails = getItemDetails(cmd.getCashMemoDao().getId(), returnableItems);
				sumFinalValueOfItemToBeReturned = getFinalAmountFromListDetails(itemsToReturn)
						.subtract(cmd.getFinalValue()).add(itemDetails.getFinalValue());
			}
		}
		BigDecimal sumFinalValueOfAllItem = getFinalAmountFromListDetails(items);
		BigDecimal pctOfAmtToBeReturned = getPriceRatio(sumFinalValueOfItemToBeReturned, sumFinalValueOfAllItem);
		Map<String, ReturnableItemsDto> returnItems = new HashMap<>();
		for (Map.Entry<String, GrnDetailsDaoExt> grnItem : grnReturnItems.entrySet()) {
			returnItems.put(grnItem.getKey(),
					new ReturnableItemsDto(grnItem.getKey(), grnItem.getValue().getTotalQuantity()));
		}
		JsonData cnDiscount = itemGhsDiscount(itemsToReturn, returnItems, cancel, salesTxn);

		CreditNoteDiscountDetailsDto creditNoteDiscountDetailsDto = null;
		if (cnDiscount != null) {
			creditNoteDiscountDetailsDto = MapperUtil.mapObjToClass(cnDiscount.getData(),
					CreditNoteDiscountDetailsDto.class);
		}

		if (creditNoteDiscountDetailsDto == null || creditNoteDiscountDetailsDto.getGhsAccountDiscount()
				.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name())) {
			cnDiscount = itemDiscount(itemsToReturn, returnItems, cancel, salesTxn);
		}

		BigDecimal finalVal = cancel.getTotalValue();
		log.debug("FOC Amount deducted: {}", finalVal.subtract(sumFinalValueOfItemToBeReturned));

		CancelGRNResponseDto cancelResponse = new CancelGRNResponseDto();
		GrnCnDetails grnCn = getGrnCn(cancel, itemIdsToReturn, approvalDetails.getIsCMGoldRate());

		FocSchemeAllDto grnFocSchemeDetails = getFocConfigToStore(salesTxn, items, itemIdsToReturn);

		updatePayment(cancelResponse, cmId, finalVal, pctOfAmtToBeReturned, salesTxn, cancel, grnCn,
				grnFocSchemeDetails, grnTotalWeight, cnDiscount);

		cancel.setStatus(TxnStatusCancelEnum.CONFIRMED.name());
		cancelRepo.save(cancel);

		cancelResponse.setId(cancel.getId());
		cancelResponse.setDocNo(cancel.getDocNo());
		List<CreditNoteDaoExt> creditNoteList = creditNoteRepo.findByCancelTxnId(cancel.getId());
		CustomerLocationMappingDao clmTxn = customerService.checkIfCustomerExists(cancel.getCustomerId(),
				cancel.getLocationCode());

		// Update CashMemo Pulled Reason for GRN Type
		commonTransactionService.saveSalesTxnForLegacyPulledCM(salesTxn, TxnTypeCancelEnum.GRN.name());

		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = grnService.syncStagging(grn, grnItems, cancel, creditNoteList, newInvItems, clmTxn, null,
					SalesOperationCode.GRN_CONFIRM);
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(cancelResponse);
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		if (locationCacheDto != null && locationCacheDto.getStoreDetails().getIsDial()) {
			List<PaymentDetailsDao> paymentList = paymentDetailsRepo.getBySalesTxnDaoIdAndStatus(salesTxn.getId(),
					PaymentStatusEnum.COMPLETED.name());
			dialIntegration(salesTxn.getId(), grnItems, paymentList, salesTxn);
		}
		if (cashMemo.getIsMigrated()) {
			updateLegacyGrnItems(cashMemo.getSalesTxnDao(), grnItems);
		}
		eInvoiceCheckAfterApproval(salesTxn, cancel, grnItems);
		return response;
	}

	private void eInvoiceCheckAfterApproval(SalesTxnDaoExt salesTxn, CancelDaoExt cancel,
			List<GrnDetailsDaoExt> grnItems) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxn.getLocationCode());
		TaxDetails taxDetails = locationCacheDto.getTaxDetails();
		if (BooleanUtils.isTrue(locationCacheDto.getStoreDetails().getIsEinvoiceEnabled())
				&& !StringUtils.isEmpty(taxDetails.getGstRegisterationNo())) {
			CustomerTxnDao customerTxnDao = custTxnRepo.findOneBySalesTxnDaoId(salesTxn.getId());
			SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = salesInvoiceDocumentsRepository
					.findByReferenceIdAndTransactionType(cancel.getId(), EinvoiceTransactionTypeEnum.GRN.name());
			if (salesInvoiceDocumentsDao == null) {
				EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = generateInvoice(customerTxnDao,
						cancel.getId(), salesTxn.getDocNo(), salesTxn.getDocDate(), grnItems, salesTxn.getWeightUnit());
				if (BooleanUtils.isTrue(einvoiceIrnDetailsResponseDto.getStatus())) {
					salesInvoiceDocumentsDao = MapperUtil.mapObjToClass(einvoiceIrnDetailsResponseDto,
							SalesInvoiceDocumentsDao.class);
					salesInvoiceDocumentsDao.setReferenceId(cancel.getId());
					salesInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.GRN.name());
					salesInvoiceDocService.syncDataInvoiceDocs(salesInvoiceDocumentsDao);
				}
			}
		}
	}

	private void dialIntegration(String id, List<GrnDetailsDaoExt> grnItems, List<PaymentDetailsDao> paymentList,
			SalesTxnDaoExt salesTxn) {
		EventGRNDto eventGRNDto = new EventGRNDto();
		List<EventGRNDetailsDto> eventGRNDetailsDtoList = new ArrayList<>();
		List<EventPaymentDetailsDto> eventPaymentDetailsDtoList = new ArrayList<>();
		if (!grnItems.isEmpty()) {
			grnItems.forEach(grnItem -> {
				EventGRNDetailsDto grn = (EventGRNDetailsDto) MapperUtil.getObjectMapping(grnItem,
						new EventGRNDetailsDto());
				Optional<CashMemoDetailsDao> cashMemoDetails = cashMemoDetailsRepo
						.findById(grnItem.getCashMemoDetailsId());
				if (cashMemoDetails.isPresent()) {
					grn.setProductGroupCode(cashMemoDetails.get().getProductGroupCode());
					grn.setTotalDiscount(cashMemoDetails.get().getTotalDiscount());
				}
				eventGRNDetailsDtoList.add(grn);
			});
			if (!paymentList.isEmpty()) {
				paymentList.forEach(payment -> eventPaymentDetailsDtoList.add(
						(EventPaymentDetailsDto) MapperUtil.getObjectMapping(payment, new EventPaymentDetailsDto())));
			}
			CustomerTxnDaoExt customerTxnDaoExt = customerTxnRepositoryExt.findOneBySalesTxnDaoId(salesTxn.getId());
			customerTxnDaoExt
					.setMobileNumber(CryptoUtil.decrypt(customerTxnDaoExt.getMobileNumber(), MOBILE_NO, false));
			customerTxnDaoExt.setEmailId(CryptoUtil.decrypt(customerTxnDaoExt.getEmailId(), EMAIL_ID, false));
			customerTxnDaoExt
					.setCustomerName(CryptoUtil.decrypt(customerTxnDaoExt.getCustomerName(), CUSTOMER_NAME, false));
			customerTxnDaoExt.setCustTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNo(), CUST_TAX_NO, false));
			customerTxnDaoExt
					.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNoOld(), CUST_TAX_NO_OLD, false));
			customerTxnDaoExt.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(), INSTI_TAX_NO, false));
			customerTxnDaoExt.setPassportId(CryptoUtil.decrypt(customerTxnDaoExt.getPassportId(), PASSPORT_ID, false));
			eventGRNDto.setCustomer(commonTxnService.getEventCustomer(customerTxnDaoExt));
			eventGRNDto.setPaymentList(eventPaymentDetailsDtoList);
			eventGRNDto.setEventGRNList(eventGRNDetailsDtoList);
			integrationServiceClient.goodsReturnDetails(VendorCodeEnum.DIAL_MILESTONE.name(), id, Boolean.FALSE,
					eventGRNDto);
		}
	}

	private void checkIfNotApproved(CancelDaoExt cancel, WorkflowProcessStatusEnum workflowStatus) {

		if (workflowStatus != WorkflowProcessStatusEnum.APPROVED) {

			// update cancel object, otherwise if approval rejected,
			// cancel object status will not update due to ServiceException txn roll back
			if (workflowStatus == WorkflowProcessStatusEnum.REJECTED) {
				// Update status column based on workflow status
				grnService.closeCancelDao(cancel, workflowStatus);
			}
			throw new ServiceException(REQUEST_IS_NOT_APPROVED, ERR_SALE_098, workflowStatus);
		}
	}

	@Override
	public GoodsReturnPrintDto getPrintInfo(String txnId) {

		// Getting cancel, GRN header data
		GrnDaoExt grn = getGRNWithErrorCheck(txnId);
		CancelDaoExt cancel = grn.getCancel();
		BigDecimal encriclePointValue = BigDecimal.ZERO;

		// Getting sales txn, cashmemo header data
		SalesTxnDaoExt salesTxn = cancel.getRefSalesTxn();
		CashMemoDao cashMemo = getByCashMemoIdWithErrorCheck(salesTxn.getId());

		GoodsReturnPrintDto grnPrint = new GoodsReturnPrintDto();

		grnPrint.setBusinessDate(cancel.getDocDate());
		grnPrint.setBusinessDateStr(new SimpleDateFormat(CalendarUtils.PRINTABLE_DATE_FORMAT_DD_MM_YYYY)
				.format(grnPrint.getBusinessDate()));

		SalesTxnDaoExt salesTxnExt = (SalesTxnDaoExt) MapperUtil.getDtoMapping(salesTxn, SalesTxnDaoExt.class);
		CashMemoDaoExt cashMemoExt = (CashMemoDaoExt) MapperUtil.getDtoMapping(cashMemo, CashMemoDaoExt.class);
		cashMemoExt.setSalesTxnDao(salesTxnExt);
		grnPrint.setCm(cashMemoCommonService.cashMemoResponse(cashMemoExt));
		List<PaymentItemMappingDaoExt> paymentItemMappingList = paymentItemMappingRepository
				.getByTxnIdAndLocationCodeAndStatusIn(salesTxn.getId(), salesTxn.getLocationCode(),
						List.of(PaymentStatusEnum.COMPLETED.toString()), null);
		// Getting GRN item data
		// items, FOC, loyalty, value info
		List<GrnDetailsDaoExt> grnItems = grnDetailsRepo.findByGrnId(txnId);
		List<String> itemIdsToReturn = grnItems.stream().filter(gr -> gr.getCashMemoDetailsId() != null)
				.map(GrnDetailsDaoExt::getCashMemoDetailsId).collect(Collectors.toList());

		// Getting CM item data
		List<CashMemoDetailsDao> items = cashMemoDetailsRepo.findByCashMemoDaoId(cashMemo.getId());
		List<CashMemoDetailsDao> itemsToReturn = items.stream().filter(cmd -> itemIdsToReturn.contains(cmd.getId()))
				.collect(Collectors.toList());
		Map<String, GrnDetailsDaoExt> grnReturnItems = new HashMap<>();
		for (GrnDetailsDaoExt grnItem : grnItems) {
			grnReturnItems.put(grnItem.getCashMemoDetailsId(), grnItem);
		}

		BigDecimal sumFinalValueOfItemToBeReturned = getFinalAmountFromListDetails(itemsToReturn);
		for (CashMemoDetailsDao cmd : itemsToReturn) {

			ReturnableItemsDto returnableItems = new ReturnableItemsDto();
			returnableItems.setCashMemoDetailsId(grnReturnItems.get(cmd.getId()).getCashMemoDetailsId());
			returnableItems.setTotalQuantity(grnReturnItems.get(cmd.getId()).getTotalQuantity());
			ItemDetailsResponseDto itemDetails = getItemDetails(cmd.getCashMemoDao().getId(), returnableItems);

			sumFinalValueOfItemToBeReturned = getFinalAmountFromListDetails(itemsToReturn).subtract(cmd.getFinalValue())
					.add(itemDetails.getFinalValue());
			if (salesTxnExt.getTxnSource() != null && salesTxnExt.getTxnSource().equals("LEGACY")) {
				List<CashMemoDetailsDaoExt> cashMemoDetails = cashMemoDetailsRepoExt
						.findByCashMemoDaoId(salesTxn.getId());
				for (CashMemoDetailsDaoExt cashMemoDetailsDaoExt : cashMemoDetails) {
					List<ReturnableItemsDto> returnableItemsDtoList = new ArrayList<>();
					cashMemoDetails.stream().forEach(grns -> {
						ReturnableItemsDto returnableItemsDto = new ReturnableItemsDto();
						returnableItemsDto.setCashMemoDetailsId(grns.getId());
						returnableItemsDto.setTotalQuantity(grns.getTotalQuantity());
						returnableItemsDtoList.add(returnableItemsDto);
					});
					for (ReturnableItemsDto returnableItemsDto : returnableItemsDtoList) {
						if (cashMemoDetailsDaoExt.getId().equals(returnableItemsDto.getCashMemoDetailsId())) {
							LegacyCmDetailsDto legacyCMDetails = MapperUtil.mapObjToClass(
									cashMemoDetailsDaoExt.getLegacyCmDetails(), LegacyCmDetailsDto.class);
							if (legacyCMDetails != null) {
								encriclePointValue = encriclePointValue
										.add(new BigDecimal(legacyCMDetails.getEncirclePoints()));
							}
						}
					}
				}
			}

			if (!CollectionUtil.isEmpty(paymentItemMappingList)) {
				for (PaymentItemMappingDaoExt paymentItemMappingDaoExt : paymentItemMappingList) {
					if (PaymentCodeEnum.ENCIRCLE.getPaymentcode()
							.equals(paymentItemMappingDaoExt.getPaymentDetailsDao().getPaymentCode()))
						if (paymentItemMappingDaoExt.getItemId().equals(returnableItems.getCashMemoDetailsId())) {
							encriclePointValue = encriclePointValue.add(paymentItemMappingDaoExt.getAmount());
						}
				}
			}

		}
		// Getting CN data
		List<CreditNoteDaoExt> creditNoteList = creditNoteRepo.findByCancelTxnId(cancel.getId());

		BigDecimal cnAmt = BigDecimal.ZERO;

		cnAmt = setCNValueInPrint(grnPrint, creditNoteList, cnAmt);

		BigDecimal grnValue = cancel.getTotalValue();
		BigDecimal focRecovered = sumFinalValueOfItemToBeReturned.subtract(grnValue);
		// BigDecimal loyaltyReversed = grnValue.subtract(cnAmt);

		GRNReturnHeaderInfo refund = (GRNReturnHeaderInfo) MapperUtil.getDtoMapping(cancel, GRNReturnHeaderInfo.class);
		refund.setTotalValue(sumFinalValueOfItemToBeReturned);
		sumFinalValueOfItemToBeReturned = sumFinalValueOfItemToBeReturned.setScale(0, RoundingMode.HALF_UP);
		grnValue = grnValue.setScale(0, RoundingMode.HALF_UP);
		// sumFinalValueOfItemToBeReturned =
		// Math.round(sumFinalValueOfItemToBeReturned);
		refund.setGrnValue(sumFinalValueOfItemToBeReturned);
		refund.setFocRecoveredAmt(focRecovered);
		refund.setGrnValue(cnAmt);
		refund.setLoyaltyReversed(encriclePointValue);
		grnPrint.setRefund(refund);

		List<String> itemCodes = itemsToReturn.stream().map(CashMemoDetailsDao::getItemCode)
				.collect(Collectors.toList());
		Map<String, ItemDetailsDto> itemsDetailMap = engineService.listItemDetails(itemCodes);

		List<GRNItemPrintDto> itemsPrint = new ArrayList<>();

		BigDecimal totalValue = BigDecimal.ZERO;
		if (!itemsToReturn.isEmpty()) {
			for (CashMemoDetailsDao cmItem : itemsToReturn) {
				setCmItemsIteratively(itemsDetailMap, itemsPrint, cmItem);
				totalValue = totalValue.add(cmItem.getFinalValue());
			}
		}
		refund.setTotalValue(totalValue.setScale(0, RoundingMode.HALF_UP));
		if (cashMemoExt.getTcsAmount() != null) {
			refund.setTcsValue(cashMemoExt.getTcsAmount());
		} else {
			refund.setTcsValue(null);
		}

		grnValue = cancel.getTotalValue();
		focRecovered = totalValue.subtract(grnValue);

		BigDecimal tcsAmount = BigDecimal.ZERO;
		tcsAmount = cnAmt.subtract(grnValue);
		if (tcsAmount.compareTo(BigDecimal.ZERO) > 0) {
			refund.setTcsValue(tcsAmount.setScale(0, RoundingMode.HALF_UP));
		} else {
			refund.setTcsValue(null);
		}

		refund.setFocRecoveredAmt(focRecovered);
		grnPrint.setRefund(refund);
		grnPrint.setItems(itemsPrint);
		return grnPrint;
	}

	private void setCmItemsIteratively(Map<String, ItemDetailsDto> itemsDetailMap, List<GRNItemPrintDto> itemsPrint,
			CashMemoDetailsDao cmItem) {

		GRNItemPrintDto grnItem = (GRNItemPrintDto) MapperUtil.getDtoMapping(cmItem, GRNItemPrintDto.class);
		grnItem.setPriceDetails(MapperUtil.mapObjToClass(MapperUtil.getJsonFromString(cmItem.getPriceDetails()),
				PriceDetailsDto.class));

		ItemDetailsDto itemDetails = itemsDetailMap.get(grnItem.getItemCode());
		if (itemDetails != null) {

			grnItem.setDescription(itemDetails.getDescription());
			grnItem.setHsnCode(itemDetails.getHsnCode());
		}

		if (!StringUtil.isBlankJsonStr(cmItem.getTaxDetails())) {

			TaxCalculationResponseDto tax = MapperUtil.mapObjToClass(cmItem.getTaxDetails(),
					TaxCalculationResponseDto.class);

			BigDecimal sgstAmt = BigDecimal.ZERO;
			BigDecimal cgstAmt = BigDecimal.ZERO;

			if (tax.getData() != null && !tax.getData().isEmpty()) {

				TaxDetailDto cgstTax = tax.getData().get("CGST");
				if (cgstTax != null)
					cgstAmt = cgstTax.getTaxValue();

				TaxDetailDto sgstTax = tax.getData().get("SGST");
				if (sgstTax != null)
					sgstAmt = sgstTax.getTaxValue();

				grnItem.setCgstTax(cgstAmt);
				grnItem.setSgstTax(sgstAmt);

			}
		}
		itemsPrint.add(grnItem);
	}

	private BigDecimal setCNValueInPrint(GoodsReturnPrintDto grnPrint, List<CreditNoteDaoExt> creditNoteList,
			BigDecimal cnAmt) {
		if (CollectionUtil.isNotEmpty(creditNoteList)) {
			CreditNoteDaoExt cn = creditNoteList.get(0);
			CNLiteDto cnData = (CNLiteDto) MapperUtil.getDtoMapping(cn, CNLiteDto.class);
			cnAmt = cn.getAmount();
			grnPrint.setCn(cnData);
		}
		return cnAmt;
	}

	@Override
	public GRNResponseDto getById(String id, String txnType, String subTxnType, String creditNoteType) {

		// while confirming after approval check if status is rejected/ cancelled not to
		// check only
		GrnDaoExt grn = getGRNWithErrorCheck(id);
		CancelDaoExt cancel = grn.getCancel();
		List<CreditNoteDaoExt> creditNote = grnRepo.grnCnDocNo(grn.getId());
		SalesTxnDaoExt salesTxn = cancel.getRefSalesTxn();
		CashMemoDao cashMemo = getByCashMemoIdWithErrorCheck(salesTxn.getId());
		List<GrnDetailsDaoExt> grnDetails = grnDetailsRepo.findByGrnId(grn.getId());
		GRNResponseDto grnResponse = (GRNResponseDto) MapperUtil.getDtoMapping(cancel, GRNResponseDto.class);
		BigDecimal encriclePointValue = BigDecimal.ZERO;
		List<GRNItemDetailsDto> itemDetails = new ArrayList<>();
		Map<String, Integer> cnDocNo = new HashMap<>();
		// List<GRNItemDetailsDto> items =
		// cashMemoDetailsRepoExt.listCashMemoItemsByCancelId(id);
		for (GrnDetailsDaoExt grnItems : grnDetails) {
			ReturnableItemsDto returnableItemsDto = new ReturnableItemsDto();
			returnableItemsDto.setCashMemoDetailsId(grnItems.getCashMemoDetailsId());
			returnableItemsDto.setTotalQuantity(grnItems.getTotalQuantity());
			ItemDetailsResponseDto items = getItemDetails(salesTxn.getId(), returnableItemsDto);
			if (items.getHallmarkDiscount() != null) {
				items.setFinalValue(items.getFinalValue().subtract(items.getHallmarkDiscount()));
			}
			log.info("set final value -----{}", items.getFinalValue());
			GRNItemDetailsDto item = (GRNItemDetailsDto) MapperUtil.getDtoMapping(items, GRNItemDetailsDto.class);
			List<PaymentItemMappingDaoExt> paymentItemMappingList = paymentItemMappingRepository
					.getByTxnIdAndLocationCodeAndStatusIn(salesTxn.getId(), salesTxn.getLocationCode(),
							List.of(PaymentStatusEnum.COMPLETED.toString()), null);
			if (!CollectionUtil.isEmpty(paymentItemMappingList))
				for (PaymentItemMappingDaoExt paymentItemMappingDaoExt : paymentItemMappingList) {
					if (PaymentCodeEnum.ENCIRCLE.getPaymentcode()
							.equals(paymentItemMappingDaoExt.getPaymentDetailsDao().getPaymentCode()))
						if (paymentItemMappingDaoExt.getItemId().equals(returnableItemsDto.getCashMemoDetailsId())) {
							encriclePointValue = encriclePointValue.add(paymentItemMappingDaoExt.getAmount());
						}
				}
			grnResponse.setLoyaltyPoints(encriclePointValue);
			item.setId(returnableItemsDto.getCashMemoDetailsId());
			itemDetails.add(item);
		}
		grnResponse.setCancelType(cancel.getCancellationType());
		grnResponse.setCmFinalValue(cashMemo.getFinalValue());

		grnResponse.setRefId(salesTxn.getId());
		grnResponse.setTotalQuantity(cancel.getTotalQuantity());

		// salesTxn update
		grnResponse.setRefCustomerId(salesTxn.getCustomerId());

		MetalRateListDto metalRate = commonTxnService.mapMetalRateJsonToDto(grn.getMetalRateDetails());
		grnResponse.setMetalRateList(metalRate);

		grnResponse.setSrcLocationCode(grn.getSrcLocationCode());
		grnResponse.setGrnCustomerId(cancel.getCustomerId());

		// fetch all items
		grnResponse.setItems(itemDetails);

		grnResponse.setTotalValue(cancel.getTotalValue());
		grnResponse.setFocRecoverValue(grn.getFocRecoverValue());

		grnResponse.setRefDocNo(salesTxn.getDocNo());
		grnResponse.setRefDocDate(salesTxn.getDocDate());
		grnResponse.setRefFiscalYear(salesTxn.getFiscalYear());
		grnResponse.setTxnSource(salesTxn.getTxnSource());

		if (StringUtils.isNotBlank(cancel.getCancellationDetails())) {
			ReqApprovalDetailsDto reqApprovalDetails = MapperUtil.mapObjToClass(cancel.getCancellationDetails(),
					ReqApprovalDetailsDto.class);
			grnResponse.setProcessId(reqApprovalDetails.getProcessId());
		}
		if (!CollectionUtil.isEmpty(creditNote) && creditNote != null) {
			for (CreditNoteDaoExt creditNotes : creditNote) {
				if (creditNotes.getOriginalCn() != null) {
					if (creditNotes.getId().equalsIgnoreCase(creditNotes.getOriginalCn().getId())
							&& creditNotes.getCreditNoteType().equalsIgnoreCase(creditNoteType)) {
						cnDocNo.put(creditNotes.getId(), creditNotes.getDocNo());
						grnResponse.setCnDocDetails(cnDocNo);
					}
				} else {
					if (creditNotes.getCreditNoteType().equalsIgnoreCase(creditNoteType)) {
						cnDocNo.put(creditNotes.getId(), creditNotes.getDocNo());
						grnResponse.setCnDocDetails(cnDocNo);
					}
				}
			}
		}

		grnResponse.setOtherCharges(getOtherCharges(cashMemo));
		// grnResponse.setLoyaltyPoints(sumPaymentCodeWise(getCompletedPaymentById(salesTxn.getId()),
		// PaymentCodeEnum.ENCIRCLE.getPaymentcode()));
		// Start of TCS Credit Note
		AtomicReference<BigDecimal> tcsCNAmt = new AtomicReference<BigDecimal>();
		tcsCNAmt.set(BigDecimal.ZERO);
		AtomicReference<BigDecimal> finalValueRef = new AtomicReference<BigDecimal>();
		finalValueRef.set(BigDecimal.ZERO);
		itemDetails.stream().forEach(item -> {
			BigDecimal finalValue = item.getFinalValue();
			finalValueRef.set(finalValueRef.get().add(finalValue));
		});
		finalValueRef.set(finalValueRef.get().subtract(grn.getFocRecoverValue())); // foc value should be subtracted
																					// from final
		Optional<CashMemoDao> cashMemoDao = cashMemoRepository.findById(salesTxn.getId());
		cashMemoDao.ifPresent(cashmemo -> {
			Optional.ofNullable(cashmemo.getTcsAmount()).ifPresent(tcsAmount -> {
				if (tcsAmount.compareTo(BigDecimal.ZERO) > 0) {
					if (tcsAmount.compareTo(BigDecimal.ZERO) > 0) {
						if (getTcsRefundAmount(cashmemo).compareTo(BigDecimal.ZERO) > 0) {
							if (salesTxn.getTxnSource() != null
									&& salesTxn.getTxnSource().toString().equals("LEGACY")) {
								tcsCNAmt.set(cashmemo.getTcsAmount());
							} else {
								CustomerTcsDetailsDaoExt customerTcsDetailsDao = customerTcsDetailsRepository
										.findBySalesTxnDaoId(salesTxn.getId());
								if (customerTcsDetailsDao != null) {
									BigDecimal netInvoiceAmount = customerTcsDetailsDao.getNetInvoiceAmount();
									BigDecimal tcsCollected = customerTcsDetailsDao.getTcsAmountPaid();

									BigDecimal tcsAmt = BigDecimal.ZERO;
									if (finalValueRef.get().compareTo(netInvoiceAmount) == 0) {
										tcsAmt = tcsCollected;
									} else {
										tcsAmt = finalValueRef.get().divide(netInvoiceAmount, 2, RoundingMode.HALF_UP);
										tcsAmt = tcsAmt.multiply(new BigDecimal(100));
										tcsAmt = tcsCollected.multiply(tcsAmt);
										tcsAmt = tcsAmt.divide(new BigDecimal(100));
										BigDecimal tcsRoundingVariance = commonTransactionService
												.getRoundingVariance(tcsAmt);
										tcsAmt = tcsAmt.add(tcsRoundingVariance);
									}

									tcsCNAmt.set(tcsAmt);
								}

							}

						}
					}
				}
			});
		});
		// End Of TCS Credit Note
		/*
		 * grnResponse.setTcsRefund(tcsCNAmt.get());
		 * grnResponse.setTcsCollected(cashMemo.getTcsAmount());
		 */
		grnResponse.setTcsCollected(tcsCNAmt.get());
		return grnResponse;
	}
	// =================CONTROLLER METHOD END=================

	// =================INTERNAL METHOD START=================
	private FocSchemeAllDto getFocConfigToStore(SalesTxnDaoExt salesTxn, List<CashMemoDetailsDao> cmItems,
			List<String> itemsReturningIds) {

		FocDetailsAndSchemeDto focDetailsAndSchemes = getIssuedFocDetailsAmdSchemes(salesTxn.getId());
		Set<FocSchemesDao> focSchemes = new HashSet<>(focDetailsAndSchemes.getFocSchemes());

		// if no FOC scheme, return 0 as deduction amount
		// scenario can be no FOC item or legacy CM
		if (CollectionUtil.isEmpty(focSchemes)) {
			return null;
		}

		// this required to store in GRN CN only (only item
		Set<FocSchemeGrnDto> headerConfigDetails = new HashSet<>();
		Set<FocSchemeDetailsDto> rowConfigDetails = new HashSet<>();
		Set<FocSchemeProductMappingDto> productGroupDetails = new HashSet<>();
		Set<FocSchemeItemMappingDto> focItemDetails = new HashSet<>();
		Set<ManualFocSchemeItemDto> manualFocItemDetails = new HashSet<>();

		Map<String, String> focSchemeIdWithDbId = new HashMap<>();

		Set<String> pgCodesReturning = new HashSet<>();
		for (CashMemoDetailsDao item : cmItems) {

			if (itemsReturningIds.contains(item.getId()))
				pgCodesReturning.add(item.getProductGroupCode());
		}

		// iterate FOC schemes, add it in list configurations
		fetchAllConfigFromFocSchemes(focSchemes, headerConfigDetails, rowConfigDetails, productGroupDetails,
				focItemDetails, focSchemeIdWithDbId, manualFocItemDetails);

		FocSchemeAllDto fs = setFOcSchemeFullDetails(headerConfigDetails, rowConfigDetails, productGroupDetails,
				focItemDetails, manualFocItemDetails);

		return convertToFocCnDetails(pgCodesReturning, fs);
	}

	private GrnFocDto getFocWiseFinalCalculation(SalesTxnDaoExt salesTxn, List<ReturnableItemsDto> returnableItems,
			List<CashMemoDetailsDao> cmItems, List<String> itemsReturningIds) {

		FocDetailsAndSchemeDto focDetailsAndSchemes = getIssuedFocDetailsAmdSchemes(salesTxn.getId());
		Set<FocSchemesDao> focSchemes = new HashSet<>(focDetailsAndSchemes.getFocSchemes());
		// if no FOC scheme, return 0 as deduction amount
		// scenario can be no FOC item or legacy CM
		if (CollectionUtil.isEmpty(focSchemes)) {
			log.debug("No FOC scheme found for this CM, Hence not deducting any FOC amount.");
			return new GrnFocDto(BigDecimal.ZERO, null, null, null);
		}

		// @formatter:off
		// this required to store in GRN CN only (only item
		Set<FocSchemeGrnDto> headerConfigDetails = new HashSet<>();
		Set<FocSchemeDetailsDto> rowConfigDetails = new HashSet<>();
		Set<FocSchemeProductMappingDto> productGroupDetails = new HashSet<>();
		Set<FocSchemeItemMappingDto> focItemDetails = new HashSet<>();
		Set<ManualFocSchemeItemDto> manualFocItemDetails = new HashSet<>();

		Map<String, String> focSchemeIdWithDbId = new HashMap<>();

		// find which items are not returned
		// find which items are going to be pending after current txn items are returned
		// difference calculation is FOC recovery related information
		List<CashMemoDetailsDao> cmNotReturnedItemsTill = new ArrayList<>();
		List<CashMemoDetailsDao> cmLeftItemAfterThisTxn = new ArrayList<>();
		List<CashMemoDetailsDao> cmItemThisTxn = new ArrayList<>();
		Set<String> pgCodesReturning = new HashSet<>();
		List<ReturnableItemsDto> possReturnedItemsData = listReturnedItemIdsForGRN(salesTxn.getId());

		getCMItemsInCategory(returnableItems, cmItems, itemsReturningIds, cmNotReturnedItemsTill,
				cmLeftItemAfterThisTxn, pgCodesReturning,possReturnedItemsData);
		
		cmItemThisTxn.addAll(cmNotReturnedItemsTill);
		for(CashMemoDetailsDao newitem : cmLeftItemAfterThisTxn) {
			cmItemThisTxn.remove(newitem);
			
		}

		// iterate FOC schemes, add it in list configurations
		fetchAllConfigFromFocSchemes(focSchemes, headerConfigDetails, rowConfigDetails, productGroupDetails,
				focItemDetails, focSchemeIdWithDbId, manualFocItemDetails);

		FocSchemeAllDto fs = setFOcSchemeFullDetails(headerConfigDetails, rowConfigDetails, productGroupDetails,
				focItemDetails, manualFocItemDetails);
		FocSchemeAllDto fsCn = convertToFocCnDetails(pgCodesReturning, fs);
		//cmNotReturnedItemsTillDataWithPGCode = Items which are being returned
		Map<String, List<CashMemoDetailsDao>> cmNotReturnedItemsTillDataWithPGCode = cmNotReturnedItemsTill.stream()
				.collect(Collectors.groupingBy(CashMemoDetailsDao::getProductGroupCode));
		//cmLeftItemAfterThisTxnWithPGCode =  Items not being returned
		Map<String, List<CashMemoDetailsDao>> cmLeftItemAfterThisTxnWithPGCode = cmLeftItemAfterThisTxn.stream()
				.collect(Collectors.groupingBy(CashMemoDetailsDao::getProductGroupCode));
		
        Map<String, List<CashMemoDetailsDao>> cmItemForThisTxnWithPGCode = cmItemThisTxn.stream()
                .collect(Collectors.groupingBy(CashMemoDetailsDao::getProductGroupCode));

		FocSchemeRequestDto fsr = new FocSchemeRequestDto();
		// fs.getSchemeProductMapping());
		fsr.setSchemeDetails(fs.getSchemeDetails());
		fsr.setSchemeProductMapping(fs.getSchemeProductMapping());
		fsr.setManualFocSchemeItemMapping(fs.getManualFocSchemeItemMapping());
		log.debug("Configs:\n{}", fsr);

		List<FocSchemeItemResponseDto> fsResOld = getFocEligibleInfo(cmNotReturnedItemsTillDataWithPGCode, fsr, "1st");
		List<FocSchemeItemResponseDto> fsResNew = getFocEligibleInfo(cmLeftItemAfterThisTxnWithPGCode, fsr, "2nd");
//		List<FocSchemeItemResponseDto> fsResNew = new ArrayList<>();
		Boolean isFullGrn = false;
//		if(cmLeftItemAfterThisTxnWithPGCode.isEmpty()) {
//			isFullGrn = true;
//			 fsResNew = getFocEligibleInfo(cmLeftItemAfterThisTxnWithPGCode, fsr, "2nd");
//			
//		}else {
//		     fsResNew = getFocEligibleInfo(cmItemForThisTxnWithPGCode, fsr, "2nd");
//		}
		

		// @formatter:on
		// return how much FOC deducted amount
		Map<String, FocSchemeItemResponseDto> fsResOldMap = new HashMap<>();
		// fsResOld.stream()
//				.collect(Collectors.toMap(FocSchemeItemResponseDto::getSchemeDetailId, Function.identity()));
		Map<String, FocSchemeItemResponseDto> fsResNewMap = new HashMap<>();
		// fsResNew.stream()
		/// .collect(Collectors.toMap(FocSchemeItemResponseDto::getSchemeDetailId,
		// Function.identity()));

		for (FocSchemeItemResponseDto response : fsResOld) {
			fsResOldMap.put(response.getSchemeDetailId(), response);
		}

		for (FocSchemeItemResponseDto response : fsResNew) {
			fsResNewMap.put(response.getSchemeDetailId(), response);
		}

		Map<String, BigDecimal> schemeWiseFocDeductionAmt = new HashMap<>();

		Set<FocDetailsDao> focDetails = new HashSet<>(focDetailsAndSchemes.getFocDetails());
		// all FOC items grouped by FOC scheme pk id
		Map<String, List<FocDetailsDao>> focDetailsMap = focDetails.stream()
				.collect(Collectors.groupingBy(fsd -> fsd.getFocScheme().getId()));

		BigDecimal goldRatePerUnit = getGoldRateFromCM(salesTxn);

		BigDecimal finalFocDeduction = calculateSchemeCompareWise(focDetailsMap, goldRatePerUnit, focSchemeIdWithDbId,
				fsResOldMap, fsResNewMap, schemeWiseFocDeductionAmt, isFullGrn);

		if (!manualFocItemDetails.isEmpty() && cmLeftItemAfterThisTxnWithPGCode.isEmpty()) {
			BigDecimal manualFocDeduction = BigDecimal.ZERO;
			for (ManualFocSchemeItemDto manualFocItem : manualFocItemDetails) {
				manualFocDeduction = manualFocDeduction.add(
						manualFocItem.getUnitWeight().multiply(BigDecimal.valueOf(manualFocItem.getTotalQuantity())));
			}
			finalFocDeduction = finalFocDeduction.add(manualFocDeduction.multiply(goldRatePerUnit));
		}

		log.debug("Foc deduction Amt scheme wise: {}", schemeWiseFocDeductionAmt);
		log.debug("Foc deduction Amt: {}", finalFocDeduction);

		return new GrnFocDto(finalFocDeduction, schemeWiseFocDeductionAmt, fs, fsCn);
	}

	private FocSchemeAllDto convertToFocCnDetails(Set<String> pgCodesReturning, FocSchemeAllDto fs) {

		FocSchemeAllDto fsCn = new FocSchemeAllDto();

		Set<String> schemeDetailIds = new HashSet<>();
		Set<String> schemeDetailsCategoryWithItemTypes = new HashSet<>();

		Set<String> schemeIds = new HashSet<>();

		// consider only pgCodes are getting returned
		// get it's schemeId & schemeDetailsId
		// if details is slab then details id will X there, get category & item type
		// @formatter:off
		if (!CollectionUtil.isEmpty(fs.getSchemeProductMapping())) {
			Set<FocSchemeProductMappingDto> schemeProductMapping = new HashSet<>();

			for (FocSchemeProductMappingDto fsp : fs.getSchemeProductMapping()) {

				if (pgCodesReturning.contains(fsp.getProductGroupCode())) {

					if (fsp.getSchemeDetailsId() != null) {
						schemeDetailIds.add(fsp.getSchemeDetailsId());
					} else {
						schemeDetailsCategoryWithItemTypes.add(fsp.getCategory() + "_" + fsp.getItemType());
					}
					schemeProductMapping.add(fsp);
					schemeIds.add(fsp.getSchemeId());
				}
			}
			fsCn.setSchemeProductMapping(schemeProductMapping);
		}

		// scheme details already collected from product mapping
		if (!CollectionUtil.isEmpty(fs.getSchemeDetails())) {

			Set<FocSchemeDetailsDto> schemeDetails = new HashSet<>();

			for (FocSchemeDetailsDto fsd : fs.getSchemeDetails()) {

				// if scheme detail id match or category, itemType match then store it
				if (schemeDetailIds.contains(fsd.getId())
						|| schemeDetailsCategoryWithItemTypes.contains(fsd.getCategory() + "_" + fsd.getItemType())) {
					schemeDetails.add(fsd);
				}
			}
			fsCn.setSchemeDetails(schemeDetails);
		}
		// @formatter:on

		// scheme already collected from product mapping
		if (!CollectionUtil.isEmpty(fs.getSchemes())) {
			Set<FocSchemeGrnDto> schemes = new HashSet<>();
			for (FocSchemeGrnDto fsg : fs.getSchemes()) {
				if (schemeIds.contains(fsg.getSchemeId()))
					schemes.add(fsg);
			}
			fsCn.setSchemes(schemes);
		}

		// item mapping are not specific to any pg code
		if (!CollectionUtil.isEmpty(fs.getSchemeItemMapping())) {
			Set<FocSchemeItemMappingDto> schemeItemMapping = new HashSet<>();
			for (FocSchemeItemMappingDto fsi : fs.getSchemeItemMapping()) {
				schemeItemMapping.add(fsi);
			}
			fsCn.setSchemeItemMapping(schemeItemMapping);
		}

		// item mapping are not specific to any pg code
		if (!CollectionUtil.isEmpty(fs.getManualFocSchemeItemMapping())) {
			Set<ManualFocSchemeItemDto> manualFocSchemeItemMapping = new HashSet<>();
			for (ManualFocSchemeItemDto fsi : fs.getManualFocSchemeItemMapping()) {
				manualFocSchemeItemMapping.add(fsi);
			}
			fsCn.setManualFocSchemeItemMapping(manualFocSchemeItemMapping);
		}

		return fsCn;
	}

	private BigDecimal calculateSchemeCompareWise(Map<String, List<FocDetailsDao>> focDetailsMap,
			BigDecimal goldRatePerUnit, Map<String, String> focSchemeIdWithDbId,
			Map<String, FocSchemeItemResponseDto> fsResOldMap, Map<String, FocSchemeItemResponseDto> fsResNewMap,
			Map<String, BigDecimal> schemeWiseFocDeductionAmt, Boolean isFullGrn) {

		BigDecimal finalFocDeduction = BigDecimal.ZERO;
//		Map<String, FocSchemeItemResponseDto> focMap = new HashMap<>();
//		if (isFullGrn) {
//			focMap = fsResOldMap; // if full grn passing fsResOldmap
//		} else {
//			focMap = fsResNewMap;
//		}

	//	for (Map.Entry<String, FocSchemeItemResponseDto> fsResOldMapEntry : focMap.entrySet()) {
		for (Map.Entry<String, FocSchemeItemResponseDto> fsResOldMapEntry : fsResOldMap.entrySet()) {
			// all information
			String focSchemeId = fsResOldMapEntry.getValue().getSchemeId();
			String focDbSchemeId = focSchemeIdWithDbId.get(focSchemeId);
			String focSchemeDetailId = fsResOldMapEntry.getValue().getSchemeDetailId();
			String focProductGroup = fsResOldMapEntry.getValue().getProductGroupCode();
			FocSchemeItemResponseDto focDetailWise = fsResOldMapEntry.getValue();
			FocSchemeItemResponseDto fsNew = fsResNewMap.get(focSchemeDetailId);

			// final information modification for easy calculation
			FocItemDto focItemNew = null;
			// @formatter:off

			if (fsNew != null) {
				focItemNew = new FocItemDto(fsNew.getWeight(),
						(fsNew.getQuantity() != null) ? fsNew.getQuantity().shortValue() : null, null);
			} else {
				// if no entry in new API, add default 0 value, so calculation will be easy &
				// same value
				log.trace("No entry in current after returing item CM for schemeDetailId : {}", focSchemeDetailId);
				focItemNew = new FocItemDto();
				focItemNew.setQuantity((short) 0);
				focItemNew.setWeight(BigDecimal.ZERO);
			}

			// final calculation
			BigDecimal focDeductionForThis = null;
			if (focDetailWise.getQuantity() != null) {
				List<FocDetailsDao> focDetailsForThisScheme = focDetailsMap.get(focDbSchemeId);
				Integer totalQty = 0;

				BigDecimal totalVal = BigDecimal.ZERO;
				for (FocDetailsDao fsd : focDetailsForThisScheme) {
					totalQty += fsd.getTotalQuantity();
					totalVal = totalVal.add(fsd.getTotalValue());
				}

				BigDecimal unitVal = totalVal.divide(BigDecimal.valueOf(totalQty), DomainConstants.PRICE_SCALE,
						DomainConstants.ROUNDIND_MODE);

				Integer focQtyDiff = fsResOldMapEntry.getValue().getQuantity() - focItemNew.getQuantity();
				log.debug("\ntotalQty: {}, totalVal: {}, unitVal: {}, focQtyDiff: {}", totalQty, totalVal, unitVal,
						focQtyDiff);
				focDeductionForThis = unitVal.multiply(BigDecimal.valueOf(focQtyDiff))
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			} else {
				BigDecimal focWeightDiff = fsResOldMapEntry.getValue().getWeight().subtract(focItemNew.getWeight());
//				BigDecimal focWeightDiff;
//                if(isFullGrn) {
//                	 focWeightDiff = fsResOldMapEntry.getValue().getWeight().subtract(focItemNew.getWeight());
//                }else {
//                	 focWeightDiff = (focItemNew.getWeight());
//                }			
				log.debug("\nUnitWeight: {}, focWeightDiff: {}", goldRatePerUnit, focWeightDiff);
				focDeductionForThis = focWeightDiff.multiply(goldRatePerUnit).setScale(DomainConstants.PRICE_SCALE,
						DomainConstants.ROUNDIND_MODE);
			}
			// @formatter:on
			schemeWiseFocDeductionAmt.put(focSchemeDetailId, focDeductionForThis);
			log.debug("Scheme wise final calculation: {}", schemeWiseFocDeductionAmt);
			finalFocDeduction = finalFocDeduction.add(focDeductionForThis);
		}

		return finalFocDeduction;

	}

	// @formatter:off
	private List<FocSchemeItemResponseDto> getFocEligibleInfo(
			Map<String, List<CashMemoDetailsDao>> cmNotReturnedItemsTillDataWithPGCode, FocSchemeRequestDto fsr,
			String index) {

		List<PurchaseItemRequestDto> cmNotReturnedItemsTillData = findPgCodeWiseInfo(
				cmNotReturnedItemsTillDataWithPGCode);
		// @formatter:on
		fsr.setPurchaseItems(cmNotReturnedItemsTillData);
		log.debug("{} input purchaseItem:\n{}", index, cmNotReturnedItemsTillData);
		List<FocSchemeItemResponseDto> fsResOld = engineService.getFocSchemesOnProductGroups(fsr).getResults();
		log.debug("{} output:\n{}", index, fsResOld);
		return fsResOld;
	}

	private FocSchemeAllDto setFOcSchemeFullDetails(Set<FocSchemeGrnDto> headerConfigDetails,
			Set<FocSchemeDetailsDto> rowConfigDetails, Set<FocSchemeProductMappingDto> productGroupDetails,
			Set<FocSchemeItemMappingDto> focItemDetails, Set<ManualFocSchemeItemDto> manualFocItemDetails) {

		FocSchemeAllDto fs = new FocSchemeAllDto();

		fs.setSchemeDetails(rowConfigDetails);
		fs.setSchemeItemMapping(focItemDetails);
		fs.setManualFocSchemeItemMapping(manualFocItemDetails);
		fs.setSchemeProductMapping(productGroupDetails);
		fs.setSchemes(headerConfigDetails);

		return fs;
	}

	private void getCMItemsInCategory(List<ReturnableItemsDto> returnableItems, List<CashMemoDetailsDao> cmItems,
			List<String> itemsReturningIds, List<CashMemoDetailsDao> cmNotReturnedItemsTill,
			List<CashMemoDetailsDao> cmLeftItemAfterThisTxn, Set<String> pgCodesReturning,List<ReturnableItemsDto> possReturnedItemsData) {
		Map<String, ReturnableItemsDto> items = new HashMap<>();
        List<String> retItems = new ArrayList<String>();
		for (ReturnableItemsDto returnedItems : returnableItems) {
			retItems.add(returnedItems.getCashMemoDetailsId());
					items.put(returnedItems.getCashMemoDetailsId(), returnedItems);
		}
		for (CashMemoDetailsDao item : cmItems) {
			// items not returned till now
			if (!retItems.contains(item.getId())) {
				cmNotReturnedItemsTill.add(item);
				// items which will be left after this txn
				if (!itemsReturningIds.contains(item.getId()))
					cmLeftItemAfterThisTxn.add(item);

			}
			if (itemsReturningIds.contains(item.getId()))
				pgCodesReturning.add(item.getProductGroupCode());
		}

	}

	private void fetchAllConfigFromFocSchemes(Set<FocSchemesDao> focSchemes, Set<FocSchemeGrnDto> headerConfigDetails,
			Set<FocSchemeDetailsDto> rowConfigDetails, Set<FocSchemeProductMappingDto> productGroupDetails,
			Set<FocSchemeItemMappingDto> focItemDetails, Map<String, String> focSchemeIdWithDbId,
			Set<ManualFocSchemeItemDto> manualFocItemDetails) {

		for (FocSchemesDao fs : focSchemes) {

			// as PK is not scheme id, store it in a map to find PK id of a scheme id
			FocSchemeDetailsJsonDto focSchemeDetailsJsonDto = MapperUtil.mapJsonDataToClass(fs.getSchemeDetails(),
					FocSchemeDetailsJsonDto.class);
			if (fs != null)
				focSchemeIdWithDbId.put(focSchemeDetailsJsonDto.getSchemeId(), fs.getId());

			if (fs.getHeaderConfigDetails() != null) {
				FocSchemeGrnDto focSchemeDetailsOfFs = MapperUtil.mapJsonDataToClass(fs.getHeaderConfigDetails(),
						FocSchemeGrnDto.class);
				headerConfigDetails.add(focSchemeDetailsOfFs);
			}

			// @formatter:off
			if (fs.getRowConfigDetails() != null) {
				JsonData jdRowConfig = MapperUtil.mapObjToClass(fs.getRowConfigDetails(), JsonData.class);
				List<FocSchemeDetailsDto> focSchemeDetailsOfFs = MapperUtil.getObjectMapperInstance()
						.convertValue(jdRowConfig.getData(), new TypeReference<List<FocSchemeDetailsDto>>() {
						});
				rowConfigDetails.addAll(focSchemeDetailsOfFs);
			}

			if (fs.getProductGroupDetails() != null) {
				JsonData jdProductConfig = MapperUtil.mapObjToClass(fs.getProductGroupDetails(), JsonData.class);
				List<FocSchemeProductMappingDto> focSchemeDetailsOfFs = MapperUtil.getObjectMapperInstance()
						.convertValue(jdProductConfig.getData(), new TypeReference<List<FocSchemeProductMappingDto>>() {
						});
				productGroupDetails.addAll(focSchemeDetailsOfFs);
			}

			if (fs.getFocItemDetails() != null) {
				JsonData jdItemConfig = MapperUtil.mapObjToClass(fs.getFocItemDetails(), JsonData.class);
				List<FocSchemeItemMappingDto> focItemDetailsOfFs = MapperUtil.getObjectMapperInstance()
						.convertValue(jdItemConfig.getData(), new TypeReference<List<FocSchemeItemMappingDto>>() {
						});
				focItemDetails.addAll(focItemDetailsOfFs);
				// @formatter:on
			}

			if (fs.getManualFocItemDetails() != null) {
				JsonData jdItemConfig = MapperUtil.mapObjToClass(fs.getManualFocItemDetails(), JsonData.class);
				List<ManualFocSchemeItemDto> focItemDetailsOfFs = MapperUtil.getObjectMapperInstance()
						.convertValue(jdItemConfig.getData(), new TypeReference<List<ManualFocSchemeItemDto>>() {
						});
				if (focItemDetailsOfFs != null)
					manualFocItemDetails.addAll(focItemDetailsOfFs);
				// @formatter:on
			}
		}
	}

	private BigDecimal getGoldRateFromCM(SalesTxnDaoExt salesTxn) {
		BigDecimal goldRatePerUnit = BigDecimal.ZERO;
		MetalRateListDto metalRateList = MapperUtil.mapObjToClass(salesTxn.getMetalRateDetails(),
				MetalRateListDto.class);
		if (metalRateList.getMetalRates().containsKey("J"))
			goldRatePerUnit = metalRateList.getMetalRates().get("J").getRatePerUnit();
		log.debug("Gold rate as per CM: {}", goldRatePerUnit);
		return goldRatePerUnit;
	}

	private List<PurchaseItemRequestDto> findPgCodeWiseInfo(Map<String, List<CashMemoDetailsDao>> cmItems) {

		List<PurchaseItemRequestDto> pgWiseInfo = new ArrayList<>();
		Map<String, List<CashMemoDetailsDao>> cmItemsGrpWise = cmItems;

		log.debug("Input items:\n{}", cmItemsGrpWise.values().stream().flatMap(List::stream)
				.map(cmd -> cmd.getItemCode() + "-" + cmd.getLotNumber()).collect(Collectors.toList()));

		for (Map.Entry<String, List<CashMemoDetailsDao>> pgWiseItems : cmItemsGrpWise.entrySet()) {

			PurchaseItemRequestDto pir = new PurchaseItemRequestDto();
			pir.setProductGroupCode(pgWiseItems.getKey());

			BigDecimal totalDiscount = BigDecimal.ZERO;
			BigDecimal totalValue = BigDecimal.ZERO;
			BigDecimal totalTax = BigDecimal.ZERO;

			BigDecimal totalMetalWeight = BigDecimal.ZERO;
			BigDecimal totalStoneWeight = BigDecimal.ZERO;
			BigDecimal totalMaterialWeight = BigDecimal.ZERO;

			for (CashMemoDetailsDao item : pgWiseItems.getValue()) {

				totalValue = totalValue.add(item.getTotalValue());
				totalDiscount = totalDiscount.add(item.getTotalDiscount());
				totalTax = totalTax.add(item.getTotalTax());

				// @formatter:off
				WeightDetailsDto wdd = MapperUtil.mapJsonDataToClass(item.getMeasuredWeightDetails(),
						WeightDetailsDto.class);

				if (wdd != null) {

					BigDecimal currentMetalWeight = BigDecimal.ZERO;
					if (wdd.getGoldWeight() != null)
						currentMetalWeight = currentMetalWeight.add(wdd.getGoldWeight());
					if (wdd.getSilverWeight() != null)
						currentMetalWeight = currentMetalWeight.add(wdd.getSilverWeight());
					if (wdd.getPlatinumWeight() != null)
						currentMetalWeight = currentMetalWeight.add(wdd.getPlatinumWeight());
					totalMetalWeight = totalMetalWeight
							.add(currentMetalWeight.multiply(BigDecimal.valueOf(item.getTotalQuantity())));

					BigDecimal currentStoneWeight = BigDecimal.ZERO;
					if (wdd.getStoneWeight() != null)
						currentStoneWeight = currentStoneWeight.add(wdd.getStoneWeight());
					if (wdd.getDiamondWeight() != null)
						currentStoneWeight = currentStoneWeight.add(wdd.getDiamondWeight());
					totalStoneWeight = totalStoneWeight
							.add(currentStoneWeight.multiply(BigDecimal.valueOf(item.getTotalQuantity())));

					if (wdd.getMaterialWeight() != null)
						totalMaterialWeight = totalMaterialWeight
								.add((wdd.getMaterialWeight().multiply(BigDecimal.valueOf(item.getTotalQuantity()))));

					// @formatter:on
				}
			}

			pir.setTotalValue(totalValue);
			pir.setTotalDiscount(totalDiscount);
			pir.setTotalTax(totalTax);

			pir.setTotalMetalWeight(totalMetalWeight);
			pir.setTotalStoneWeight(totalStoneWeight);
			pir.setTotalMaterialWeight(totalMaterialWeight);

			pgWiseInfo.add(pir);
		}

		return pgWiseInfo;
	}

	private Date getBusinessDayIfNull(Date businessDay) {
		if (businessDay == null)
			businessDay = businessDayService.getBusinessDay().getBusinessDate();
		return businessDay;
	}

	private boolean isDiffStore(String srcLocationCode) {
		return (!srcLocationCode.equals(CommonUtil.getStoreCode()));
	}

	private GRNInitateResponseDto mapToDtoInitateGRN(CashMemoEntities cashMemoEntities, Integer grnCustomerId) {

		// System.out.println("The response is "+cashMemoEntities.toString());
		SalesTxnDao salesTxnDao = cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao();

		GRNInitateResponseDto response = (GRNInitateResponseDto) MapperUtil.getDtoMapping(salesTxnDao,
				GRNInitateResponseDto.class);
		response.setMetalRateList(MapperUtil.mapObjToClass(salesTxnDao.getMetalRateDetails(), MetalRateListDto.class));

		response = (GRNInitateResponseDto) MapperUtil.getObjectMapping(cashMemoEntities.getOriginalTxn().getCashMemo(),
				response);

		response.setDocDate(null);
		response.setDocNo(null);
		response.setRefDocNo(salesTxnDao.getDocNo());
		response.setRefDocDate(salesTxnDao.getDocDate());
		response.setRefFiscalYear(salesTxnDao.getFiscalYear());
		response.setRefCustomerId(salesTxnDao.getCustomerId());
		response.setSrcLocationCode(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getLocationCode());
		response.setTxnSource(cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().getTxnSource());

		response.setReturnedItems(cashMemoEntities.getReturnedItems());

		List<GRNItemDetailsDto> items = new ArrayList<>();
		if (CollectionUtil.isNotEmpty(cashMemoEntities.getOriginalTxn().getCashMemoDetails()))
			// @formatter:off
			items = cashMemoEntities.getOriginalTxn().getCashMemoDetails().stream().map(cmd -> {
				GRNItemDetailsDto item = (GRNItemDetailsDto) MapperUtil.getDtoMapping(cmd, GRNItemDetailsDto.class);
				item.setPriceDetails(MapperUtil.mapObjToClass(cmd.getPriceDetails(), PriceDetailsDto.class));
				item.setTaxDetails(MapperUtil.mapObjToClass(cmd.getTaxDetails(), TaxCalculationResponseDto.class));
	            item.setLegacyCmDetails(MapperUtil.mapObjToClass(cmd.getLegacyCmDetails(), LegacyCmDetailsDto.class));
				return item;
			}).collect(Collectors.toList());
		// @formatter:on

		List<FocDetailsDtoEntity> allFocDetails = cashMemoEntities.getOriginalTxn().getFocDetails();
		List<FocSchemesDao> allFocSchemes = cashMemoEntities.getOriginalTxn().getFocSchemes();

		if (cashMemoEntities.getIssueFocTxn() != null) {
			allFocDetails.addAll(cashMemoEntities.getIssueFocTxn().getFocDetails());
			allFocSchemes.addAll(cashMemoEntities.getIssueFocTxn().getFocSchemes());
		}

		response.setCmFinalValue(cashMemoEntities.getOriginalTxn().getCashMemo().getFinalValue());
		response.setItems(items);
		response.setGrnCustomerId(grnCustomerId);
		if (salesTxnDao.getTxnSource() != null && salesTxnDao.getTxnSource().equals("LEGACY")) {
			BigDecimal encirclePointValue = BigDecimal.ZERO;
			List<CashMemoDetailsDao> cashMemoDetails = cashMemoEntities.getOriginalTxn().getCashMemoDetails();
			for (CashMemoDetailsDao cashMemoDetailsDao : cashMemoDetails) {
				LegacyCmDetailsDto legacyCMDetails = MapperUtil.mapObjToClass(cashMemoDetailsDao.getLegacyCmDetails(),
						LegacyCmDetailsDto.class);
				if (legacyCMDetails != null && legacyCMDetails.getEncirclePoints() != null) {
					encirclePointValue = encirclePointValue.add(new BigDecimal(legacyCMDetails.getEncirclePoints()));
				}
			}
			response.setLoyaltyPoints(encirclePointValue);

		} else {
			response.setLoyaltyPoints(sumPaymentCodeWise(cashMemoEntities.getOriginalTxn().getPaymentDetails(),
					PaymentCodeEnum.ENCIRCLE.getPaymentcode()));
		}

		response.setOtherCharges(getOtherCharges(cashMemoEntities.getOriginalTxn().getCashMemo()));
		response.setTcsCollected(getTcsRefundAmount(cashMemoEntities.getOriginalTxn().getCashMemo()));

		// Setting isVoid to true in the response DTO if any of the
		// payment done under the transaction has is_void = true
		// inorder to not allow 'Partial GRN'
		List<PaymentDetailsDao> payments = paymentDetailsRepo.getBySalesTxnDaoIdAndStatus(salesTxnDao.getId(),
				PaymentStatusEnum.COMPLETED.name());
		for (PaymentDetailsDao paymentDetailsDao : payments) {
			if (BooleanUtils.isTrue(paymentDetailsDao.getIsVoid())) {
				response.setIsVoid(Boolean.TRUE);
				break;
			}
		}

		return response;
	}

	private BigDecimal getTcsRefundAmount(CashMemoDao cashMemoDao) {
		BusinessDayDto businessDateDto = engineService.getBusinessDay(cashMemoDao.getSalesTxnDao().getLocationCode());
		LocationCacheDto locationDoa = engineService.getStoreLocation(cashMemoDao.getSalesTxnDao().getLocationCode());
		BrandDto brandDto = engineService.getBrand(locationDoa.getBrandCode());
		BrandTcsDetails brandTcs = MapperUtil.mapJsonDataToClass(brandDto.getBrandTcsDetails(), BrandTcsDetails.class);
		GrnConfig grnConfig = brandTcs.getB2c().getGrnConfig();
		int cashMemoDateMonth = getCalendarMonth(cashMemoDao.getSalesTxnDao().getDocDate());
		int businessDayDateMonth = getCalendarMonth(businessDateDto.getBusinessDate());
		CustomerTcsDetailsDaoExt customerTcsDetailsDao = customerTcsDetailsRepository
				.findBySalesTxnDaoId(cashMemoDao.getSalesTxnDao().getId());
		if (customerTcsDetailsDao != null && grnConfig != null && grnConfig.getTcsReverseForGRnDate() != null
				&& grnConfig.getTcsReverseForGRnDate().getSameMonth()) {
			if (cashMemoDateMonth == businessDayDateMonth) {
				return customerTcsDetailsDao.getTcsAmountPaid();
			}

		} else if (customerTcsDetailsDao != null && grnConfig != null && grnConfig.getTcsReverseForGRnDate() != null
				&& grnConfig.getTcsReverseForGRnDate().getAfterCalanderMonth()) {
			if (businessDayDateMonth > cashMemoDateMonth) {
				return customerTcsDetailsDao.getTcsAmountPaid();
			}
		}
		SalesTxnDao salesTxnDao = cashMemoDao.getSalesTxnDao();
		if (salesTxnDao != null && cashMemoDao.getTcsAmount() != null && salesTxnDao.getTxnSource() != null
				&& salesTxnDao.getTxnSource().toString().equals("LEGACY") && grnConfig != null
				&& grnConfig.getTcsReverseForGRnDate() != null && grnConfig.getTcsReverseForGRnDate().getSameMonth()) {
			if (cashMemoDateMonth == businessDayDateMonth) {
				return cashMemoDao.getTcsAmount();
			}
		} else if (salesTxnDao != null && cashMemoDao.getTcsAmount() != null && salesTxnDao.getTxnSource() != null
				&& salesTxnDao.getTxnSource().toString().equals("LEGACY") && grnConfig != null
				&& grnConfig.getTcsReverseForGRnDate() != null
				&& grnConfig.getTcsReverseForGRnDate().getAfterCalanderMonth()) {
			if (businessDayDateMonth > cashMemoDateMonth) {
				return BigDecimal.ZERO;
			}
		}
		return BigDecimal.ZERO;

	}

	private int getCalendarMonth(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int calenderMonth = calendar.get(Calendar.MONTH);
		return calenderMonth;
	}

	private BigDecimal getOtherCharges(CashMemoDao cashMemo) {

		BigDecimal otherCharges = BigDecimal.ZERO;

		if (!StringUtil.isBlankJsonStr(cashMemo.getOtherCharges())) {

			otherCharges = MapperUtil.mapObjToClass(cashMemo.getOtherCharges(), OtherChargeDetailsDto.class).getData()
					.getValue();

		}

		return otherCharges;
	}

	private BigDecimal sumPaymentCodeWise(List<PaymentDetailsDao> payments, String paymentCode) {
		BigDecimal pay = BigDecimal.ZERO;
		if (payments != null && !payments.isEmpty()) {
			pay = payments.stream()
					.filter(payment -> (payment.getPaymentCode().equals(paymentCode))
							&& (payment.getStatus().equals(PaymentStatusEnum.COMPLETED.toString())))
					.map(PaymentDetailsDao::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
		}
		return pay;

	}

	public void printCashMemoEntity(CashMemoEntity cmEntity) {
		log.info("CmEntity :- {}", MapperUtil.getJsonString(cmEntity));
	}

	private void addFkValueToEntity(CashMemoEntity cashMemoEntity) {
		SalesTxnDao salesTxn = cashMemoEntity.getCashMemo().getSalesTxnDao();
		cashMemoEntity.getCashMemoDetails().forEach(cmd -> cmd.setCashMemoDao(cashMemoEntity.getCashMemo()));
		cashMemoEntity.getCustomerTxn().setSalesTxnDao(salesTxn);
		cashMemoEntity.getPaymentDetails().forEach(pd -> pd.setSalesTxnDao(salesTxn));
		if (CollectionUtil.isNotEmpty(cashMemoEntity.getFocSchemes()))
			cashMemoEntity.getFocSchemes().forEach(fs -> fs.setSalesTxn(salesTxn));
		if (!CollectionUtil.isEmpty(cashMemoEntity.getDiscountDetails())) {
			cashMemoEntity.getDiscountDetails().forEach(dd -> {
				dd.setSalesTxn(salesTxn);
				dd.setDiscountConfig(
						new DiscountConfigDetailsDao(cashMemoEntity.getDiscountDetailAndConfigMap().get(dd.getId())));
			});
			cashMemoEntity.getDiscountItemDetails().forEach(itemD -> itemD.setDiscountDetail(
					new DiscountDetailsDao(cashMemoEntity.getDiscountItemAndDetailsMap().get(itemD.getId()))));
		}
		// print cash memo to verify if required
	}

	private void addFkValueToIssuePendingFocEntity(CashMemoEntity cashMemoEntity) {
		printCashMemoEntity(cashMemoEntity);
		SalesTxnDao salesTxn = cashMemoEntity.getCashMemo().getSalesTxnDao();
		if (cashMemoEntity.getCustomerTxn() != null)
			cashMemoEntity.getCustomerTxn().setSalesTxnDao(salesTxn);
		if (CollectionUtil.isNotEmpty(cashMemoEntity.getFocSchemes()))
			cashMemoEntity.getFocSchemes().forEach(fs -> fs.setSalesTxn(salesTxn));
		printCashMemoEntity(cashMemoEntity);
	}

	private FocDetailsAndSchemeDto getIssuedFocDetailsAmdSchemes(String salesTxnId) {

		List<FocDetailsDao> focDetails = focDetailsRepo.getBySalesTxnIdAndRefTxnAndStatus(salesTxnId,
				FocStatusEnum.ISSUED.name());
		List<FocSchemesDao> focSchemes = new ArrayList<>();
		if (CollectionUtil.isNotEmpty(focDetails)) {
			Set<String> schemeIds = focDetails.stream().map(fd -> fd.getFocScheme().getId())
					.collect(Collectors.toSet());
			focSchemes = focSchemeRepo.findByStatusAndIdIn(FocStatusEnum.ISSUED.name(), schemeIds);
		}
		return new FocDetailsAndSchemeDto(focDetails, focSchemes);
	}

	public List<FocSchemesDao> getFocSchemesByFocItemsIssued(List<FocDetailsDaoExt> focItems) {

		List<FocSchemesDao> focSchemes = null;
		if (!focItems.isEmpty()) {

			Set<String> focSchemesId = focItems.stream().map(detail -> detail.getFocScheme().getId())
					.collect(Collectors.toSet());
			focSchemes = focSchemeRepo.findByStatusAndIdIn(FocStatusEnum.ISSUED.name(), focSchemesId);
		}
		return focSchemes;
	}

	public BigDecimal getPriceRatio(BigDecimal num1, BigDecimal num2) {
		return new BigDecimal(100).multiply(num1.divide(num2, 11, DomainConstants.ROUNDIND_MODE)).setScale(3,DomainConstants.ROUNDIND_MODE);
		}

	private void mffDefectNotAllowedWoApprovalCheck(GRNCancellationTypeEnum cancelType) {
		if (cancelType == GRNCancellationTypeEnum.MFG_DEFECT)
			throw new ServiceException("Approval process is mandatory for manufacturing defect.", "ERR-SALE-123");
	}

	private void moreThanOneItemInApprovalCheck(GRNRequestDto grnRequestDto) {
		if (grnRequestDto.getItems().size() > 1)
			throw new ServiceException("Only one item can be sent in each request.", "ERR-SALE-201",
					grnRequestDto.getItems());
	}

	private void setQtyWeightValuesInCancel(List<CashMemoDetailsDao> items, List<CashMemoDetailsDao> itemsToReturn,
			BigDecimal finalVal, CancelDaoExt cancel) {

		// @formatter:off

		cancel.setTotalQuantity(itemsToReturn.stream().map(CashMemoDetailsDao::getTotalQuantity).reduce((short) 0,
				(x, y) -> (short) (x + y)));
		cancel.setTotalValue(finalVal);
		// total weight of items to return
		cancel.setTotalWeight(
				itemsToReturn.stream().map(CashMemoDetailsDao::getTotalWeight).reduce(BigDecimal.ZERO, BigDecimal::add)
						.setScale(DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
//		cancel.setTotalWeight(
//				items.stream().map(CashMemoDetailsDao::getTotalWeight).reduce(BigDecimal.ZERO, BigDecimal::add)
//						.setScale(DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));

		// @formatter:on
	}

	private void setQtyWeightValuesInCancels(List<CashMemoDetailsDao> items, List<CashMemoDetailsDao> itemsToReturn,
			BigDecimal finalVal, CancelDaoExt cancel, List<ReturnableItemsDto> item) {
		Map<String, ReturnableItemsDto> returnItems = new HashMap<>();
		for (ReturnableItemsDto cancels : item) {
			returnItems.put(cancels.getCashMemoDetailsId(), cancels);
		}
		long quantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		for (CashMemoDetailsDao cmd : itemsToReturn) {

			if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cmd.getProductGroupCode())) {
				quantity = quantity + (returnItems.get(cmd.getId()).getTotalQuantity());

				totalWeight = totalWeight.add(
						cmd.getTotalWeight().divide(BigDecimal.valueOf(cmd.getTotalQuantity()), RoundingMode.HALF_UP)
								.multiply(BigDecimal.valueOf(returnItems.get(cmd.getId()).getTotalQuantity())));
			} else {

				quantity = quantity + cmd.getTotalQuantity();

				totalWeight = totalWeight.add(cmd.getTotalWeight());
			}
			totalValue = finalVal;

		}
		cancel.setTotalQuantity((short) quantity);
		cancel.setTotalValue(totalValue);
		cancel.setTotalWeight(totalWeight);
	}

	private List<GrnDetailsDaoExt> saveGrnAndItemsEntity(SalesTxnDao salesTxn, List<CashMemoDetailsDao> itemsToReturn,
			CancelDaoExt cancel, BigDecimal focAmtToRecover, List<ReturnableItemsDto> cancelGRNDto) {
		Map<String, ReturnableItemsDto> returnedItems = new HashMap<>();
		for (ReturnableItemsDto returnableItems : cancelGRNDto) {
			returnedItems.put(returnableItems.getCashMemoDetailsId(), returnableItems);
		}
		CustomerTxnDao customerTxn = cashMemoEpossService.getCustomerTxnDetailsById(salesTxn.getId());

		GrnDaoExt grn = new GrnDaoExt();
		grn.setCancel(cancel);
		grn.setMetalRateDetails(salesTxn.getMetalRateDetails());
		grn.setSrcLocationCode(customerTxn.getLocationCode());
		grn.setFocRecoverValue(focAmtToRecover);

		grn = grnRepo.save(grn);

		// call inventory service to add item
		List<GrnDetailsDaoExt> grnItems = new ArrayList<>();
		for (CashMemoDetailsDao item : itemsToReturn) {
			ItemDetailsResponseDto itemDetails = getItemDetails(salesTxn.getId(), returnedItems.get(item.getId()));
			GrnDetailsDaoExt grnItem = (GrnDetailsDaoExt) MapperUtil.getDtoMapping(item, GrnDetailsDaoExt.class, "id",
					"inventoryId", "binCode");
			grnItem.setGrn(grn);
			grnItem.setCashMemoDetailsId(item.getId());
			grnItem.setTotalQuantity(itemDetails.getTotalQuantity());
			grnItem.setFinalValue(itemDetails.getFinalValue());
			grnItems.add(grnItem);
		}

		grnItems = grnDetailsRepo.saveAll(grnItems);
		return grnItems;
	}

	private String createWorkflowProcess(CancelDaoExt cancel, List<GrnDetailsDaoExt> grnItem, SalesTxnDaoExt salesTxn,
			GRNRequestDto grnRequestDto, List<CashMemoDetailsDao> itemsToReturn) {

		Map<String, CashMemoDetailsDao> itemDetailMap = itemsToReturn.stream()
				.collect(Collectors.toMap(CashMemoDetailsDao::getId, Function.identity()));

		// header data
		GoodsReturnReqHeaderDto header = new GoodsReturnReqHeaderDto();

		// sales txn data
		header.setRefId(salesTxn.getId());
		header.setRefDocNo(salesTxn.getDocNo());
		header.setRefTxnType(salesTxn.getTxnType());
		header.setRefSubTxnType(salesTxn.getSubTxnType());
		header.setSrcLocationCode(salesTxn.getLocationCode());

		// grn data
		header.setId(cancel.getId());
		header.setDocNo(cancel.getDocNo());
		header.setTxnType(cancel.getTxnType());
		header.setSubTxnType(cancel.getSubTxnType());
		header.setCancelType(cancel.getCancellationType());
		header.setCustomerId(cancel.getCustomerId());
		header.setCustomerName(customerService.getCustomer(cancel.getCustomerId()).getCustomerName());
		header.setDestLocationCode(cancel.getLocationCode());
		header.setReasonForCancellation(cancel.getReasonForCancellation());
		header.setTotalQuantity(cancel.getTotalQuantity());
		header.setTotalValue(cancel.getTotalValue());
		header.setTotalWeight(cancel.getTotalWeight());
		// @formatter:off
		header.setItems(
				grnItem.stream()
						.map(item -> new ItemLotGrnDto(item.getItemCode(), item.getLotNumber(),
								itemDetailMap.get(item.getCashMemoDetailsId()).getUnitValue()))
						.collect(Collectors.toList()));
		// @formatter:on

		// from DTO
		header.setApproverRoleCode(grnRequestDto.getApproverRoleCode());
		header.setApprovalCode(grnRequestDto.getApprovalCode());
		header.setCcafNo(grnRequestDto.getCcafNo());
		if (grnRequestDto.getApprovalDate() == null) {
			grnRequestDto.setApprovalDate(businessDayService.getBusinessDay().getBusinessDate());
		}
		header.setApprovalDate(grnRequestDto.getApprovalDate());

		// filter values
		// @formatter:off
		Map<String, String> filterValues = new LinkedHashMap<>();
		filterValues.put("grnType", grnRequestDto.getCancelType());
		filterValues.put("srcLocationCode", salesTxn.getLocationCode());
		filterValues.put(LOCATION_CODE, CommonUtil.getLocationCode());
		filterValues.put("refDocNo", String.valueOf(salesTxn.getDocNo()));
		// @formatter:on

		ReqApprovalDetailsDto reqApprovalDto = epossCallService.createWorkflowProcess(
				new JsonData("GOODS_RETURN_HEADER", header), new JsonData("GOODS_RETURN_DETAILS", null), filterValues,
				grnRequestDto.getRequestorRemarks(), WorkflowTypeEnum.GOODS_RETURN);

		cancel.setCancellationDetails(MapperUtil.getStringFromJson(reqApprovalDto));

		return String.valueOf(reqApprovalDto.getRequestNo());
	}

	private CancelDaoExt createCancelObj(BaseCancelGRNDto baseCancelGRNDto, String remarks,
			GRNCancellationTypeEnum cancelType, SalesTxnDao salesTxn, TxnStatusCancelEnum txnStatus, Date businessDay,
			Integer customerId) {
		CancelDaoExt cancel = new CancelDaoExt();
		cancel.setCancelledTime(CalendarUtils.getCurrentDate());
		cancel.setRefSalesTxn((SalesTxnDaoExt) MapperUtil.getDtoMapping(salesTxn, SalesTxnDaoExt.class));
		cancel.setCurrencyCode(salesTxn.getCurrencyCode());
		cancel.setWeightUnit(salesTxn.getWeightUnit());
		cancel.setStatus(txnStatus.name());
		cancel.setTotalValue(BigDecimal.ZERO);
		cancel.setTotalWeight(BigDecimal.ZERO);
		cancel.setTotalQuantity((short) 0);
		cancel.setRemarks(remarks);
		cancel.setReasonForCancellation((StringUtils.isBlank(baseCancelGRNDto.getReasonForCancellation())
				&& cancelType == GRNCancellationTypeEnum.MFG_DEFECT) ? GRNCancellationTypeEnum.MFG_DEFECT.name()
						: baseCancelGRNDto.getReasonForCancellation());
		cancel.setEmployeeCode(CommonUtil.getUserName());
		cancel.setTxnType(TxnTypeCancelEnum.GRN.name());
		cancel.setSubTxnType(SubTxnTypeCancelEnum.CASH_MEMO.name());
		cancel.setCancellationType(cancelType.name());

		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails();

		// get doc no
		cancel.setDocNo(
				salesDocService.getDocNumber(SalesDocTypeEnum.GRN, countryDetailsDto.getFiscalYear().shortValue()));
		cancel.setDocDate(businessDay);
		// set fiscal year
		cancel.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		cancel.setLocationCode(CommonUtil.getStoreCode());
		cancel.setCustomerId(customerId);
		return cancel;
	}

	private void verifyIfCashMemoAndConfirmed(SalesTxnDao salesTxn) {
		if (!salesTxn.getTxnType().equals(TransactionTypeEnum.CM.name())
				|| salesTxn.getSubTxnType().equals(SubTxnTypeEnum.GIFT_SALE.name())
				|| !salesTxn.getStatus().equals(TransactionStatusEnum.CONFIRMED.name())) {
			if (!salesTxn.getStatus().equals(TransactionStatusEnum.CONFIRMED.name())) {
				throw new ServiceException(" Bill cancellation done, cash memo is {status}", "ERR-SALE-421",
						Map.of("status", salesTxn.getStatus()));
			}
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070,
					salesTxn.getTxnType() + " : " + salesTxn.getSubTxnType() + " : " + salesTxn.getStatus());
		}
	}

	private List<PaymentDetailsDao> getCompletedPaymentById(String id) {
		return paymentDetailsRepo.getBySalesTxnDaoIdAndStatus(id, PaymentStatusEnum.COMPLETED.name());
	}

	private void updatePayment(CancelGRNResponseDto cancelResponse, String refId, BigDecimal totalAmountToReturn,
			BigDecimal pctOfAmtToBeReturned, SalesTxnDaoExt salesTxn, CancelDaoExt cancel, GrnCnDetails grnCn,
			FocSchemeAllDto grnFocSchemeCnDetails, BigDecimal grnTotalWeight, JsonData discountJson) {

		List<PaymentDetailsDao> payments = getCompletedPaymentById(refId);

		BigDecimal loyaltyAmtReversed = BigDecimal.ZERO;

		if (salesTxn.getTxnSource() != null && salesTxn.getTxnSource().equals("LEGACY")) {
			List<CashMemoDetailsDaoExt> cashMemoDetails = cashMemoDetailsRepoExt.findByCashMemoDaoId(salesTxn.getId());
			for (PaymentDetailsDao payment : payments) {
				BigDecimal amtToBeReversed = BigDecimal.ZERO;
				if (payment.getPaymentCode().equals(PaymentCodeEnum.ENCIRCLE.getPaymentcode())
						&& !cashMemoDetails.isEmpty()) {
					for (CashMemoDetailsDaoExt cashMemoDetailsDaoExt : cashMemoDetails) {
						for (String id : grnCn.getReturningItemIds()) {
							if (cashMemoDetailsDaoExt.getId().equalsIgnoreCase(id)) {
								LegacyCmDetailsDto legacyCMDetails = MapperUtil.mapObjToClass(
										cashMemoDetailsDaoExt.getLegacyCmDetails(), LegacyCmDetailsDto.class);
								if (legacyCMDetails != null && legacyCMDetails.getEncirclePoints() != null) {
									amtToBeReversed = amtToBeReversed
											.add(new BigDecimal(legacyCMDetails.getEncirclePoints()));
								}
							}
						}
					}
					loyaltyAmtReversed = loyaltyAmtReversed.add(getLoyalityAmountReversal(payment, amtToBeReversed));
				}

			}

		} else {

			for (PaymentDetailsDao payment : payments) {
				BigDecimal amtToBeReversed = BigDecimal.ZERO;
				if (payment.getPaymentCode().equals(PaymentCodeEnum.ENCIRCLE.getPaymentcode())) {

					List<PaymentItemMappingDaoExt> paymentItemMappingList = paymentItemMappingRepository
							.findByPaymentDetailsDaoIdAndItemIdIn(payment.getId(), grnCn.getReturningItemIds());
					if (!CollectionUtil.isEmpty(paymentItemMappingList)) {

						for (PaymentItemMappingDaoExt paymentItemMappingDaoExt : paymentItemMappingList) {
							amtToBeReversed = amtToBeReversed.add(paymentItemMappingDaoExt.getAmount());

						}

					}
					loyaltyAmtReversed = loyaltyAmtReversed.add(getLoyalityAmountReversal(payment, amtToBeReversed));
				}

			}
		}
		BigDecimal cnAmt = totalAmountToReturn.subtract(loyaltyAmtReversed);

		// cash collected
		BigDecimal totalCashCollected = getCashCollected(pctOfAmtToBeReturned, cancel, payments);

		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(cnAmt);
		cnAmt = cnAmt.add(roundingVariance);

		// Start of TCS Credit Note
		AtomicReference<BigDecimal> tcsCNAmt = new AtomicReference<BigDecimal>();
		tcsCNAmt.set(BigDecimal.ZERO);

		Optional<CashMemoDao> cashMemoDao = cashMemoRepository.findById(salesTxn.getId());
		cashMemoDao.ifPresent(cashmemo -> {
			Optional.ofNullable(cashmemo.getTcsAmount()).ifPresent(tcsAmount -> {
				if (tcsAmount.compareTo(BigDecimal.ZERO) > 0) {
					if (tcsAmount.compareTo(BigDecimal.ZERO) > 0) {
						if (getTcsRefundAmount(cashmemo).compareTo(BigDecimal.ZERO) > 0) {
							if (salesTxn.getTxnSource() != null
									&& salesTxn.getTxnSource().toString().equals("LEGACY")) {
								tcsCNAmt.set(cashmemo.getTcsAmount());
							} else {
								CustomerTcsDetailsDaoExt customerTcsDetailsDao = customerTcsDetailsRepository
										.findBySalesTxnDaoId(salesTxn.getId());
								if (customerTcsDetailsDao != null) {
									BigDecimal netInvoiceAmount = customerTcsDetailsDao.getNetInvoiceAmount();
									BigDecimal tcsCollected = customerTcsDetailsDao.getTcsAmountPaid();

									BigDecimal tcsAmt = BigDecimal.ZERO;
									if (totalAmountToReturn.compareTo(netInvoiceAmount) == 0) {
										tcsAmt = tcsCollected;
									} else {
										tcsAmt = totalAmountToReturn.divide(netInvoiceAmount, 2, RoundingMode.HALF_UP);
										tcsAmt = tcsAmt.multiply(new BigDecimal(100));
										tcsAmt = tcsCollected.multiply(tcsAmt);
										tcsAmt = tcsAmt.divide(new BigDecimal(100));
										BigDecimal tcsRoundingVariance = commonTransactionService
												.getRoundingVariance(tcsAmt);
										tcsAmt = tcsAmt.add(tcsRoundingVariance);
									}

									tcsCNAmt.set(tcsAmt);
								}

							}

						}
					}
				}
			});
		});
		log.info("discountJson: {}", discountJson);
		cnAmt = cnAmt.add(tcsCNAmt.get());

		// substract void amount from cnAmt for is_void=true
		// shouldn't generate CN incase cnAMt =0
		for (PaymentDetailsDao paymentDetailsDao : payments) {

			if (BooleanUtils.isTrue(paymentDetailsDao.getIsVoid())
					&& paymentDetailsDao.getPaymentCode().equals(PaymentCodeEnum.UNIPAY.name())) {
				cnAmt = cnAmt.subtract(paymentDetailsDao.getAmount());
			}
		}

		// This is to conditon check to restrict from CN generation when cnAmt =0
		if (cnAmt == BigDecimal.ZERO) {
			return;

		}

		// End Of TCS Credit Note
		CreditNoteIndvCreateDto cnIndv = new CreditNoteIndvCreateDto(cnAmt, totalCashCollected);
		cnIndv.setOriginalDocDate(salesTxn.getDocDate());
		cnIndv.setGrnDetails(new JsonData("GRN", grnCn));
		cnIndv.setGrnFocDetails(new JsonData("GRN_FOC", grnFocSchemeCnDetails));
		cnIndv.setDiscountDetails(discountJson);

		getGepConfigIdForCnDiscount(discountJson, cnIndv);

		if (grnTotalWeight.signum() > 0 && BooleanUtils.isNotFalse(grnCn.getIsCMGoldRate())) {
			FrozenRatesDetails frd = new FrozenRatesDetails();
			frd.setMetal(MetalTypeCodeEnum.J.name());
			MetalRateListDto savedMetalRateListDto = MapperUtil.mapObjToClass(salesTxn.getMetalRateDetails(),
					MetalRateListDto.class);
			frd.setRatePerUnit(savedMetalRateListDto.getMetalRates().get(frd.getMetal()).getRatePerUnit());
			frd.setWeight(grnTotalWeight.setScale(DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
			cnIndv.setFrozenRateDetails(MapperUtil.getStringFromJson(new JsonData("FROZEN_RATE_DETAILS", frd)));
		}

		Map<String, Integer> docNos = paymentUtil.createCN(CNType.GRN, List.of(cnIndv),
				(SalesTxnDaoExt) MapperUtil.getDtoMapping(salesTxn, SalesTxnDaoExt.class), cancel, null, null);

		// Adding GRN CN docs with key value pairs
		Map<String, String> cNDocTypes = new HashMap<>();
		Optional.ofNullable(docNos).ifPresent(cnDocs -> {
			cNDocTypes.put(CNType.GRN.name(),
					cnDocs.entrySet().stream().map(e -> String.valueOf(e.getValue())).collect(Collectors.joining(",")));
		});

		cancelResponse.setLoyaltyReversalPoint(loyaltyAmtReversed);
		cancelResponse.setCNdocNos(docNos);
		// cancelResponse.setCNDocTypes(cNDocTypes);
		cancelResponse.setCnAmt(cnAmt);

	}

	private void getGepConfigIdForCnDiscount(JsonData discountJson, CreditNoteIndvCreateDto cnIndv) {
		if (!StringUtil.isBlankJsonData(discountJson)) {
			CreditNoteDiscountDetailsDto cnDiscount = MapperUtil.mapObjToClass(discountJson.getData(),
					CreditNoteDiscountDetailsDto.class);
			if (!CollectionUtil.isEmpty(cnDiscount.getGepPurityDiscount())) {
				GepConfigDetailsDaoExt gepConfigId = new GepConfigDetailsDaoExt();
				gepConfigId.setId(cnDiscount.getGepPurityDiscount().get(0).getGepConfigDetailsId());
				cnIndv.setGepConfigDetailsDao(gepConfigId);
			}
		}
	}

	/**
	 * @param amtToBeReversed
	 * @param payment
	 * @return
	 */
	private BigDecimal getLoyalityAmountReversal(PaymentDetailsDao payment, BigDecimal amtToBeReversed) {

		amtToBeReversed = amtToBeReversed.setScale(0, RoundingMode.DOWN);

		// call integration API to redeem reversal
		UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto = new UlpReverseRedeemedLoyaltyPointsDto();
		reverseRedeemLoyaltyPointsDto.setUlpId(payment.getInstrumentNo());// instrumentNo = customer ulp id
		reverseRedeemLoyaltyPointsDto.setRedeemedPoints(amtToBeReversed.intValue());
		reverseRedeemLoyaltyPointsDto.setRefernceNumber(payment.getReference1());

		UlpReverseRedeemResponseDto ulpReverseRedeemResponseDto = intgService
				.reverseRedeemedLoyaltyPoints(VendorCodeEnum.ULP_NETCARROTS.name(), reverseRedeemLoyaltyPointsDto);

		// check response code
		if (!"0".equals(ulpReverseRedeemResponseDto.getResponseCode())) {
			log.error("loyalty amount reversed failed for payment: {}, with amount: {}, with txnId: {}",
					payment.getId(), amtToBeReversed, ulpReverseRedeemResponseDto.getReferenceNumber());
			throw new ServiceException("Loyalty redeem reversal failed.", "ERR-SALE-122",
					ulpReverseRedeemResponseDto.getResponseCode() + "( "
							+ ulpReverseRedeemResponseDto.getResponseMessage() + " )");
		} else {
			log.info("loyalty amount reversed successed for payment: {}, with amount: {}, with txnId: {}",
					payment.getId(), amtToBeReversed, ulpReverseRedeemResponseDto.getReferenceNumber());
		}

		return amtToBeReversed;
	}

	/**
	 * @param pctOfAmtToBeReturned
	 * @param cancel
	 * @param payments
	 * @return
	 */
	private BigDecimal getCashCollected(BigDecimal pctOfAmtToBeReturned, CancelDaoExt cancel,
			List<PaymentDetailsDao> payments) {
		// cash collected
		// filter payments where cash collected is not null.
		List<PaymentDetailsDao> paymentsWithCash = payments.stream()
				.filter(paymentDao -> paymentDao.getCashCollected() != null
						&& BigDecimal.ZERO.compareTo(paymentDao.getCashCollected()) < 0)
				.collect(Collectors.toList());

		BigDecimal totalCashCollected = BigDecimal.ZERO;
		if (!CollectionUtil.isEmpty(paymentsWithCash)) {
			totalCashCollected = paymentsWithCash.stream().map(PaymentDetailsDao::getCashCollected)
					.reduce(BigDecimal.ZERO, BigDecimal::add);
			totalCashCollected = totalCashCollected.multiply(pctOfAmtToBeReturned.divide(new BigDecimal(100)))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
			log.info("totalCashCollected--------------{}", totalCashCollected);

		}
		return totalCashCollected;
	}

	private BigDecimal getFinalAmountFromListDetails(List<CashMemoDetailsDao> items) {
		return items.stream().map(CashMemoDetailsDao::getFinalValue).reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	@Override
	public ListResponse<String> listItemIdsAllowedForGRN(String cmId) {

		grnDetailsRepo.getReturnableItems(cmId).stream().map(obj -> (String) obj[0]).collect(Collectors.toList());
		List<Object[]> itemObj = grnDetailsRepo.getReturnableItems(cmId);
		return getListResponseOfIdFromListObject(itemObj);
	}

	public List<ReturnableItemsDto> listReturnedItemIdsForGRN(String cmId) {
//		List<ReturnableItemsDto> returnedItems =grnDetailsRepo.getReturnedItems(cmId); 
//		for(ReturnableItemsDto returnedItem :returnedItems) {
//			List<GrnDetailsDaoExt> items = grnDetailsRepo.findByCashMemoDetailsId(returnedItem.getCashMemoDetailsId());
//			for(GrnDetailsDaoExt item : items) {
//				CancelDaoExt cancelDao = cancelRepo.findOneById(item.getGrn().getId());
//				if(TxnStatusCancelEnum.PENDING.name().equals(cancelDao.getStatus())) {
//					CancelDaoExt cancel = checkReqStatus(cancelDao);
////					if(TxnStatusCancelEnum.REJECTED.name().equals(cancelao.getStatus)) {
////						
////					}
//				}
//			}
//		}
		List<CancelDaoExt> returnedItems = grnDetailsRepo.getPendingGrn(cmId);
		List<CancelDaoExt> cancelDaoList = new ArrayList<>();
		for (CancelDaoExt id : returnedItems) {

			if (TxnStatusCancelEnum.PENDING.name().equals(id.getStatus())) {
				CancelDaoExt cancel = checkReqStatus(id);
				if (TxnStatusCancelEnum.REJECTED.name().equals(cancel.getStatus())) {
					cancelDaoList.add(cancel);
				}
			}
		}
		if (!cancelDaoList.isEmpty()) {
			cancelRepo.saveAll(cancelDaoList);
		}
		List<ReturnableItemsDto> returnableItems = grnDetailsRepo.getReturnedItems(cmId);
		return returnableItems;
	}

	@Override
	public List<ReturnableItemsDto> listReturnableItems(String cmId) {
		List<ReturnableItemsDto> returnedItems = listReturnedItemIdsForGRN(cmId);
//		for(ReturnableItemsDto items: returnedItems) {
//			System.out.println("the response of returnedItems"+items);
//		}

		return (listReturnedItemIdsForGRN(cmId));
	}

	private List<String> getListOfIdFromListObject(List<Object[]> itemObj) {
		return itemObj.stream().map(obj -> (String) obj[0]).collect(Collectors.toList());
	}

	private ListResponse<String> getListResponseOfIdFromListObject(List<Object[]> itemObj) {
		return new ListResponse<>(getListOfIdFromListObject(itemObj));
	}

	public List<GRNItemDetailsDto> listItemAllowedForGRN(String cmId) {

		List<GRNItemDetailsDto> grnItems = new ArrayList<>();
		List<Object[]> grnItemsObj = grnDetailsRepo.getReturnableItems(cmId);

		for (Object[] object : grnItemsObj) {
			// call convertObjectToDto() to get the mapped DTO
			GRNItemDetailsDto item = new GRNItemDetailsDto();
			item.setId((String) object[0]);
			item.setRowId((Integer) object[1]);
			item.setItemCode((String) object[2]);
			item.setLotNumber((String) object[3]);
			item.setTotalQuantity((Short) object[4]);
			item.setInventoryWeight((BigDecimal) object[5]);
			item.setUnitValue((BigDecimal) object[6]);
			item.setTotalWeight((BigDecimal) object[7]);
			item.setTotalValue((BigDecimal) object[8]);
			item.setEmployeeCode((String) object[9]);
			item.setTotalTax((BigDecimal) object[10]);
			item.setTotalDiscount((BigDecimal) object[11]);
			item.setFinalValue((BigDecimal) object[12]);
			item.setHallmarkCharges((BigDecimal) object[13]);
			item.setHallmarkDiscount((BigDecimal) object[14]);

			grnItems.add(item);
		}

		return grnItems;
	}

	// =================DB GET CALL START=================
	public CashMemoDao getByCashMemoIdWithErrorCheck(String cmId) {

		Optional<CashMemoDao> cashMemos = cashMemoRepo.findById(cmId);

		if (!cashMemos.isPresent())
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070);

		return cashMemos.get();
	}

	private List<InventoryDetailsDao> inventoryItemAddAndUpdateInvId(SalesTxnDaoExt salesTxn,
			List<CashMemoDetailsDao> cmItemsToReturn,
//			List<FocDetailsDao> focDetails, 
			CancelDaoExt cancel, List<GrnDetailsDaoExt> grnItems) {
		Map<String, CashMemoDetailsDao> itemDetails = new HashMap<>();
		Map<String, GrnDetailsDaoExt>  grnItemDetails = new HashMap<>();
		for (GrnDetailsDaoExt grnItem : grnItems) {
			CashMemoDetailsDao item = cashMemoDetailsRepo.getOne(grnItem.getCashMemoDetailsId());
			itemDetails.put(grnItem.getCashMemoDetailsId(), item);
			grnItemDetails.put(grnItem.getCashMemoDetailsId(),grnItem);
		}
		List<InventoryDetailsDao> newInvItems = inventoryUtil.createInventoryEntityFromCashMemoDetails(cmItemsToReturn,
				null, salesTxn, SalesDocTypeEnum.GRN, cancel.getCancellationType(), cancel.getDocNo(),
				cancel.getFiscalYear(),grnItemDetails);
		
		for (GrnDetailsDaoExt grnItem : grnItems) {

			for (InventoryDetailsDao invItem : newInvItems) {

				if (grnItem.getItemCode().equals(invItem.getItemCode())) {
					Boolean isMatchAndBlankLot = null;

					if (grnItem.getLotNumber() == null) {
						isMatchAndBlankLot = true;
					} else if (grnItem.getLotNumber().equals(invItem.getLotNumber())) {
						isMatchAndBlankLot = false;
					}
					// lot no null or same
					if (isMatchAndBlankLot != null) {
						grnItem.setBinCode(invItem.getBinCode());
						grnItem.setInventoryId(invItem.getId());

						// if blank lot, set inventory one
						updateLotNoIfBlank(grnItem, invItem, isMatchAndBlankLot);
//						break;
					}
				}
			}
		}
		grnDetailsRepo.saveAll(grnItems);
		return newInvItems;
	}

	private void updateLotNoIfBlank(GrnDetailsDaoExt grnItem, InventoryDetailsDao invItem, Boolean isMatchAndBlankLot) {
		// if lot no empty, override lot no also
		if (isMatchAndBlankLot)
			grnItem.setLotNumber(invItem.getLotNumber());
	}

	/**
	 * check items to return are whether allowed to return for items, FOC items
	 * 
	 * This check is based on quantity which is not returned till now
	 * 
	 * @param cmId
	 * @param itemsToReturn
	 */
	private List<ReturnableItemsDto> verifyGrnElligibleItem(String cmId, Set<String> itemsToReturn) {

		List<ReturnableItemsDto> returnableItems = getGRNReturnableItems(cmId);
		Set<String> returnItemId = new HashSet<>();
		for (ReturnableItemsDto id : returnableItems) {
			returnItemId.add(id.getCashMemoDetailsId());
		}
		// if no item returnable or all item trying to return should come under GRN
		// returnable item list
		Collection<String> itemIdsReturned = CollectionUtil.getCommonElement(new HashSet<>(returnItemId),
				itemsToReturn);
		if (!itemIdsReturned.isEmpty()) {

			for (ReturnableItemsDto id : returnableItems) {

				if (itemIdsReturned.contains(id.getCashMemoDetailsId())) {
					CashMemoDetailsDao items = cashMemoDetailsRepo.getOne(id.getCashMemoDetailsId());
					if (items.getTotalQuantity() <= grnDetailsRepo.getReturnedQuantity(id.getCashMemoDetailsId())) {
						throw new ServiceException("Some provided item(s) are returned already.", "ERR-SALE-135",
								"Returnable Item Ids: " + returnableItems);
					}
				}
			}

		}

		return returnableItems;
	}

	private List<ReturnableItemsDto> getGRNReturnableItems(String cmId) {

		List<ReturnableItemsDto> returnableItems;

		if (CommonUtil.isEpossApp())
			returnableItems = listReturnableItems(cmId);
		else {
			returnableItems = getEpossGRNReturnableItemsByCmId(cmId);
			List<ReturnableItemsDto> returnableItemsPoss = listReturnableItems(cmId);
			returnableItems.addAll(returnableItemsPoss);

			// @formatter:off
//			System.out.println("Retrieving eposs items.");
//			CompletableFuture<ReturnableItemsDto> completableFutureEpossData 
//					= CompletableFuture.supplyAsync(() -> getEpossGRNReturnableItemsByCmId(cmId));
//
//			System.out.println("Retrieving poss items.");
//			CompletableFuture<ReturnableItemsDto> completableFuturePossData 
//					= CompletableFuture.supplyAsync(() -> listReturnableItems(cmId));
//
//			System.out.println("Calculating final items.");
//			CompletableFuture<ReturnableItemsDto> combinedFuture = completableFutureEpossData
//					.thenCombine(completableFuturePossData, (epossReturnedItems, possReturnedItems) -> {
//						System.out.println("Eposs Data: " + epossRe	turnedItems);
//						System.out.println("Poss Data: " + possReturnedItems);
//						epossReturnedItems.getReturnedItemIds().addAll(possReturnedItems.getReturnedItemIds());
//						System.out.println("Final Data: " + epossReturnedItems);
//						return epossReturnedItems;
//					});
			// @formatter:on

//			try {
//				returnableItems = combinedFuture.get();
//			} catch (Exception e) {
//				e.printStackTrace();
//				throw new ServiceException("Internal Server Error", "ERR-CORE-037", e);
//			}
		}
		return returnableItems;
	}

	private List<ReturnableItemsDto> getEpossGRNReturnableItemsByCmId(String txnId) {

		Map<String, String> reqParams = Map.of("cmId", txnId, TXN_TYPE, TxnTypeCancelEnum.GRN.name());

		/*
		 * return epossCallService.callEposs(HttpMethod.GET,
		 * SalesUtil.SALES_BASE_SERVICE_URL + EPOSS_CM_BASE_URL + "/items", reqParams,
		 * null, ReturnableItemsDto.class);
		 */
		return cashMemoEpossServiceImpl.listItemIdAllowedForReturn(txnId, TxnTypeCancelEnum.GRN.name());
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void closeCancelDao(CancelDaoExt cancel, WorkflowProcessStatusEnum workflowStatus) {

		TxnStatusCancelEnum status = null;

		if (workflowStatus == WorkflowProcessStatusEnum.REJECTED)
			status = TxnStatusCancelEnum.REJECTED;

		if (status != null) {
			cancel.setStatus(status.name());
			cancelRepo.save(cancel);
		}
	}

	private GrnDaoExt getGRNWithErrorCheck(String id) {

		Optional<GrnDaoExt> grns = grnRepo.findByIdAndCancelLocationCode(id, CommonUtil.getStoreCode());

		if (!grns.isPresent())
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070);

		return grns.get();
	}

	// =================INTERNAL METHOD END=================

	// =================CONFIG CHECK START=================
	private void validateGrnDates(Date purchasedDate, GRNCancellationTypeEnum cancelType, String processType,
			GrnDetails locationGRNConfig, Date businessDay) {

		businessDay = CalendarUtils.getStartOfDay(getBusinessDayIfNull(businessDay));
		purchasedDate = CalendarUtils.getStartOfDay(purchasedDate);
		long noOfDaysBetween = CalendarUtils.getDayDiff(purchasedDate, businessDay);

		if ((processType.equals(CONFIRM_WO_APPROVAL) || processType.equals(REQUEST_OR_CONFIRM_APPROVAL))
				&& locationGRNConfig == null) {
			locationGRNConfig = getLocationGRNConfiguration();
		}

		// if initiate (1:MAX)
		// if confirm w/o approval (1 : noOfDaysGRNAllowed )
		// if confirm w approval
// 			(regular: (noOfDaysGRNAllowed+1 : maximumNoOfDaysForApprovedGRN), mfg : ( 1 :MAX))

		if (processType.equals(INITIATE_GRN)) {
			verifyIfCmOfSameDay(noOfDaysBetween);
		} else {
			verifyCmDateRange(cancelType, processType, locationGRNConfig, noOfDaysBetween, purchasedDate, businessDay);
		}
	}

	private void verifyCmDateRange(GRNCancellationTypeEnum cancelType, String processType, GrnDetails locationGRNConfig,
			long noOfDaysBetween, Date purchasedDate, Date businessDay) {

		int startRange = 1;
		int endRange = Integer.MAX_VALUE;
		if (processType.equals(CONFIRM_WO_APPROVAL)) {
			endRange = locationGRNConfig.getNoOfDaysGRNAllowed();
		} else if (processType.equals(REQUEST_OR_CONFIRM_APPROVAL)) {
			if (cancelType == null)
				return;
			else if (cancelType == GRNCancellationTypeEnum.REGULAR_GRN) {
				startRange = locationGRNConfig.getNoOfDaysGRNAllowed() + 1;
				endRange = locationGRNConfig.getMaximumNoOfDaysForApprovedGRN();
			} else if (cancelType == GRNCancellationTypeEnum.MFG_DEFECT) {
				endRange = Integer.MAX_VALUE; // max as manufacturing defect can be requested any time
			}

		}

		if (!(startRange <= noOfDaysBetween && noOfDaysBetween <= endRange)) {

			if (cancelType == null) // INITIATE GRN
				throw new ServiceException("GRN iOs not allowed based on date range validation.", "ERR-SALE-125",
						"Not within range of " + startRange + " & " + endRange
								+ ". No of days passed as per business date: " + noOfDaysBetween);
			else {
				log.debug("CM doc date: {}, Business day: {}, difference: {}, cancelType: {}, rage: <{} - {}>,",
						CalendarUtils.formatToDisplayDate(purchasedDate),
						CalendarUtils.formatToDisplayDate(businessDay), noOfDaysBetween, cancelType, startRange,
						endRange);
				throw new ServiceException("GRN is not allowed in this process based on date range validation.",
						"ERR-SALE-124", "Not within range of " + startRange + " & " + endRange
								+ ". No of days passed as per business date: " + noOfDaysBetween);
			}

		}
	}

	private void verifyIfCmOfSameDay(long noOfDaysBetween) {
		if (noOfDaysBetween == 0)
			throw new ServiceException("GRN can't be done on same day.", "ERR-SALE-210",
					"CM is not allowed for GRN on same business day.");
	}

	private void checkIfValidConfig(Object obj, String config) {

		// validate all field
		Map<String, String> fieldError = JsonUtils.getFieldError(obj, obj.getClass());

		if (!fieldError.isEmpty()) {
			Map<Object, Object> mapObj = new LinkedHashMap<>();
			mapObj.put("fieldError", fieldError);
			mapObj.put("config", config);
			throw new ServiceException("Invalid GRN configuration", "ERR_SALE_163", mapObj);
		}

	}

	private void checkIfInterOwnerTypeAllowed(String srcLoc) {

		// FEIGN CLIENT CALL
		Object ruleFieldValues = engineService.getRuleFieldValues(RuleTypeEnum.GRN_INTER_OWNER_TYPE,
				new RuleRequestListDto());
		GRNOwnerTypeConfigDto grnConfig = MapperUtil.mapObjToClass(ruleFieldValues, GRNOwnerTypeConfigDto.class);

		// validate all field
		checkIfValidConfig(grnConfig, RuleTypeEnum.GRN_INTER_OWNER_TYPE.name());

		LocationCacheDto srcLocationDetails = locationService.getLocationDetails(srcLoc);
		LocationCacheDto destLocationDetails = locationService.getLocationDetails(CommonUtil.getLocationCode());

		Map<String, List<String>> interOwnerTypes = grnConfig.getConfig();

		if (interOwnerTypes == null || interOwnerTypes.isEmpty())
			throw new ServiceException(GRN_NOT_ALLOWED_INTERBTQ_OWNERTYPE_CONFIG, ERR_SALE_134, interOwnerTypes);

		List<String> destOwnerTypeAllowed = interOwnerTypes.get(srcLocationDetails.getOwnerTypeCode());

		// if srcType to no owner type mapped, then allow
		if (CollectionUtils.isEmpty(destOwnerTypeAllowed))
			throw new ServiceException(GRN_NOT_ALLOWED_INTERBTQ_OWNERTYPE_CONFIG, ERR_SALE_134,
					srcLocationDetails.getOwnerTypeCode() + " : " + destLocationDetails.getOwnerTypeCode()
							+ " related config not available.");

		if (!destOwnerTypeAllowed.contains(destLocationDetails.getOwnerTypeCode()))
			throw new ServiceException(GRN_NOT_ALLOWED_INTERBTQ_OWNERTYPE_CONFIG, ERR_SALE_134,
					"Allowed destination owner type: " + destOwnerTypeAllowed);

	}

	private GrnDetails getLocationGRNConfiguration() {

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		GrnDetails grnDetails = locationCacheDto.getGrnDetails();

		if (grnDetails == null)
			throw new ServiceException(GRN_CONFIG_NOT_THERE, ERR_SALE_126, LOCAL_GRN_CONFIG);

		// validate all field
		checkIfValidConfig(grnDetails, LOCAL_GRN_CONFIG);

		return grnDetails;
	}

	private GrnDetails checkConfigIfInterBtqAllowed() {
		GrnDetails grnDetails = getLocationGRNConfiguration();
		if (!grnDetails.getIsInterBoutiqueGRNAllowed())
			throw new ServiceException("Inter boutique GRN is not allowed", "ERR-SALE-128",
					"isInterBoutiqueGRNAllowed? " + grnDetails.getIsInterBoutiqueGRNAllowed());

		return grnDetails;
	}

	/**
	 * This method check if CM exist, if txn is allowed to return, GRN config check
	 * (inter boutique, date range) then to check if item & quantities are not
	 * returned
	 * 
	 * @param cmId
	 * @param cancelType
	 * @param processType
	 * @param itemIdsToReturn
	 * @return GRNDtoSalesTxnItemsBusinessDay
	 */
	private GRNDtoSalesTxnItemsBusinessDay validateCashMemoItemsAndConfigBasic(String cmId,
			GRNCancellationTypeEnum cancelType, String processType, Set<String> itemIdsToReturn) {

		log.info("List of item IDs to Return........................{}", itemIdsToReturn);
		CashMemoDao cashMemo = getByCashMemoIdWithErrorCheck(cmId);
		SalesTxnDao salesTxn = cashMemo.getSalesTxnDao();
		SalesTxnDaoExt salesTxnExt = (SalesTxnDaoExt) MapperUtil.getDtoMapping(salesTxn, SalesTxnDaoExt.class);

		verifyIfCashMemoAndConfirmed(salesTxn);

		boolean isDiffStore = isDiffStore(salesTxn.getLocationCode());

		Date businessDay = commonConfigCheckAndCustomerValidation(cancelType, salesTxn, isDiffStore, processType, null);

		List<CashMemoDetailsDao> items = cashMemoDetailsRepo.findByCashMemoDaoId(cmId);
		// @formatter:off
		// List<CashMemoDetailsDao> itemsToReturn = items.stream().filter(cmd ->
		// itemIdsToReturn.contains(cmd.getId()))
		// .collect(Collectors.toList());

		List<CashMemoDetailsDao> itemsToReturn = new ArrayList<CashMemoDetailsDao>();
		for (CashMemoDetailsDao cmd : items) {
			if (itemIdsToReturn.contains(cmd.getId()) || itemIdsToReturn.contains(cmd.getId().toLowerCase())) {
				itemsToReturn.add(cmd);
			}
		}

		// @formatter:on
		log.info("Items value " + items.toString());
		log.info("Items to Return whole " + itemsToReturn.toString());
		log.info("Items to return from CM " + itemsToReturn);
		log.info("Items to return size from CM " + itemsToReturn.size());
		log.info("Item Id's to return size " + itemIdsToReturn.size());

		// if some items in input, not belong to this txn, size will be less
		if (itemsToReturn.size() < itemIdsToReturn.size())
			throw new ServiceException(ITEMS_NOT_BELONG_TO_TXN_ID, ERR_SALE_121,
					"Some cash memo items does not belong to this txn");

		// validation of item are returnable
		List<ReturnableItemsDto> returnableItems = verifyGrnElligibleItem(cmId, itemIdsToReturn);
		// validation of FOC allowed to return or not

		return new GRNDtoSalesTxnItemsBusinessDay(salesTxn, salesTxnExt, businessDay, items, itemsToReturn,
				returnableItems);
	}

	/**
	 * @param grnRequestDto
	 * @param businessDay
	 * @param docDate
	 * @param totalValue
	 */
	private void verifyApproverRoleAndTypeConfig(GRNRequestDto grnRequestDto, BigDecimal totalValue,
			Short noOfDaysPassed) {

		GRNCancellationTypeEnum cancelType = GRNCancellationTypeEnum.valueOf(grnRequestDto.getCancelType());

		RuleTypeEnum ruleType = (cancelType == GRNCancellationTypeEnum.REGULAR_GRN)
				? RuleTypeEnum.GRN_APPROVAL_ACCESS_REGULAR
				: RuleTypeEnum.GRN_APPROVAL_ACCESS_MFG_DEFECT;

		// FEIGN CLIENT CALL
		RuleRequestListDto filter = new RuleRequestListDto();
		filter.setLocationCode(CommonUtil.getStoreCode());
		Object ruleFieldValues = engineService.getRuleFieldValues(ruleType, filter);
		GrnApprovalAccessConfigDtoJson grnConfig = MapperUtil.mapObjToClass(ruleFieldValues,
				GrnApprovalAccessConfigDtoJson.class);

		// validate all field
		checkIfValidConfig(grnConfig, ruleType.name());

		List<GrnApprovalAccessConfigDto> configs = grnConfig.getConfig();

		if (configs.isEmpty())
			throw new ServiceException(CONFIG_NOT_FOUND_FOR_CRITERIA, ERR_SALE_167, "empty");

		GrnApprovalProcessTypeEnum grnApprovalType = (StringUtils.isNotBlank(grnRequestDto.getApprovalCode()))
				? GrnApprovalProcessTypeEnum.CODE
				: GrnApprovalProcessTypeEnum.EMAIL;

		// filter by role code 1st
		// @formatter:off
		configs = configs.stream()
				.filter(config -> config.getRoleCode().equalsIgnoreCase(grnRequestDto.getApproverRoleCode())
						&& (config.getUpperLimit() == null || config.getUpperLimit().compareTo(totalValue) >= 0)
						&& config.getProcessType().equals(grnApprovalType.name())
						&& config.getFromDays() <= noOfDaysPassed && noOfDaysPassed <= config.getTillDays())
				.collect(Collectors.toList());
		// @formatter:on

		if (configs.isEmpty())
			throw new ServiceException(CONFIG_NOT_FOUND_FOR_CRITERIA, ERR_SALE_167, grnRequestDto.getApproverRoleCode()
					+ " : " + totalValue + " : " + grnApprovalType.name() + " : " + noOfDaysPassed);
	}

	private Date commonConfigCheckAndCustomerValidation(GRNCancellationTypeEnum cancelType, SalesTxnDao salesTxn,
			boolean isDiffStore, String processType, CancelDaoExt cancel) {

		// ****************** LOCATION CONFIG CHECK **********************//
		// validate if interBtq allowed if confirming for different location
		GrnDetails locationGRNConfig = null;

		if (isDiffStore) {
			// validate inter btq check
			locationGRNConfig = checkConfigIfInterBtqAllowed();
			// validate ownerType check
			checkIfInterOwnerTypeAllowed(salesTxn.getLocationCode());
		}

		// ********************** CONFIG CHECK **************************//

		// other than confirm after approval, where cancel object not created
		if (cancel == null && isDiffStore) {
			// validate interBtq
			checkConfigIfInterBtqAllowed();
		}

		Date businessDay = businessDayService.getBusinessDay().getBusinessDate();

		// TEST TEMP COMMENT
		validateGrnDates(salesTxn.getDocDate(), cancelType, processType, locationGRNConfig, businessDay);
		return businessDay;
	}

	// =================CONFIG CHECK END=================

	private void updateLegacyGrnItems(SalesTxnDao salesTxnDao, List<GrnDetailsDaoExt> grnItems) {
		GrnLegacyUpdateDto grnUpdate = new GrnLegacyUpdateDto();
		grnUpdate.setCmDocNo(salesTxnDao.getDocNo());
		grnUpdate.setCmLocationCode(salesTxnDao.getLocationCode());
		grnUpdate.setCmFiscalYear(salesTxnDao.getFiscalYear());
		List<GrnItemDetials> items = new ArrayList<>();
		grnItems.forEach(grn -> {
			GrnItemDetials grndetail = new GrnItemDetials();
			grndetail.setItemCode(grn.getItemCode());
			grndetail.setLotNo(grn.getLotNumber());
			grndetail.setQuantity(grn.getTotalQuantity());
			items.add(grndetail);
		});
		grnUpdate.setItems(items);
		integrationServiceClient.updateGrnItemsLegacy(grnUpdate);
	}

	// =================DATASYNC START=================

	public SyncStagingDto syncStagging(GrnDaoExt grnExt, List<GrnDetailsDaoExt> grnItems, CancelDaoExt cancel,
			List<CreditNoteDaoExt> creditNoteList, List<InventoryDetailsDao> newInvItems,
			CustomerLocationMappingDao clmTxn, List<CustomerDocumentsDao> customerDocList, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();

		destinations.add("EPOSS");
		if (grnExt != null) {
			grnExt.setSrcSyncId(grnExt.getSrcSyncId() + 1);
			grnExt = grnRepo.save(grnExt);
			syncDataList.add(DataSyncUtil.createSyncData(new GrnSyncDtoExt(grnExt), 0));
		}

		if (!grnItems.isEmpty()) {
			List<GrnDetailsSyncExt> syncExtList = new ArrayList<>();
			grnItems.forEach(dao -> {
				dao.setSrcSyncId(dao.getSrcSyncId() + 1);
				syncExtList.add(new GrnDetailsSyncExt(dao));
			});
			grnDetailsRepo.saveAll(grnItems);
			syncDataList.add(DataSyncUtil.createSyncData(syncExtList, 1));
		}
		if (cancel != null) {
			cancel.setSrcSyncId(cancel.getSrcSyncId() + 1);
			cancel = cancelRepo.save(cancel);
			syncDataList.add(DataSyncUtil.createSyncData(new CancelSyncDtoExt(cancel), 2));
		}
		if (creditNoteList != null && !creditNoteList.isEmpty()) {
			List<CreditNoteSyncDtoExt> dtoExtList = new ArrayList<>();
			creditNoteList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new CreditNoteSyncDtoExt(daoExt));
			});
			creditNoteRepo.saveAll(creditNoteList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 3));
		}
		if (newInvItems != null && !newInvItems.isEmpty()) {
			syncDataList.add(DataSyncUtil.createSyncData(newInvItems, 4));
		}
		if (clmTxn != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(clmTxn), 5));
		}
		if (customerDocList != null && !customerDocList.isEmpty()) {
			List<CustomerDocumentSyncDto> customerDocSync = customerDocList.stream().map(CustomerDocumentSyncDto::new)
					.collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(customerDocSync, 6));
		}

		MessageRequest grnMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto grnStagingDto = new SyncStagingDto();
		grnStagingDto.setMessageRequest(grnMsgRequest);
		String grnMsgRqst = MapperUtil.getJsonString(grnMsgRequest);
		SyncStaging grnSyncStaging = new SyncStaging();
		grnSyncStaging.setMessage(grnMsgRqst);
		grnSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		grnSyncStaging = saleSyncStagingRepository.save(grnSyncStaging);
		grnStagingDto.setId(grnSyncStaging.getId());
		return grnStagingDto;
	}

	@Override
	public CancelGRNResponseDto confirmWithOutApproval(ConfirmGRNDto cancelGRNDto, String txnType, String subTxnType) {
		String status = cancelGRNDto.getCancelType();
		try {
			PublishResponse response = grnService.confirmWithOutApprovalTransactional(cancelGRNDto, txnType,
					subTxnType);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(response.getApiResponse(), new TypeReference<CancelGRNResponseDto>() {
			});
		} catch (ServiceException e) {
			log.info("Error on {} {} for id {}. Reason: {}", txnType, status, cancelGRNDto.getRefTxnId(), ("Message: "
					+ e.getMessage() + " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues()));

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Message: " + e.getMessage()
						+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues());
			}

			throw e;
		} catch (Exception e) {
			log.info("Error on {} {} for sales id {}. Localized message: {}, message: {}", txnType, status,
					cancelGRNDto.getRefTxnId(), e.getLocalizedMessage(), e.getMessage());

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				if (!StringUtils.isEmpty(e.getLocalizedMessage()))
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason(e.getLocalizedMessage());
				else if (!StringUtils.isEmpty(e.getMessage()))
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason(e.getMessage());
				else
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Unkown exception");
			}
			throw e;
		}

		finally {

			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())
					&& !StringUtils.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData().get(0).getFailReason())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setSubTxnType(subTxnType);
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setStatus(status);
				log.info("Log for doc no audit: {}", DocNoFailAuditThreadLocal.getDocNoFailData().get(0).getDocNo());

				// save doc details audit on error
				DocNumberFailAuditDaoExt docNumberFailAuditDaoExt = MapperUtil.mapObjToClass(
						DocNoFailAuditThreadLocal.getDocNoFailData().get(0), DocNumberFailAuditDaoExt.class);
				docNumberFailAuditDaoExt=docNumberFailAuditDaoRepositoryExt.save(docNumberFailAuditDaoExt);
				//sync
				if(docNumberFailAuditDaoExt!=null) {
					commonTxnSycnService.syncDataDocNumberFailAudit(docNumberFailAuditDaoExt);
				}

			}

			// clear allocated thread resource
			DocNoFailAuditThreadLocal.unsetDocNoFailData();
		}
	}

	@Override
	public CancelGRNResponseDto confirmAfterApproval(String id, GRNConfirmAfterApprovalDto grnConfirmAfterApprovalDto,
			String txnType, String subTxnType) {

		String status = TxnStatusCancelEnum.CONFIRMED.name();
		try {
			PublishResponse response = grnService.confirmAfterApprovalTransactional(id, grnConfirmAfterApprovalDto,
					txnType, subTxnType);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(response.getApiResponse(), new TypeReference<CancelGRNResponseDto>() {
			});
		} catch (ServiceException e) {
			log.info("Error on {} {} for  cancel id {}. Reason: {}", txnType, status, id, ("Message: " + e.getMessage()
					+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues()));

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Message: " + e.getMessage()
						+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues());
			}

			throw e;
		} catch (Exception e) {
			log.info("Error on {} {} for cancel id {}. Localized message: {}, message: {}", txnType, status, id,
					e.getLocalizedMessage(), e.getMessage());

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				if (!StringUtils.isEmpty(e.getLocalizedMessage()))
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason(e.getLocalizedMessage());
				else if (!StringUtils.isEmpty(e.getMessage()))
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason(e.getMessage());
				else
					DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Unkown exception");
			}
			throw e;
		}

		finally {

			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())
					&& !StringUtils.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData().get(0).getFailReason())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setSubTxnType(subTxnType);
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setStatus(status);
				log.info("Log for doc no audit: {}", DocNoFailAuditThreadLocal.getDocNoFailData().get(0).getDocNo());

				// save doc details audit on error
				DocNumberFailAuditDaoExt docNumberFailAuditDaoExt = MapperUtil.mapObjToClass(
						DocNoFailAuditThreadLocal.getDocNoFailData().get(0), DocNumberFailAuditDaoExt.class);
				docNumberFailAuditDaoExt=docNumberFailAuditDaoRepositoryExt.save(docNumberFailAuditDaoExt);
				//sync
				if(docNumberFailAuditDaoExt!=null) {
					commonTxnSycnService.syncDataDocNumberFailAudit(docNumberFailAuditDaoExt);
				}
			}

			// clear allocated thread resource
			DocNoFailAuditThreadLocal.unsetDocNoFailData();
		}

	}

	@Override
	public CancelAdvancePendingDto requestForApproval(GRNRequestDto grnRequestDto, String txnType, String subTxnType) {
		PublishResponse response = grnService.requestForApprovalTransactional(grnRequestDto, txnType, subTxnType);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<CancelAdvancePendingDto>() {
		});
	}

	@Override
	public ItemDetailsResponseDto getItemDetails(String refTxnId, ReturnableItemsDto returnableItemsDto) {
		ItemDetailsResponseDto itemDetailsResponseDto = new ItemDetailsResponseDto();
		CashMemoDetailsDao cashMemoDetailsDao = cashMemoDetailsRepo
				.findOneById(returnableItemsDto.getCashMemoDetailsId());
		long quantity = returnableItemsDto.getTotalQuantity();
		PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(cashMemoDetailsDao.getPriceDetails(),
				PriceDetailsDto.class);
		LegacyCmDetailsDto legacyCmDetails = MapperUtil.mapObjToClass(cashMemoDetailsDao.getLegacyCmDetails(),
				LegacyCmDetailsDto.class);
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalDiscount = cashMemoDetailsDao.getTotalDiscount() == null ? BigDecimal.ZERO
				: cashMemoDetailsDao.getTotalDiscount().divide(BigDecimal.valueOf(quantity), RoundingMode.HALF_UP)
						.multiply(BigDecimal.valueOf(quantity));
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal finalValue = BigDecimal.ZERO;
		BigDecimal itemTotalTax = BigDecimal.ZERO;
		if (BooleanUtils.isFalse(priceDetails.getIsUcp()) || priceDetails.getIsUcp() == null) {
			if (priceDetails.getNetWeight() != null && cashMemoDetailsDao.getTotalQuantity() != null && quantity > 0) {
				priceDetails.setNetWeight(priceDetails.getNetWeight()
						.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP)
						.multiply(BigDecimal.valueOf(quantity)));
			}

			MetalPriceDetailsDto metalPriceDetails = MapperUtil.mapObjToClass(priceDetails.getMetalPriceDetails(),
					MetalPriceDetailsDto.class);

			metalPriceDetails.setPreDiscountValue(metalPriceDetails.getPreDiscountValue() == null ? BigDecimal.ZERO
					: metalPriceDetails.getPreDiscountValue()
							.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP)
							.multiply(BigDecimal.valueOf(quantity)));
			for (MetalPriceDto metalPrice : metalPriceDetails.getMetalPrices()) {
				metalPrice.setNetWeight(metalPrice.getNetWeight() == null ? BigDecimal.ZERO
						: metalPrice.getNetWeight()
								.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP)
								.multiply(BigDecimal.valueOf(quantity)));
				metalPrice.setMetalValue(metalPrice.getMetalValue()
						.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP)
						.multiply(BigDecimal.valueOf(quantity)));
			}

			MakingChargeDetailsDto makingChargeDetailsDto = MapperUtil
					.mapObjToClass(priceDetails.getMakingChargeDetails(), MakingChargeDetailsDto.class);
			makingChargeDetailsDto.setPreDiscountValue(makingChargeDetailsDto.getPreDiscountValue() == null
					? BigDecimal.ZERO
					: makingChargeDetailsDto.getPreDiscountValue()
							.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP)
							.multiply(BigDecimal.valueOf(quantity)));

			HallmarkGstRequestDto hallmarkGstRequestDto = new HallmarkGstRequestDto(
					cashMemoDetailsDao.getHallmarkCharges(), cashMemoDetailsDao.getHallmarkDiscount(),
					priceDetails.getItemHallmarkDetails() == null ? BigDecimal.ZERO
							: priceDetails.getItemHallmarkDetails().getHallmarkGstPct());

			// if only tax update, then not to pass tax details.
			TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
					cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getCustomerId(),
					cashMemoDetailsDao.getItemCode(),
					cashMemoDetailsDao.getUnitValue().multiply(BigDecimal.valueOf(quantity)),
					cashMemoDetailsDao.getTotalDiscount() == null ? BigDecimal.ZERO
							: cashMemoDetailsDao.getTotalDiscount()
									.divide(BigDecimal.valueOf(quantity), RoundingMode.HALF_UP)
									.multiply(BigDecimal.valueOf(quantity)),
					TxnTaxTypeEnum.CUST_TRANSACTION_CM,
					MapperUtil.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class),
					hallmarkGstRequestDto);
			//itemTotalTax = commonTransactionService.getTaxDetails((cashMemoDetailsDao.getFinalValue().divide(BigDecimal.valueOf(quantity),RoundingMode.HALF_UP)),null,totalTaxAndTaxDetailsDto);
			totalValue = cashMemoDetailsDao.getUnitValue().multiply(BigDecimal.valueOf(quantity))
					.add(((hallmarkGstRequestDto.getHallmarkCharges()).divide(BigDecimal.valueOf(quantity),
							RoundingMode.HALF_UP)).multiply(BigDecimal.valueOf(quantity)));
			if (cashMemoDetailsDao.getCashMemoDao().getIsMigrated()) {
				finalValue = totalValue.add(cashMemoDetailsDao.getTotalTax()).subtract(totalDiscount);
			} else {
				finalValue = totalValue.add(totalTaxAndTaxDetailsDto.getTotalTax()).subtract(totalDiscount);
			}
			BigDecimal makingcharges = makingChargeDetailsDto.getPreDiscountValue().divide(BigDecimal.valueOf(quantity),
					RoundingMode.HALF_UP);
			itemDetailsResponseDto.setHallmarkCharges(hallmarkGstRequestDto.getHallmarkCharges()
					.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(quantity)));
			itemDetailsResponseDto.setHallmarkDiscount(hallmarkGstRequestDto.getHallmarkDiscount()
					.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(quantity)));
			itemDetailsResponseDto.setTaxDetails(totalTaxAndTaxDetailsDto.getTaxDetails());
			itemDetailsResponseDto.setTotalTax(totalTaxAndTaxDetailsDto.getTotalTax());
		} else {
			
			
//			PriceResponseDto priceResponseDto = null;
//			OrdersPriceRequest ordersPriceRequest = new OrdersPriceRequest();
//			ordersPriceRequest.setCheckInventory(true);
//			ordersPriceRequest.setItemCode(cashMemoDetailsDao.getItemCode());
//			ordersPriceRequest.setLotNumber(cashMemoDetailsDao.getLotNumber());
//			ordersPriceRequest.setInventoryId(cashMemoDetailsDao.getInventoryId());
//			ordersPriceRequest.setMeasuredQuantity(cashMemoDetailsDao.getTotalQuantity());
//			ordersPriceRequest.setMeasuredWeight(cashMemoDetailsDao.getTotalWeight());
//			ordersPriceRequest.setStandardPrice(commonTransactionService
//					.mapMetalRateJsonToDto(cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getMetalRateDetails())
//					.getMetalRates());
//			priceResponseDto = engineService.getPriceDetails(ordersPriceRequest);
//			TotalTaxAndTaxDetailsDto reverseTaxDetails = commonTransactionService.reverseTotalTaxDetails(
//					cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getCustomerId(),
//					cashMemoDetailsDao.getItemCode(), cashMemoDetailsDao.getFinalValue(),
//					TxnTaxTypeEnum.CUST_TRANSACTION_CM,
//					!StringUtils.isEmpty(cashMemoDetailsDao.getTaxDetails()) ? MapperUtil
//							.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class) : null);
			totalValue = cashMemoDetailsDao.getTotalValue();
			finalValue = cashMemoDetailsDao.getFinalValue();
			if(SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cashMemoDetailsDao.getProductGroupCode())){
//				PriceResponseDto priceResponseDto = null;
//				OrdersPriceRequest ordersPriceRequest = new OrdersPriceRequest();
//				ordersPriceRequest.setCheckInventory(true);
//				ordersPriceRequest.setItemCode(cashMemoDetailsDao.getItemCode());
//				ordersPriceRequest.setLotNumber((cashMemoDetailsDao.getLotNumber()!=null)?cashMemoDetailsDao.getLotNumber():null );
//				ordersPriceRequest.setInventoryId(cashMemoDetailsDao.getInventoryId());
//				ordersPriceRequest.setMeasuredQuantity((short)quantity);
//				ordersPriceRequest.setMeasuredWeight(cashMemoDetailsDao.getTotalWeight()
//						.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP)
//						.multiply(BigDecimal.valueOf(quantity)));
//				ordersPriceRequest.setStandardPrice(commonTransactionService
//						.mapMetalRateJsonToDto(cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getMetalRateDetails())
//						.getMetalRates());
//				priceResponseDto = engineService.getPriceDetails(ordersPriceRequest);
				HallmarkGstRequestDto hallmarkGstRequestDto = new HallmarkGstRequestDto(
						cashMemoDetailsDao.getHallmarkCharges(), cashMemoDetailsDao.getHallmarkDiscount(),
						priceDetails.getItemHallmarkDetails() == null ? BigDecimal.ZERO
								: priceDetails.getItemHallmarkDetails().getHallmarkGstPct());
				totalValue = cashMemoDetailsDao.getUnitValue().multiply(BigDecimal.valueOf(quantity))
						.add(((hallmarkGstRequestDto.getHallmarkCharges()).divide(BigDecimal.valueOf(quantity),
								RoundingMode.HALF_UP)).multiply(BigDecimal.valueOf(quantity)));

				TotalTaxAndTaxDetailsDto reverseTaxDetails = commonTransactionService.reverseTotalTaxDetails(
						cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getCustomerId(),
						cashMemoDetailsDao.getItemCode(), cashMemoDetailsDao.getFinalValue().divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()),
						RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(quantity)),
						TxnTaxTypeEnum.CUST_TRANSACTION_CM,
						!StringUtils.isEmpty(cashMemoDetailsDao.getTaxDetails()) ? MapperUtil
								.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class) : null);
				System.out.println("reverse tax"+reverseTaxDetails.toString());
				finalValue = totalValue.subtract(totalDiscount);
			    itemTotalTax = commonTransactionService.getTaxDetails(finalValue, null,
						reverseTaxDetails.getTaxDetails());
				if (cashMemoDetailsDao.getCashMemoDao().getIsMigrated()) {
				finalValue = totalValue.add(cashMemoDetailsDao.getTotalTax()).subtract(totalDiscount);
			} else {
				System.out.println(reverseTaxDetails.getTotalTax());
				System.out.println("discount"+ totalDiscount);
				finalValue = finalValue.add(itemTotalTax);
			}
			}
			itemDetailsResponseDto.setTaxDetails(
					MapperUtil.mapObjToClass(cashMemoDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class));
			itemDetailsResponseDto.setTotalTax(cashMemoDetailsDao.getTotalTax());
		}
		totalWeight = cashMemoDetailsDao.getTotalWeight()
				.divide(BigDecimal.valueOf(cashMemoDetailsDao.getTotalQuantity()), RoundingMode.HALF_UP)
				.multiply(BigDecimal.valueOf(quantity));
		itemDetailsResponseDto.setItemCode(cashMemoDetailsDao.getItemCode());
		itemDetailsResponseDto.setLotNumber(cashMemoDetailsDao.getLotNumber());
		itemDetailsResponseDto.setInventoryWeight(cashMemoDetailsDao.getInventoryWeight());
		itemDetailsResponseDto.setInventoryId(cashMemoDetailsDao.getInventoryId());
		itemDetailsResponseDto.setEmployeeCode(cashMemoDetailsDao.getEmployeeCode());
		// remarks to be added
		// itemDetailsResponseDto.getRemarks(cashMemoDetailsDao.getRemarks());
		itemDetailsResponseDto.setReason(cashMemoDetailsDao.getReason());
		itemDetailsResponseDto.setBinCode(cashMemoDetailsDao.getBinCode());
		itemDetailsResponseDto.setBinGroupCode(cashMemoDetailsDao.getBinGroupCode());
		itemDetailsResponseDto.setRefTxnId(refTxnId);
		// measuredWeightsDetails should be set
		// itemDetailsResponseDto.setMeasuredWeightDetails(cashMemoDetailsDao.getMeasuredWeightDetails());
		itemDetailsResponseDto.setProductGroupCode(cashMemoDetailsDao.getProductGroupCode());
		itemDetailsResponseDto.setProductCategoryCode(cashMemoDetailsDao.getProductCategoryCode());
		// discountDetails to be set
		// itemDetailsResponseDto.setDiscountDetails(cashMemoDetailsDao.getDiscountDetails())
		itemDetailsResponseDto.setInventoryStdValue(cashMemoDetailsDao.getInventoryStdValue());
		itemDetailsResponseDto.setInventoryStdWeight(cashMemoDetailsDao.getInventoryStdWeight());
		itemDetailsResponseDto.setItemInStock(cashMemoDetailsDao.getItemInStock());
		// orderItemId and ItemDetails to be set
		// itemDetailsResponseDto.setOrderItemId(cashMemoDetailsDao.getOrderItem());
		// itemDetailsResponseDto.setItemDetails(cashMemoDetailsDao.getItemDetails());
		itemDetailsResponseDto.setTotalValue(totalValue);
		itemDetailsResponseDto.setTotalQuantity((short) quantity);
		itemDetailsResponseDto.setPriceDetails(priceDetails);
		itemDetailsResponseDto.setLegacyCmDetails(legacyCmDetails);
		itemDetailsResponseDto.setTotalWeight(totalWeight);
		itemDetailsResponseDto.setTotalDiscount(totalDiscount);
		itemDetailsResponseDto.setUnitValue(cashMemoDetailsDao.getUnitValue());
		itemDetailsResponseDto.setFinalValue(finalValue);
		itemDetailsResponseDto.setItemId(cashMemoDetailsDao.getId());
		return itemDetailsResponseDto;
	}

	@Override
	public void updateGrnFromLegacytoNap(GrnLegacyUpdateDto grnLegacyUpdateDto) {
		SalesTxnDao salesTxnDao = salesTxnRepo.getByDocNoFiscalCodeAndLocationCode(
				grnLegacyUpdateDto.getCmFiscalYear().toString(), grnLegacyUpdateDto.getCmDocNo().toString(),
				grnLegacyUpdateDto.getCmLocationCode(), TransactionTypeEnum.CM.name(),
				TransactionStatusEnum.CONFIRMED.name());
		List<CashMemoDetailsDao> cashMemoDetailList = new ArrayList<>();

		if (salesTxnDao != null) {
			CashMemoDao cashmemoDao = cashMemoRepo.getOne(salesTxnDao.getId());
			List<CashMemoDetailsDao> cashMemoDetailsDaoList = cashMemoDetailsRepo
					.findByCashMemoDaoId(cashmemoDao.getId());
			if (cashMemoDetailsDaoList != null) {

				for (CashMemoDetailsDao cmDetailsDaoExt : cashMemoDetailsDaoList) {
					for (GrnItemDetials grnItem : grnLegacyUpdateDto.getItems()) {
						if (grnItem.getItemCode().equals(cmDetailsDaoExt.getItemCode())) {

							if (cmDetailsDaoExt != null && cmDetailsDaoExt.getId() != null) {
								short totalTepQuantity = (short) tepServiceImpl
										.getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(
												cmDetailsDaoExt.getId());
								short totalGrnQuantity = (short) tepServiceImpl
										.getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(cmDetailsDaoExt.getId());
								short totalLegacyReturnQty = (cmDetailsDaoExt.getNoOfItemsReturned() == null) ? 0
										: cmDetailsDaoExt.getNoOfItemsReturned();
								if (cmDetailsDaoExt.getTotalQuantity()
										- (totalTepQuantity + totalGrnQuantity + totalLegacyReturnQty) <= 0) {
									throw new ServiceException(GRN_TEP_DONE, ERR_CORE_344,
											Map.of("itemCode", cmDetailsDaoExt.getItemCode()));
								}
							}

							Short returnQty = (short) (cmDetailsDaoExt.getNoOfItemsReturned() == null
									? grnItem.getQuantity()
									: (cmDetailsDaoExt.getTotalQuantity() + grnItem.getQuantity()));
							cmDetailsDaoExt.setNoOfItemsReturned(returnQty);
							cashMemoDetailList.add(cmDetailsDaoExt);
						}
					}
				}

				if (!cashMemoDetailList.isEmpty()) {
					cashMemoDetailsRepo.saveAll(cashMemoDetailList);
				}

			}

		} else {
			throw new ServiceException("CashMemo not found - {docNo} {locationCode} {fiscalYear}", "ERR-INT-096",
					Map.of("docNo", "" + grnLegacyUpdateDto.getCmDocNo().toString(), "locationCode",
							grnLegacyUpdateDto.getCmLocationCode(), "fiscalYear",
							"" + grnLegacyUpdateDto.getCmFiscalYear().toString()));
		}
	}
}
