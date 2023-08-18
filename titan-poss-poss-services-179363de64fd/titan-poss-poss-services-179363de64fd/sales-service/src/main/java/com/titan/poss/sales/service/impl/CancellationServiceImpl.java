/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dto.DiscountCouponUpdateResponseDto;
import com.titan.poss.config.dto.constants.DiscountCouponStatusEnum;
import com.titan.poss.core.discount.dto.EmployeeCouponDetailDto;
import com.titan.poss.core.discount.dto.GhsDiscountVoucherDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.EinvoiceErrorEnum;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DiscountCouponDto;
import com.titan.poss.core.dto.EventCancellationDto;
import com.titan.poss.core.dto.EventCashMemoDetailsDto;
import com.titan.poss.core.dto.EventPaymentDetailsDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GepDetails;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCashMemoDetailsDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TSSSCouponRedeemDto;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.GiftCardTypeEnum;
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
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TepPaymentTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.FocDetailsDao;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CancelSyncDtoExt;
import com.titan.poss.sales.dto.CancellationListDto;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerPaymentSyncDtoExt;
import com.titan.poss.sales.dto.CustomerTxnSyncDtoExt;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.PaymentReversalSyncDtoExt;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnStatusCancelEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.print.ReturnDto;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CancelRequestDto;
import com.titan.poss.sales.dto.request.ConfirmCancelAfterApprovalDto;
import com.titan.poss.sales.dto.request.ConfirmCancelDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.BillCancellationHeaderDto;
import com.titan.poss.sales.dto.response.CancelAdvancePendingDto;
import com.titan.poss.sales.dto.response.CancelAdvanceResponseDto;
import com.titan.poss.sales.dto.response.CancelSyncStagingDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.ReqApprovalDetailsDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CashMemoDetailsRepository;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.FocDetailsRepository;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentReversalRepositoryExt;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CancellationService;
import com.titan.poss.sales.service.CashMemoCancelService;
import com.titan.poss.sales.service.CashMemoGiftService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTxnSycnService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.InventoryUtilService;
import com.titan.poss.sales.service.RefundService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesInvoiceDocService;
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
@Service("CancellationService")
public class CancellationServiceImpl implements CancellationService {

	@Autowired
	CashMemoRepositoryExt cashMemoRepo;

	@Autowired
	CommonTransactionServiceImpl commonTxnService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	CancellationRepositoryExt cancelRepoExt;

	@Autowired
	CancellationRepository cancelRepo;

	@Autowired
	SalesDocService salesDocService;

	@Autowired
	CreditNoteService creditNoteService;

	@Autowired
	CashMemoCancelService cashMemoCancelService;

	@Autowired
	CommonPaymentService paymentUtil;

	@Autowired
	CashMemoGiftService cashMemoGiftService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CancellationServiceImpl cancelServiceImpl;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private PaymentReversalRepositoryExt paymentReveralRep;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataServiceImpl salesSyncDataService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Value("${app.name}")
	private String appName;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private GoodsExchangeRepositoryExt goodsExchangeRepository;

	@Autowired
	private CashMemoDetailsRepository cmdRepo;

	@Autowired
	private InventoryUtilService inventoryUtil;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private CustomerPaymentRepositoryExt customerPaymentRepo;

	@Autowired
	private RefundService refundService;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	private GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepository;

	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private CustomerRepositoryExt customerRepo;

	@Autowired
	private FocDetailsRepository focDetailsRepository;

	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditDaoRepositoryExt;
	
	@Autowired
	private CommonTxnSycnService commonTxnSycnService;
	
	@Autowired
	private SalesInvoiceDocService salesInvoiceDocService;

	private static final String ERR_SALE_059 = "ERR-SALE-059";
	private static final String INVALID_SUB_TRANSACTION_TYPE = "Invalid Sub transaction type.";

	private static final String ERR_SALE_060 = "ERR-SALE-060";
	private static final String INVALID_TRANSACTION_TYPE = "Invalid transaction type.";

	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	private static final String ERR_SALE_098 = "ERR-SALE-098";
	private static final String REQUEST_IS_NOT_APPROVED = "Request is not approved.";

	private static final String ERR_SALE_104 = "ERR-SALE-104";
	private static final String CANNOT_CANCEL_TRANSACTION_POST_CONFIGURED_TIME_PLEASE_RAISE_A_REQUEST_THE_SAME = "Cannot cancel transaction post configured time. Please raise a request the same.";

	private static final String ERR_SALE_105 = "ERR-SALE-105";
	private static final String CANNOT_RISE_REQUEST_FOR_BILL_CANCELLATION = "Cannot rise request for bill cancellation.";

	private static final String ERR_SALE_106 = "ERR-SALE-106";
	private static final String REQUEST_IS_ALREADY_PROCESSED = "Request is already processed.";

	private static final String ERR_SALE_107 = "ERR-SALE-107";
	private static final String TRANSACTION_IS_ALREADY_REQUESTED_FOR_APPROVAL = "Transaction is already requested for approval.";

	private static final String ERR_SALE_317 = "ERR-SALE-317";
	private static final String REMARKS_CANNOT_BE_EDITED = "Remarks cannot be edited.";

	private static final String TXN_TYPE = "txnType";
	
	private static final String ERROR_IN_PARSNG_JSON = "ERROR IN PARSNG JSON";
	private static final String ERR_CORE_003 = "ERR-CORE-003";
	
	private static final String TSSS_REDEMPTION_API_URL = "api/config/v2/discounts/coupons";
	
    private static final String CUST_TAX_NO = "custTaxNo";
    private static final String MOBILE_NO = "mobileNo";
    private static final String EMAIL_ID =  "emailId";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String INSTI_TAX_NO = "instiTaxNo";
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	private void validateTxnAndSubTxnType(String txnType, String subTxnType) {
		commonTxnService.validateTxnAndSubTxnTypeCancel(TxnTypeCancelEnum.getCancelTypes(), txnType, subTxnType);
	}

	@Override
	public PagedRestResponse<List<CancellationListDto>> listBillCancel(Integer docNo, String customerName,
			String txnType, String subTxnType, String customerMobileNo, Short fiscalYear, Long docDateInLong,
			Pageable pageable) {
		validateTxnAndSubTxnType(txnType, subTxnType);

		Date docDate = null;
		if (docDateInLong != null && docDateInLong != 0) {
			docDate = CalendarUtils.getStartOfDay(new Date(docDateInLong));
			log.info("date in epoch format - {}, converted date value - {}", docDateInLong, docDate);
		}

		customerMobileNo=CryptoUtil.encrypt(customerMobileNo,MOBILE_NO);
		Page<CancellationListDto> pageList = null;
		if (TxnTypeCancelEnum.GEPCAN.toString().equals(txnType)
				|| TxnTypeCancelEnum.TEPCAN.toString().equals(txnType)) {
			String status = TransactionStatusEnum.CONFIRMED.toString();
			pageList = goodsExchangeRepository.listGoodsExchangeCancel(docNo, customerMobileNo, docDate, status,
					CommonUtil.getLocationCode(), fiscalYear, subTxnType, pageable);
            for(int i=0; i < pageList.getSize();i++){
                try {
                    pageList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(pageList.getContent().get(i).getCustomerName(),CUSTOMER_NAME));
              } catch (Exception e) {
                  e.printStackTrace();
              }   
            }
		} else {
			// CM cancellation
			String status = TransactionStatusEnum.CONFIRMED.name();
			Date date = businessDayService.getBusinessDay().getBusinessDate();
			pageList = getListForBillCancellation(docNo, customerName, customerMobileNo, subTxnType, pageable, date,
					status);
            for(int i=0; i < pageList.getSize();i++){
                try {
                    pageList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(pageList.getContent().get(i).getCustomerName(),CUSTOMER_NAME));
              } catch (Exception e) {
                  e.printStackTrace();
              }   
            }
		}
		return new PagedRestResponse<>(pageList);
	}

	private Page<CancellationListDto> getListForBillCancellation(Integer docNo, String customerName,
			String customerMobileNo, String subTxnType, Pageable pageable, Date date, String status) {

		if (pageable.getSort().isEmpty()) {
			pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("docNo").descending());
		}
		Page<CancellationListDto> pageList;
		List<String> subTxnAllowedList = subTxnOfCMByCancelSubTxn(subTxnType);
		pageList = cashMemoRepo.listBillCancellation(docNo, customerName, customerMobileNo, CommonUtil.getStoreCode(),
				TransactionTypeEnum.CM.name(), subTxnAllowedList, status, date,
				// subTxnType.name(),
//				, notAllowedStatus, 
				pageable);
		return pageList;

	}

	@Override
	public ListResponse<CancellationTypeEnum> listAllowedCancelTypes(String refTxnId, String txnType,
			String subTxnType) {

		validateTxnAndSubTxnType(txnType, subTxnType);

		SalesTxnDaoExt salesTxn = salesTxnRepositoryExt.findByIdAndLocationCodeAndTxnType(refTxnId,
				CommonUtil.getStoreCode(), TransactionTypeEnum.CM.name());
		if (salesTxn == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, "Ref txn id: '" + refTxnId + "' not found.");

		return new ListResponse<>(cashMemoCancelService.allowedCancelTypeByTxnId(salesTxn, null));

	}

	private List<String> subTxnOfCMByCancelSubTxn(String subTxnType) {
		List<String> subTxnAllowedList = null;
		if (subTxnType.equals(SubTxnTypeEnum.GIFT_SALE.name()))
			subTxnAllowedList = List.of(SubTxnTypeEnum.GIFT_SALE.name());
		else if (subTxnType.equals(SubTxnTypeEnum.CASH_MEMO.name()))
			subTxnAllowedList = List.of(SubTxnTypeEnum.NEW_CM.name(), SubTxnTypeEnum.MANUAL_CM.name());
		else
			subTxnAllowedList = List.of("");
		return subTxnAllowedList;
	}

	private List<InventoryDetailsDao> addItemToInventory(CancelDaoExt cancel) {
		SalesTxnDaoExt st = cancel.getRefSalesTxn();
		List<CashMemoDetailsDao> cmItems = getCashMemoDetailsByCMId(st.getId());
		List<FocDetailsDao> focDetails = focDetailsRepository.findAllBySalesTxnId(st.getId());
		// fetch all FOC items and Pass
		List<InventoryDetailsDao> newInvItems = inventoryUtil.createInventoryEntityFromCashMemoDetails(cmItems,
				focDetails, st, SalesDocTypeEnum.CMCAN, cancel.getCancellationType(), cancel.getDocNo(),
				cancel.getFiscalYear(),null);
		for (CashMemoDetailsDao cm : cmItems) {
			for (InventoryDetailsDao id : newInvItems) {
				if (StringUtils.isNotBlank(cm.getLotNumber())
						&& (cm.getItemCode().equals(id.getItemCode()) && cm.getLotNumber().equals(id.getLotNumber())))
					cm.setInventoryId(id.getId());
			}
		}
		if (CollectionUtil.isNotEmpty(cmItems))
			cmdRepo.saveAll(cmItems);
		return newInvItems;
	}

	private List<CashMemoDetailsDao> getCashMemoDetailsByCMId(String cmId) {
		return cmdRepo.findByCashMemoDaoId(cmId);
	}

	@Transactional(value = "chainedTransaction")
	public PublishResponse confirmCancelTransactional(ConfirmCancelDto confirmCancelDto, String txnType,
			String subTxnType) {
		log.info("Cancel invoice :- " + confirmCancelDto.getRefTxnId());
		List<UpdateInventoryDto> updateInvList = new ArrayList<>();
		verifyFieldLevel(confirmCancelDto, txnType, false);
		validateTxnAndSubTxnType(txnType, subTxnType);
		SalesTxnDaoExt salesTxn = new SalesTxnDaoExt();
		Object indvObject = null;
		SalesDocTypeEnum salesDocType = null;
		BigDecimal totalAmt = BigDecimal.ZERO;
		BigDecimal tcsCNAmt = BigDecimal.ZERO;
		Integer docNo = 0;
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		if (TxnTypeCancelEnum.GEPCAN.name().equals(txnType)) {
			GoodsExchangeDaoExt goodsExchangeDao = validateGoodsExchangeCancel(confirmCancelDto.getRefTxnId(),
					subTxnType, updateInvList, locationCacheDto);
			salesTxn = goodsExchangeDao.getSalesTxn();
			salesDocType = SalesDocTypeEnum.GEPCAN;
			indvObject = goodsExchangeDao;
			totalAmt = goodsExchangeDao.getTotalValue();
			docNo = goodsExchangeDao.getSalesTxn().getDocNo();
		} else if (TxnTypeCancelEnum.CMCAN.name().equals(txnType)) {
			CashMemoDaoExt cashMemo = getCashMemoByIdWithErrorCheck(confirmCancelDto.getRefTxnId(),
					TransactionTypeEnum.CM.name(), subTxnType, confirmCancelDto.getCancelType());
			salesTxn = cashMemo.getSalesTxnDao();
			salesDocType = SalesDocTypeEnum.CMCAN;
			indvObject = cashMemo;
			totalAmt = cashMemo.getFinalValue();
			tcsCNAmt = cashMemo.getTcsAmount();

		} else if (TxnTypeCancelEnum.TEPCAN.name().equals(txnType)) {
			GoodsExchangeDaoExt goodsExchangeDao = validateGoodsExchangeCancel(confirmCancelDto.getRefTxnId(),
					subTxnType, updateInvList, locationCacheDto);
			String refundMode = null;
			try {

				ObjectMapper mapper = new ObjectMapper();
				JsonNode root = mapper.readTree(goodsExchangeDao.getRefundDetails());
				JsonNode dataNode = root.path("data");
				if (!dataNode.isMissingNode() && dataNode.hasNonNull("refundMode")) {
					refundMode = dataNode.path("refundMode").asText();
				}
			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
			}
			if (TepPaymentTypeEnum.REFUND.toString().equals(goodsExchangeDao.getPaymentType()) && !PaymentCodeEnum.CASH.getPaymentcode().equalsIgnoreCase(refundMode)) {
				refundService.cancelRefundRequest(confirmCancelDto.getRefTxnId(), subTxnType);
			}
			salesTxn = goodsExchangeDao.getSalesTxn();
			salesDocType = SalesDocTypeEnum.TEPCAN;
			indvObject = goodsExchangeDao;
			totalAmt = goodsExchangeDao.getTotalValue();
			docNo = goodsExchangeDao.getSalesTxn().getDocNo();
		}
		validateCashMemoCancel(confirmCancelDto, txnType, subTxnType, salesTxn);
		

		// create & save
		CancelDaoExt cancel = createCancelObject(confirmCancelDto, txnType, subTxnType, salesTxn, salesDocType,
				TxnStatusCancelEnum.CONFIRMED.name());
		
		MapperUtil.beanMapping(indvObject, cancel, "id");
		cancel.setTotalValue(totalAmt);
		cancel.setSrcSyncId(0);
		cancel.setDestSyncId(0);
		cancelRepoExt.save(cancel);
		
		salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
		List<InventoryDetailsDao> newInventoryDetails = addItemToInventory(cancel);
		rivaahCardEligibilityCount(salesTxn);
		eInvoiceCheck(salesTxn, cancel, confirmCancelDto);
		if (locationCacheDto != null && locationCacheDto.getStoreDetails().getIsDial()
				&& TxnTypeCancelEnum.CMCAN.name().equals(txnType)
				&& (salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.OPEN.name())
						|| salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.CANCELLED.name()))) {
			dialIntegration(confirmCancelDto, subTxnType, salesTxn);
		} else if (TxnTypeCancelEnum.TEPCAN.name().equals(txnType) || TxnTypeCancelEnum.GEPCAN.name().equals(txnType)) {
			List<InventoryDetailsDao> removeInventoryDetails = removeItemFromInventory(docNo, salesDocType,
					updateInvList);
			newInventoryDetails.addAll(removeInventoryDetails);
		}
		
		// sync stage with DV and payment reversal
		CancelSyncStagingDto syncStagingDto = syncStagging(salesTxn, cancel, txnType, subTxnType,
				confirmCancelDto.getCancelType(), indvObject, null, newInventoryDetails);
		
		PublishResponse cancelPublishResponse = new PublishResponse();
		
		cancelPublishResponse.setApiResponse(new CancelAdvanceResponseDto(cancel.getId(), cancel.getDocNo(),
				syncStagingDto.getDocNos(), syncStagingDto.getCNDocTypes(), tcsCNAmt));
		
		cancelPublishResponse.setSyncStagingDto(syncStagingDto);
		return cancelPublishResponse;
	}
	
	/**
	 * This method is to set CancelDao for all Unipay Payments 
	 * for which void is successful in payment_details table
	 * @param cancel
	 * @param id
	 */
	private void setCancelDaoInPaymentRefunds(CancelDaoExt cancel, String salesTxnId) 
	{
		//getting only unipay payments and setting cancel Dao for that
		
		//pass salestxn id and get all the payments then filter based on unipay and then filter which are only there in payment_refunds table
		List<PaymentReversalDaoExt> refundedUnipayList = paymentReveralRep.findAllBySalesTxnIdAndPaymentCode(salesTxnId,PaymentCodeEnum.UNIPAY.name());
		
		if(!CollectionUtil.isEmpty(refundedUnipayList))
		{
			//should this be done only for is_void = true cases?
			// should we create CN directly in case of is_void =false for payments which were
			//failed during void?
			for (PaymentReversalDaoExt paymentReversal : refundedUnipayList) 
			{
				paymentReversal.setCancel(cancel);
			}
			paymentReveralRep.saveAll(refundedUnipayList);
		}
		
	}

	private void releasingEmployeeCouponCode(SalesTxnDaoExt salesTxn,DiscountTransactionDetails discountTransactionDetails) {
		boolean isError = false;
		ServiceException exception = null;
		GcResponseDto couponResponseDto=null;
		if(salesTxn.getDiscountTxnDetails()!=null && discountTransactionDetails.getEmployeeDetails()!=null ) {
			List<EmployeeCouponDetailDto> employeeCouponDetailDtoList=discountTransactionDetails.getEmployeeDetails().getCouponDetails();
			if(employeeCouponDetailDtoList!=null) {
				for(EmployeeCouponDetailDto employeeCouponDetailDto:employeeCouponDetailDtoList) {
					//calling integration API to update coupon details
					BigDecimal finalBillValue = discountUtilService.getTransactionSpecificInvoiceDetails(salesTxn)
							.getFinalValue();
					GiftCardBaseReverseRedeemRequestDto giftCardReverseRedeemRequestDto= new GiftCardBaseReverseRedeemRequestDto();
					giftCardReverseRedeemRequestDto.setAmount(employeeCouponDetailDto.getAmount().doubleValue());
					giftCardReverseRedeemRequestDto.setCardNumber(employeeCouponDetailDto.getCouponCode());
					giftCardReverseRedeemRequestDto.setInvoiceNumber(salesTxn.getId());
					giftCardReverseRedeemRequestDto.setBillAmount(finalBillValue.doubleValue());
					giftCardReverseRedeemRequestDto.setTransactionId(employeeCouponDetailDto.getRedeemTxnId());;
					try {
						 couponResponseDto=integrationServiceClient.reverseRedeemGiftCardBalance(VendorCodeEnum.QC_GC.toString(), 
								 giftCardReverseRedeemRequestDto, GiftCardTypeEnum.EMPLOYEE_CODE);
					}catch (ServiceException e) {
						log.info("employee coupon redemption reversal failed for coupon no.: " + employeeCouponDetailDto.getCouponCode() + ". Exception: "
								+ e.getLocalizedMessage());
						isError = true;
						exception = e;
						break;
				}
					employeeCouponDetailDto.setRedeemStatus("DELETED");
				}
			}
			if (isError && couponResponseDto!=null) {
				// update discountTxnDetils at sales_transaction table.
				cancelServiceImpl.saveDiscountDetails(salesTxn, discountTransactionDetails);
				throw exception;
			} else if (isError) {
				throw exception;
			}
			
		}		
	}

	private void rivaahCardEligibilityCount(SalesTxnDaoExt salesTxn) {
		// commonCashMemoService.callEpossCustomerCoupon(null, null, null,
		// salesTxn.getId());
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		if (discountTxnDetails != null && discountTxnDetails.getRivaahCardDetails() != null
				&& discountTxnDetails.getRivaahCardDetails().getCouponCode() != null) {
			Set<Integer> customerSet = new HashSet<>();
			customerSet.add(salesTxn.getCustomerId());
			List<Object[]> object = customerRepo.getCustomerNamesByIds(CommonUtil.getLocationCode(), customerSet);
			// commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2],
			// null, "BILL_CANCELLATION", null);
		}

	}

	private void eInvoiceCheck(SalesTxnDaoExt salesTxn, CancelDaoExt cancel, ConfirmCancelDto confirmCancelDto) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxn.getLocationCode());
		StoreDetails storeDetails = locationCacheDto.getStoreDetails();
		if (BooleanUtils.isTrue(storeDetails.getIsEinvoiceEnabled())) {
			SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = salesInvoiceDocumentsRepository
					.findByReferenceId(salesTxn.getId());
			if (salesInvoiceDocumentsDao != null && !salesInvoiceDocumentsDao.getTransactionType()
					.equalsIgnoreCase(EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name())) {
				cancelIrn(salesInvoiceDocumentsDao, confirmCancelDto, cancel);
				salesInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
				salesInvoiceDocumentsDao.setReferenceId(cancel.getId());
				salesInvoiceDocService.syncDataInvoiceDocs(salesInvoiceDocumentsDao);
			}
		}
	}

	private void cancelIrn(SalesInvoiceDocumentsDao salesInvoiceDocumentsDao, ConfirmCancelDto confirmCancelDto,
			CancelDaoExt cancel) {
		integrationServiceClient.cancelIrn(salesInvoiceDocumentsDao.getReferenceId(), cancel.getId(),
				VendorCodeEnum.IRN_ASPTAX.name(), salesInvoiceDocumentsDao.getInvoiceNumber(),
				cancel.getDocNo().toString(), EinvoiceErrorEnum.ORDER_CANCELLED.name(), confirmCancelDto.getRemarks());

	}

	/**
	 * @param confirmCancelDto
	 * @param txnType
	 * @param subTxnType
	 * @param salesTxn
	 */
	private void validateCashMemoCancel(ConfirmCancelDto confirmCancelDto, String txnType, String subTxnType,
			SalesTxnDaoExt salesTxn) {
		// check:IsBillCancelApprovalRequired is true && MAX_NO_OF_HOURS_FOR_CANCEL
		// should be more than or equal to(current time - confirmed time).
		LocationCashMemoDetailsDto locationCashMemoDetailsDto = getCMDetailsForCancel();
		if (BooleanUtils.isTrue(locationCashMemoDetailsDto.getIsBillCancelApprovalRequired())
				&& TxnTypeCancelEnum.CMCAN.name().equals(txnType)
				&& SubTxnTypeCancelEnum.CASH_MEMO.name().equals(subTxnType)
				&& BigDecimal
						.valueOf(CalendarUtils.getHourDifference(salesTxn.getConfirmedTime(),
								CalendarUtils.getCurrentDate()))
						.compareTo(locationCashMemoDetailsDto.getMaxNoOfHoursForBillCancel()) >= 0) {
			throw new ServiceException(CANNOT_CANCEL_TRANSACTION_POST_CONFIGURED_TIME_PLEASE_RAISE_A_REQUEST_THE_SAME,
					ERR_SALE_104, "Cannot cancel transaction post configured time. Please raise a request for id - '"
							+ confirmCancelDto.getRefTxnId() + "'");
		}
	}

	private void dialIntegration(ConfirmCancelDto confirmCancelDto, String subTxnType, SalesTxnDaoExt salesTxn) {
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = cashMemoDetailsRepository
				.findByCashMemoDaoId(confirmCancelDto.getRefTxnId());
		List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository
				.findBySalesTxnDaoIdAndStatus(confirmCancelDto.getRefTxnId(), PaymentStatusEnum.COMPLETED.name());
		EventCancellationDto eventCancellationDto = new EventCancellationDto();
		List<EventCashMemoDetailsDto> eventCashMemoDetailsDtoList = new ArrayList<>();
		List<EventPaymentDetailsDto> eventPaymentDetailsDtoList = new ArrayList<>();
        CustomerTxnDaoExt customerTxnDaoExt = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());
		eventCancellationDto.setCustomer(
				commonTxnService.getEventCustomer(customerTxnDaoExt));
        customerTxnDaoExt.setMobileNumber(CryptoUtil.decrypt(customerTxnDaoExt.getMobileNumber(),MOBILE_NO,false));
        customerTxnDaoExt.setEmailId(CryptoUtil.decrypt(customerTxnDaoExt.getEmailId(),EMAIL_ID,false));
        customerTxnDaoExt.setCustomerName(CryptoUtil.decrypt(customerTxnDaoExt.getCustomerName(),CUSTOMER_NAME,false));
        customerTxnDaoExt.setCustTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNo(),CUST_TAX_NO,false));
        customerTxnDaoExt.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
        customerTxnDaoExt.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(),INSTI_TAX_NO,false));
        customerTxnDaoExt.setPassportId(CryptoUtil.decrypt(customerTxnDaoExt.getPassportId(),PASSPORT_ID,false));
		
		if (!cashMemoDetailsDaoList.isEmpty()) {
			cashMemoDetailsDaoList.forEach(cashMemo -> eventCashMemoDetailsDtoList.add(
					(EventCashMemoDetailsDto) MapperUtil.getObjectMapping(cashMemo, new EventCashMemoDetailsDto())));
		}
		if (!paymentList.isEmpty()) {
			paymentList.forEach(payment -> eventPaymentDetailsDtoList
					.add((EventPaymentDetailsDto) MapperUtil.getObjectMapping(payment, new EventPaymentDetailsDto()))

			);
		}
		eventCancellationDto.setCashMemoDetailsList(eventCashMemoDetailsDtoList);
		eventCancellationDto.setPaymentDetailsList(eventPaymentDetailsDtoList);
		integrationServiceClient.cancellationDetails(VendorCodeEnum.DIAL_MILESTONE.name(),
				confirmCancelDto.getRefTxnId(), confirmCancelDto.getCancelType(), salesTxn.getStatus(), Boolean.FALSE,
				eventCancellationDto);
	}

	private List<InventoryDetailsDao> removeItemFromInventory(Integer docNo, SalesDocTypeEnum docType,
			List<UpdateInventoryDto> updateInvList) {
		return inventoryService.removeFromInventoryDetails(updateInvList, docNo, docType);
	}

	private Map<String, Integer> cancelPaymentsOrCN(CancelDaoExt cancel, String txnType, String subTxnType,
			String cancelType, Object indvObject) {
		log.info("inside cancel payments or cn");
		cancel.getRefSalesTxn().setStatus(TransactionStatusEnum.CANCELLED.name());
		// operation before saving
		Map<String, Integer> docNos = new HashMap<>();
		CNPaymentDetailsDto cnPaymentDetails = new CNPaymentDetailsDto();
		if (txnType.equals(TxnTypeCancelEnum.CMCAN.name())) {
			List<GiftDetailsDaoExt> giftDetailsDaoList = new ArrayList<>();
			if (subTxnType.equals(SubTxnTypeCancelEnum.CASH_MEMO.name())) {

				docNos = cashMemoCancelService.cancelPaymentWise(cancel.getRefSalesTxn(), cancel,
						CancellationTypeEnum.valueOf(cancelType), CNType.BILL_CANCELLATION, null);
			} else if (subTxnType.equals(SubTxnTypeCancelEnum.GIFT_SALE.name())) {
				log.info("Cancel all gift card for this txn");
				// get CashMemoDao
				giftDetailsDaoList = cashMemoGiftService.deactivateGifts((CashMemoDaoExt) indvObject);
				if (cancelType.equals(CancellationTypeEnum.CANCEL_WITH_CN.name())) {
					List<PaymentDetailsDaoExt> payments = paymentDetailsRepository.findAllBySalesTxnDaoId(cancel.getRefSalesTxn().getId());
					BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
							cancel.getRefSalesTxn().getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
							CommonUtil.getLocationCode(), PaymentStatusEnum.COMPLETED.name());
					cnPaymentDetails = paymentUtil.getPaymentDetailsForCNGeneration(payments, cnPaymentDetails);
				
					docNos = paymentUtil.createCN(CNType.BILL_CANCELLATION,
							List.of(new CreditNoteIndvCreateDto(cancel.getTotalValue(), totalCashPaid,new JsonData("CN_PAYMENT_DETAILS", cnPaymentDetails))),
							cancel.getRefSalesTxn(), cancel, null, null);
				} else {
					docNos = cashMemoCancelService.cancelPaymentWise(cancel.getRefSalesTxn(), cancel,
							CancellationTypeEnum.valueOf(cancelType), CNType.BILL_CANCELLATION, null);
				}
			}

			// insert records to customer_payments table to negate CASH PAYMENT.
			// add to customer payment
			CashMemoDaoExt cashMemoDao = MapperUtil.mapObjToClass(indvObject, CashMemoDaoExt.class);
			List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository
					.findBySalesTxnDaoId(cancel.getRefSalesTxn().getId());
			if (cancelType.equals(CancellationTypeEnum.CANCEL_WITH_RETURN.name()))
				customerPaymentService.addCustomerPayment(cancel.getRefSalesTxn(), giftDetailsDaoList, paymentList,
						cashMemoDao.getFinalValue(), cashMemoDao.getRoundingVariance(), true, BigDecimal.valueOf(1));
		} else if (txnType.equals(TxnTypeCancelEnum.GEPCAN.name()) || txnType.equals(TxnTypeCancelEnum.TEPCAN.name())) {
			creditNoteService.cancelCnByTxnId(cancel.getRefSalesTxn().getId());
		}

		return docNos;

	}

	/**
	 * This method will verify mandatory fields based on txnType &
	 * 'forRaisingRequest'. Parameter 'forRaisingRequest' should be 'true' only when
	 * request is to be raised, else 'false'.
	 * 
	 * @param confirmCancelDto
	 * @param txnType
	 * @param forRaisingRequest
	 */
	private void verifyFieldLevel(ConfirmCancelDto confirmCancelDto, String txnType, Boolean forRaisingRequest) {

		Set<String> mandFields = new HashSet<>();

		if (TxnTypeCancelEnum.CMCAN.name().equals(txnType) && !BooleanUtils.isTrue(forRaisingRequest)) {
			if (confirmCancelDto.getCancelType() == null)
				mandFields.add("cancelType");
			// employeeCode removed as per UAT_550
		}

		if (!mandFields.isEmpty())
			throw new ServiceException("Some mandatory fields are missing in this transaction.", "ERR-SALE-082",
					mandFields);
	}

	private GoodsExchangeDaoExt validateGoodsExchangeCancel(String refTxnId, String subTxnType,
			List<UpdateInventoryDto> updateInvList, LocationCacheDto locationCacheDto) {
		BusinessDayDto businessDay = engineService.getBusinessDay(CommonUtil.getLocationCode());
		GoodsExchangeDaoExt goodsExchange = goodsExchangeRepository.getGoodsExchangeByIdAndTxnType(refTxnId,
				subTxnType);
		if (goodsExchange == null) {
			throw new ServiceException("No goods exchange found for requested id or txnType", "ERR-SALE-079",
					"No Goods Exchange found for requested id : " + refTxnId + " or txnType : " + subTxnType);
		}
		validateStatus(goodsExchange);
		validateInventoryItems(goodsExchange, updateInvList);
		if (SubTxnTypeCancelEnum.TEP.toString().equals(subTxnType)) {
			TepValidationConfigDetails tepValidation = engineService
					.getTepCancelDetails(TepTypeEnum.CANCEL_TEP.toString());
			validateGoodsExchangeCancelDays(businessDay, goodsExchange, tepValidation.getTepCancellationDays());
			if ((SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(goodsExchange.getSalesTxn().getSubTxnType())
					|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString()
							.equals(goodsExchange.getSalesTxn().getSubTxnType()))
					&& Boolean.FALSE.equals(tepValidation.getIsFVTCNCancellationAllowed())){
				throw new ServiceException("Full value TEP cancellation is not allowed", "ERR-SALE-305",
						"Full value TEP cancellation allowed config : "
								+ tepValidation.getIsFVTCNCancellationAllowed());
			}
		} else if (SubTxnTypeCancelEnum.GEP.toString().equals(subTxnType)) {
			GepDetails gepDetails = locationCacheDto.getGepDetails();
			validateGoodsExchangeCancelDays(businessDay, goodsExchange, gepDetails.getNoOfDaysGepCancel());
		}
		return goodsExchange;
	}

	
	private void validateGoodsExchangeCancelDays(BusinessDayDto businessDay, GoodsExchangeDaoExt goodsExchange,
			Integer maxNoOfDaysForCancel) {
		int dayDiff = (int) CalendarUtils.getDayDiff(goodsExchange.getSalesTxn().getDocDate(),
				businessDay.getBusinessDate());
		if(maxNoOfDaysForCancel != null) {
			if (dayDiff > maxNoOfDaysForCancel /* || maxNoOfDaysForCancel == 0 */) {
				throw new ServiceException("This transaction cannot be cancelled as cancellation time expires",
						"ERR-SALE-301");
			}
		}else {
			maxNoOfDaysForCancel = 0;
			if (dayDiff > maxNoOfDaysForCancel /* || maxNoOfDaysForCancel == 0 */) {
				throw new ServiceException("This transaction cannot be cancelled as cancellation time expires",
						"ERR-SALE-301");	
			}
		}
	
	}

	private void validateInventoryItems(GoodsExchangeDaoExt goodsExchange, List<UpdateInventoryDto> updateInvList) {
		List<GoodsExchangeDetailsDaoExt> detailsList = goodsExchangeDetailsRepository
				.findByGoodsExchange(goodsExchange);
		if (CollectionUtils.isEmpty(detailsList)) {
			throw new ServiceException("No item details found against the transaction id", "ERR-SALE-306",
					"transaction id : " + goodsExchange.getId());
		}
		detailsList.forEach(record -> {
			InventoryItemDto inventoryItemDto = engineService.validateInventoryItems(record.getInventoryId(), null);
			if (inventoryItemDto == null) {
				throw new ServiceException(
						"This transaction cannot be cancelled because items are not available in inventory",
						"ERR-SALE-302");
			}
			if (inventoryItemDto.getTotalQuantity() == 0) {
				throw new ServiceException(
						"This transaction cannot be cancelled because items are not available in inventory",
						"ERR-SALE-302");
			}
			UpdateInventoryDto updatedInv = new UpdateInventoryDto();
			updatedInv.setId(record.getInventoryId());
			updatedInv.setTotalQuantity(record.getQuantity());
			updateInvList.add(updatedInv);
		});
	}

	/**
	 * @param goodsExchange
	 */
	private void validateStatus(GoodsExchangeDaoExt goodsExchange) {
		// if the status is HOLD/OPEN/CANCELLED then cannot cancel the GEP
		if (TransactionStatusEnum.OPEN.toString().equals(goodsExchange.getSalesTxn().getStatus())) {
			throw new ServiceException("The OPEN GEP cannot be cancelled.", "ERR-SALE-096",
					Map.of(TXN_TYPE, goodsExchange.getSalesTxn().getTxnType()));
		} else if (TransactionStatusEnum.HOLD.toString().equals(goodsExchange.getSalesTxn().getStatus())) {
			throw new ServiceException("Please cancel Hold GEP.", "ERR-SALE-094",
					Map.of(TXN_TYPE, goodsExchange.getSalesTxn().getTxnType()));
		} else if (TransactionStatusEnum.CANCELLED.toString().equals(goodsExchange.getSalesTxn().getStatus())) {
			throw new ServiceException("This GEP is already cancelled.", "ERR-SALE-095",
					Map.of(TXN_TYPE, goodsExchange.getSalesTxn().getTxnType()));
		}
	}

	public CashMemoDaoExt getCashMemoByIdWithErrorCheck(String cashMemoId, String txnType, String subTxnType,
			String cancelType) {

		CashMemoDaoExt cashMemo = cashMemoRepo.findOneByIdAndLocationCodeAndTxnTypeAndSubTxnTypeIn(cashMemoId,
				CommonUtil.getLocationCode(), txnType, subTxnOfCMByCancelSubTxn(subTxnType));

		if (cashMemo == null)
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid cash memo id: " + cashMemoId, Map.of("type", "cash memo"));

		String remakrs = null;
		SalesTxnDaoExt salesTxnCM = cashMemo.getSalesTxnDao();

		if (!salesTxnCM.getStatus().equals(TransactionStatusEnum.CONFIRMED.name())) {
			remakrs = salesTxnCM.getStatus();
		} else if ((salesTxnCM.getDocDate().getTime()
				- businessDayService.getBusinessDay().getBusinessDate().getTime()) != 0) {
			
			remakrs = salesTxnCM.getDocDate().toString();
			log.info("business day not 0");
			
		}

		if (StringUtils.isNotBlank(remakrs))
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Cash memo cannot be cancelled. Reason :" + remakrs,
					Map.of(SalesConstants.REMARKS, "Cash memo cannot be cancelled."));

		// check if TEP is done for the CM
		if (!CollectionUtil.isEmpty(goodsExchangeDetailsRepository.findAllByCashMemoTxnIdAndStatusIn(cashMemoId,
				List.of(TransactionStatusEnum.CONFIRMED.name(), TransactionStatusEnum.APPROVAL_PENDING.name())))) {
			throw new ServiceException(SalesConstants.TRANSACTION_CANNOT_BE_CANCELLED_AS_TEP_IS_DONE_FOR_IT,
					SalesConstants.ERR_SALE_386, "TEP is done for the item(s) in cash memo.");
		}

		if (cancelType != null) {
			List<CancellationTypeEnum> cancelTypes = cashMemoCancelService.allowedCancelTypeByTxnId(
					cashMemo.getSalesTxnDao(),
					cashMemo.getTcsAmount() == null ? BigDecimal.ZERO : cashMemo.getTcsAmount());
			if (!cancelTypes.contains(CancellationTypeEnum.valueOf(cancelType))) {
				throw new ServiceException("Provided cancel type is not allowed for this transaction", "ERR-SALE-077",
						"Cancel type is not allowed");
			}
		}

		return cashMemo;

	}

	private CancelDaoExt createCancelObject(ConfirmCancelDto confirmCancelDto, String txnType, String subTxnType,
			SalesTxnDaoExt salesTxn, SalesDocTypeEnum salesDocType, String status) {
		CancelDaoExt cancel = new CancelDaoExt();
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		if (org.springframework.util.StringUtils.isEmpty(countryDetailsDto.getFiscalYear())
				|| StringUtils.isEmpty(countryDetailsDto.getWeightUnit())
				|| StringUtils.isEmpty(countryDetailsDto.getCurrencyCode())) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"Fiscal year or Weight unit or Currency code details are not defined for the "
							+ CommonUtil.getLocationCode() + " location");
		}

		// get doc no
		cancel.setDocNo(salesDocService.getDocNumber(salesDocType, countryDetailsDto.getFiscalYear().shortValue()));

		// set fiscal year
		cancel.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());

		// input details
		cancel.setReasonForCancellation(confirmCancelDto.getReasonForCancellation());
		cancel.setCancellationType(confirmCancelDto.getCancelType());
		cancel.setRemarks(confirmCancelDto.getRemarks());

		// set currency code & weight unit
		cancel.setCurrencyCode(salesTxn.getCurrencyCode());
		cancel.setWeightUnit(salesTxn.getWeightUnit());

		// sales txn details
		cancel.setRefSalesTxn(salesTxn);
		cancel.setCustomerId(salesTxn.getCustomerId());

		// auto set details
		cancel.setCancelledTime(CalendarUtils.getCurrentDate());
		cancel.setStatus(status);
		cancel.setTxnType(txnType);
		cancel.setSubTxnType(subTxnType);
		cancel.setEmployeeCode(CommonUtil.getUserName());
		cancel.setLocationCode(CommonUtil.getLocationCode());
		// get business date from businessDayService
		cancel.setDocDate(businessDayService.getBusinessDay().getBusinessDate());
		
		//cancel.setId(UUID.randomUUID().toString());
		return cancel;
	}

	private void validateSubTxnTypeForRaisingRequest(String txnType, String subTxnType) {

		if (!TxnTypeCancelEnum.txnTypesAllowedtoRaiseRequest().contains(txnType)) {
			throw new ServiceException(INVALID_TRANSACTION_TYPE, ERR_SALE_060, "Invalid transaction type: " + txnType);
		}
		List<String> subTxnListAllowed = SubTxnTypeCancelEnum
				.allowedForRaisingRequestByTxnType(TxnTypeCancelEnum.valueOf(txnType));
		if (!subTxnListAllowed.contains(subTxnType)) {
			throw new ServiceException(INVALID_SUB_TRANSACTION_TYPE, ERR_SALE_059,
					"Invalid sub transaction type: " + subTxnType);
		}
	}

	@Transactional
	@Override
	public CancelAdvancePendingDto requestForBillCancelApproval(CancelRequestDto cancelRequestDto, String txnType,
			String subTxnType) {
		ConfirmCancelDto confirmCancelDto = (ConfirmCancelDto) MapperUtil.getDtoMapping(cancelRequestDto,
				ConfirmCancelDto.class);
		// 'forRaisingRequest' is true here. As this is request raising flow.
		verifyFieldLevel(confirmCancelDto, txnType, true);
		validateSubTxnTypeForRaisingRequest(txnType, subTxnType);

		// check if request is raised already
		List<CancelDaoExt> existingCancelDaoList = cancelRepoExt.findByRefSalesTxnAndLocationCodeAndStatus(
				cancelRequestDto.getRefTxnId(), CommonUtil.getLocationCode(), TxnStatusCancelEnum.PENDING.name());

		if (!existingCancelDaoList.isEmpty()) {
			CancelDaoExt existingCancelDao = checkReqStatus(existingCancelDaoList.get(0));

			// if previous request is not rejected, then throw error
			if (!TxnStatusCancelEnum.REJECTED.name().equals(existingCancelDao.getStatus())) {
				throw new ServiceException(TRANSACTION_IS_ALREADY_REQUESTED_FOR_APPROVAL, ERR_SALE_107,
						"Transaction - '" + cancelRequestDto.getRefTxnId() + "' is already requested for approval.");
			}
			// else, update previous cancel DAO
			cancelRepoExt.save(existingCancelDao);
		}

		SalesTxnDaoExt salesTxn = new SalesTxnDaoExt();
		Object indvObject = null;
		SalesDocTypeEnum salesDocType = null;
		BigDecimal totalAmt = BigDecimal.ZERO;
		if (TxnTypeCancelEnum.CMCAN.name().equals(txnType)) {
			CashMemoDaoExt cashMemo = getCashMemoByIdWithErrorCheck(cancelRequestDto.getRefTxnId(),
					TransactionTypeEnum.CM.name(), subTxnType, null);
			salesTxn = cashMemo.getSalesTxnDao();

			salesDocType = SalesDocTypeEnum.CMCAN;
			indvObject = cashMemo;

			totalAmt = cashMemo.getFinalValue();

		}

		// check: IsBillCancelApprovalRequired is false || MAX_NO_OF_HOURS_FOR_CANCEL
		// should be less than (current time - confirmed time).
		LocationCashMemoDetailsDto locationCashMemoDetailsDto = getCMDetailsForCancel();
		if (BooleanUtils.isFalse(locationCashMemoDetailsDto.getIsBillCancelApprovalRequired())
				|| TxnTypeCancelEnum.CMCAN.name().equals(txnType) && BigDecimal
						.valueOf(CalendarUtils.getHourDifference(salesTxn.getConfirmedTime(),
								CalendarUtils.getCurrentDate()))
						.compareTo(locationCashMemoDetailsDto.getMaxNoOfHoursForBillCancel()) < 0) {
			throw new ServiceException(CANNOT_RISE_REQUEST_FOR_BILL_CANCELLATION, ERR_SALE_105,
					"Cannot rise request for bill cancellation. Reason - "
							+ (BooleanUtils.isFalse(locationCashMemoDetailsDto.getIsBillCancelApprovalRequired())
									? "Request approval for bill cancellation is not allowed for "
											+ CommonUtil.getLocationCode() + " location."
									: "Difference between billing time & current time has not exceeded 'max number of hours for cancel'. Bill can be cancelled without rasing request for id - '"
											+ cancelRequestDto.getRefTxnId() + "'"));
		}

		// create & save
		CancelDaoExt cancel = createCancelObject(confirmCancelDto, txnType, subTxnType, salesTxn, salesDocType,
				TxnStatusCancelEnum.PENDING.name());
		MapperUtil.beanMapping(indvObject, cancel, "id");
		cancel.setTotalValue(totalAmt);

		// first save - to get cancel id
		cancel = cancelRepoExt.save(cancel);

		// request for approval
		String requestDocNo = requestForApproval(cancel);
		cancelRepoExt.save(cancel);

		return new CancelAdvancePendingDto(cancel.getId(), cancel.getDocNo(), requestDocNo);
	}

	private CancelDaoExt getCancelDaoWithErrCheck(String id, String txnType, String subTxnType) {

		CancelDaoExt cancel = cancelRepoExt.findOneByIdAndTxnTypeAndSubTxnTypeAndLocationCode(id, txnType, subTxnType,
				CommonUtil.getLocationCode());

		if (cancel == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid cash memo id: " + id, Map.of("type", "cancellation"));
		}

		return cancel;
	}

	private CancelDaoExt checkReqStatus(CancelDaoExt cancel) {

		ReqApprovalDetailsDto reqApprovalDetailsDto = mapReqApprovalJsonToDto(cancel.getCancellationDetails());
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = checkBillCancelRequestStatus(
				reqApprovalDetailsDto.getProcessId());

		// if status is REJECTED, then update object
		if (WorkflowProcessStatusEnum.REJECTED.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			cancel.setStatus(TxnStatusCancelEnum.REJECTED.name());
		}

		return cancel;
	}

	private ReqApprovalDetailsDto mapReqApprovalJsonToDto(String reqApprovalDetails) {
		return MapperUtil.getObjectMapperInstance().convertValue(MapperUtil.getJsonFromString(reqApprovalDetails),
				ReqApprovalDetailsDto.class);
	}

	@Transactional
	@Override
	public void cancelPendingRequest(String id, String txnType, String subTxnType) {
		validateTxnAndSubTxnType(txnType, subTxnType);

		CancelDaoExt cancel = getCancelDaoWithErrCheck(id, txnType, subTxnType);

		if (!TxnStatusCancelEnum.PENDING.name().equals(cancel.getStatus())) {
			throw new ServiceException(SalesConstants.PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS,
					SalesConstants.ERR_SALE_053, "Transaction '" + id + "' is CLOSED.");
		}

		ReqApprovalDetailsDto reqApprovalDto = mapReqApprovalJsonToDto(cancel.getCancellationDetails());

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = checkBillCancelRequestStatus(
				reqApprovalDto.getProcessId());

		if (!WorkflowProcessStatusEnum.PENDING.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			throw new ServiceException(REQUEST_IS_ALREADY_PROCESSED, ERR_SALE_106,
					"Request is already processed. Request status is - "
							+ workflowProcessGetResponseDto.getApprovalStatus());
		}

		// cancel request
		Object msg = epossCallService.callEposs(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL + "/" + reqApprovalDto.getProcessId(),
				Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.BILL_CANCELLATION.name()), null, Object.class);

		// pending - message for?

		// based on msg cancel bill(update of cancel and requestApprovalDetails).
		reqApprovalDto.setMsgForCancel(msg.toString());
		cancel.setCancellationDetails(MapperUtil.getStringFromJson(reqApprovalDto));
		cancel.setStatus(TxnStatusCancelEnum.CANCELLED.name());

		cancelRepoExt.save(cancel);
	}

	@Transactional(value = "chainedTransaction")
	public PublishResponse confirmAfterApprovalTransactional(String id, String txnType, String subTxnType,
			ConfirmCancelAfterApprovalDto confirmCancelAfterApprovalDto) {
		validateTxnAndSubTxnType(txnType, subTxnType);
		CancelDaoExt cancel = getCancelDaoWithErrCheck(id, txnType, subTxnType);
		// no update allowed if cancellation is not in 'PENDING' status.
		if (!TxnStatusCancelEnum.PENDING.name().equals(cancel.getStatus())) {
			throw new ServiceException(SalesConstants.PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS,
					SalesConstants.ERR_SALE_053, "Transaction '" + id + "' is CLOSED.");
		}
		// check if remarks is present in table. If not then it should be
		// present in input.
		if (!StringUtils.isBlank(cancel.getRemarks())
				&& !StringUtils.isBlank(confirmCancelAfterApprovalDto.getRemarks())) {
			throw new ServiceException(REMARKS_CANNOT_BE_EDITED, ERR_SALE_317, REMARKS_CANNOT_BE_EDITED);
		} else if (StringUtils.isBlank(cancel.getRemarks())
				&& StringUtils.isBlank(confirmCancelAfterApprovalDto.getRemarks())) {
			throw new ServiceException(SalesConstants.PLEASE_PROVIDE_REMARKS, SalesConstants.ERR_SALE_170,
					"Please provide Remarks");
		}
		// map data from cancel DAO
		ConfirmCancelDto confirmCancelDto = (ConfirmCancelDto) MapperUtil.getObjectMapping(cancel,
				new ConfirmCancelDto());
		confirmCancelDto = (ConfirmCancelDto) MapperUtil.getObjectMapping(confirmCancelAfterApprovalDto,
				confirmCancelDto);
		confirmCancelDto.setRefTxnId(cancel.getRefSalesTxn().getId());
		// validate input
		verifyFieldLevel(confirmCancelDto, txnType, false);

		ReqApprovalDetailsDto reqApprovalDto = mapReqApprovalJsonToDto(cancel.getCancellationDetails());

		checkWorfkFlowStatus(cancel, reqApprovalDto);

		// update cancel DAO
		cancel.setCancellationDetails(MapperUtil.getStringFromJson(reqApprovalDto));
		cancel.setCancellationType(confirmCancelAfterApprovalDto.getCancelType());
		// update docDate
		cancel.setDocDate(businessDayService.getBusinessDay().getBusinessDate());
		// update status
		cancel.setStatus(TxnStatusCancelEnum.CONFIRMED.name());

		if (!StringUtils.isBlank(confirmCancelAfterApprovalDto.getRemarks())) {
			cancel.setRemarks(confirmCancelAfterApprovalDto.getRemarks());
		}

		Object indvObject = null;
		BigDecimal tcsAmount = BigDecimal.ZERO;
		if (TxnTypeCancelEnum.CMCAN.name().equals(txnType)) {
			CashMemoDaoExt cashMemoDao = cashMemoRepo.findOneByIdAndSalesTxnDaoLocationCode(
					cancel.getRefSalesTxn().getId(), CommonUtil.getLocationCode());
			indvObject = cashMemoDao;
			tcsAmount = tcsAmount.add(cashMemoDao.getTcsAmount());
		}

		log.info("Cancel invoice :- " + cancel.getRefSalesTxn().getId());
		cancel.getRefSalesTxn().setSrcSyncId(cancel.getRefSalesTxn().getSrcSyncId() + 1);
		cancel.setSrcSyncId(cancel.getSrcSyncId() + 1);

		List<InventoryDetailsDao> newInventoryDetails = addItemToInventory(cancel);

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		SalesTxnDaoExt salesTxn = getCashMemoByIdWithErrorCheck(confirmCancelDto.getRefTxnId(),
				TransactionTypeEnum.CM.name(), subTxnType, confirmCancelAfterApprovalDto.getCancelType())
						.getSalesTxnDao();
		eInvoiceCheck(salesTxn, cancel, confirmCancelDto);
		if (locationCacheDto != null && locationCacheDto.getStoreDetails().getIsDial()
				&& TxnTypeCancelEnum.CMCAN.name().equals(txnType)
				&& (salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.OPEN.name())
						|| salesTxn.getStatus().equalsIgnoreCase(TransactionStatusEnum.CANCELLED.name()))) {
			dialIntegration(confirmCancelDto, subTxnType, salesTxn);
		}
		rivaahCardEligibilityCount(salesTxn);
		CancelSyncStagingDto syncStagingDto = syncStagging(cancel.getRefSalesTxn(), cancel, txnType, subTxnType,
				confirmCancelAfterApprovalDto.getCancelType(), indvObject, reqApprovalDto.getProcessId(),
				newInventoryDetails);
		PublishResponse cancelPublishResponse = new PublishResponse();
		cancelPublishResponse.setApiResponse(new CancelAdvanceResponseDto(cancel.getId(), cancel.getDocNo(),
				syncStagingDto.getDocNos(), syncStagingDto.getCNDocTypes(), tcsAmount));
		cancelPublishResponse.setSyncStagingDto(syncStagingDto);
		return cancelPublishResponse;
	}

	/**
	 * @param cancel
	 * @param reqApprovalDto
	 * @return
	 */
	public WorkflowProcessGetResponseDto checkWorfkFlowStatus(CancelDaoExt cancel,
			ReqApprovalDetailsDto reqApprovalDto) {
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = checkBillCancelRequestStatus(
				reqApprovalDto.getProcessId());
		if (!WorkflowProcessStatusEnum.APPROVED.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {

			// update cancel object, otherwise if approval rejected,
			// cancel object status will not update due to ServiceException txn roll back
			if (WorkflowProcessStatusEnum.REJECTED.name().equals(workflowProcessGetResponseDto.getApprovalStatus())
					|| WorkflowProcessStatusEnum.CANCELLED.name()
							.equals(workflowProcessGetResponseDto.getApprovalStatus())) {
				cancelServiceImpl.updateCancelDao(cancel, workflowProcessGetResponseDto.getApprovalStatus(),
						workflowProcessGetResponseDto.getApprovedDate());
			}
			throw new ServiceException(REQUEST_IS_NOT_APPROVED, ERR_SALE_098,
					"Request status should be: " + WorkflowProcessStatusEnum.APPROVED.name() + ", found: "
							+ workflowProcessGetResponseDto.getApprovalStatus());
		}
		return workflowProcessGetResponseDto;
	}

	private String requestForApproval(CancelDaoExt cancel) {

		// header data
		BillCancellationHeaderDto billCancellationHeaderDto = (BillCancellationHeaderDto) MapperUtil
				.getObjectMapping(cancel, new BillCancellationHeaderDto());
		billCancellationHeaderDto.setInvoiceNo(cancel.getRefSalesTxn().getDocNo());
		billCancellationHeaderDto.setRefTxnId(cancel.getRefSalesTxn().getId());
		billCancellationHeaderDto.setRefTxnType(cancel.getRefSalesTxn().getTxnType());
		billCancellationHeaderDto.setRefSubTxnType(cancel.getRefSalesTxn().getSubTxnType());

		// customer details from customer master
		billCancellationHeaderDto = (BillCancellationHeaderDto) MapperUtil.getObjectMapping(
				customerService.getCustomer(cancel.getRefSalesTxn().getCustomerId()), billCancellationHeaderDto);

		// no request data

		// filter values
		Map<String, String> filterValues = Map.of("invoiceNo", String.valueOf(billCancellationHeaderDto.getInvoiceNo()),
				"mobileNumber", billCancellationHeaderDto.getMobileNumber(), "locationCode",
				CommonUtil.getLocationCode());

		// workFlowType BILL_CANCELLATION
		ReqApprovalDetailsDto reqApprovalDto = epossCallService.createWorkflowProcess(
				new JsonData("BILL_CANCELLATION_HEADER", billCancellationHeaderDto),
				new JsonData("BILL_CANCELLATION_DETAILS", null), filterValues, cancel.getRemarks(),
				WorkflowTypeEnum.BILL_CANCELLATION);

		cancel.setCancellationDetails(MapperUtil.getStringFromJson(reqApprovalDto));

		return String.valueOf(reqApprovalDto.getRequestNo());
	}

	private WorkflowProcessGetResponseDto checkBillCancelRequestStatus(String processId) {
		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.BILL_CANCELLATION.name());
		return epossCallService.callEposs(HttpMethod.GET, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId, reqParams,
				null, WorkflowProcessGetResponseDto.class);

	}

	private LocationCashMemoDetailsDto getCMDetailsForCancel() {
		LocationCashMemoDetailsDto locationCashMemoDetailsDto = commonCashMemoService.getCmDetailsFromLocation();
		if (locationCashMemoDetailsDto.getMaxNoOfHoursForBillCancel() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"CM details for 'MaxNoOfHoursForBillCancel' not found at location " + CommonUtil.getLocationCode());
		} else if (locationCashMemoDetailsDto.getIsBillCancelApprovalRequired() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023, "CM details for 'IsBillCancelApprovalRequired' not found at location "
							+ CommonUtil.getLocationCode());
		}

		return locationCashMemoDetailsDto;
	}

	/**
	 * This method will update cancel DAO if workflow sends any closed status.
	 * 
	 * @param cancel
	 * @param workflowStatus
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void updateCancelDao(CancelDaoExt cancel, String workflowStatus, Date rejectedOrCancelledDate) {

		String cancelDaoStatus = null;

		if (WorkflowProcessStatusEnum.REJECTED.name().equals(workflowStatus))
			cancelDaoStatus = TxnStatusCancelEnum.REJECTED.name();
		else if (WorkflowProcessStatusEnum.CANCELLED.name().equals(workflowStatus))
			cancelDaoStatus = TxnStatusCancelEnum.CANCELLED.name();

		if (cancelDaoStatus != null) {
			cancel.setStatus(cancelDaoStatus);
			// set rejected date if it's not null.
			if (rejectedOrCancelledDate != null)
				cancel.setDocDate(rejectedOrCancelledDate);
			cancelRepoExt.save(cancel);
		}

	}

	@Override
	public ReturnDto getHeaderPrintInfo(String txnId, TxnTypeCancelEnum txnType) {

		Optional<CancelDaoExt> cancels = cancelRepo.findByIdAndTxnTypeAndLocationCodeAndStatus(txnId, txnType.name(),
				CommonUtil.getStoreCode(), TransactionStatusEnum.CONFIRMED.name());

		if (!cancels.isPresent())
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070);

		com.titan.poss.sales.dao.CancelDaoExt cancel = cancels.get();
		ReturnDto returns = (ReturnDto) MapperUtil.getDtoMapping(cancel, ReturnDto.class);
		returns.setDocDateStr(CalendarUtils.formatToPrintableDate(returns.getDocDate()));
		returns.setSalesTxnId(cancel.getRefSalesTxn().getId());
		return returns;

	}
// ====================================== Data Sync Implementation ===================================

	@Override
	public CancelAdvanceResponseDto confirmCancel(ConfirmCancelDto confirmCancelDto, String txnType,
			String subTxnType) {

		// in case of billcancellation setting status as "CANCEL_WITH_CN" -- check with
		// rajani
		String status = TransactionStatusEnum.CANCELLED.name();
		try {
			PublishResponse response = cancelServiceImpl.confirmCancelTransactional(confirmCancelDto, txnType,
					subTxnType);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
				salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
			}
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(response.getApiResponse(), new TypeReference<CancelAdvanceResponseDto>() {
			});
		} catch (ServiceException e) {
			log.info("Error on {} {} for id {}. Reason: {}", txnType, status, confirmCancelDto.getRefTxnId(),
					("Message: " + e.getMessage() + " Cause: " + e.getErrorDetails() + " Dynamic Valuse: "
							+ e.getDynamicValues()));

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Message: " + e.getMessage()
						+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues());
			}

			throw e;
		} catch (Exception e) {
			log.info("Error on {} {} for id {}. Localized message: {}, message: {}", txnType, status,
					confirmCancelDto.getRefTxnId(), e.getLocalizedMessage(), e.getMessage());

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
	public CancelAdvanceResponseDto confirmAfterApproval(String id, String txnType, String subTxnType,
			ConfirmCancelAfterApprovalDto confirmCancelAfterApprovalDto) {

		String status = TransactionStatusEnum.CANCELLED.name();
		try {
			PublishResponse response = cancelServiceImpl.confirmAfterApprovalTransactional(id, txnType, subTxnType,
					confirmCancelAfterApprovalDto);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
				salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
			}
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(response.getApiResponse(), new TypeReference<CancelAdvanceResponseDto>() {
			});
		} catch (ServiceException e) {
			log.info("Error on cancel after approval {} {} for cancel id {}. Reason: {}", txnType, status, id,
					("Message: " + e.getMessage() + " Cause: " + e.getErrorDetails() + " Dynamic Valuse: "
							+ e.getDynamicValues()));

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

	public CancelSyncStagingDto syncStagging(SalesTxnDaoExt salesTxn, CancelDaoExt cancel, String txnType,
			String subTxnType, String cancelType, Object indvObject, String processId,
			List<InventoryDetailsDao> newInventoryDetails) {
		CancelSyncStagingDto cancelStagingDto = new CancelSyncStagingDto();
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		salesTxn = commonTxnService.saveSalesTxn(salesTxn);
		cancel.setSrcSyncId(cancel.getSrcSyncId() + 1);
		log.info("cancel id before getting saved in sync stagging", cancel.getId());
		cancel = cancelRepoExt.save(cancel);
		log.info("cancel id after getting saved in sync stagging", cancel.getId());
		CustomerTxnDaoExt customerTxn = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());

		// cancel GHS DV & payments
		Map<String, Integer> paymentCnDocNos = cancelDVAndPayments(salesTxn, cancel, txnType, subTxnType, cancelType,
				indvObject, customerTxn);

		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<CreditNoteDaoExt> creditNoteList = creditNoteRepository.findByCancelTxnId(cancel.getId());
			// if TEP or GEP cancel, then sync created CNs also.
			if (txnType.equals(TxnTypeCancelEnum.GEPCAN.name()) || txnType.equals(TxnTypeCancelEnum.TEPCAN.name())) {
				creditNoteList = CollectionUtils.isEmpty(creditNoteList) ? new ArrayList<>() : creditNoteList;
				creditNoteList.addAll(creditNoteRepository.findBySalesTxnId(cancel.getRefSalesTxn().getId()));
			}
			List<PaymentReversalDaoExt> paymentReversalList = paymentReveralRep.findByCancelId(cancel.getId());
			List<CustomerPaymentDaoExt> customerPaymentList = customerPaymentRepo
					.findAllByPaymentDetailsDaoSalesTxnDaoId(cancel.getRefSalesTxn().getId());
			syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxn,null), 0));
			syncDataList.add(DataSyncUtil.createSyncData(new CancelSyncDtoExt(cancel), 1));
			if (!paymentReversalList.isEmpty()) {
				List<PaymentReversalSyncDtoExt> syncDto = new ArrayList<>();
				Integer docNo = salesDocService.getDocNumber(SalesDocTypeEnum.PAYMENT_VOUCHER,  countryDetailsDto.getFiscalYear().shortValue());
				paymentReversalList.forEach(listExt -> {
					listExt.setPaymentVoucherNo(docNo);
					listExt.setSrcSyncId(listExt.getSrcSyncId() + 1);
					syncDto.add(new PaymentReversalSyncDtoExt(listExt));
				});
				
				paymentReveralRep.saveAll(paymentReversalList);
				syncDataList.add(DataSyncUtil.createSyncData(syncDto, 3));
			}
			if (!creditNoteList.isEmpty()) {
				List<CreditNoteSyncDtoExt> dtoExtList = new ArrayList<>();
				creditNoteList.forEach(sync -> {
					sync.setSrcSyncId(sync.getSrcSyncId() + 1);
					dtoExtList.add(new CreditNoteSyncDtoExt(sync));
				});
				creditNoteRepository.saveAll(creditNoteList);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 2));
			}
	         customerTxn.setMobileNumber(CryptoUtil.decrypt(customerTxn.getMobileNumber(),MOBILE_NO,false));
	        customerTxn.setEmailId(CryptoUtil.decrypt(customerTxn.getEmailId(),EMAIL_ID,false));
	        customerTxn.setCustomerName(CryptoUtil.decrypt(customerTxn.getCustomerName(),CUSTOMER_NAME,false));
	        customerTxn.setCustTaxNo(CryptoUtil.decrypt(customerTxn.getCustTaxNo(),CUST_TAX_NO,false));
	        customerTxn.setCustTaxNoOld(CryptoUtil.decrypt(customerTxn.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
	        customerTxn.setInstiTaxNo(CryptoUtil.decrypt(customerTxn.getInstiTaxNo(),INSTI_TAX_NO,false));
	        customerTxn.setPassportId(CryptoUtil.decrypt(customerTxn.getPassportId(),PASSPORT_ID,false));

			if (customerTxn != null) {
				customerTxn.setSrcSyncId(customerTxn.getSrcSyncId() + 1);
				customerTxn.setEmailId(CryptoUtil.encrypt(customerTxn.getEmailId() , EMAIL_ID));
				customerTxn.setMobileNumber(CryptoUtil.encrypt(customerTxn.getMobileNumber(), MOBILE_NO));
                customerTxn.setInstiTaxNo(CryptoUtil.encrypt( customerTxn.getInstiTaxNo() , INSTI_TAX_NO ));    
                customerTxn.setPassportId(CryptoUtil.encrypt(customerTxn.getPassportId(), PASSPORT_ID ));
                customerTxn.setCustTaxNo(CryptoUtil.encrypt(customerTxn.getCustTaxNo(),  CUST_TAX_NO));
                customerTxn.setCustomerName(CryptoUtil.encrypt(customerTxn.getCustomerName(), CUSTOMER_NAME ));      
                customerTxn.setCustTaxNoOld(CryptoUtil.encrypt(customerTxn.getCustTaxNoOld(),  CUST_TAX_NO_OLD )); 
                customerTxn.setIsEncrypted(Boolean.TRUE);
                customerTxn = cusTxnDetailsRepository.save(customerTxn);
				syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customerTxn), 4));
			}
			if (newInventoryDetails != null && !newInventoryDetails.isEmpty()) {
				syncDataList.add(DataSyncUtil.createSyncData(newInventoryDetails, 9));
			}
			if (!CollectionUtil.isEmpty(customerPaymentList)) {
				List<CustomerPaymentSyncDtoExt> synDtoExtList = new ArrayList<>();
				customerPaymentList.forEach(customerpayemnt -> {
					customerpayemnt.setSrcSyncId(customerpayemnt.getDestSyncId() + 1);
					synDtoExtList.add(new CustomerPaymentSyncDtoExt(customerpayemnt));
				});
				syncDataList.add(DataSyncUtil.createSyncData(synDtoExtList, 10));
				customerPaymentRepo.saveAll(customerPaymentList);
			}

			MessageRequest cancelMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.CANCEL_CONFIRM, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			cancelStagingDto.setMessageRequest(cancelMsgRequest);
			String cancelMsgRqst = MapperUtil.getJsonString(cancelMsgRequest);
			SyncStaging cancelSyncStaging = new SyncStaging();
			cancelSyncStaging.setMessage(cancelMsgRqst);
			cancelSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			cancelSyncStaging = saleSyncStagingRepository.save(cancelSyncStaging);
			cancelStagingDto.setId(cancelSyncStaging.getId());
			Map<String, String> cNDocTypes = new HashMap<>();

			getCNDetailsForCMCancel(creditNoteList, cNDocTypes, txnType);

			cancelStagingDto.setCNDocTypes(cNDocTypes);
		}

		// CLOSE request
		if (processId != null) {

			epossCallService.callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId,
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.BILL_CANCELLATION.name()), null, Object.class);
		}

		// set docNos
		cancelStagingDto.setDocNos(paymentCnDocNos);

		return cancelStagingDto;
	}

	private void getCNDetailsForCMCancel(List<CreditNoteDaoExt> creditNoteList, Map<String, String> cNDocTypes,
			String txnType) {
		if (!TxnTypeCancelEnum.CMCAN.name().equals(txnType)) {
			return;
		}

		cNDocTypes.put("TCS_CREDIT_NOTE",
				creditNoteList.stream()
						.filter(creditNote -> "TCS_CREDIT_NOTE".equalsIgnoreCase(creditNote.getCreditNoteType()))
						.map(cN -> cN.getDocNo().toString()).collect(Collectors.joining(",")));
		cNDocTypes.put("BILL_CANCELATION",
				creditNoteList.stream()
						.filter(creditNote -> !"TCS_CREDIT_NOTE".equalsIgnoreCase(creditNote.getCreditNoteType()))
						.map(cN -> cN.getDocNo().toString()).collect(Collectors.joining(",")));
	}

	/**
	 * @param salesTxn
	 * @param cancel
	 * @param txnType
	 * @param subTxnType
	 * @param cancelType
	 * @param indvObject
	 * @return paymentCnDocNos
	 */
	public Map<String, Integer> cancelDVAndPayments(SalesTxnDaoExt salesTxn, CancelDaoExt cancel, String txnType,
			String subTxnType, String cancelType, Object indvObject, CustomerTxnDaoExt customerTxn) {
		log.info("inside cancel dv and payments");
		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		List<GhsDiscountVoucherDto> dvList = null;
		// cancel DV
		if (discountTransactionDetails != null && discountTransactionDetails.getGhsDiscountDetails() != null
				&& !CollectionUtil.isEmpty(discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails())) {

			dvList = cancelDVInLoop(salesTxn, discountTransactionDetails);

			salesTxn.setDiscountTxnDetails(MapperUtil.getStringFromJson(discountTransactionDetails));
			salesTxn = commonTxnService.saveSalesTxn(salesTxn);

		}

		// releasing used employee coupon code
		releasingEmployeeCouponCode(salesTxn, discountTransactionDetails);

		// reverse TSSS discount
		reverseTSSSDiscountCouponCode(salesTxn, discountTransactionDetails);

		// reverse encircle discount if exists
		reverseUlpDiscount(salesTxn, discountTransactionDetails, customerTxn);

		// cancel payments
		Map<String, Integer> paymentCnDocNos = null;
		try {
			paymentCnDocNos = cancelPaymentsOrCN(cancel, txnType, subTxnType, cancelType, indvObject);

			// set cancelDao in payment_refunds table
			setCancelDaoInPaymentRefunds(cancel, salesTxn.getId());
		} catch (ServiceException e) {
			// if DV exists, update DV txn details.
			if (!CollectionUtil.isEmpty(dvList)) {
				cancelServiceImpl.saveDiscountDetails(salesTxn, discountTransactionDetails);
			}
			throw e;
		}

		return paymentCnDocNos;
	}

	private void reverseUlpDiscount(SalesTxnDaoExt salesTxn, DiscountTransactionDetails discountTransactionDetails,
			CustomerTxnDaoExt customerTxn) {
		
		if(salesTxn.getDiscountTxnDetails()!=null && discountTransactionDetails.getEncircleDetails()!=null) {
			if (StringUtils.isEmpty(discountTransactionDetails.getEncircleDetails().getUlpDiscountTxnId()) || BooleanUtils
					.isNotTrue(discountTransactionDetails.getEncircleDetails().getIsUlpDiscountFlagUpdated())) {
				return;
			}
		
		// Revert ULP availed flag
		UlpBillCancellationDto ulpBillCancellationDto = new UlpBillCancellationDto();
		ulpBillCancellationDto.setUlpId(customerTxn.getUlpId());
		ulpBillCancellationDto.setDiscountType(DiscountTypeEnum.getUlpDiscountType( discountTransactionDetails.getEncircleDetails().getDiscountType()));
		ulpBillCancellationDto.setInvoiceCancelDate(salesTxn.getDocDate());// as bill cancel is done on same day
		ulpBillCancellationDto.setTransactionId(discountTransactionDetails.getEncircleDetails().getUlpDiscountTxnId());
		UlpBaseResponseDto ulpDiscountReverseResponseDto = integrationServiceClient
				.reverseAvailedDiscount(VendorCodeEnum.ULP_NETCARROTS.name(), ulpBillCancellationDto);
		if (!"0".equals(ulpDiscountReverseResponseDto.getResponseCode())) {

			if("ERR-INT-026".equals(ulpDiscountReverseResponseDto.getResponseCode())) {
				log.info("Bill cancelled for ULP txn id: {} and dicount type: {}, error message: {}",discountTransactionDetails.getEncircleDetails().getUlpDiscountTxnId(),
						DiscountTypeEnum.getUlpDiscountType( discountTransactionDetails.getEncircleDetails().getDiscountType()),
						ulpDiscountReverseResponseDto.getResponseMessage());
			}else {

				Map<String, String> errorCause = Map.of("discountType",
						discountTransactionDetails.getEncircleDetails().getDiscountType(), "errorMessage",
						ulpDiscountReverseResponseDto.getResponseMessage());

				throw new ServiceException(null, ulpDiscountReverseResponseDto.getResponseCode(), errorCause);
			}
		}
	  }
	}

	private void reverseTSSSDiscountCouponCode(SalesTxnDaoExt salesTxn,
			DiscountTransactionDetails discountTransactionDetails) {

		if (discountTransactionDetails.getTsssDetails() != null
				&& !CollectionUtils.isEmpty(discountTransactionDetails.getTsssDetails().getCouponDetails())) {
			EmployeeCouponDetailDto employeeCouponDetailDto = discountTransactionDetails.getTsssDetails()
					.getCouponDetails().get(0);

			DiscountCouponDto tsssDiscountDto = new DiscountCouponDto();
			tsssDiscountDto.setCouponCode(employeeCouponDetailDto.getCouponCode());
			tsssDiscountDto.setDiscountId(employeeCouponDetailDto.getRedeemTxnId());
			tsssDiscountDto.setStatus(DiscountCouponStatusEnum.OPEN.name());

			// Redeem TSSS coupon code w.r.t EPOSS
			epossCallService.callEposs(HttpMethod.PATCH, TSSS_REDEMPTION_API_URL, null,
					new TSSSCouponRedeemDto(List.of(tsssDiscountDto)), DiscountCouponUpdateResponseDto.class);

			salesTxn.setDiscountTxnDetails(MapperUtil.getStringFromJson(discountTransactionDetails));
			salesTxn = commonTxnService.saveSalesTxn(salesTxn);

		}
		
	}

	/**
	 * @param salesTxn
	 * @param discountTransactionDetails
	 * @return
	 */
	public List<GhsDiscountVoucherDto> cancelDVInLoop(SalesTxnDaoExt salesTxn,
			DiscountTransactionDetails discountTransactionDetails) {
		List<GhsDiscountVoucherDto> dvList;
		dvList = discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails();
		boolean isError = false;
		ServiceException exception = null;

		for (GhsDiscountVoucherDto dvDto : dvList) {
			// need to call integration API to update in GHS
			if (DiscountSalesStatusEnum.CONFIRMED.name().equals(dvDto.getRedeemStatus())) {
				try {
					if (dvDto.getAccountNo() != null) {
						// call integration API
						integrationServiceClient.updateDiscountVoucher(VendorCodeEnum.GHS.name(), dvDto.getVoucherNo(),
								Integer.parseInt(dvDto.getAccountNo()), salesTxn.getDocNo().toString(),
								TransactionStatusEnum.REVERSED.name());
					}
					dvDto.setRedeemStatus("DELETED");
				} catch (ServiceException e) {
					log.info("DV redemption reversal failed for voucher no.: " + dvDto.getVoucherNo() + ". Exception: "
							+ e.getLocalizedMessage());
					isError = true;
					exception = e;
					break;
				}

			}
		}
		// set DV list with updated status
		discountTransactionDetails.getGhsDiscountDetails().setVoucherDetails(dvList);

		if (isError && dvList.size() != 1) {
			// save status for updated DVs if multiple DVs are present
			// update discountTxnDetils at sales_transaction table.
			cancelServiceImpl.saveDiscountDetails(salesTxn, discountTransactionDetails);
			throw exception;
		} else if (isError) {
			throw exception;
		}

		return dvList;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void saveDiscountDetails(SalesTxnDaoExt salesTxn, DiscountTransactionDetails discountTransactionDetails) {
		salesTxnRepositoryExt.updateDiscountTxnDetailsById(salesTxn.getId(),
				MapperUtil.getStringFromJson(discountTransactionDetails));
	}
}
