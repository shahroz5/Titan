/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import static com.titan.poss.sales.constants.PaymentCodeEnum.AIRPAY;
import static com.titan.poss.sales.constants.PaymentCodeEnum.BANK_LOAN;
import static com.titan.poss.sales.constants.PaymentCodeEnum.CARD;
import static com.titan.poss.sales.constants.PaymentCodeEnum.CASH;
import static com.titan.poss.sales.constants.PaymentCodeEnum.GIFT_VOUCHER;
import static com.titan.poss.sales.constants.PaymentCodeEnum.RAZOR_PAY;
import static com.titan.poss.sales.constants.PaymentCodeEnum.RTGS;
import static com.titan.poss.sales.constants.PaymentCodeEnum.UPI;
import static com.titan.poss.sales.constants.PaymentCodeEnum.WALLET;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dto.request.json.BGRConfigDetails;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionActionTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.ConfirmCustomerOrderDetailsDto;
import com.titan.poss.core.dto.CustomerOrderDetails;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.GVDetailsUpdateReqDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.LocationAdvanceBookingDetailsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.GiftVoucherStatusEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.RequestTypeEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
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
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.AccountDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.CustomerOrderDetailsDto;
import com.titan.poss.sales.dto.CustomerPaymentSyncDtoExt;
import com.titan.poss.sales.dto.CustomerTxnSyncDtoExt;
import com.titan.poss.sales.dto.GhsAccountDiscountDetailsDto;
import com.titan.poss.sales.dto.GiftVoucherOtherDetailsDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.OrderActivationDetails;
import com.titan.poss.sales.dto.OrderCancelDetails;
import com.titan.poss.sales.dto.OrderDetailsConfigSyncDtoExt;
import com.titan.poss.sales.dto.OrderDetailsSyncDtoExt;
import com.titan.poss.sales.dto.OrderSearchFilterDto;
import com.titan.poss.sales.dto.OrderSyncDtoExt;
import com.titan.poss.sales.dto.PaymentCodeAndGroup;
import com.titan.poss.sales.dto.PaymentDetailsSyncDtoExt;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.ManualBillValidationTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SalesTxnRequestTypeEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnSourceType;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.ManaulBillRequestDetailsDto;
import com.titan.poss.sales.dto.request.OrderActivationRequestHeaderDto;
import com.titan.poss.sales.dto.request.OrderApprovalRequestDetailsDto;
import com.titan.poss.sales.dto.request.OrderCancelRequestHeaderDto;
import com.titan.poss.sales.dto.request.OrderManualBillRequestHeaderDto;
import com.titan.poss.sales.dto.request.OrderPatchUpdateDto;
import com.titan.poss.sales.dto.request.OrderUpdateDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.OrderAndItemIdResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.dto.response.OrderTransactionDetailsDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.dto.response.UpdateInvItemAndSalesItemDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsConfigRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CommonTxnSycnService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerOrderService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.OrderService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.DocNoFailAuditThreadLocal;
import com.titan.poss.sales.utils.SalesDateUtil;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for Orders
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesOrderServiceImpl")
public class OrderServiceImpl implements OrderService {

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private OrderUtilService orderUtilService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	CreditNoteService creditNoteService;

	@Autowired
	InventoryService inventoryService;

	@Autowired
	CommonPaymentService paymentUtil;

	@Autowired
	private EngineService engineService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private OrderService orderService;

	@Value("${app.name}")
	private String appName;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private CustomerPaymentRepositoryExt customerPaymentRepo;

	@Autowired
	private OrderDetailsConfigRepositoryExt orderDetailsConfigRepositoryExt;

	@Autowired
	private CustomerOrderService customerOrderService;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private OtpServiceImpl otpService;

	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditDaoRepositoryExt;
	
	@Autowired
	private CommonTxnSycnService commonTxnSycnService;

	private static final String ERR_SALE_090 = "ERR-SALE-090";
	private static final String ERR_SALE_358 = "ERR-SALE-358";
	private static final String ERR_SALE_366 = "ERR-SALE-366";
	private static final String INVALID_UPDATE = "Invalid Request: Please check id or type or status";

	private static final String ERR_SALE_098 = "ERR-SALE-098";
	private static final String REQUEST_IS_NOT_APPROVED = "Request is not approved.";

	private static final String ERR_SALE_130 = "ERR-SALE-130";
	private static final String PAID_VALUE_SHOULD_MATCH_MIN_VALUE = "Paid Value should be greater than or equal to minimum order payment value.";

	private static final String ORDER = "ORDER-";

	private static final String ERR_SALE_294 = "ERR-SALE-294";
	private static final String INVALID_REQUEST = "Invalid Request :-";
	private static final String ERR_SALE_450 = "ERR-SALE-450";
	
	
	  
	// Combined Payment Codes to generate single CN
	/*
	 * private static final List<String> PAYMENT_CODE_COMBINATION_IN_CN =
	 * List.of(CASH.getPaymentcode(), CARD.getPaymentcode(),
	 * UNIPAY.getPaymentcode(), DD.getPaymentcode(), AIRPAY.getPaymentcode(),
	 * RTGS.getPaymentcode(), RAZOR_PAY.getPaymentcode());
	 */
	private static final List<String> PAYMENT_CODE_COMBINATION_IN_CN = List.of(CASH.getPaymentcode(),
			CARD.getPaymentcode(), RTGS.getPaymentcode() ,UPI.getPaymentcode());
	private static final List<String> PAYMENT_CODE_BY_MODE_COMBINATION_IN_CN = List.of(AIRPAY.getPaymentcode(),
			RAZOR_PAY.getPaymentcode());
	private static final List<String> PAYMENT_GRP_COMBINATION_IN_CN = List.of(WALLET.getPaymentcode());
	private static final List<String> GIFTVOUCHER_GRP_COMBINATION_IN_CN = List.of(GIFT_VOUCHER.getPaymentcode());
	private static final List<String> SPECIFIC_PAYMENT_GRP_COMBINATION_IN_CN = List.of(BANK_LOAN.getPaymentcode());
	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String MOBILE_NO = "mobileNo";
	private static final String EMAIL_ID =  "emailId";
	private static final String CUSTOMER_NAME ="customerName";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	// This method will create Order transaction with OPEN status
	@Override
	@Transactional
	public TransactionResponseDto openOrder(TransactionCreateDto transactionCreateDto, String transactionType,
			String subTxnType) {

		log.info("Open Order :- {} {} {}", transactionCreateDto, transactionType, subTxnType);

		// validate transaction and sub txn types.
		commonTransactionService.txnTypeAndSubTxnTypeValidation(transactionType, subTxnType);

		// To generate AB_OPEN doc no and prepare DAO Object
		SalesTxnDaoExt salesTxnDao = commonTransactionService.getSalesTxnDao(null, transactionType, subTxnType,
				SalesDocTypeEnum.AB_OPEN, TransactionStatusEnum.OPEN);

		// if MANUAL_AB then need to validate bill details
		if (SubTxnTypeEnum.MANUAL_AB.name().equals(subTxnType)) {
			commonTransactionService.validateManualBillDetails(transactionCreateDto, salesTxnDao);
		}

		OrderDaoExt orderDao = new OrderDaoExt();
		orderDao.setSalesTxn(salesTxnDao);
		// To be removed, once DB default constraints handled w.r.t null value
		orderDao.setPaidValue(BigDecimal.ZERO);
		orderDao.setIsFrozenRate(Boolean.FALSE);
		orderDao.setIsBestRate(Boolean.FALSE);
		orderDao.setMinDiscountPayment(BigDecimal.ZERO);
		salesTxnDao.setSrcSyncId(0);
		salesTxnDao.setDestSyncId(0);
		salesTxnRepository.save(salesTxnDao);
		orderRepository.save(orderDao);

		TransactionResponseDto transactionResponseDto = new TransactionResponseDto();
		transactionResponseDto.setId(orderDao.getId());
		transactionResponseDto.setStatus(salesTxnDao.getStatus());
		transactionResponseDto.setDocNo(salesTxnDao.getDocNo());
		transactionResponseDto.setTxnType(salesTxnDao.getTxnType());
		transactionResponseDto.setSubTxnType(salesTxnDao.getSubTxnType());
		if (SubTxnTypeEnum.MANUAL_AB.name().equals(subTxnType)) {
			transactionResponseDto.setManualBillDetails(
					commonTransactionService.mapJsonToManualBillDetails(salesTxnDao.getManualBillDetails()));
		}

		return transactionResponseDto;
	}

	// This method will get the order and it's Item Id's
	@Override
	public OrderAndItemIdResponseDto getOrder(String id, String transactionType, String subTxnType) {

		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// update invoke time - should this be updated after AB confirm also?
		SalesTxnDaoExt salesTxnDao = orderDao.getSalesTxn();
		salesTxnDao.setInvokeTime(CalendarUtils.getCurrentDate());
		if (salesTxnDao.getInvokeCount() == null) {
			salesTxnDao.setInvokeCount(1);
		} else {
			salesTxnDao.setInvokeCount(salesTxnDao.getInvokeCount() + 1);
		}

		// if AB/CO is in CONFIRMED status,but has pending payments then delete them
		if (TransactionStatusEnum.CONFIRMED.name().equals(salesTxnDao.getStatus())
				&& (TransactionTypeEnum.AB.name().equals(transactionType)
						|| TransactionTypeEnum.CO.name().equals(transactionType))) {
			List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
					.findBySalesTxnDaoIdAndSalesTxnDaoLocationCodeAndStatusIn(salesTxnDao.getId(),
							salesTxnDao.getLocationCode(), PaymentStatusEnum.getPaidPaymentStatus(), null);
			boolean isTempPaymentExists = false;
			for (PaymentDetailsDaoExt payment : paymentDetails) {
				if (BooleanUtils.isTrue(payment.getIsEditable())) {
					isTempPaymentExists = true;
					paymentFacadeService.deleteTempPayment(payment.getId(), false);
				}
			}

			if (isTempPaymentExists) {
				// update order paid amount
				BigDecimal totalAmountPaid = paymentDetailsRepository.getPaidAmountByTransactionIdAndPaymentCode(
						salesTxnDao.getId(), null, CommonUtil.getLocationCode(), null);
				orderDao.setPaidValue(totalAmountPaid);
				orderRepository.save(orderDao);
			}
		}

		salesTxnRepository.save(salesTxnDao);

		// Pending: List the generated Credit notes w.r.t order
		List<Integer> creditNoteDocs = new ArrayList<>();

		return orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
	}

	@Transactional(value = "chainedTransaction")
	@Override
	public PublishResponse updateOrderTransactional(String id, String transactionType, String subTxnType,
			OrderUpdateDto orderUpdateDto, String status) {
		log.info("Update Order :- " + id + ", status: " + status);
		// allowed status: HOLD or CONFIRMED or APPROVAL_PENDING based on subTxnType
		commonTransactionService.checkInputStatus(status, subTxnType);

		String subTxnTypeEnum = null;
		if (transactionType.equals(TransactionTypeEnum.AB.name())) {
			subTxnTypeEnum = SubTxnTypeEnum.NEW_AB.name();
		} else if (transactionType.equals(TransactionTypeEnum.CO.name())) {
			subTxnTypeEnum = SubTxnTypeEnum.NEW_CO.name();
		}
		// if not NEW_CO or NEW_AB, then restrict HOLD.
		if (TransactionStatusEnum.HOLD.name().equals(status) && !subTxnTypeEnum.equals(subTxnType)) {
			throw new ServiceException(SalesConstants.TRANSACTION_CANNOT_BE_PUT_ON_HOLD, SalesConstants.ERR_SALE_047);
		}

		// check remarks for the txn and status.
		commonTransactionService.checkRemarksForTxnBasedOnInputStatus(status, transactionType,
				orderUpdateDto.getRemarks());

		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);
		// Need to check with rajani
		if (!TransactionStatusEnum.APPROVAL_PENDING.name().equals(orderDao.getSalesTxn().getStatus())) {
			commonTransactionService.checkTranscationStatusForUpdate(orderDao.getSalesTxn().getStatus());
		}

		// UAT 3130: if within hold time then return
		if (checkIfAlreadyOnHold(status, orderDao)) {
			PublishResponse abResponse1 = new PublishResponse();
			abResponse1.setApiResponse(orderUtilService.orderResponse(orderDao, null));
			abResponse1.setSyncStagingDtoList(List.of());
			return abResponse1;
		}

		// check: customer change or no customer selected
		if (!orderUpdateDto.getCustomerId().equals(orderDao.getSalesTxn().getCustomerId())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid input for field: customerId");
		}

		// cash limit check:
		// get all cash paid for current transaction.
		// BigDecimal totalCashPaid =
		// paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
		// orderDao.getSalesTxn().getId(),
		// PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
		// CommonUtil.getLocationCode(), PaymentStatusEnum.COMPLETED.name());
		Calendar cal1 = Calendar.getInstance();
		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		BigDecimal totalCashPaid = BigDecimal.ZERO;

		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.getCashCollectedByTransactionIdAndPaymentCodes(orderDao.getSalesTxn().getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), CommonUtil.getLocationCode(),
						PaymentStatusEnum.COMPLETED.name());
		CashPaymentDetailsDto cashPaymentDetails = paymentUtil
				.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
		totalCashPaid = totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
		totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
				totalCashPaid, totalPmlaCashAmount);
		if (totalCashPaid != null && BigDecimal.ZERO.compareTo(totalCashPaid) < 0) {
			customerPaymentService.cashLimitCheck(instrumentCashAmountDto, null, null, orderDao.getSalesTxn(),
					orderDao.getSalesTxn().getCustomerId(), false);
		}

		boolean isAvoidMetalRateCheck = false;
		// if rateFreeze CN is added, then metal rate is not required.
		PaymentDetailsDaoExt rateFreezedPayment = paymentUtil.getMetalRateProtectedCNIfExists(orderDao.getSalesTxn());
		if (rateFreezedPayment != null) {
			isAvoidMetalRateCheck = true;
			// check for rate freezed CN configurations
			paymentUtil.validTxnForRateFreezedCN(orderDao.getSalesTxn(), rateFreezedPayment);
		}

		// metal rate check
		if (transactionType.equals(TransactionTypeEnum.AB.name())) {
			commonTransactionService.checkMetalRate(orderDao.getSalesTxn(), orderUpdateDto.getMetalRateList(),
					TransactionStatusEnum.valueOf(status), true, orderUtilService.getHoldTimeInMinutesForAb(),
					isAvoidMetalRateCheck, Set.of());
		} else if (transactionType.equals(TransactionTypeEnum.CO.name())) {
			commonTransactionService.checkMetalRate(orderDao.getSalesTxn(), orderUpdateDto.getMetalRateList(),
					TransactionStatusEnum.valueOf(status), true, orderUtilService.getHoldTimeInMinutesForCo(),
					isAvoidMetalRateCheck, Set.of());
		}

		List<OrderDetailsDaoExt> orderDetailsDaoList = orderUtilService.getOrderDetailsIfExists(orderDao.getId(),
				false);

		// Validate mandatory fields of order items
		orderDetailsValidation(orderDetailsDaoList);

		// Validate order totals
		validateHoldOrderInput((OrderResponseDto) MapperUtil.getObjectMapping(orderUpdateDto, new OrderResponseDto()),
				orderDao);

		// Pending: List the generated Credit notes w.r.t order
		List<Integer> creditNoteDocs = new ArrayList<>();
		List<InventoryDetailsDao> updatedInventoryDetails = new ArrayList<>();
		if (TransactionStatusEnum.HOLD.name().equals(status)) {
			holdOrder(orderDao, orderDetailsDaoList);

		} else if (TransactionStatusEnum.APPROVAL_PENDING.name().equals(status)) {
			// setting is_editable to false before sending for approval
			List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepository.findBySalesTxnDaoId(id);

			for (PaymentDetailsDaoExt paymentDetail : paymentDetailsList) {
				paymentDetail.setIsEditable(false);
				paymentDetail.setPaymentDate(paymentDetail.getSalesTxnDao().getDocDate());

				if (PaymentStatusEnum.REVERSED.name().equals(paymentDetail.getStatus())
						|| PaymentStatusEnum.REVERSED_WITH_CN.name().equals(paymentDetail.getStatus())) {
					paymentDetail.setReversalDate(paymentDetail.getSalesTxnDao().getDocDate());
				}
			}
			paymentDetailsRepository.saveAll(paymentDetailsList);

			approvalPendingOrder(orderDao, orderDetailsDaoList);
		} else {
			confirmOrder(orderUpdateDto, orderDao, orderDetailsDaoList);
			orderDao.getSalesTxn().setConfirmedTime(CalendarUtils.getCurrentDate());
			// remarks for not giving FOC
			orderDao.getSalesTxn().setFocRemarks(orderUpdateDto.getFocRemarks());
			// Update Rate frozen date on Confirms
			if (BooleanUtils.isTrue(orderDao.getIsFrozenRate())) {
				Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
				orderDao.setRateFrozenDate(businessDate);
			}

			// Credit Note generation
			creditNoteDocs = generateCreditNoteForNewPaymentsOfOrder(orderDao, true);

			if (!transactionType.equals(TransactionTypeEnum.CO.name())) {
				// Inventory update - Moving to Reserve Bin And Order details update
				updatedInventoryDetails = updateInventoryAndOrderDetails(orderDao, orderDetailsDaoList);
			}

			// On Confirm Order Update is_editable flag to false for all payments made
			updatePaymentDetails(orderDao);

			// Update order item status from OPEN to CONFIRMED
			orderUtilService.updateOrderItemStatus(orderDetailsDaoList, TransactionStatusEnum.CONFIRMED.name());

			// Trigger sms and email notification for GR frozen and Non frozen
			Optional.ofNullable(orderDao.getIsFrozenRate()).ifPresent(isFrozenRate -> {
				CustomerDetailsDto customer = customerService.getCustomer(orderUpdateDto.getCustomerId());
				Map<String, String> data = new HashMap<>();
				String transactionTypeText = "";
				Boolean isSmsEmailEnabled = false;

				if (transactionType.equals(TransactionTypeEnum.AB.name())) {
					transactionTypeText = "Advance Booking";
					LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = orderUtilService
							.getAbDetailsFromLocation();
					isSmsEmailEnabled = locationAdvanceBookingDetailsDto.getIsSmsAndEmailCommunicationEnable();
				} else if (transactionType.equals(TransactionTypeEnum.CO.name())) {
					transactionTypeText = "Customer Order";
					CustomerOrderDetails coDetails = orderUtilService.getCoDetailsFromLocation();
					isSmsEmailEnabled = coDetails.getIsSmsAndEmailCommunicationEnable();
				}
				data.put("transactionType", transactionTypeText);
				data.put("locationCode", CommonUtil.getLocationCode()); 
				if (BooleanUtils.isTrue(isSmsEmailEnabled)) {
					if (BooleanUtils.isTrue(isFrozenRate)) {
						MetalRateListDto orderMetalRate = commonTransactionService
								.mapMetalRateJsonToDto(orderDao.getSalesTxn().getMetalRateDetails());
						Optional.ofNullable(orderDao.getSalesTxn().getDocNo())
								.ifPresent(docNo -> data.put("docNo", docNo.toString()));
						Optional.ofNullable(orderDao.getSalesTxn().getDocDate())
								.ifPresent(docDate -> data.put("docDate", SalesDateUtil.convertDateFormat(docDate)));

						if (orderMetalRate.getMetalRates() != null) {
							Optional.ofNullable(orderMetalRate.getMetalRates().get("J").getRatePerUnit())
									.ifPresent(metalRate -> data.put("frozenRate", metalRate.toString()));
						}
						sendNotificationToCustomer(customer, data, NotificationType.GR_FROZEN);
					} else if (BooleanUtils.isFalse(isFrozenRate)) {
						Optional.ofNullable(orderDao.getSalesTxn().getDocNo())
								.ifPresent(docNo -> data.put("docNo", docNo.toString()));
						Optional.ofNullable(orderDao.getSalesTxn().getDocDate())
								.ifPresent(docDate -> data.put("docDate", SalesDateUtil.convertDateFormat(docDate)));
						
						// if required add locationCode
						sendNotificationToCustomer(customer, data, NotificationType.GR_NON_FROZEN);
					} else {
						log.debug("Frozen rate is : {}", isFrozenRate);
					}
				}
			});
			List<PaymentDetailsDaoExt> gvPaymentList = paymentDetailsRepository
					.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(orderDao.getSalesTxn().getId(),
							PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode(), null, null,
							orderDao.getSalesTxn().getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));
			List<GVDetailsUpdateReqDto> gvUpdateReqList = new ArrayList<>();
			Map<String, String> gvPayments = new HashMap<>();// to update payment other details
			for (PaymentDetailsDaoExt payment : gvPaymentList) {
				GiftVoucherOtherDetailsDto gvOtherDetails = MapperUtil.mapJsonDataToClass(payment.getOtherDetails(),
						GiftVoucherOtherDetailsDto.class);
				if (PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode().equals(payment.getPaymentCode())
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
//				paymentDetailsRepository.saveAll(gvPaymentList);
//				commonTransactionService.savePaymentInNewTransaction(gvPayments);
			}

		}
		orderDao.getSalesTxn().setRemarks(orderUpdateDto.getRemarks());
		SalesTxnDaoExt salesTxnDao = orderDao.getSalesTxn();
		SyncStagingDto syncStagingDto = null;
		List<SyncStagingDto> syncDtoList = new ArrayList<>();
		salesTxnRepository.save(salesTxnDao);
		orderRepository.save(orderDao);
		List<CustomerDocumentsDao> customerDocList = customerDocRepo
				.findByTxnIdAndLocationCodeAndIsActiveTrue(orderDao.getId(), CommonUtil.getLocationCode());
		if (TransactionStatusEnum.CONFIRMED.name().equals(status)) {

			log.info("salesTxnDao - {} and orderDao - {}", salesTxnDao, orderDao);
			syncStagingDto = syncStagging(salesTxnDao, orderDao, orderDetailsDaoList, updatedInventoryDetails,
					customerDocList, SalesOperationCode.ORDER_CONFIRM);
			syncDtoList.add(syncStagingDto);
			// config details sync
			SyncStagingDto syncConfigStagingDto = syncConfigDetails(orderDao);
			if (syncConfigStagingDto != null) {
				syncDtoList.add(syncConfigStagingDto);
			}
			// SyncStagingDto discountsSyncStagingDto =
			// commonTxnSycnService.discountSyncStagging(salesTxnDao);
			// if (discountsSyncStagingDto != null) {
			// syncDtoList.add(discountsSyncStagingDto);
			// }
		} else if (TransactionStatusEnum.APPROVAL_PENDING.name().equals(status)) {
			syncStagingDto = syncStagging(salesTxnDao, null, null, null, customerDocList,
					SalesOperationCode.ORDER_APPROVAL_REQ);
			syncDtoList.add(syncStagingDto);
		}

		OrderResponseDto orderResponse = orderUtilService.orderResponse(orderDao, creditNoteDocs);

		// for 3rd party API call to Confirm CO
		ConfirmCustomerOrderDetailsDto confirmCODto = new ConfirmCustomerOrderDetailsDto();
		if (transactionType.equals(TransactionTypeEnum.CO.name())) {
			confirmCODto.setPossCustomerOrderDocNo(String.valueOf(orderResponse.getDocNo()));
			confirmCODto.setPossCustomerOrderDateTime(orderResponse.getOrderDate());
			confirmCODto.setPossCusotmerOrderFiscalYear(String.valueOf(orderResponse.getFiscalYear()));
			confirmCODto.setPossCustomerOrderLocationCode(orderResponse.getLocationCode());
			List<String> conumberList = new ArrayList<>();
			for (OrderDetailsDaoExt orderDetails : orderDetailsDaoList) {
				conumberList.add(orderDetails.getComOrderNumber());
			}
			confirmCODto.setComOrderNo(conumberList);
			confirmCODto.setPossCustomerOrderTotalValue(orderResponse.getTotalOrderValue());
			confirmCODto.setPossCustomerOrderAmountCollected(orderResponse.getPaidValue());
			confirmCODto.setStatus(orderResponse.getStatus());
			confirmCODto.setGoldRateFrozenFlag(orderDao.getIsFrozenRate());
			confirmCODto.setPosLoginId(CommonUtil.getUserName());
			// we are also getting goldRate from 2nd API
			confirmCODto.setGoldRate(
					orderResponse.getMetalRateList().getMetalRates().get(MetalTypeCodeEnum.J.name()).getRatePerUnit());
			log.info("Customer Order Details After Confirming CO....................................................{}",
					confirmCODto);
			integrationServiceClient.confirmCustomerOrder(confirmCODto);
			log.info("Before confirming in Titan API................................");
		}

		PublishResponse orderPublishResponse = new PublishResponse();
		orderPublishResponse.setApiResponse(orderResponse);
		orderPublishResponse.setSyncStagingDtoList(syncDtoList);
		return orderPublishResponse;
	}

	private boolean checkIfAlreadyOnHold(String status, OrderDaoExt orderDao) {
		return TransactionStatusEnum.HOLD.name().equals(status)
				&& TransactionStatusEnum.HOLD.name().equals(orderDao.getSalesTxn().getStatus())
				&& commonTransactionService.holdTimeCheck(orderDao.getSalesTxn(),
						orderUtilService.getHoldTimeInMinutesForAb());
	}

	/**
	 * Method to Update payment details like Editable flg of order as part of
	 * Confirm or Freeze order
	 * 
	 * @param orderDao
	 */
	public void updatePaymentDetails(OrderDaoExt orderDao) {

		Integer updateCount = paymentDetailsRepository.updatePaymentsEditableFlag(false,
				orderDao.getSalesTxn().getId());
		log.info("Update Payment Details Count : {}", updateCount);

	}

	// Method to generate Credit Note for new payments
	@SuppressWarnings("unchecked")
	@Transactional
	public List<Integer> generateCreditNoteForNewPaymentsOfOrder(OrderDaoExt orderDao, Boolean isAllPAyments) {

		Map<String, Integer> creditNoteIdAndDocs = new HashMap<>();

		// Fetch all new Payment details of an order
		Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap = commonTransactionService
				.getPaymentMapDetailsByTxnId(orderDao.getSalesTxn(), true, isAllPAyments);

		// Generate single Credit Note for combination of payments and update payment
		// details with CN id
		generateCnForCombinedPayments(orderDao.getSalesTxn(), creditNoteIdAndDocs, paymentsMap);

		// Generate Combined CN for specific payments for eg:BANK_LOAN
		generateCombinedCnForSpecificPayments(orderDao.getSalesTxn(), creditNoteIdAndDocs, paymentsMap);
		
		// Generate Combined CN for paymentmode GIFTVOUCHER depends on validation.
		generateCreditNoteForGVPayments(orderDao.getSalesTxn(), creditNoteIdAndDocs, paymentsMap);
		
		// Generate individual CN for paymentmode DD eg:DD
		generateCreditNoteForDDPayments(orderDao.getSalesTxn(), creditNoteIdAndDocs, paymentsMap);

		
		generateCreditNoteForQCGCPayments(orderDao.getSalesTxn(), creditNoteIdAndDocs, paymentsMap);

		// Generate Individual credit note for remaining payments and update payment
		// details
		// with CN id
		generateCnForIndividualPayments(orderDao.getSalesTxn(), creditNoteIdAndDocs, paymentsMap);

		if (creditNoteIdAndDocs.isEmpty()) {
			return Collections.emptyList();
		}

		JsonData cnData;
		// first confirm
		if (StringUtil.isBlankJsonStr(orderDao.getCnDetails())) {
			cnData = new JsonData();
			cnData.setType("CN_DETAILS");
			cnData.setData(creditNoteIdAndDocs.keySet().stream().collect(Collectors.toList()));
		} else {
			// for after AB confirm actions like 'Add payment' or 'freeze AB'
			List<String> creditNoteIds = new ArrayList<>();
			cnData = MapperUtil.mapObjToClass(orderDao.getCnDetails(), JsonData.class);
			if (cnData.getData() != null) {
				creditNoteIds = MapperUtil.mapObjToClass(cnData.getData(), List.class);
			}
			cnData.setType("CN_DETAILS");
			creditNoteIds.addAll(creditNoteIdAndDocs.keySet().stream().collect(Collectors.toList()));
			cnData.setData(creditNoteIds);
		}

		orderDao.setCnDetails(MapperUtil.getStringFromJson(cnData));

		// only return new CNs created
		return creditNoteIdAndDocs.values().stream().collect(Collectors.toList());
	}
	
	private void generateCreditNoteForDDPayments(SalesTxnDaoExt salesTxn, Map<String, Integer> creditNoteIdAndDocs,
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap) {
		PaymentCodeAndGroup ddPayments = new PaymentCodeAndGroup(PaymentCodeEnum.DD.getPaymentcode(),
				PaymentGroupEnum.REGULAR.name());

		List<PaymentDetailsDaoExt> ddList = paymentsMap.get(ddPayments);
		if (!CollectionUtil.isEmpty(ddList)) {
			Map<String, CreditNoteIndvCreateDto> ddGrps = new HashMap<>();
			Map<String, List<PaymentDetailsDaoExt>> ddCnPayments = new HashMap<>();
			// run a loop through 'ddList' check dd combo and frame a new map based on it
			ddList.forEach(payment -> {
				String dd = payment.getBankName();

				CreditNoteIndvCreateDto cnDto = ddGrps.get(dd);
				// if null, new group set, else add to existing
				cnDto = cnDto == null ? new CreditNoteIndvCreateDto(BigDecimal.ZERO, BigDecimal.ZERO) : cnDto;

				cnDto.setAmount(cnDto.getAmount().add(payment.getAmount()));
				if (payment.getCashCollected() != null) {
					cnDto.setCashCollected(cnDto.getCashCollected().add(payment.getCashCollected()));
				}
				ddGrps.put(dd, cnDto);
				// for payment combination
				List<PaymentDetailsDaoExt> paymentList;
				if (ddCnPayments.containsKey(dd)) {
					paymentList = ddCnPayments.get(dd);

				} else {
					paymentList = new ArrayList<>();
				}
				paymentList.add(payment);
				ddCnPayments.put(dd, paymentList);

			});

			// run a loop on 'ddGrps' to generate CN
			ddGrps.entrySet().forEach(ddCn -> {
				CNPaymentDetailsDto cnPaymentDetailsDto = new CNPaymentDetailsDto(false, false, false, false,
						Map.of(PaymentCodeEnum.DD.getPaymentcode(), PaymentCodeEnum.DD.getPaymentcode()));
				cnPaymentDetailsDto.setBankName(ddCn.getKey());
				//cnPaymentDetailsDto.setInstrumentNumber(CUSTOMER_NAME)
				List<CreditNoteResponse> cnResponseList = createCreditNote(salesTxn, ddCn.getValue().getAmount(),
						ddCn.getValue().getCashCollected(), cnPaymentDetailsDto, null, CNType.ADV.name(), null, null,null);
				log.info("Credit Note Response - {}", cnResponseList);

				// add new CN details to 'creditNoteDocs'
				creditNoteIdAndDocs.putAll(cnResponseList.stream()
						.collect(Collectors.toMap(CreditNoteResponse::getId, CreditNoteResponse::getDocNo)));

				updatePaymentsWithCreditNote(ddCnPayments.get(ddCn.getKey()), cnResponseList.get(0).getId());

			});
		}

		// remove 'ddList' from paymentsMap.
		paymentsMap.remove(ddPayments);

		
		
	}

	@Transactional
	private void generateCreditNoteForGVPayments(SalesTxnDaoExt salesTxn, Map<String, Integer> creditNoteIdAndDocs,
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap) {
		
		PaymentCodeAndGroup gvPayments = new PaymentCodeAndGroup(PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode(),
				PaymentGroupEnum.REGULAR.name());

		List<PaymentDetailsDaoExt> gvList = paymentsMap.get(gvPayments);
		if (!CollectionUtil.isEmpty(gvList)) {
			Map<Boolean, CreditNoteIndvCreateDto> gvProductGrps = new HashMap<>();
			Map<Boolean, List<PaymentDetailsDaoExt>> gvProductPayments = new HashMap<>();
			// run a loop through 'gvList' to check ProductGroup combo and frame a new map based on it
			gvList.forEach(payment -> { 
				JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
				GiftVoucherOtherDetailsDto giftVoucherOtherDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(), GiftVoucherOtherDetailsDto .class);
				Boolean isEmptyProductGroupList = CollectionUtil.isEmpty(giftVoucherOtherDetailsDto.getProductGroupDetails());
				

				CreditNoteIndvCreateDto cnDto = gvProductGrps.get(isEmptyProductGroupList);
				// if null, new group set, else add to existing
				cnDto = cnDto == null ? new CreditNoteIndvCreateDto(BigDecimal.ZERO, BigDecimal.ZERO) : cnDto;

				cnDto.setAmount(cnDto.getAmount().add(payment.getAmount()));
				if (payment.getCashCollected() != null) {
					cnDto.setCashCollected(cnDto.getCashCollected().add(payment.getCashCollected()));
				}
				gvProductGrps.put(isEmptyProductGroupList, cnDto);
				// for payment combination
				List<PaymentDetailsDaoExt> paymentList;
				if (gvProductPayments.containsKey(isEmptyProductGroupList)) {
					paymentList = gvProductPayments.get(isEmptyProductGroupList);

				} else {
					paymentList = new ArrayList<>();
				}
				paymentList.add(payment);
				gvProductPayments.put(isEmptyProductGroupList, paymentList);

			});

			// run a loop on 'gvProductGrps' to generate CN
				gvProductGrps.entrySet().forEach(gvCn -> {
				CNPaymentDetailsDto cnPaymentDetailsDto = new CNPaymentDetailsDto(false, false, false, false,
						Map.of(PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode(), PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode()));
				List<CreditNoteResponse> cnResponseList = createCreditNote(salesTxn, gvCn.getValue().getAmount(),
						gvCn.getValue().getCashCollected(), cnPaymentDetailsDto, null, CNType.ADV.name(), null, null,null);
				log.info("Credit Note Response - {}", cnResponseList);

				// add new CN details to 'creditNoteDocs'
				creditNoteIdAndDocs.putAll(cnResponseList.stream()
						.collect(Collectors.toMap(CreditNoteResponse::getId, CreditNoteResponse::getDocNo)));

				updatePaymentsWithCreditNote(gvProductPayments.get(gvCn.getKey()), cnResponseList.get(0).getId());

			});
		}

		// remove 'qcgcList' from paymentsMap.
		paymentsMap.remove(gvPayments);

		
	}




	private void generateCreditNoteForQCGCPayments(SalesTxnDaoExt salesTxn, Map<String, Integer> creditNoteIdAndDocs,
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap) {

		PaymentCodeAndGroup qcgcPayments = new PaymentCodeAndGroup(PaymentCodeEnum.QCGC.getPaymentcode(),
				PaymentGroupEnum.REGULAR.name());

		List<PaymentDetailsDaoExt> qcgcList = paymentsMap.get(qcgcPayments);
		if (!CollectionUtil.isEmpty(qcgcList)) {
			Map<String, CreditNoteIndvCreateDto> cpgGrps = new HashMap<>();
			Map<String, List<PaymentDetailsDaoExt>> cpgPayments = new HashMap<>();
			// run a loop through 'qcgcList' check CPG combo and frame a new map based on it
			qcgcList.forEach(payment -> {
				String cpg = payment.getBankName();

				CreditNoteIndvCreateDto cnDto = cpgGrps.get(cpg);
				// if null, new group set, else add to existing
				cnDto = cnDto == null ? new CreditNoteIndvCreateDto(BigDecimal.ZERO, BigDecimal.ZERO) : cnDto;

				cnDto.setAmount(cnDto.getAmount().add(payment.getAmount()));
				if (payment.getCashCollected() != null) {
					cnDto.setCashCollected(cnDto.getCashCollected().add(payment.getCashCollected()));
				}
				cpgGrps.put(cpg, cnDto);
				// for payment combination
				List<PaymentDetailsDaoExt> paymentList;
				if (cpgPayments.containsKey(cpg)) {
					paymentList = cpgPayments.get(cpg);

				} else {
					paymentList = new ArrayList<>();
				}
				paymentList.add(payment);
				cpgPayments.put(cpg, paymentList);

			});

			// run a loop on 'cpgGrps' to generate CN
			cpgGrps.entrySet().forEach(cpgCn -> {
				CNPaymentDetailsDto cnPaymentDetailsDto = new CNPaymentDetailsDto(false, false, false, false,
						Map.of(PaymentCodeEnum.QCGC.getPaymentcode(), PaymentCodeEnum.QCGC.getPaymentcode()));
				List<CreditNoteResponse> cnResponseList = createCreditNote(salesTxn, cpgCn.getValue().getAmount(),
						cpgCn.getValue().getCashCollected(), cnPaymentDetailsDto, null, CNType.ADV.name(), null, null,null);
				log.info("Credit Note Response - {}", cnResponseList);

				// add new CN details to 'creditNoteDocs'
				creditNoteIdAndDocs.putAll(cnResponseList.stream()
						.collect(Collectors.toMap(CreditNoteResponse::getId, CreditNoteResponse::getDocNo)));

				updatePaymentsWithCreditNote(cpgPayments.get(cpgCn.getKey()), cnResponseList.get(0).getId());

			});
		}

		// remove 'qcgcList' from paymentsMap.
		paymentsMap.remove(qcgcPayments);

	}

	// To Validate the Order Item level validations during HOLD or CONFIRM
	private void orderDetailsValidation(List<OrderDetailsDaoExt> orderDetailsDaoList) {

		for (OrderDetailsDaoExt orderDetailsDao : orderDetailsDaoList) {

			if (StringUtils.isEmpty(orderDetailsDao.getEmployeeCode())) {
				throw new ServiceException(SalesConstants.RSO_NAME_IS_MANDATORY, SalesConstants.ERR_SALE_016,
						"Item: " + orderDetailsDao.getRowId());
			}

		}

	}

	// To validate mandatory fields & totals of Header.
	private void validateHoldOrderInput(OrderResponseDto orderResponseDto, OrderDaoExt orderDao) {

		// validate all totals- totalValue, totalQuantity, totalWeight, totalDiscount,
		// totalTax, netValue and paidValue
		validateOrderTotals(orderResponseDto, orderDao);

		// Pending: validation of any json required in orders?

		// do all validations(discount, print details?)
	}

	// To validate Totals of an Order
	private void validateOrderTotals(OrderResponseDto orderResponseDto, OrderDaoExt orderDao) {
		// pending - discountValue
		Map<String, String> dynamicValues = new HashMap<>();
		if (!orderDao.getTotalQuantity().equals(orderResponseDto.getTotalQuantity())) {
			dynamicValues.put("inputType", "Total Quantity");
			dynamicValues.put("expected", orderDao.getTotalQuantity().toString());
			dynamicValues.put("found", orderResponseDto.getTotalQuantity().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
		} else if (orderDao.getTotalWeight().compareTo(orderResponseDto.getTotalWeight()) != 0) {
			dynamicValues.put("inputType", "Total Weight");
			dynamicValues.put("expected", orderDao.getTotalWeight().toString());
			dynamicValues.put("found", orderResponseDto.getTotalWeight().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
		} else if (orderDao.getTotalTax().compareTo(orderResponseDto.getTotalTax()) != 0) {
			dynamicValues.put("inputType", "Total Tax");
			dynamicValues.put("expected", orderDao.getTotalTax().toString());
			dynamicValues.put("found", orderResponseDto.getTotalTax().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
		} else if (orderDao.getTotalValue().compareTo(orderResponseDto.getTotalValue()) != 0) {
			dynamicValues.put("inputType", "Total Value");
			dynamicValues.put("expected", orderDao.getTotalValue().toString());
			dynamicValues.put("found", orderResponseDto.getTotalValue().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
		} else if (orderDao.getFinalValue().compareTo(orderResponseDto.getFinalValue()) != 0) {
			dynamicValues.put("inputType", "Final Value");
			dynamicValues.put("expected", orderDao.getFinalValue().toString());
			dynamicValues.put("found", orderResponseDto.getFinalValue().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
		} else if (orderDao.getTotalDiscount().compareTo(orderResponseDto.getTotalDiscount()) != 0) {
			dynamicValues.put("inputType", "Total Discount");
			dynamicValues.put("expected", orderDao.getTotalDiscount().toString());
			dynamicValues.put("found", orderResponseDto.getTotalDiscount().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
			//commenting for fixing NAP-11919
//		} else if (orderDao.getPaidValue().compareTo(orderResponseDto.getPaidValue()) != 0) {
//			dynamicValues.put("inputType", "Paid Value");
//			dynamicValues.put("expected", orderDao.getPaidValue().toString());
//			dynamicValues.put("found", orderResponseDto.getPaidValue().toString());
//			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
//					dynamicValues);
		} else if (orderDao.getHallmarkCharges().compareTo(orderResponseDto.getHallmarkCharges()) != 0) {
			dynamicValues.put("inputType", "Hallmark Charges");
			dynamicValues.put("expected", orderDao.getHallmarkCharges().toString());
			dynamicValues.put("found", orderResponseDto.getHallmarkCharges().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
		} else if (orderDao.getHallmarkDiscount().compareTo(orderResponseDto.getHallmarkDiscount()) != 0) {
			dynamicValues.put("inputType", "Hallmark Discount");
			dynamicValues.put("expected", orderDao.getHallmarkDiscount().toString());
			dynamicValues.put("found", orderResponseDto.getHallmarkDiscount().toString());
			throw new ServiceException(SalesConstants.TOTAL_VALUES_MISMATCH, SalesConstants.ERR_SALE_398,
					dynamicValues);
		}
	}

	/**
	 * This method will validate Order for HOLD.
	 * 
	 * @param orderUpdateDto
	 * @param orderDao
	 */
	private void holdOrder(OrderDaoExt orderDao, List<OrderDetailsDaoExt> orderDetailsDaoList) {

		if (!TransactionTypeEnum.CO.name().equals(orderDao.getSalesTxn().getTxnType())) {
			// check if item is on hold in another CM.
			itemCheckBeforeHoldOrConfirm(orderDetailsDaoList);
		}
		// check if item is on hold in another CM.
		itemCheckBeforeHoldOrConfirm(orderDetailsDaoList);

		// check input paid value
		List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(orderDao.getId(), null, null, null,
						CommonUtil.getStoreCode(), PaymentStatusEnum.getPaidPaymentStatus());

		List<PaymentDetailsDaoExt> restrictedPaymentsForHold = new ArrayList<>();

		if (!CollectionUtil.isEmpty(paymentDetailsList)) {

			restrictedPaymentsForHold = paymentDetailsList.stream().filter(
					payment -> PaymentCodeEnum.getPaymentsRestrictedForHold().contains(payment.getPaymentCode()))
					.collect(Collectors.toList());
		}

		// payment check to restrict HOLD - UAT_3283 (for UNIPAY)
		if (!CollectionUtil.isEmpty(restrictedPaymentsForHold)) {
			throw new ServiceException(SalesConstants.TRANSACTION_CANNOT_BE_PUT_ON_HOLD, SalesConstants.ERR_SALE_047,
					"Please delete following payments to put transaction on HOLD: "
							+ PaymentCodeEnum.getPaymentsRestrictedForHold());
		}

		// hold time to salesTxnDao
		setHoldTime(orderDao.getSalesTxn());

		// sales doc number generation if sales_transaction was previously in 'OPEN'
		// status.
		if (TransactionStatusEnum.OPEN.name().equals(orderDao.getSalesTxn().getStatus())
				&& TransactionTypeEnum.AB.name().equals(orderDao.getSalesTxn().getTxnType())) {
			orderDao.setSalesTxn(commonTransactionService.getSalesTxnDao(orderDao.getSalesTxn(),
					TransactionTypeEnum.AB.name(), orderDao.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.AB_HOLD,
					TransactionStatusEnum.HOLD));
		} else if (TransactionStatusEnum.OPEN.name().equals(orderDao.getSalesTxn().getStatus())
				&& TransactionTypeEnum.CO.name().equals(orderDao.getSalesTxn().getTxnType())) {
			orderDao.setSalesTxn(commonTransactionService.getSalesTxnDao(orderDao.getSalesTxn(),
					TransactionTypeEnum.CO.name(), orderDao.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.CO_HOLD,
					TransactionStatusEnum.HOLD));
		}
	}

	// To set Hold time of a transaction
	private void setHoldTime(SalesTxnDaoExt salesTxnDao) {

		if (StringUtils.isEmpty(salesTxnDao.getFirstHoldTime())) {
			salesTxnDao.setFirstHoldTime(CalendarUtils.getCurrentDate());
			salesTxnDao.setLastHoldTime(CalendarUtils.getCurrentDate());
		} else {
			salesTxnDao.setLastHoldTime(CalendarUtils.getCurrentDate());
		}
	}

	/**
	 * This method will validate AB for CONFIRMED
	 * 
	 * @param orderUpdateDto
	 * @param orderDao
	 */
	@Transactional
	public void confirmOrder(OrderUpdateDto orderUpdateDto, OrderDaoExt orderDao,
			List<OrderDetailsDaoExt> orderDetailsDaoList) {

		/**
		 * APPROVAL PENDING FOR co WILL BE ON HOLD 
		 */
		
		// All discounts should be in CONFIRMED status to CONFIRM Order
		commonTransactionService.discountValidationsOnConfirmTransaction(orderDao.getSalesTxn());

		// check if item is on hold in another AB.
		if (!orderDao.getSalesTxn().getTxnType().equals(TransactionTypeEnum.CO.name())) {
			itemCheckBeforeHoldOrConfirm(orderDetailsDaoList);
		}

		// to check total weight and final value for manual bill.
		ManualBillTxnDetailsDto manualBillDetails = orderUtilService.validateManualBillDetails(orderDao,
				orderDetailsDaoList, true);

		// if manual bill validationType is REQUEST_APPROVAL, then
		// 1. previous state of Order should be APPROVAL_PENDING
		// 2. check if workflow request is APPROVED.
		if (ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {

			// Check approval status & set to transaction
			String approvalStatus = checkManualBillRequestStatus(manualBillDetails);

			if (!WorkflowProcessStatusEnum.APPROVED.name().equals(approvalStatus)) {
				throw new ServiceException(REQUEST_IS_NOT_APPROVED, ERR_SALE_098, "Approval request status should be: "
						+ WorkflowProcessStatusEnum.APPROVED.name() + ", found: " + approvalStatus);
			}

		}

		// This Method will validate the Paid value with payment received and final
		// value or min order value
		BigDecimal paidValue = validatePaidValue(orderUpdateDto.getPaidValue(), orderDao);

		// if final Value above 2 lakh, then PAN and mobile check
		commonTransactionService.customerDetailsCheckForFinalValue(paidValue, orderDao.getSalesTxn());

		// CLOSE request
		if (ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {
			callEposs(HttpMethod.POST,
					SalesUtil.WORKFLOW_PROCESS_URL + "/" + manualBillDetails.getManualBillDetails().getProcessId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.MANUAL_BILL.name()), null);
		}

		if (orderDao.getSalesTxn().getTxnType().equals(TransactionTypeEnum.AB.name())) {
			orderDao.setSalesTxn(commonTransactionService.getSalesTxnDao(orderDao.getSalesTxn(),
					TransactionTypeEnum.AB.name(), orderDao.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.AB,
					TransactionStatusEnum.CONFIRMED));
		} else if (orderDao.getSalesTxn().getTxnType().equals(TransactionTypeEnum.CO.name())) {
			orderDao.setSalesTxn(commonTransactionService.getSalesTxnDao(orderDao.getSalesTxn(),
					TransactionTypeEnum.CO.name(), orderDao.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.CO,
					TransactionStatusEnum.CONFIRMED));
		}

		// confirm GHS payments (if Exists)
		// do not check isEditable column of payment_details table here
		List<PaymentDetailsDaoExt> ghsPaymentList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(orderDao.getSalesTxn().getId(),
						PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null,
						orderDao.getSalesTxn().getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));
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

			commonTransactionService.finalConfirmForGhsPayments(orderDao.getSalesTxn(), ghsPaymentList,
					ghsPaymentIdAndCreditNoteMap, ghsPaymentOtherDetalisMap);
			paymentDetailsRepository.saveAll(ghsPaymentList);
			creditNoteRepository.saveAll(ghsPaymentIdAndCreditNoteMap.values());// will save reference details
		}

	}

	// This Method will validate the Paid value with payment received
	private BigDecimal checkPaidValue(String transactionId, BigDecimal inputPaidValue, String paymentStatus) {

		// for confirm get total paid value of 'COMPLETED' payments.
		BigDecimal paidValue = commonTransactionService.paidValue(transactionId, null, paymentStatus);

		// is this check required?
		if (paidValue.compareTo(inputPaidValue) != 0 && !paymentStatus.equals(PaymentStatusEnum.COMPLETED.name())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Paid Value expected: " + paidValue + " found: " + inputPaidValue);
		}

		return paidValue;

	}

	// This method will delete the order by id
	@Override
	@Transactional
	public void deleteOrder(String id, String transactionType, String subTxnType, String remarks) {
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(orderDao.getSalesTxn().getStatus());

		// check if payment is done for order
		commonTransactionService.paymentCheck(orderDao.getSalesTxn(), null, false);

		// delete items - not required
		// delete customer txn - not required
		// delete order - not required

		// clear manual bill id, once deleted
		// pending - manual bill details to be deleted?
		if (SubTxnTypeEnum.MANUAL_AB.name().equals(subTxnType)) {
			orderDao.getSalesTxn().setManualBillId(null);
		} else if (SubTxnTypeEnum.MANUAL_CO.name().equals(subTxnType)) {
			orderDao.getSalesTxn().setManualBillId(null);
		}

		// if remarks not empty, then set remarks
		if (!StringUtils.isEmpty(remarks)) {
			orderDao.getSalesTxn().setRemarks(remarks);
		}

		// doc number deletion?? or doc number update? since doc number is maintained
		// based on txn type and status.
		// since update may fail as other CM might have same doc no, need to generate
		// doc no. here also
		// set doc no.
		if (SubTxnTypeEnum.MANUAL_CO.name().equals(subTxnType) || SubTxnTypeEnum.NEW_CO.name().equals(subTxnType)) {
			orderDao.setSalesTxn(commonTransactionService.getSalesTxnDao(orderDao.getSalesTxn(),
					TransactionTypeEnum.CO.name(), orderDao.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.CT_DELETE,
					TransactionStatusEnum.DELETED));
		} else {
			orderDao.setSalesTxn(commonTransactionService.getSalesTxnDao(orderDao.getSalesTxn(),
					TransactionTypeEnum.AB.name(), orderDao.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.CT_DELETE,
					TransactionStatusEnum.DELETED));
		}

		salesTxnRepository.save(orderDao.getSalesTxn());

	}

	// This method will update order details partially.
	@Transactional
	@Override
	public PublishResponse partialUpdateOrderTransactional(String id, String transactionType, String subTxnType,
			String actionType, OrderPatchUpdateDto orderPatchUpdateDto, Boolean ackReqRejection) {
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// List the generated Credit notes w.r.t order
		List<Integer> creditNoteDocs = new ArrayList<>();

		// Post confirm order, other actions like CANCEL,ACTIVATE,FREEZE and Create
		// Approval Request will be handled here
		SyncStagingDto syncStagingDto = null;
		if (!StringUtils.isEmpty(actionType)) {

			List<InventoryDetailsDao> inventoryDetails = validateActionsAndUpdateTheOrder(actionType,
					orderPatchUpdateDto, orderDao, creditNoteDocs, ackReqRejection);
			List<OrderDetailsDaoExt> orderDetailsDaoList = orderDetailsRepository.findAllByOrderId(id);
			syncStagingDto = syncStagging(orderDao.getSalesTxn(), orderDao, orderDetailsDaoList, inventoryDetails, null,
					OrderServiceImpl.ORDER + actionType);
		} else {

			commonTransactionService.checkTranscationStatusForUpdate(orderDao.getSalesTxn().getStatus());

			if (!StringUtils.isEmpty(orderPatchUpdateDto.getCollectedBy())) {
				orderDao.setCollectedBy(orderPatchUpdateDto.getCollectedBy());
			}
			// if different customer id, then update customer txn & tax details of items.
			if (!StringUtils.isEmpty(orderPatchUpdateDto.getCustomerId()) && (StringUtils
					.isEmpty(orderDao.getSalesTxn().getCustomerId())
					|| orderDao.getSalesTxn().getCustomerId().compareTo(orderPatchUpdateDto.getCustomerId()) != 0)) {

				// Customer dependent discounts should be removed to update customer
				commonTransactionService.discountValidationsOnCustomerUpdate(orderDao.getSalesTxn(),
						orderPatchUpdateDto.getCustomerId());

				commonTransactionService.updateCustomerDetails(orderPatchUpdateDto.getCustomerId(),
						orderDao.getSalesTxn());

				// get order details if exists.
				List<OrderDetailsDaoExt> orderDetailsDaoList = orderDetailsRepository
						.findAllByOrderId(orderDao.getId());
				// item tax update
				if (!CollectionUtils.isEmpty(orderDetailsDaoList)) {
					orderUtilService.updateTaxDetails(orderDetailsDaoList);

					orderDetailsRepository.saveAll(orderDetailsDaoList);
					// update order
					orderUtilService.updateOrderHeader(orderDao, null);
				}

			}

			if (!StringUtils.isEmpty(orderPatchUpdateDto.getIsFrozenRate())
					|| !StringUtils.isEmpty(orderPatchUpdateDto.getIsBestRate())) {

				updateFrozenOrBestRate(orderPatchUpdateDto, orderDao);
			}
			if (!StringUtils.isEmpty(orderPatchUpdateDto.getEmployeeCode())) {
				List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository.findAllByOrderId(orderDao.getId());
				orderDetailsList.forEach(OrderDetailsDaoExt -> OrderDetailsDaoExt
						.setEmployeeCode(orderPatchUpdateDto.getEmployeeCode()));
				orderDetailsRepository.saveAll(orderDetailsList);

				orderDao.getSalesTxn().setEmployeeCode(orderPatchUpdateDto.getEmployeeCode());
				// salesTxnRepository.save(orderDao.getSalesTxn());
			}

			if (!StringUtil.isBlankJsonData(orderPatchUpdateDto.getDiscountTxnDetails())
					&& orderPatchUpdateDto.getDiscountTxnDetails().getData() != null) {
				commonTransactionService.checkDiscountDetails(orderDao.getSalesTxn(),
						orderPatchUpdateDto.getDiscountTxnDetails());
			}

			if (!StringUtil.isBlankJsonData(orderPatchUpdateDto.getNomineeDetails())
					&& orderPatchUpdateDto.getNomineeDetails().getData() != null) {
				commonTransactionService.checkNomineeDetails(orderDao, orderPatchUpdateDto.getNomineeDetails());
			}
		}
		salesTxnRepository.save(orderDao.getSalesTxn());
		orderRepository.save(orderDao);

		OrderAndItemIdResponseDto orderResponse = orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
		PublishResponse response = new PublishResponse();
		response.setApiResponse(orderResponse);
		response.setSyncStagingDto(syncStagingDto);
		return response;
	}

	// Method to update Frozen rate or best rate flag ref to PartialUpdateOrder
	public void updateFrozenOrBestRate(OrderPatchUpdateDto orderPatchUpdateDto, OrderDaoExt orderDao) {

		// if rate protected CN is added, but both 'isFrozenRate' & 'isBestRate' are
		// false in update request, then throw error.
		checkFrozenRateAndBestRateForRateProtectedCN(orderPatchUpdateDto, orderDao);

		if (!StringUtils.isEmpty(orderPatchUpdateDto.getIsFrozenRate())) {
			orderDao.setIsFrozenRate(orderPatchUpdateDto.getIsFrozenRate());
		}
		if (!StringUtils.isEmpty(orderPatchUpdateDto.getIsBestRate())) {
			RuleTypeEnum ruleType = null;
			if (BooleanUtils.isTrue(orderPatchUpdateDto.getIsBestRate())
					&& BooleanUtils.isTrue(orderDao.getIsFrozenRate())) {
				throw new ServiceException(
						INVALID_REQUEST
								+ "Either Best rate or Freeze rate option should be selected, Both are not allowed",
						ERR_SALE_294, Map.of(SalesConstants.REMARKS,
								"Either Best rate or Freeze rate option should be selected, Both are not allowed"));
			}
			BGRConfigDetails bgrConfigDetails = null;
			if (BooleanUtils.isTrue(orderPatchUpdateDto.getIsBestRate())) {

				// BGR offer date configuration validations
				RuleRequestListDto ruleRequestDto = new RuleRequestListDto();
				ruleRequestDto.setLocationCode(CommonUtil.getLocationCode());

				ruleType = TransactionTypeEnum.AB.name().equals(orderDao.getSalesTxn().getTxnType())
						? RuleTypeEnum.ORDER_AB_BGR_CONFIG
						: RuleTypeEnum.ORDER_CO_BGR_CONFIG;
				// Call to engine api to get Configured values
				Object ruleFieldValues = engineService.getRuleFieldValues(ruleType, ruleRequestDto);

				bgrConfigDetails = MapperUtil.mapObjToClass(ruleFieldValues, BGRConfigDetails.class);

				Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

				// Best gold rate offer start & end date check against configuration of location
				if (businessDate.before(bgrConfigDetails.getBgrOfferFromDate())
						|| businessDate.after(bgrConfigDetails.getBgrOfferToDate())) {
					throw new ServiceException(
							INVALID_REQUEST + "No BGR offer running at this moment - BGR offer start date:"
									+ bgrConfigDetails.getBgrOfferFromDate() + "BGR offer end date:"
									+ bgrConfigDetails.getBgrOfferToDate(),
							ERR_SALE_294,
							Map.of(SalesConstants.REMARKS, "Currently No BGR offer applicable for this location"));
				}
			}
			orderDao.setIsBestRate(orderPatchUpdateDto.getIsBestRate());
			orderDao.setBestRateConfigDetails(bgrConfigDetails == null ? null
					: MapperUtil.getStringFromJson(new JsonData(ruleType.name(), bgrConfigDetails)));
		}
		// If Freeze rate or Best rate option is choosen, min order value should be
		// recalculated at item level
		updateMinOrderValue(orderDao);
	}

	private void checkFrozenRateAndBestRateForRateProtectedCN(OrderPatchUpdateDto orderPatchUpdateDto,
			OrderDaoExt orderDao) {
		// if rate protected CN is added, but both 'isFrozenRate' & 'isBestRate' are
		// false in update request, then throw error.
		if (BooleanUtils.isFalse(orderPatchUpdateDto.getIsFrozenRate())
				&& BooleanUtils.isFalse(orderPatchUpdateDto.getIsBestRate())) {
			PaymentDetailsDaoExt rateFreezedCNPayment = paymentUtil
					.getMetalRateProtectedCNIfExists(orderDao.getSalesTxn());
			if (rateFreezedCNPayment != null) {
				throw new ServiceException(INVALID_REQUEST, ERR_SALE_294, Map.of(SalesConstants.REMARKS,
						"Order cannot be non-frozen when rate protected credit note is added."));
			}

		}
	}

	/**
	 * Method to update the Minimum order value ref to partialUpdateOrder
	 * 
	 * @param orderDao
	 */
	public void updateMinOrderValue(OrderDaoExt orderDao) {
		List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository.findAllByOrderId(orderDao.getId());
		// If items added, claculate min order value, else set to ZERO
		if (!orderDetailsList.isEmpty()) {
			List<OrderDetailsDaoExt> updatedOrderDetailsList = new ArrayList<>();
			BigDecimal minOrderValue = BigDecimal.ZERO;
			// Need to discuss about calling engine service in for loop
			for (OrderDetailsDaoExt orderDetails : orderDetailsList) {
				OrderDetailsDaoExt orderDetailsDao = orderUtilService.calculateMinOrderValue(orderDetails,
						orderDao.getSalesTxn().getTxnType(), null);
				updatedOrderDetailsList.add(orderDetailsDao);
				// Need to validate this sum up
				minOrderValue = minOrderValue.add(orderDetailsDao.getMinOrderPayment());
			}

			orderDetailsRepository.saveAll(updatedOrderDetailsList);

			// rounding off Order min order value:
			BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(minOrderValue);

			orderDao.setMinOrderPayment(minOrderValue.add(roundingVariance));
		}

	}

	@Transactional
	public List<InventoryDetailsDao> validateActionsAndUpdateTheOrder(String actionType,
			OrderPatchUpdateDto orderPatchUpdateDto, OrderDaoExt orderDao, List<Integer> creditNoteDocs,
			Boolean ackReqRejection) {
		if (TxnSourceType.LEGACY.name().equals(orderDao.getSalesTxn().getTxnSource())
				&& TransactionActionTypeEnum.actionNotAllowedForMigratedAbOrCo().contains(actionType)) {
			throw new ServiceException(INVALID_REQUEST + actionType + " not allowed for migrated AB", ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, actionType + " not allowed for current transaction"));
		}

		List<InventoryDetailsDao> inventoryDetails = new ArrayList<>();
		if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.CANCEL.name())) {
			inventoryDetails = cancelOrder(orderDao, orderPatchUpdateDto, creditNoteDocs);
		} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.CANCEL_REQUEST.name())) {
			createOrAckCancelRequest(orderPatchUpdateDto, orderDao, ackReqRejection);
		} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.ACTIVATE_REQUEST.name())) {
			createOrAckActivationRequest(orderPatchUpdateDto, orderDao, ackReqRejection);
		} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.ACTIVATE.name())) {
			activateOrder(orderDao, orderPatchUpdateDto);
		} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.RATE_FREEZE.name())) {
			freezeOrder(orderPatchUpdateDto, orderDao, creditNoteDocs);
		} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.ADD_PAYMENT.name())) {
			addPayment(orderDao, creditNoteDocs);
		} else {
			throw new ServiceException(INVALID_UPDATE, ERR_SALE_090, "Invalid action type");
		}
		return inventoryDetails;
	}

	// Method to check remarks is mandatory
	private void checkRemarks(OrderPatchUpdateDto orderPatchUpdateDto) {
		if (StringUtils.isEmpty(orderPatchUpdateDto.getRemarks())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Remarks is mandatory");
		}
	}

	// Method to Freeze the order post Confirm
	@Transactional
	public void freezeOrder(OrderPatchUpdateDto orderPatchUpdateDto, OrderDaoExt orderDao,
			List<Integer> creditNoteDocs) {
		// Order should not be frozen before and It should be in CONFIRMED status to
		// Freeze the rate`
		checkIfCMHoldNonFreezeAB(orderDao);
		if (orderDao.getIsFrozenRate()
				|| !orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.toString())) {
			log.info("Order Details - {}", orderDao);
			throw new ServiceException(INVALID_REQUEST + SalesConstants.PLEASE_CHECK_THE_STATUS, ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, SalesConstants.PLEASE_CHECK_THE_STATUS));

		}
		// Paid value is mandatory to validate freeze AB
		if (StringUtils.isEmpty(orderPatchUpdateDto.getPaidValue())) {
			throw new ServiceException(INVALID_REQUEST + "Paid value is mandatory to validate Freeze AB",
					INVALID_REQUEST, Map.of(SalesConstants.REMARKS, "Paid value is mandatory to validate Freeze AB"));
		}

		// why zero is passed for hold time? -- because at this point order will be
		// 'CONFIRMED' status and hold time does not matter
		commonTransactionService.checkMetalRate(orderDao.getSalesTxn(), orderPatchUpdateDto.getMetalRateList(),
				TransactionStatusEnum.valueOf(orderDao.getSalesTxn().getStatus()), true, BigDecimal.ZERO, false,
				Set.of());

		// Validate paid value with final value or min order value
		validatePaidValue(orderPatchUpdateDto.getPaidValue(), orderDao);

		// Generate Credit Note for Additional payment made as part of Freeze Order
		creditNoteDocs.addAll(generateCreditNoteForNewPaymentsOfOrder(orderDao, false));

		// Set FrozenRate & date and set best rate to false
		orderDao.setIsFrozenRate(true);
		
		if (BooleanUtils.isTrue(orderDao.getIsFrozenRate())) {
			updateFrozen(orderDao);
		}
		orderDao.setRateFrozenDate(businessDayService.getBusinessDay().getBusinessDate());
		orderDao.setIsBestRate(false);

		// confirm GHS payments (if Exists)
		List<PaymentDetailsDaoExt> ghsPaymentList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(orderDao.getSalesTxn().getId(),
						PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null,
						orderDao.getSalesTxn().getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));
		if (!CollectionUtil.isEmpty(ghsPaymentList)) {
			ghsPaymentList = ghsPaymentList.stream()
					.filter(ghsPayment -> BooleanUtils.isTrue(ghsPayment.getIsEditable())).collect(Collectors.toList());
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

				commonTransactionService.finalConfirmForGhsPayments(orderDao.getSalesTxn(), ghsPaymentList,
						ghsPaymentIdAndCreditNoteMap, ghsPaymentOtherDetalisMap);
				paymentDetailsRepository.saveAll(ghsPaymentList);
				creditNoteRepository.saveAll(ghsPaymentIdAndCreditNoteMap.values());// will save reference details
			}
		}

		// On Order Freeze, Update is_editable flag to false for all payments made
		updatePaymentDetails(orderDao);

	}

	//reset print column after converting AB NonFrozen to Frozen
	private void updateFrozen(OrderDaoExt orderDao) {
		
			if(BooleanUtils.isTrue(orderDao.getIsFrozenRate()))
			{
				orderDao.getSalesTxn().setPrints(0);
				log.info("orderDao--------{}"+orderDao.getSalesTxn().getPrints());
				orderDao.getSalesTxn().setEmailPrints(0);
				log.info("orderDao--------{}"+orderDao.getSalesTxn().getEmailPrints());
			}
		
		salesTxnRepository.save(orderDao.getSalesTxn());
		orderRepository.save(orderDao);
		
	}

	// Method to create activation request or Acknowledge approval rejection of
	// activation request for order
	public void createOrAckActivationRequest(OrderPatchUpdateDto orderPatchUpdateDto, OrderDaoExt orderDao,
			Boolean ackReqRejection) {

		// If ackReqRejection is true, update the sales txn status back to previous
		// status
		if (BooleanUtils.isTrue(ackReqRejection)) {

			acknowledgeActivationRequest(orderDao);

			return;
		}

		// Check if Activation allowed or not and Validity days for activation after
		// suspension
		validateLocationConfigurationOfAb(false, true, true, orderDao);

		// Remarks check removed

		// Order should be in SUSPENDED status to Initiate Activation Request
		if (!orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.SUSPENDED.name())) {
			throw new ServiceException(
					INVALID_REQUEST + "Order should be in SUSPENDED status to Initiate Activation Request",
					ERR_SALE_294, Map.of(SalesConstants.REMARKS, SalesConstants.PLEASE_CHECK_THE_STATUS));
		}

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		orderDao.getSalesTxn().setRequestType(SalesTxnRequestTypeEnum.ACTIVATION.name());
		orderDao.getSalesTxn().setRequestedDate(businessDate);

		WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = createOrderApprovalRequest(orderDao,
				orderPatchUpdateDto, WorkflowTypeEnum.ACTIVATE_ADVANCE_BOOKING.name());

		OrderActivationDetails orderActivationDetails = new OrderActivationDetails();

		// set process id, requestNo & status (docNo from workflow) for reference
		orderActivationDetails.setProcessId(workflowProcessCreateResponseDto.getProcessId());
		orderActivationDetails.setRequestedDate(workflowProcessCreateResponseDto.getRequestedDate());
		orderActivationDetails.setRequestDocNo(workflowProcessCreateResponseDto.getDocNo());
		orderActivationDetails.setRequestType(workflowProcessCreateResponseDto.getWorkflowType());

		orderDao.setActivationDetails(MapperUtil.getStringFromJson(orderActivationDetails));

		orderDao.getSalesTxn().setPreviousStatus(orderDao.getSalesTxn().getStatus());
		orderDao.getSalesTxn().setStatus(TransactionStatusEnum.ACTIVATION_PENDING.toString());

	}

	// Method to check if CM holds this AB
	private void checkIfCMHoldAB(OrderDaoExt orderDao) {
		// if (StringUtils.isEmpty(orderDao.getId())) {
		// throw new ServiceException(SalesConstants.INVALID_INPUTS,
		// SalesConstants.ERR_SALE_048,
		// "ID is not present");
		// }
		List<SalesTxnDaoExt> cmAbLinkTxnDetails = salesTxnRepository.findCmHoldAB(orderDao.getId(),
				orderDao.getSalesTxn().getTxnType());
		for (SalesTxnDaoExt salesTxn : cmAbLinkTxnDetails) {
			if (salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.HOLD.name())
					|| salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.OPEN.name()) 
					|| salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.APPROVAL_PENDING.name())) {
				throw new ServiceException("AB Hold by CM cannot be cancelled", ERR_SALE_358);
			}
		}
	}

	private void checkIfCMHoldNonFreezeAB(OrderDaoExt orderDao) {
		List<SalesTxnDaoExt> cmAbLinkTxnDetails = salesTxnRepository.findCmHoldAB(orderDao.getId(),
				orderDao.getSalesTxn().getTxnType());
		for (SalesTxnDaoExt salesTxn : cmAbLinkTxnDetails) {
			if (salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.HOLD.name())) {
				throw new ServiceException("Gold rate Non-freeze order Hold for billing cannot be freezed",
						ERR_SALE_366);
			}
		}
	}

	// Method to create cancellation request or Acknowledge approval rejection of
	// cancellation request for order
	public void createOrAckCancelRequest(OrderPatchUpdateDto orderPatchUpdateDto, OrderDaoExt orderDao,
			Boolean ackReqRejection) {

		// to check if any AB status as Hold in Billing(CM)
		checkIfCMHoldAB(orderDao);
		// If ackReqRejection is true, update the sales txn status back to previous
		// status
		if (BooleanUtils.isTrue(ackReqRejection)) {
			acknowledgeCancelRequest(orderDao);
			return;
		}

		// All the Order payments should be Converted to Credit Note to cancel an Order
		if (!CollectionUtils.isEmpty(paymentDetailsRepository.findBySalesTxnDaoIdAndCreditNoteDaoIdAndStatus(
				orderDao.getId(), null, PaymentStatusEnum.COMPLETED.name()))) {
			throw new ServiceException(
					INVALID_REQUEST
							+ "Some Order payments are pending should be Converted to Credit Note to cancel an Order.",
					ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Some Order payments are pending should be Converted to Credit Note to cancel an Order."));
		}

		// Check if Cancellation allowed or not
		validateLocationConfigurationOfAb(true, false, false, null);

		// Remarks is mandatory
		checkRemarks(orderPatchUpdateDto);

		// Order should be in CONFIRMED status to Initiate Cancellation Request
		if (!orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name())
			&& !orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.PARTIAL_INVOICE.name())) {
			throw new ServiceException(INVALID_REQUEST + SalesConstants.AB_CANNOT_BE_CANCELLED_AS_IT_IS_NOT_AVAILABLE_NOT_IN_CONFIRM_STATUS, ERR_SALE_450,
					Map.of(SalesConstants.REMARKS, SalesConstants.AB_CANNOT_BE_CANCELLED_AS_IT_IS_NOT_AVAILABLE_NOT_IN_CONFIRM_STATUS));

		}
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		Boolean isSameDay = SalesUtil.isSameDay(orderDao.getSalesTxn().getDocDate(), businessDate);
		// If Order Confirmed on same day and it is Non-frozen, No need of approval
		if (isSameDay) {
			throw new ServiceException(
					INVALID_REQUEST + "No corporate approval needed for Cancellation of this transaction", ERR_SALE_294,
					Map.of(SalesConstants.REMARKS,
							"No corporate approval needed for Cancellation of this transaction"));
		}

		orderDao.getSalesTxn().setRequestType(SalesTxnRequestTypeEnum.CANCELLATION.name());
		orderDao.getSalesTxn().setRequestedDate(businessDate);

		WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = createOrderApprovalRequest(orderDao,
				orderPatchUpdateDto, WorkflowTypeEnum.CANCEL_ADVANCE_BOOKING.name());

		OrderCancelDetails orderCancelDetails = new OrderCancelDetails();
		// set process id, requestNo & status (docNo from workflow) for reference
		orderCancelDetails.setProcessId(workflowProcessCreateResponseDto.getProcessId());
		orderCancelDetails.setRequestedDate(workflowProcessCreateResponseDto.getRequestedDate());
		orderCancelDetails.setRequestDocNo(workflowProcessCreateResponseDto.getDocNo());
		orderCancelDetails.setRequestType(workflowProcessCreateResponseDto.getWorkflowType());

		orderDao.setCancellationDetails(MapperUtil.getStringFromJson(orderCancelDetails));
		orderDao.getSalesTxn().setPreviousStatus(orderDao.getSalesTxn().getStatus());

		orderDao.getSalesTxn().setStatus(TransactionStatusEnum.CANCELLATION_PENDING.toString());

	}

	// Method to validate paid value w.r.t payment received and final value
	public BigDecimal validatePaidValue(BigDecimal inputPaidValue, OrderDaoExt orderDao) {
		// All payment status should be confirmed
		BigDecimal paidValue = checkPaidValue(orderDao.getSalesTxn().getId(), inputPaidValue,
				PaymentStatusEnum.COMPLETED.name());

		// Paid value should be greater than or equal to minimum order value
		if (paidValue.compareTo(orderDao.getMinOrderPayment()) < 0) {
			log.info("Paid value - {}", paidValue);
			throw new ServiceException(PAID_VALUE_SHOULD_MATCH_MIN_VALUE, ERR_SALE_130,
					"Paid Value should be greater than or equal to minimum payment value");
		}

		// Paid value can be more than final value, extra amount will be utilized during
		// final invoice
		// added check as per UAT_2624
		if (paidValue.compareTo(orderDao.getFinalValue()) > 0) {
			throw new ServiceException(SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER,
					SalesConstants.ERR_SALE_030, SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER);
		}

		return paidValue;
	}

	// This method used to cancel the order
	public List<InventoryDetailsDao> cancelOrder(OrderDaoExt orderDao, OrderPatchUpdateDto orderPatchUpdateDto,
			List<Integer> creditNoteDocs) {

		// to check if any AB status as Hold in Billing(CM)
		checkIfCMHoldAB(orderDao);
		List<InventoryDetailsDao> inventoryDetails = new ArrayList<>();

		// All the Order payments should be Converted to Credit Note to cancel an Order
		if (!CollectionUtils.isEmpty(paymentDetailsRepository.findBySalesTxnDaoIdAndCreditNoteDaoIdAndStatus(
				orderDao.getId(), null, PaymentStatusEnum.COMPLETED.name()))) {
			throw new ServiceException(
					INVALID_REQUEST
							+ "Some Order payments are pending should be Converted to Credit Note to cancel an Order.",
					ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Some Order payments are pending should be Converted to Credit Note to cancel an Order."));
		}

		// Check if Cancellation allowed or not
		validateLocationConfigurationOfAb(true, false, false, null);

		// Get the Credit notes generated for an order
		List<CreditNoteDaoExt> creditNotesOfOrder = creditNoteRepository.findByLinkedTxnIdAndStatus(orderDao.getId(),
				CNStatus.OPEN.name());

		List<Integer> creditNoteDocNos = creditNotesOfOrder.stream().map(CreditNoteDaoExt::getDocNo)
				.collect(Collectors.toList());

		OrderCancelDetails orderCancelDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(orderDao.getCancellationDetails()), OrderCancelDetails.class);

		if (orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name())||
				orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.PARTIAL_INVOICE.name())) {

			Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

			Boolean isSameDay = SalesUtil.isSameDay(orderDao.getSalesTxn().getDocDate(), businessDate);
			if (!isSameDay) {
				Boolean approvalRequest = true;
				// If Non frozen order validate location config whether approval needed for
				// order Cancel
				if (BooleanUtils.isFalse(orderDao.getIsFrozenRate())
						&& BooleanUtils.isFalse(orderDao.getIsBestRate())) {
					LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = orderUtilService
							.getAbDetailsFromLocation();
					if (StringUtils
							.isEmpty(locationAdvanceBookingDetailsDto.getRequestApprovalForNonFrozenOrderCancel())) {
						throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
								SalesConstants.ERR_SALE_023, "Request Approval For Non Frozen Order Cancel");
					}
					approvalRequest = locationAdvanceBookingDetailsDto.getRequestApprovalForNonFrozenOrderCancel();
				}

				if (BooleanUtils.isTrue(approvalRequest)) {
					throw new ServiceException(
							INVALID_REQUEST + "Cancellation needs corporate aproval.Please raise approval request",
							ERR_SALE_294, Map.of(SalesConstants.REMARKS,
									"Cancellation needs corporate aproval.Please raise approval request"));
				}
			}

			setCancellationDetails(orderDao, orderCancelDetails, orderPatchUpdateDto, null);

			// On Cancel of Order all the linked Credit notes will be released and become
			// Open CN's
			orderUtilService.releaseLinkedCreditNotes(orderDao);

			// Release Items from reserve bin
			List<OrderDetailsDaoExt> orderDetailsDaoList = orderDetailsRepository
					.findAllByOrderIdAndStatus(orderDao.getId(), TransactionStatusEnum.CONFIRMED.name());
			if (!CollectionUtils.isEmpty(orderDetailsDaoList)) {
				inventoryDetails = orderUtilService.releaseItemsFromReserveBin(orderDetailsDaoList);
			}

			// To display released CN's on Cancel of order
			creditNoteDocs.addAll(creditNoteDocNos);

		}

		// Need to check approval status in workflow service using process id
		else if (orderDao.getSalesTxn().getStatus()
				.equalsIgnoreCase(TransactionStatusEnum.CANCELLATION_PENDING.name())) {

			WorkflowProcessGetResponseDto workflowProcessGetResponseDto = getWorkFlowDetails(
					WorkflowTypeEnum.CANCEL_ADVANCE_BOOKING.name(), orderCancelDetails.getProcessId());
			if (!StringUtils.isEmpty(workflowProcessGetResponseDto.getApprovalStatus()) && workflowProcessGetResponseDto
					.getApprovalStatus().equalsIgnoreCase(WorkflowProcessStatusEnum.APPROVED.name())) {

				setCancellationDetails(orderDao, orderCancelDetails, orderPatchUpdateDto,
						workflowProcessGetResponseDto);

				// On Cancel of Order all the linked Credit notes will be released and become
				// Open CN's
				orderUtilService.releaseLinkedCreditNotes(orderDao);

				// Release Items from reserve bin
				List<OrderDetailsDaoExt> orderDetailsDaoList = orderDetailsRepository
						.findAllByOrderIdAndStatus(orderDao.getId(), TransactionStatusEnum.CONFIRMED.name());
				if (!CollectionUtils.isEmpty(orderDetailsDaoList)) {
					inventoryDetails = orderUtilService.releaseItemsFromReserveBin(orderDetailsDaoList);
				}

				// Close the request
				// Pending: Transaction management need to be taken care
				callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + orderCancelDetails.getProcessId(),
						Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.CANCEL_ADVANCE_BOOKING.name()), null);

				// To display released CN's on Cancel of order
				creditNoteDocs.addAll(creditNoteDocNos);

			} else {
				log.info("Work flow Response - {}", workflowProcessGetResponseDto);
				throw new ServiceException(
						INVALID_REQUEST + "Cancellation Request should be approved to Cancel the order", ERR_SALE_294,
						Map.of(SalesConstants.REMARKS, "Cancellation Request should be approved to Cancel the order"));
			}

		} else {
			log.info("Transaction Details - {}", orderDao.getSalesTxn());
			throw new ServiceException(INVALID_REQUEST + SalesConstants.AB_CANNOT_BE_CANCELLED_AS_IT_IS_NOT_AVAILABLE_NOT_IN_CONFIRM_STATUS, ERR_SALE_450,
					Map.of(SalesConstants.REMARKS, SalesConstants.AB_CANNOT_BE_CANCELLED_AS_IT_IS_NOT_AVAILABLE_NOT_IN_CONFIRM_STATUS));

		}

		return inventoryDetails;
	}

	// This method will check the Manual Bill approval status
	private String checkManualBillRequestStatus(ManualBillTxnDetailsDto manualBillDetails) {
		if (StringUtils.isEmpty(manualBillDetails.getManualBillDetails().getProcessId())) {
			return "";
		}

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE,
				WorkflowTypeEnum.ADVANCE_BOOKING_MANUAL_BILL.name());
		ApiResponseDto apiResponseDto = callEposs(HttpMethod.GET,
				SalesUtil.WORKFLOW_PROCESS_URL + "/" + manualBillDetails.getManualBillDetails().getProcessId(),
				reqParams, null);

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = MapperUtil.getObjectMapperInstance()
				.convertValue(apiResponseDto.getResponse(), WorkflowProcessGetResponseDto.class);

		manualBillDetails.getManualBillDetails().setApprovedBy(workflowProcessGetResponseDto.getApprovedby());

		return workflowProcessGetResponseDto.getApprovalStatus();
	}

	// This method to perform inter service call to eposs services through
	// integration service
	public ApiResponseDto callEposs(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParamters,
			Object requestBody) {

		ApiResponseDto epossApiDto = integrationService.callEpossAPI(httpMethod, relativeUrl, requestParamters,
				requestBody);
		if (epossApiDto.getHttpResponseCode() != HttpStatus.OK.value()) {
			throw new ServiceException(
					JsonUtils.getValueFromJsonString(epossApiDto.getResponse(), CommonConstants.MESSAGE),
					JsonUtils.getValueFromJsonString(epossApiDto.getResponse(), CommonConstants.CODE),
					epossApiDto.getResponse());
		}
		return epossApiDto;
	}

	// This method will send the manual bill request for approval
	public void approvalPendingOrder(OrderDaoExt orderDao, List<OrderDetailsDaoExt> orderDetailsDaoList) {

		ManualBillTxnDetailsDto manualBillDetails = commonTransactionService
				.mapJsonToManualBillDetails(orderDao.getSalesTxn().getManualBillDetails());

		// 'APPROVAL_PENDING' status is allowed only when validationType is
		// 'REQUEST_APPROVAL'
		if (!ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {
			throw new ServiceException(INVALID_REQUEST + "Mismatch between Manual Bill validation type and status",
					ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Mismatch between Manual Bill validation type and status"));
		}

		// Paid value should be greater than or equal to minimum order value - Removed,
		// As per requirement it can be done after Approval also

		// to check total weight and final value for manual bill.
		orderUtilService.validateManualBillDetails(orderDao, orderDetailsDaoList, true);

		// for work flow req data: item, Payment mode, Discount, FOC & Employee discount
		// item data
		List<Object> itemDtoList = getOrderItemDetailsForWorkflow(orderDetailsDaoList);

		// payment data
		ListResponse<SalesPaymentDto> paymentDtoList = paymentFacadeService
				.getPaymentDetails(orderDao.getSalesTxn().getId(), null, null, null);

		// workFlowType ADVANCE_BOOKING_MANUAL_BILL
		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(manualBillDetails.getManualBillDetails().getRemarks());

		// To set Actual request date as business date at POSS level
		orderDao.getSalesTxn().setRequestType(SalesTxnRequestTypeEnum.MANUAL_BILL.name());
		orderDao.getSalesTxn().setRequestedDate(businessDayService.getBusinessDay().getBusinessDate());

		// Order header details
		OrderManualBillRequestHeaderDto orderManualBillRequestHeaderDto = (OrderManualBillRequestHeaderDto) MapperUtil
				.getObjectMapping(orderUtilService.orderResponse(orderDao, null),
						new OrderManualBillRequestHeaderDto());

		// customer details from customer master
		orderManualBillRequestHeaderDto = (OrderManualBillRequestHeaderDto) MapperUtil.getObjectMapping(
				customerService.getCustomer(orderDao.getSalesTxn().getCustomerId()), orderManualBillRequestHeaderDto);

		// set the Header data for ADVANCE_BOOKING_MANUAL_BILL
		workflowProcessCreateDto
				.setHeaderData(new JsonData("ADVANCE_BOOKING_MANUAL_BILL_HEADER", orderManualBillRequestHeaderDto));

		// set request data
		ManaulBillRequestDetailsDto manaulBillRequestDetailsDto = new ManaulBillRequestDetailsDto();
		manaulBillRequestDetailsDto.setItemList(itemDtoList);
		manaulBillRequestDetailsDto.setPaymentList(paymentDtoList.getResults());
		// pending - discount details.
		manaulBillRequestDetailsDto.setDiscountList(List.of());

		// set the Request data for ADVANCE_BOOKING_MANUAL_BILL
		workflowProcessCreateDto
				.setRequestData(new JsonData("ADVANCE_BOOKING_MANUAL_BILL_DETAILS", manaulBillRequestDetailsDto));

		// filters -manulbillNo & locationCode.
		Map<String, String> filterMap = new LinkedHashMap<>();
		filterMap.put("manualBillNo", manualBillDetails.getManualBillDetails().getManualBillNo());
		filterMap.put("requestedDate", CalendarUtils.formatDateToSql(orderDao.getSalesTxn().getRequestedDate()));
		filterMap.put("locationCode", CommonUtil.getLocationCode());

		workflowProcessCreateDto.setFilterValues(filterMap);

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE,
				WorkflowTypeEnum.ADVANCE_BOOKING_MANUAL_BILL.name());

		ApiResponseDto apiResponseDto = callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL, reqParams,
				workflowProcessCreateDto);

		WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = MapperUtil.getObjectMapperInstance()
				.convertValue(apiResponseDto.getResponse(), WorkflowProcessCreateResponseDto.class);

		// set process id, requestNo & status (docNo from workflow) for reference
		manualBillDetails.getManualBillDetails().setProcessId(workflowProcessCreateResponseDto.getProcessId());
		manualBillDetails.getManualBillDetails().setRequestNo(workflowProcessCreateResponseDto.getDocNo());
		manualBillDetails.getManualBillDetails().setRequestStatus(workflowProcessCreateResponseDto.getApprovalStatus());
		manualBillDetails.getManualBillDetails().setRequestedDate(workflowProcessCreateResponseDto.getRequestedDate());
		manualBillDetails.getManualBillDetails().setRequestType(workflowProcessCreateResponseDto.getWorkflowType());

		orderDao.getSalesTxn().setManualBillDetails(MapperUtil.getStringFromJson(manualBillDetails));

		// Newly added for Scheduler job
		orderDao.getSalesTxn().setPreviousStatus(orderDao.getSalesTxn().getStatus());

		// Request doc no generation
		orderDao.setSalesTxn(commonTransactionService.getSalesTxnDao(orderDao.getSalesTxn(),
				TransactionTypeEnum.AB.name(), orderDao.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.AB_MB_REQ,
				TransactionStatusEnum.APPROVAL_PENDING));

		// On order request Update is_editable flag to false for all payments made
		// update flag is not required, because of CONFIRM CN will be generated for
		// payments where is_editable flag is true.

	}

	// Method to get item details of order for workflow
	private List<Object> getOrderItemDetailsForWorkflow(List<OrderDetailsDaoExt> orderDetailsDaoList) {
		List<Object> itemDtoList = new ArrayList<>();
		orderDetailsDaoList.forEach(orderDetailsDao -> {
			OrderItemDetailsResponseDto orderItemDetailsResponseDto = orderUtilService
					.mapOrderDetailsToItemDto(orderDetailsDao);
			itemDtoList.add(orderItemDetailsResponseDto);
		});
		return itemDtoList;
	}

	// This method will create the approval request for order approval requests like
	// cancellation or activation requests
	public WorkflowProcessCreateResponseDto createOrderApprovalRequest(OrderDaoExt orderDao,
			OrderPatchUpdateDto orderPatchUpdateDto, String workFlowType) {

		List<OrderDetailsDaoExt> orderDetailsDaoList = orderUtilService.getOrderDetailsIfExists(orderDao.getId(),
				false);

		// for work flow req data: item, Discount, FOC & Employee discount
		// item data
		List<Object> itemDtoList = getOrderItemDetailsForWorkflow(orderDetailsDaoList);

		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(orderPatchUpdateDto.getRemarks());

		// Order request details
		OrderApprovalRequestDetailsDto orderApprovalRequestDetailsDto = new OrderApprovalRequestDetailsDto();
		orderApprovalRequestDetailsDto.setItemList(itemDtoList);

		// pending - discount details.
		orderApprovalRequestDetailsDto.setDiscountList(List.of());

		// Order header details
		if (workFlowType.equalsIgnoreCase(WorkflowTypeEnum.CANCEL_ADVANCE_BOOKING.name())) {

			// Pending: List the generated Credit notes w.r.t order
			List<Integer> creditNoteDocs = new ArrayList<>();
			OrderCancelRequestHeaderDto orderCancelRequestHeaderDto = (OrderCancelRequestHeaderDto) MapperUtil
					.getObjectMapping(orderUtilService.orderResponse(orderDao, creditNoteDocs),
							new OrderCancelRequestHeaderDto());

			// customer details from customer master
			orderCancelRequestHeaderDto = (OrderCancelRequestHeaderDto) MapperUtil.getObjectMapping(
					customerService.getCustomer(orderDao.getSalesTxn().getCustomerId()), orderCancelRequestHeaderDto);

			// set the Header data for CANCEL_ADVANCE_BOOKING
			workflowProcessCreateDto
					.setHeaderData(new JsonData("CANCEL_ADVANCE_BOOKING_HEADER", orderCancelRequestHeaderDto));

			// set the Request data for CANCEL_ADVANCE_BOOKING
			workflowProcessCreateDto
					.setRequestData(new JsonData("CANCEL_ADVANCE_BOOKING_DETAILS", orderApprovalRequestDetailsDto));

		} else if (workFlowType.equalsIgnoreCase(WorkflowTypeEnum.ACTIVATE_ADVANCE_BOOKING.name())) {

			// Pending: List the generated Credit notes w.r.t order
			List<Integer> creditNoteDocs = new ArrayList<>();

			OrderActivationRequestHeaderDto orderActivationRequestHeaderDto = (OrderActivationRequestHeaderDto) MapperUtil
					.getObjectMapping(orderUtilService.orderResponse(orderDao, creditNoteDocs),
							new OrderActivationRequestHeaderDto());

			// customer details from customer master
			orderActivationRequestHeaderDto = (OrderActivationRequestHeaderDto) MapperUtil.getObjectMapping(
					customerService.getCustomer(orderDao.getSalesTxn().getCustomerId()),
					orderActivationRequestHeaderDto);

			// set the Header data for ACTIVATE_ADVANCE_BOOKING
			workflowProcessCreateDto
					.setHeaderData(new JsonData("ACTIVATE_ADVANCE_BOOKING_HEADER", orderActivationRequestHeaderDto));

			// set the Request data for ACTIVATE_ADVANCE_BOOKING
			workflowProcessCreateDto
					.setRequestData(new JsonData("ACTIVATE_ADVANCE_BOOKING_DETAILS", orderApprovalRequestDetailsDto));

		}

		Map<String, String> filterMap = new LinkedHashMap<>();
		filterMap.put("locationCode", orderDao.getSalesTxn().getLocationCode());
		filterMap.put("requestedDate", CalendarUtils.formatDateToSql(orderDao.getSalesTxn().getRequestedDate()));
		// no filters.
		workflowProcessCreateDto.setFilterValues(filterMap);

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, workFlowType);

		ApiResponseDto apiResponseDto = callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL, reqParams,
				workflowProcessCreateDto);

		return MapperUtil.getObjectMapperInstance().convertValue(apiResponseDto.getResponse(),
				WorkflowProcessCreateResponseDto.class);
	}

	// Method to get workflow details by workflow type & process Id
	private WorkflowProcessGetResponseDto getWorkFlowDetails(String workFlowType, String processId) {

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, workFlowType);
		ApiResponseDto apiResponseDto = callEposs(HttpMethod.GET, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId,
				reqParams, null);

		return MapperUtil.getObjectMapperInstance().convertValue(apiResponseDto.getResponse(),
				WorkflowProcessGetResponseDto.class);

	}

	// Method to set Cancellation details
	private void setCancellationDetails(OrderDaoExt orderDao, OrderCancelDetails orderCancelDetails,
			OrderPatchUpdateDto orderPatchUpdateDto, WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		orderCancelDetails.setActionDate(businessDate);
		if (!StringUtils.isEmpty(orderPatchUpdateDto.getRemarks()))
			orderCancelDetails.setRemarks(orderPatchUpdateDto.getRemarks());
		orderCancelDetails.setEmployeeCode(CommonUtil.getEmployeeCode());
		if (workflowProcessGetResponseDto != null
				&& !StringUtils.isEmpty(workflowProcessGetResponseDto.getApprovedby()))
			orderCancelDetails.setApprover(workflowProcessGetResponseDto.getApprovedby());
		orderDao.setCancellationDetails(MapperUtil.getStringFromJson(orderCancelDetails));
		orderDao.getSalesTxn().setStatus(TransactionStatusEnum.CANCELLED.name());
	}

	// This method used to activate the order
	public OrderDaoExt activateOrder(OrderDaoExt orderDao, OrderPatchUpdateDto orderPatchUpdateDto) {

		// Check if Activation allowed or not and Validity days for activation after
		// suspension
		validateLocationConfigurationOfAb(false, true, true, orderDao);

		if (!orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.ACTIVATION_PENDING.name())) {
			throw new ServiceException(
					INVALID_REQUEST + "Order Activation needs corporate aproval.Please raise approval request",
					ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Order Activation needs corporate aproval.Please raise approval request"));
		}

		OrderActivationDetails orderActivationDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(orderDao.getActivationDetails()), OrderActivationDetails.class);

		// Need to check approval status in workflow service using process id
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = getWorkFlowDetails(
				WorkflowTypeEnum.ACTIVATE_ADVANCE_BOOKING.name(), orderActivationDetails.getProcessId());
		if (!StringUtils.isEmpty(workflowProcessGetResponseDto.getApprovalStatus()) && workflowProcessGetResponseDto
				.getApprovalStatus().equalsIgnoreCase(WorkflowProcessStatusEnum.APPROVED.name())) {

			setActivationDetails(orderDao, orderActivationDetails, orderPatchUpdateDto, workflowProcessGetResponseDto);

			// Close the request
			// Pending: Transaction management need to be taken care
			callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + orderActivationDetails.getProcessId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.ACTIVATE_ADVANCE_BOOKING.name()), null);

		} else {
			throw new ServiceException(INVALID_REQUEST + SalesConstants.PLEASE_CHECK_THE_STATUS, ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, SalesConstants.PLEASE_CHECK_THE_STATUS));

		}

		return orderDao;

	}

	// Method to set Activation details
	private void setActivationDetails(OrderDaoExt orderDao, OrderActivationDetails orderActivationDetails,
			OrderPatchUpdateDto orderPatchUpdateDto, WorkflowProcessGetResponseDto workflowProcessGetResponseDto) {

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		orderActivationDetails.setActionDate(businessDate);
		if (!StringUtils.isEmpty(orderPatchUpdateDto.getRemarks()))
			orderActivationDetails.setRemarks(orderPatchUpdateDto.getRemarks());
		orderActivationDetails.setEmployeeCode(CommonUtil.getEmployeeCode());
		if (workflowProcessGetResponseDto != null
				&& !StringUtils.isEmpty(workflowProcessGetResponseDto.getApprovedby()))
			orderActivationDetails.setApprover(workflowProcessGetResponseDto.getApprovedby());
		orderDao.setActivationDetails(MapperUtil.getStringFromJson(orderActivationDetails));
		orderDao.getSalesTxn().setStatus(TransactionStatusEnum.CONFIRMED.name());
	}

	// This method will updateAppItem Price details
	@Override
	@Transactional
	public OrderAndItemIdResponseDto updateAllItemPrice(String id, String transactionType, String subTxnType,
			String actionType) {

		log.info("Update item price of Order :- " + id);

		// To verify whether the requested Order exists or not
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// Validate Order status for Price update
		checkTransactionStatusForPriceUpdate(actionType, orderDao);

		Boolean isRateFreeze = false;
		// In case action type is RATE_FREEZE, Min order value should be calculated for
		// Frozen rate percent
		if (!StringUtils.isEmpty(actionType)
				&& actionType.equalsIgnoreCase(TransactionActionTypeEnum.RATE_FREEZE.name())) {
			isRateFreeze = true;
		}

		// Pending for discussion: Item Update is not allowed, in case payment made has
		// dependency on
		// item
		// attributes
		if (BooleanUtils.isFalse(isRateFreeze)) {
			commonTransactionService.paymentCheckForItemORCustomerUpdate(orderDao.getSalesTxn(), false, true, false);
		}

		// Pending: List the generated Credit notes w.r.t order
		List<Integer> creditNoteDocs = new ArrayList<>();

		// if rateFreeze CN is added, then price update is not required.
		PaymentDetailsDaoExt rateFreezedCNPayment = paymentUtil.getMetalRateProtectedCNIfExists(orderDao.getSalesTxn());
		if (rateFreezedCNPayment != null) {
			return orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
		}

		// if manual bill, then ignore price update.
		if (SubTxnTypeEnum.MANUAL_AB.name().equals(subTxnType)) {
			return orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
		} else if (SubTxnTypeEnum.MANUAL_CO.name().equals(subTxnType)) {
			return orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
		}
		// if within hold time, then do not update metal rate
		if (TransactionStatusEnum.HOLD.name().equals(orderDao.getSalesTxn().getStatus()) && commonTransactionService
				.holdTimeCheck(orderDao.getSalesTxn(), orderUtilService.getHoldTimeInMinutesForAb())) {
			return orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
		}

		MetalRateListDto metalRateListExisting = commonTransactionService
				.mapMetalRateJsonToDto(orderDao.getSalesTxn().getMetalRateDetails());
		MetalRateListDto metalRateListNew = commonTransactionService.getMetalRate();

		// if price has not changed, then skip price update
		if (metalRateListExisting == null || !commonTransactionService.validateMetalRate(metalRateListExisting,
				metalRateListNew, false, null, true, true)) {
			// If RATE_FREEZE is the action type, Get the Min payment value calculated for
			// Frozen Rate option.
			if (BooleanUtils.isTrue(isRateFreeze)) {
				getMinOrderPaymentValueUpdated(orderDao, isRateFreeze);
			}

			return orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
		}

		// update metal rate in sales_transaction table
		orderDao.getSalesTxn().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateListNew));

		// get Order details if exists.
		List<OrderDetailsConfigDaoExt> orderDetailsConfigList = orderDetailsConfigRepositoryExt
				.findAllByOrderItemOrder(orderDao);
		Map<OrderDetailsDaoExt, OrderDetailsConfigDaoExt> orderItemDetailsMap = new HashMap<>();
		for (OrderDetailsConfigDaoExt orderDetailsConfigDao : orderDetailsConfigList) {
			orderItemDetailsMap.put(orderDetailsConfigDao.getOrderItem(), orderDetailsConfigDao);
		}

		// item price update
		if (!CollectionUtils.isEmpty(orderItemDetailsMap)) {
			orderUtilService.updateItemPriceDetails(orderItemDetailsMap, orderDao.getSalesTxn(), isRateFreeze,
					rateFreezedCNPayment != null);

			// update order
			orderUtilService.updateOrderHeader(orderDao, null);
		}

		// update last hold time -required?

		salesTxnRepository.save(orderDao.getSalesTxn());
		orderRepository.save(orderDao);

		return orderUtilService.orderAndItemIdResponse(orderDao, creditNoteDocs);
	}

	// Method to Validate Order status for Price update
	private void checkTransactionStatusForPriceUpdate(String actionType, OrderDaoExt orderDao) {

		log.info("actiontype -{} and orderDao- {}", actionType, orderDao);
		// Update Price should be restricted for all the CLOSED status & CONFIRMED
		// orders except RATE_FREEZE action for Non-frozen orders even after Confirm.
		if (TransactionStatusEnum.closedStatusList().contains(orderDao.getSalesTxn().getStatus())
				|| ((StringUtils.isEmpty(actionType)
						|| !actionType.equalsIgnoreCase(TransactionActionTypeEnum.RATE_FREEZE.name()))
						&& orderDao.getSalesTxn().getStatus()
								.equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name()))) {
			throw new ServiceException(SalesConstants.PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS,
					SalesConstants.ERR_SALE_053);
		} else if (!StringUtils.isEmpty(actionType)
				&& actionType.equalsIgnoreCase(TransactionActionTypeEnum.RATE_FREEZE.name())
				&& (orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.name())
						&& BooleanUtils.isTrue(orderDao.getIsFrozenRate()))) {
			throw new ServiceException(
					INVALID_REQUEST + "To Freeze the order, Order should be Non-Frozen in CONFIRMED status",
					ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"To Freeze the order, Order should be Non-Frozen in CONFIRMED status"));
		}
	}

	// Method to check inventory before Hold or Confirm
	private void itemCheckBeforeHoldOrConfirm(List<OrderDetailsDaoExt> orderDetailsDaoList) {
		// check if item is on hold in another CM.
		orderDetailsDaoList.forEach(orderDetailsDao -> {

			Short totalQuantity;
			if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(orderDetailsDao.getProductGroupCode())) {
				CoinDetailsDto coinDetailsDto = commonTransactionService.getInventoryCoinDetails(
						orderDetailsDao.getItemCode(), orderDetailsDao.getInventoryWeight(),
						orderDetailsDao.getTotalQuantity());
				totalQuantity = coinDetailsDto.getTotalQuantity().shortValue();
			} else {
				InventoryItemDto inventoryItem = commonTransactionService.getInvetoryItemDetails(
						orderDetailsDao.getInventoryId(), orderDetailsDao.getInventoryWeight(),
						orderDetailsDao.getTotalQuantity());
				totalQuantity = inventoryItem.getTotalQuantity();
			}
			orderUtilService.checkIfItemIsAlreadyAdded(totalQuantity, orderDetailsDao);

		});
	}

	/**
	 * This Method will Update Inventory - Moving to RESERVE BIN and Updates Order
	 * Item Details
	 * 
	 * @param orderDao
	 * @param orderDetailsDaoList
	 */
	@Transactional
	public List<InventoryDetailsDao> updateInventoryAndOrderDetails(OrderDaoExt orderDao,
			List<OrderDetailsDaoExt> orderDetailsDaoList) {

		List<SalesItemDto> salesItemDtoList = new ArrayList<>();

		orderDetailsDaoList.forEach(orderDetailsDao -> {
			SalesItemDto salesItemDto = (SalesItemDto) MapperUtil.getDtoMapping(orderDetailsDao, SalesItemDto.class);
			PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(orderDetailsDao.getPriceDetails(),
					PriceDetailsDto.class);
			salesItemDto.setIsHallmarked(priceDetails.getItemHallmarkDetails() == null ? Boolean.FALSE
					: priceDetails.getItemHallmarkDetails().getHallmarkingCharges() != null);// if hallmark charges are
			// present, then
			// hallmark is
			// applicable
			salesItemDtoList.add(salesItemDto);
		});
		// pending - not sure about convert CM. bin group is currently given as STN or
		// PURCFA

		
		LocationCacheDto locationCacheDto=engineService.getStoreLocation(orderDao.getSalesTxn().getLocationCode());
		List<String> binGroupCodeList = SalesUtil.getBinGroupCodeBasedOnLocationCode(BooleanUtils.isTrue(locationCacheDto.getOfferDetails().getIsFOCitemssaleable()));
		

		// get inventory ids for update and Order item Details for coin update
		UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItems = commonTransactionService
				.getInvIdsAndSalesItemsForUpdate(salesItemDtoList, binGroupCodeList);

		// update Order Details for coins
		updateOrderItemDetailsForCoins(orderDetailsDaoList, updateInvItemsAndSalesItems);

		List<InventoryDetailsDao> updatedInventoryDetails = new ArrayList<>();
		// update inventory
		if (!CollectionUtils.isEmpty(updateInvItemsAndSalesItems.getUpdateInventoryDtoList())) {

			// Update Inventory by moving ordered items to RESERVE BIN
			updatedInventoryDetails = inventoryService.updateBinById(
					updateInvItemsAndSalesItems.getUpdateInventoryDtoList(), BinGroupEnum.RESERVEBIN.name(), false);

			// Update Reserved inventory Id's w.r.t ordered items
			List<OrderDetailsDaoExt> orderDetailsDaoExtList = orderDetailsRepository.findAllByOrderId(orderDao.getId());
			List<OrderDetailsDaoExt> updatedOrderDetails = new ArrayList<>();
			for (OrderDetailsDaoExt orderDetails : orderDetailsDaoExtList) {
				updatedInventoryDetails.forEach(inventoryDetails -> {
					// Get inventory unit weight to compare against ordered unit weight
					BigDecimal inventoryUnitWeight = inventoryDetails.getTotalQuantity() > 0
							? inventoryDetails.getTotalWeight().divide(
									BigDecimal.valueOf(inventoryDetails.getTotalQuantity()),
									DomainConstants.WEIGHT_SCALE, RoundingMode.HALF_UP)
							: inventoryDetails.getTotalWeight();
					// Pending: weight comparison w.r.t std weight or measures unit weight
					if (orderDetails.getItemCode().equalsIgnoreCase(inventoryDetails.getItemCode())
							&& !StringUtils.isEmpty(orderDetails.getLotNumber())
							&& orderDetails.getLotNumber().equalsIgnoreCase(inventoryDetails.getLotNumber())
							&& orderDetails.getInventoryWeight().compareTo(inventoryUnitWeight) == 0
							&& inventoryDetails.getBinGroupCode().equalsIgnoreCase(BinGroupEnum.RESERVEBIN.name())) {
						orderDetails.setInventoryId(inventoryDetails.getId());
						orderDetails.setBinCode(inventoryDetails.getBinCode());
						updatedOrderDetails.add(orderDetails);
					}
				});
			}
			orderDetailsRepository.saveAll(updatedOrderDetails);
		}
		return updatedInventoryDetails;

	}

	public void updateOrderItemDetailsForCoins(List<OrderDetailsDaoExt> orderDetailsDaoList,
			UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItems) {
		if (!CollectionUtils.isEmpty(updateInvItemsAndSalesItems.getItemDetailsListToUpdate())) {
			List<OrderDetailsDaoExt> orderDetailsToSave = new ArrayList<>();
			updateInvItemsAndSalesItems.getItemDetailsListToUpdate()
					.forEach(salesUpdateDto -> orderDetailsDaoList.forEach(orderDetailsDao -> {
						if (salesUpdateDto.getId().equals(orderDetailsDao.getId())) {
							orderDetailsDao.setBinCode(salesUpdateDto.getBinCode());
							orderDetailsDao.setLotNumber(salesUpdateDto.getLotNumber());
							orderDetailsDao.setInventoryId(salesUpdateDto.getInventoryId());
							orderDetailsDao.setItemDetails(MapperUtil.getStringFromJson(
									new JsonData("ITEM_DETAILS", salesUpdateDto.getItemInvDetails())));

							orderDetailsToSave.add(orderDetailsDao);
						}
					})

					);
			orderDetailsRepository.saveAll(orderDetailsToSave);
		}
	}

	/**
	 * Method to Validate Location configuration for AB transactions
	 * 
	 * @param cancellationCheck
	 * @param activationCheck
	 * @param activationValidityCheck
	 * @param orderDao
	 */
	private void validateLocationConfigurationOfAb(Boolean cancellationCheck, Boolean activationCheck,
			Boolean activationValidityCheck, OrderDaoExt orderDao) {
		LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = orderUtilService.getAbDetailsFromLocation();
		if (cancellationCheck) {

			if (StringUtils.isEmpty(locationAdvanceBookingDetailsDto.getCancellationAllowedforAdvanceBooking())) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023, "AB details for CancellationAllowedforAdvanceBooking");
			}
			// Check , if Cancellation of AB allowed for this location.
			if (BooleanUtils.isFalse(locationAdvanceBookingDetailsDto.getCancellationAllowedforAdvanceBooking())) {
				throw new ServiceException("Invalid request: - Cancellation of AB not allowed for this location.",
						"ERR-SALE-294", Map.of("remarks", "Cancellation of AB not allowed for this location."));
			}
		}
		if (activationCheck) {
			if (StringUtils.isEmpty(locationAdvanceBookingDetailsDto.getActivateAllowedforAdvanceBooking())) {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023, "AB details for ActivateAllowedforAdvanceBooking");
			}
			// Check , if Activation of AB allowed for this location.
			if (BooleanUtils.isFalse(locationAdvanceBookingDetailsDto.getActivateAllowedforAdvanceBooking())) {
				throw new ServiceException(INVALID_REQUEST + "Activation of AB not allowed for this location.",
						ERR_SALE_294,
						Map.of(SalesConstants.REMARKS, "Activation of AB not allowed for this location."));
			}
		}
		if (activationValidityCheck) {
			checkActivationValidityForLocation(orderDao, locationAdvanceBookingDetailsDto);
		}

	}

	// Method to check Activation validity of Suspended AB within a location
	private void checkActivationValidityForLocation(OrderDaoExt orderDao,
			LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto) {
		// Check if config exists
		if (locationAdvanceBookingDetailsDto.getValidityDaysforActivateInAdvanceBooking() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023, "AB details for ValidityDaysforActivateInAdvanceBooking");
		}
		// Suspended date should be available to check on validity days for activation
		// of same.
		if (StringUtils.isEmpty(orderDao.getSuspendedDate())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Suspended Date is not available");
		}

		// Activation allowed within valid days from suspended date.
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		if (CalendarUtils.getDayDiff(orderDao.getSuspendedDate(), businessDate) > locationAdvanceBookingDetailsDto
				.getValidityDaysforActivateInAdvanceBooking()) {
			throw new ServiceException("Invalid request: - Validity for Activation of suspended AB had Expired.",
					"ERR-SALE-294", Map.of("remarks", "Validity for Activation of suspended AB had Expired."));
		}
	}

	/**
	 * Method to generate Credit note for combined payments
	 * 
	 */
	@Transactional
	public Map<String, Integer> generateCnForCombinedPayments(SalesTxnDaoExt salesTxn,
			Map<String, Integer> creditNoteIdAndDocs,
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap) {

		List<PaymentCodeAndGroup> removePaymentCodes = new ArrayList<>();
		BigDecimal totalCombinationAmt = BigDecimal.ZERO;
		BigDecimal totalCombinationCashCollected = BigDecimal.ZERO;
		// Need individual payment list to update Credit note id
		List<PaymentDetailsDaoExt> combinedPayments = new ArrayList<>();
		List<PaymentDetailsDaoExt> combinedPaymentsByMode = new ArrayList<>();
		Map<String, BigDecimal> totalAmountPaymentByMode = new HashMap<String, BigDecimal>();
		BigDecimal totalOtherPaymentModeCollected = BigDecimal.ZERO;
		CNPaymentDetailsDto cnPaymentDetails = new CNPaymentDetailsDto();
		
		for (Entry<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> entry : paymentsMap.entrySet()) {
			PaymentCodeAndGroup paymentCG = entry.getKey();
			List<PaymentDetailsDaoExt> payments = entry.getValue();
			if (PAYMENT_CODE_COMBINATION_IN_CN.contains(paymentCG.getPaymentCode())
					|| PAYMENT_GRP_COMBINATION_IN_CN.contains(paymentCG.getPaymentGroup())) {

				// add allowed in this one, remove from payemtsMap
				removePaymentCodes.add(paymentCG);
				BigDecimal amtCodeGrpWise = paymentUtil.getTotalAmtFromPaymentDetails(payments);
				BigDecimal cashCollectedCodeGrpWise = paymentUtil.getTotalCashCollectedFromPaymentDetails(payments);
				totalCombinationAmt = totalCombinationAmt.add(amtCodeGrpWise);
				totalCombinationCashCollected = totalCombinationCashCollected.add(cashCollectedCodeGrpWise);
				combinedPayments.addAll(payments);
				cnPaymentDetails = paymentUtil.getPaymentDetailsForCNGeneration(payments, cnPaymentDetails);
				log.info("Payment Id's - {}", combinedPayments);
			}
//			if (PAYMENT_CODE_BY_MODE_COMBINATION_IN_CN.contains(paymentCG.getPaymentCode())) {
//				removePaymentCodes.add(paymentCG);
//
//				BigDecimal otherModePaymentCodeWise = paymentUtil.getTotalOtherModeFromPaymentDetails(payments);
//				totalOtherPaymentModeCollected = totalOtherPaymentModeCollected.add(otherModePaymentCodeWise);
//				totalAmountPaymentByMode.put(paymentCG.getPaymentCode(), totalOtherPaymentModeCollected);
//				combinedPaymentsByMode.addAll(payments);
//			}

		}

		// remove which are already processed
		removePaymentCodes.forEach(paymentsMap::remove);
		log.info("removePayment check-----{}"+paymentsMap);

//		// CN for AIRPAY/RAZORPAY
//		if (totalAmountPaymentByMode.size() > 0) {
//			totalAmountPaymentByMode.entrySet().forEach(paymentMode -> {
//				if (paymentMode.getValue().signum() > 0) {
//					List<CreditNoteResponse> cnResponseList = createCreditNote(salesTxn, paymentMode.getValue(),
//							paymentMode.getValue(), null, null, CNType.ADV.name(), null, null,null);
//
//					log.info("Credit Note Response - {}", cnResponseList);
//					creditNoteIdAndDocs.putAll(cnResponseList.stream()
//							.collect(Collectors.toMap(CreditNoteResponse::getId, CreditNoteResponse::getDocNo)));
//					updatePaymentsWithCreditNote(combinedPaymentsByMode, cnResponseList.get(0).getId());
//				}
//			});
//		}


		if (totalCombinationAmt.compareTo(BigDecimal.valueOf(0)) > 0) {

			List<CreditNoteResponse> cnResponseList = createCreditNote(salesTxn, totalCombinationAmt,
					totalCombinationCashCollected,cnPaymentDetails, null, CNType.ADV.name(), null, null,null);

			log.info("Credit Note Response - {}", cnResponseList);

			creditNoteIdAndDocs.putAll(cnResponseList.stream()
					.collect(Collectors.toMap(CreditNoteResponse::getId, CreditNoteResponse::getDocNo)));

			updatePaymentsWithCreditNote(combinedPayments, cnResponseList.get(0).getId());

		}

		return creditNoteIdAndDocs;

	}

	/**
	 * Method to generate Credit Note for Non-Combined payments
	 * 
	 * @param salesTxn
	 * @param creditNoteDocs
	 * @param paymentsMap
	 */
	@Transactional
	public Map<String, Integer> generateCnForIndividualPayments(SalesTxnDaoExt salesTxn,
			Map<String, Integer> creditNoteIdAndDocs,
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap) {

		for (Entry<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> entry : paymentsMap.entrySet()) {
			List<PaymentDetailsDaoExt> payments = entry.getValue();
			CreditNoteDaoExt refCreditNote = null;
			GhsPaymentOtherDetailsDto ghsPaymentOtherDetailsDto=null;
			for (PaymentDetailsDaoExt payment : payments) {
				Map<String, String> paymentCodes = new HashMap<>();
				CNPaymentDetailsDto cnPaymentDetails = new CNPaymentDetailsDto();
				if (payment.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CHEQUE.getPaymentcode())) {
					cnPaymentDetails.setCheque(true);
					cnPaymentDetails.setChequeDate(payment.getInstrumentDate());
					cnPaymentDetails.setInstrumentNumber(payment.getInstrumentNo());
					cnPaymentDetails.setBankName(payment.getBankName());}

				paymentCodes.put(payment.getPaymentCode(), payment.getInstrumentType());
				cnPaymentDetails.setPaymentCodes(paymentCodes);

				String frozenDetails = null;
				// get frozen details if exists for the CN
				if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(payment.getPaymentCode())) {
					JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
					CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
							CreditNotePaymentOtherDetailsDto.class);
					if (cnOtherDetails.getFrozenRateDetails() != null) {
						frozenDetails = MapperUtil.getStringFromJson(new JsonData(SalesConstants.FROZEN_RATE_DETAILS,
								cnOtherDetails.getFrozenRateDetails()));
					}
					if (payment.getReference3() != null) {

						refCreditNote = creditNoteRepository.findOneById(payment.getReference3());
					}
				} else if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(payment.getPaymentCode())) {
					// reuse GHS CN (if fully used) as per UAT 3197.
					JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
					ghsPaymentOtherDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
							GhsPaymentOtherDetailsDto.class);
					refCreditNote = creditNoteRepository.findOneById(ghsPaymentOtherDetailsDto.getCreditNoteId());
				}

				// Generate Credit note for each other payments

				if ((PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(payment.getPaymentCode())
						|| PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(payment.getPaymentCode()))
						&& refCreditNote != null && refCreditNote.getAmount().compareTo(payment.getAmount()) == 0) {
					CreditNoteDaoExt updateCreditNote = creditNoteRepository.findOneById(refCreditNote.getId());
					updateCreditNote.setStatus(CNStatus.OPEN.name());
					updateCreditNote.setUtilisedAmount(BigDecimal.ZERO);
					updateCreditNote.setRedeemDate(null);
					updateCreditNote.setLinkedTxn(salesTxn);
					creditNoteRepository.save(updateCreditNote);
					
					creditNoteIdAndDocs.put(updateCreditNote.getId(), updateCreditNote.getDocNo());
					log.info("cn number",updateCreditNote.getDocNo());

					updatePaymentsWithCreditNote(List.of(payment), updateCreditNote.getId());

				} else {
					String cnType = CNType.ADV.name();
					JsonData discountDetails = null;

					if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(payment.getPaymentCode())) {
						cnType = CNType.GHS.name();
						discountDetails = setGhsDiscountDetailsToCN(payment.getOtherDetails(), payment.getReference3());
					} else if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(payment.getPaymentCode())
							&& refCreditNote != null) {
						cnType = refCreditNote.getCreditNoteType();
					}else if (PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode().equals(payment.getPaymentCode())) {
						cnType = CNType.EVOUCHER.name();
						
					}
					
					if(ghsPaymentOtherDetailsDto != null && ghsPaymentOtherDetailsDto.getNewCNNumber() != null) {
					CreditNoteDaoExt partialCN = creditNoteRepository.findByDocNoAndFiscalYearAndLocationCode(ghsPaymentOtherDetailsDto.getNewCNNumber(),payment.getSalesTxnDao().getFiscalYear(),CommonUtil.getLocationCode());
					if(partialCN != null && partialCN.getId() != null && partialCN.getDocNo() != null)
					creditNoteIdAndDocs.put(partialCN.getId(), partialCN.getDocNo());
					}


					List<CreditNoteResponse> cnResponseList = createCreditNote(salesTxn, payment.getAmount(),
							payment.getCashCollected(), cnPaymentDetails, frozenDetails, cnType, refCreditNote,
							discountDetails,payment);

					if (!StringUtils.isEmpty(cnResponseList)) {
						CreditNoteDaoExt creditNoteDao = new CreditNoteDaoExt();
						creditNoteDao.setId(cnResponseList.get(0).getId());
						creditNoteIdAndDocs.putAll(cnResponseList.stream()
								.collect(Collectors.toMap(CreditNoteResponse::getId, CreditNoteResponse::getDocNo)));
						if (discountDetails != null) {
							creditNoteDao = creditNoteRepository.findByIdAndLocationCode(cnResponseList.get(0).getId(),
									CommonUtil.getLocationCode());
							AccountDetailsDaoExt accountDetails = new AccountDetailsDaoExt();

							accountDetails.setId(JsonUtils.getValueFromJson(
									MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class).getData(),
									"accountId", String.class));
							// set account id
							creditNoteDao.setAccountDetailsDao(accountDetails);
							creditNoteRepository.save(creditNoteDao);
						}
					}

					updatePaymentsWithCreditNote(List.of(payment), cnResponseList.get(0).getId());
					
				}
			}

		}
		 log.info("creditNotes for ghs",creditNoteIdAndDocs.values());
		return creditNoteIdAndDocs;
	}

	/**
	 * Method to Create credit Note
	 * 
	 * @param salesTxn
	 * @param refCreditNote
	 */
	@Transactional
	public List<CreditNoteResponse> createCreditNote(SalesTxnDaoExt salesTxn, BigDecimal amount,
			BigDecimal cashCollected, CNPaymentDetailsDto cnPaymentDetails, String frozenDetails, String cnType,
			CreditNoteDaoExt refCreditNote, JsonData discountDetails, PaymentDetailsDaoExt payment) {

		CreditNoteCreateDto createCN = new CreditNoteCreateDto();
		createCN.setCustomerId(salesTxn.getCustomerId());
		createCN.setSalesTxn(salesTxn);
		createCN.setIsLinkTxn(true);
		createCN.setRefDocNo(salesTxn.getDocNo());
		createCN.setRefDocType(salesTxn.getTxnType());
		createCN.setRefFiscalYear(salesTxn.getFiscalYear());
		CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();
		creditNoteIndvCreateDto.setCreditNoteType(cnType);
		creditNoteIndvCreateDto.setAmount(amount);
		creditNoteIndvCreateDto.setCashCollected(cashCollected);
		creditNoteIndvCreateDto.setDiscountDetails(discountDetails);

		if (!StringUtils.isEmpty(cnPaymentDetails)) {

			cnPaymentDetails.setIsGeneratedForUnipayDeletion(
					cnPaymentDetails.getPaymentCodes().containsKey(PaymentCodeEnum.UNIPAY.getPaymentcode()));
			cnPaymentDetails
					.setCheque(cnPaymentDetails.getPaymentCodes().containsKey(PaymentCodeEnum.CHEQUE.getPaymentcode()));
			cnPaymentDetails
					.setRTGS(cnPaymentDetails.getPaymentCodes().containsKey(PaymentCodeEnum.RTGS.getPaymentcode()));
			cnPaymentDetails
			.setUPI(cnPaymentDetails.getPaymentCodes().containsKey(PaymentCodeEnum.UPI.getPaymentcode()));

			if(payment != null )
			{
				if(payment.getOtherDetails()!=null) {
					JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
					Object response = JsonUtils.getValueFromJson(jsonData.getData(), "response", Object.class);
					cnPaymentDetails.setUnipayID(JsonUtils.getValueFromJson(response, "utid", String.class));
					cnPaymentDetails.setHostname(payment.getHostName());
					cnPaymentDetails.setPaymentId(payment.getId());
					cnPaymentDetails.setBankInvoiceNo(JsonUtils.getValueFromJson(response, "bankInvoiceNumber", String.class));
					cnPaymentDetails.setTxnDate(JsonUtils.getValueFromJson(response, "txnDate", String.class));
					cnPaymentDetails.setBankName(JsonUtils.getValueFromJson(response, "acquirerBank", String.class));
				}
				
			}
			JsonData cnPaymentDetailsJson = new JsonData("CN_PAYMENT_DETAILS", cnPaymentDetails);
			creditNoteIndvCreateDto.setPaymentDetails(cnPaymentDetailsJson);
		}
		
		if(payment!=null && payment.getPaymentCode().equals(PaymentCodeEnum.UNIPAY.name())) {
			creditNoteIndvCreateDto.setIsUnipay(true);
		}
		creditNoteIndvCreateDto.setFrozenRateDetails(frozenDetails);
		createCN.setCNIndividual(List.of(creditNoteIndvCreateDto));
		return creditNoteService.createNewCreditNote(createCN);
	}

	/**
	 * Method to Generate new CN's for Additional Payment.
	 * 
	 * @param orderDao
	 */
	@Transactional
	public void addPayment(OrderDaoExt orderDao, List<Integer> creditNoteDocs) {

		// Generate CN for all types of additional payment made
		creditNoteDocs.addAll(generateCreditNoteForNewPaymentsOfOrder(orderDao, false));

		// confirm GHS payments (if Exists)
		List<PaymentDetailsDaoExt> ghsPaymentList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(orderDao.getSalesTxn().getId(),
						PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null,
						orderDao.getSalesTxn().getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));
		if (!CollectionUtil.isEmpty(ghsPaymentList)) {
			ghsPaymentList = ghsPaymentList.stream()
					.filter(ghsPayment -> BooleanUtils.isTrue(ghsPayment.getIsEditable())).collect(Collectors.toList());
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

				commonTransactionService.finalConfirmForGhsPayments(orderDao.getSalesTxn(), ghsPaymentList,
						ghsPaymentIdAndCreditNoteMap, ghsPaymentOtherDetalisMap);
				paymentDetailsRepository.saveAll(ghsPaymentList);
				creditNoteRepository.saveAll(ghsPaymentIdAndCreditNoteMap.values());// will save reference details
			}
		}

		// On Order Freeze, Update is_editable flag to false for all payments made
		updatePaymentDetails(orderDao);

	}

	// Method to list Orders based on filter parameters
	@Override
	public PagedRestResponse<List<OrderTransactionDetailsDto>> listOrders(String txnType, String actionType,
			Integer docNo, Short fiscalYear, String mobileNumber, Pageable pageable) {
		List<String> statusList = new ArrayList<>(List.of(""));
		List<String> excludeStatusList = new ArrayList<>(List.of(""));
		Boolean isFrozenRate = null;
		Boolean isBestRate = null;

		if (!StringUtils.isEmpty(actionType)) {
			if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.RATE_FREEZE.name())) {
				// Only Non-Frozen order allowed for Rate Freeze
				statusList = List.of(TransactionStatusEnum.CONFIRMED.name());
				isFrozenRate = false;
				isBestRate = false;
			} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.CANCEL.name())) {
				// Orders with CONFIRMED status will only be allowed to Cancel
				// Other status can also be Cancelled. BA has to confirm the status list
				statusList = List.of(TransactionStatusEnum.CONFIRMED.name() , TransactionStatusEnum.PARTIAL_INVOICE.name());
			} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.ACTIVATE.name())) {
				// Only SUSPENDED orders are allowed to Activate
				statusList = List.of(TransactionStatusEnum.SUSPENDED.name());
			} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.VIEW_ORDERS.name())) {
				excludeStatusList = List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.HOLD.name(),
						TransactionStatusEnum.DELETED.name());
			} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.ADD_PAYMENT.name())) {
				// Orders with CONFIRMED status will only be allowed to Add payments
				statusList = List.of(TransactionStatusEnum.CONFIRMED.name());
			}
		}

		OrderSearchFilterDto orderFilterDto = new OrderSearchFilterDto(statusList, excludeStatusList, isFrozenRate,
				isBestRate, CommonUtil.getLocationCode());

		mobileNumber=CryptoUtil.encrypt(mobileNumber,MOBILE_NO);
		
		Page<OrderTransactionDetailsDto> orderList = orderRepository.listOrders(txnType, docNo, fiscalYear,
				mobileNumber, orderFilterDto, pageable);
       
      	for(int i=0; i < orderList.getSize();i++){
      		try {
      			orderList.getContent().get(i).setMobileNumber(CryptoUtil.decrypt(orderList.getContent().get(i).getMobileNumber(),MOBILE_NO));
				orderList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(orderList.getContent().get(i).getCustomerName(),CUSTOMER_NAME));
			} catch (Exception e) {
				e.printStackTrace();
			}   
      	}
		
		return new PagedRestResponse<>(orderList.getContent(), orderList);
	}

	// ======================================= Data-Sync Impl
	// =========================================
	@Override
	public OrderAndItemIdResponseDto partialUpdateOrder(String id, String transactionType, String subTxnType,
			String actionType, OrderPatchUpdateDto orderPatchUpdateDto, Boolean ackReqRejection) {
		PublishResponse response = orderService.partialUpdateOrderTransactional(id, transactionType, subTxnType,
				actionType, orderPatchUpdateDto, ackReqRejection);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<OrderAndItemIdResponseDto>() {
		});
	}

	@Override
	public OrderResponseDto updateOrder(String id, String transactionType, String subTxnType,
			OrderUpdateDto orderUpdateDto, String status) {

		try {
			boolean isValid = commonTransactionService.validateCustomerFields(orderUpdateDto.getCustomerId());
			if (!isValid) {
				throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING,
						SalesConstants.ERR_CUST_001, "Mandatory fields of customer details are missing");
			}

			PublishResponse orderPublishResponse = orderService.updateOrderTransactional(id, transactionType,
					subTxnType, orderUpdateDto, status);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				orderPublishResponse.getSyncStagingDtoList()
						.forEach(syncDto -> salesSyncDataService.publishSalesMessagesToQueue(syncDto));

			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(orderPublishResponse.getApiResponse(), new TypeReference<OrderResponseDto>() {
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

	public SyncStagingDto syncConfigDetails(OrderDaoExt orderDao) {
		if (!AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			return null;
		}

		SyncStagingDto orderConfigStagingDto = new SyncStagingDto();

		List<OrderDetailsConfigDaoExt> orderDetailsConfigList = orderDetailsConfigRepositoryExt
				.findAllByOrderItemOrder(orderDao);
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());

		if (!CollectionUtil.isEmpty(orderDetailsConfigList)) {
			List<OrderDetailsConfigSyncDtoExt> dtoExtList = new ArrayList<>();
			orderDetailsConfigList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new OrderDetailsConfigSyncDtoExt(daoExt));
			});
			orderDetailsConfigRepositoryExt.saveAll(orderDetailsConfigList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 0));
		}

		MessageRequest txnConfigMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
				SalesOperationCode.SALES_ORDER_CONFIG, destinations, MessageType.FIFO.toString(),
				DestinationType.SELECTIVE.toString());
		orderConfigStagingDto.setMessageRequest(txnConfigMsgRequest);
		String cashMemoMsgRqst = MapperUtil.getJsonString(txnConfigMsgRequest);
		SyncStaging txnConfigSyncStaging = new SyncStaging();
		txnConfigSyncStaging.setMessage(cashMemoMsgRqst);
		txnConfigSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		txnConfigSyncStaging = saleSyncStagingRepository.save(txnConfigSyncStaging);
		orderConfigStagingDto.setId(txnConfigSyncStaging.getId());

		return orderConfigStagingDto;

	}

	public SyncStagingDto syncStagging(SalesTxnDaoExt salesTxnDao, OrderDaoExt orderDao,
			List<OrderDetailsDaoExt> orderDetailsDaoList, List<InventoryDetailsDao> updatedInventoryDetails,
			List<CustomerDocumentsDao> customerDocList, String operation) {
		List<PaymentDetailsDaoExt> paymentList = null;
		List<CreditNoteDaoExt> creditNoteList = creditNoteRepository.findBySalesTxnId(salesTxnDao.getId());
		if (!SalesOperationCode.ORDER_APPROVAL_REQ.equals(operation)) {
			paymentList = paymentDetailsRepository.findBySalesTxnDaoId(salesTxnDao.getId());
			// add to customer payment
			customerPaymentService.addCustomerPayment(salesTxnDao, List.of(), paymentList, orderDao.getFinalValue(),
					orderDao.getRoundingVariance(), false, BigDecimal.valueOf(1));
			// if txn status is 'CONFIRMED' update 'isEditable' to false for all payments in
			// the txn.
			if (TransactionStatusEnum.CONFIRMED.name().equals(salesTxnDao.getStatus())
					&& !CollectionUtil.isEmpty(paymentList)) {
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
		}
		SyncStagingDto orderStagingDto = new SyncStagingDto();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {

			List<CustomerPaymentDaoExt> customerPaymentList = new ArrayList<>();
			List<SyncData> syncDataList = new ArrayList<>();
			List<String> destinations = new ArrayList<>();
			destinations.add("EPOSS");
			salesTxnDao.setSrcSyncId(salesTxnDao.getSrcSyncId() + 1);
			salesTxnDao = salesTxnRepository.save(salesTxnDao);
			syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxnDao,null), 0));
			if (orderDao != null) {
				orderDao.setSrcSyncId(orderDao.getSrcSyncId() + 1);
				orderDao = orderRepository.save(orderDao);
				syncDataList.add(DataSyncUtil.createSyncData(new OrderSyncDtoExt(orderDao), 1));
			}
			CustomerTxnDaoExt customer = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxnDao.getId());

			customer.setMobileNumber(CryptoUtil.decrypt(customer.getMobileNumber(),MOBILE_NO,false));
			customer.setEmailId(CryptoUtil.decrypt(customer.getEmailId(),EMAIL_ID,false));
			customer.setCustomerName(CryptoUtil.decrypt(customer.getCustomerName(),CUSTOMER_NAME,false));
			customer.setCustTaxNo(CryptoUtil.decrypt(customer.getCustTaxNo(),CUST_TAX_NO,false));
			customer.setCustTaxNoOld(CryptoUtil.decrypt(customer.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
			customer.setInstiTaxNo(CryptoUtil.decrypt(customer.getInstiTaxNo(),INSTI_TAX_NO,false));
			customer.setPassportId(CryptoUtil.decrypt(customer.getPassportId(),PASSPORT_ID,false));
			
			if (orderDetailsDaoList != null && !orderDetailsDaoList.isEmpty()) {
				List<OrderDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
				orderDetailsDaoList.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new OrderDetailsSyncDtoExt(daoExt));
				});
				orderDetailsRepository.saveAll(orderDetailsDaoList);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 2));
			}
			if (paymentList != null && !paymentList.isEmpty()) {
				List<PaymentDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
				List<String> paymentIds = new ArrayList<>();
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
						// if payment done by CN
						Optional<CreditNoteDaoExt> credit = creditNoteRepository.findById(daoExt.getReference3());
						credit.ifPresent(dbCn -> {
							if (creditNoteList.stream().map(CreditNoteDaoExt::getId)
									.noneMatch(dbCn.getId()::equalsIgnoreCase)) {
								creditNoteList.add(dbCn);
							}
						});

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

					}
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new PaymentDetailsSyncDtoExt(daoExt));
				});
				paymentDetailsRepository.saveAll(paymentList);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 3));
				customerPaymentList = customerPaymentRepo.findAllByPaymentDetailsDaoIdIn(paymentIds);
			}
			if (creditNoteList != null && !creditNoteList.isEmpty()) {
				List<CreditNoteSyncDtoExt> dtoExtList = new ArrayList<>();
				creditNoteList.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);

					dtoExtList.add(new CreditNoteSyncDtoExt(daoExt));
				});
				creditNoteRepository.saveAll(creditNoteList);
				dtoExtList.sort(Comparator.comparing(CreditNoteSyncDtoExt::getFiscalYear)
						.thenComparing(CreditNoteSyncDtoExt::getDocNo));
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 4));
			}
			if (customer != null) {
				customer.setSrcSyncId(customer.getSrcSyncId() + 1);
				 customer.setEmailId(CryptoUtil.encrypt(customer.getEmailId() , EMAIL_ID));
	             customer.setMobileNumber(CryptoUtil.encrypt(customer.getMobileNumber(), MOBILE_NO));
	             customer.setInstiTaxNo(CryptoUtil.encrypt( customer.getInstiTaxNo() , INSTI_TAX_NO ));    
	             customer.setPassportId(CryptoUtil.encrypt(customer.getPassportId(), PASSPORT_ID ));
	             customer.setCustTaxNo(CryptoUtil.encrypt(customer.getCustTaxNo(),  CUST_TAX_NO));
	             customer.setCustomerName(CryptoUtil.encrypt(customer.getCustomerName(), CUSTOMER_NAME ));	  
	             customer.setCustTaxNoOld(CryptoUtil.encrypt(customer.getCustTaxNoOld(),  CUST_TAX_NO_OLD ));	
	             customer.setIsEncrypted(Boolean.TRUE);
	             customer = cusTxnDetailsRepository.save(customer);
				syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customer), 5));
			}
			if (updatedInventoryDetails != null && !updatedInventoryDetails.isEmpty()) {
				syncDataList.add(DataSyncUtil.createSyncData(updatedInventoryDetails, 6));
			}
			if (customerPaymentList != null && !customerPaymentList.isEmpty()) {
				List<CustomerPaymentSyncDtoExt> synDtoExtList = new ArrayList<>();
				customerPaymentList.forEach(customerpayemnt -> {
					customerpayemnt.setSrcSyncId(customerpayemnt.getDestSyncId() + 1);
					synDtoExtList.add(new CustomerPaymentSyncDtoExt(customerpayemnt));
				});
				syncDataList.add(DataSyncUtil.createSyncData(synDtoExtList, 7));
				customerPaymentRepo.saveAll(customerPaymentList);
			}
			if (customerDocList != null && !customerDocList.isEmpty()) {
				customerDocList.forEach(doc -> doc.setSrcSyncId(doc.getSrcSyncId() + 1));
				customerDocList = customerDocRepo.saveAll(customerDocList);
				List<CustomerDocumentSyncDto> customerDocSync = customerDocList.stream()
						.map(CustomerDocumentSyncDto::new).collect(Collectors.toList());
				syncDataList.add(DataSyncUtil.createSyncData(customerDocSync, 8));
			}
			MessageRequest orderMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			orderStagingDto.setMessageRequest(orderMsgRequest);
			String orderMsgRqst = MapperUtil.getJsonString(orderMsgRequest);
			SyncStaging orderSyncStaging = new SyncStaging();
			orderSyncStaging.setMessage(orderMsgRqst);
			orderSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			orderSyncStaging = saleSyncStagingRepository.save(orderSyncStaging);
			orderStagingDto.setId(orderSyncStaging.getId());
		}
		return orderStagingDto;
	}

	/**
	 * Method to generate combined Credit note for specific payments
	 * 
	 */
	@Transactional
	public Map<String, Integer> generateCombinedCnForSpecificPayments(SalesTxnDaoExt salesTxn,
			Map<String, Integer> creditNoteIdAndDocs,
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap) {

		List<PaymentCodeAndGroup> removePaymentCodes = new ArrayList<>();

		for (Entry<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> entry : paymentsMap.entrySet()) {
			PaymentCodeAndGroup paymentCG = entry.getKey();
			List<PaymentDetailsDaoExt> payments = entry.getValue();
			BigDecimal totalCombinationAmt = BigDecimal.ZERO;
			BigDecimal totalCombinationCashCollected = BigDecimal.ZERO;
			CNPaymentDetailsDto cnPaymentDetails = new CNPaymentDetailsDto();
			// Need individual payment list to update Credit note id
			List<PaymentDetailsDaoExt> combinedPayments = new ArrayList<>();
			if (SPECIFIC_PAYMENT_GRP_COMBINATION_IN_CN.contains(paymentCG.getPaymentGroup())) {

				// add allowed in this one, remove from payemtsMap
				removePaymentCodes.add(paymentCG);
				BigDecimal amtCodeGrpWise = paymentUtil.getTotalAmtFromPaymentDetails(payments);
				BigDecimal cashCollectedCodeGrpWise = paymentUtil.getTotalCashCollectedFromPaymentDetails(payments);
				totalCombinationAmt = totalCombinationAmt.add(amtCodeGrpWise);
				totalCombinationCashCollected = totalCombinationCashCollected.add(cashCollectedCodeGrpWise);
				
				combinedPayments.addAll(payments);
				cnPaymentDetails = paymentUtil.getPaymentDetailsForCNGeneration(payments, cnPaymentDetails);
				log.info("Payment Id's - {}", combinedPayments);

				if (totalCombinationAmt.compareTo(BigDecimal.valueOf(0)) > 0) {

					List<CreditNoteResponse> cnResponseList = createCreditNote(salesTxn, totalCombinationAmt,
							totalCombinationCashCollected, cnPaymentDetails, null, CNType.ADV.name(), null, null,null);
					log.info("Credit Note Response - {}", cnResponseList);

					creditNoteIdAndDocs.putAll(cnResponseList.stream()
							.collect(Collectors.toMap(CreditNoteResponse::getId, CreditNoteResponse::getDocNo)));

					updatePaymentsWithCreditNote(combinedPayments, cnResponseList.get(0).getId());
				}
			}
		}

		// remove which are already processed
		removePaymentCodes.forEach(paymentsMap::remove);

		return creditNoteIdAndDocs;

	}

	// Method to update Order payments with Credit Note generated
	public void updatePaymentsWithCreditNote(List<PaymentDetailsDaoExt> combinedPayments, String creditNoteId) {
		Optional<CreditNoteDaoExt> creditNoteDao = creditNoteRepository.findById(creditNoteId);

		if (creditNoteDao.isPresent()) {
			for (PaymentDetailsDaoExt paymentDetails : combinedPayments) {

				paymentDetails.setCreditNoteDao(creditNoteDao.get());
			}

			paymentDetailsRepository.saveAll(combinedPayments);
		}
	}

	@Transactional
	public void getMinOrderPaymentValueUpdated(OrderDaoExt orderDao, Boolean isRateFreeze) {
		List<OrderDetailsDaoExt> orderDetailsDaoList = orderDetailsRepository.findAllByOrderId(orderDao.getId());
		if (!CollectionUtils.isEmpty(orderDetailsDaoList)) {
			for (OrderDetailsDaoExt orderDetailsDao : orderDetailsDaoList) {
				orderUtilService.calculateMinOrderValue(orderDetailsDao, orderDao.getSalesTxn().getTxnType(),
						isRateFreeze);
			}
			orderDetailsRepository.saveAll(orderDetailsDaoList);
			orderUtilService.updateTotalsOfOrderHeader(orderDao, orderDetailsDaoList);
			orderRepository.save(orderDao);
		}
	}

	// Method to acknowledge Cancellation request
	public void acknowledgeCancelRequest(OrderDaoExt orderDao) {
		// Order should be in CANCELLATION_PENDING status to acknowledge Cancellation
		// Request
		if (!orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.CANCELLATION_PENDING.name())) {
			throw new ServiceException(INVALID_REQUEST + SalesConstants.PLEASE_CHECK_THE_STATUS, ERR_SALE_294,
					Map.of(SalesConstants.REMARKS,
							"Order should be in CANCELLATION_PENDING status to acknowledge Cancellation Request"));

		}

		OrderCancelDetails orderCancelDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(orderDao.getCancellationDetails()), OrderCancelDetails.class);

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = getWorkFlowDetails(
				WorkflowTypeEnum.CANCEL_ADVANCE_BOOKING.name(), orderCancelDetails.getProcessId());
		if (!StringUtils.isEmpty(workflowProcessGetResponseDto.getApprovalStatus()) && workflowProcessGetResponseDto
				.getApprovalStatus().equalsIgnoreCase(WorkflowProcessStatusEnum.REJECTED.name())) {
			// Update back sales txn to previous status
			String currentStatus = orderDao.getSalesTxn().getStatus();
			orderDao.getSalesTxn().setStatus(orderDao.getSalesTxn().getPreviousStatus());
			orderDao.getSalesTxn().setPreviousStatus(currentStatus);

			// Close the request once acknowledged
			callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + orderCancelDetails.getProcessId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.CANCEL_ADVANCE_BOOKING.name()), null);
		} else {
			throw new ServiceException(INVALID_REQUEST + SalesConstants.PLEASE_CHECK_THE_STATUS, ERR_SALE_294,
					Map.of(SalesConstants.REMARKS,
							"Approval request should be in Rejected status to acknowledge Cancellation Request"));
		}
	}

	// Method to acknowledge Activation request
	public void acknowledgeActivationRequest(OrderDaoExt orderDao) {
		// Order should be in ACTIVATION_PENDING status to acknowledge Activation
		// Request
		if (!orderDao.getSalesTxn().getStatus().equalsIgnoreCase(TransactionStatusEnum.ACTIVATION_PENDING.name())) {
			throw new ServiceException(INVALID_REQUEST + SalesConstants.PLEASE_CHECK_THE_STATUS, ERR_SALE_294,
					Map.of(SalesConstants.REMARKS,
							"Order should be in ACTIVATION_PENDING status to acknowledge Activation Request"));

		}

		OrderActivationDetails orderActivationDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(orderDao.getActivationDetails()), OrderActivationDetails.class);

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = getWorkFlowDetails(
				WorkflowTypeEnum.ACTIVATE_ADVANCE_BOOKING.name(), orderActivationDetails.getProcessId());
		if (!StringUtils.isEmpty(workflowProcessGetResponseDto.getApprovalStatus()) && workflowProcessGetResponseDto
				.getApprovalStatus().equalsIgnoreCase(WorkflowProcessStatusEnum.REJECTED.name())) {
			// Update back sales txn to previous status
			String currentStatus = orderDao.getSalesTxn().getStatus();
			orderDao.getSalesTxn().setStatus(orderDao.getSalesTxn().getPreviousStatus());
			orderDao.getSalesTxn().setPreviousStatus(currentStatus);

			// Close the request once acknowledged
			callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + orderActivationDetails.getProcessId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.ACTIVATE_ADVANCE_BOOKING.name()), null);
		} else {
			throw new ServiceException(INVALID_REQUEST + SalesConstants.PLEASE_CHECK_THE_STATUS, ERR_SALE_294,
					Map.of(SalesConstants.REMARKS,
							"Approval request should be in Rejected status to acknowledge Activation Request"));
		}
	}

	private JsonData setGhsDiscountDetailsToCN(String otherDetails, String schemeType) {
		GhsPaymentOtherDetailsDto ghsOtherDetailsDto = MapperUtil.mapObjToClass(
				MapperUtil.mapObjToClass(otherDetails, JsonData.class).getData(), GhsPaymentOtherDetailsDto.class);
		// if no discount is present, then ignore
		if (!paymentUtil.isGhsDiscountPresent(ghsOtherDetailsDto.getBonus(), ghsOtherDetailsDto.getDiscountMcPct(),
				ghsOtherDetailsDto.getDiscountUcpPct())) {
			return null;
		}

		GhsAccountDiscountDetailsDto ghsAccountDiscountDetailsDto = new GhsAccountDiscountDetailsDto();
		ghsAccountDiscountDetailsDto.setDiscountValue(ghsOtherDetailsDto.getBonus());
		ghsAccountDiscountDetailsDto.setDiscountId(ghsOtherDetailsDto.getDiscountId());
		ghsAccountDiscountDetailsDto.setDiscountCode(ghsOtherDetailsDto.getDiscountCode());
		ghsAccountDiscountDetailsDto.setDiscountType(ghsOtherDetailsDto.getDiscountType());
		// product group list
		ghsAccountDiscountDetailsDto
				.setProductGroupCodesRestricted(ghsOtherDetailsDto.getProductGroupCodesRestricted());
		ghsAccountDiscountDetailsDto.setDiscountMcPct(ghsOtherDetailsDto.getDiscountMcPct());
		ghsAccountDiscountDetailsDto.setDiscountUcpPct(ghsOtherDetailsDto.getDiscountUcpPct());
		ghsAccountDiscountDetailsDto.setSchemeType(schemeType);
		ghsAccountDiscountDetailsDto.setSchemeCode(ghsOtherDetailsDto.getSchemeCode());
		Map<String, Object> ghsAccountDiscountObj = new HashMap<>();
		ghsAccountDiscountObj.put("ghsAccountDiscount", ghsAccountDiscountDetailsDto);

		return new JsonData("CN_DISCOUNT_DETAILS", ghsAccountDiscountObj);
	}

	// ********************************CUSTOMER ORDER SPECIFIC
	// METHODS***********************************//
	/**
	 * This Method is to Open CustomerOrder.
	 * 
	 * @param transactionCreateDto
	 * @param transactionType
	 * @param subTxnType
	 * @return
	 */
	@Transactional
	public TransactionResponseDto openCustomerOrder(TransactionCreateDto transactionCreateDto, String transactionType,
			String subTxnType) {

		String locationCode = null;
		if (CommonUtil.isAStoreUser()) {
			locationCode = CommonUtil.getLocationCode();
		}

		log.info("Open Customer Order :- {} {} {}", transactionCreateDto, transactionType, subTxnType);

		TransactionResponseDto transactionResponseDto = new TransactionResponseDto();

		List<CustomerOrderDetailsDto> listOfCombinedCODao = new ArrayList<>();

		List<CustomerOrderDetailsDto> listOfSelectedCODto = new ArrayList<>();

		List<CustomerOrderDetailsDto> listOfCOs = new ArrayList<>();

		
		// fetch CO from EA using API
		listOfCOs = customerOrderService.getCustomerOrders("URB", transactionCreateDto.getFetchRequestType());

		for (CustomerOrderDetailsDto co : listOfCOs) {
			if (transactionCreateDto.getCONumberList().contains(co.getComOrderNumber())) {
				listOfSelectedCODto.add(co);
			}
		}

		log.info(".......................................list of selected COs...................................{}",
				listOfSelectedCODto);
		
		//how to get list of Selected COM orders (listOfSelectedCODto) in case of MAnual CO?

		// check if conumer list is empty or not
		if (listOfSelectedCODto.isEmpty() || listOfSelectedCODto == null) {
			throw new ServiceException(SalesConstants.NO_CUSTOMER_ORDER_IS_SELECTED, SalesConstants.ERR_COM_007);
		} else {
			CustomerOrderDetailsDto coTempDao = listOfSelectedCODto.get(0);

			List<String> requestType = RequestTypeEnum.getCoType(coTempDao.getRequestType());

			listOfSelectedCODto.stream().forEach(customerOrder -> {

				if ((!customerOrder.getMobileNumber().equals(coTempDao.getMobileNumber()))
						&& (!requestType.contains(customerOrder.getRequestType()))) {
					throw new ServiceException(SalesConstants.CO_BELONGS_TO_DIFF_CUSTOMER_AND_OF_DIFF_TYPES,
							SalesConstants.ERR_COM_006);
				} else if (!customerOrder.getMobileNumber().equals(coTempDao.getMobileNumber())) {
					throw new ServiceException(SalesConstants.CO_BELONGS_TO_DIFF_CUSTOMER, SalesConstants.ERR_COM_004);

				} else if (!requestType.contains(customerOrder.getRequestType())) {
					throw new ServiceException(SalesConstants.SELECTED_CO_ARE_OF_DIFF_TYPE, SalesConstants.ERR_COM_005);

				} else if (coTempDao.getRequestType().equals(RequestTypeEnum.COM.name())) {
					throw new ServiceException(SalesConstants.COM_ORDERS_CANNOT_BE_COMBINED,
							SalesConstants.ERR_COM_002);
				} else {
					listOfCombinedCODao.add(customerOrder);
				}

			});

			Integer customerId = 0;
			try {
				customerId = customerService.searchCustomerWithoutUlpUpdate(SearchTypeEnum.MOBILE_NO,
						listOfCombinedCODao.get(0).getMobileNumber(),false);
			} catch (ServiceException e) {
				if ("ERR-SALE-070".equals(e.getErrorCode())) {
					throw new ServiceException(
							SalesConstants.CUSTOMER_NOT_FOOUND_FOR_MOBILR_NUMBER
									+ listOfCombinedCODao.get(0).getMobileNumber(),
							SalesConstants.ERR_COM_001,
							Map.of("mobileNo", listOfCombinedCODao.get(0).getMobileNumber()));
				} else {
					throw e;
				}
			}

			// validate transaction and sub txn types.
			commonTransactionService.txnTypeAndSubTxnTypeValidation(transactionType, subTxnType);

			// To generate CO_OPEN doc no and prepare DAO Object
			SalesTxnDaoExt salesTxnDao = commonTransactionService.getSalesTxnDao(null, transactionType, subTxnType,
					SalesDocTypeEnum.CO_OPEN, TransactionStatusEnum.OPEN);

			 //if MANUAL_AB then need to validate bill details
			 if (SubTxnTypeEnum.MANUAL_CO.name().equals(subTxnType)) {
			 commonTransactionService.validateManualBillDetails(transactionCreateDto,salesTxnDao);
			 }

			salesTxnDao.setSrcSyncId(0);
			salesTxnDao.setDestSyncId(0);
			// salesTxnDao.setCustomerId(customerId);
			MetalRateListDto metalRateListDto = commonTransactionService.getMetalRate();
			salesTxnDao.setMetalRateDetails(MapperUtil.getStringFromJson(metalRateListDto));
			salesTxnRepository.save(salesTxnDao);

			commonTransactionService.updateCustomerDetails(customerId, salesTxnDao);

			OrderDaoExt orderDao = new OrderDaoExt();
			orderDao.setSalesTxn(salesTxnDao);
			orderDao.setPaidValue(BigDecimal.ZERO);
			orderDao.setIsFrozenRate(Boolean.FALSE);
			orderDao.setIsBestRate(Boolean.FALSE);
			orderRepository.save(orderDao);

			TxnTaxTypeEnum taxType = TxnTaxTypeEnum.CUST_TRANSACTION_PRIORITY_ORDER;
			List<OrderDetailsDaoExt> orderDetailsList = new ArrayList<>();
			for (CustomerOrderDetailsDto cO : listOfCombinedCODao) {
				PriceResponseDto price = new PriceResponseDto();
				OrdersPriceRequest orderPriceRequest = new OrdersPriceRequest();
				TotalTaxAndTaxDetailsDto taxincludedPrice = new TotalTaxAndTaxDetailsDto();

				/**************** For Price Calculation *************/
				orderPriceRequest.setItemCode(cO.getItemCode());
				orderPriceRequest.setCheckInventory(Boolean.FALSE);
				// orderPriceRequest.setMeasuredQuantity(cO.getQuantity());
				// orderPriceRequest.setMeasuredWeight(cO.getNetWeight());
				orderPriceRequest.setStandardPrice(metalRateListDto.getMetalRates());
				price = engineService.getCOPriceDetails(orderPriceRequest, null);
				log.info("Price is .............................................................." + price);

				/****************** Tax Calculation ******************/
				taxincludedPrice = commonTransactionService.getTotalTaxDetails(customerId, cO.getItemCode(),
						price.getFinalValue(), null, taxType, null, null);
				log.info("With tax Details.....................................................{}", taxincludedPrice);

				/******* setting attributes of OrderDetailsDao *******/
				OrderDetailsDaoExt orderDetailsDao = orderUtilService.setOrderDetailsDaoAttributes(cO, orderDao, price,
						taxincludedPrice);

				orderDetailsList.add(orderDetailsDao);

			}
			orderDetailsRepository.saveAll(orderDetailsList);

			orderUtilService.updateOrderHeader(orderDao, orderDetailsList);

			orderRepository.save(orderDao);

			transactionResponseDto.setId(orderDao.getId());
			transactionResponseDto.setStatus(salesTxnDao.getStatus());
			transactionResponseDto.setDocNo(salesTxnDao.getDocNo());
			transactionResponseDto.setTxnType(salesTxnDao.getTxnType());
			transactionResponseDto.setSubTxnType(salesTxnDao.getSubTxnType());
			 if (SubTxnTypeEnum.MANUAL_CO.name().equals(subTxnType)) {
			 transactionResponseDto.setManualBillDetails(
			 commonTransactionService.mapJsonToManualBillDetails(salesTxnDao.getManualBillDetails()));
			 }

		}
		return transactionResponseDto;
	}

	public void sendNotificationToCustomer(CustomerDetailsDto customer, Map<String, String> data,
			NotificationType notificationType) {		/*
		 * if (StringUtils.isEmpty(customer.getEmailId())) {
		 * customer.setEmailId("default@mindtree.com"); }
		 */
		//customer.setEmailId("poss.service.titan@gmail.com");
		otpService.checkIfCustomerContactInfoPresent(notificationType, customer);

		NotificationDto notificationDto = new NotificationDto();
		/*if (!StringUtils.isEmpty(customer.getEmailId()))
			notificationDto.setEmailIds(Set.of(customer.getEmailId()));*/
		if (!StringUtils.isEmpty(customer.getMobileNumber())) {
			notificationDto.setMobileNo(customer.getMobileNumber());
			NotificationTypeDataDto notf = new NotificationTypeDataDto(notificationType, data, null, null);
			notificationDto.setNotificationTypeData(List.of(notf));
			notificationDto.setLocationCode(CommonUtil.getLocationCode());
			integrationService.sendNotification(notificationDto);
		}
	}

	@Override
	public void validateMetalRate(String id, String txnType, String subTxnType, String status,
			MetalRateListDto metalRateListDto) {
		String subTxnTypeEnum = null;
		if (txnType.equals(TransactionTypeEnum.AB.name())) {
			subTxnTypeEnum = SubTxnTypeEnum.NEW_AB.name();
		} else if (txnType.equals(TransactionTypeEnum.CO.name())) {
			subTxnTypeEnum = SubTxnTypeEnum.NEW_CO.name();
		}
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, txnType, subTxnType);
		boolean isAvoidMetalRateCheck = false;
		// if rateFreeze CN is added, then metal rate is not required.
		PaymentDetailsDaoExt rateFreezedPayment = paymentUtil.getMetalRateProtectedCNIfExists(orderDao.getSalesTxn());
		if (rateFreezedPayment != null) {
			isAvoidMetalRateCheck = true;
			// check for rate freezed CN configurations
			paymentUtil.validTxnForRateFreezedCN(orderDao.getSalesTxn(), rateFreezedPayment);
		}

		// metal rate check
		if (txnType.equals(TransactionTypeEnum.AB.name())) {
			commonTransactionService.checkMetalRate(orderDao.getSalesTxn(), metalRateListDto,
					TransactionStatusEnum.valueOf(status), true, orderUtilService.getHoldTimeInMinutesForAb(),
					isAvoidMetalRateCheck, Set.of());
		} else if (txnType.equals(TransactionTypeEnum.CO.name())) {
			commonTransactionService.checkMetalRate(orderDao.getSalesTxn(), metalRateListDto,
					TransactionStatusEnum.valueOf(status), true, orderUtilService.getHoldTimeInMinutesForCo(),
					isAvoidMetalRateCheck, Set.of());
		}
		
	}

}
