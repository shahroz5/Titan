/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationIntgDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.OTPUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TimeTypeEnum;
import com.titan.poss.sales.dao.AccountDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerOtpDaoExt;
import com.titan.poss.sales.dto.CustomerUploadApprovalHeaderDto;
import com.titan.poss.sales.dto.constants.CustomerDocumentStatusEnum;
import com.titan.poss.sales.dto.constants.SalesOtpTypeEnum;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.ReqApprovalDetailsDto;
import com.titan.poss.sales.repository.AccountDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerOtpRepository;
import com.titan.poss.sales.repository.CustomerRepository;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OtpService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesOtpService")
public class OtpServiceImpl implements OtpService {

	@Autowired
	private CreditNoteService cnService;

	@Autowired
	private AccountDetailsRepositoryExt accDetailsRepo;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CustomerOtpRepository customerOtpRepo;

	@Value("${poss.sales.otp.length:6}")
	private Short defaultOtpLength;

	@Value("${poss.sales.otp.dateType:MIN}")
	private TimeTypeEnum defaultOtpDateType;
	
	@Value("${poss.sales.otp.timeLength:15}")
	private Integer defaultOtpTime;
	
	@Autowired
	private IntegrationServiceClient intgService;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private CustomerDocumentsRepository customerDocumentsRepository;

	@Autowired
	private CustomerRepository customerRepo;

	@Autowired
	private EngineService engineService;

	protected StorePrintDetailsDto getStoreDetails() {

		return engineService.getStorePrintInformation();
	}

	@Override
	@Transactional
	public void sendOTP(String refId, String fileTypeStr, String otpTypeStr) {

		String locationCode = CommonUtil.getStoreCode();

		SalesOtpTypeEnum otpType = SalesOtpTypeEnum.valueOf(otpTypeStr);

		Map<String, String> data = new HashMap<>();
		Integer customerId = null;

		if (otpType == SalesOtpTypeEnum.CN) {
			CreditNoteDaoExt cn = cnService.getByIdAndLocationCode(refId, locationCode);
			customerId = cn.getCustomerId();

			data.put("CN_DOC_NO", cn.getDocNo().toString());
			data.put("CN_FISCAL_YEAR", cn.getFiscalYear().toString());

		} else if (otpType == SalesOtpTypeEnum.GHS) {
			AccountDetailsDaoExt ad = getAccountDetailsById(refId);
			customerId = ad.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId();

			data.put("GHS_ACCT_NO", ad.getAccountNo());

		} else if (otpType == SalesOtpTypeEnum.CUSTOMER) {
			Optional<CustomerDocumentsDao> customerDocumentsDaos = customerDocumentsRepository.findById(refId);
			if (customerDocumentsDaos.isPresent())
				customerId = customerService.getLocationMapping(customerDocumentsDaos.get().getCustomer(), locationCode)
						.getCustomerLocationMappingId().getCustomerId();
			data.put("FILE_TYPE", fileTypeStr);

		} else if (otpType == SalesOtpTypeEnum.CUST_SIGNATURE_OTP) {
			Optional<CustomerDao> customerDaos = customerRepo.findById(refId);
			if (customerDaos.isPresent())
				customerId = customerService.getLocationMapping(customerDaos.get(), locationCode)
						.getCustomerLocationMappingId().getCustomerId();
			data.put("FILE_TYPE", fileTypeStr);
			StorePrintDetailsDto storeDetails = getStoreDetails();
			data.put("storeAddress", storeDetails.getTownName());

			String storeNumber = "";
			if (!storeDetails.getPhoneNumber1().isEmpty()) {
				storeNumber = storeDetails.getPhoneNumber1();
			}

			else if (!storeDetails.getPhoneNumber2().isEmpty()) {
				storeNumber = storeDetails.getPhoneNumber2();
			}

			data.put("storeNumber", storeNumber);
		} else if (otpType == SalesOtpTypeEnum.EMPLOYEELOAN) {
//			customerId = Integer.parseInt(refId);
			Optional<CustomerDao> customerDaos = customerRepo.findById(refId);
			if (customerDaos.isPresent())
				customerId = customerService.getLocationMapping(customerDaos.get(), locationCode)
						.getCustomerLocationMappingId().getCustomerId();
			data.put("FILE_TYPE", fileTypeStr);
		}
		else {
			return;
		}
		CustomerDetailsDto customer = customerService.getCustomer(customerId);

		NotificationType notfType = getNotfTypeFromSalesOtpType(otpType);
		checkIfCustomerContactInfoPresent(notfType, customer);

		log.debug("Customer mobile: {}, email: {}", customer.getMobileNumber(), customer.getEmailId());
		data.put("name", StringUtil.getNameForEmail(customer.getCustomerName()));

		customerOtpRepo.deactivateOldOtpByCriteria(refId, locationCode, otpTypeStr);

		CustomerOtpDaoExt custOtp = createCustomerOtpObj(refId, otpTypeStr, locationCode, customerId);

		data.put("otp", custOtp.getOtpToken());

		NotificationDto notificationDto = new NotificationDto();
		if(StringUtils.isNotEmpty(customer.getEmailId())) {
			notificationDto.setEmailIds(Set.of(customer.getEmailId()));
		}
		
		notificationDto.setMobileNo(customer.getMobileNumber());
		NotificationTypeDataDto notf = new NotificationTypeDataDto(notfType, data, null, null);
		notificationDto.setNotificationTypeData(List.of(notf));
		notificationDto.setLocationCode(locationCode);

		intgService.sendNotification(notificationDto);
	}

	private NotificationType getNotfTypeFromSalesOtpType(SalesOtpTypeEnum otpType) {
		if (otpType == SalesOtpTypeEnum.CN)
			return NotificationType.CUST_CN_OTP;
		else if (otpType == SalesOtpTypeEnum.GHS)
			return NotificationType.CUST_GHS_OTP;
		else if (otpType == SalesOtpTypeEnum.CUST_SIGNATURE_OTP)
			return NotificationType.CUST_SIGNATURE_OTP;
		else if (otpType == SalesOtpTypeEnum.EMPLOYEELOAN)
			return NotificationType.EMPLOYEELOAN;
		else
			return NotificationType.CUST_DOC_OTP;

	}

	private CustomerOtpDaoExt createCustomerOtpObj(String refId, String otpTypeStr, String locationCode,
			Integer customerId) {
		SalesOtpTypeEnum otpType = SalesOtpTypeEnum.valueOf(otpTypeStr);
		
		CustomerOtpDaoExt custOtp = new CustomerOtpDaoExt();
		custOtp.setCustomerId(customerId);
		custOtp.setLocationCode(locationCode);
		custOtp.setOtpType(otpTypeStr);
		custOtp.setRefId(refId);
		custOtp.setOtpToken(OTPUtil.generateNumberOtp(defaultOtpLength));
		if (otpType == SalesOtpTypeEnum.CUST_SIGNATURE_OTP) {
			Date expiryDate = addTime(defaultOtpDateType, defaultOtpTime);
			custOtp.setExpiryDate(expiryDate);
		}
		customerOtpRepo.save(custOtp);
		return custOtp;
	}

	private AccountDetailsDaoExt getAccountDetailsById(String id) {
		AccountDetailsDaoExt accountDetail = accDetailsRepo.getByIdAndLocation(id, CommonUtil.getStoreCode());
		if (accountDetail == null) {
			throw new ServiceException(SalesConstants.ACCOUNT_DETAILS_NOT_FOUND, SalesConstants.ERR_SALE_211);
		}
		return accountDetail;
	}

	public NotificationType checkIfCustomerContactInfoPresent(NotificationType notfType, CustomerDetailsDto customer) {

		NotificationIntgDto notification = intgService.getNotificationDtoByType(notfType.name());

		List<String> mandatoryContactInfos = new ArrayList<>();
		if (notification.getIsEmailRequired() && !StringUtils.isBlank(customer.getEmailId()))
			mandatoryContactInfos.add("email id");

		if(notification.getIsSMSRequired() && !StringUtils.isBlank(customer.getMobileNumber()))
			mandatoryContactInfos.add("mobile number");
		String contactInfo = Arrays.toString(mandatoryContactInfos.toArray());
		if (mandatoryContactInfos.isEmpty())
			throw new ServiceException(
					"Some contact information for customer are mandatory for notification sending: {DEFAULTER_CONTACT_INFO}",
					"ERR-SALE-234", Map.of("DEFAULTER_CONTACT_INFO", contactInfo));
		return notfType;
	}

	@Override
	@Transactional
	public void validateOTP(String refId, String otpType, String token) {

		log.debug("\n\nValidate  OTP, id: {}, otpType: {} token: {}\n\n", refId, otpType, token);

		SalesOtpTypeEnum otpTypeValue = SalesOtpTypeEnum.valueOf(otpType);
		CustomerOtpDaoExt customerOtp;
		
		if(otpTypeValue == SalesOtpTypeEnum.CUST_SIGNATURE_OTP) {
			customerOtp = customerOtpRepo.findByRefIdAndLocationCodeAndOtpTypeAndIsActiveTrueAndExpiryDateGreaterThanEqual(refId,
					CommonUtil.getStoreCode(), otpType,CalendarUtils.getCurrentDate());
		} else {
			customerOtp = customerOtpRepo.findByRefIdAndLocationCodeAndOtpTypeAndIsActiveTrue(refId,
					CommonUtil.getStoreCode(), otpType);
		}
		
		if (customerOtp == null)
			throw new ServiceException("INVALID OTP", "ERR-SALE-235", "OTP may be used or not newly sent one.");

		if (!customerOtp.getOtpToken().equals(token))
			throw new ServiceException("Wrong OTP. It should be: " + customerOtp.getOtpToken(), "ERR-SALE-235");

		// deactivate if verified successfully
		customerOtp.setIsActive(false);
		if (otpType.equalsIgnoreCase(SalesOtpTypeEnum.CUSTOMER.name())) {
			requestForApproval(customerOtp.getCustomerId(), refId);
		}
		customerOtpRepo.save(customerOtp);
	}

	private void requestForApproval(Integer customerId, String refId) {

		CustomerUploadApprovalHeaderDto customerUploadApprovalHeaderDto = (CustomerUploadApprovalHeaderDto) MapperUtil
				.getObjectMapping(customerService.getCustomer(customerId), new CustomerUploadApprovalHeaderDto());

		Map<String, String> filterValues = new HashMap<>();
		filterValues.put("customerId", String.valueOf(customerUploadApprovalHeaderDto.getCustomerId()));
		filterValues.put("locationCode", CommonUtil.getLocationCode());
		if (customerUploadApprovalHeaderDto.getMobileNumber() != null)
			filterValues.put("mobileNumber", customerUploadApprovalHeaderDto.getMobileNumber());
		if (customerUploadApprovalHeaderDto.getUlpId() != null)
			filterValues.put("ulpId", customerUploadApprovalHeaderDto.getUlpId());
		if (customerUploadApprovalHeaderDto.getPassportId() != null)
			filterValues.put("passportId", customerUploadApprovalHeaderDto.getPassportId());
		if (customerUploadApprovalHeaderDto.getCustTaxNo() != null)
			filterValues.put("custTaxNo", customerUploadApprovalHeaderDto.getCustTaxNo());
		if (customerUploadApprovalHeaderDto.getInstiTaxNo() != null)
			filterValues.put("instiTaxNo", customerUploadApprovalHeaderDto.getInstiTaxNo());

		ReqApprovalDetailsDto reqApprovalDetailsDto = epossCallService.createWorkflowProcess(
				new JsonData("CUSTOMER_DOCUMENT_HEADER", customerUploadApprovalHeaderDto),
				new JsonData("CUSTOMER_DOCUMENT_DETAILS", null), filterValues, null,
				WorkflowTypeEnum.CUSTOMER_UPLOAD_DOCUMENT);
		Optional<CustomerDocumentsDao> customerDocumentDao = customerDocumentsRepository.findById(refId);
		if (customerDocumentDao.isPresent()) {
			customerDocumentDao.get().setProcessId(reqApprovalDetailsDto.getProcessId());
			customerDocumentDao.get().setStatus(CustomerDocumentStatusEnum.PENDING.name());
			customerDocumentsRepository.save(customerDocumentDao.get());
		}

	}
	
	private Date addTime(TimeTypeEnum timeType, Integer tempTime) {
		Date expiryDate = CalendarUtils.getCurrentDate();
		if (timeType == TimeTypeEnum.MIN) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(tempTime, null, null, null, null, null);
		} else if (timeType == TimeTypeEnum.HOUR) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, tempTime, null, null, null, null);
		} else if (timeType == TimeTypeEnum.DAY) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, null, tempTime, null, null, null);
		} else if (timeType == TimeTypeEnum.WEEK) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, null, null, tempTime, null, null);
		} else if (timeType == TimeTypeEnum.MONTH) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, tempTime, null);
		}
		return CalendarUtils.setSecondTo59(expiryDate);
	}
}
