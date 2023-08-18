/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.IntegrationPaymentStatusEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationPaymentDetails;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.DateEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.PaymentRequestCommonDto;
import com.titan.poss.sales.dto.PaymentRequestOtherDetails;
import com.titan.poss.sales.dto.PaymentRequestSearchDto;
import com.titan.poss.sales.dto.PaymentRequestSyncDto;
import com.titan.poss.sales.dto.constants.PaymentRequestEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreatePaymentRequestDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.ROPaymentRequestDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.PendingPaymentDto;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.PaymentRequestService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesDateUtil;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for PendingPaymentService.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesPendingPaymentService")
public class PaymentRequestServiceImpl implements PaymentRequestService {

	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private CreditNoteService creditNoteService;
	
	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;
	
	@Autowired
	private PaymentRequestService paymentRequestService;
	
	@Autowired
	private SalesSyncDataService salesSyncDataService;
	
	
   
	
	@Value("${app.name}")
	private String appName;


	private static final List<String> PAYMENT_CODE_LIST_FOR_REQUEST = List.of(
			PaymentCodeEnum.RO_PAYMENT.getPaymentcode(), PaymentCodeEnum.AIRPAY.getPaymentcode(),
			PaymentCodeEnum.RAZOR_PAY.getPaymentcode());

	private static final List<String> PAYMENT_CODE_VALID_FOR_RESEND = List.of(PaymentCodeEnum.AIRPAY.getPaymentcode(),
			PaymentCodeEnum.RAZOR_PAY.getPaymentcode());

	private static final List<String> STATUS_FOR_TRIGGER_OF_VALIDATE_PAYMENT = List.of(PaymentRequestEnum.OPEN.name(),
			PaymentRequestEnum.IN_PROGRESS.name(), PaymentRequestEnum.FAILED.name());

	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	private static final String ERR_SALE_132 = "ERR-SALE-132";
	private static final String PAYMENT_CANNOT_BE_CLOSED = "Payment cannot be closed.";

	private PendingPaymentDto mapPaymentRequestDaoToDto(PaymentRequestsDao paymentRequestsDao) {
		PendingPaymentDto pendingPaymentDto = (PendingPaymentDto) MapperUtil.getObjectMapping(paymentRequestsDao,
				new PendingPaymentDto());

		PaymentRequestOtherDetails paymentRequestOtherDetails = getOtherDetails(paymentRequestsDao.getOtherDetails());

		// map CustomerlocationMap to response
		mapCustomerIdAndLocation(paymentRequestsDao.getCustomerLocationMap(), pendingPaymentDto);

		pendingPaymentDto.setLoginId(CommonUtil.getUserName());

		pendingPaymentDto.setOtherDetails(MapperUtil.mapObjToClass(
				new JsonData(pendingPaymentDto.getPaymentCode(), paymentRequestOtherDetails), JsonData.class));

		return pendingPaymentDto;
	}

	private void mapCustomerIdAndLocation(CustomerLocationMappingDao customerLocationMap,
			PendingPaymentDto pendingPaymentDto) {
		pendingPaymentDto.setCustomerId(customerLocationMap.getCustomerLocationMappingId().getCustomerId());
		pendingPaymentDto.setLocationCode(customerLocationMap.getCustomerLocationMappingId().getLocationCode());
	}

	@Override
	public PagedRestResponse<List<PendingPaymentDto>> listPendingPayments(String paymentCode,
			PaymentRequestSearchDto paymentRequestSearchDto, Pageable pageable) {

		// if status list is empty, then set to null
		if (CollectionUtils.isEmpty(paymentRequestSearchDto.getStatus())) {
			paymentRequestSearchDto.setStatus(null);
		}

		// for ROPAYMENT, if isWorkFlowApproval, referenceId will be present
		/// if Manual approval, then referenceId will be null.
		// for AIRPAY and RAZOR PAY, if online payment, referenceId will be present,
		// else(offline) referenceId will be null.

		// get business date
		Date businessDate;
		try {
			businessDate = businessDayService.getBusinessDay().getBusinessDate();
		} catch (Exception e) {
			businessDate = CalendarUtils.getTodayStartDateAndTime();
		}

		// Date
		Date startingDate = SalesDateUtil.getStartDateBasedOnInputDate(paymentRequestSearchDto.getDateRangeType(),
				paymentRequestSearchDto.getStartDate(), paymentRequestSearchDto.getEndDate(), businessDate);
		if (PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(paymentCode)
				&& StringUtils.isEmpty(paymentRequestSearchDto.getDateRangeType())) {
			startingDate = null;// to list previous RO payments the next day, for payment
		}

		Date endingDate = CalendarUtils.getCurrentDate();
		if (DateEnum.CUSTOM.toString().equals(paymentRequestSearchDto.getDateRangeType())) {
			endingDate = CalendarUtils.getEndOfDay(paymentRequestSearchDto.getEndDate());
		}

		Page<PaymentRequestsDao> pendingPaymentDaoList = paymentRequestsRepository.listPendingPayments(paymentCode,
				paymentRequestSearchDto, CommonUtil.getStoreCode(), paymentRequestSearchDto.getIsWorkFlowApproval(),
				startingDate, endingDate, pageable);

		List<PendingPaymentDto> pendingPaymentDtoList = new ArrayList<>();

		pendingPaymentDaoList.getContent().forEach(paymentRequestsDao -> {

			if (paymentRequestsDao.getPaymentCode().equals(PaymentCodeEnum.RAZOR_PAY.getPaymentcode())
					&& paymentRequestsDao.getStatus().equals(PaymentRequestEnum.FAILED.name())) {
				PaymentRequestOtherDetails paymentRequestOtherDetails = getOtherDetails(
						paymentRequestsDao.getOtherDetails());
				if (StringUtils.isEmpty(paymentRequestOtherDetails.getErrorCode())
						&& StringUtils.isEmpty(paymentRequestOtherDetails.getErrorMessage())) {

					PaymentVerifyResponseDto paymentVerifyResponseDto = integrationService.verifyPaymentStatus(
							VendorCodeEnum.PAYMENT_RAZORPAY.name(), paymentRequestsDao.getReferenceId());

					if (!StringUtils.isEmpty(paymentVerifyResponseDto.getErrorCode())
							&& !StringUtils.isEmpty(paymentVerifyResponseDto.getResponseMesssage())) {
						paymentRequestOtherDetails.setErrorCode(paymentVerifyResponseDto.getErrorCode());
						paymentRequestOtherDetails.setErrorMessage(paymentVerifyResponseDto.getResponseMesssage());
					} else {
						paymentRequestOtherDetails.setErrorCode("BAD_REQUEST_ERROR");
						paymentRequestOtherDetails.setErrorMessage("Reason not found");
					}

					paymentRequestsDao.setOtherDetails(MapperUtil.getStringFromJson(
							new JsonData(paymentRequestsDao.getPaymentCode(), paymentRequestOtherDetails)));

					
				    paymentRequestsRepository.save(paymentRequestsDao);
				
				}
				
			}

			PendingPaymentDto pendingPaymentDto = mapPaymentRequestDaoToDto(paymentRequestsDao);
			pendingPaymentDtoList.add(pendingPaymentDto);
		});

		return new PagedRestResponse<>(pendingPaymentDtoList, pendingPaymentDaoList);
	}

	@Override
	@Transactional
	public PendingPaymentDto createPendingPayemtRequest(CreatePaymentRequestDto pendingPaymentRequestDto,
			Date docDate) {
		log.info("Create payment req:- " + pendingPaymentRequestDto.getPaymentCode() + ", customer id:"
				+ pendingPaymentRequestDto.getCustomerId());

		docDate = docDate != null ? docDate : businessDayService.getBusinessDay().getBusinessDate();
		String locationCode = CommonUtil.getStoreCode();

		// payment code check?
		if (!PAYMENT_CODE_LIST_FOR_REQUEST.contains(pendingPaymentRequestDto.getPaymentCode())) {
			throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
					"Payment code: '" + pendingPaymentRequestDto.getPaymentCode() + "' not allowed for request.");
		}

		CustomerDetailsDto customerDto = customerService.getCustomer(pendingPaymentRequestDto.getCustomerId());

		// check if customer id exists.
		if (customerDto == null) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, "Record not found for customerId "
					+ pendingPaymentRequestDto.getCustomerId() + " at location " + locationCode);
		}

		// get fiscal year & currency code
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(locationCode);
		if (StringUtils.isEmpty(countryDetailsDto.getFiscalYear())
				|| StringUtils.isEmpty(countryDetailsDto.getCurrencyCode())) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"Fiscal year  or Currency code is not defined for location: " + locationCode);
		}

		PaymentRequestsDao paymentRequestDao = (PaymentRequestsDao) MapperUtil
				.getObjectMapping(pendingPaymentRequestDto, new PaymentRequestsDao());
		paymentRequestDao.setRequestedBy(CommonUtil.getEmployeeCode());
		paymentRequestDao.setRequestedDate(docDate);
		paymentRequestDao.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		paymentRequestDao.setCurrencyCode(countryDetailsDto.getCurrencyCode());

		// set customerId and location code
		setCustomerLocMapping(pendingPaymentRequestDto.getCustomerId(), paymentRequestDao);

		// if ROPAYMENT, then
		String processId = null;
		if (PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(pendingPaymentRequestDto.getPaymentCode())) {
			JsonData regionCodeAndIsROApproval = roPaymentChecks(customerDto.getUlpId(), pendingPaymentRequestDto,
					locationCode);

			// call workflow process & get reference id if online approval.
			if (BooleanUtils.isTrue((Boolean) regionCodeAndIsROApproval.getData())) {
				processId = requestForApproval(pendingPaymentRequestDto, paymentRequestDao, customerDto,
						regionCodeAndIsROApproval.getType());
			} else {
				manualApproval(paymentRequestDao);
			}
		} else {
			airpayOrRazorPayPayment(pendingPaymentRequestDto, paymentRequestDao, customerDto);
		}

		if (PaymentRequestEnum.APPROVED.name().equals(paymentRequestDao.getStatus())
				|| PaymentRequestEnum.COMPLETED.name().equals(paymentRequestDao.getStatus())) {
			paymentRequestDao.setDocDate(docDate);
		}

		PaymentRequestOtherDetails paymentRequestOtherDetails = StringUtil
				.isBlankJsonStr(paymentRequestDao.getOtherDetails())
				|| StringUtil
						.isBlankJsonData(MapperUtil.mapObjToClass(paymentRequestDao.getOtherDetails(), JsonData.class))
								? new PaymentRequestOtherDetails()
								: getOtherDetails(paymentRequestDao.getOtherDetails());

		paymentRequestOtherDetails.setCustomerName(customerDto.getCustomerName());
		paymentRequestOtherDetails.setCustomerTitle(customerDto.getTitle());
		paymentRequestOtherDetails.setCustomerMobileNumber(customerDto.getMobileNumber());
		paymentRequestOtherDetails.setUlpId(customerDto.getUlpId());
		if (processId != null) {
			paymentRequestOtherDetails.setReferenceId(processId);
		}
		if (PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(pendingPaymentRequestDto.getPaymentCode())
				&& PaymentRequestEnum.APPROVED.name().equals(paymentRequestDao.getStatus())) {
			paymentRequestOtherDetails.setApprovedTime(CalendarUtils.getCurrentDate());
		}
		// set other details to DAO
		paymentRequestDao.setOtherDetails(MapperUtil.getStringFromJson(
				new JsonData(pendingPaymentRequestDto.getPaymentCode(), paymentRequestOtherDetails)));
     //   paymentRequestsRepository.save(paymentRequestDao);
		if(paymentRequestDao != null) {
			salesPaymentStaging(paymentRequestDao);
		}
		return mapPaymentRequestDaoToDto(paymentRequestDao);
	}

	@Override
	@Transactional
	public PendingPaymentDto closePendingPayment(String id, BigDecimal untilizedAmount, Boolean isGenerateCN,
			Date docDate) {

		PaymentRequestsDao paymentRequestsDao = getPaymentRequestIfExists(id);
		docDate = docDate == null ? businessDayService.getBusinessDay().getBusinessDate() : docDate;

		if (!(PaymentRequestEnum.COMPLETED.name().equals(paymentRequestsDao.getStatus())
				|| PaymentRequestEnum.APPROVED.name().equals(paymentRequestsDao.getStatus()))) {
			throw new ServiceException(PAYMENT_CANNOT_BE_CLOSED, ERR_SALE_132, " Payment status valid for closing: "
					+ PaymentRequestEnum.COMPLETED.name() + ", " + PaymentRequestEnum.APPROVED.name());
		}

		// generate CN iff payment completed & complete amount is utilized or utilized
		// amount is null.
		if (BooleanUtils.isTrue(isGenerateCN)) {
			if (untilizedAmount == null || paymentRequestsDao.getAmount().compareTo(untilizedAmount) == 0) {
				generateCNForClosedPaymentRequest(paymentRequestsDao);
			} else {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"Cannot generate CN for partial utilization of payment for request id: " + id);
			}
		}

		paymentRequestsDao.setStatus(PaymentRequestEnum.CLOSED.name());
		paymentRequestsDao.setUtilizedAmount(untilizedAmount);
		paymentRequestsDao.setDocDate(docDate);
		paymentRequestsRepository.save(paymentRequestsDao);


		PaymentRequestOtherDetails paymentRequestOtherDetails = getOtherDetails(paymentRequestsDao.getOtherDetails());
		if (PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(paymentRequestsDao.getPaymentCode())
				&& !StringUtils.isEmpty(paymentRequestOtherDetails.getReferenceId())) {
			epossCallService.callEposs(HttpMethod.POST,
					SalesUtil.WORKFLOW_PROCESS_URL + "/" + paymentRequestOtherDetails.getReferenceId(),
					Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.APPROVE_RO_PAYMENT.name()), null, Object.class);

		}

		return mapPaymentRequestDaoToDto(paymentRequestsDao);
	}

	private JsonData roPaymentChecks(String ulpId, PaymentRequestCommonDto pendingPaymentRequestDto,
			String locationCode) {
		// 1. customer should have loyalty account.
		if (StringUtils.isEmpty(ulpId)) {
			throw new ServiceException(SalesConstants.CUSTOMER_IS_NOT_ELIGIBLE_FOR_PAYMENT, SalesConstants.ERR_SALE_024,
					"Customer not eligible for payment request: " + pendingPaymentRequestDto.getPaymentCode());
		}

		// 2. Check if requestReason is present or not
		if (StringUtils.isEmpty(pendingPaymentRequestDto.getRequestedReason())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Requested reason is mandatory for payment request: " + pendingPaymentRequestDto.getPaymentCode());
		}

		boolean isWorkflowApproval;
		// 3. check location for online or offline Approval.
		LocationCacheDto locationCacheDto = paymentUtil.getPaymentDetailsFromLocation();

		if (!StringUtils.isEmpty(locationCacheDto.getPaymentDetails().getRtgs())) {
			// check isROApprovedByWorkflow is true, if yes then workflow
			if (BooleanUtils.isTrue(locationCacheDto.getPaymentDetails().getRtgs().getIsROApprovedByWorkflow())) {
				isWorkflowApproval = true;
			} else if (BooleanUtils
					.isFalse(locationCacheDto.getPaymentDetails().getRtgs().getIsROApprovedByWorkflow())) {
				isWorkflowApproval = false;
			} else {
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"Configuration details not present for field: isROApprovedByWorkflow under paymentDetails in "
								+ locationCode + " location.");
			}
		} else {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration details not present for field: isROApprovedByWorkflow under paymentDetails in "
							+ locationCode + " location.");
		}

		return new JsonData(locationCacheDto.getRegionCode(), isWorkflowApproval);
	}

	private String requestForApproval(PaymentRequestCommonDto pendingPaymentRequestDto,
			PaymentRequestsDao paymentRequestDao, CustomerDetailsDto customerDto, String regionCode) {

		// call workflow process & get reference id.

		ROPaymentRequestDto rOPaymentRequestDto = new ROPaymentRequestDto();
		rOPaymentRequestDto.setCustomerId(pendingPaymentRequestDto.getCustomerId());
		rOPaymentRequestDto.setPaymentCode(pendingPaymentRequestDto.getPaymentCode());
		rOPaymentRequestDto.setAmount(pendingPaymentRequestDto.getAmount());
		rOPaymentRequestDto.setCustomerName(customerDto.getCustomerName());
		rOPaymentRequestDto.setCustomerTitle(customerDto.getTitle());
		rOPaymentRequestDto.setCustomerMobileNumber(customerDto.getMobileNumber());
		rOPaymentRequestDto.setRequestorEmployeeCode(CommonUtil.getEmployeeCode());
		rOPaymentRequestDto.setLocationCode(CommonUtil.getStoreCode());

		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(pendingPaymentRequestDto.getRequestedReason());
		// set header data
		workflowProcessCreateDto.setHeaderData(new JsonData("APPROVE_RO_PAYMENT_HEADER", rOPaymentRequestDto));
		// filter values
		// pending - mobile no
		workflowProcessCreateDto
				.setFilterValues(Map.of("locationCode", CommonUtil.getStoreCode(), "regionCode", regionCode));
		workflowProcessCreateDto.setRequestData(new JsonData("APPROVE_RO_PAYMENT_DETAILS", null));

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.APPROVE_RO_PAYMENT.name());

		// get response
		WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = epossCallService.callEposs(HttpMethod.POST,
				SalesUtil.WORKFLOW_PROCESS_URL, reqParams, workflowProcessCreateDto,
				WorkflowProcessCreateResponseDto.class);

		paymentRequestDao.setStatus(workflowProcessCreateResponseDto.getApprovalStatus());
		paymentRequestDao.setReferenceId(String.valueOf(workflowProcessCreateResponseDto.getDocNo()));

		// process id
		return workflowProcessCreateResponseDto.getProcessId();

	}

	private void manualApproval(PaymentRequestsDao paymentRequestDao) {

		if (StringUtils.isEmpty(paymentRequestDao.getApprovedBy())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Approved by is mandatory for RO manual approval.");
		}

		paymentRequestDao.setStatus(PaymentRequestEnum.APPROVED.name());
		// no reference id for manual approval.
		paymentRequestDao.setApprovedReason("Manual approval");

	}

	private void airpayOrRazorPayPayment(CreatePaymentRequestDto pendingPaymentRequestDto,
			PaymentRequestsDao paymentRequestDao, CustomerDetailsDto customerDto) {

		if (PaymentCodeEnum.AIRPAY.getPaymentcode().equals(pendingPaymentRequestDto.getPaymentCode())) {
			validateAirpayOrRazorPayPayment(paymentRequestDao, pendingPaymentRequestDto, customerDto,
					isEnableAirpayForIntegration(), VendorCodeEnum.PAYMENT_AIRPAY.name());
		} else if (PaymentCodeEnum.RAZOR_PAY.getPaymentcode().equals(pendingPaymentRequestDto.getPaymentCode())) {
			validateAirpayOrRazorPayPayment(paymentRequestDao, pendingPaymentRequestDto, customerDto,
					isEnableRazorpayForIntegration(), VendorCodeEnum.PAYMENT_RAZORPAY.name());
		}

	}

	private void validateAirpayOrRazorPayPayment(PaymentRequestsDao paymentRequestDao,
			CreatePaymentRequestDto pendingPaymentRequestDto, CustomerDetailsDto customerDto, Boolean isOnlinePayment,
			String vendorType) {
		// if 'with integration' from location is true & hostname is mapped
		// for the payment code, then trigger payment link.
		boolean isOnlineValid = (paymentUtil.hostNameMappingCheck(pendingPaymentRequestDto.getPaymentCode(), true)
				&& BooleanUtils.isTrue(isOnlinePayment));

		PaymentRequestOtherDetails paymentReqOtherDetails = StringUtil
				.isBlankJsonStr(paymentRequestDao.getOtherDetails())
				|| StringUtil
						.isBlankJsonData(MapperUtil.mapObjToClass(paymentRequestDao.getOtherDetails(), JsonData.class))
								? new PaymentRequestOtherDetails()
								: getOtherDetails(paymentRequestDao.getOtherDetails());
		if (isOnlineValid) {
			checkCustomerDetails(customerDto);
			paymentRequestDao.setStatus(PaymentRequestEnum.OPEN.name());
			// trigger payment link
			triggerPaymentLink(paymentRequestDao, customerDto, vendorType, paymentReqOtherDetails);

		} else {
			paymentRequestDao.setStatus(PaymentRequestEnum.COMPLETED.name());
			// no reference id offline payment
			paymentRequestDao.setReferenceId(null);
			paymentRequestDao.setApprovedReason("Offline " + paymentRequestDao.getPaymentCode());

			paymentReqOtherDetails.setReference1(pendingPaymentRequestDto.getReference1());
			paymentReqOtherDetails.setReference2(pendingPaymentRequestDto.getReference2());
			paymentReqOtherDetails.setReference3(pendingPaymentRequestDto.getReference3());

			paymentRequestDao.setOtherDetails(MapperUtil.getStringFromJson(
					new JsonData(pendingPaymentRequestDto.getPaymentCode(), paymentReqOtherDetails)));
		}

	}

	@Override
	public PendingPaymentDto getApprovalStatusbyId(String id) {
		log.info("Get payment details:- " + id);
		PaymentRequestsDao payemntRequestDao = getPaymentRequestIfExists(id);
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		// if payment code is RO & reference id is not null, then check for approval
		// status
		getPaymentStatus(payemntRequestDao, businessDate);

		return mapPaymentRequestDaoToDto(payemntRequestDao);

	}

	private void validatePayment(PaymentRequestsDao paymentRequestDao, Date docDate) {
		PaymentRequestOtherDetails paymentReqOtherDetails = getOtherDetails(paymentRequestDao.getOtherDetails());

		VendorCodeEnum vendorCode;
		if (PaymentCodeEnum.AIRPAY.getPaymentcode().equals(paymentRequestDao.getPaymentCode())) {
			vendorCode = VendorCodeEnum.PAYMENT_AIRPAY;
		} else if (PaymentCodeEnum.RAZOR_PAY.getPaymentcode().equals(paymentRequestDao.getPaymentCode())) {
			vendorCode = VendorCodeEnum.PAYMENT_RAZORPAY;
		} else {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Status check allowed for 'AIRPAY' and 'RAZOR PAY' only.");
		}

		PaymentVerifyResponseDto paymentVerifyResponseDto = integrationService.verifyPaymentStatus(vendorCode.name(),
				paymentRequestDao.getReferenceId());

		// reference id from Airpay/Razor Pay to other details
		if (!StringUtils.isEmpty(paymentVerifyResponseDto.getVendorPaymentId())) {
			paymentReqOtherDetails.setReference1(paymentVerifyResponseDto.getVendorPaymentId());
		}

		// status change required? link expired?
		switch (paymentVerifyResponseDto.getTransacionStatus()) {
		case "COMPLETED":
			paymentRequestDao.setStatus(PaymentRequestEnum.COMPLETED.name());
			break;

		case "IN_PROGRESS":
			paymentRequestDao.setStatus(PaymentRequestEnum.IN_PROGRESS.name());
			break;

		case "CREATED":
			paymentRequestDao.setStatus(PaymentRequestEnum.OPEN.name());
			break;

		default:
			paymentRequestDao.setStatus(PaymentRequestEnum.FAILED.name());
			break;
		}

		// set error code and error message for failed razorpay transactions
		if (vendorCode == VendorCodeEnum.PAYMENT_RAZORPAY
				&& paymentRequestDao.getStatus().equalsIgnoreCase(PaymentRequestEnum.FAILED.name())) {
			if (!StringUtils.isEmpty(paymentVerifyResponseDto.getResponseMesssage())
					&& !StringUtils.isEmpty(paymentVerifyResponseDto.getErrorCode())) {
				paymentReqOtherDetails.setErrorCode(paymentVerifyResponseDto.getErrorCode());
				paymentReqOtherDetails.setErrorMessage(paymentVerifyResponseDto.getResponseMesssage());
			} else {
				paymentReqOtherDetails.setErrorCode("BAD_REQUEST_ERROR");
				paymentReqOtherDetails.setErrorMessage("Reason not found");
			}
		}

		// set approved date and approved by only on 'COMPLETED' or 'FAILED'
		if (List.of(PaymentRequestEnum.COMPLETED.name(), PaymentRequestEnum.FAILED.name())
				.contains(paymentRequestDao.getStatus())) {
			paymentRequestDao.setApprovedBy(CommonUtil.getEmployeeCode());
			paymentRequestDao.setApprovedDate(docDate);
		}

		paymentRequestDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentRequestDao.getPaymentCode(), paymentReqOtherDetails)));
	}

	private PaymentRequestsDao getPaymentRequestIfExists(String id) {
		PaymentRequestsDao paymentRequestsDao = paymentRequestsRepository.findOneByIdAndLocationCode(id,
				CommonUtil.getStoreCode());

		if (paymentRequestsDao == null) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, "Payment request id '" + id + "' not found.");
		}

		return paymentRequestsDao;
	}

	private void getApprovalStatus(PaymentRequestsDao paymentRequestsDao, Date docDate) {
		PaymentRequestOtherDetails paymentReqOtherDetails = getOtherDetails(paymentRequestsDao.getOtherDetails());

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.APPROVE_RO_PAYMENT.name());

		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = epossCallService.callEposs(HttpMethod.GET,
				SalesUtil.WORKFLOW_PROCESS_URL + "/" + paymentReqOtherDetails.getReferenceId(), reqParams, null,
				WorkflowProcessGetResponseDto.class);

		paymentRequestsDao.setStatus(workflowProcessGetResponseDto.getApprovalStatus());
		paymentRequestsDao.setApprovedBy(workflowProcessGetResponseDto.getApprovedby());
		paymentRequestsDao.setApprovedDate(docDate);
		paymentRequestsDao.setApprovedReason(workflowProcessGetResponseDto.getApproverRemarks());
		paymentReqOtherDetails.setApprovedTime(workflowProcessGetResponseDto.getApprovedDate());
		paymentRequestsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentRequestsDao.getPaymentCode(), paymentReqOtherDetails)));

	}

	@Override
	public PaymentRequestOtherDetails getOtherDetails(String otherDetails) {
		if (otherDetails == null) {
			return new PaymentRequestOtherDetails();
		}
		JsonData otherDetais = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(otherDetails), JsonData.class);
		return MapperUtil.getObjectMapperInstance().convertValue(otherDetais.getData(),
				PaymentRequestOtherDetails.class);
	}

	private void setCustomerLocMapping(Integer customerId, PaymentRequestsDao paymentRequestsDao) {
		CustomerLocationMappingIdDao customerLocId = new CustomerLocationMappingIdDao(customerId,
				CommonUtil.getStoreCode());
		CustomerLocationMappingDao customerLocationMapDao = new CustomerLocationMappingDao();
		customerLocationMapDao.setCustomerLocationMappingId(customerLocId);

		paymentRequestsDao.setCustomerLocationMap(customerLocationMapDao);
	}

	@Override
	public PaymentRequestsDao getPaymentStatus(PaymentRequestsDao paymentRequestDao, Date docDate) {

		boolean isUpdate = false;
		if (PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(paymentRequestDao.getPaymentCode())
				&& !StringUtils.isEmpty(paymentRequestDao.getReferenceId())) {
			getApprovalStatus(paymentRequestDao, docDate);
			isUpdate = true;

		} else if ((PaymentCodeEnum.AIRPAY.getPaymentcode().equals(paymentRequestDao.getPaymentCode())
				|| PaymentCodeEnum.RAZOR_PAY.getPaymentcode().equals(paymentRequestDao.getPaymentCode()))
				&& (PaymentRequestEnum.IN_PROGRESS.name().equals(paymentRequestDao.getStatus())
						|| PaymentRequestEnum.OPEN.name().equals(paymentRequestDao.getStatus())
						|| PaymentRequestEnum.FAILED.name().equals(paymentRequestDao.getStatus()))) {
			// if payment code is AIRPAY or RAZOR PAY, verify status (iff status is OPEN or
			// IN_PROGRESS or FAILED)
			validatePayment(paymentRequestDao, docDate);
			isUpdate = true;

		}

		// doc date can be not null, if RO payment is reversed.
		if (paymentRequestDao.getDocDate() != null
				&& (PaymentRequestEnum.APPROVED.name().equals(paymentRequestDao.getStatus())
						|| PaymentRequestEnum.COMPLETED.name().equals(paymentRequestDao.getStatus()))) {
			paymentRequestDao.setDocDate(docDate);
		}

		// save for next time
		if (isUpdate) {
			paymentRequestsRepository.saveAndFlush(paymentRequestDao);
		}

		if (PaymentCodeEnum.RAZOR_PAY.getPaymentcode().equals(paymentRequestDao.getPaymentCode())
				&& PaymentRequestEnum.FAILED.name().equals(paymentRequestDao.getStatus())) {
			PaymentRequestOtherDetails paymentReqOtherDetails = getOtherDetails(paymentRequestDao.getOtherDetails());
			Map<String, String> dynamicValues = new HashMap<>();
			dynamicValues.put("reason", paymentReqOtherDetails.getErrorMessage());
			throw new ServiceException(SalesConstants.RAZORPAY_PAYMENT_FAILURE_REASON, SalesConstants.ERR_SALE_403,
					dynamicValues);
		}

		return paymentRequestDao;

	}

	public void generateCNForClosedPaymentRequest(PaymentRequestsDao paymentRequestsDao) {

		CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();

		creditNoteIndvCreateDto.setCreditNoteType(CNType.ADV.toString());
		creditNoteIndvCreateDto.setAmount(paymentRequestsDao.getAmount());
		creditNoteIndvCreateDto.setRemarks(paymentRequestsDao.getPaymentCode() + " payment closed.");

		// set payment details
		CNPaymentDetailsDto cNPaymentDetailsDto = new CNPaymentDetailsDto();
		cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
		cNPaymentDetailsDto.setRTGS(false);
		cNPaymentDetailsDto.setCheque(false);
		creditNoteIndvCreateDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cNPaymentDetailsDto));

		CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
		// no sales txn id
		cnDto.setCNIndividual(List.of(creditNoteIndvCreateDto));
		cnDto.setCustomerId(paymentRequestsDao.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());

		List<CreditNoteResponse> cnDocNoList = creditNoteService.createNewCreditNote(cnDto);

		PaymentRequestOtherDetails paymentRequestOtherDetails = getOtherDetails(paymentRequestsDao.getOtherDetails());
		paymentRequestOtherDetails.setCreditNoteDocNo(cnDocNoList.get(0).getDocNo());
		paymentRequestOtherDetails.setCreditNoteFiscalYear(cnDocNoList.get(0).getFiscalYear().intValue());
		paymentRequestOtherDetails.setCreditNoteId(cnDocNoList.get(0).getId());

		// set other details to dao
		paymentRequestsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentRequestsDao.getPaymentCode(), paymentRequestOtherDetails)));
		paymentRequestsDao.setIsCnGenerated(Boolean.TRUE);
		}

	@Override
	public void reversePayment(PaymentRequestsDao paymentRequestDao) {

		// Note: to be used for payment in transaction only when status of request is
		// 'CLOSED'.
		if (!PaymentRequestEnum.CLOSED.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Payment request cannot be reversed for the id: " + paymentRequestDao.getId());
		}

		// requires data-sync
		if (PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(paymentRequestDao.getPaymentCode())) {
			// reset status and Utilized amount of payment request.
			paymentRequestDao.setUtilizedAmount(null);
			paymentRequestDao.setStatus(PaymentRequestEnum.APPROVED.name());
			PaymentRequestOtherDetails paymentRequestOtherDetails = getOtherDetails(
					paymentRequestDao.getOtherDetails());

			paymentRequestsRepository.save(paymentRequestDao);


			if (PaymentCodeEnum.RO_PAYMENT.getPaymentcode().equals(paymentRequestDao.getPaymentCode())
					&& !StringUtils.isEmpty(paymentRequestOtherDetails.getReferenceId())) {
				epossCallService.callEposs(HttpMethod.POST,
						SalesUtil.WORKFLOW_PROCESS_URL + "/" + paymentRequestOtherDetails.getReferenceId(),
						Map.of(SalesUtil.WORKFLOW_TYPE, WorkflowTypeEnum.APPROVE_RO_PAYMENT.name()), null,
						Object.class);

			}

		} else {
			// reset status and Utilized amount of payment request.
			paymentRequestDao.setUtilizedAmount(null);
			paymentRequestDao.setStatus(PaymentRequestEnum.COMPLETED.name());
			paymentRequestsRepository.save(paymentRequestDao);
		}
        salesPaymentStaging(paymentRequestDao);
	}

	private Boolean isEnableAirpayForIntegration() {
		LocationPaymentDetails locationPaymentDetails = paymentUtil.getPaymentDetailsFromLocation().getPaymentDetails();
		if (StringUtils.isEmpty(locationPaymentDetails.getRtgs())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Payment details is not present for location " + CommonUtil.getStoreCode());
		}
		if (locationPaymentDetails.getRtgs().getIsEnableAirpayForIntegration() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Payment details field: 'isEnableAirpayForIntegration' is not present for location "
							+ CommonUtil.getLocationCode());
		}

		return locationPaymentDetails.getRtgs().getIsEnableAirpayForIntegration();
	}

	private Boolean isEnableRazorpayForIntegration() {
		LocationPaymentDetails locationPaymentDetails = paymentUtil.getPaymentDetailsFromLocation().getPaymentDetails();

		if (locationPaymentDetails.getIsRazorPayEnabled() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Payment details field: 'isRazorPayEnabled' is not present for location "
							+ CommonUtil.getLocationCode());
		}

		return locationPaymentDetails.getIsRazorPayEnabled();
	}

	private void checkCustomerDetails(CustomerDetailsDto customerDto) {

		if (StringUtils.isEmpty(customerDto.getEmailId()) && (StringUtils.isEmpty(customerDto.getMobileNumber())
				|| SalesConstants.MOB_NO_TEN_NINES.equals(customerDto.getMobileNumber())
				|| SalesConstants.MOB_NO_TEN_ZEROS.equals(customerDto.getMobileNumber()))) {
			throw new ServiceException(SalesConstants.CUSTOMER_DOES_NOT_HAVE_VALID_CONTACT_INFORMATION,
					SalesConstants.ERR_SALE_029, "Customer does not have valid configuration to trigger payment.");
		}

	}

	private void triggerPaymentLink(PaymentRequestsDao paymentRequestDao, CustomerDetailsDto customerDto,
			String vendorType, PaymentRequestOtherDetails paymentReqOtherDetails) {

		if (paymentRequestDao.getStatus() != null
				&& !STATUS_FOR_TRIGGER_OF_VALIDATE_PAYMENT.contains(paymentRequestDao.getStatus())) {
			return;
		}

		if (paymentRequestDao.getId() == null) {
			paymentRequestsRepository.save(paymentRequestDao);
		}

		PaymentRequestDto paymentRequestDto = new PaymentRequestDto();
		// set customer details:
		paymentRequestDto.setCustomerName(customerDto.getCustomerName());
		paymentRequestDto.setAmount(String.valueOf(paymentRequestDao.getAmount()));
		// set mobile number if not empty
		if (!StringUtils.isEmpty(customerDto.getMobileNumber())) {
			paymentRequestDto.setMobileNumber(customerDto.getMobileNumber());
		}
		// set email id if not empty
		if (!StringUtils.isEmpty(customerDto.getEmailId())) {
			paymentRequestDto.setEmailId(customerDto.getEmailId());
		}

		if (VendorCodeEnum.PAYMENT_RAZORPAY.name().equals(vendorType)) {
			paymentRequestDto.setCurrency(paymentRequestDao.getCurrencyCode());// needed for Razor Pay
		}

		// resend functionality not clear
		// if reference2(integration txn id) exists then, send it
		if (!StringUtils.isEmpty(paymentRequestDao.getReferenceId())) {
			paymentRequestDto.setTransactionId(paymentRequestDao.getReferenceId());
		}

		PaymentCreateResponseDto paymentCreateResponseDto = new PaymentCreateResponseDto();
		boolean isTriggerPaymentSuccess = false;
		ServiceException exception = null;

		try {
			paymentCreateResponseDto = integrationService.createPaymentLink(vendorType, paymentRequestDao.getId(),
					paymentRequestDto);
			if (IntegrationPaymentStatusEnum.CREATED.name().equals(paymentCreateResponseDto.getStatus())) {
				paymentRequestDao.setStatus(PaymentRequestEnum.OPEN.name());
				// set triggered payment to true
				isTriggerPaymentSuccess = true;
			}
		} catch (ServiceException e) {
			exception = e;
			paymentRequestDao.setStatus(PaymentRequestEnum.FAILED.name());
		}

		// transactionId from third party in reference2
		paymentRequestDao.setReferenceId(paymentCreateResponseDto.getTransactionId());
		paymentReqOtherDetails.setReference2(paymentCreateResponseDto.getTransactionId());
		paymentReqOtherDetails.setPaymentUrl(paymentCreateResponseDto.getPaymentUrl());
		paymentRequestDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentRequestDao.getPaymentCode(), paymentReqOtherDetails)));

		// error code?
		if (!isTriggerPaymentSuccess) {
			if (exception != null) {
				throw exception;
			} else {
				throw new ServiceException(SalesConstants.ERROR_WHILE_TRIGGERING_PAYMENT, SalesConstants.ERR_SALE_031,
						paymentCreateResponseDto.getErrorMessage());
			}
		}

	}

	@Override
	public void resendPaymentLink(String id) {

		log.info("Resend payment details:- " + id);
		PaymentRequestsDao paymentRequestDao = getPaymentRequestIfExists(id);
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		if (!PAYMENT_CODE_VALID_FOR_RESEND.contains(paymentRequestDao.getPaymentCode())) {
			throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
					"Payment code: '" + paymentRequestDao.getPaymentCode() + "' not allowed for resend.");
		}

		if (PaymentRequestEnum.CLOSED.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					" Invalid input status. Only 'OPEN' status is allowed.",
					Map.of(SalesConstants.REMARKS, "Payment is already utilized."));
		} else if (PaymentRequestEnum.COMPLETED.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(SalesConstants.PAYMENT_IS_COMPLETED, SalesConstants.ERR_SALE_038,
					" Invalid input status. Only 'OPEN' status is allowed.");
		}

		// check for payment status
		getPaymentStatus(paymentRequestDao, businessDate);
		checkStatusafterVerify(paymentRequestDao);

		if (!PaymentRequestEnum.OPEN.name().equals(paymentRequestDao.getStatus())) {
			return;
		}

		CustomerDetailsDto customerDto = customerService
				.getCustomer(paymentRequestDao.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
		PaymentRequestOtherDetails paymentReqOtherDetails = getOtherDetails(paymentRequestDao.getOtherDetails());

		try {
			if (PaymentCodeEnum.AIRPAY.getPaymentcode().equals(paymentRequestDao.getPaymentCode()))
				triggerPaymentLink(paymentRequestDao, customerDto, VendorCodeEnum.PAYMENT_AIRPAY.name(),
						paymentReqOtherDetails);
			else {
				Boolean isResendLinkSuccess = integrationService.resendPaymentLink(
						VendorCodeEnum.PAYMENT_RAZORPAY.name(), paymentRequestDao.getReferenceId(),
						!StringUtils.isEmpty(paymentRequestDao.getCustomerLocationMap().getCustomer().getMobileNumber())
								? "sms"
								: "email");

				if (!BooleanUtils.isTrue(isResendLinkSuccess)) {
					throw new ServiceException(SalesConstants.ERROR_WHILE_TRIGGERING_PAYMENT,
							SalesConstants.ERR_SALE_031, "Error while re-sending RAZOR PAY payment link");
				}

			}

		} catch (Exception e) {
			// save details first before throwing error.
			paymentRequestsRepository.save(paymentRequestDao);

			throw e;
		}

        // paymentRequestsRepository.save(paymentRequestDao);
		if(paymentRequestDao != null) {
			salesPaymentStaging(paymentRequestDao);
			
		}

	}

	private void checkStatusafterVerify(PaymentRequestsDao paymentRequestDao) {
		if (PaymentRequestEnum.COMPLETED.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(SalesConstants.PAYMENT_IS_COMPLETED, SalesConstants.ERR_SALE_038,
					" Invalid input status. Only 'OPEN' status is allowed.");
		} else if (PaymentRequestEnum.IN_PROGRESS.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(SalesConstants.PAYMENT_IS_IN_PROGRESS, SalesConstants.ERR_SALE_037,
					" Invalid input status. Only 'OPEN' status is allowed.");
		} else if (!PaymentRequestEnum.OPEN.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					" Invalid input status. Only 'OPEN' status is allowed.",
					Map.of(SalesConstants.REMARKS, "Payment " + paymentRequestDao.getStatus()));
		}
	}
	
	private void salesPaymentStaging(PaymentRequestsDao paymentRequestDao) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		//if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			paymentRequestDao.setSrcSyncId(paymentRequestDao.getSrcSyncId()==null?0:paymentRequestDao.getSrcSyncId() + 1);
			paymentRequestDao.setDestSyncId(0);
			paymentRequestDao = paymentRequestsRepository.save(paymentRequestDao);
			PaymentRequestSyncDto syncDto = new PaymentRequestSyncDto(paymentRequestDao);
			syncDataList.add(DataSyncUtil.createSyncData(syncDto, 0));
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			MessageRequest paymentRequesMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.PAYMENT_REQUEST, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			SyncStagingDto prStagingDto = new SyncStagingDto();
			prStagingDto.setMessageRequest(paymentRequesMsgRequest);
			String prMsgRequest = MapperUtil.getJsonString(paymentRequesMsgRequest);
			SyncStaging prSyncStaging = new SyncStaging();
			prSyncStaging.setMessage(prMsgRequest);
			prSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			prSyncStaging = saleSyncStagingRepository.save(prSyncStaging);
			prStagingDto.setId(prSyncStaging.getId());	
			salesSyncDataService.publishSalesMessagesToQueue(prStagingDto);
		}
	}
		
}
