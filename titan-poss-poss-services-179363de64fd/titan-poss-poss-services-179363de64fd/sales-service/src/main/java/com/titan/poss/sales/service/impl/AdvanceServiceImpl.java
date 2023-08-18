/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
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
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.GrfDetails;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
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
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.AdvanceDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.AdvanceSyncDtoExt;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.CreditNoteSyncDtoExt;
import com.titan.poss.sales.dto.CustomerPaymentSyncDtoExt;
import com.titan.poss.sales.dto.CustomerTxnSyncDtoExt;
import com.titan.poss.sales.dto.EghsCNDetails;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PaymentDetailsSyncDtoExt;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.ManualBillValidationTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.dto.request.AdvanceConfirmDto;
import com.titan.poss.sales.dto.request.AdvanceMergeDto;
import com.titan.poss.sales.dto.request.AdvanceUpdateDto;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.FrozenRatesDetails;
import com.titan.poss.sales.dto.request.ManaulBillRequestDetailsDto;
import com.titan.poss.sales.dto.request.ManualBillGrfRequestHeaderDto;
import com.titan.poss.sales.dto.response.AdvMergeResDto;
import com.titan.poss.sales.dto.response.AdvanceDetailsDto;
import com.titan.poss.sales.dto.response.AdvanceDto;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CancelAdvanceResponseDto;
import com.titan.poss.sales.dto.response.CnGrfBasicDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.GRFLiteDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.repository.AdvanceRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.AdvanceService;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CommonTxnSycnService;
import com.titan.poss.sales.service.CreditNoteFacade;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.FileService;
import com.titan.poss.sales.service.PaymentFacadeService;
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
@Service("SalesAdvanceService")
public class AdvanceServiceImpl implements AdvanceService {

	@Autowired
	CommonTransactionServiceImpl commonTxnService;

	@Autowired
	private AdvanceService advService;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private AdvanceRepositoryExt advRepo;

	@Autowired
	CreditNoteService creditNoteService;

	@Autowired
	CreditNoteFacade creditNoteFacade;

	@Autowired
	SalesSyncStagingRepository salesSyncStagingRepository;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private CustomerPaymentRepositoryExt customerPaymentRepo;

	@Autowired
	EngineService engineService;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private CommonTransactionService commonTransactionService;
	
	@Autowired
	CommonPaymentService paymentUtil;
	
	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditDaoRepositoryExt;
	
	@Autowired
	private CommonTxnSycnService commonTxnSycnService;

	@Value("${app.name}")
	private String appName;

	private static final String INVALID_ID = "Invalid id";
	private static final String ERR_SALE_066 = "ERR-SALE-066";

	private static final String PAID = "Paid :- ";

	private static final String METAL = "metal";

	private static final String ADVANCE_DETAILS = "ADVANCE_DETAILS";

	private static final TransactionStatusEnum STATUS_ALLOWED_TO_EDIT = TransactionStatusEnum.OPEN;

	private static final TransactionStatusEnum STATUS_ALLOWED_TO_EDIT_APPROVAL = TransactionStatusEnum.APPROVAL_PENDING;

	private static final TransactionTypeEnum TXN_TYPE_ALLOWED = TransactionTypeEnum.ADV;

	private void validateTxnAndSubTxnType(String txnType, String subTxnType) {
		commonTxnService.validateTxnAndSubTxnType(TXN_TYPE_ALLOWED, txnType, subTxnType);
	}

	private static final String CUST_TAX_NO = "custTaxNo";
    private static final String MOBILE_NO = "mobileNo";
    private static final String EMAIL_ID =  "emailId";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String INSTI_TAX_NO = "instiTaxNo";
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	@Override
	@Transactional
	public TransactionResponseDto openAdvance(String txnType, String subTxnType,
			TransactionCreateDto transactionCreateDto) {

		validateTxnAndSubTxnType(txnType, subTxnType);

		SalesTxnDaoExt salesTxn = commonTxnService.createSalesTxnObj(null, null, TransactionStatusEnum.OPEN,
				SalesDocTypeEnum.ADV_OPEN, TransactionTypeEnum.valueOf(txnType), SubTxnTypeEnum.valueOf(subTxnType),
				null, null);

		AdvanceDaoExt adv = new AdvanceDaoExt();
		adv.setSalesTxn(salesTxn);
		if (SubTxnTypeEnum.MANUAL_FROZEN_RATES.name().equals(subTxnType)) {
			commonTxnService.validateManualBillDetails(transactionCreateDto, salesTxn);
		}
		boolean isGRF = subTxnType.equals(SubTxnTypeEnum.FROZEN_RATES.name());

		if (isGRF) {
			MetalRateListDto metalRateList = commonTxnService.getMetalRate();
			salesTxn.setMetalRateDetails(MapperUtil.getStringFromJson(metalRateList));
		} else {
			AdvanceDetailsDto advDetails = new AdvanceDetailsDto(false);
			adv.setAdvanceDetails(new JsonData(ADVANCE_DETAILS, advDetails).toString());
		}
		adv.setSrcSyncId(0);
		adv.setDestSyncId(0);
		salesTxn.setSrcSyncId(0);
		salesTxn.setDestSyncId(0);
		salesTxn = commonTxnService.saveSalesTxn(salesTxn);
		advRepo.save(adv);
		TransactionResponseDto response = (TransactionResponseDto) MapperUtil.getDtoMapping(salesTxn,
				TransactionResponseDto.class);
		if (SubTxnTypeEnum.MANUAL_FROZEN_RATES.name().equals(subTxnType)) {
			response.setManualBillDetails(commonTxnService.mapJsonToManualBillDetails(salesTxn.getManualBillDetails()));
		}
		return response;
	}

	@Override
	@Transactional
	public void updateAdvance(String id, AdvanceUpdateDto advUpdateDto, String txnType, String subTxnType) {

		validateTxnAndSubTxnType(txnType, subTxnType);
//		boolean isValid = commonTransactionService.validateCustomerFields(advUpdateDto.getCustomerId());
//
//		if (!isValid) {
//			throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING,
//					SalesConstants.ERR_CUST_001, "Mandatory fields of customer details are missing");
//		}

		AdvanceDaoExt adv = getById(id);
		SalesTxnDaoExt salesTxn = getSalesTxnAfterVerifyingTxnType(txnType, subTxnType, adv);
		verifyTxnAllowedToUpdate(salesTxn);

		if (advUpdateDto.getCustomerId() != null)
			commonTxnService.updateCustomerDetails(advUpdateDto.getCustomerId(), salesTxn);

		if (advUpdateDto.getTotalValue() != null)
			adv.setFinalValue(advUpdateDto.getTotalValue());

		if (StringUtils.isNotBlank(advUpdateDto.getEmployeeCode()))
			salesTxn.setEmployeeCode(advUpdateDto.getEmployeeCode());

		if (StringUtils.isNotBlank(advUpdateDto.getMetalType())) {
			FrozenRatesDetails frd = new FrozenRatesDetails();
			frd.setMetal(advUpdateDto.getMetalType());
			adv.setFrozenRateDetails(
					MapperUtil.getStringFromJson(new JsonData(SalesConstants.FROZEN_RATE_DETAILS, frd)));
		}

		if (subTxnType.equals(SubTxnTypeEnum.NON_FROZEN_RATES.name()) && advUpdateDto.getIsPaymentForEGHS() != null) {
			AdvanceDetailsDto advDetails = new AdvanceDetailsDto(advUpdateDto.getIsPaymentForEGHS());
			adv.setAdvanceDetails(new JsonData(ADVANCE_DETAILS, advDetails).toString());
		}

		adv.setSrcSyncId(adv.getSrcSyncId() + 1);
		salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
		commonTxnService.saveSalesTxn(salesTxn);
		advRepo.save(adv);
	}

	private void saveSalesAndAdv(SalesTxnDaoExt salesTxn, AdvanceDaoExt adv) {
		commonTxnService.saveSalesTxn(salesTxn);
		advRepo.save(adv);
	}

	@Override
	@Transactional
	public void deleteAdvance(String id, String remarks, String txnType, String subTxnType) {

		validateTxnAndSubTxnType(txnType, subTxnType);

		AdvanceDaoExt adv = getById(id);
		SalesTxnDaoExt salesTxn = getSalesTxnAfterVerifyingTxnType(txnType, subTxnType, adv);
		verifyTxnAllowedToUpdate(salesTxn);

		BigDecimal totalPaidValue = commonTxnService.paidValue(salesTxn.getId(), null, null);

		if (totalPaidValue.signum() > 0)
			throw new ServiceException("Transaction can not be deleted. Reverse all payments.", "ERR-SALE-054",
					PAID + totalPaidValue);

		salesTxn.setRemarks(remarks);
		adv.setFinalValue(BigDecimal.ZERO);

		// generate doc no. for delete also for consistency
		salesTxn = commonTxnService.setNewDocNoByDocType(SalesDocTypeEnum.CT_DELETE, salesTxn);
		salesTxn.setStatus(TransactionStatusEnum.DELETED.name());
		adv.setSrcSyncId(adv.getSrcSyncId() + 1);
		salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
		saveSalesAndAdv(salesTxn, adv);
	}

	@Override
	@Transactional(value = "chainedTransaction")
	public PublishResponse confirmAdvanceTransactional(String id, AdvanceConfirmDto advConfirmDto, String txnType,
			String subTxnType, String status) {

		log.debug("Confirming txnId: {} of subTxnType: {}", id, subTxnType);
		boolean isGRF = subTxnType.equals(SubTxnTypeEnum.FROZEN_RATES.name())
				|| subTxnType.equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name());

		validateTxnAndSubTxnType(txnType, subTxnType);

		if (isGRF) {
			// weightAgreed, metalRateList mandatory for GRF
			checkMissingFieldInDto(advConfirmDto);
//			if (subTxnType.equals(SubTxnTypeEnum.FROZEN_RATES.name()))
//				commonTxnService.validateLatestMetalRate(advConfirmDto.getMetalRateList());
		}

		AdvanceDaoExt adv = getById(id);
		SalesTxnDaoExt salesTxn = getSalesTxnAfterVerifyingTxnType(txnType, subTxnType, adv);
		verifyTxnAllowedToUpdate(salesTxn);

		if (!StringUtil.isNull(status) && TransactionStatusEnum.APPROVAL_PENDING.name().equals(status)
				&& subTxnType.equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name())) {
			workFlowApprovalGrf(adv, salesTxn, advConfirmDto);
			adv.setSrcSyncId(adv.getSrcSyncId() + 1);
			salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
			saveSalesAndAdv(salesTxn, adv);
			SyncStagingDto syncStagingDto = null;
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				syncStagingDto = syncStaggingAdvance(adv, salesTxn, null, null, SalesOperationCode.ADVANCE_CONFIRM);
			PublishResponse response = new PublishResponse();
			response.setSyncStagingDto(syncStagingDto);
			response.setApiResponse(
					new CancelAdvanceResponseDto(adv.getId(), salesTxn.getDocNo(), null, null, BigDecimal.ZERO));
			return response;
		}
		if (!StringUtil.isNull(status) && TransactionStatusEnum.CONFIRMED.name().equals(status)
				&& subTxnType.equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name())
				&& salesTxn.getManualBillDetails() != null) {
			ManualBillTxnDetailsDto manualBillDetails = commonTxnService
					.mapJsonToManualBillDetails(salesTxn.getManualBillDetails());
			if (ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {

				String approvalStatus = checkManualBillRequestStatus(manualBillDetails);

				if (!WorkflowProcessStatusEnum.APPROVED.name().equals(approvalStatus)) {
					throw new ServiceException("Request is not approved.", "ERR-SALE-098", "Request status should be: "
							+ WorkflowProcessStatusEnum.APPROVED.name() + ", found: " + approvalStatus);
				}

			}
		}

//		in DAO layer, like metal, customer id etc never passed in PATCH API
		verifyMandatoryFieldsExist(adv, salesTxn);

		BigDecimal updatedRatePerUnit = null;
		if (isGRF)
			updatedRatePerUnit = getUpdatedMetalRateWithExistCheck(adv, advConfirmDto.getMetalRateList());

		// cash limit check:
		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				salesTxn.getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				CommonUtil.getLocationCode(), PaymentStatusEnum.COMPLETED.name());
		Calendar cal1 = Calendar.getInstance();
		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		BigDecimal totalCashPaid = BigDecimal.ZERO;

		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.getCashCollectedByTransactionIdAndPaymentCodes(salesTxn.getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), CommonUtil.getLocationCode(),
						PaymentStatusEnum.COMPLETED.name());
		
		CashPaymentDetailsDto cashPaymentDetails = paymentUtil.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
	    totalCashPaid=totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
	    totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());
		

		if (totalCashPaid != null && BigDecimal.ZERO.compareTo(totalCashPaid) < 0) {
			InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
					totalCashPaid, totalPmlaCashAmount);

			log.debug("Doing cash limit check");
			customerPaymentService.cashLimitCheck(instrumentCashAmountDto, null, null, adv.getSalesTxn(),
					adv.getSalesTxn().getCustomerId(), false);
		}

		BigDecimal totalPaidValue = commonTxnService.paidValue(salesTxn.getId(), null, null);
		matchInputWRecord(advConfirmDto, salesTxn, totalPaidValue);

		if (totalPaidValue.compareTo(adv.getFinalValue()) != 0)
			throw new ServiceException(
					"Transaction can not be confirmed. Total value & total paid amount is different.", "ERR-SALE-069",
					PAID + totalPaidValue + ", final :- " + adv.getFinalValue());

		// customer details check, if final value exceeds configuration
		log.info("customer details check, if final value exceeds configuration");
		commonTxnService.customerDetailsCheckForFinalValue(adv.getFinalValue(), salesTxn);

		if (isGRF) {
			log.info("GRF txn. Verifying weight agreed details");
			verifyWeightAgreedNew(updatedRatePerUnit, advConfirmDto.getWeightAgreed(), adv.getFinalValue());

			JsonData jsonData = MapperUtil.mapObjToClass(adv.getFrozenRateDetails(), JsonData.class);
			FrozenRatesDetails frd = MapperUtil.mapObjToClass(jsonData.getData(), FrozenRatesDetails.class);
			String metal = null;
			try {
				JsonNode root = MapperUtil.getObjectMapperInstance().readTree(adv.getFrozenRateDetails());
				metal = root.path("data").path(METAL).asText();
			} catch (Exception e) {
				log.debug("parsing failed. Error: {}", e);
			}
			frd.setMetal(metal);
			frd.setRatePerUnit(updatedRatePerUnit);
			frd.setWeight(advConfirmDto.getWeightAgreed());

			adv.setFrozenRateDetails(new JsonData(jsonData.getType(), frd).toString());
		}

		salesTxn = commonTxnService.setNewDocNoByDocType(SalesDocTypeEnum.ADV, salesTxn);
		salesTxn.setMetalRateDetails(MapperUtil.getStringFromJson(advConfirmDto.getMetalRateList()));
		salesTxn.setRemarks(advConfirmDto.getRemarks());
		salesTxn.setStatus(TransactionStatusEnum.CONFIRMED.name());
		salesTxn.setConfirmedTime(CalendarUtils.getCurrentDate());
		adv.setSrcSyncId(adv.getSrcSyncId() + 1);
		salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
		saveSalesAndAdv(salesTxn, adv);
		List<PaymentDetailsDaoExt> paymentList = paymentDetailsRepository.findBySalesTxnDaoId(salesTxn.getId());
		Map<String, Integer> cNdocNos = createCreditNote(adv, salesTxn, totalCashPaid, paymentList);

		// if txn status is 'CONFIRMED' update 'isEditable' to false for all payments in
		// the txn and add to customer payment.
		if (TransactionStatusEnum.CONFIRMED.name().equals(salesTxn.getStatus())
				&& !CollectionUtil.isEmpty(paymentList)) {

			customerPaymentService.addCustomerPayment(salesTxn, List.of(), paymentList, adv.getFinalValue(),
					BigDecimal.ZERO, false, BigDecimal.valueOf(1));

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
		SyncStagingDto syncStagingDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncStagingDto = syncStaggingAdvance(adv, salesTxn, paymentList, null, SalesOperationCode.ADVANCE_CONFIRM);
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncStagingDto);
		response.setApiResponse(
				new CancelAdvanceResponseDto(adv.getId(), salesTxn.getDocNo(), cNdocNos, null, BigDecimal.ZERO));
		return response;

	}

	private String checkManualBillRequestStatus(ManualBillTxnDetailsDto manualBillDetails) {
		if (StringUtils.isEmpty(manualBillDetails.getManualBillDetails().getProcessId())) {
			return "";
		}

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.MANUAL_BILL_GRF.name());
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = epossCallService.callEposs(HttpMethod.GET,
				SalesUtil.WORKFLOW_PROCESS_URL + "/" + manualBillDetails.getManualBillDetails().getProcessId(),
				reqParams, null, WorkflowProcessGetResponseDto.class);

		return workflowProcessGetResponseDto.getApprovalStatus();

	}

	private void workFlowApprovalGrf(AdvanceDaoExt adv, SalesTxnDaoExt salesTxn, AdvanceConfirmDto advConfirmDto) {
		ManualBillTxnDetailsDto manualBillDetails = commonTxnService
				.mapJsonToManualBillDetails(salesTxn.getManualBillDetails());

		if (!ManualBillValidationTypeEnum.REQUEST_APPROVAL.name().equals(manualBillDetails.getValidationType())) {
			throw new ServiceException("Invalid Request: Please check id or type or status", "ERR-SALE-090",
					"Mismatch between Manual Bill validation type and status");
		}
		ListResponse<SalesPaymentDto> paymentDtoList = paymentFacadeService.getPaymentDetails(salesTxn.getId(), null,
				null, null);

		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(advConfirmDto.getRemarks());

		ManualBillGrfRequestHeaderDto manaulBillRequestHeaderDto = (ManualBillGrfRequestHeaderDto) MapperUtil
				.getObjectMapping(adv, new ManualBillGrfRequestHeaderDto());

		manaulBillRequestHeaderDto.setManualBillDetails(manualBillDetails);
		manaulBillRequestHeaderDto.setTxnType(TransactionTypeEnum.GRF.name());
		manaulBillRequestHeaderDto.setId(salesTxn.getId());

		manaulBillRequestHeaderDto = (ManualBillGrfRequestHeaderDto) MapperUtil.getObjectMapping(advConfirmDto,
				manaulBillRequestHeaderDto);

		// customer details from customer master
		manaulBillRequestHeaderDto = (ManualBillGrfRequestHeaderDto) MapperUtil
				.getObjectMapping(customerService.getCustomer(salesTxn.getCustomerId()), manaulBillRequestHeaderDto);
		if (!StringUtils.isEmpty(salesTxn.getEmployeeCode()))
			manaulBillRequestHeaderDto.setEmployeeCode(salesTxn.getEmployeeCode());

		workflowProcessCreateDto.setHeaderData(new JsonData("GRF_MANUAL_BILL_HEADER", manaulBillRequestHeaderDto));

		ManaulBillRequestDetailsDto manaulBillRequestDetailsDto = new ManaulBillRequestDetailsDto();
		manaulBillRequestDetailsDto.setPaymentList(paymentDtoList.getResults());

		workflowProcessCreateDto.setRequestData(new JsonData("GRF_MANUAL_BILL_DETAILS", manaulBillRequestDetailsDto));

		workflowProcessCreateDto
				.setFilterValues(Map.of("manualBillNo", manualBillDetails.getManualBillDetails().getManualBillNo(),
						"locationCode", CommonUtil.getLocationCode()));

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.MANUAL_BILL_GRF.name());

		WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = epossCallService.callEposs(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL, reqParams, workflowProcessCreateDto,
				WorkflowProcessCreateResponseDto.class);

		manualBillDetails.getManualBillDetails().setProcessId(workflowProcessCreateResponseDto.getProcessId());
		manualBillDetails.getManualBillDetails().setRequestNo(workflowProcessCreateResponseDto.getDocNo());

		salesTxn.setManualBillDetails(MapperUtil.getStringFromJson(manualBillDetails));

		commonTxnService.getSalesTxnDao(salesTxn, TransactionTypeEnum.ADV.name(), salesTxn.getSubTxnType(),
				SalesDocTypeEnum.GRF_PENDING, TransactionStatusEnum.APPROVAL_PENDING);

	}

	@Override
	@Transactional(value = "chainedTransaction")
	public PublishResponse mergeRateFreezeTransactional(AdvanceMergeDto advMergeDto, String txnType,
			String subTxnType) {
		log.debug("Merging CN for customer: {}", advMergeDto.getCustomerId());

		checkForGRFValidation(txnType, subTxnType);

		// verify if merging GRF CN allowed
		mergeCNAllowedCheck();

		SalesTxnDaoExt salesTxn = commonTxnService.createSalesTxnObj(null, advMergeDto.getEmployeeCode(),
				TransactionStatusEnum.OPEN, SalesDocTypeEnum.ADV, TransactionTypeEnum.valueOf(txnType),
				SubTxnTypeEnum.valueOf(subTxnType), null, null);

		AdvanceDaoExt adv = new AdvanceDaoExt();

		adv.setSalesTxn(salesTxn);

		commonTxnService.updateCustomerDetails(advMergeDto.getCustomerId(), salesTxn);

		// customer id is mandatory to do CONFIRMED, & for confirm customer_txn required
		// hence creating OPEN, then setting customer, then changing status to CONFIRMED
		salesTxn.setStatus(TransactionStatusEnum.CONFIRMED.name());
		salesTxn = salesTxnRepo.save(salesTxn);

		// DO file operation before doing merging CN
		int docCount = CollectionUtil.getSize(advMergeDto.getTempFileIds());

		if (advMergeDto.getTempFileIds() != null) {
			log.debug("converting temp file to permanent files");

			String newId;
			for (Map.Entry<String, List<String>> entry : advMergeDto.getTempFileIds().entrySet()) {
				for (String tempId : entry.getValue()) {
					newId = fileService.updateTempFile(salesTxn.getId(), advMergeDto.getCustomerId(),
							UploadFileDocTypeEnum.MERGE_GRF.name(), entry.getKey(), tempId);
					log.trace("Updated temp file to permanent one. tempId: {}, Id: {}", entry.getValue(), newId);
				}
			}

		}

		log.debug("calling CN merge functionalities");
		CNResponeDtoExt cnRes = creditNoteFacade.mergeCNForGRF(advMergeDto.getIds(), salesTxn,
				advMergeDto.getCustomerId(), advMergeDto.getRemarks(), docCount);

		adv.setFrozenRateDetails(cnRes.getFrozenRateDetails().toString());
		adv.setFinalValue(cnRes.getAmount());

		commonTxnService.customerDetailsCheckForFinalValue(adv.getFinalValue(), salesTxn);

		adv = advRepo.save(adv);

		// how to map CN to this txn? ASK SHAIK
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = syncStaggingAdvance(adv, salesTxn, null, advMergeDto.getIds(), SalesOperationCode.GRF_MERGE);
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncDto);
		response.setApiResponse(
				new AdvMergeResDto(adv.getId(), salesTxn.getDocNo(), cnRes.getDocNo(), cnRes.getAmount()));
		return response;

	}

	private void checkForGRFValidation(String txnType, String subTxnType) {

		if (!TXN_TYPE_ALLOWED.name().equals(txnType))
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060,
					"Allowed txnType: [" + TXN_TYPE_ALLOWED + "]");

		if (!subTxnType.equals(SubTxnTypeEnum.FROZEN_RATES.name())
				&& !subTxnType.equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name()))
			throw new ServiceException(SalesConstants.INVALID_SUB_TRANSACTION_TYPE, SalesConstants.ERR_SALE_059,
					"Allowed subTxnType: [" + SubTxnTypeEnum.FROZEN_RATES.name() + ","
							+ SubTxnTypeEnum.MANUAL_FROZEN_RATES.name() + "]");
	}

	private void mergeCNAllowedCheck() {

		boolean isAllowed = false;

		Boolean isMergeCNAllowed = null;
		LocationCacheDto locationDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		GrfDetails grfDetails = locationDto.getGrfDetails();
		isMergeCNAllowed = grfDetails.getIsMergeCNAllowed();
		isAllowed = BooleanUtils.isTrue(isMergeCNAllowed);

		if (!isAllowed) {
			throw new ServiceException("Merging of CN not allowed", "ERR-SALE-220",
					"isMergeCNAllowed? " + isMergeCNAllowed);
		}
	}

	private BigDecimal getUpdatedMetalRateWithExistCheck(AdvanceDaoExt adv, MetalRateListDto metalRateList) {

		String metal = null;
		try {
			JsonNode root = MapperUtil.getObjectMapperInstance().readTree(adv.getFrozenRateDetails());
			metal = root.path("data").path(METAL).asText();
		} catch (Exception e) {
			log.debug("parsing failed. Error: {}", e);
		}

		StandardPriceResponseDto stdPriceResDto = metalRateList.getMetalRates().get(metal);

		if (stdPriceResDto == null)
			throw new ServiceException(SalesConstants.RATE_NOT_FOUND_FOR_REQUIRED_METAL, SalesConstants.ERR_SALE_083,
					"Rate not set for metal - " + metal);

		return stdPriceResDto.getRatePerUnit();
	}

	private void checkMissingFieldInDto(AdvanceConfirmDto advConfirmDto) {

		Set<String> missingFields = new HashSet<>();

		if (advConfirmDto.getMetalRateList() == null)
			missingFields.add("metalRateList");

		if (advConfirmDto.getWeightAgreed() == null)
			missingFields.add("weightAgreed");

		if (!missingFields.isEmpty())
			throw new ServiceException("Some mandatory fields are missing in this transaction", "ERR-SALE-082",
					missingFields);
	}

	private void matchInputWRecord(AdvanceConfirmDto advConfirmDto, SalesTxnDaoExt salesTxn,
			BigDecimal totalPaidValue) {
		List<String> diffValueFields = new ArrayList<>();
		if (advConfirmDto.getCustomerId() - salesTxn.getCustomerId() != 0)
			diffValueFields.add("customerId :- " + salesTxn.getCustomerId());
		if (advConfirmDto.getPaidValue().compareTo(totalPaidValue) != 0)
			diffValueFields.add(PAID + totalPaidValue);

		if (!diffValueFields.isEmpty())
			throw new ServiceException("Some fields value are different in this transaction", "ERR-SALE-068",
					diffValueFields);
	}

	private void verifyWeightAgreedNew(BigDecimal updatedRatePerUnit, BigDecimal weightAgreed, BigDecimal finalValue) {

		BigDecimal metalAllowed = finalValue.divide(updatedRatePerUnit, DomainConstants.WEIGHT_SCALE,
				DomainConstants.ROUNDIND_MODE);

		if (metalAllowed.compareTo(weightAgreed) != 0)
			throw new ServiceException("Metal agreed is different than metal allowed", "ERR-SALE-085",
					"Metal allowed :- " + metalAllowed);

	}

	/**
	 * @param adv
	 * @param salesTxn
	 */
	private void verifyMandatoryFieldsExist(AdvanceDaoExt adv, SalesTxnDaoExt salesTxn) {
		Set<String> missingFields = new HashSet<>();

		if (salesTxn.getCustomerId() == null)
			missingFields.add("customerId");
		if (salesTxn.getEmployeeCode() == null)
			missingFields.add("employeeCode");
		if (adv.getFinalValue() == null)
			missingFields.add("totalValue");

		// get Object from string, fetch by key, check that key exist
		if (salesTxn.getSubTxnType().equals(SubTxnTypeEnum.FROZEN_RATES.name())
				|| salesTxn.getSubTxnType().equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name())) {

			String metal = null;
			try {

				if (adv.getFrozenRateDetails() != null) {
					JsonNode root = MapperUtil.getObjectMapperInstance().readTree(adv.getFrozenRateDetails());
					metal = root.path("data").path(METAL).asText();
				}
			} catch (Exception e) {
				log.debug("parsing failed. Error: {}", e);
			}

			if (StringUtils.isBlank(metal)) {
				missingFields.add(METAL);
			}

		}

		if (!missingFields.isEmpty())
			throw new ServiceException("Some mandatory fields are missing in this transaction", "ERR-SALE-082",
					missingFields);
	}

	private void verifyTxnAllowedToUpdate(SalesTxnDaoExt salesTxn) {

		businessDayService.getBusinessDay().getBusinessDate();
		if (!salesTxn.getStatus().equals(STATUS_ALLOWED_TO_EDIT.name())
				&& !salesTxn.getStatus().equals(STATUS_ALLOWED_TO_EDIT_APPROVAL.name()))
			throw new ServiceException(INVALID_ID, ERR_SALE_066, salesTxn.getStatus());
	}

	private SalesTxnDaoExt getSalesTxnAfterVerifyingTxnType(String txnType, String subTxnType, AdvanceDaoExt adv) {
		SalesTxnDaoExt salesTxn = adv.getSalesTxn();

		if (!salesTxn.getTxnType().equals(txnType) || !salesTxn.getSubTxnType().equals(subTxnType))
			throw new ServiceException(INVALID_ID, ERR_SALE_066);

		return salesTxn;
	}

	private Map<String, Integer> createCreditNote(AdvanceDaoExt adv, SalesTxnDaoExt salesTxn, BigDecimal totalCashPaid,
			List<PaymentDetailsDaoExt> paymentList) {
		Map<String, Integer> docNos = new HashMap<>();
		List<CreditNoteResponse> cnListResponse;
		CreditNoteIndvCreateDto cnIndvDto = new CreditNoteIndvCreateDto();
		cnIndvDto.setCreditNoteType(CNType.ADV.toString());
		cnIndvDto.setAmount(adv.getFinalValue());
		cnIndvDto.setFrozenRateDetails(adv.getFrozenRateDetails());
		log.info("Cash Paid in current txn to CN: " + totalCashPaid);
		cnIndvDto.setCashCollected(totalCashPaid);

		if (adv.getAdvanceDetails() != null) {
			JsonData advDetailsJson = MapperUtil.mapObjToClass(adv.getAdvanceDetails(), JsonData.class);
			AdvanceDetailsDto advDetails = MapperUtil.mapObjToClass(advDetailsJson.getData(), AdvanceDetailsDto.class);
			EghsCNDetails eghsDetails = new EghsCNDetails();
			eghsDetails.setIsPaymentForEGHS(advDetails.getIsPaymentForEGHS());
			cnIndvDto.setEghsDetails(MapperUtil.getStringFromJson(new JsonData("EGHS_DETAILS", eghsDetails)));
		}

		CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
		boolean isMultiple = false;
		CNPaymentDetailsDto cNPaymentDetailsDto = new CNPaymentDetailsDto();
		if (!paymentList.isEmpty()) {
			Map<String, String> payments = new HashMap<>();
			Date chequeDate = null;
			
			for (PaymentDetailsDaoExt payment : paymentList) {
				
				if(PaymentCodeEnum.UNIPAY.name().equals(payment.getPaymentCode()) && !CollectionUtils.isEmpty(payments) ) {
					isMultiple = true;
				}
				payments.put(payment.getPaymentCode(), payment.getInstrumentType());
				
				if (PaymentCodeEnum.CHEQUE.getPaymentcode().equals(payment.getPaymentCode())) {
					chequeDate = payment.getInstrumentDate();
					cNPaymentDetailsDto.setInstrumentNumber(payment.getInstrumentNo());
					cNPaymentDetailsDto.setBankName(payment.getBankName());
					
				}
				if (PaymentCodeEnum.DD.getPaymentcode().equals(payment.getPaymentCode())) {
					cNPaymentDetailsDto.setInstrumentNumber(payment.getInstrumentNo());
					cNPaymentDetailsDto.setBankName(payment.getBankName());
					
				}
				if(BigDecimal.valueOf(paymentList.size()) == BigDecimal.ONE && PaymentCodeEnum.UNIPAY.name().equals(payment.getPaymentCode()))
				{
					JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
					Object response = JsonUtils.getValueFromJson(jsonData.getData(), "response", Object.class);
					cNPaymentDetailsDto.setUnipayID(JsonUtils.getValueFromJson(response, "utid", String.class));
					cNPaymentDetailsDto.setHostname(payment.getHostName());
					cNPaymentDetailsDto.setPaymentId(payment.getId());
					cNPaymentDetailsDto.setBankInvoiceNo(JsonUtils.getValueFromJson(response, "bankInvoiceNumber", String.class));
					cNPaymentDetailsDto.setTxnDate(JsonUtils.getValueFromJson(response, "txnDate", String.class));
					cNPaymentDetailsDto.setBankName(JsonUtils.getValueFromJson(response, "acquirerBank", String.class));
				}
				if(isMultiple) {
					cNPaymentDetailsDto.setUnipayID(null);
					cNPaymentDetailsDto.setPaymentId(null);
					cNPaymentDetailsDto.setBankInvoiceNo(null);
					cNPaymentDetailsDto.setTxnDate(null);
					cNPaymentDetailsDto.setHostname(null);
				}
				
			}

			cNPaymentDetailsDto
					.setIsGeneratedForUnipayDeletion(payments.size()==1 &&  payments.containsKey(PaymentCodeEnum.UNIPAY.getPaymentcode()));
			cNPaymentDetailsDto.setRTGS(payments.size()==1 &&  payments.containsKey(PaymentCodeEnum.RTGS.getPaymentcode()));
			cNPaymentDetailsDto.setCheque(payments.size()==1 &&  payments.containsKey(PaymentCodeEnum.CHEQUE.getPaymentcode()));
			cNPaymentDetailsDto.setChequeDate(chequeDate);// useful to check realisation days when using CN
			cNPaymentDetailsDto.setPaymentCodes(payments);
			
			cnIndvDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cNPaymentDetailsDto));
			cnIndvDto.setIsUnipay(paymentList.size() == 1 && payments.containsKey(PaymentCodeEnum.UNIPAY.getPaymentcode()));		}
		cnDto.setSalesTxn(salesTxn);
		cnDto.setCustomerId(salesTxn.getCustomerId());
		cnDto.setCNIndividual(List.of(cnIndvDto));
		cnDto.setRefDocNo(cnDto.getSalesTxn().getDocNo());
		cnDto.setRefFiscalYear(cnDto.getSalesTxn().getFiscalYear());
		
		if (TransactionTypeEnum.ADV.name().equals(cnDto.getSalesTxn().getTxnType())
				&& SubTxnTypeEnum.FROZEN_RATES.name().equals(cnDto.getSalesTxn().getSubTxnType())) {

			cnDto.setRefDocType(TransactionTypeEnum.GRF.name());
		} else {
			cnDto.setRefDocType(cnDto.getSalesTxn().getTxnType());
		}

		cnListResponse = creditNoteService.createNewCreditNote(cnDto);

		cnListResponse.forEach(cn -> docNos.put(cn.getId(), cn.getDocNo()));
		return docNos;
	}

	@Override
	public AdvanceDaoExt getById(String id) {
		Optional<AdvanceDaoExt> advs = advRepo.findByIdAndSalesTxnLocationCode(id, CommonUtil.getStoreCode());
		if (!advs.isPresent())
			throw new ServiceException(INVALID_ID, ERR_SALE_066);
		return advs.get();
	}

	@Override
	public AdvanceDto getAdvance(String id, String txnType, String subTxnType) {

		validateTxnAndSubTxnType(txnType, subTxnType);

		AdvanceDaoExt adv = getById(id);
		SalesTxnDaoExt salesTxnDao = getSalesTxnAfterVerifyingTxnType(txnType, subTxnType, adv);

		// update invoke time - should this be updated after ADV confirm also?
		salesTxnDao.setInvokeTime(CalendarUtils.getCurrentDate());
		if (salesTxnDao.getInvokeCount() == null) {
			salesTxnDao.setInvokeCount(1);
		} else {
			salesTxnDao.setInvokeCount(salesTxnDao.getInvokeCount() + 1);
		}
		salesTxnRepository.save(salesTxnDao);

		return advanceResponse(adv, salesTxnDao, subTxnType);

	}

	@Override
	public AdvanceDto advanceResponse(AdvanceDaoExt adv, SalesTxnDaoExt salesTxn, String subTxnType) {
		AdvanceDto advDto = (AdvanceDto) MapperUtil.getDtoMapping(salesTxn, AdvanceDto.class);

		advDto.setFinalValue(adv.getFinalValue());
		if (subTxnType.equals(SubTxnTypeEnum.FROZEN_RATES.name())
				|| subTxnType.equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name())) {
			advDto.setFrozenRateDetails(MapperUtil.getJsonFromString(adv.getFrozenRateDetails()));
		} else {
			advDto.setAdvanceDetails(MapperUtil.getJsonFromString(adv.getAdvanceDetails()));
		}

		if (salesTxn.getStatus().equals(TransactionStatusEnum.CONFIRMED.name())) {
			// get CN generated for this txn
			//List<CreditNoteDaoExt> cns = creditNoteService.getCreditNotesBySalesTxn(salesTxn);
			List<CreditNoteDaoExt> cns = creditNoteRepository.findAllBySalesTxnIdAndLocationCode(salesTxn.getId(),CommonUtil.getLocationCode());
 			if (!cns.isEmpty()) {
				CreditNoteDaoExt cn = cns.get(0);
				advDto.setCnDocNo(cn.getDocNo());
				// try if merged CN is there only if it is rate frozen sub txn type
				if (subTxnType.equals(SubTxnTypeEnum.FROZEN_RATES.name())
						|| subTxnType.equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name())) {
					List<CreditNoteDaoExt> mergedCnDaos = creditNoteRepository.findAllByMergedCN(cn);
					if (CollectionUtil.isNotEmpty(mergedCnDaos)) {
						List<CnGrfBasicDto> mergedCNs = mergedCnDaos.stream()
								.map(cnDao -> (CnGrfBasicDto) MapperUtil.getDtoMapping(cnDao, CnGrfBasicDto.class))
								.collect(Collectors.toList());
						advDto.setMergedCNs(mergedCNs);
					}
				}

			}
		}
		if (SubTxnTypeEnum.MANUAL_FROZEN_RATES.name().equals(subTxnType)) {
			advDto.setManualBillDetails(commonTxnService.mapJsonToManualBillDetails(salesTxn.getManualBillDetails()));
		}
		Optional<CustomerTxnDaoExt> customerTxnDao = cusTxnDetailsRepository.findById(adv.getId());
		customerTxnDao.ifPresent(custTxnDao -> {
			advDto.setCustTaxNo(CryptoUtil.decrypt(custTxnDao.getCustTaxNo(), CUST_TAX_NO,false));
			advDto.setCustTaxNoOld(CryptoUtil.decrypt(custTxnDao.getCustTaxNoOld(), CUST_TAX_NO_OLD,false));
			advDto.setMobileNo(CryptoUtil.decrypt(custTxnDao.getMobileNumber(), MOBILE_NO,false));
			advDto.setEmailId(CryptoUtil.decrypt(custTxnDao.getEmailId(), EMAIL_ID,false));
			advDto.setInstiTaxNo(CryptoUtil.decrypt(custTxnDao.getInstiTaxNo(), INSTI_TAX_NO,false));
			advDto.setCustomerName(CryptoUtil.decrypt(custTxnDao.getCustomerName(), CUSTOMER_NAME,false));
		    advDto.setPassportId(CryptoUtil.decrypt(custTxnDao.getPassportId(),PASSPORT_ID,false));		
		    });
		return advDto;
	}

	@Override
	public ListResponse<GRFLiteDto> getRateFreezeList(Integer customerId, String txnType, String subTxnType) {
		checkForGRFValidation(txnType, subTxnType);
		return new ListResponse<>(advRepo.getByCustomerByIdAndTxnType(customerId, CommonUtil.getStoreCode(), txnType,
				subTxnType, TransactionStatusEnum.CONFIRMED.name(), CNStatus.OPEN.name()));
	}
//=============================================== Data-sync Implementation =================================================

	@Override
	public CancelAdvanceResponseDto confirmAdvance(String id, AdvanceConfirmDto advConfirmDto, String txnType,
			String subTxnType, String status) {
		try {
			boolean isValid = commonTransactionService.validateCustomerFields(advConfirmDto.getCustomerId());
			if (!isValid) {
				throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING,
						SalesConstants.ERR_CUST_001, "Mandatory fields of customer details are missing");
			}
			PublishResponse advanceResponse = advService.confirmAdvanceTransactional(id, advConfirmDto, txnType,
					subTxnType, status);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
				salesSyncDataService.publishSalesMessagesToQueue(advanceResponse.getSyncStagingDto());
			}
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(advanceResponse.getApiResponse(), new TypeReference<CancelAdvanceResponseDto>() {
			});
		} catch (ServiceException e) {
			log.info("Error on {} {} for id {}. Reason: {}", txnType, status, id, ("Message: " + e.getMessage()
					+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues()));

			// set error message to thread local (for audit)
			if (!CollectionUtil.isEmpty(DocNoFailAuditThreadLocal.getDocNoFailData())) {
				DocNoFailAuditThreadLocal.getDocNoFailData().get(0).setFailReason("Message: " + e.getMessage()
						+ " Cause: " + e.getErrorDetails() + " Dynamic Valuse: " + e.getDynamicValues());
			}

			throw e;
		} catch (Exception e) {
			log.info("Error on {} {} for id {}. Localized message: {}, message: {}", txnType, status, id,
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
	public AdvMergeResDto mergeRateFreeze(AdvanceMergeDto advMergeDto, String txnType, String subTxnType) {
		boolean isValid = commonTransactionService.validateCustomerFields(advMergeDto.getCustomerId());
		if (!isValid) {
			throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING,
					SalesConstants.ERR_CUST_001, "Mandatory fields of customer details are missing");
		}
		PublishResponse advanceResponse = advService.mergeRateFreezeTransactional(advMergeDto, txnType, subTxnType);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			salesSyncDataService.publishSalesMessagesToQueue(advanceResponse.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(advanceResponse.getApiResponse(), new TypeReference<AdvMergeResDto>() {
		});
	}

	public SyncStagingDto syncStaggingAdvance(AdvanceDaoExt adv, SalesTxnDaoExt salesTxn,
			List<PaymentDetailsDaoExt> paymentList, List<String> cnIdList, String operation) {
		List<CustomerPaymentDaoExt> customerPaymentList = new ArrayList<>();
		List<CreditNoteDaoExt> creditNoteList = creditNoteRepository.findBySalesTxnId(salesTxn.getId());
		if (cnIdList != null && !cnIdList.isEmpty()) {
			List<CreditNoteDaoExt> mergedCnList = creditNoteRepository.findAllById(cnIdList);
			creditNoteList.addAll(mergedCnList);
		}
		CustomerTxnDaoExt customer = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());
        customer.setMobileNumber(CryptoUtil.decrypt(customer.getMobileNumber(),MOBILE_NO,false));
        customer.setEmailId(CryptoUtil.decrypt(customer.getEmailId(),EMAIL_ID,false));
        customer.setCustomerName(CryptoUtil.decrypt(customer.getCustomerName(),CUSTOMER_NAME,false));
        customer.setCustTaxNo(CryptoUtil.decrypt(customer.getCustTaxNo(),CUST_TAX_NO,false));
        customer.setCustTaxNoOld(CryptoUtil.decrypt(customer.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
        customer.setInstiTaxNo(CryptoUtil.decrypt(customer.getInstiTaxNo(),INSTI_TAX_NO,false));
        customer.setPassportId(CryptoUtil.decrypt(customer.getPassportId(),PASSPORT_ID,false));
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = List.of(AppTypeEnum.EPOSS.name());
		syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxn,null), 0));
		syncDataList.add(DataSyncUtil.createSyncData(new AdvanceSyncDtoExt(adv), 1));
		if (paymentList != null && !paymentList.isEmpty() && SalesOperationCode.ADVANCE_CONFIRM.equals(operation)) {
			List<String> paymentIds = new ArrayList<>();
			List<PaymentDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
			paymentList.forEach(daoExt -> {
				if (daoExt.getCreditNoteDao() != null) {
					creditNoteList.add(daoExt.getCreditNoteDao());
				} else if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(daoExt.getPaymentCode())) {
					// if payment done by CN
					Optional<CreditNoteDaoExt> credit = creditNoteRepository.findById(daoExt.getReference3());
					credit.ifPresent(dbCn -> {
						if (creditNoteList.stream().map(CreditNoteDaoExt::getId)
								.noneMatch(dbCn.getId()::equalsIgnoreCase))
							creditNoteList.add(dbCn);
					});
					// if child CN is generated as part of partial redemption:
					JsonData jsonData = MapperUtil.mapObjToClass(daoExt.getOtherDetails(), JsonData.class);
					CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
							CreditNotePaymentOtherDetailsDto.class);
					if (!StringUtils.isEmpty(cnOtherDetails.getNewCnId())) {
						Optional<CreditNoteDaoExt> childCn = creditNoteRepository.findById(cnOtherDetails.getNewCnId());
						childCn.ifPresent(dbCn -> {
							if (creditNoteList.stream().map(CreditNoteDaoExt::getId)
									.noneMatch(dbCn.getId()::equalsIgnoreCase)) {
								creditNoteList.add(dbCn);
							}
						});
					}
				}
				paymentIds.add(daoExt.getId());
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new PaymentDetailsSyncDtoExt(daoExt));
			});
			paymentDetailsRepository.saveAll(paymentList);
			customerPaymentList = customerPaymentRepo.findAllByPaymentDetailsDaoIdIn(paymentIds);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 3));
		}
		if (!creditNoteList.isEmpty()) {
			List<CreditNoteSyncDtoExt> dtoExtList = creditNoteList.stream().map(cn -> {
				cn.setSrcSyncId(cn.getDestSyncId() + 1);
				return new CreditNoteSyncDtoExt(cn);
			}).collect(Collectors.toList());
			dtoExtList.sort(Comparator.comparing(CreditNoteSyncDtoExt::getFiscalYear)
					.thenComparing(CreditNoteSyncDtoExt::getDocNo));
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 2));
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
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customer), 4));
		}
		if (!customerPaymentList.isEmpty() && SalesOperationCode.ADVANCE_CONFIRM.equals(operation)) {
			List<CustomerPaymentSyncDtoExt> synDtoExtList = customerPaymentList.stream().map(cusPay -> {
				cusPay.setSrcSyncId(cusPay.getDestSyncId() + 1);
				return new CustomerPaymentSyncDtoExt(cusPay);
			}).collect(Collectors.toList());
			syncDataList.add(DataSyncUtil.createSyncData(synDtoExtList, 5));
			customerPaymentRepo.saveAll(customerPaymentList);
		}
		MessageRequest advanceMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto advanceStagingDto = new SyncStagingDto();
		advanceStagingDto.setMessageRequest(advanceMsgRequest);
		String advanceMsg = MapperUtil.getJsonString(advanceMsgRequest);
		SyncStaging advanceSyncStaging = new SyncStaging();
		advanceSyncStaging.setMessage(advanceMsg);
		advanceSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		advanceSyncStaging = salesSyncStagingRepository.save(advanceSyncStaging);
		advanceStagingDto.setId(advanceSyncStaging.getId());
		return advanceStagingDto;
	}

}
