/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.discount.dto.GhsDiscountVoucherDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CustomerTcsData;
import com.titan.poss.core.dto.CustomerTcsDetailsDto;
import com.titan.poss.core.dto.CustomerTcsDetailsResponseDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.EinvoiceGstVerifyResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceItemDetailsDto;
import com.titan.poss.core.dto.EventCashMemoDetailsDto;
import com.titan.poss.core.dto.EventCashMemoDto;
import com.titan.poss.core.dto.EventGiftSaleDetailsDto;
import com.titan.poss.core.dto.EventPaymentDetailsDto;
import com.titan.poss.core.dto.GVDetailsUpdateReqDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationPaymentDetails;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.RivaahCardCouponDetails;
import com.titan.poss.core.dto.RivaahEligibilityProductMappingDetails;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.GiftVoucherStatusEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.response.InvWeightAndQuantityDto;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dto.request.json.HallmarkDetails;
import com.titan.poss.product.dto.request.json.ProductGroupConfig;
import com.titan.poss.product.repository.ProductCategoryRepository;
import com.titan.poss.product.repository.ProductGroupRepository;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerCouponDaoExt;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.FocDetailsDaoExt;
import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.PaymentReversalDao;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CashMemoDetailsSyncDtoExt;
import com.titan.poss.sales.dto.CashMemoSyncDtoExt;
import com.titan.poss.sales.dto.CashMemoUpdateDto;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.CustomerCouponSyncDtoExt;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.CustomerPaymentSyncDtoExt;
import com.titan.poss.sales.dto.CustomerTcsDetailsSyncDtoExt;
import com.titan.poss.sales.dto.CustomerTxnSyncDtoExt;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.FocDetailsSyncDtoExt;
import com.titan.poss.sales.dto.FocSchemeSyncDtoExt;
import com.titan.poss.sales.dto.GiftDetailsSyncDtoExt;
import com.titan.poss.sales.dto.GiftVoucherOtherDetailsDto;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.OtherChargeDetailsDto;
import com.titan.poss.sales.dto.PaymentDetailsSyncDtoExt;
import com.titan.poss.sales.dto.PaymentItemMappingSyncDtoExt;
import com.titan.poss.sales.dto.PaymentReversalSyncDto;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.CustomerTypeEnum;
import com.titan.poss.sales.dto.constants.FocStatusEnum;
import com.titan.poss.sales.dto.constants.LovTypeEnum;
import com.titan.poss.sales.dto.constants.ManualBillValidationTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.RivaahCardStatusEnum;
import com.titan.poss.sales.dto.constants.SalesCouponEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.CashMemoPatchUpdateDto;
import com.titan.poss.sales.dto.request.ManaulBillRequestDetailsDto;
import com.titan.poss.sales.dto.request.ManaulBillRequestHeaderDto;
import com.titan.poss.sales.dto.request.OrderToCashMemoRequestDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.dto.response.CashMemoAndDetialsIdResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.dto.response.UpdateInvItemAndSalesItemDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerCouponRepositoryExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.FocDetailsRepositoryExt;
import com.titan.poss.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.sales.repository.GiftDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentItemMappingRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepository;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CashMemoGiftService;
import com.titan.poss.sales.service.CashMemoService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CommonTxnSycnService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.service.SalesInvoiceDocService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.DocNoFailAuditThreadLocal;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for Cash memo.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
/**
 * @author M1071833
 *
 */
@Slf4j
@Service("salesCashMemoService")
public class CashMemoServiceImpl implements CashMemoService {

	private static final String ERR_SALE_004 = "ERR-SALE-004";
	private static final String INVALID_CHARGE_TYPE = "Invalid charge type";

	private static final String ERR_SALE_025 = "ERR-SALE-025";
	private static final String INVALID_OCCASION = "Invalid Occasion.";

	private static final String ERR_SALE_063 = "ERR-SALE-063";
	private static final String PAID_VALUE_SHOULD_MATCH_FINAL_VALUE = "Paid Value should match final Value.";

	private static final String ERR_SALE_098 = "ERR-SALE-098";
	private static final String REQUEST_IS_NOT_APPROVED = "Request is not approved.";

	private static final String ERR_SALE_090 = "ERR-SALE-090";
	private static final String INVALID_UPDATE = "Invalid Request: Please check id or type or status";

	private static final String ERR_SALE_294 = "ERR-SALE-294";
	private static final String INVALID_REQUEST = "Invalid Request :-";

	private static final String ERR_SALE_411 = "ERR-SALE-411";
	private static final String INVALID_REQUESTS = "Invalid Request : - open task {taskNumber} {Remarks}";

	private static final String COUPON_GENERATOR = "1234567890";

	private static final String CUST_TAX_NO = "custTaxNo";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String INSTI_TAX_NO = "instiTaxNo";
    private static final String MOBILE_NO = "mobileNumber";
    private static final String EMAIL_ID =  "emailId";
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";


    

	@Value("${app.name}")
	private String appName;

//PAID_PAYMENT_STATUS
	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private GiftDetailsRepositoryExt giftDetailRepo;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private CustomerPaymentRepositoryExt customerPaymentRepo;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private CashMemoGiftService cashMemoGiftService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private FocSchemesRepositoryExt focSchemeRepository;

	@Autowired
	private FocDetailsRepositoryExt focDetailsRepository;

	@Autowired
	private CashMemoServiceImpl cmServiceImpl;

	@Autowired
	private OrderServiceImpl oderServiceImpl;

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private OrderUtilService orderUtilService;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private CashMemoFocItemServiceImpl cashMemoFocItemServiceImpl;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private CustomerTcsDetailsRepositoryExt customerTcsDetailsRepository;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepository;

	@Autowired
	private CustomerCouponRepositoryExt customerCouponRepository;

	@Autowired
	private OtpServiceImpl otpService;

	@Autowired
	private CommonPaymentService commonPaymentService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private CancellationRepositoryExt cancellationRepositoryExt;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private CommonTxnSycnService commonTxnSycnService;

	@Autowired
	private PaymentItemMappingRepositoryExt paymentItemMappingRepository;

	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditDaoRepositoryExt;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private ProductGroupRepository productGroupRepository;

	@Autowired
	private ProductCategoryRepository productCategoryRepository;

	@Autowired
	private PaymentReversalRepository reversalRepository;
	
	@Autowired
	private SalesInvoiceDocService salesInvoiceDocService;

	/**
	 * This method will put the cash memo on open status.
	 * 
	 * @param transactionCreateDto
	 * @param transactionType
	 * @param subTxnType
	 * @return ManualBillVerifyDto
	 */
	@Transactional
	@Override
	public TransactionResponseDto openCashMemo(TransactionCreateDto transactionCreateDto, String transactionType,
			String subTxnType) {
		// validate transaction and sub txn types.
		commonTransactionService.txnTypeAndSubTxnTypeValidation(transactionType, subTxnType);
		SalesTxnDaoExt salesTxnDao = commonTransactionService.getSalesTxnDao(null, transactionType, subTxnType,
				SalesDocTypeEnum.CM_OPEN, TransactionStatusEnum.OPEN);

		// if MANUAL_CM then need to validate bill details
		if (SubTxnTypeEnum.MANUAL_CM.name().equals(subTxnType)) {
			commonTransactionService.validateManualBillDetails(transactionCreateDto, salesTxnDao);
		}
		CashMemoDaoExt cashMemoDao = new CashMemoDaoExt();
		cashMemoDao.setSalesTxnDao(salesTxnDao);
		cashMemoDao.setPaidValue(BigDecimal.ZERO); // ask DB team to make 0 as default value
		salesTxnDao.setSrcSyncId(0);
		salesTxnDao.setDestSyncId(0);
		salesTxnDao = salesTxnRepository.save(salesTxnDao);
		cashMemoDao.setSrcSyncId(0);
		cashMemoDao.setDestSyncId(0);
		cashMemoDao = cashMemoRepository.save(cashMemoDao);

		TransactionResponseDto transactionResponseDto = new TransactionResponseDto();
		transactionResponseDto.setId(cashMemoDao.getId());
		transactionResponseDto.setStatus(salesTxnDao.getStatus());
		transactionResponseDto.setDocNo(salesTxnDao.getDocNo());
		transactionResponseDto.setTxnType(salesTxnDao.getTxnType());
		transactionResponseDto.setSubTxnType(salesTxnDao.getSubTxnType());
		if (SubTxnTypeEnum.MANUAL_CM.name().equals(subTxnType)) {
			transactionResponseDto.setManualBillDetails(
					commonTransactionService.mapJsonToManualBillDetails(salesTxnDao.getManualBillDetails()));
		}
		return transactionResponseDto;
	}

	/**
	 * This method will update the cash memo on hold/confirm/approval_pending w.r.t
	 * id and status.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param cashMemoUpdateDto
	 * @param status
	 * @return PublishResponse
	 */
	@Transactional(value = "chainedTransaction")
	public PublishResponse updateCashMemoTransactional(String id, String transactionType, String subTxnType,
			CashMemoUpdateDto cashMemoUpdateDto, String status) {
		log.info("Update CM :- " + id + ", status: " + status);
		// allowed status: HOLD or CONFIRMED or APPROVAL_PENDING based on subTxnType
		commonTransactionService.checkInputStatus(status, subTxnType);

		// if not NEW_CM, then restrict HOLD.
		if (TransactionStatusEnum.HOLD.name().equals(status) && !SubTxnTypeEnum.NEW_CM.name().equals(subTxnType)) {
			throw new ServiceException(SalesConstants.TRANSACTION_CANNOT_BE_PUT_ON_HOLD, SalesConstants.ERR_SALE_047,
					"Transaction related to " + subTxnType + " cannot be put on hold.");
		}
		// check remarks for the txn and status.
		commonTransactionService.checkRemarksForTxnBasedOnInputStatus(status, transactionType,
				cashMemoUpdateDto.getRemarks());

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);
		// if payment was previously in APPROVAL_PENDING status, then no need to check
		// status
		if (!TransactionStatusEnum.APPROVAL_PENDING.name().equals(cashMemoDao.getSalesTxnDao().getStatus())) {
			commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());
		}
		// UAT 3130: if within hold time then return
		if (checkIfAlreadyOnHold(status, cashMemoDao)) {
			PublishResponse cmResponse1 = new PublishResponse();
			cmResponse1.setApiResponse(commonCashMemoService.cashMemoResponse(cashMemoDao));
			cmResponse1.setSyncStagingDtoList(List.of());
			return cmResponse1;
		}

		// check: customer change or no customer selected
		if (!cashMemoUpdateDto.getCustomerId().equals(cashMemoDao.getSalesTxnDao().getCustomerId())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid input for field: customerId");
		}
		// cash limit check:
		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				cashMemoDao.getSalesTxnDao().getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				CommonUtil.getLocationCode(), PaymentStatusEnum.COMPLETED.name());
		Calendar cal1 = Calendar.getInstance();
		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		BigDecimal totalCashPaid = BigDecimal.ZERO;

		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.getCashCollectedByTransactionIdAndPaymentCodes(cashMemoDao.getSalesTxnDao().getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), CommonUtil.getLocationCode(),
						PaymentStatusEnum.COMPLETED.name());
		CashPaymentDetailsDto cashPaymentDetails = commonPaymentService.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
	    totalCashPaid=totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
	    totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());
	

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
				totalCashPaid, totalPmlaCashAmount);
		if (totalCashPaid != null && BigDecimal.ZERO.compareTo(totalCashPaid) < 0) {
			customerPaymentService.cashLimitCheck(instrumentCashAmountDto, null, null, cashMemoDao.getSalesTxnDao(),
					cashMemoDao.getSalesTxnDao().getCustomerId(), false);
		}
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = new ArrayList<>();
		List<GiftDetailsDaoExt> giftDetailsDaoList = new ArrayList<>();
		List<PaymentDetailsDaoExt> paymentList = new ArrayList<>();
		// check metal rate and get cash memo details if exists.
		if (!SubTxnTypeEnum.GIFT_SALE.name().equals(subTxnType)) {

			// If Frozen rate, current date metal rate validation need to be skipped
			Boolean isAvoidMetalRateCheck = commonCashMemoService
					.checkIfFrozenRatePreOrder(cashMemoDao.getSalesTxnDao());

			OrderDaoExt orderDao = commonCashMemoService
					.checkIfPreOrderExistsByRefTxn(cashMemoDao.getSalesTxnDao().getRefTxnId());
			// get best rate if exists
			Set<String> metalToBeIgnoredForRateCheck = commonCashMemoService.getBestRate(cashMemoDao.getSalesTxnDao(),
					orderDao, false, true);

			// if rateFreeze CN is added, then metal rate is not required.
			PaymentDetailsDaoExt rateFreezedPayment = commonPaymentService
					.getMetalRateProtectedCNIfExists(cashMemoDao.getSalesTxnDao());
			if (rateFreezedPayment != null) {
				isAvoidMetalRateCheck = true;
				// check for rate freezed CN configurations
				commonPaymentService.validTxnForRateFreezedCN(cashMemoDao.getSalesTxnDao(), rateFreezedPayment);
			}

			// If Manual foc is given and not any varient code is choosed no need to check
			// the validation
			if (!cashMemoUpdateDto.getManualFoc()
					|| cashMemoUpdateDto.getFinalValue().compareTo(BigDecimal.ZERO) != 0) {
				// metal rate check
				// hold time - pick from location
				commonTransactionService.checkMetalRate(cashMemoDao.getSalesTxnDao(),
						cashMemoUpdateDto.getMetalRateList(), TransactionStatusEnum.valueOf(status), true,
						commonCashMemoService.getHoldTimeInMinutesForCm(), isAvoidMetalRateCheck,
						metalToBeIgnoredForRateCheck);

				// get item details and validate
				cashMemoDetailsDaoList = commonCashMemoService.getCashMemoDetailsIfExists(id, null);
				cashMemoDetailsValidation(cashMemoDetailsDaoList, cashMemoDao, status);
				// validate hallmark at item level on confirm/hold
				checkAndThrowErorrForHallmark(cashMemoDetailsDaoList);
			}
		} else {
			// else get Gift details if exists
			giftDetailsDaoList = commonCashMemoService.getGiftDetailsIfExists(id);
		}

		// If Manual foc is given and not any varient code is choosed no need to check
		// the validation
		if (!cashMemoUpdateDto.getManualFoc() || cashMemoUpdateDto.getFinalValue().compareTo(BigDecimal.ZERO) != 0) {
			validateHoldCashMemoInput(
					(CashMemoResponseDto) MapperUtil.getObjectMapping(cashMemoUpdateDto, new CashMemoResponseDto()),
					cashMemoDao);
		}
		cashMemoDao.getSalesTxnDao().setRemarks(cashMemoUpdateDto.getRemarks());
		SalesTxnDaoExt salesTxn = cashMemoDao.getSalesTxnDao();

		CustomerLocationMappingDao customerLocMappingDao = customerLocationMappingRepository
				.findByCustomerIdAndLocationCode(cashMemoDao.getSalesTxnDao().getCustomerId(),
						CommonUtil.getLocationCode());

		CustomerTxnDaoExt customerTxnDaoExt = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());
		customerTxnDaoExt.setMobileNumber(CryptoUtil.decrypt(customerTxnDaoExt.getMobileNumber(),MOBILE_NO,false));
		customerTxnDaoExt.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(),INSTI_TAX_NO,false));
		customerTxnDaoExt.setEmailId(CryptoUtil.decrypt(customerTxnDaoExt.getEmailId(),EMAIL_ID,false));
        customerTxnDaoExt.setCustomerName(CryptoUtil.decrypt(customerTxnDaoExt.getCustomerName(),CUSTOMER_NAME,false));
        customerTxnDaoExt.setCustTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNo(),CUST_TAX_NO,false));
        customerTxnDaoExt.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
        customerTxnDaoExt.setPassportId(CryptoUtil.decrypt(customerTxnDaoExt.getPassportId(),PASSPORT_ID,false));
		SyncStagingDto syncStagingDto = null;
		SyncStagingDto discountsSyncStagingDto = null;
		List<CustomerCouponDaoExt> customerCouponDaos = null;
		PublishResponse cmResponse = new PublishResponse();
		List<CustomerDocumentsDao> customerDocList = customerDocRepo
				.findByTxnIdAndLocationCodeAndIsActiveTrue(salesTxn.getId(), CommonUtil.getLocationCode());

		AtomicReference<BigDecimal> tcsCollected = new AtomicReference<BigDecimal>();
		tcsCollected.set(BigDecimal.ZERO);

		if (TransactionStatusEnum.HOLD.name().equals(status)) {
			holdCashMemo(cashMemoUpdateDto, cashMemoDao, cashMemoDetailsDaoList);
			salesTxnRepository.save(salesTxn);
		} else if (TransactionStatusEnum.APPROVAL_PENDING.name().equals(status)) {
			// setting is_editable to false before sending for approval
			List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepository
					.findBySalesTxnDaoId(salesTxn.getId());
			for (PaymentDetailsDaoExt paymentDetail : paymentDetailsList) {
				paymentDetail.setIsEditable(false);
			}
			paymentDetailsRepository.saveAll(paymentDetailsList);

			approvalPendingCashMemo(cashMemoUpdateDto, cashMemoDao, cashMemoDetailsDaoList);
			salesTxn = salesTxnRepository.save(salesTxn);
			syncStagingDto = deleteOrApproveCmSyncStagging(salesTxn, null, customerDocList,
					SalesOperationCode.CASHMEMO_APPROVE);
		} else {
			if (!cashMemoUpdateDto.getManualFoc()
					|| cashMemoUpdateDto.getFinalValue().compareTo(BigDecimal.ZERO) != 0) {
				// update isEditable
				paymentList = paymentDetailsRepository.findBySalesTxnDaoId(salesTxn.getId());
				// start of Tcs payment check
				paymentList.stream()
						.filter(paymentDetailsDao -> paymentDetailsDao.getIsTcsPayment()
								&& PaymentStatusEnum.COMPLETED.name().equalsIgnoreCase(paymentDetailsDao.getStatus()))
						.forEach(tcsPayment -> tcsCollected.set(tcsCollected.get().add(tcsPayment.getAmount())));

				if (tcsCollected.get().compareTo(cashMemoDao.getTcsAmount()) != 0) {
					// TODO : need to confirm on error message from Rajani
					throw new ServiceException(INVALID_REQUEST + "Tcs amount mismatch", ERR_SALE_294,
							Map.of(SalesConstants.REMARKS, "Please delete or add the tcs amount to be paid"));
				}
				// end of Tcs check
			}

			cmResponse = confirmCashMemo(cashMemoUpdateDto, cashMemoDao, cashMemoDetailsDaoList);
			CustomerTcsDetailsDaoExt customerTcsDetailsDaoExt = null;
			if (!cashMemoUpdateDto.getManualFoc()
					|| cashMemoUpdateDto.getFinalValue().compareTo(BigDecimal.ZERO) != 0) {
				// Saving tcs details to customer Tcs Details table
				customerTcsDetailsDaoExt = saveCustomerTcsDetails(cashMemoDao.getSalesTxnDao());
			}
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			List<InventoryDetailsDao> inventoryDetails = mapper.convertValue(cmResponse.getApiResponse(),
					new TypeReference<List<InventoryDetailsDao>>() {
					});
			salesTxn.setConfirmedTime(CalendarUtils.getCurrentDate());
			// remarks for not giving FOC

			cashMemoDao.getSalesTxnDao().setFocRemarks(cashMemoUpdateDto.getFocRemarks());

			// add to customer payment
			customerPaymentService.addCustomerPayment(salesTxn, giftDetailsDaoList, paymentList,
					cashMemoDao.getFinalValue(), cashMemoDao.getRoundingVariance(), false, BigDecimal.valueOf(1));

			// if txn status is 'CONFIRMED' update 'isEditable' to false for all payments in
			// the txn.
			if (!CollectionUtil.isEmpty(paymentList)) {
				paymentList.forEach(paymentDetailsDao -> {
					paymentDetailsDao.setIsEditable(false);
					paymentDetailsDao.setPaymentDate(paymentDetailsDao.getSalesTxnDao().getDocDate());

					if (PaymentStatusEnum.REVERSED.name().equals(paymentDetailsDao.getStatus())
							|| PaymentStatusEnum.REVERSED_WITH_CN.name().equals(paymentDetailsDao.getStatus())) {
						paymentDetailsDao.setReversalDate(paymentDetailsDao.getSalesTxnDao().getDocDate());
					}
				});

				paymentList = paymentDetailsRepository.saveAll(paymentList);

			}

			// RIVAAH CARD
			if (customerLocMappingDao.getCustomer() != null
					&& customerTxnDaoExt.getCustomerType().equalsIgnoreCase(CustomerTypeEnum.REGULAR.name())) {
				try {
					customerCouponDaos = checkRivaahEligibility(customerLocMappingDao, salesTxn, cashMemoDetailsDaoList,
							cashMemoDao);
				} catch (ServiceException e) {
					// ignore exception if store is offline
					log.info("Rivaah coupon check skipped. Reason: {}", e.getLocalizedMessage());
				}
			}
			// Update the GV at legacy
			List<GVDetailsUpdateReqDto> gvUpdateReqList = new ArrayList<>();
			Map<String, String> gvPayments = new HashMap<>();// to update payment other details
			for (PaymentDetailsDaoExt payment : paymentList) {
				GiftVoucherOtherDetailsDto gvOtherDetails = MapperUtil.mapJsonDataToClass(payment.getOtherDetails(),
						GiftVoucherOtherDetailsDto.class);
				if (PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode().equals(payment.getPaymentCode())
						&& PaymentStatusEnum.COMPLETED.name().equalsIgnoreCase(payment.getStatus())
						&& BooleanUtils.isNotTrue(gvOtherDetails.getIsLegacyUpdated())) {

					GVDetailsUpdateReqDto gvUpdateReq = new GVDetailsUpdateReqDto();
					gvUpdateReq.setCmNo(payment.getSalesTxnDao().getDocNo());
					gvUpdateReq.setItemCode(payment.getReference2());
					gvUpdateReq.setSerialNo(new BigInteger(payment.getInstrumentNo()));
					gvUpdateReq.setRedeemedLocationCode(payment.getSalesTxnDao().getLocationCode());
					gvUpdateReq.setStatus(GiftVoucherStatusEnum.REDEEMED.name());
					gvOtherDetails.setIsLegacyUpdated(true);
					payment.setOtherDetails(
							MapperUtil.getStringFromJson(new JsonData(payment.getPaymentCode(), gvOtherDetails)));
					gvPayments.put(payment.getId(), payment.getOtherDetails());
					gvUpdateReqList.add(gvUpdateReq);
				}

			}

			if (gvUpdateReqList != null && !gvUpdateReqList.isEmpty()) {
				GVRequestUpdateDto gvreq = new GVRequestUpdateDto();
				gvreq.setGiftVoucherStatus(gvUpdateReqList);
				integrationService.updateLegacyGV(gvreq);
//				paymentDetailsRepository.saveAll(paymentList);
//				commonTransactionService.savePaymentInNewTransaction(gvPayments);

			}

			syncStagingDto = syncStagging(salesTxn, giftDetailsDaoList, cashMemoDetailsDaoList, cashMemoDao,
					inventoryDetails, paymentList, customerDocList, customerCouponDaos, customerTcsDetailsDaoExt);
			discountsSyncStagingDto = commonTxnSycnService.discountSyncStagging(salesTxn);
		}

		// dial integration for few locations
		dialIntegration(id, subTxnType, status, cashMemoDetailsDaoList, giftDetailsDaoList, paymentList, salesTxn);

		// einvoice check for customers with GST(insti tax no.)
		eInvoiceCheck(subTxnType, status, cashMemoDao, cashMemoDetailsDaoList, salesTxn, customerTxnDaoExt);

		List<SyncStagingDto> syncDtoList = new ArrayList<>();
		syncDtoList.add(syncStagingDto);
		if (cmResponse.getSyncStagingDto() != null)
			syncDtoList.add(cmResponse.getSyncStagingDto());
		if (discountsSyncStagingDto != null) {
			syncDtoList.add(discountsSyncStagingDto);
		}
		CashMemoResponseDto cmResponseDto = commonCashMemoService.cashMemoResponse(cashMemoDao);
		if (!CollectionUtil.isEmpty(customerCouponDaos))
			cmResponseDto.setIsRivaah(Boolean.TRUE);
		else
			cmResponseDto.setIsRivaah(Boolean.FALSE);

		cmResponseDto.setTcsCollected(tcsCollected.get());
		cmResponseDto.setTcsToBeCollected(tcsCollected.get());
		cmResponseDto.setIsIGST(cashMemoDao.getIsIGST());
		cmResponse.setApiResponse(cmResponseDto);
		cmResponse.setSyncStagingDtoList(syncDtoList);
		return cmResponse;
	}

	private void checkAndThrowErorrForHallmark(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {
		ProductGroupDao productDtls = null;
		ProductCategoryDao productCategoryDao = null;
		ItemsDto itemsDto = null;
		  LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(CommonUtil.getLocationCode());
		  
		  Boolean	isHallmarkingEnabled =locationCacheDto.getStoreDetails().getIsHallmarkingEnabled();	
	    	if (BooleanUtils.isTrue(isHallmarkingEnabled)) {
	    		for (CashMemoDetailsDaoExt cashMemoDetailsDao : cashMemoDetailsDaoList) {
	    			productDtls = productGroupRepository.findByProductGroupCodeAndIsActive(cashMemoDetailsDao.getProductGroupCode(),
							true);
	    			itemsDto = engineServiceClient.getItemDetails(cashMemoDetailsDao.getItemCode());
					JsonObject jsonObjProDtl = new JsonParser().parse(productDtls.getConfigDetails()).getAsJsonObject();
					Boolean isHallMarked = jsonObjProDtl.getAsJsonObject("data").get("isHallmarked").getAsBoolean();
					productCategoryDao = productCategoryRepository.findOneByProductCategoryCode(cashMemoDetailsDao.getProductCategoryCode());
					JsonObject jsonObjProCaterDtl = new JsonParser().parse(productCategoryDao.getHallmarkDetails()).getAsJsonObject();
					Boolean isAllowedForHallmarking = jsonObjProCaterDtl.getAsJsonObject("data").get("isAllowedForHallmarking").getAsBoolean();
					// product category hallmark details
					HallmarkDetails productCategoryHallmarkDetails = MapperUtil
							.mapJsonDataToClass(productCategoryDao.getHallmarkDetails(), HallmarkDetails.class);
				    ProductGroupConfig productGroupConfigDetails =  MapperUtil.
				    		mapJsonDataToClass(productDtls.getConfigDetails(), ProductGroupConfig.class);
//					if(BooleanUtils.isTrue(isHallMarked) 
//							&& productCategoryHallmarkDetails != null
//							&& BooleanUtils.isTrue(isAllowedForHallmarking)
//							&& checkExcludeKarat(itemsDto , productGroupConfigDetails)) {
//						
//					}else {
//						throw new ServiceException("Item is not Hallmarked and is not available for transaction.", "ERR-SALE-454",
//								"some of the items are non hallmarked at product group level.");
//						
//					}
	    		}
	    	}
	    			
	}
	
	private boolean checkExcludeKarat(ItemsDto itemsDto, ProductGroupConfig productGroupConfigDetails) {

		// @formatter:off
		return (MetalTypeCodeEnum.J.name().equals(itemsDto.getItemTypeCode())
				&& !CollectionUtil.isEmpty(productGroupConfigDetails.getHallmarkingExcludeKarat())
				&& !productGroupConfigDetails.getHallmarkingExcludeKarat().contains(itemsDto.getKarat().setScale(0)))
				|| !MetalTypeCodeEnum.J.name().equals(itemsDto.getItemTypeCode()) // ignore if item is not of type 'J'
				|| CollectionUtil.isEmpty(productGroupConfigDetails.getHallmarkingExcludeKarat());// ignore if exclude karat not configured
		// @formatter:on
	}

	private boolean checkExcludeGrams(OrdersPriceRequest orderPriceRequest, InventoryDetailsDao inventoryDetail,
			ProductGroupConfig productGroupConfigDetails) {
		// @formatter:off
		return (productGroupConfigDetails.getHallmarkingExcludeGrams() != null
				&& (orderPriceRequest.getMeasuredWeight() != null && (orderPriceRequest.getMeasuredWeight() // check for input weight
						.divide(new BigDecimal(orderPriceRequest.getMeasuredQuantity()),3,
								RoundingMode.HALF_UP))
						.compareTo(productGroupConfigDetails.getHallmarkingExcludeGrams()) > 0)
				|| (orderPriceRequest.getMeasuredWeight() == null
						&& (inventoryDetail.getTotalWeight().divide(new BigDecimal(inventoryDetail.getTotalQuantity()),3,
								RoundingMode.HALF_UP)) // else, check for inventory weight
								.compareTo(productGroupConfigDetails.getHallmarkingExcludeGrams()) > 0))
				|| productGroupConfigDetails.getHallmarkingExcludeGrams() == null;// ignore if exclude grams is not configured.
		// @formatter:on
	}

	private boolean checkIfAlreadyOnHold(String status, CashMemoDaoExt cashMemoDao) {
		return TransactionStatusEnum.HOLD.name().equals(status)
				&& TransactionStatusEnum.HOLD.name().equals(cashMemoDao.getSalesTxnDao().getStatus())
				&& commonTransactionService.holdTimeCheck(cashMemoDao.getSalesTxnDao(),
						commonCashMemoService.getHoldTimeInMinutesForCm());
	}

	private CustomerTcsDetailsDaoExt saveCustomerTcsDetails(SalesTxnDaoExt salesTxnDao) {
		CustomerTcsDetailsDaoExt customerTcsDetails = customerTcsDetailsRepository
				.findBySalesTxnDaoId(salesTxnDao.getId());
		CashMemoDaoExt cashMemoDao = cashMemoRepository.getOne(salesTxnDao.getId());
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxnDao.getLocationCode());
		CustomerLocationMappingDao customerLocMappingDao = customerLocationMappingRepository
				.findByCustomerIdAndLocationCode(salesTxnDao.getCustomerId(), CommonUtil.getLocationCode());
		CustomerTcsDetailsDto customerTcsDetailsDto = commonCashMemoService.cumulativeTcsValueCheck(cashMemoDao);

//		CustomerTcsDetailsDaoExt customerTcsDetailsDaoExt=new CustomerTcsDetailsDaoExt();

		if (customerTcsDetails != null) {
			customerTcsDetails.setNetInvoiceAmount(cashMemoDao.getFinalValue());
			if (customerTcsDetailsDto.getTcsToBeCollected() != null
					&& BigDecimal.ZERO.compareTo(customerTcsDetailsDto.getTcsToBeCollected()) < 0) {
				customerTcsDetails.setTcsEligibleAmount(customerTcsDetailsDto.getTcsEligibleAmount());
				customerTcsDetails.setTcsApplicableAmount(customerTcsDetailsDto.getTcsApplicableAmount());
				customerTcsDetails.setTcsPercentage(customerTcsDetailsDto.getTcsPercentage());
				customerTcsDetails.setTcsAmountPaid(customerTcsDetailsDto.getTcsToBeCollected());
				customerTcsDetails.setSrcSyncId(customerTcsDetails.getSrcSyncId() + 1);
			}
			customerTcsDetails = customerTcsDetailsRepository.save(customerTcsDetails);
			return customerTcsDetails;
		} else {

			CustomerTcsDetailsDaoExt customerTcsDetailsDao = new CustomerTcsDetailsDaoExt();
			customerTcsDetailsDao.setBrandCode(locationCacheDto.getBrandCode());
			customerTcsDetailsDao.setOwnerType(locationCacheDto.getOwnerTypeCode());
			customerTcsDetailsDao.setLocationCode(locationCacheDto.getLocationCode());
			customerTcsDetailsDao.setSalesTxnDao(salesTxnDao);
//			Optional.ofNullable(customerLocMappingDao.getCustomer()).ifPresent(customerDao -> {
				if(customerLocMappingDao.getCustomer() != null) {
				customerTcsDetailsDao.setCustomer(customerLocMappingDao.getCustomer());
				customerTcsDetailsDao
						.setMobileNumber(CryptoUtil.decrypt(customerLocMappingDao.getCustomer().getMobileNumber(), "MOBILE_NO", false));
				customerTcsDetailsDao.setUlpId(customerLocMappingDao.getCustomer().getUlpId());

			}
//				);

//			Optional.ofNullable(locationCacheDto.getTcsDetails()).ifPresent(tcsDetails -> {
				if(locationCacheDto.getTcsDetails() != null) {
				if (!ObjectUtils.isEmpty(locationCacheDto.getTcsDetails().getIsTcsApplicable()) && locationCacheDto.getTcsDetails().getIsTcsApplicable()
						&& !ObjectUtils.isEmpty(locationCacheDto.getTcsDetails().getLocationPanNumber())
						&& !ObjectUtils.isEmpty(locationCacheDto.getTcsDetails().getTcsApplicableDate())) {
					customerTcsDetailsDao.setStorePan(locationCacheDto.getTcsDetails().getLocationPanNumber());
				}
			}
//		);

			customerTcsDetailsDao.setDocNo(salesTxnDao.getDocNo());
			customerTcsDetailsDao.setFiscalYear(salesTxnDao.getFiscalYear());
			customerTcsDetailsDao.setTransactionDate(salesTxnDao.getDocDate());
			BigDecimal finalValue = cashMemoDao.getTcsAmount().compareTo(BigDecimal.ZERO) == 0
					? cashMemoDao.getFinalValue()
					: cashMemoDao.getFinalValue().subtract(cashMemoDao.getTcsAmount());
			customerTcsDetailsDao.setNetInvoiceAmount(finalValue);
			if (customerTcsDetailsDto.getTcsToBeCollected() != null
					&& BigDecimal.ZERO.compareTo(customerTcsDetailsDto.getTcsToBeCollected()) < 0) {
				customerTcsDetailsDao.setTcsEligibleAmount(customerTcsDetailsDto.getTcsEligibleAmount());
				customerTcsDetailsDao.setTcsApplicableAmount(customerTcsDetailsDto.getTcsApplicableAmount());
				customerTcsDetailsDao.setTcsPercentage(customerTcsDetailsDto.getTcsPercentage());
				customerTcsDetailsDao.setTcsAmountPaid(customerTcsDetailsDto.getTcsToBeCollected());
			}
			customerTcsDetailsDao = customerTcsDetailsRepository.save(customerTcsDetailsDao);
			return customerTcsDetailsDao;
		}
	}

	private List<CustomerCouponDaoExt> checkRivaahEligibility(CustomerLocationMappingDao customerLocMappingDao,
			SalesTxnDaoExt salesTxn, List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, CashMemoDaoExt cashMemoDao) {
		RuleRequestListDto ruledetailsCoupon = new RuleRequestListDto();
		ruledetailsCoupon.setIsRivaah(Boolean.TRUE);
		ruledetailsCoupon.setLocationCode(CommonUtil.getLocationCode());
		List<CustomerCouponDaoExt> customerCouponResponse = new ArrayList<>();
		Map<String, BigDecimal> grammageMap = new HashMap<>();
		Object objectCoupon = engineService.getRuleFieldValues(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY, ruledetailsCoupon);
		if (objectCoupon != null) {
			RivaahCardCouponDetails rivaahCouponValidity = null;
			try {
				rivaahCouponValidity = MapperUtil.mapObjToClass(objectCoupon, RivaahCardCouponDetails.class);
			} catch (Exception e) {
				log.debug("Json parse issue");
			}
			if (rivaahCouponValidity != null && rivaahCouponValidity.getNoOfDigits() != null
					&& rivaahCouponValidity.getNoOfTimesCouponCanBeUsed() != null
					&& rivaahCouponValidity.getStartingDigits() != null
					&& rivaahCouponValidity.getValidityNoOfMonths() != null) {
				ApiResponseDto apiResponse = commonCashMemoService
						.callEpossCustomerCoupon(customerLocMappingDao.getCustomer().getId(), null, null, null);
				if (apiResponse != null && apiResponse.getResponse() != null) {
					CustomerCouponDto customerCouponDto = MapperUtil.getObjectMapperInstance()
							.convertValue(apiResponse.getResponse(), CustomerCouponDto.class);
					if (salesTxn.getDocDate().after(customerCouponDto.getExpiryDate())) {
						commonCashMemoService.callEpossCustomerCoupon(customerLocMappingDao.getCustomer().getId(), null,
								RivaahCardStatusEnum.EXPIRED.name(), null);
						return rivaahCardCouponForCustomer(customerLocMappingDao, salesTxn, rivaahCouponValidity,
								customerCouponResponse);
					} else {
						return customerCouponResponse;
					}
				}
				for (CashMemoDetailsDaoExt cashmemoItem : cashMemoDetailsDaoList) {
					if (CollectionUtils.isEmpty(grammageMap)) {
						grammageMap.put(cashmemoItem.getProductCategoryCode(), cashmemoItem.getTotalWeight());
					} else {
						if (grammageMap.containsKey(cashmemoItem.getProductCategoryCode())) {
							grammageMap.put(cashmemoItem.getProductCategoryCode(), grammageMap
									.get(cashmemoItem.getProductCategoryCode()).add(cashmemoItem.getTotalWeight()));
						} else {
							grammageMap.put(cashmemoItem.getProductCategoryCode(), cashmemoItem.getTotalWeight());
						}
					}
				}
				for (CashMemoDetailsDaoExt cashmemoItem : cashMemoDetailsDaoList) {
					RuleRequestListDto ruledetailsProduct = new RuleRequestListDto();
					ruledetailsProduct.setProductCategoryCode(cashmemoItem.getProductCategoryCode());
					ruledetailsProduct.setProductGroupCode(cashmemoItem.getProductGroupCode());
					ruledetailsProduct.setLocationCode(CommonUtil.getLocationCode());
					Object objectProduct = null;
					try {
						objectProduct = engineService.getRuleFieldValues(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY,
								ruledetailsProduct);
					} catch (Exception e) {
						log.debug("Configuration not added");
					}
					if (objectProduct != null) {
						List<RivaahEligibilityProductMappingDetails> rivaahProducts = new ArrayList<>();
						try {
							rivaahProducts = MapperUtil.jsonStrToList(MapperUtil.getJsonString(objectProduct),
									RivaahEligibilityProductMappingDetails.class);
						} catch (Exception e) {
							log.debug("Json parse issue");
						}
						if (!CollectionUtils.isEmpty(rivaahProducts)) {
							for (RivaahEligibilityProductMappingDetails rivaahProduct : rivaahProducts) {
								if ((rivaahProduct != null) && (rivaahProduct.getOccasion() != null)
										&& (rivaahProduct.getGrammage() != null)
										&& (rivaahProduct.getIsActive() != null)
										&& (rivaahProduct.getEleventhDigit() != null)
										&& (BooleanUtils.isTrue(rivaahProduct.getIsActive()))
										&& (cashMemoDao.getOccasion() != null)
										&& ((cashMemoDao.getOccasion().equalsIgnoreCase(rivaahProduct.getOccasion()))
												|| (rivaahProduct.getOccasion().equalsIgnoreCase("ALL")))
										&& (rivaahProduct.getEleventhDigit()
												.contains(Character.toString(cashmemoItem.getItemCode().charAt(10))))) {
									if (cashmemoItem.getTotalWeight().compareTo(rivaahProduct.getGrammage()) > 0) {
										return rivaahCardCouponForCustomer(customerLocMappingDao, salesTxn,
												rivaahCouponValidity, customerCouponResponse);
									}
									if (grammageMap.get(cashmemoItem.getProductCategoryCode())
											.compareTo(rivaahProduct.getGrammage()) > 0) {
										return rivaahCardCouponForCustomer(customerLocMappingDao, salesTxn,
												rivaahCouponValidity, customerCouponResponse);
									}
								}
							}
						}
					}
				}
			}
		}
		return customerCouponResponse;
	}

	private List<CustomerCouponDaoExt> rivaahCardCouponForCustomer(CustomerLocationMappingDao customerLocMappingDao,
			SalesTxnDaoExt salesTxn, RivaahCardCouponDetails rivaahCouponValidity,
			List<CustomerCouponDaoExt> customerCouponResponse) {

		commonCashMemoService.callEpossCustomerCoupon(customerLocMappingDao.getCustomer().getId(), null,
				TransactionTypeEnum.CM.name(), null);
		String couponToSend = validateCouponUniqueness(rivaahCouponValidity.getStartingDigits(),
				rivaahCouponValidity.getNoOfDigits());
		return sendRivaahCardCoupon(customerLocMappingDao, salesTxn, SalesCouponEnum.RIVAAH_CARD.name(), couponToSend,
				customerCouponResponse, Integer.parseInt(rivaahCouponValidity.getValidityNoOfMonths()),
				rivaahCouponValidity.getNoOfTimesCouponCanBeUsed());
	}

	private String validateCouponUniqueness(String startingDigits, String lengthOfTheCoupon) {
		String couponCode = null;
		couponCode = generateRivaahCardCoupon(startingDigits, lengthOfTheCoupon);
		CustomerCouponDto couponStatus = new CustomerCouponDto();
		couponStatus.setStatus(RivaahCardStatusEnum.OPEN.name());
		while (!couponStatus.getStatus().equalsIgnoreCase(RivaahCardStatusEnum.EXPIRED.name())) {
			couponCode = generateRivaahCardCoupon(startingDigits, lengthOfTheCoupon);
			ApiResponseDto couponexits = commonCashMemoService.callEpossCustomerCoupon(null, couponCode, null, null);
			couponStatus = MapperUtil.getObjectMapperInstance().convertValue(couponexits.getResponse(),
					CustomerCouponDto.class);
		}
		return couponCode;
	}

	private String generateRivaahCardCoupon(String startingDigits, String lengthOfTheCoupon) {
		StringBuilder generate = new StringBuilder();
		Random random = new SecureRandom();
		char[] chars = COUPON_GENERATOR.toCharArray();
		generate.append(startingDigits);
		for (int flag = 0; flag < Integer.parseInt(lengthOfTheCoupon) - startingDigits.length(); flag++) {
			char a = chars[random.nextInt(chars.length)];
			generate.append(a);
		}
		String coupon = generate.toString();
		return coupon;
	}

	private List<CustomerCouponDaoExt> sendRivaahCardCoupon(CustomerLocationMappingDao customerLocMappingDao,
			SalesTxnDaoExt salesTxn, String couponTypeStr, String couponCodeStr,
			List<CustomerCouponDaoExt> customerCouponResponse, Integer expiryMonths, Integer noOfTimes) {
		Map<String, String> data = new HashMap<>();
		CustomerCouponDaoExt customerCoupon = new CustomerCouponDaoExt();
		CustomerDaoExt customerExt = (CustomerDaoExt) MapperUtil.getDtoMapping(customerLocMappingDao.getCustomer(),
				CustomerDaoExt.class);
		customerCoupon.setCustomer(customerExt);
		customerCoupon.setCouponType(couponTypeStr);
		customerCoupon.setCouponCode(couponCodeStr);
		customerCoupon.setRefId(salesTxn.getId());
		customerCoupon.setDocDate(salesTxn.getDocDate());
		customerCoupon.setStatus(RivaahCardStatusEnum.OPEN.name());
		customerCoupon.setAttempts(0);
		customerCoupon.setIsActive(Boolean.TRUE);
		customerCoupon.setSrcSyncId(0);
		customerCoupon.setDestSyncId(0);
		Calendar cal = Calendar.getInstance();
		cal.setTime(salesTxn.getDocDate());
		cal.add(Calendar.MONTH, expiryMonths);
		customerCoupon.setExpiryDate(cal.getTime());
		customerCoupon.setTotalCount(noOfTimes);
		data.put("coupon", couponCodeStr);
		data.put("attempts", "0");
		data.put("totalCount", noOfTimes.toString());
		data.put("expiryDate", cal.getTime().toString());
		CustomerDetailsDto customer = customerService
				.getCustomer(customerLocMappingDao.getCustomerLocationMappingId().getCustomerId());
		data.put("name", StringUtil.getNameForEmail(customer.getCustomerName()));
		customerCoupon = customerCouponRepository.save(customerCoupon);
		sendNotificationToCustomer(customer, data);
		customerCouponResponse.add(customerCoupon);
		return customerCouponResponse;

	}

	public void sendNotificationToCustomer(CustomerDetailsDto customer, Map<String, String> data) {
		NotificationType notfType = NotificationType.RIVAAH_CARD_COUPON;
//		if (StringUtils.isEmpty(customer.getEmailId()))
//			customer.setEmailId("default@mindtree.com");
		otpService.checkIfCustomerContactInfoPresent(notfType, customer);

		NotificationDto notificationDto = new NotificationDto();
		if (!StringUtils.isEmpty(customer.getEmailId()))
			notificationDto.setEmailIds(Set.of(customer.getEmailId()));
		if (!StringUtils.isEmpty(customer.getMobileNumber()))
			notificationDto.setMobileNo(customer.getMobileNumber());
		NotificationTypeDataDto notf = new NotificationTypeDataDto(NotificationType.RIVAAH_CARD_COUPON, data, null,
				null);
		notificationDto.setNotificationTypeData(List.of(notf));
		notificationDto.setLocationCode(CommonUtil.getLocationCode());
		integrationService.sendNotification(notificationDto);
	}

	public void eInvoiceCheck(String subTxnType, String status, CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, SalesTxnDaoExt salesTxn,
			CustomerTxnDaoExt customerTxnDaoExt) {

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());

		StoreDetails storeDetails = locationCacheDto.getStoreDetails();
		if (BooleanUtils.isTrue(storeDetails.getIsEinvoiceEnabled())
				&& !SubTxnTypeEnum.GIFT_SALE.name().equals(subTxnType)
				&& status.equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name())) {
			SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = salesInvoiceDocumentsRepository
					.findByReferenceIdAndTransactionType(salesTxn.getId(),
							EinvoiceTransactionTypeEnum.CASH_MEMO.name());
			EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = new EinvoiceIrnDetailsResponseDto();
			if (salesInvoiceDocumentsDao == null) {
				einvoiceIrnDetailsResponseDto = generateInvoice(cashMemoDetailsDaoList, salesTxn, cashMemoDao,
						customerTxnDaoExt);
				if (BooleanUtils.isTrue(einvoiceIrnDetailsResponseDto.getStatus())) {
					salesInvoiceDocumentsDao = MapperUtil.mapObjToClass(einvoiceIrnDetailsResponseDto,
							SalesInvoiceDocumentsDao.class);
					salesInvoiceDocumentsDao.setReferenceId(salesTxn.getId());
					salesInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.CASH_MEMO.name());
					salesInvoiceDocService.syncDataInvoiceDocs(salesInvoiceDocumentsDao);
				}
			}
		}
	}

	private EinvoiceIrnDetailsResponseDto generateInvoice(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList,
			SalesTxnDaoExt salesTxn, CashMemoDaoExt cashMemoDao, CustomerTxnDaoExt customerTxnDaoExt) {
		EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = new EinvoiceIrnDetailsResponseDto();
		if (!StringUtils.isEmpty(customerTxnDaoExt.getInstiTaxNo())) {
			Boolean isGstInVerified = checkGstInVerfication(salesTxn.getCustomerId(), salesTxn.getLocationCode(),
					CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(),INSTI_TAX_NO));
			if (!isGstInVerified)
				throw new ServiceException("GSTIN number of the customer is Invalid,Unable to generate E-INVOICE",
						"ERR-SALE-315");
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto = commonTransactionService.getCustomerDetails(
					CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(),INSTI_TAX_NO),CryptoUtil.decrypt(customerTxnDaoExt.getCustomerName(),CUSTOMER_NAME),
					customerTxnDaoExt.getCustomerDetails(), salesTxn.getDocNo(), salesTxn.getDocDate());
			if (!StringUtils.isEmpty(einvoiceIrnDetailsDto.getSellerGstn())) {
				einvoiceIrnDetailsDto.setTransactionId(salesTxn.getId());
				getOtherChargeDetails(einvoiceIrnDetailsDto, cashMemoDao);
				List<EinvoiceItemDetailsDto> einvoiceItemDetailsDto = new ArrayList<>();
				cashMemoDetailsDaoList.forEach(cashMemoDetail -> {
					EinvoiceItemDetailsDto einvoiceItemDetails = new EinvoiceItemDetailsDto();
					einvoiceItemDetails.setSerialNo(cashMemoDetailsDaoList.indexOf(cashMemoDetail) + 1);
					List<String> itemCodes = new ArrayList<>();
					itemCodes.add(cashMemoDetail.getItemCode());
					Map<String, ItemDetailsDto> itemsDetailMap = engineService.listItemDetails(itemCodes);
					ItemDetailsDto itemDetailsDto = itemsDetailMap.get(cashMemoDetail.getItemCode());
					if (!StringUtils.isEmpty(itemDetailsDto.getHsnCode()))
						einvoiceItemDetails.setHsnCode(itemDetailsDto.getHsnCode());
					einvoiceItemDetails.setQuantity(cashMemoDetail.getTotalQuantity().intValue());
					einvoiceItemDetails.setUnit(salesTxn.getWeightUnit());
					einvoiceItemDetails.setUnitPrice(cashMemoDetail.getUnitValue());
					einvoiceItemDetails.setDiscount(cashMemoDetail.getTotalDiscount());
					if (!StringUtils.isEmpty(cashMemoDetail.getTaxDetails())) {
						TaxCalculationResponseDto taxCalculationResponseDto = MapperUtil.getObjectMapperInstance()
								.convertValue(MapperUtil.getJsonFromString(cashMemoDetail.getTaxDetails()),
										TaxCalculationResponseDto.class);
						einvoiceItemDetails = commonTransactionService.getTaxDetails(taxCalculationResponseDto,
								einvoiceItemDetails);
					}
					einvoiceItemDetailsDto.add(einvoiceItemDetails);
				});
				einvoiceIrnDetailsDto.setEinvoiceItemDetailsDto(einvoiceItemDetailsDto);
				einvoiceIrnDetailsResponseDto = integrationService.generateIrn(VendorCodeEnum.IRN_ASPTAX.name(),
						EinvoiceTransactionTypeEnum.CASH_MEMO.name(), einvoiceIrnDetailsDto);
			}
		}
		return einvoiceIrnDetailsResponseDto;
	}

	private Boolean checkGstInVerfication(Integer customerId, String locationCode, String instiTaxNo) {
		CustomerDao customerDao = customerService.checkIfCustomerExists(customerId, locationCode).getCustomer();
		if (BooleanUtils.isTrue(customerDao.getIsInstiTaxNoVerified())) {
			return true;
		} else {
			EinvoiceGstVerifyResponseDto einvoiceGstVerifyResponseDto = integrationService
					.verifyGstIn(VendorCodeEnum.IRN_ASPTAX.name(), instiTaxNo);
			if (BooleanUtils.isTrue(einvoiceGstVerifyResponseDto.getStatus()))
				customerDao.setIsInstiTaxNoVerified(Boolean.TRUE);
			else
				customerDao.setIsInstiTaxNoVerified(Boolean.FALSE);
			customerDao = customerService.updateCustomerData(customerDao);
			return customerDao.getIsInstiTaxNoVerified();
		}
	}

	private void getOtherChargeDetails(EinvoiceIrnDetailsDto einvoiceIrnDetailsDto, CashMemoDaoExt cashMemoDao) {
		if (!StringUtil.isBlankJsonStr(cashMemoDao.getOtherCharges())) {
			JsonObject jsonObject = new JsonParser().parse(cashMemoDao.getOtherCharges()).getAsJsonObject();
			if (jsonObject.getAsJsonObject("data") != null) {
				JsonObject json = jsonObject.getAsJsonObject("data").getAsJsonObject();
				if (json != null && json.get("value") != null)
					einvoiceIrnDetailsDto.setOtherCharge(json.get("value").getAsBigDecimal());
			}
		}
	}

	private void dialIntegration(String id, String subTxnType, String status,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, List<GiftDetailsDaoExt> giftDetailsDaoList,
			List<PaymentDetailsDaoExt> paymentList, SalesTxnDaoExt salesTxn) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		if (locationCacheDto != null && locationCacheDto.getStoreDetails().getIsDial()
				&& (status.equalsIgnoreCase(TransactionStatusEnum.HOLD.name())
						|| status.equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name()))) {
			EventCashMemoDto eventCashMemoDto = new EventCashMemoDto();
			List<EventCashMemoDetailsDto> eventCashMemoDetailsDtoList = new ArrayList<>();
			List<EventGiftSaleDetailsDto> eventGiftSaleDetailsDtoList = new ArrayList<>();
			List<EventPaymentDetailsDto> eventPaymentDetailsDtoList = new ArrayList<>();
			if (!cashMemoDetailsDaoList.isEmpty()) {
				cashMemoDetailsDaoList
						.forEach(cashMemo -> eventCashMemoDetailsDtoList.add((EventCashMemoDetailsDto) MapperUtil
								.getObjectMapping(cashMemo, new EventCashMemoDetailsDto())));
			}
			if (!giftDetailsDaoList.isEmpty()) {
				cashMemoDetailsDaoList
						.forEach(giftDetails -> eventGiftSaleDetailsDtoList.add((EventGiftSaleDetailsDto) MapperUtil
								.getObjectMapping(giftDetails, new EventGiftSaleDetailsDto())));
			}
			if (!paymentList.isEmpty()) {
				paymentList.forEach(payment -> eventPaymentDetailsDtoList.add(
						(EventPaymentDetailsDto) MapperUtil.getObjectMapping(payment, new EventPaymentDetailsDto())));
			}
			CustomerTxnDaoExt customerTxnDaoExt = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());
			customerTxnDaoExt.setMobileNumber(CryptoUtil.decrypt(customerTxnDaoExt.getMobileNumber(),MOBILE_NO,false));
			customerTxnDaoExt.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(),INSTI_TAX_NO,false));
			customerTxnDaoExt.setEmailId(CryptoUtil.decrypt(customerTxnDaoExt.getEmailId(),EMAIL_ID,false));
	        customerTxnDaoExt.setCustomerName(CryptoUtil.decrypt(customerTxnDaoExt.getCustomerName(),CUSTOMER_NAME,false));
	        customerTxnDaoExt.setCustTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNo(),CUST_TAX_NO,false));
	        customerTxnDaoExt.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
	        customerTxnDaoExt.setPassportId(CryptoUtil.decrypt(customerTxnDaoExt.getPassportId(),PASSPORT_ID,false));
			eventCashMemoDto.setCustomer(commonTransactionService
					.getEventCustomer(customerTxnDaoExt));
			eventCashMemoDto.setCashMemoDetailsList(eventCashMemoDetailsDtoList);
			eventCashMemoDto.setGiftSaleDetailsList(eventGiftSaleDetailsDtoList);
			eventCashMemoDto.setPaymentDetailsList(eventPaymentDetailsDtoList);
			integrationService.cashMemoDetails(VendorCodeEnum.DIAL_MILESTONE.name(), id, subTxnType, status,
					Boolean.FALSE, eventCashMemoDto);
		}
	}

	/**
	 * This method will validate CM for HOLD.
	 * 
	 * @param cashMemoUpdateDto
	 * @param cashMemoDao
	 */
	private void holdCashMemo(CashMemoUpdateDto cashMemoUpdateDto, CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		// payment check to restrict HOLD - removed from story: NAP-3856
		// pending: Amex discount check to be restrict in HOLD(NAP-3699)

		// Validate If DV discount already applied: NAP-3692
		discountUtilService.checkIfDVApplied(cashMemoDao.getSalesTxnDao(),
				SalesConstants.TRANSACTION_CANNOT_BE_PUT_ON_HOLD + " as GHS DV is added.", null);

		// check input paid value
		List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(cashMemoDao.getId(), null, null, null,
						CommonUtil.getLocationCode(), PaymentStatusEnum.getPaidPaymentStatus());

		BigDecimal paidValue = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> restrictedPaymentsForHold = new ArrayList<>();

		if (!CollectionUtil.isEmpty(paymentDetailsList)) {
			paidValue = paymentDetailsList.stream().map(PaymentDetailsDaoExt::getAmount).reduce(BigDecimal.ZERO,
					(i, j) -> i.add(j));

			restrictedPaymentsForHold = paymentDetailsList.stream().filter(
					payment -> PaymentCodeEnum.getPaymentsRestrictedForHold().contains(payment.getPaymentCode()))
					.collect(Collectors.toList());
		}

		if (paidValue.compareTo(cashMemoUpdateDto.getPaidValue()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Paid Value expected: " + paidValue + " found: " + cashMemoUpdateDto.getPaidValue());
		}

		// payment check to restrict HOLD - NAP-3699 (for UNIPAY)
		if (!CollectionUtil.isEmpty(restrictedPaymentsForHold)) {
			throw new ServiceException(SalesConstants.TRANSACTION_CANNOT_BE_PUT_ON_HOLD, SalesConstants.ERR_SALE_047,
					"Please delete following payments to put transaction on HOLD: "
							+ PaymentCodeEnum.getPaymentsRestrictedForHold());
		}

		// check if item is on hold in another CM.
		itemCheckBeforeUpdate(cashMemoDetailsDaoList);

		// hold time to salesTxnDao - not req for GIFT sale
		setHoldTime(cashMemoDao.getSalesTxnDao());

		// sales doc number generation if sales_txn was previously in 'OPEN' status.
		if (TransactionStatusEnum.OPEN.name().equals(cashMemoDao.getSalesTxnDao().getStatus())) {
			cashMemoDao.setSalesTxnDao(commonTransactionService.getSalesTxnDao(cashMemoDao.getSalesTxnDao(),
					TransactionTypeEnum.CM.name(), cashMemoDao.getSalesTxnDao().getSubTxnType(),
					SalesDocTypeEnum.CM_HOLD, TransactionStatusEnum.HOLD));
		}
	}

	/**
	 * 
	 * 
	 * This method will raise a request for approval for manual bill.
	 * 
	 * @param cashMemoUpdateDto
	 * @param cashMemoDao
	 */
	private void approvalPendingCashMemo(CashMemoUpdateDto cashMemoUpdateDto, CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		ManualBillTxnDetailsDto manualBillDetails = commonTransactionService
				.mapJsonToManualBillDetails(cashMemoDao.getSalesTxnDao().getManualBillDetails());

		// 'REQUEST_APPROVAL' status is allowed only when validationType is
		// 'REQUEST_APPROVAL'
		if (!ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {
			throw new ServiceException(INVALID_UPDATE, ERR_SALE_090,
					"Mismatch between Manual Bill validation type and status");
		}
		// validate manula bil details
		commonCashMemoService.validateManualBillValues(cashMemoDao, cashMemoDetailsDaoList, true);

		// for req data: item, Payment mode, Discount, FOC & Employee discount
		// item data
		List<Object> itemDtoList = new ArrayList<>();
		cashMemoDetailsDaoList.forEach(cashMemoDetailsDao -> {
			ItemDetailsResponseDto itemDetailsResponseDto = commonCashMemoService
					.mapCashMemoDetailsToItemDto(cashMemoDetailsDao);
			itemDtoList.add(itemDetailsResponseDto);
		});

		// payment data
		ListResponse<SalesPaymentDto> paymentDtoList = paymentFacadeService
				.getPaymentDetails(cashMemoDao.getSalesTxnDao().getId(), null, null, null);

		// workFlowType MANUAL_BILL
		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(cashMemoUpdateDto.getRemarks());

		// CM header details
		ManaulBillRequestHeaderDto manaulBillRequestHeaderDto = (ManaulBillRequestHeaderDto) MapperUtil
				.getObjectMapping(commonCashMemoService.cashMemoResponse(cashMemoDao),
						new ManaulBillRequestHeaderDto());
		// customer details from customer master
		manaulBillRequestHeaderDto = (ManaulBillRequestHeaderDto) MapperUtil.getObjectMapping(
				customerService.getCustomer(cashMemoDao.getSalesTxnDao().getCustomerId()), manaulBillRequestHeaderDto);

		workflowProcessCreateDto.setHeaderData(new JsonData("MANUAL_BILL_HEADER", manaulBillRequestHeaderDto));

		// set request data
		ManaulBillRequestDetailsDto manaulBillRequestDetailsDto = new ManaulBillRequestDetailsDto();
		manaulBillRequestDetailsDto.setItemList(itemDtoList);
		manaulBillRequestDetailsDto.setPaymentList(paymentDtoList.getResults());
		// pending - discount details.
		manaulBillRequestDetailsDto.setDiscountList(List.of());

		workflowProcessCreateDto.setRequestData(new JsonData("MANUAL_BILL_DETAILS", manaulBillRequestDetailsDto));

		// filters -manulbillNo & locationCode.
		workflowProcessCreateDto
				.setFilterValues(Map.of("manualBillNo", manualBillDetails.getManualBillDetails().getManualBillNo(),
						"locationCode", CommonUtil.getLocationCode()));

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.MANUAL_BILL.name());

		WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = epossCallService.callEposs(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL, reqParams, workflowProcessCreateDto,
				WorkflowProcessCreateResponseDto.class);

		// set process id, requestNo (docNo from workflow) for reference
		manualBillDetails.getManualBillDetails().setProcessId(workflowProcessCreateResponseDto.getProcessId());
		manualBillDetails.getManualBillDetails().setRequestNo(workflowProcessCreateResponseDto.getDocNo());

		cashMemoDao.getSalesTxnDao().setManualBillDetails(MapperUtil.getStringFromJson(manualBillDetails));

		cashMemoDao.setSalesTxnDao(commonTransactionService.getSalesTxnDao(cashMemoDao.getSalesTxnDao(),
				TransactionTypeEnum.CM.name(), cashMemoDao.getSalesTxnDao().getSubTxnType(),
				SalesDocTypeEnum.CM_PENDING, TransactionStatusEnum.APPROVAL_PENDING));

	}

	private void itemCheckBeforeUpdate(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {
		List<String> itemsNotInStock = new ArrayList<>();
		// check if item is on hold in another CM.
		cashMemoDetailsDaoList.forEach(cashMemoDetailsDao -> {

			boolean isCoinStockCheck = SalesConstants.COIN_PRODUCT_GROUP_CODES
					.contains(cashMemoDetailsDao.getProductGroupCode());

			InvWeightAndQuantityDto itemCodeAndQuantityDto = inventoryService.checkIfItemIsInStock(
					cashMemoDetailsDao.getInventoryId(), cashMemoDetailsDao.getItemCode(),
					cashMemoDetailsDao.getInventoryWeight(), cashMemoDetailsDao.getProductGroupCode(),
					cashMemoDetailsDao.getTotalQuantity(), isCoinStockCheck);

			if (BooleanUtils.isTrue(itemCodeAndQuantityDto.getIsItemInStock())) {
				commonCashMemoService.checkIfItemIsAlreadyAdded(itemCodeAndQuantityDto.getTotalQuantity().shortValue(),
						cashMemoDetailsDao);
			} else {
				itemsNotInStock.add(cashMemoDetailsDao.getId());
			}

		});

		// if items are not in stock, throw error
		if (!CollectionUtils.isEmpty(itemsNotInStock)) {
			throw new ServiceException(SalesConstants.SOME_ITEMS_IN_THE_TRANSACTION_ARE_OUT_OF_STOCK_KINDLY_DELETE_THEM,
					SalesConstants.ERR_SALE_103, itemsNotInStock);// do not comment, as list is used by UI
		}
	}

	/**
	 * This method will validate CM for CONFIRMED
	 * 
	 * @param cashMemoUpdateDto
	 * @param cashMemoDao
	 * @return
	 */
	@Override
	public PublishResponse confirmCashMemo(CashMemoUpdateDto cashMemoUpdateDto, CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		// All discounts should be in CONFIRMED status to CONFIRM CM
		commonTransactionService.discountValidationsOnConfirmTransaction(cashMemoDao.getSalesTxnDao());

		// check if item is on hold in another CM.
		itemCheckBeforeUpdate(cashMemoDetailsDaoList);

		// validate manual bill details
		ManualBillTxnDetailsDto manualBillDetails = commonCashMemoService.validateManualBillValues(cashMemoDao,
				cashMemoDetailsDaoList, true);

		// if manual bill validationType is REQUEST_APPROVAL, then
		// 1. previous state of CM should be PENDING
		// 2. check if request is APPROVED.
		// 2.1 . If request is rejected, clear manual bill id and save txn status as
		// 'REJECTED'
		if (ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {

			String approvalStatus = checkManualBillRequestStatus(manualBillDetails);

			if (!WorkflowProcessStatusEnum.APPROVED.name().equals(approvalStatus)) {
				throw new ServiceException(REQUEST_IS_NOT_APPROVED, ERR_SALE_098, "Request status should be: "
						+ WorkflowProcessStatusEnum.APPROVED.name() + ", found: " + approvalStatus);
			}

		}

		if (!cashMemoUpdateDto.getManualFoc() || cashMemoUpdateDto.getFinalValue().compareTo(BigDecimal.ZERO) != 0) {
			// All payment status should be confirmed
			BigDecimal paidValue = checkPaidValue(cashMemoDao.getSalesTxnDao().getId(),
					cashMemoUpdateDto.getPaidValue(), PaymentStatusEnum.COMPLETED.name());

			// if CONFIRM, then paid value should be equal to final Value
			if (paidValue.compareTo(cashMemoDao.getFinalValue()) != 0) {
				throw new ServiceException(PAID_VALUE_SHOULD_MATCH_FINAL_VALUE, ERR_SALE_063,
						"Please pay the remaining amount");
			}
			// if final Value above configured amount in Brand details, then PAN check(based
			// on configuration)
			commonTransactionService.customerDetailsCheckForFinalValue(paidValue, cashMemoDao.getSalesTxnDao());
		}

		UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItems = new UpdateInvItemAndSalesItemDto();
		if (SubTxnTypeEnum.GIFT_SALE.name().equals(cashMemoDao.getSalesTxnDao().getSubTxnType())) {
			cashMemoGiftService.activateGifts(cashMemoDao);
		} else {
			// else: get inventory ids for update and CMDetails for coin update
			List<SalesItemDto> salesItemDtoList = new ArrayList<>();
			List<SalesItemDto> salesItemDtoListForAbCoins = new ArrayList<>();

			cashMemoDetailsDaoList.forEach(cashMemoDetailsDao -> {
				SalesItemDto salesItemDto = (SalesItemDto) MapperUtil.getDtoMapping(cashMemoDetailsDao,
						SalesItemDto.class);
				// for hallmark check
				PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(cashMemoDetailsDao.getPriceDetails(),
						PriceDetailsDto.class);
				salesItemDto.setIsHallmarked(priceDetails.getItemHallmarkDetails() == null ? Boolean.FALSE
						: priceDetails.getItemHallmarkDetails().getHallmarkingCharges() != null);// if hallmark charges
																									// are present, then
																									// hallmark is
																									// applicable
				if (checkIfCoinFromAdvBooking(cashMemoDao, cashMemoDetailsDao, salesItemDto)) {
					salesItemDtoListForAbCoins.add(salesItemDto);
				} else {
					salesItemDtoList.add(salesItemDto);
				}
			});
			// get details to deduct from inventory
			updateInvItemsAndSalesItems = getInvDetailsToUpdate(cashMemoDao, salesItemDtoList,
					salesItemDtoListForAbCoins);

		}

		// Validate & Update Order details, if pre-order exists.
		SyncStagingDto syncDto = validateAndUpdateOrderIfApplicable(cashMemoDao, cashMemoDetailsDaoList);

		// set doc no.
		cashMemoDao.setSalesTxnDao(commonTransactionService.getSalesTxnDao(cashMemoDao.getSalesTxnDao(),
				TransactionTypeEnum.CM.name(), cashMemoDao.getSalesTxnDao().getSubTxnType(), SalesDocTypeEnum.CM,
				TransactionStatusEnum.CONFIRMED));

		List<InventoryDetailsDao> updatedInventoryDetails = updateInventoryAndCashMemoDetails(cashMemoDao,
				cashMemoDetailsDaoList, updateInvItemsAndSalesItems);

		// confirm GHS payments (if Exists)
		List<PaymentDetailsDaoExt> ghsPaymentList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(cashMemoDao.getSalesTxnDao().getId(),
						PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null,
						cashMemoDao.getSalesTxnDao().getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));
		if (!CollectionUtil.isEmpty(ghsPaymentList)) {
			// key is cn id & value id payment id
			Map<String, String> ghsCnIds = new HashMap<>();
			// key is payment id & value is ghs payment other details
			Map<String, GhsPaymentOtherDetailsDto> ghsPaymentOtherDetalisMap = new HashMap<>();
			for (PaymentDetailsDaoExt ghsPayment : ghsPaymentList) {
				JsonData jsonData = MapperUtil.mapObjToClass(ghsPayment.getOtherDetails(), JsonData.class);
				GhsPaymentOtherDetailsDto ghsOtherDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
						GhsPaymentOtherDetailsDto.class);
				ghsPaymentOtherDetalisMap.put(ghsPayment.getId(), ghsOtherDetailsDto);
				ghsCnIds.put(ghsOtherDetailsDto.getCreditNoteId(), ghsPayment.getId());
			}

			// key is payment id & value is ghsCN
			Map<String, CreditNoteDaoExt> ghsPaymentIdAndCreditNoteMap = new HashMap<>();
			List<CreditNoteDaoExt> ghsCnList = creditNoteRepository.findAllById(ghsCnIds.keySet());
			for (CreditNoteDaoExt ghsCn : ghsCnList) {
				ghsPaymentIdAndCreditNoteMap.put(ghsCnIds.get(ghsCn.getId()), ghsCn);
			}

			commonTransactionService.finalConfirmForGhsPayments(cashMemoDao.getSalesTxnDao(), ghsPaymentList,
					ghsPaymentIdAndCreditNoteMap, ghsPaymentOtherDetalisMap);
			paymentDetailsRepository.saveAll(ghsPaymentList);
			creditNoteRepository.saveAll(ghsPaymentIdAndCreditNoteMap.values());// will save reference details
		}

		// update CM number for DVs if exists
		finalConfirmForGhsDV(cashMemoDao);

		// CLOSE request
		if (ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {
			epossCallService.callEposs(HttpMethod.POST,
					SalesUtil.WORKFLOW_PROCESS_URL + "/" + manualBillDetails.getManualBillDetails().getProcessId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.MANUAL_BILL.name()), null, Object.class);
		}

		List<InventoryDetailsDao> updatedInvDetailsFoc = validateAndUpdateFOCDetailsIfApplicable(cashMemoDao,
				cashMemoUpdateDto.getManualFoc());
		if (!updatedInvDetailsFoc.isEmpty())
			updatedInventoryDetails.addAll(updatedInvDetailsFoc);
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(updatedInventoryDetails);
		return response;
	}

	private UpdateInvItemAndSalesItemDto getInvDetailsToUpdate(CashMemoDaoExt cashMemoDao,
			List<SalesItemDto> salesItemDtoList, List<SalesItemDto> salesItemDtoListForAbCoins) {
		UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItems = null;
		UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItemsForAb = null;
		LocationCacheDto locationCacheDto = engineService
				.getStoreLocation(cashMemoDao.getSalesTxnDao().getLocationCode());
		List<String> binGroupCodeList = SalesUtil.getBinGroupCodeBasedOnLocationCode(
				BooleanUtils.isTrue(locationCacheDto.getOfferDetails().getIsFOCitemssaleable()));

		if (!salesItemDtoListForAbCoins.isEmpty()) {
			updateInvItemsAndSalesItemsForAb = commonTransactionService.getInvIdsAndSalesItemsForUpdate(
					salesItemDtoListForAbCoins, List.of(BinGroupEnum.RESERVEBIN.name()));
		}
		if (!salesItemDtoList.isEmpty()) {
			updateInvItemsAndSalesItems = commonTransactionService.getInvIdsAndSalesItemsForUpdate(salesItemDtoList,
					binGroupCodeList);
		}

		// exception case
		if (updateInvItemsAndSalesItemsForAb == null && updateInvItemsAndSalesItems == null)
			return new UpdateInvItemAndSalesItemDto();

		// if only coins are present in AB
		if (updateInvItemsAndSalesItems == null) {
			updateInvItemsAndSalesItems = updateInvItemsAndSalesItemsForAb;
		} else if (updateInvItemsAndSalesItemsForAb != null) {
			// if AB coins present along with other items - merge both
			if (CollectionUtil.isEmpty(updateInvItemsAndSalesItems.getItemDetailsListToUpdate())) {
				updateInvItemsAndSalesItems.setItemDetailsListToUpdate(new ArrayList<>());
			}

			updateInvItemsAndSalesItems.getItemDetailsListToUpdate()
					.addAll(updateInvItemsAndSalesItemsForAb.getItemDetailsListToUpdate());
			updateInvItemsAndSalesItems.getUpdateInventoryDtoList()
					.addAll(updateInvItemsAndSalesItemsForAb.getUpdateInventoryDtoList());

		}

		return updateInvItemsAndSalesItems;
	}

	private boolean checkIfCoinFromAdvBooking(CashMemoDaoExt cashMemoDao, CashMemoDetailsDaoExt cashMemoDetailsDao,
			SalesItemDto salesItemDto) {
		return cashMemoDetailsDao.getOrderItem() != null
				&& TransactionTypeEnum.AB.name().equals(cashMemoDao.getSalesTxnDao().getRefTxnId().getTxnType())
				&& (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(salesItemDto.getProductGroupCode())
						|| SalesConstants.SILVER_COIN_PRODUCT_GROUP_CODE.equals(salesItemDto.getProductGroupCode()));
	}

	private void finalConfirmForGhsDV(CashMemoDaoExt cashMemoDao) {

		List<DiscountDetailsDaoExt> ghsDvDiscountDaoList = discountDetailsRepository.findAllByDiscountTypeAndSalesTxnId(
				DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name(), cashMemoDao.getSalesTxnDao().getId(), null);
		if (CollectionUtils.isEmpty(ghsDvDiscountDaoList)) {
			return;
		}

		DiscountTransactionDetails discountTransactionDetails = discountUtilService
				.getDiscountTxnDetails(cashMemoDao.getSalesTxnDao());
		Map<String, GhsDiscountVoucherDto> dvDetails = discountTransactionDetails.getGhsDiscountDetails()
				.getVoucherDetails().stream()
				.collect(Collectors.toMap(GhsDiscountVoucherDto::getDiscountTxnId, dvDto -> dvDto));
		ghsDvDiscountDaoList.forEach(discountDao -> {
			GhsDiscountVoucherDto ghsDiscountVoucherDto = dvDetails.get(discountDao.getId());
			// call integration API
			if(ghsDiscountVoucherDto!=null && ghsDiscountVoucherDto.getVoucherNo()!=null )
			integrationService.updateDiscountVoucher(VendorCodeEnum.GHS.name(), ghsDiscountVoucherDto.getVoucherNo(),
					Integer.parseInt(ghsDiscountVoucherDto.getAccountNo()),
					cashMemoDao.getSalesTxnDao().getDocNo().toString(), TransactionStatusEnum.CONFIRMED.name());
		});
	}

	/**
	 * This method will update inventory and save CM Details.
	 * 
	 * @param cashMemoDao
	 * @param cashMemoDetailsDaoList
	 * @param updateInvItemsAndCMDetails
	 * @return List<InventoryDetailsDao>
	 */
	public List<InventoryDetailsDao> updateInventoryAndCashMemoDetails(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList,
			UpdateInvItemAndSalesItemDto updateInvItemsAndCMDetails) {
		// update CMDetails for coins
		if (!CollectionUtils.isEmpty(updateInvItemsAndCMDetails.getItemDetailsListToUpdate())) {
			List<CashMemoDetailsDaoExt> cmDetailsToSave = new ArrayList<>();
			updateInvItemsAndCMDetails.getItemDetailsListToUpdate()
					.forEach(salesUpdateDto -> cashMemoDetailsDaoList.forEach(cmDetailsDao -> {
						// cm details id is salesUpdateDto.getId
						if (salesUpdateDto.getId().equals(cmDetailsDao.getId())) {
							cmDetailsDao.setBinCode(salesUpdateDto.getBinCode());
							cmDetailsDao.setBinGroupCode(salesUpdateDto.getBinGroupCode());
							cmDetailsDao.setLotNumber(salesUpdateDto.getLotNumber());
							cmDetailsDao.setInventoryId(salesUpdateDto.getInventoryId());
							cmDetailsDao.setItemDetails(MapperUtil.getStringFromJson(
									new JsonData("ITEM_DETAILS", salesUpdateDto.getItemInvDetails())));

							cmDetailsToSave.add(cmDetailsDao);
						}
					})

					);
			cashMemoDetailsRepository.saveAll(cmDetailsToSave);
		}
		List<InventoryDetailsDao> updatedInventoryDetails = new ArrayList<>();
		// update inventory
		if (!CollectionUtils.isEmpty(updateInvItemsAndCMDetails.getUpdateInventoryDtoList())) {
			updatedInventoryDetails = inventoryService.removeFromInventoryDetails(
					updateInvItemsAndCMDetails.getUpdateInventoryDtoList(), cashMemoDao.getSalesTxnDao().getDocNo(),
					SalesDocTypeEnum.CM);
		}
		return updatedInventoryDetails;
	}

	/**
	 * Method to validate And update Order Details
	 * 
	 * @param cashMemoDao
	 * @return
	 */
	public SyncStagingDto validateAndUpdateOrderIfApplicable(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		OrderDaoExt orderDao = commonCashMemoService
				.checkIfPreOrderExistsByRefTxn(cashMemoDao.getSalesTxnDao().getRefTxnId());
		List<OrderDetailsDaoExt> updatedOrderItems = new ArrayList<>();
		SyncStagingDto syncStaging = null;
		// If Pre order exists, update status of order
		if (!StringUtils.isEmpty(orderDao)) {

			List<OrderDetailsDaoExt> orderDetailsDaoList = orderUtilService.getOrderDetailsIfExists(orderDao.getId(),
					false);
			// releasing items for which temp update done.
			for (OrderDetailsDaoExt orderDetailsDao : orderDetailsDaoList) {

				if (BooleanUtils.isTrue(orderDetailsDao.getIsItemToBeReleased())
						&& TransactionStatusEnum.CONFIRMED.name().equals(orderDetailsDao.getStatus())) {
					SalesItemDto salesItemDto = (SalesItemDto) MapperUtil.getDtoMapping(orderDetailsDao,
							SalesItemDto.class);

					// get inventory id's to Release from Reserve Bin for both regular items & Coins
					UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItems = commonTransactionService
							.getInvIdsAndSalesItemsForUpdate(List.of(salesItemDto),
									List.of(BinGroupEnum.RESERVEBIN.name()));

					log.info("Release Item from reserve bin  & update order item details - {}{}",
							updateInvItemsAndSalesItems.getUpdateInventoryDtoList(),
							updateInvItemsAndSalesItems.getItemDetailsListToUpdate());

					// update inventory
					if (!CollectionUtils.isEmpty(updateInvItemsAndSalesItems.getUpdateInventoryDtoList())) {

						// Update Inventory by releasing ordered items from RESERVE BIN
						inventoryService.updateBinById(updateInvItemsAndSalesItems.getUpdateInventoryDtoList(), null,
								true);

					}

					// Update order item status
					orderDetailsDao.setStatus(TransactionStatusEnum.RELEASED.name());
				}
			}
			if (!CollectionUtil.isEmpty(orderDetailsDaoList))
				orderDetailsRepository.saveAll(orderDetailsDaoList);
			//

			List<CashMemoDetailsDaoExt> orderedCmItemList = cashMemoDetailsDaoList.stream()
					.filter(cmDetails -> (!StringUtils.isEmpty(cmDetails.getOrderItem())
							&& !StringUtils.isEmpty(cmDetails.getOrderItem().getId())))
					.collect(Collectors.toList());

			// If CM has ordered items, Update order item details
			if (!CollectionUtils.isEmpty(orderedCmItemList)) {
				updatedOrderItems = orderUtilService.validateAndUpdateOrderItemDetails(orderDetailsDaoList,
						orderedCmItemList);
				if (!CollectionUtils.isEmpty(updatedOrderItems))
					updatedOrderItems = orderDetailsRepository.saveAll(updatedOrderItems);
			}

			// Method to update Order details like total delivered quantity & weight

			orderUtilService.validateAndUpdateOrderHeaderDetails(cashMemoDao, cashMemoDetailsDaoList, orderDao);

			orderDao = orderRepository.save(orderDao);
			salesTxnRepository.save(orderDao.getSalesTxn());

			syncStaging = oderServiceImpl.syncStagging(orderDao.getSalesTxn(), orderDao, updatedOrderItems, null, null,
					SalesOperationCode.PRE_ORDER);
		}
		return syncStaging;

	}

	private void setHoldTime(SalesTxnDaoExt salesTxnDao) {

		if (StringUtils.isEmpty(salesTxnDao.getFirstHoldTime())) {
			salesTxnDao.setFirstHoldTime(CalendarUtils.getCurrentDate());
			salesTxnDao.setLastHoldTime(CalendarUtils.getCurrentDate());
		} else {
			salesTxnDao.setLastHoldTime(CalendarUtils.getCurrentDate());
		}
	}

	/**
	 * This method will get cash memo by id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	@Override
	public CashMemoAndDetialsIdResponseDto getCashMemo(String id, String transactionType, String subTxnType) {
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);

		// update invoke time - should this be updated after CM confirm also?
		SalesTxnDaoExt salesTxnDao = cashMemoDao.getSalesTxnDao();
		salesTxnDao.setInvokeTime(CalendarUtils.getCurrentDate());
		if (salesTxnDao.getInvokeCount() == null) {
			salesTxnDao.setInvokeCount(1);
		} else {
			salesTxnDao.setInvokeCount(salesTxnDao.getInvokeCount() + 1);
		}
		salesTxnRepository.save(salesTxnDao);

		CashMemoAndDetialsIdResponseDto cashMemoDetailsResponse = commonCashMemoService
				.cashMemoAndDetailsIdResponse(cashMemoDao, null);
		if (TransactionStatusEnum.CANCELLED.name().equals(cashMemoDetailsResponse.getStatus())) {
			List<CancelDaoExt> cancel = cancellationRepositoryExt.findByRefSalesTxnAndLocationCodeAndStatus(
					salesTxnDao.getId(), salesTxnDao.getLocationCode(), TransactionStatusEnum.CONFIRMED.name());
			cashMemoDetailsResponse.setCancelTxnId(cancel.get(0).getId());
			cashMemoDetailsResponse.setCancelRemarks(cancel.get(0).getRemarks());
			cashMemoDetailsResponse.setReasonForCancellation(cancel.get(0).getReasonForCancellation());
		}
		cashMemoDetailsResponse.setIsIGST(cashMemoDao.getIsIGST());
		// cashMemoDetailsResponse.setCustTaxNo(CryptoUtil.decrypt(cashMemoDao.getCustTaxNo(),
		// CUST_TAX_NO));
		// cashMemoDetailsResponse.setCustTaxNoOld(CryptoUtil.decrypt(cashMemoDao.getCustTaxNoOld(),
		// CUST_TAX_NO));
		Optional<CustomerTxnDaoExt> customerTxnDao = cusTxnDetailsRepository.findById(cashMemoDao.getId());
		customerTxnDao.ifPresent(custTxnDao -> {
			//cashMemoDetailsResponse.setCustTaxNo(CryptoUtil.decrypt(custTxnDao.getCustTaxNo(), CUST_TAX_NO));
			//cashMemoDetailsResponse.setCustTaxNoOld(CryptoUtil.decrypt(custTxnDao.getCustTaxNoOld(), CUST_TAX_NO));
			customerTxnDao.get().setMobileNumber(CryptoUtil.decrypt(customerTxnDao.get().getMobileNumber(),MOBILE_NO,false));
			customerTxnDao.get().setInstiTaxNo(CryptoUtil.decrypt(customerTxnDao.get().getInstiTaxNo(),INSTI_TAX_NO,false));
			customerTxnDao.get().setEmailId(CryptoUtil.decrypt(customerTxnDao.get().getEmailId(),EMAIL_ID,false));
			customerTxnDao.get().setCustomerName(CryptoUtil.decrypt(customerTxnDao.get().getCustomerName(),CUSTOMER_NAME,false));
			customerTxnDao.get().setCustTaxNo(CryptoUtil.decrypt(customerTxnDao.get().getCustTaxNo(),CUST_TAX_NO,false));
			customerTxnDao.get().setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDao.get().getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
			customerTxnDao.get().setPassportId(CryptoUtil.decrypt(customerTxnDao.get().getPassportId(),PASSPORT_ID,false));
		});
		return cashMemoDetailsResponse;
	}

	/**
	 * This method will delete cash memo by id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param remarks
	 * @return
	 */
	@Transactional
	public PublishResponse deleteCashMemoTransactional(String id, String transactionType, String subTxnType,
			String remarks) {

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// check if payment is done of the CM.
		commonTransactionService.paymentCheck(cashMemoDao.getSalesTxnDao(), null, true);

		// delete items - not required
		// delete customer txn - not required
		// delete cash memo - not required
		// delete discounts - required or not?

		// clear manual bill id, once deleted
		// pending - manual bill details to be deleted?
		if (SubTxnTypeEnum.MANUAL_CM.name().equals(subTxnType)) {
			cashMemoDao.getSalesTxnDao().setManualBillId(null);
		}

		// if remarks not empty, then set remarks
		if (!StringUtils.isEmpty(remarks)) {
			cashMemoDao.getSalesTxnDao().setRemarks(remarks);
		}

		// doc number deletion?? or doc number update? since doc number is maintained
		// based on txn type and status.
		// since update may fail as other CM might have same doc no, need to generate
		// doc no. here also
		// set doc no.
		cashMemoDao.setSalesTxnDao(commonTransactionService.getSalesTxnDao(cashMemoDao.getSalesTxnDao(),
				TransactionTypeEnum.CM.name(), cashMemoDao.getSalesTxnDao().getSubTxnType(), SalesDocTypeEnum.CT_DELETE,
				TransactionStatusEnum.DELETED));

		// DataSync the credit not if generated - Pending CreditNote, salesTxn,
		// cashMemo, CashMemoDetails,Payment details,customerTxn
		salesTxnRepository.save(cashMemoDao.getSalesTxnDao());
		List<CreditNoteDaoExt> cnList = creditNoteRepository.findBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());
		PublishResponse publishRes = new PublishResponse();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			SyncStagingDto syncDto = deleteOrApproveCmSyncStagging(cashMemoDao.getSalesTxnDao(), cnList, null,
					SalesOperationCode.CASHMEMO_DELETE);
			publishRes.setSyncStagingDto(syncDto);
		}
		return publishRes;
	}

	private BigDecimal checkPaidValue(String transactionId, BigDecimal inputPaidValue, String paymentStatus) {

		// for confirm get total paid value of 'COMPLETED' payments.
		BigDecimal paidValue = commonTransactionService.paidValue(transactionId, null, paymentStatus);

		// is this check required?
		if (paidValue.compareTo(inputPaidValue) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Paid Value expected: " + paidValue + " found: " + inputPaidValue);
		}

		return paidValue;

	}

	// is this validation required?
	private void validateOtherCharges(OtherChargeDetailsDto otherChargeDetailsDto) {

		otherChargeDetailsDto.validateFields(otherChargeDetailsDto);

		if (!SalesConstants.OTHER_CHARGE.equalsIgnoreCase(otherChargeDetailsDto.getType())) {
			throw new ServiceException(INVALID_CHARGE_TYPE, ERR_SALE_004, "Invalid other charge type.");
		}

		// validate remarks value
		lovCheck(otherChargeDetailsDto.getData().getRemarks(), LovTypeEnum.OTHER_CHARGES_REASONS);
	}

	private void validateOtherChargeValues(OtherChargeDetailsDto otherChargeDetailsDto, CashMemoDaoExt cashMemoDao) {
		// validate other charge input
		validateOtherCharges(otherChargeDetailsDto);
		TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
				cashMemoDao.getSalesTxnDao().getCustomerId(), SalesConstants.OTHER_CHARGE,
				otherChargeDetailsDto.getData().getValue(), null, TxnTaxTypeEnum.CUST_TRANSACTION_CM, null, null);

		if (totalTaxAndTaxDetailsDto.getTotalTax().compareTo(otherChargeDetailsDto.getData().getTaxValue()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_TAX_VALUE, SalesConstants.ERR_SALE_005,
					"Invalid tax value.");
		}

		// set other charges json to cash memo DAO
		cashMemoDao.setOtherCharges(MapperUtil.getStringFromJson(otherChargeDetailsDto));

		TaxDetailsListDto taxDetailsListDto = new TaxDetailsListDto();

		// tax details json
		if (!StringUtil.isBlankJsonStr(cashMemoDao.getTaxDetails())) {
			taxDetailsListDto = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(cashMemoDao.getTaxDetails()), TaxDetailsListDto.class);
		}

		if (CollectionUtils.isEmpty(taxDetailsListDto.getTaxes())) {
			taxDetailsListDto.setTaxes(List.of(totalTaxAndTaxDetailsDto.getTaxDetails()));
		} else {
			taxDetailsListDto.getTaxes().add(totalTaxAndTaxDetailsDto.getTaxDetails());
		}

		// set other charges tax details json to cash memo DAO
		cashMemoDao.setTaxDetails(MapperUtil.getStringFromJson(taxDetailsListDto));
	}

	private void cashMemoDetailsValidation(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList,
			CashMemoDaoExt cashMemoDao, String status) {

		// check if items are in stock.
		commonCashMemoService.checkIfItemsInStock(cashMemoDetailsDaoList);
		Set<Integer> itemRowIdList = new HashSet<>();
		for (CashMemoDetailsDaoExt cashMemoDetailsDao : cashMemoDetailsDaoList) {

			if (StringUtils.isEmpty(cashMemoDetailsDao.getEmployeeCode())) {
				itemRowIdList.add(cashMemoDetailsDao.getRowId());
			}

		}

		if (!CollectionUtil.isEmpty(itemRowIdList)) {
			throw new ServiceException(SalesConstants.RSO_NAME_IS_MANDATORY, SalesConstants.ERR_SALE_016,
					"Item rows: " + itemRowIdList);

		}

		// if FOC items exists, then CM cannot be put on HOLD
		if (TransactionStatusEnum.HOLD.name().equals(status)) {
			commonCashMemoService.checkIfFocAdded(cashMemoDao.getSalesTxnDao(), true,
					"Hold not allowed when FOc added.");

		}
	}

	private void validateHoldCashMemoInput(CashMemoResponseDto cashMemoResponseDto, CashMemoDaoExt cashMemoDao) {

		// validate all totals- totalValue, totalQuantity, totalWeight, totalDiscount,
		// totalTax, netValue, paidValue, hallmark charges and hallmark discount
		validateCMTotals(cashMemoResponseDto, cashMemoDao);

		// occasion check - mandatory for NEW_CM only?
		if (SubTxnTypeEnum.NEW_CM.name().equals(cashMemoDao.getSalesTxnDao().getSubTxnType())
				&& (StringUtils.isEmpty(cashMemoDao.getOccasion())
						|| !cashMemoDao.getOccasion().equals(cashMemoResponseDto.getOccasion()))) {
			throw new ServiceException(INVALID_OCCASION, ERR_SALE_025, "Invalid occasion name.");
		}

		// check and finalize
		validateCashMemoJson(cashMemoResponseDto, cashMemoDao);

		// do all validations(discount, foc, print details?)

	}

	private void validateCashMemoJson(CashMemoResponseDto cashMemoResponseDto, CashMemoDaoExt cashMemoDao) {

		// if GIFT_SALE then, no json validation
		if (SubTxnTypeEnum.GIFT_SALE.name().equals(cashMemoDao.getSalesTxnDao().getSubTxnType())) {
			return;
		}

		// pending: other charges
		if ((!StringUtils.isEmpty(cashMemoResponseDto.getOtherCharges())
				&& StringUtils.isEmpty(cashMemoDao.getOtherCharges()))
				|| (StringUtils.isEmpty(cashMemoResponseDto.getOtherCharges())
						&& !StringUtils.isEmpty(cashMemoDao.getOtherCharges()))) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid Other charges values.");
		}

		if (StringUtils.isEmpty(cashMemoResponseDto.getOtherCharges())
				&& StringUtils.isEmpty(cashMemoDao.getOtherCharges())) {
			return;
		}

		// equate other charges in DB and input
		if (!cashMemoDao.getOtherCharges()
				.equals(MapperUtil.getStringFromJson(cashMemoResponseDto.getOtherCharges()))) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid Other charges value. Expected: " + cashMemoDao.getOtherCharges() + ", Found: "
							+ cashMemoResponseDto.getOtherCharges());
		}

		// do all validations(discount, foc)
	}

	private void validateCMTotals(CashMemoResponseDto cashMemoResponseDto, CashMemoDaoExt cashMemoDao) {

		if (!cashMemoDao.getTotalQuantity().equals(cashMemoResponseDto.getTotalQuantity())
				|| cashMemoDao.getTotalWeight().compareTo(cashMemoResponseDto.getTotalWeight()) != 0
				|| cashMemoDao.getTotalTax().compareTo(cashMemoResponseDto.getTotalTax()) != 0
				|| cashMemoDao.getTotalValue().compareTo(cashMemoResponseDto.getTotalValue()) != 0
				|| cashMemoDao.getFinalValue().compareTo(cashMemoResponseDto.getFinalValue()) != 0
				|| cashMemoDao.getTotalDiscount().compareTo(cashMemoResponseDto.getTotalDiscount()) != 0
				|| cashMemoDao.getPaidValue().compareTo(cashMemoResponseDto.getPaidValue()) != 0
				|| cashMemoDao.getHallmarkCharges().compareTo(cashMemoResponseDto.getHallmarkCharges()) != 0
				|| cashMemoDao.getHallmarkDiscount().compareTo(cashMemoResponseDto.getHallmarkDiscount()) != 0) {
			log.info("Total quantity: expected - {}, found - {}", cashMemoDao.getTotalQuantity(),
					cashMemoResponseDto.getTotalQuantity());
			log.info("Total weight: expected - {}, found - {}", cashMemoDao.getTotalWeight(),
					cashMemoResponseDto.getTotalWeight());
			log.info("Total tax: expected - {}, found - {}", cashMemoDao.getTotalTax(),
					cashMemoResponseDto.getTotalTax());
			log.info("Total value: expected - {}, found - {}", cashMemoDao.getTotalValue(),
					cashMemoResponseDto.getTotalValue());
			log.info("Final value: expected - {}, found - {}", cashMemoDao.getFinalValue(),
					cashMemoResponseDto.getFinalValue());
			log.info("Total discount: expected - {}, found - {}", cashMemoDao.getTotalDiscount(),
					cashMemoResponseDto.getTotalDiscount());
			log.info("Paid value: expected - {}, found - {}", cashMemoDao.getPaidValue(),
					cashMemoResponseDto.getPaidValue());
			log.info("Hallmark charges: expected - {}, found - {}", cashMemoDao.getHallmarkCharges(),
					cashMemoResponseDto.getHallmarkCharges());
			log.info("Hallmark discount: expected - {}, found - {}", cashMemoDao.getHallmarkDiscount(),
					cashMemoResponseDto.getHallmarkDiscount());

			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid inputs on summation values.");
		}

	}

	/**
	 * This method will return list of values based on lovType.
	 * 
	 * @param lovType
	 * @return List<String>
	 */
	private List<String> getLov(String lovType) {
		LovDto lovDto = engineService.getLov(lovType);
		return lovDto.getResults().stream().map(KeyValueDto::getValue).collect(Collectors.toList());
	}

	private void lovCheck(String inputValue, LovTypeEnum lovType) {
		List<String> list = getLov(lovType.name());

		if (!list.contains(inputValue)) {
			if (lovType.name().equals(LovTypeEnum.OCCASION_TYPE.name())) {
				throw new ServiceException(INVALID_OCCASION, ERR_SALE_025);
			} else if (lovType.name().equals(LovTypeEnum.OTHER_CHARGES_REASONS.name())) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"Invalid value for field name: 'remarks' in other charges ");
			}
		}
	}

	@Transactional
	@Override
	public CashMemoAndDetialsIdResponseDto partialUpdateCashMemo(String id, String transactionType, String subTxnType,
			CashMemoPatchUpdateDto cashMemoPatchUpdateDto) {
		log.info("Partial Update CM :- " + id);
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);

		if (!TransactionStatusEnum.APPROVAL_PENDING.name().equals(cashMemoDao.getSalesTxnDao().getStatus())) {
			commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());
		}

		// items in stock check is not required here as no item related updates happen
		// in this function.

		// get cash memo details if exists.
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = commonCashMemoService
				.getCashMemoDetails(cashMemoDao.getId());

		if (cashMemoPatchUpdateDto.getIsIGST() != null) {
			engineService.checkIfIGSTAllowed(cashMemoPatchUpdateDto.getCustomerId(),
					cashMemoPatchUpdateDto.getIsIGST());
			cashMemoDao.setIsIGST(cashMemoPatchUpdateDto.getIsIGST());
			cashMemoRepository.save(cashMemoDao);
		}
		if (!StringUtils.isEmpty(cashMemoPatchUpdateDto.getCustomerId())) {

			checkForApprovalStatus(cashMemoDao);

			// Not allowed to change the customer when the AB is invoked for final invoice
			checkIfCustomerChangeAllowed(cashMemoPatchUpdateDto, cashMemoDao);

			commonTransactionService.updateCustomerDetails(cashMemoPatchUpdateDto.getCustomerId(),
					cashMemoDao.getSalesTxnDao());

			// item tax update
			if (!CollectionUtils.isEmpty(cashMemoDetailsDaoList)) {

				commonCashMemoService.updateTaxDetails(cashMemoDetailsDaoList);
				cashMemoDetailsDaoList.forEach(
						cashMemoDetailsDao -> cashMemoDetailsDao.setSrcSyncId(cashMemoDetailsDao.getDestSyncId() + 1));

				cashMemoDetailsRepository.saveAll(cashMemoDetailsDaoList);
				// update cash memo
				commonCashMemoService.updatedCashMemoHeader(cashMemoDao, cashMemoDetailsDaoList);
			}

		}

		// check and finalize
		if (!StringUtils.isEmpty(cashMemoPatchUpdateDto.getOtherChargeDetailsDto())) {
			checkForApprovalStatus(cashMemoDao);
			// validate other charges
			validateOtherChargeValues(cashMemoPatchUpdateDto.getOtherChargeDetailsDto(), cashMemoDao);
			commonCashMemoService.updatedCashMemoHeader(cashMemoDao, cashMemoDetailsDaoList);
		}

		// Occasion name check - if comes as empty value (""), then discard Occasion
		// name currently saved --- UAT 3716
		if (!StringUtils.isEmpty(cashMemoPatchUpdateDto.getOccasion())) {
			checkForApprovalStatus(cashMemoDao);
			lovCheck(cashMemoPatchUpdateDto.getOccasion(), LovTypeEnum.OCCASION_TYPE);
			cashMemoDao.setOccasion(cashMemoPatchUpdateDto.getOccasion());
		} else if ("".equals(cashMemoPatchUpdateDto.getOccasion())) {
			cashMemoDao.setOccasion(null);
		}

		if (!StringUtil.isBlankJsonData(cashMemoPatchUpdateDto.getDiscountTxnDetails())
				&& cashMemoPatchUpdateDto.getDiscountTxnDetails().getData() != null) {
			commonTransactionService.checkDiscountDetails(cashMemoDao.getSalesTxnDao(),
					cashMemoPatchUpdateDto.getDiscountTxnDetails());
		}

		if (!StringUtils.isEmpty(cashMemoPatchUpdateDto.getEmployeeCode())) {

			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoExtList = cashMemoDetailsRepository
					.findByCashMemoDaoId(cashMemoDao.getId());

			cashMemoDetailsDaoExtList.forEach(cashMemoDetailsDaoExt -> cashMemoDetailsDaoExt
					.setEmployeeCode(cashMemoPatchUpdateDto.getEmployeeCode()));

			cashMemoDetailsRepository.saveAll(cashMemoDetailsDaoExtList);

			cashMemoDao.getSalesTxnDao().setEmployeeCode(cashMemoPatchUpdateDto.getEmployeeCode());
			salesTxnRepository.save(cashMemoDao.getSalesTxnDao());
		}
		AtomicReference<BigDecimal> tcsCollect = new AtomicReference<>();
		tcsCollect.set(BigDecimal.ZERO);
		Optional.ofNullable(cashMemoPatchUpdateDto.getTcsCollected()).ifPresent(tcsCollected -> {
			BigDecimal roundOfVariance = commonTransactionService.getRoundingVariance(tcsCollected);
			CustomerTcsDetailsDto customerTcsDetailsDto = commonCashMemoService.cumulativeTcsValueCheck(cashMemoDao);
			tcsCollected = tcsCollected.add(roundOfVariance);

			if (tcsCollected.compareTo(BigDecimal.ZERO) > 0
					&& tcsCollected.compareTo(customerTcsDetailsDto.getTcsToBeCollected()) != 0) {
				// TODO : need to confirm on error message from Rajani
				throw new ServiceException(INVALID_REQUEST + "Tcs amount mismatch", ERR_SALE_294,
						Map.of(SalesConstants.REMARKS, "Customer Change is not allowed"));
			}

			if (tcsCollected.compareTo(BigDecimal.ZERO) == 0) {
				cashMemoDao.setFinalValue(cashMemoDao.getFinalValue().subtract(cashMemoDao.getTcsAmount()));
			} else {
				// if TCS amount was previously not 0, then throw error
				if (BigDecimal.ZERO.compareTo(cashMemoDao.getTcsAmount()) != 0) {
					throw new ServiceException(INVALID_REQUEST + "Clear existisng TCS amount", ERR_SALE_294,
							Map.of(SalesConstants.REMARKS, "Clear existisng TCS amount"));
				}

				cashMemoDao.setFinalValue(cashMemoDao.getFinalValue().add(tcsCollected));
				tcsCollect.set(tcsCollect.get().add(tcsCollected));
			}
			cashMemoDao.setTcsAmount(tcsCollected);
		});

		cashMemoRepository.save(cashMemoDao);
		// passing tcsCollected value as zero for patch tcs reset
		return commonCashMemoService.cashMemoAndDetailsIdResponse(cashMemoDao,
				tcsCollect.get().compareTo(BigDecimal.ZERO) == 0 ? tcsCollect.get() : null);
	}

	private void checkForApprovalStatus(CashMemoDaoExt cashMemoDao) {
		if (TransactionStatusEnum.APPROVAL_PENDING.name().equals(cashMemoDao.getSalesTxnDao().getStatus())) {
			throw new ServiceException(SalesConstants.PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS,
					SalesConstants.ERR_SALE_053,
					"Transcation is closed.Transaction status: " + cashMemoDao.getSalesTxnDao().getStatus());
		}
	}

	// Method to verify whether customer change is allowed or not
	private void checkIfCustomerChangeAllowed(CashMemoPatchUpdateDto cashMemoPatchUpdateDto,
			CashMemoDaoExt cashMemoDao) {
		if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getCustomerId()) && cashMemoPatchUpdateDto.getCustomerId()
				.compareTo(cashMemoDao.getSalesTxnDao().getCustomerId()) != 0) {
			// Incase of Final invoice of pre-order , customer change is not allowed
			if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getRefTxnType()) && cashMemoDao.getSalesTxnDao()
					.getRefTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.toString())) {
				throw new ServiceException(INVALID_REQUEST + "Customer Change is not allowed", ERR_SALE_294,
						Map.of(SalesConstants.REMARKS, "Customer Change is not allowed"));
			}
			// Customer dependnet discounts should be removed to update customer
			commonTransactionService.discountValidationsOnCustomerUpdate(cashMemoDao.getSalesTxnDao(),
					cashMemoPatchUpdateDto.getCustomerId());
		}

	}

	private String checkManualBillRequestStatus(ManualBillTxnDetailsDto manualBillDetails) {
		if (StringUtils.isEmpty(manualBillDetails.getManualBillDetails().getProcessId())) {
			return "";
		}

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.MANUAL_BILL.name());
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = epossCallService.callEposs(HttpMethod.GET,
				SalesUtil.WORKFLOW_PROCESS_URL + "/" + manualBillDetails.getManualBillDetails().getProcessId(),
				reqParams, null, WorkflowProcessGetResponseDto.class);

		return workflowProcessGetResponseDto.getApprovalStatus();

	}

	@Transactional
	@Override
	public CashMemoAndDetialsIdResponseDto updateAllItemPrice(String id, String transactionType, String subTxnType) {

		log.info("Update metal price in CM :- " + id);
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		Boolean isFrozenRate = commonCashMemoService.checkIfFrozenRatePreOrder(cashMemoDao.getSalesTxnDao());
		// if manual bill, then ignore price update.
		if (SubTxnTypeEnum.MANUAL_CM.name().equals(subTxnType) || BooleanUtils.isTrue(isFrozenRate)) {
			return commonCashMemoService.cashMemoAndDetailsIdResponse(cashMemoDao, null);
		}

		// if rateFreeze CN is added, then price update is not required.
		// if rateFreeze CN is added, then metal rate check is not required.
		PaymentDetailsDaoExt rateFreezedCNPayment = commonPaymentService
				.getMetalRateProtectedCNIfExists(cashMemoDao.getSalesTxnDao());
		if (rateFreezedCNPayment != null) {
			return commonCashMemoService.cashMemoAndDetailsIdResponse(cashMemoDao, null);
		}

		// if within hold time, then do not update metal rate
		if (TransactionStatusEnum.HOLD.name().equals(cashMemoDao.getSalesTxnDao().getStatus())
				&& commonTransactionService.holdTimeCheck(cashMemoDao.getSalesTxnDao(),
						commonCashMemoService.getHoldTimeInMinutesForCm())) {
			return commonCashMemoService.cashMemoAndDetailsIdResponse(cashMemoDao, null);
		}

		// Validate pre-order details, if exists
		commonCashMemoService.validatePreOrderDetailsIfExists(cashMemoDao);

		// if price has not changed, then skip price update
		// get metal rate already saved.
		MetalRateListDto metalRateListExisting = commonTransactionService
				.mapMetalRateJsonToDto(cashMemoDao.getSalesTxnDao().getMetalRateDetails());
		MetalRateListDto metalRateListNew;
		OrderDaoExt orderDao = commonCashMemoService
				.checkIfPreOrderExistsByRefTxn(cashMemoDao.getSalesTxnDao().getRefTxnId());

		// get best rate if exists
		if (orderDao != null && BooleanUtils.isTrue(orderDao.getIsBestRate())) {
			commonCashMemoService.getBestRate(cashMemoDao.getSalesTxnDao(), orderDao, true, true);
			metalRateListNew = commonTransactionService
					.mapMetalRateJsonToDto(cashMemoDao.getSalesTxnDao().getMetalRateDetails());
		} else {
			metalRateListNew = commonTransactionService.getMetalRate();
			// update metal rate in sales_txn table
			cashMemoDao.getSalesTxnDao().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateListNew));
		}

		// if price has not changed, then skip price update
		if (metalRateListExisting == null || !commonTransactionService.validateMetalRate(metalRateListExisting,
				metalRateListNew, false, null, true, true)) {
			// to avoid metal rate update
			cashMemoDao.getSalesTxnDao().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateListExisting));
			return commonCashMemoService.cashMemoAndDetailsIdResponse(cashMemoDao, null);

		}
		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(cashMemoDao.getSalesTxnDao(),
				"Price update not allowed if GHS DV is added.", true);

		// payment check.
		commonTransactionService.paymentCheckForItemORCustomerUpdate(cashMemoDao.getSalesTxnDao(), false, true, false);

		// get cash memo details if exists.
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = commonCashMemoService.getCashMemoDetails(id);

		// item price update
		if (!CollectionUtils.isEmpty(cashMemoDetailsDaoList)) {
			commonCashMemoService.updateItemPriceDetails(cashMemoDetailsDaoList, cashMemoDao.getSalesTxnDao(),
					rateFreezedCNPayment != null);

			// update cash memo
			commonCashMemoService.updatedCashMemoHeader(cashMemoDao, null);
		}

		List<FocDetailsDaoExt> focDetailsList = focDetailsRepository.findBySalesTxnId(id);

		// Update FOC item price details
		if (!CollectionUtils.isEmpty(focDetailsList)) {
			updateFocItemPriceDetails(focDetailsList, cashMemoDao.getSalesTxnDao());
		}

		salesTxnRepository.save(cashMemoDao.getSalesTxnDao());
		cashMemoDao.setSrcSyncId(cashMemoDao.getDestSyncId() + 1);
		cashMemoRepository.save(cashMemoDao);

		return commonCashMemoService.cashMemoAndDetailsIdResponse(cashMemoDao, null);
	}

	@Override
	@Transactional
	public CashMemoAndDetialsIdResponseDto convertOrderToCM(OrderToCashMemoRequestDto orderToCashMemoRequestDto,
			String transactionType, String subTxnType) {

		log.info("Conver order id: {} to CM id: {}. Order item ids: {}", orderToCashMemoRequestDto.getOrderId(),
				orderToCashMemoRequestDto.getCashMemoId(), orderToCashMemoRequestDto.getItemIds());

		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsById(orderToCashMemoRequestDto.getOrderId());
		// Order should be in CONFIRMED or PARTIAL_INVOICE status for further billing
		List<String> statuses = new ArrayList<>();
		statuses.add(TransactionStatusEnum.OPEN.name());
		statuses.add(TransactionStatusEnum.HOLD.name());
		List<SalesTxnDaoExt> existingOrderList = salesTxnRepository
				.findCmHaveOrder(orderToCashMemoRequestDto.getOrderId(), statuses);
		if (existingOrderList.size() > 0) {

			Map<String, String> dynamicValue = Map.of("taskNumber", existingOrderList.get(0).getDocNo().toString(),
					"Remarks", " has order already invoked and exists in CM");
			throw new ServiceException(INVALID_REQUESTS + "-open task {taskNumber} {Remarks} ", ERR_SALE_411,
					dynamicValue);

		}
		if (!(orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name()) || (orderDao
				.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.PARTIAL_INVOICE.name())))) {
			throw new ServiceException(
					INVALID_REQUEST + "Order should be in CONFIRMED or PARTIAL_INVOICE state for final invoice",
					ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Order should be in CONFIRMED or PARTIAL_INVOICE state for final invoice"));
		}

		// All the Order payments should be Converted to Credit Note to Invoke in Cash
		// Memo
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.findBySalesTxnDaoIdAndSalesTxnDaoLocationCodeAndStatusIn(orderDao.getId(),
						orderDao.getSalesTxn().getLocationCode(), PaymentStatusEnum.getPaidPaymentStatus(), null);
		if (!CollectionUtils.isEmpty(paymentDetails)) {

			if (!CollectionUtils.isEmpty(paymentDetails.stream().filter(payment -> payment.getCreditNoteDao() == null)
					.collect(Collectors.toList()))) {
				throw new ServiceException(INVALID_REQUEST
						+ "Some Order payments are pending should be Converted to Credit Note to Invoke in Cash memo.",
						ERR_SALE_294, Map.of(SalesConstants.REMARKS,
								"Some Order payments are pending should be Converted to Credit Note to Invoke in Cash memo."));
			}

			// validate 'CHEQUE' realization date(as per UAT defect 1856)
			LocationPaymentDetails locationPaymentDetails = commonPaymentService.getPaymentDetailsFromLocation()
					.getPaymentDetails();
			Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
			for (PaymentDetailsDaoExt payment : paymentDetails) {
				if (PaymentCodeEnum.CHEQUE.getPaymentcode().equals(payment.getPaymentCode())) {
					// validate w.r.t current date in instrument date
					Date chequeDate = CalendarUtils.getStartOfDay(payment.getInstrumentDate());

					if (locationPaymentDetails.getRealisationDays() == null) {
						throw new ServiceException(SalesConstants.CHEQUE_REALIZATION_DAYS_NOT_PRESENT_FOR_THE_LOCATION,
								SalesConstants.ERR_SALE_397);
					}

					if (locationPaymentDetails.getRealisationDays() != null
							&& Math.abs(CalendarUtils.getDayDiff(chequeDate, businessDate)) < locationPaymentDetails
									.getRealisationDays()) {
						throw new ServiceException(
								SalesConstants.DYNAMIC_PAYMENTCODE_REALISATION_DAYS_HAS_NOT_PASSED_FOR_DYNAMIC_TXNTYPE,
								SalesConstants.ERR_SALE_390, "Realisation days has not passed for the AB",
								Map.of(SalesConstants.PAYMENT_CODE, payment.getPaymentCode(), "txnType",
										orderDao.getSalesTxn().getTxnType()));
					}
				}
			}
		}

		// Step 1: Create Cash Memo if not created
		CashMemoDaoExt cashMemoDao = createOrValidateCashMemo(orderToCashMemoRequestDto, transactionType, subTxnType);

		// Step 2 : Link order to cash memo at sales txn level like ref_txn_id,
		// ref_txn_type, customer id & metal rates
		linkOrderToCM(cashMemoDao, orderDao);

		// Step 3: Save Order items to cash Memo
		List<CashMemoDetailsDaoExt> cashMemoDetailsList = validateAndMapOrderItemDetailsToCM(orderDao, cashMemoDao);

		cashMemoDetailsRepository.saveAll(cashMemoDetailsList);

		// Validate and apply the applicable item discounts
		orderUtilService.validateAndApplyOrderItemDiscounts(cashMemoDao.getSalesTxnDao(), cashMemoDetailsList);

		// Validate and apply the applicable transaction level discounts
		orderUtilService.validateAndApplyOrderTransactionLevelDiscounts(cashMemoDao.getSalesTxnDao(),
				cashMemoDetailsList);

		// update cash memo total details
		// not passing CM details list as it's not reflected with updated tax
		commonCashMemoService.updatedCashMemoHeader(cashMemoDao, null);

		// Save sales Txn details
		salesTxnRepository.save(cashMemoDao.getSalesTxnDao());

		// Step 4: Fetch & Save Credit notes linked to Order as payment in CM
		orderUtilService.saveLinkedCreditNotesAsPaymentInCashMemo(orderDao, cashMemoDao);

		return commonCashMemoService.cashMemoAndDetailsIdResponse(cashMemoDao, null);
	}

	// Method to Validate and map order item details to cash memo
	private List<CashMemoDetailsDaoExt> validateAndMapOrderItemDetailsToCM(OrderDaoExt orderDao,
			CashMemoDaoExt cashMemoDao) {

		List<OrderDetailsDaoExt> orderDetailsDaoList = orderUtilService.getOrderDetailsIfExists(orderDao.getId(),
				false);

		List<CashMemoDetailsDaoExt> cashMemoDetailsList = new ArrayList<>();
		List<OrderDetailsDaoExt> pendingOrderItems = orderDetailsDaoList.stream()
				.filter(orderItem -> orderItem.getStatus().equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name()))
				.collect(Collectors.toList());

		// Order items with status 'CONFIRMED' are eligible for delivery
		// if all items are released from AB, then also AB to CM can be done for the
		// ordered weight. Hence, deleted the empty list check(UAT_1543).

		pendingOrderItems.forEach(orderDetailsDao -> {
			// reset temp data instead of doing this at EOD.
			orderDetailsDao.setIsItemToBeReleased(false);
			// Map the Order details to Cash memo details
			CashMemoDetailsDaoExt cashMemoDetailsDao = (CashMemoDetailsDaoExt) MapperUtil
					.getObjectMapping(orderDetailsDao, new CashMemoDetailsDaoExt(), "id", "totalDiscount");
			cashMemoDetailsDao.setCashMemoDao(cashMemoDao);
			cashMemoDetailsDao.setOrderItem(orderDetailsDao);
			Short totalQuantity;
			BigDecimal invStdWeight;
			BigDecimal invStdValue;
			Object weightDetails;
			String binCode;
			String binGroupCode;

			if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(orderDetailsDao.getProductGroupCode())) {
				// get Coin details based on Bin group, No inventory id will be available
				List<InventoryDetailsDao> coinList = orderUtilService.getInventoryCoinsByBinGroup(
						orderDetailsDao.getItemCode(), orderDetailsDao.getInventoryWeight(),
						orderDetailsDao.getTotalQuantity(), BinGroupEnum.RESERVEBIN.name());
				totalQuantity = coinList.get(0).getTotalQuantity();
				invStdWeight = coinList.get(0).getStdWeight();
				invStdValue = coinList.get(0).getStdValue();
				weightDetails = coinList.get(0).getTotalWeightDetails();
				binCode = coinList.get(0).getBinCode();
				binGroupCode = coinList.get(0).getBinGroupCode();
				// if coins then only quantity update allowed.
				commonCashMemoService.checkIfCoinIsAddedAlready(cashMemoDetailsDao);
			} else {
				// Get regular item details
				InventoryItemDto inventoryItem = commonTransactionService.getInvetoryItemDetails(
						cashMemoDetailsDao.getInventoryId(), cashMemoDetailsDao.getInventoryWeight(),
						cashMemoDetailsDao.getTotalQuantity());
				totalQuantity = inventoryItem.getTotalQuantity();
				invStdWeight = inventoryItem.getStdWeight();
				invStdValue = inventoryItem.getStdValue();
				weightDetails = inventoryItem.getTotalWeightDetails();
				binCode = inventoryItem.getBinCode();
				binGroupCode = inventoryItem.getBinGroupCode();
				// Item should be in RESERVE BIN
				if (!StringUtils.isEmpty(inventoryItem.getBinGroupCode())
						&& !inventoryItem.getBinGroupCode().equalsIgnoreCase(BinGroupEnum.RESERVEBIN.name())) {
					throw new ServiceException("Item should be in Reserve Bin for final invoice of ordered item",
							"ERR-SALE-114", "Item code -" + inventoryItem.getItemCode() + " With inventory Id-"
									+ inventoryItem.getInventoryId());
				}

				// set item details
				ItemInvDetailsDto itemInvDetailsDto = (ItemInvDetailsDto) MapperUtil.getDtoMapping(inventoryItem,
						ItemInvDetailsDto.class);
				// set quantity.
				itemInvDetailsDto.setQuantity(cashMemoDetailsDao.getTotalQuantity());
				cashMemoDetailsDao.setItemDetails(MapperUtil.getStringFromJson(
						new JsonData("ITEM_DETAILS", Map.of(inventoryItem.getInventoryId(), itemInvDetailsDto))));
			}

			// set inv std weight and value
			cashMemoDetailsDao.setInventoryStdWeight(invStdWeight);
			cashMemoDetailsDao.setInventoryStdValue(invStdValue);
			cashMemoDetailsDao.setInventoryWeightDetails(commonCashMemoService.getInvWeightDetails(weightDetails));
			cashMemoDetailsDao.setBinCode(binCode);
			cashMemoDetailsDao.setBinGroupCode(binGroupCode);

			// check if item is already present in other transaction
			commonCashMemoService.checkIfItemIsAlreadyAdded(totalQuantity, cashMemoDetailsDao);

			// validate quantity and get measured weight details if present
			commonCashMemoService.validateQuantityAndWeight(cashMemoDetailsDao, null);

			// If Non-frozen order, validate and update the current date price, if
			// frozen rate, keep as is
			// validate item price
			commonCashMemoService.validateItemPrice(cashMemoDao.getSalesTxnDao(), cashMemoDetailsDao, true, false);

			// validate tax details
			commonCashMemoService.validateTaxDetails(cashMemoDetailsDao, true, true);

			// Set discount value
			if (cashMemoDetailsDao.getTotalDiscount() == null) {
				cashMemoDetailsDao.setTotalDiscount(BigDecimal.ZERO);
			}

			// @formatter:off
			// final value = (total value + hallmark charges - (total discount + hallmark
			// discount)) + total tax(includes hallmark tax also).
			// @formatter:on
			BigDecimal finalValue = commonTransactionService.getItemFinalValue(cashMemoDetailsDao.getTotalValue(),
					cashMemoDetailsDao.getTotalDiscount(), cashMemoDetailsDao.getTotalTax(),
					cashMemoDetailsDao.getHallmarkCharges(), cashMemoDetailsDao.getHallmarkDiscount());
			cashMemoDetailsDao.setFinalValue(finalValue);

			cashMemoDetailsList.add(cashMemoDetailsDao);

		});
		if (!CollectionUtil.isEmpty(pendingOrderItems)) {
			orderDetailsRepository.saveAll(pendingOrderItems);
		}
		return cashMemoDetailsList;
	}

	// Method to provide linkage between Order and CM
	private void linkOrderToCM(CashMemoDaoExt cashMemoDao, OrderDaoExt orderDao) {

		// Set Ref Txn data
		cashMemoDao.getSalesTxnDao().setRefTxnId(orderDao.getSalesTxn());
		cashMemoDao.getSalesTxnDao().setRefTxnType(orderDao.getSalesTxn().getTxnType());
		cashMemoDao.getSalesTxnDao().setRefSubTxnType(orderDao.getSalesTxn().getSubTxnType());
		// Update Customer Txn details
		if (!StringUtils.isEmpty(orderDao.getSalesTxn().getCustomerId())) {
			commonTransactionService.updateCustomerDetails(orderDao.getSalesTxn().getCustomerId(),
					cashMemoDao.getSalesTxnDao());
		}
		// In case of Non-frozen order, Metal rates will be updated as part of saving
		// the variants
		if (BooleanUtils.isTrue(orderDao.getIsFrozenRate()))
			cashMemoDao.getSalesTxnDao().setMetalRateDetails(orderDao.getSalesTxn().getMetalRateDetails());
		// In case of Best rate, Compare & map the best applicable rate
		else if (BooleanUtils.isTrue(orderDao.getIsBestRate())) {
			commonCashMemoService.getBestRate(cashMemoDao.getSalesTxnDao(), orderDao, true, true);
		}
		// If Non-frozen order, current date rate will be applied.
		else {
			MetalRateListDto metalRateList = commonTransactionService.getMetalRate();
			// update metal rate in sales_txn table
			cashMemoDao.getSalesTxnDao().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateList));
		}
	}

	// Method to create or validate Cash memo during order to CM cnversion
	private CashMemoDaoExt createOrValidateCashMemo(OrderToCashMemoRequestDto orderToCashMemoRequestDto,
			String transactionType, String subTxnType) {
		CashMemoDaoExt cashMemoDao;
		if (StringUtils.isEmpty(orderToCashMemoRequestDto.getCashMemoId())) {
			TransactionResponseDto transactionResponseDto = openCashMemo(null, transactionType, subTxnType);
			cashMemoDao = commonCashMemoService.checkIfCashMemoExistsById(transactionResponseDto.getId());
		} else {
			cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(
					orderToCashMemoRequestDto.getCashMemoId(), transactionType, subTxnType);
			// If Existing CM, Check current status of CM allowed for any Updates
			commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

			List<CashMemoDetailsDaoExt> cashMemoItemDetails = commonCashMemoService
					.getCashMemoDetails(cashMemoDao.getId());

			// existing items of a cash memo should be removed to invoke Order items to a
			// cash memo
			if (!CollectionUtils.isEmpty(cashMemoItemDetails)) {
				throw new ServiceException(
						INVALID_REQUEST + "Please remove existing items to invoke Order items into a cash memo",
						ERR_SALE_294, Map.of(SalesConstants.REMARKS,
								"Please remove existing items to invoke Order items into a cash memo"));
			}

		}
		return cashMemoDao;
	}

	// Method to update FOC item price details
	public void updateFocItemPriceDetails(List<FocDetailsDaoExt> focDetailsList, SalesTxnDaoExt salesTxnDao) {
		List<FocDetailsDaoExt> updatedFocDetails = new ArrayList<>();
		for (FocDetailsDaoExt focDetails : focDetailsList) {
			cashMemoFocItemServiceImpl.calculateFOCItemPrice(focDetails, salesTxnDao);
			updatedFocDetails.add(focDetails);
		}
		focDetailsRepository.saveAll(updatedFocDetails);
	}

	// Method to validate & update FOC item details added to CM and update inventory
	public List<InventoryDetailsDao> validateAndUpdateFOCDetailsIfApplicable(CashMemoDaoExt cashMemoDao,
			Boolean isManualFoc) {
		List<FocDetailsDaoExt> focDetailsList = focDetailsRepository.findBySalesTxnId(cashMemoDao.getId());
		List<InventoryDetailsDao> updatedInventoryList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(focDetailsList)) {

			// Update the status if manual foc is added to this cashmemo
			if (isManualFoc != null && isManualFoc) {
				BusinessDayDto businessDayDto = engineService.getBusinessDay(CommonUtil.getLocationCode());
				cashMemoDao.getSalesTxnDao().setIsManualFoc(1);
				cashMemoDao.getSalesTxnDao().setManualFocDate(businessDayDto.getBusinessDate());
			}

			List<UpdateInventoryDto> updateInventoryDtoList = new ArrayList<>();
			List<FocDetailsDaoExt> updateFocDetailsList = new ArrayList<>();

			for (FocDetailsDaoExt focDetails : focDetailsList) {
//				commonTransactionService.getInvetoryItemDetailsByItemCodeAndLotNumber(focDetails.getInventoryId(),
//						focDetails.getUnitWeight(), focDetails.getTotalQuantity(), focDetails.getItemCode(),
//						focDetails.getLotNumber());

				// perform your action here
				List<InventoryDetailsDao> inventoryItemList = inventoryService
						.getItemsByItemCodeAndLotNumber(focDetails.getItemCode(), focDetails.getLotNumber());
				inventoryItemList = inventoryItemList.stream().filter(inv -> inv.getTotalQuantity() > 0)
						.collect(Collectors.toList());
				Collections.sort(inventoryItemList, Comparator.comparing(InventoryDetailsDao::getTotalQuantity));

				Short qtyLeftToAdd = focDetails.getTotalQuantity();
				List<InventoryDetailsDao> invDaoForSalesDetailsUpdate = new ArrayList<>();
				for (InventoryDetailsDao invDao : inventoryItemList) {
					UpdateInventoryDto updateInvDto = new UpdateInventoryDto();
					updateInvDto.setId(invDao.getId());
					// if reqQty is less or equal to invQty
					if (qtyLeftToAdd.compareTo(invDao.getTotalQuantity()) <= 0) {
						updateInvDto.setTotalQuantity(qtyLeftToAdd);
						qtyLeftToAdd = 0;
						invDaoForSalesDetailsUpdate.add(invDao);
					} else {
						updateInvDto.setTotalQuantity(invDao.getTotalQuantity());
						qtyLeftToAdd = (short) (qtyLeftToAdd - invDao.getTotalQuantity());
						invDaoForSalesDetailsUpdate.add(invDao);
					}

					updateInventoryDtoList.add(updateInvDto);

					if (qtyLeftToAdd.compareTo((short) 0) == 0) {
						break;
					}
				}

				// Update FOC item status from OPEN to ISSUED and check qtyleft !0 throw error
				if (qtyLeftToAdd.compareTo((short) 0) == 0) {

					focDetails.setStatus(FocStatusEnum.ISSUED.name());
					// update the foc details table for inv id and inv details
					focDetails.setInventoryDetails(MapperUtil
							.getStringFromJson(new JsonData("INVENTORY_DETAILS", invDaoForSalesDetailsUpdate)));
					if (invDaoForSalesDetailsUpdate.size() == 1) {
						focDetails.setInventoryId(invDaoForSalesDetailsUpdate.get(0).getId());
					}

				} else {
					throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131,
							"Items with proper quantity are not available in inventory for the item codes: "
									+ focDetails.getItemCode());
				}

				updateFocDetailsList.add(focDetails);

			}

			focDetailsRepository.saveAll(updateFocDetailsList);

			updatedInventoryList = inventoryService.removeFromInventoryDetails(updateInventoryDtoList,
					cashMemoDao.getSalesTxnDao().getDocNo(), SalesDocTypeEnum.CM);

		}
		return updatedInventoryList;
	}

	// ================================== Data Sync Implementation
	// =========================================
	@Override
	public CashMemoResponseDto updateCashMemo(String id, String transactionType, String subTxnType,
			CashMemoUpdateDto cashMemoUpdateDto, String status) {

		try {
			boolean isValid = commonTransactionService.validateCustomerFields(cashMemoUpdateDto.getCustomerId());
			if (!isValid) {
				throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING,
						SalesConstants.ERR_CUST_001, "Mandatory fields of customer details are missing");
			}
			PublishResponse cashmemoResponse = cmServiceImpl.updateCashMemoTransactional(id, transactionType,
					subTxnType, cashMemoUpdateDto, status);

			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
				cashmemoResponse.getSyncStagingDtoList()
						.forEach(syncDto -> salesSyncDataService.publishSalesMessagesToQueue(syncDto));
			}
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(cashmemoResponse.getApiResponse(), new TypeReference<CashMemoResponseDto>() {
			});
		} catch (ServiceException e) {
			log.info("Error on {} {} for id {}. Reason: {}", transactionType, status, id, ("Message: " + e.getMessage()
					+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues()));

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Message: " + e.getMessage()
						+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues());
			}

			throw e;
		} catch (Exception e) {
			log.info("Error on {} {} for id {}. Localized message: {}, message: {}", transactionType, status, id,
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
	public void deleteCashMemo(String id, String transactionType, String subTxnType, String remarks) {
		PublishResponse cashmemoResponse = cmServiceImpl.deleteCashMemoTransactional(id, transactionType, subTxnType,
				remarks);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			salesSyncDataService.publishSalesMessagesToQueue(cashmemoResponse.getSyncStagingDto());
		}
	}

	public SyncStagingDto syncStagging(SalesTxnDaoExt salesTxn, List<GiftDetailsDaoExt> giftDetailsDaoList,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, CashMemoDaoExt cashMemoDao,
			List<InventoryDetailsDao> inventoryDetails, List<PaymentDetailsDaoExt> paymentList,
			List<CustomerDocumentsDao> customerDocList, List<CustomerCouponDaoExt> customerCoupons, CustomerTcsDetailsDaoExt customerTcsDetailsDaoExt) {
		salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
		cashMemoDao.setSrcSyncId(cashMemoDao.getSrcSyncId() + 1);
		salesTxn = salesTxnRepository.save(salesTxn);
		cashMemoDao = cashMemoRepository.save(cashMemoDao);
		SyncStagingDto cashMemoStagingDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SyncData> syncDataList = new ArrayList<>();
			List<String> destinations = new ArrayList<>();
			destinations.add(AppTypeEnum.EPOSS.name());
			List<CustomerPaymentDaoExt> customerPaymentList = new ArrayList<>();
			CustomerTxnDaoExt customer = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());
			customer.setMobileNumber(CryptoUtil.decrypt(customer.getMobileNumber(),MOBILE_NO,false));
			customer.setInstiTaxNo(CryptoUtil.decrypt(customer.getInstiTaxNo(),INSTI_TAX_NO,false));
			customer.setEmailId(CryptoUtil.decrypt(customer.getEmailId(),EMAIL_ID,false));
			customer.setCustomerName(CryptoUtil.decrypt(customer.getCustomerName(),CUSTOMER_NAME,false));
			customer.setCustTaxNo(CryptoUtil.decrypt(customer.getCustTaxNo(),CUST_TAX_NO,false));
			customer.setCustTaxNoOld(CryptoUtil.decrypt(customer.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
			customer.setPassportId(CryptoUtil.decrypt(customer.getPassportId(),PASSPORT_ID,false));
			List<CreditNoteDaoExt> creditNoteList = creditNoteRepository.findBySalesTxnId(salesTxn.getId());
			List<FocDetailsDaoExt> focDetailsList = focDetailsRepository.findBySalesTxnId(salesTxn.getId());
			List<FocSchemesDaoExt> focSchemeLsit = focSchemeRepository.findBySalesTxnId(salesTxn.getId());
			List<PaymentItemMappingDaoExt> paymentItemDetailsList = paymentItemMappingRepository
					.getByTxnIdAndLocationCodeAndStatusIn(salesTxn.getId(), salesTxn.getLocationCode(), null, null);
			syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxn,null), 0));
			syncDataList.add(DataSyncUtil.createSyncData(new CashMemoSyncDtoExt(cashMemoDao,null), 1));
			if (!giftDetailsDaoList.isEmpty()) {
				List<GiftDetailsSyncDtoExt> syncExtList = new ArrayList<>();
				giftDetailsDaoList.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					syncExtList.add(new GiftDetailsSyncDtoExt(daoExt));
				});
				giftDetailRepo.saveAll(giftDetailsDaoList);
				syncDataList.add(DataSyncUtil.createSyncData(syncExtList, 2));
			}
			if (!cashMemoDetailsDaoList.isEmpty()) {
				List<CashMemoDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
				cashMemoDetailsDaoList.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new CashMemoDetailsSyncDtoExt(daoExt));
				});
				cashMemoDetailsRepository.saveAll(cashMemoDetailsDaoList);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 3));
			}
			if (customer != null) {
				customer.setSrcSyncId(customer.getSrcSyncId() + 1);
				customer.setMobileNumber(CryptoUtil.encrypt(customer.getMobileNumber(),MOBILE_NO));
				customer.setInstiTaxNo(CryptoUtil.encrypt(customer.getInstiTaxNo(),INSTI_TAX_NO));
				customer.setEmailId(CryptoUtil.encrypt(customer.getEmailId(),EMAIL_ID));
				customer.setCustomerName(CryptoUtil.encrypt(customer.getCustomerName(),CUSTOMER_NAME));
				customer.setCustTaxNo(CryptoUtil.encrypt(customer.getCustTaxNo(),CUST_TAX_NO));
				customer.setCustTaxNoOld(CryptoUtil.encrypt(customer.getCustTaxNoOld(),CUST_TAX_NO_OLD));
				customer.setPassportId(CryptoUtil.encrypt(customer.getPassportId(),PASSPORT_ID));
				customer.setIsEncrypted(Boolean.TRUE);
				customer = cusTxnDetailsRepository.save(customer);
				syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customer), 4));
			}
			if (!paymentList.isEmpty()) {
				List<String> paymentIds = new ArrayList<>();
				List<PaymentDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
				paymentList.forEach(daoExt -> {
					paymentIds.add(daoExt.getId());
					if (daoExt.getCreditNoteDao() != null) {
						Optional<CreditNoteDaoExt> credit = creditNoteRepository
								.findById(daoExt.getCreditNoteDao().getId());
						credit.ifPresent(dbCn -> {
							if (creditNoteList.stream().map(CreditNoteDaoExt::getId)
									.noneMatch(dbCn.getId()::equalsIgnoreCase)) {
								creditNoteList.add(dbCn);
							}
						});
					} else if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(daoExt.getPaymentCode())) {
						

						// if child CN is generated as part of partial redemption:
						JsonData jsonData = MapperUtil.mapObjToClass(daoExt.getOtherDetails(), JsonData.class);
						CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
								CreditNotePaymentOtherDetailsDto.class);
						if (!StringUtils.isEmpty(cnOtherDetails.getNewCnId())) {
							Optional<CreditNoteDaoExt> childCn = creditNoteRepository
									.findById(cnOtherDetails.getNewCnId());
							childCn.ifPresent(dbCn -> {
								if (creditNoteList.stream().map(CreditNoteDaoExt::getId)
										.noneMatch(dbCn.getId()::equalsIgnoreCase)) {
									creditNoteList.add(dbCn);
								}
							});
						}
						// if payment done by CN
						Optional<CreditNoteDaoExt> credit = creditNoteRepository.findById(daoExt.getReference3());
						credit.ifPresent(dbCn -> {
							if (creditNoteList.stream().map(CreditNoteDaoExt::getId)
									.noneMatch(dbCn.getId()::equalsIgnoreCase)) {
								creditNoteList.add(dbCn);
							}
						});
					}
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new PaymentDetailsSyncDtoExt(daoExt));
				});
				paymentDetailsRepository.saveAll(paymentList);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 5));
				customerPaymentList = customerPaymentRepo.findAllByPaymentDetailsDaoIdIn(paymentIds);
			}
			if (!creditNoteList.isEmpty()) {
				List<CreditNoteSyncDtoExt> dtoExtList = new ArrayList<>();
				List<String> cnIds = new ArrayList<>();
				creditNoteList.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new CreditNoteSyncDtoExt(daoExt));
					cnIds.add(daoExt.getId());
				});
				creditNoteRepository.saveAll(creditNoteList);
				dtoExtList.sort(Comparator.comparing(CreditNoteSyncDtoExt::getFiscalYear)
						.thenComparing(CreditNoteSyncDtoExt::getDocNo));
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 6));
				if(!cnIds.isEmpty())
				{
				PaymentReversalDao payementReverse = reversalRepository.findOneByCreditNoteIdInAndIsResidualRefund(cnIds,true);
				
				if(payementReverse != null) {
					PaymentReversalSyncDto syncDto = new PaymentReversalSyncDto(payementReverse);
					syncDataList.add(DataSyncUtil.createSyncData(syncDto, 15));
				}
				}
			}
			if (!focDetailsList.isEmpty()) {
				List<FocDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
				focDetailsList.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new FocDetailsSyncDtoExt(daoExt));
				});
				focDetailsRepository.saveAll(focDetailsList);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 7));
			}
			if (!focSchemeLsit.isEmpty()) {
				List<FocSchemeSyncDtoExt> dtoExtList = new ArrayList<>();
				focSchemeLsit.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new FocSchemeSyncDtoExt(daoExt));
				});
				focSchemeRepository.saveAll(focSchemeLsit);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 8));
			}
			if (inventoryDetails != null && !inventoryDetails.isEmpty()) {
				syncDataList.add(DataSyncUtil.createSyncData(inventoryDetails, 9));
			}
			if (!customerPaymentList.isEmpty()) {
				List<CustomerPaymentSyncDtoExt> synDtoExtList = new ArrayList<>();
				customerPaymentList.forEach(customerpayemnt -> {
					customerpayemnt.setSrcSyncId(customerpayemnt.getSrcSyncId() + 1);
					synDtoExtList.add(new CustomerPaymentSyncDtoExt(customerpayemnt));
				});
				syncDataList.add(DataSyncUtil.createSyncData(synDtoExtList, 10));
				customerPaymentRepo.saveAll(customerPaymentList);
			}
			if (!customerDocList.isEmpty()) {
				customerDocList.forEach(doc -> doc.setSrcSyncId(doc.getSrcSyncId() + 1));
				customerDocList = customerDocRepo.saveAll(customerDocList);
				List<CustomerDocumentSyncDto> customerDocSync = customerDocList.stream()
						.map(CustomerDocumentSyncDto::new).collect(Collectors.toList());
				syncDataList.add(DataSyncUtil.createSyncData(customerDocSync, 11));
			}
			if (!CollectionUtil.isEmpty(customerCoupons)) {
				List<CustomerCouponSyncDtoExt> customerCouponSyncDtos = customerCoupons.stream()
						.map(CustomerCouponSyncDtoExt::new).collect(Collectors.toList());
				syncDataList.add(DataSyncUtil.createSyncData(customerCouponSyncDtos, 12));
			}
			if (!CollectionUtil.isEmpty(paymentItemDetailsList)) {
				List<PaymentItemMappingSyncDtoExt> dtoExtList = new ArrayList<>();
				paymentItemDetailsList.forEach(paymentItemMapping -> {
					paymentItemMapping.setSrcSyncId(paymentItemMapping.getDestSyncId() + 1);
					dtoExtList.add(new PaymentItemMappingSyncDtoExt(paymentItemMapping));
				});
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 13));
				paymentItemMappingRepository.saveAll(paymentItemDetailsList);

			}
			
			if(customerTcsDetailsDaoExt != null ) {
				CustomerTcsDetailsSyncDtoExt ctdSyncDto = new CustomerTcsDetailsSyncDtoExt(customerTcsDetailsDaoExt);
				syncDataList.add(DataSyncUtil.createSyncData(ctdSyncDto, 14));
			}
			
			MessageRequest cashMemoMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.CASHMEMO_CONFIRM, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			cashMemoStagingDto = new SyncStagingDto();
			cashMemoStagingDto.setMessageRequest(cashMemoMsgRequest);
			String cashMemoMsgRqst = MapperUtil.getJsonString(cashMemoMsgRequest);
			SyncStaging cashMemoSyncStaging = new SyncStaging();
			cashMemoSyncStaging.setMessage(cashMemoMsgRqst);
			cashMemoSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			cashMemoSyncStaging = saleSyncStagingRepository.save(cashMemoSyncStaging);
			cashMemoStagingDto.setId(cashMemoSyncStaging.getId());
		}
		return cashMemoStagingDto;
	}

	public SyncStagingDto deleteOrApproveCmSyncStagging(SalesTxnDaoExt salesTxnDao, List<CreditNoteDaoExt> cnList,
			List<CustomerDocumentsDao> customerDocList, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		salesTxnDao.setSrcSyncId(salesTxnDao.getSrcSyncId() + 1);
		salesTxnDao = salesTxnRepository.save(salesTxnDao);
		syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxnDao,null), 0));
		CustomerTxnDaoExt customer = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxnDao.getId());
		customer.setMobileNumber(CryptoUtil.decrypt(customer.getMobileNumber(),MOBILE_NO,false));
		customer.setInstiTaxNo(CryptoUtil.decrypt(customer.getInstiTaxNo(),INSTI_TAX_NO,false));
		customer.setEmailId(CryptoUtil.decrypt(customer.getEmailId(),EMAIL_ID,false));
		customer.setCustomerName(CryptoUtil.decrypt(customer.getCustomerName(),CUSTOMER_NAME,false));
		customer.setCustTaxNo(CryptoUtil.decrypt(customer.getCustTaxNo(),CUST_TAX_NO,false));
		customer.setCustTaxNoOld(CryptoUtil.decrypt(customer.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
		customer.setPassportId(CryptoUtil.decrypt(customer.getPassportId(),PASSPORT_ID,false));
		if (customer != null) {
			customer.setSrcSyncId(customer.getSrcSyncId() + 1);
			customer.setMobileNumber(CryptoUtil.encrypt(customer.getMobileNumber(),MOBILE_NO));
			customer.setInstiTaxNo(CryptoUtil.encrypt(customer.getInstiTaxNo(),INSTI_TAX_NO));
			customer.setEmailId(CryptoUtil.encrypt(customer.getEmailId(),EMAIL_ID));
			customer.setCustomerName(CryptoUtil.encrypt(customer.getCustomerName(),CUSTOMER_NAME));
			customer.setCustTaxNo(CryptoUtil.encrypt(customer.getCustTaxNo(),CUST_TAX_NO));
			customer.setCustTaxNoOld(CryptoUtil.encrypt(customer.getCustTaxNoOld(),CUST_TAX_NO_OLD));
			customer.setPassportId(CryptoUtil.encrypt(customer.getPassportId(),PASSPORT_ID));
			customer.setIsEncrypted(Boolean.TRUE);			
			customer = cusTxnDetailsRepository.save(customer);
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customer), 4));
		}
		if (cnList != null && !cnList.isEmpty()) {
			List<CreditNoteSyncDtoExt> dtoExtList = new ArrayList<>();
			cnList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new CreditNoteSyncDtoExt(daoExt));
			});
			creditNoteRepository.saveAll(cnList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 6));
		}
		if (!CollectionUtil.isEmpty(customerDocList)) {
			List<CustomerDocumentSyncDto> customerDocSync = customerDocList.stream().map(CustomerDocumentSyncDto::new)
					.collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(customerDocSync, 11));
		}
		MessageRequest cashMemoMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto cashMemoStagingDto = new SyncStagingDto();
		cashMemoStagingDto.setMessageRequest(cashMemoMsgRequest);
		String cashMemoMsgRqst = MapperUtil.getJsonString(cashMemoMsgRequest);
		SyncStaging cashMemoSyncStaging = new SyncStaging();
		cashMemoSyncStaging.setMessage(cashMemoMsgRqst);
		cashMemoSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		cashMemoSyncStaging = saleSyncStagingRepository.save(cashMemoSyncStaging);
		cashMemoStagingDto.setId(cashMemoSyncStaging.getId());
		return cashMemoStagingDto;
	}

	@Override
	public CustomerTcsDetailsResponseDto retrieveTcsPaymentDetails(String cashMemoId, String txnType,
			String subTxnType) {

		List<CustomerTcsDetailsDto> customerTcsDetailsDtos = new ArrayList<>();
		CustomerTcsDetailsResponseDto customerTcsDetailsResponseDto = new CustomerTcsDetailsResponseDto();
		// current transaction cash memo
		Optional<CashMemoDaoExt> cashMemoDaoExt = cashMemoRepository.findById(cashMemoId);

		cashMemoDaoExt.ifPresent(cashMemoDao -> {
			LocationCacheDto locationDoa = engineService
					.getStoreLocation(cashMemoDao.getSalesTxnDao().getLocationCode());

			CustomerTxnDaoExt customerDao = cusTxnDetailsRepository.findByIdAndSalesTxnDaoLocationCode(
					cashMemoDao.getSalesTxnDao().getId(), cashMemoDao.getSalesTxnDao().getLocationCode());

			customerDao.setMobileNumber(CryptoUtil.decrypt(customerDao.getMobileNumber(),MOBILE_NO,false));
			customerDao.setInstiTaxNo(CryptoUtil.decrypt(customerDao.getInstiTaxNo(),INSTI_TAX_NO,false));
			customerDao.setEmailId(CryptoUtil.decrypt(customerDao.getEmailId(),EMAIL_ID,false));
			customerDao.setCustomerName(CryptoUtil.decrypt(customerDao.getCustomerName(),CUSTOMER_NAME,false));
			customerDao.setCustTaxNo(CryptoUtil.decrypt(customerDao.getCustTaxNo(),CUST_TAX_NO,false));
			customerDao.setCustTaxNoOld(CryptoUtil.decrypt(customerDao.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
			customerDao.setPassportId(CryptoUtil.decrypt(customerDao.getPassportId(),PASSPORT_ID,false));
			
			
			String searchType = null;
			String searchValue = null;

			
			if (!StringUtils.isEmpty(customerDao.getMobileNumber())) {
				searchType = "MOBILE_NO";
				searchValue = customerDao.getMobileNumber();
			} else {
				searchType = "ULP_ID";
				searchValue = customerDao.getUlpId();
			}
			if (CustomerTypeEnum.INSTITUTIONAL.name().equalsIgnoreCase(customerDao.getCustomerType())
					&& !StringUtils.isEmpty(customerDao.getInstiTaxNo())) {
				searchType = "INSTITUTIONAL";
				searchValue = customerDao.getInstiTaxNo();
			} else {
				searchValue = "MOBILE_NO".equalsIgnoreCase(searchType) ? customerDao.getMobileNumber() : searchValue;
			}
			BusinessDayDto businessDateDto = engineService
					.getBusinessDay(cashMemoDao.getSalesTxnDao().getLocationCode());

			List<String> ownerTypeCode = new ArrayList<String>();
			if ("L1".equalsIgnoreCase(locationDoa.getOwnerTypeCode())
					|| "L2".equalsIgnoreCase(locationDoa.getOwnerTypeCode()))
				ownerTypeCode = Arrays.asList("L1", "L2");
			if ("L3".equalsIgnoreCase(locationDoa.getOwnerTypeCode()))
				ownerTypeCode = Arrays.asList("L3");
			String storePanNumber = null;
			if (!ObjectUtils.isEmpty(locationDoa.getTcsDetails())) {
				if (!ObjectUtils.isEmpty(locationDoa.getTcsDetails().getLocationPanNumber())) {
					storePanNumber = locationDoa.getTcsDetails().getLocationPanNumber();
				}
			}
			
             customerDao.setMobileNumber(CryptoUtil.encrypt(customerDao.getMobileNumber(), MOBILE_NO));
             customerDao.setInstiTaxNo(CryptoUtil.encrypt( customerDao.getInstiTaxNo() , INSTI_TAX_NO ));
             customerDao.setEmailId(CryptoUtil.encrypt(customerDao.getEmailId() , EMAIL_ID));
             customerDao.setPassportId(CryptoUtil.encrypt(customerDao.getPassportId(), PASSPORT_ID ));
             customerDao.setCustTaxNo(CryptoUtil.encrypt(customerDao.getCustTaxNo(),  CUST_TAX_NO));
             customerDao.setCustomerName(CryptoUtil.encrypt(customerDao.getCustomerName(), CUSTOMER_NAME ));      
             customerDao.setCustTaxNoOld(CryptoUtil.encrypt(customerDao.getCustTaxNoOld(),  CUST_TAX_NO_OLD )); 
             customerDao.setIsEncrypted(Boolean.TRUE);         
             customerDao = cusTxnDetailsRepository.save(customerDao);
             
			// Retrieving all previous transactions from Csutomer_tcs_details Table
			List<CustomerTcsDetailsDaoExt> customerTcsDetailsDaos = customerTcsDetailsRepository
					.retrieveAllTcsPreviousTransaction(searchType,
							"MOBILE_NO".equalsIgnoreCase(searchType) ? CryptoUtil.decrypt(customerDao.getMobileNumber(),MOBILE_NO,false) : searchValue,
							businessDateDto.getFiscalYear().shortValue(), ownerTypeCode, storePanNumber,
							customerDao.getCustomerType());
			AtomicReference<BigDecimal> cummulativeCashAmount = new AtomicReference<BigDecimal>();
			cummulativeCashAmount.set(BigDecimal.ZERO);

			Optional.ofNullable(customerTcsDetailsDaos).ifPresent(customerTcsDetailsDaosList -> {
				customerTcsDetailsDaosList.stream().filter(Objects::nonNull).forEach(customerTcsDetailDao -> {
					boolean cancelled = Boolean.FALSE;
					CancelDaoExt cancelDaoExt = cancellationRepositoryExt.findTopByRefSalesTxnIdAndStatus(
							customerTcsDetailDao.getSalesTxnDao().getId(), "CONFIRMED");
					if (!ObjectUtils.isEmpty(cancelDaoExt) && cancelDaoExt.getRefSalesTxn().getId()
							.equalsIgnoreCase(customerTcsDetailDao.getSalesTxnDao().getId())) {
						cancelled = Boolean.TRUE;
					}
					customerTcsDetailsDtos.add(commonCashMemoService.mapCustomerTcsDetailsDaoToDto(customerTcsDetailDao,
							cummulativeCashAmount, cancelled));
				});
			});
			List<PaymentDetailsDaoExt> paymentDetailsDaoExts = paymentDetailsRepository
					.findBySalesTxnDaoId(cashMemoDao.getSalesTxnDao().getId());
			AtomicBoolean currentTxnPayment = new AtomicBoolean();
			currentTxnPayment.set(Boolean.FALSE);
			// Check payment done for current transaction, if yes then set true
			paymentDetailsDaoExts.stream()
					.filter(paymentDetailsDao -> PaymentStatusEnum.COMPLETED.name()
							.equalsIgnoreCase(paymentDetailsDao.getStatus())
							|| PaymentStatusEnum.OPEN.name().equalsIgnoreCase(paymentDetailsDao.getStatus())
							|| PaymentStatusEnum.IN_PROGRESS.name().equalsIgnoreCase(paymentDetailsDao.getStatus()))
					.findAny().ifPresent(paymentDetails -> {
						currentTxnPayment.set(Boolean.TRUE);
					});

			AtomicReference<BigDecimal> tcsCollected = new AtomicReference<BigDecimal>();
			tcsCollected.set(BigDecimal.ZERO);
			paymentDetailsDaoExts.stream()
					.filter(paymentDetailsDao -> paymentDetailsDao.getIsTcsPayment()
							&& PaymentStatusEnum.getPaidPaymentStatus().contains(paymentDetailsDao.getStatus()))
					.forEach(tcsPayment -> {
						tcsCollected.set(tcsCollected.get().add(tcsPayment.getAmount()));
					});
			// Add to the view tcs list only if the current transaction Purchase done
			if (currentTxnPayment.get() && customerTcsDetailsDtos.stream().filter(
					customerTcs -> customerTcs.getSalesTxnId().equalsIgnoreCase(cashMemoDao.getSalesTxnDao().getId()))
					.findFirst().isEmpty()) {
				// Build and add current transaction TCS Details to the list of ViewTcsDetails
				CustomerTcsDetailsDto customerTcsDetailsDto = commonCashMemoService
						.cumulativeTcsValueCheck(cashMemoDao);
				customerTcsDetailsDto.setSalesTxnId(cashMemoDao.getSalesTxnDao().getId());
				customerTcsDetailsDto.setBrandCode(locationDoa.getBrandCode());
				customerTcsDetailsDto.setOwnerType(locationDoa.getOwnerTypeCode());
				customerTcsDetailsDto.setLocationCode(locationDoa.getLocationCode());
				customerTcsDetailsDto.setCustomerMasterId(customerDao.getCustomerId().toString());
				customerTcsDetailsDto.setMobileNumber(CryptoUtil.decrypt(customerDao.getMobileNumber(),MOBILE_NO,false));
				customerTcsDetailsDto.setUlpId(customerDao.getUlpId());
				customerTcsDetailsDto.setStorePan(CryptoUtil.decrypt(customerDao.getCustTaxNo(),CUST_TAX_NO,false));
				customerTcsDetailsDto.setDocNo(cashMemoDao.getSalesTxnDao().getDocNo());
				customerTcsDetailsDto.setFiscalYear(cashMemoDao.getSalesTxnDao().getFiscalYear());
				customerTcsDetailsDto.setTransactionDate(cashMemoDao.getSalesTxnDao().getDocDate());
				BigDecimal finalValue = cashMemoDao.getTcsAmount().compareTo(BigDecimal.ZERO) == 0
						? cashMemoDao.getFinalValue()
						: cashMemoDao.getFinalValue().subtract(cashMemoDao.getTcsAmount());
				
				customerTcsDetailsDto.setNetInvoiceAmount(finalValue);
				customerTcsDetailsDto.setCurrentTransaction(Boolean.TRUE);
				customerTcsDetailsDto.setTcsCollected(tcsCollected.get());

				customerTcsDetailsDtos.add(customerTcsDetailsDto);
			}
			customerTcsDetailsResponseDto.setCustomerTcsDetailsDtos(customerTcsDetailsDtos);
		});

		return customerTcsDetailsResponseDto;
	}
	
	@Override
	public CustomerTcsData retrieveTcsData(String customerMobileNo, Short fiscalYear, String btqPanCard) {
		
		List<CustomerTcsDetailsDaoExt> customerTcsDetailsDaos = customerTcsDetailsRepository.retrieveTcsDetailsOfFiscalYear(customerMobileNo, fiscalYear, btqPanCard);
		
		AtomicReference<BigDecimal> netInvoiceForFiscalYear = new AtomicReference<>();
		netInvoiceForFiscalYear.set(BigDecimal.ZERO);
		Optional.ofNullable(customerTcsDetailsDaos).ifPresent(customerTcsDetailsList -> {
			BigDecimal bigDecimal = BigDecimal.ZERO;
			for (CustomerTcsDetailsDaoExt customerTcsDetailsDao:customerTcsDetailsList) {		 
			
				bigDecimal= bigDecimal.add(customerTcsDetailsDao.getNetInvoiceAmount());
				
			}
			netInvoiceForFiscalYear.set(bigDecimal);
		});

		if (!ObjectUtils.isEmpty(customerTcsDetailsDaos)) {
			return mapCustomerTcsData(customerTcsDetailsDaos.get(0), netInvoiceForFiscalYear.get());
		}

		return null;
	}
	
	private CustomerTcsData mapCustomerTcsData(CustomerTcsDetailsDaoExt customerTcsDetailsDao,BigDecimal netInvoiceForFiscalYear) {
		CustomerTcsData customerTcsData = new CustomerTcsData(); 
		customerTcsData.setCustomerMobileNo(customerTcsDetailsDao.getMobileNumber());
		customerTcsData.setBtqPanCard(customerTcsDetailsDao.getStorePan());
		customerTcsData.setFiscalYear(customerTcsDetailsDao.getFiscalYear());
		
		CustomerTxnDaoExt customerDao = cusTxnDetailsRepository.findByIdAndSalesTxnDaoLocationCode(
				customerTcsDetailsDao.getSalesTxnDao().getId(),customerTcsDetailsDao.getLocationCode() );
		customerTcsData.setCustomerPanCard(CryptoUtil.decrypt(customerDao.getCustTaxNo(),CUST_TAX_NO,false));	
		customerTcsData.setCustomerMobileNo(CryptoUtil.decrypt(customerDao.getMobileNumber(),MOBILE_NO,false));	
		customerTcsData.setUlpMembershipID(customerTcsDetailsDao.getUlpId());
	    customerTcsData.setNetAmountforFiscalyear(netInvoiceForFiscalYear);
		return customerTcsData;
	}

	@Override
	public void validateMetalRate(String id,String txnType, String subTxnType,String status,MetalRateListDto metalRateListDto) {
		if (!SubTxnTypeEnum.GIFT_SALE.name().equals(subTxnType)) {
			CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, txnType,
					subTxnType);
			// If Frozen rate, current date metal rate validation need to be skipped
			Boolean isAvoidMetalRateCheck = commonCashMemoService
					.checkIfFrozenRatePreOrder(cashMemoDao.getSalesTxnDao());

			OrderDaoExt orderDao = commonCashMemoService
					.checkIfPreOrderExistsByRefTxn(cashMemoDao.getSalesTxnDao().getRefTxnId());
			// get best rate if exists
			Set<String> metalToBeIgnoredForRateCheck = commonCashMemoService.getBestRate(cashMemoDao.getSalesTxnDao(),
					orderDao, false, true);

			// if rateFreeze CN is added, then metal rate is not required.
			PaymentDetailsDaoExt rateFreezedPayment = commonPaymentService
					.getMetalRateProtectedCNIfExists(cashMemoDao.getSalesTxnDao());
			if (rateFreezedPayment != null) {
				isAvoidMetalRateCheck = true;
				// check for rate freezed CN configurations
				commonPaymentService.validTxnForRateFreezedCN(cashMemoDao.getSalesTxnDao(), rateFreezedPayment);
			}

			// If Manual foc is given and not any varient code is choosed no need to check
			// the validation
			if (cashMemoDao.getSalesTxnDao().getIsManualFoc() == 0
					|| cashMemoDao.getFinalValue().compareTo(BigDecimal.ZERO) != 0) {
				// metal rate check
				// hold time - pick from location
				commonTransactionService.checkMetalRate(cashMemoDao.getSalesTxnDao(),
						metalRateListDto, TransactionStatusEnum.valueOf(status), true,
						commonCashMemoService.getHoldTimeInMinutesForCm(), isAvoidMetalRateCheck,
						metalToBeIgnoredForRateCheck);
	}
}
		
	}
	
}