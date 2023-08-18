/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.OwnerTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.ApplicableL1L2StoresData;
import com.titan.poss.core.dto.ApplicablePaymentTypeData;
import com.titan.poss.core.dto.ApplicableTransactionData;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BrandTcsDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.CashPaymentRuleDetails;
import com.titan.poss.core.dto.GhsCashResponseDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.ServiceCashCollectedDto;
import com.titan.poss.core.dto.TotalCashPaidDetailsDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.constants.CashLimitTxnTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.AddCustomerPaymentDto;
import com.titan.poss.sales.dto.request.CustomerPaymentDetailsDto;
import com.titan.poss.sales.dto.response.CashLimitResponseDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for Customer Payments(mailny for cash limit checks).
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesCustomerPaymentService")
public class CustomerPaymentServiceImpl implements CustomerPaymentService {

	@Autowired
	private CustomerPaymentRepositoryExt customerPaymentRepository;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;
	
	@Autowired
	private CustomerRepository customerRepo;
	
	

	@Value("${app.name}")
	private String appName;

	private static final String NEXT_LINE_CHARACTER = "' \r\n";
	private static final String CLOSING_BRACKET = "') \r\n";
	private static final String MOBILE_NO = "MOBILE_NO";
	private static final String ULP_ID = "ULP_ID";

	@Transactional
	@Override
	public List<String> addCustomerPayment(SalesTxnDaoExt salesTxn, List<GiftDetailsDaoExt> giftDetailsDaoList,
			List<PaymentDetailsDaoExt> paymentDetailsList, BigDecimal finalValue, BigDecimal roundingValue,
			boolean isCancellation, BigDecimal rationOfAmtForCash) {

		// get cash limit txn type:
		// doubt, what to do if, txn type is not valid?
		CashLimitTxnTypeEnum cashLimitTxnType = CashLimitTxnTypeEnum
				.getCashLimitTxnTypeBasedOnTxnTypeAndSubTxnType(salesTxn.getTxnType(), salesTxn.getSubTxnType());

		// validate txnType
		if (cashLimitTxnType == null) {
			// pending
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060,
					"Invalid cash limit transaction type.");
		}

		// filter payments which have cash element.
		// better approach is to have cash collected column in payment_details table
		List<PaymentDetailsDaoExt> paymentDetailsWithCashList = new ArrayList<>();
		// for TEP, payment list will be null.
		if (!CollectionUtil.isEmpty(paymentDetailsList)) {

			Calendar cal1 = Calendar.getInstance();
			Calendar cal2 = Calendar.getInstance();
			cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
			for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetailsList) {
				if (!checkIfPaymentHasCashComponent(isCancellation, paymentDetailsDao)) {
					continue;
				}
				if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
					JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
					
					Boolean isLinkedCn = JsonUtils.getValueFromJson(jsonData.getData(), "isLinkedCn", Boolean.class);
					Integer cnOwnerId = JsonUtils.getValueFromJson(jsonData.getData(), "cnOwnerId", Integer.class);
					Date originalDocDate = JsonUtils.getValueFromJson(jsonData.getData(), "originalDocDate",
							Date.class);
					cal2.setTime(originalDocDate);
					if (BooleanUtils.isNotTrue(isLinkedCn) && cal2.before(cal1)
							|| paymentDetailsDao.getSalesTxnDao().getCustomerId().compareTo(cnOwnerId)!=0) {
						paymentDetailsWithCashList.add(paymentDetailsDao);
					}

				} else if (PaymentCodeEnum.QCGC.getPaymentcode().equals(paymentDetailsDao.getPaymentCode()) 
						&& paymentDetailsDao.getInstrumentDate() != null) {
					JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
					
					Integer qcgcOwnerId = JsonUtils.getValueFromJson(jsonData.getData(), "qcgcOwnerId", Integer.class);
					cal2.setTime(paymentDetailsDao.getInstrumentDate());
					
					if ( cal2.before(cal1)
							|| (qcgcOwnerId !=null && paymentDetailsDao.getSalesTxnDao().getCustomerId().compareTo(qcgcOwnerId) != 0)) {
						paymentDetailsWithCashList.add(paymentDetailsDao);
					}

				} else {
					paymentDetailsWithCashList.add(paymentDetailsDao);
				}
			}

			// should not return for TEP
			if (CollectionUtil.isEmpty(paymentDetailsWithCashList)) {
				return List.of();
			}

		}

		// check if customer id exists - if yes, then pick customerMaster id, customer
		// type and identifier1.
		CustomerLocationMappingDao customerLocMappingDao = customerLocationMappingRepository
				.findByCustomerIdAndLocationCode(salesTxn.getCustomerId(), CommonUtil.getLocationCode());

		// doubt: if customer id is not present then throw error ? or return?
		if (customerLocMappingDao == null) {
			return List.of();
		}

		String uniqueIdentifier1 = getCustomerUniqueIdentifier(customerLocMappingDao.getCustomer());
		String uniqueIdentifier2 = customerLocMappingDao.getCustomer().getUlpId();

		AddCustomerPaymentDto addCustomerPaymentDto = new AddCustomerPaymentDto();
		addCustomerPaymentDto.setCustomerId(salesTxn.getCustomerId());
		addCustomerPaymentDto.setTxnType(cashLimitTxnType.name());

		List<CustomerPaymentDetailsDto> customerPaymentDetailsList = new ArrayList<>();

		if (TransactionTypeEnum.TEP.name().equals(salesTxn.getTxnType())) {
			// set one record with customer payment for TEP
			getOneCustomrPayment(finalValue, customerPaymentDetailsList);

		} else if (SubTxnTypeEnum.GIFT_SALE.name().equals(salesTxn.getSubTxnType())) {
			// split with card no.
			roundingValue = roundingValue == null ? BigDecimal.ZERO : roundingValue;
			BigDecimal actualFinalValue = finalValue.subtract(roundingValue);

			for (GiftDetailsDaoExt giftDetailsDao : giftDetailsDaoList) {
				BigDecimal usageValue = giftDetailsDao.getFinalValue().divide(actualFinalValue,
						DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);

				getCustomrPayment(paymentDetailsWithCashList, usageValue, customerPaymentDetailsList,
						giftDetailsDao.getInstrumentNo());
			}

		} else {
			getCustomrPayment(paymentDetailsWithCashList, new BigDecimal(1), customerPaymentDetailsList, null);
		}

		addCustomerPaymentDto.setPaymentDetailsList(customerPaymentDetailsList);
		// get store details.
		LocationCacheDto storeDetails = getLocationDetails();
		List<CustomerPaymentDaoExt> customerPaymentDaoList = mapCustomerPaymentDtoToDaoList(addCustomerPaymentDto,
				customerLocMappingDao, uniqueIdentifier1, uniqueIdentifier2, paymentDetailsWithCashList, isCancellation,
				rationOfAmtForCash, storeDetails);
		customerPaymentDaoList = customerPaymentRepository.saveAll(customerPaymentDaoList);

		return customerPaymentDaoList.stream().map(CustomerPaymentDaoExt::getId).collect(Collectors.toList());

	}

	private boolean checkIfPaymentHasCashComponent(boolean isCancellation, PaymentDetailsDaoExt paymentDetailsDao) {
		   List<String> paymentCodes=new ArrayList<>();
		     if(isCancellation) {
		    	 paymentCodes.add(PaymentCodeEnum.CREDIT_NOTE.getPaymentcode());
		    	 paymentCodes.add(PaymentCodeEnum.CASH.getPaymentcode());
		     } else {
		    	 paymentCodes=PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement();
		     }
		return paymentCodes.contains(paymentDetailsDao.getPaymentCode())
				&& PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())
				&& paymentDetailsDao.getCashCollected() != null
				&& BigDecimal.ZERO.compareTo(paymentDetailsDao.getCashCollected()) != 0
				&& (BooleanUtils.isTrue(paymentDetailsDao.getIsEditable()) || isCancellation);
	}

	private void saveCustomerTcsDetails(SalesTxnDaoExt salesTxn, LocationCacheDto storeDetails,
			CustomerLocationMappingDao customerLocMappingDao, BigDecimal tcsToBeCollected) {

		CustomerTcsDetailsDaoExt customerTcsDetailsDao = new CustomerTcsDetailsDaoExt();
		customerTcsDetailsDao.setSalesTxnDao(salesTxn);
		customerTcsDetailsDao.setBrandCode(storeDetails.getBrandCode());
		customerTcsDetailsDao.setOwnerType(storeDetails.getOwnerTypeCode());
		customerTcsDetailsDao.setLocationCode(storeDetails.getLocationCode());
		customerTcsDetailsDao.setCustomer(customerLocMappingDao.getCustomer());
		customerTcsDetailsDao.setMobileNumber(customerLocMappingDao.getCustomer().getMobileNumber());
		customerTcsDetailsDao.setUlpId(customerLocMappingDao.getCustomer().getUlpId());
		customerTcsDetailsDao.setStorePan(customerLocMappingDao.getCustomer().getCustTaxNo());
		customerTcsDetailsDao.setDocNo(salesTxn.getDocNo());
		customerTcsDetailsDao.setFiscalYear(salesTxn.getFiscalYear());
		// TODO: need to confirm with rajanisss
		customerTcsDetailsDao.setTransactionDate(salesTxn.getDocDate());

		if (tcsToBeCollected.compareTo(BigDecimal.ZERO) > 0) {
			BrandDto brandDto = engineService.getBrand(storeDetails.getBrandCode());
			BrandTcsDetails brandTcs = MapperUtil.mapJsonDataToClass(brandDto.getBrandTcsDetails(),
					BrandTcsDetails.class);
			// customerTcsDetailsDao.setTcsEligibleAmount();
			customerTcsDetailsDao.setTcsApplicableAmount(brandTcs.getB2c().getTcsApplicableAmount());
			// customerTcsDetailsDao.setTcsPercentage(brandTcs.getB2c().getApplicableTcsRates());
			customerTcsDetailsDao.setTcsAmountPaid(tcsToBeCollected);
		}

	}

	private void getCustomrPayment(List<PaymentDetailsDaoExt> paymentDetailsList, BigDecimal usageValue,
			List<CustomerPaymentDetailsDto> customerPaymentDetailsList, String instrumentNo) {

		for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetailsList) {
			CustomerPaymentDetailsDto customerPaymentDto = new CustomerPaymentDetailsDto();
			customerPaymentDto.setPaymentId(paymentDetailsDao.getId());
			customerPaymentDto.setPaymentCode(paymentDetailsDao.getPaymentCode());
			customerPaymentDto.setPaidAmount(paymentDetailsDao.getAmount().multiply(usageValue)
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
			customerPaymentDto.setPaymentDate(paymentDetailsDao.getPaymentDate());
			customerPaymentDto.setInstrumentNo(instrumentNo);

			// cash paid
			customerPaymentDto.setCashAmount(paymentDetailsDao.getCashCollected() == null ? BigDecimal.ZERO
					: paymentDetailsDao.getCashCollected().multiply(usageValue).setScale(DomainConstants.PRICE_SCALE,
							RoundingMode.HALF_UP));

			// get cash based on payment code.
			// how to get cash element for QCGC?
			if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {

				// set payment type for CREDIT NOTE
				customerPaymentDto.setPaymentType(paymentDetailsDao.getInstrumentType());

				Date originalDocDate = JsonUtils.getValueFromJson(
						MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class).getData(),
						"originalDocDate", Date.class);
				// temp code (remove null check later on)
				if (originalDocDate == null) {
					originalDocDate = paymentDetailsDao.getInstrumentDate();
				}

				// set instrument date -- THE original doc date for the CN
				customerPaymentDto.setInstrumentDate(originalDocDate);
			} else if (PaymentCodeEnum.CASH.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())
					|| PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
				// set instrument date
				customerPaymentDto.setInstrumentDate(paymentDetailsDao.getPaymentDate());

			} else if (PaymentCodeEnum.QCGC.getPaymentcode().equals(paymentDetailsDao.getPaymentCode())) {
				customerPaymentDto.setInstrumentNo(paymentDetailsDao.getInstrumentNo());
				customerPaymentDto.setInstrumentDate(paymentDetailsDao.getInstrumentDate());
			}

			// pending: instrument number

			customerPaymentDetailsList.add(customerPaymentDto);
		}

	}

	private void getOneCustomrPayment(BigDecimal finalValue,
			List<CustomerPaymentDetailsDto> customerPaymentDetailsList) {

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		CustomerPaymentDetailsDto customerPaymentDto = new CustomerPaymentDetailsDto();

		customerPaymentDto.setPaymentCode(PaymentCodeEnum.CASH.getPaymentcode());
		customerPaymentDto.setPaidAmount(finalValue);
		// cash paid
		customerPaymentDto.setCashAmount(finalValue);
		customerPaymentDto.setPaymentDate(businessDate);
		customerPaymentDto.setInstrumentDate(businessDate);

		customerPaymentDetailsList.add(customerPaymentDto);
	}

	/**
	 * This method will get customer payment lists that can be saved.
	 * 
	 * @param addCustomerPaymentDto
	 * @param customerLocMappingDao
	 * @param uniqueIdentifier1
	 * @param validPaymentList
	 * @return List<CustomerPaymentDaoExt>
	 */
	private List<CustomerPaymentDaoExt> mapCustomerPaymentDtoToDaoList(AddCustomerPaymentDto addCustomerPaymentDto,
			CustomerLocationMappingDao customerLocMappingDao, String uniqueIdentifier1, String uniqueIdentifier2,
			List<PaymentDetailsDaoExt> validPaymentList, boolean isCancellation, BigDecimal rationOfAmtForCash,
			LocationCacheDto storeDetails) {
		List<CustomerPaymentDaoExt> customerPaymentDaoList = new ArrayList<>();

		Map<String, PaymentDetailsDaoExt> paymentDetailsMap = validPaymentList.stream()
				.collect(Collectors.toMap(PaymentDetailsDaoExt::getId, paymentDetailDao -> paymentDetailDao));

		for (CustomerPaymentDetailsDto customerPaymentDetails : addCustomerPaymentDto.getPaymentDetailsList()) {

			CustomerPaymentDaoExt customerPaymentDao = mapCustomerPaymentDtoToDao(addCustomerPaymentDto,
					customerLocMappingDao, uniqueIdentifier1, uniqueIdentifier2, storeDetails, customerPaymentDetails,
					paymentDetailsMap.containsKey(customerPaymentDetails.getPaymentId())
							? paymentDetailsMap.get(customerPaymentDetails.getPaymentId())
							: null);

			if (rationOfAmtForCash.signum() > 0 && BigDecimal.valueOf(1).compareTo(rationOfAmtForCash) > 0) {
				customerPaymentDao.setPaidAmount(customerPaymentDao.getPaidAmount().multiply(rationOfAmtForCash)
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
				customerPaymentDao.setCashAmount(customerPaymentDao.getCashAmount().multiply(rationOfAmtForCash)
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
			}

			// if cancellation, then negate payment
			if (isCancellation) {
				customerPaymentDao.setPaidAmount(customerPaymentDao.getPaidAmount().multiply(BigDecimal.valueOf(-1)));
				customerPaymentDao.setCashAmount(customerPaymentDao.getCashAmount().multiply(BigDecimal.valueOf(-1)));
			}

			customerPaymentDaoList.add(customerPaymentDao);

		}

		return customerPaymentDaoList;
	}

	private LocationCacheDto getLocationDetails() {
		LocationCacheDto storeDetails = engineService.getStoreLocation(CommonUtil.getLocationCode());

		if (StringUtils.isEmpty(storeDetails.getStoreDetails())
				|| StringUtils.isEmpty(storeDetails.getStoreDetails().getCompanyName())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Store details or 'companyName' is not present for the location " + CommonUtil.getLocationCode());
		}
		
		if (StringUtils.isEmpty(storeDetails.getTcsDetails())
				|| StringUtils.isEmpty(storeDetails.getTcsDetails().getLocationPanNumber())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Tcs details or 'locationPanNumber' is not present for the location " + CommonUtil.getLocationCode());
		}

		return storeDetails;
	}

	/**
	 * This method will form customer payment object.
	 * 
	 * @param addCustomerPaymentDto
	 * @param customerLocMappingDao
	 * @param uniqueIdentifier1
	 * @param storeDetails
	 * @param customerPaymentDetails
	 * @param paymentDetailsDao
	 * @return CustomerPaymentDaoExt
	 */
	private CustomerPaymentDaoExt mapCustomerPaymentDtoToDao(AddCustomerPaymentDto addCustomerPaymentDto,
			CustomerLocationMappingDao customerLocMappingDao, String uniqueIdentifier1, String uniqueIdentifier2,
			LocationCacheDto storeDetails, CustomerPaymentDetailsDto customerPaymentDetails,
			PaymentDetailsDaoExt paymentDetailsDao) {

		CustomerPaymentDaoExt customerPaymentDao = new CustomerPaymentDaoExt();
		CustomerDaoExt customerDao = (CustomerDaoExt) MapperUtil.getObjectMapping(customerLocMappingDao.getCustomer(),
				new CustomerDaoExt());

		customerPaymentDao.setCustomerType(customerDao.getCustomerType());
		customerPaymentDao.setCustomerIdentifier1(uniqueIdentifier1);
		customerPaymentDao.setCustomerIdentifier2(uniqueIdentifier2);
		customerPaymentDao.setCustomer(customerDao);
		customerPaymentDao.setCustomerLocationMap(customerLocMappingDao);
		customerPaymentDao.setPaymentCode(customerPaymentDetails.getPaymentCode());
		customerPaymentDao.setPaymentType(customerPaymentDetails.getPaymentType());
		customerPaymentDao.setPaymentDetailsDao(paymentDetailsDao);

		customerPaymentDao.setInstrumentNo(customerPaymentDetails.getInstrumentNo());
		customerPaymentDao.setPaidAmount(customerPaymentDetails.getPaidAmount());
		customerPaymentDao.setCashAmount(customerPaymentDetails.getCashAmount());
		customerPaymentDao.setTxnType(addCustomerPaymentDto.getTxnType());
		customerPaymentDao.setPaymentDate(customerPaymentDetails.getPaymentDate());
		customerPaymentDao.setInstrumentDate(customerPaymentDetails.getInstrumentDate());

		customerPaymentDao.setStoreType(storeDetails.getOwnerTypeCode());
		customerPaymentDao.setStateCode(storeDetails.getStateCode());
		customerPaymentDao.setCountryCode(storeDetails.getCountryCode());
		customerPaymentDao.setCompanyName(storeDetails.getStoreDetails().getCompanyName());
		customerPaymentDao.setLocationPanNumber(storeDetails.getTcsDetails().getLocationPanNumber());

		return customerPaymentDao;
	}

	/**
	 * This method will get unique identifier based on customer type.
	 * 
	 * @param customerId
	 * @param customerDao
	 * @return String
	 */
	
	@Override
	public String getCustomerUniqueIdentifier(CustomerDao customerDao) {

		String customerType = customerDao.getCustomerType();
		String uniqueIdentifier1 = null;

		if (CustomerTypeEnum.REGULAR.name().equals(customerType)) {
			uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getMobileNumber(), SalesConstants.MOBILE_NO);
		} else if (CustomerTypeEnum.INSTITUTIONAL.name().equals(customerType)
				&& !StringUtils.isEmpty(customerDao.getInstiTaxNo())) {
			uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getInstiTaxNo(), SalesConstants.INSTI_TAX_NO);
		} else if (CustomerTypeEnum.INTERNATIONAL.name().equals(customerType)) {
			uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getPassportId(), SalesConstants.PASSPORT_ID);
		} else if (CustomerTypeEnum.ONETIME.name().equals(customerType)) {

			if (!StringUtils.isEmpty(customerDao.getMobileNumber())
					&& (!SalesConstants.MOB_NO_TEN_NINES.equals(customerDao.getMobileNumber())
							&& !SalesConstants.MOB_NO_TEN_ZEROS.equals(customerDao.getMobileNumber()))) {
				uniqueIdentifier1 = CryptoUtil.decrypt(customerDao.getMobileNumber(), SalesConstants.MOBILE_NO);
			} else {
				uniqueIdentifier1 = String.valueOf(customerDao.getId());
			}

		}

		return uniqueIdentifier1;
	}

	@Override
	public CashLimitResponseDto getCashLimit(String customerType, String searchValue, String txnType, Date businessDate,
			Date instrumentDate, String ulpId) {

		String regex = null;
		// input validation
		switch (customerType) {

		case "REGULAR":
			regex = RegExConstants.MOBILE_REGEX;
			break;

		case "INTERNATIONAL":
			regex = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20;
			break;

		case "INSTITUTIONAL":
			regex = RegExConstants.GST_REGEX;
			break;

		case "ONETIME":
			regex = RegExConstants.MOBILE_REGEX + "|" + RegExConstants.UUID_REGEX;
			break;

		default:
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid search type: " + customerType);
		}

		searchFieldPatternCheck(customerType, searchValue, regex);

		// validate txnType
		if (CashLimitTxnTypeEnum.valueOf(txnType) == null) {
			// pending
			throw new ServiceException("Invalid cash limit transaction type", "ERROR");
		}

		CashPaymentRuleDetails cashPaymentRuleDetails = getCashLimitConfig();
		boolean skipDailyCashLimitCheck = false;
		// if instrumentDate != null && instrument date is not valid then skip check
		if (instrumentDate != null && ((instrumentDate.before(businessDate)
				&& BooleanUtils.isTrue(cashPaymentRuleDetails.getApplicableDays().getIsSingleDay()))
				|| (instrumentDate.before(cashPaymentRuleDetails.getValidFrom())
						&& BooleanUtils.isTrue(cashPaymentRuleDetails.getApplicableDays().getIsVariableDay())))) {
			skipDailyCashLimitCheck = true;
		}

		// do check for applicable store
		// if current location is L1 or L2 and isApplicable L1L2 is not checked, then
		// return
		// if current location is L3 and isApplicable L3 is not checked, then return
		if ((List.of(OwnerTypeEnum.L1.name(), OwnerTypeEnum.L2.name()).contains(CommonUtil.getLoggedInUserType())
				&& !BooleanUtils.isTrue(cashPaymentRuleDetails.getL1l2Stores()))
				|| (OwnerTypeEnum.L3.name().equals(CommonUtil.getLoggedInUserType())
						&& !BooleanUtils.isTrue(cashPaymentRuleDetails.getL3Stores()))) {
			skipDailyCashLimitCheck = true;
		}

		CashLimitResponseDto cashLimitResponseDto;

		// call eposs with same, if currently in POSS APP
		// if in EPOSS application, then create and execute query
		if (CommonUtil.isEpossApp()) {
			log.info("In EPOSS");
			cashLimitResponseDto = buildAndExecuteCashLimitCheckQuery(customerType, searchValue, txnType,
					cashPaymentRuleDetails, businessDate, skipDailyCashLimitCheck, ulpId);
		} else {

			try {
				// if in POSS application, then call to EPOSS.
				// call to EPOSS
				log.info("In POSS, call to EPOSS");
				Map<String, String> requestParamters = getReqParamForCashLimitCall(customerType, searchValue, txnType,
						businessDate, ulpId);
				cashLimitResponseDto = callEpossToGetCashDetails(requestParamters, "cash-limit",
						CashLimitResponseDto.class);
			} catch (Exception e) {
				// if in POSS application and EPOSS call failed, then create and execute query
				// call function.
				log.info("In POSS, call to EPOSS failed\n" + e.toString());
				cashLimitResponseDto = buildAndExecuteCashLimitCheckQuery(customerType, searchValue, txnType,
						cashPaymentRuleDetails, businessDate, skipDailyCashLimitCheck, ulpId);
			}
		}

		return cashLimitResponseDto;
	}

	private Map<String, String> getReqParamForCashLimitCall(String customerType, String searchValue, String txnType,
			Date businessDate, String ulpId) {
		Map<String, String> requestParamters = new HashMap<>();
		requestParamters.put("customerType", customerType);
		requestParamters.put("searchValue", searchValue);
		requestParamters.put("txnType", txnType);
		requestParamters.put("businessDate", CalendarUtils.formatDateToSql(businessDate));
		if (!StringUtils.isEmpty(ulpId))
			requestParamters.put("ulpId", ulpId);

		return requestParamters;
	}

	private CashPaymentRuleDetails getCashLimitConfig() {

		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(CommonUtil.getLocationCode());

		Object objRespose = engineService.getRuleFieldValues(RuleTypeEnum.CASH_CONFIGURATION, ruleRequestListDto);

		if (StringUtils.isEmpty(objRespose)) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Cash limit configuration is not present for the location " + CommonUtil.getLocationCode());
		}

		return MapperUtil.mapObjToClass(objRespose, CashPaymentRuleDetails.class);
	}

	private CashLimitResponseDto buildAndExecuteCashLimitCheckQuery(String customerType, String searchValue,
			String txnType, CashPaymentRuleDetails cashPaymentRuleDetails, Date businessDate,
			boolean skipDailyCashLimitCheck, String ulpId) {

		LocationCacheDto storeDetails = getLocationDetails();
		BigDecimal totalCashPaid = null;
		if (!skipDailyCashLimitCheck) {// do cash limit check if and only if required
			// @formatter:off
			String query = "SELECT COALESCE(SUM(cash_amount),0)  \r\n" + " FROM customer_payment \r\n"
					+ " WHERE customer_identifier_1 = '" + searchValue + NEXT_LINE_CHARACTER + " AND payment_date = '"
					+ CalendarUtils.formatDateToSql(businessDate) + NEXT_LINE_CHARACTER + " AND instrument_date > '"
					+ CalendarUtils.formatDateToSql(cashPaymentRuleDetails.getValidFrom()) + NEXT_LINE_CHARACTER 
					+ "AND (payment_id is not null or instrument_date='" + CalendarUtils.formatDateToSql(businessDate)+"' )";
			// @formatter:on

			// for applicable days
			if (BooleanUtils.isTrue(cashPaymentRuleDetails.getApplicableDays().getIsSingleDay())) {

				// @formatter:off
				query = query + " AND instrument_date = '" + CalendarUtils.formatDateToSql(businessDate)
						+ NEXT_LINE_CHARACTER + " AND ( payment_code = '" + PaymentCodeEnum.CASH.getPaymentcode() + "'"
						+ " OR payment_code = '" + PaymentCodeEnum.RO_PAYMENT.getPaymentcode() + "' ) \r\n";
				// @formatter:on
			} else {
				query = getApplicablePaymentTypes(cashPaymentRuleDetails.getApplicablePaymentType(), query);
			}

			// for applicable stores
			query = getApplicableStores(cashPaymentRuleDetails, query, storeDetails);

			// for applicable txn types
			query = getApplicableTxns(cashPaymentRuleDetails.getCummulativeCashValue(),
					cashPaymentRuleDetails.getApplicableTransaction(), txnType, query);

			// get amount from GHS
			BigDecimal cashCollectedAtGHS = BigDecimal.ZERO;
			if (CustomerTypeEnum.REGULAR.name().equals(customerType)
					&& BooleanUtils.isTrue(cashPaymentRuleDetails.getCummulativeCashValue())
					&& BooleanUtils.isTrue(cashPaymentRuleDetails.getApplicableTransaction().getGhs())) {

				try {
					GhsCashResponseDto ghsCashResponseDto = integrationService.getCashCollectedAtGHS(
							VendorCodeEnum.GHS.name(), null, searchValue, CalendarUtils.formatDateToSql(businessDate));
					cashCollectedAtGHS = ghsCashResponseDto.getAmount();

				} catch (Exception e) {
					// do nothing
					log.info("Failed to get cash collected at GHS. Exception - {}", e.getMessage());
				}
			}
			
			// get amount from SERVICE
            BigDecimal cashCollectedAtService = BigDecimal.ZERO;
            if (CustomerTypeEnum.REGULAR.name().equals(customerType)
                    && BooleanUtils.isTrue(cashPaymentRuleDetails.getCummulativeCashValue())
                    && BooleanUtils.isTrue(cashPaymentRuleDetails.getApplicableTransaction().getServicePoss())) {

                try {
                    ServiceCashCollectedDto serviceCashCollectedDto = integrationService.getCashCollectedAtServicePoss(
                            searchValue,CommonUtil.getLocationCode(),CalendarUtils.formatDateToSql(businessDate));
                    cashCollectedAtService = serviceCashCollectedDto.getTotalcashpaid()!= null ? serviceCashCollectedDto.getTotalcashpaid() : BigDecimal.ZERO;

                } catch (Exception e) {
                    // do nothing
                    log.info("Failed to get cash collected at service poss. Exception - {}", e.getMessage());
                }
            }


			// execute query and take the sum
			totalCashPaid = customerPaymentRepository.getTotalCashPaid(query);
			

			// cash limit = maxCap - (totalCashPaid + cashCollectedAtGHs )
			totalCashPaid = new BigDecimal(cashPaymentRuleDetails.getCashAmountMaxCap())
					 .subtract((totalCashPaid.add(cashCollectedAtGHS).add(cashCollectedAtService)));
					//.subtract((totalCashPaid.add(cashCollectedAtGHS)));
			
		}

		// -----PMLA check start--------
		// Build query to get cumulative transaction total amount for the businessDate
		// month
		BigDecimal totalCashPaidPmla = BigDecimal.ZERO;

		String pmlaQuery = buildPmlaTotalAmountPaidQuery(searchValue, cashPaymentRuleDetails, businessDate,
				storeDetails);

		// execute PMLA cash limit query and take the sum
		totalCashPaidPmla = customerPaymentRepository.getTotalCashPaid(pmlaQuery);

		// Legacy Pmla cash Paid
		if (!StringUtils.isEmpty(ulpId)) {
			PmlaLegacyResponseDto dto = integrationServiceClient.getPmlaDetails(businessDate, ulpId);
			if (dto.getTotalTransactedAmount() != null
					&& dto.getTotalTransactedAmount().compareTo(BigDecimal.ZERO) > 0) {
				totalCashPaidPmla = totalCashPaidPmla.add(dto.getTotalTransactedAmount());
			}
		}
		// API TO retrieve Legacy POSS cash paid
		// cash pmlaLimit = maxCap - (totalCashPaid + cashCollectedAtGHs )
		totalCashPaidPmla = new BigDecimal(cashPaymentRuleDetails.getPmlaSettings().getCashAmountMaxCap())
				.subtract((totalCashPaidPmla));

		// -----PMLA check end--------
		return new CashLimitResponseDto(totalCashPaid, totalCashPaidPmla, txnType);
	}

	private String buildPmlaTotalAmountPaidQuery(String searchValue, CashPaymentRuleDetails cashPaymentRuleDetails,
			Date businessDate, LocationCacheDto storeDetails) {

		if (cashPaymentRuleDetails.getPmlaSettings() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023, "PMLA configuration is not present." + CommonUtil.getStoreCode());
		}

		// @formatter:off
		String query = "SELECT COALESCE(SUM(cash_amount),0)  \r\n" + " FROM customer_payment \r\n"
				+ " WHERE customer_identifier_1 = '" + searchValue + NEXT_LINE_CHARACTER
				+ "AND (( payment_code <> '"+PaymentCodeEnum.CREDIT_NOTE.getPaymentcode()+"'"
				+ "AND MONTH(payment_date) = MONTH('" + CalendarUtils.formatDateToSql(businessDate) + "') "
				+ "AND YEAR(payment_date) = YEAR('" + CalendarUtils.formatDateToSql(businessDate) + "'))"
				
				+ "OR (  payment_code = '"+PaymentCodeEnum.CREDIT_NOTE.getPaymentcode()+"'"
				+ "AND MONTH(payment_date) = MONTH('" + CalendarUtils.formatDateToSql(businessDate) + "') "
				+ "AND YEAR(payment_date) = YEAR('" + CalendarUtils.formatDateToSql(businessDate) + "') "
				+"AND (( txn_type <> '"+CashLimitTxnTypeEnum.CN_CANCEL+"'"
				+ "AND MONTH(instrument_date) <> MONTH('" + CalendarUtils.formatDateToSql(businessDate) + "') "
				+ "AND YEAR(instrument_date) <> YEAR('" + CalendarUtils.formatDateToSql(businessDate) + "'))"
				+"OR (txn_type = '"+CashLimitTxnTypeEnum.CN_CANCEL+"'))))";

		      
		// @formatter:on

//		query = getApplicablePaymentTypesPmla(query);

		// for applicable stores
		query = getApplicableStoresPmla(cashPaymentRuleDetails, query, storeDetails);

		return query;
	}

	private String getApplicablePaymentTypes(ApplicablePaymentTypeData applicablePaymentTypeData, String query) {

		String paymentTypeQuery = "  payment_code = '" + PaymentCodeEnum.CASH.getPaymentcode() + NEXT_LINE_CHARACTER;

		String paymentCode = " OR ( payment_code = '";
		String paymentType = "' AND payment_type = '";

		if (BooleanUtils.isTrue(applicablePaymentTypeData.getAdvanceCN())) {
			// @formatter:off
			paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.CREDIT_NOTE.getPaymentcode()
					+ paymentType + CNType.ADV.toString() + CLOSING_BRACKET;
			// @formatter:on
		}
		if (BooleanUtils.isTrue(applicablePaymentTypeData.getBillCancel())) {
			// @formatter:off
			paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.CREDIT_NOTE.getPaymentcode()
					+ paymentType + CNType.BILL_CANCELLATION.toString() + CLOSING_BRACKET;
			// @formatter:on
		}
		if (BooleanUtils.isTrue(applicablePaymentTypeData.getCnIBT())) {
			// @formatter:off
			paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.CREDIT_NOTE.getPaymentcode()
					+ paymentType + CNType.CN_IBT.toString() + CLOSING_BRACKET;
			// @formatter:on
		}
		if (BooleanUtils.isTrue(applicablePaymentTypeData.getGrn())) {
			// @formatter:off
			paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.CREDIT_NOTE.getPaymentcode()
					+ paymentType + CNType.GRN.toString() + CLOSING_BRACKET;
			// @formatter:on
		}
		if (BooleanUtils.isTrue(applicablePaymentTypeData.getGhsMaturity())) {
			// @formatter:off
			paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.CREDIT_NOTE.getPaymentcode()
					+ paymentType + CNType.GHS.toString() + CLOSING_BRACKET;
			// @formatter:on
		}
		if (BooleanUtils.isTrue(applicablePaymentTypeData.getGhsMaturity())) {
			// @formatter:off
			paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode()
					+ CLOSING_BRACKET;
			// @formatter:on
		}
		if (BooleanUtils.isTrue(applicablePaymentTypeData.getAdvanceCN())) {
			// @formatter:off
			paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.QCGC.getPaymentcode() + CLOSING_BRACKET;
			// @formatter:on
		}
		
		// @formatter:off
					paymentTypeQuery = paymentTypeQuery + paymentCode + PaymentCodeEnum.RO_PAYMENT.getPaymentcode() + CLOSING_BRACKET;
		// @formatter:on

		query = query + " AND ( " + paymentTypeQuery + ") \r\n";

		return query;
	}

	private String getApplicablePaymentTypesPmla(String query) {

		String instrumentDateNotPaymentDate = " AND ((payment_code = 'CREDIT NOTE' AND MONTH(instrument_date) <> MONTH(payment_date) AND YEAR(instrument_date) <> YEAR(payment_date)) OR (payment_code != 'CREDIT NOTE')) ";

		query = query + instrumentDateNotPaymentDate + " \r\n";

		return query;
	}

	private String getApplicableStores(CashPaymentRuleDetails cashPaymentRuleDetails, String query,
			LocationCacheDto storeDetails) {

		ApplicableL1L2StoresData applicableStoresData = null;
		if (List.of(OwnerTypeEnum.L1.name(), OwnerTypeEnum.L2.name()).contains(CommonUtil.getLoggedInUserType())
				&& BooleanUtils.isTrue(cashPaymentRuleDetails.getL1l2Stores())) {
			applicableStoresData = cashPaymentRuleDetails.getApplicableL1L2Stores();
			query = query + " AND store_type IN ('" + OwnerTypeEnum.L1.name() + "', '" + OwnerTypeEnum.L2.name()
					+ CLOSING_BRACKET;
		} else if (BooleanUtils.isTrue(cashPaymentRuleDetails.getL3Stores())) {
			applicableStoresData = cashPaymentRuleDetails.getApplicableL3Stores();
			query = query + " AND store_type = '" + OwnerTypeEnum.L3.name() + NEXT_LINE_CHARACTER;
		}

		if (applicableStoresData == null) {
			return query;
		}

		String applicableStoresQuery = " AND country_code = '" + storeDetails.getCountryCode() + NEXT_LINE_CHARACTER;

		if (BooleanUtils.isTrue(applicableStoresData.getSameStore())) {
			applicableStoresQuery = applicableStoresQuery + " AND location_code = '" + CommonUtil.getLocationCode()
					+ NEXT_LINE_CHARACTER;
		} else if (BooleanUtils.isTrue(applicableStoresData.getSameState())) {
			applicableStoresQuery = applicableStoresQuery + " AND state_code = '" + storeDetails.getStateCode()
					+ NEXT_LINE_CHARACTER;
		}

		if (OwnerTypeEnum.L3.name().equals(CommonUtil.getLoggedInUserType())) {
			applicableStoresQuery = applicableStoresQuery + " AND location_pan_number = '"
					+ storeDetails.getTcsDetails().getLocationPanNumber() + NEXT_LINE_CHARACTER;
		}

		query = query + applicableStoresQuery;

		return query;
	}

	// TO-DO pmla setting
	private String getApplicableStoresPmla(CashPaymentRuleDetails cashPaymentRuleDetails, String query,
			LocationCacheDto storeDetails) {

		ApplicableL1L2StoresData applicableStoresData = null;
		if (List.of(OwnerTypeEnum.L1.name(), OwnerTypeEnum.L2.name()).contains(CommonUtil.getLoggedInUserType())
				&& BooleanUtils.isTrue(cashPaymentRuleDetails.getPmlaSettings().getL1l2Stores())) {
			applicableStoresData = cashPaymentRuleDetails.getPmlaSettings().getApplicableL1L2Stores();
			query = query + " AND store_type IN ('" + OwnerTypeEnum.L1.name() + "', '" + OwnerTypeEnum.L2.name()
					+ CLOSING_BRACKET;
		} else if (BooleanUtils.isTrue(cashPaymentRuleDetails.getPmlaSettings().getL3Stores())) {
			applicableStoresData = cashPaymentRuleDetails.getPmlaSettings().getApplicableL3Stores();
			query = query + " AND store_type = '" + OwnerTypeEnum.L3.name() + NEXT_LINE_CHARACTER;
		}

		if (ObjectUtils.isEmpty(applicableStoresData)) {
			return query;
		}

		String applicableStoresQuery = " AND country_code = '" + storeDetails.getCountryCode() + NEXT_LINE_CHARACTER;

		if (BooleanUtils.isTrue(applicableStoresData.getSameStore())) {
			applicableStoresQuery = applicableStoresQuery + " AND location_code = '" + CommonUtil.getLocationCode()
					+ NEXT_LINE_CHARACTER;
		} else if (BooleanUtils.isTrue(applicableStoresData.getSameState())) {
			applicableStoresQuery = applicableStoresQuery + " AND state_code = '" + storeDetails.getStateCode()
					+ NEXT_LINE_CHARACTER;
		}

		if (OwnerTypeEnum.L3.name().equals(CommonUtil.getLoggedInUserType())) {
			applicableStoresQuery = applicableStoresQuery + " AND location_pan_number = '"
					+ storeDetails.getTcsDetails().getLocationPanNumber() + NEXT_LINE_CHARACTER;
		}

		query = query + applicableStoresQuery;

		return query;
	}

	private String getApplicableTxns(Boolean isCummulativeCashValue, ApplicableTransactionData applicableTransaction,
			String txnType, String query) {

		if (!BooleanUtils.isTrue(isCummulativeCashValue)) {
			return query + " AND txn_type = '" + txnType + NEXT_LINE_CHARACTER;
		}

		Set<String> txnTypeList = new HashSet<>();
		txnTypeList.add(txnType);

		if (BooleanUtils.isTrue(applicableTransaction.getAdvanceBooking())) {
			txnTypeList.add(CashLimitTxnTypeEnum.AB.name());
		}
		if (BooleanUtils.isTrue(applicableTransaction.getCashMemo())) {
			txnTypeList.add(CashLimitTxnTypeEnum.CM.name());
		}
		if (BooleanUtils.isTrue(applicableTransaction.getCustomerOrder())) {
			txnTypeList.add(CashLimitTxnTypeEnum.CO.name());
		}
		if (BooleanUtils.isTrue(applicableTransaction.getAcceptAdvance())) {
			txnTypeList.add(CashLimitTxnTypeEnum.ADV.name());
		}
		if (BooleanUtils.isTrue(applicableTransaction.getGrf())) {
			txnTypeList.add(CashLimitTxnTypeEnum.GRF.name());
		}
		if (BooleanUtils.isTrue(applicableTransaction.getGiftCardValue())) {
			txnTypeList.add(CashLimitTxnTypeEnum.GIFT_CARD.name());
		}
		txnTypeList.add(CashLimitTxnTypeEnum.CN_CANCEL.name());
		query = query + " AND txn_type IN (" + formatSetToInClause(txnTypeList) + ") \r\n";

		return query;
	}

	private String formatSetToInClause(Set<String> valueList) {
		StringBuilder sb = new StringBuilder();
		int count = 0;
		for (String value : valueList) {

			sb.append("'" + value + "'");
			if (count != valueList.size() - 1) {
				sb.append(",");
			}
			count++;
		}
		return sb.toString();
	}

	private <T> T callEpossToGetCashDetails(Map<String, String> requestParamters, String relativeUrl,
			Class<T> className) {

		ApiResponseDto epossResponseDto = integrationService.callEpossAPI(HttpMethod.GET,
				"api/sales/v2/customers/eposs/" + relativeUrl, requestParamters, null);

		// if 200, then return response
		if (epossResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {

			return MapperUtil.mapObjToClass(epossResponseDto.getResponse(), className);
		} else {
			// re-throw the error
			String errorCode = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.CODE);
			String errorMessage = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(),
					CommonConstants.MESSAGE);

			// if code & message is there in response then show service exception
			if (!StringUtils.isEmpty(errorCode) && !StringUtils.isEmpty(errorMessage)) {
				Object errCause = null;
				if (epossResponseDto.getResponse() != null)
					errCause = JsonUtils.getValueFromJson(epossResponseDto.getResponse(), CommonConstants.ERROR_CAUSE,
							Object.class);
				throw new ServiceException(errorCode, errorMessage, errCause);

			} else {
				// if code & message not there, then throw generic error message
				throw new ServiceException(SalesConstants.CALL_TO_EPOSS_FAILED, SalesConstants.ERR_INT_025,
						epossResponseDto.getResponse());
			}
		}
	}

	@Override
	public InstrumentCashAmountDto cashLimitCheck(InstrumentCashAmountDto instrumentCashAmountDto, String paymentCode,
			String instrumentNo, SalesTxnDaoExt salesTxnDao, Integer customerId, boolean isEligibleAmountCheck) {

		// if QCGC, run query to get cash payment for QCGC.
		instrumentCashAmountDto = getCashPaidBasedOnPaymentCodeAndInstrumentNo(instrumentCashAmountDto, paymentCode,
				instrumentNo);
		

		if ((instrumentCashAmountDto.getTotalCashAmount() == null
				|| BigDecimal.ZERO.compareTo(instrumentCashAmountDto.getTotalCashAmount()) == 0)
				&& !isEligibleAmountCheck) {
			return null;
		}
        
        
        
		CustomerLocationMappingDao customerLocMappingDao = customerLocationMappingRepository
				.findByCustomerIdAndLocationCode(customerId, CommonUtil.getLocationCode());

		if (customerLocMappingDao == null) {
			throw new ServiceException(SalesConstants.CUSTOMER_DETAILS_NOT_FOUND_FOR_THE_GIVEN_ID,
					SalesConstants.ERR_SALE_011, "Customer details not present for customer id :" + customerId);
		}

		CustomerDao customerDao = customerLocMappingDao.getCustomer();

		String searchValue = null;

		if (CustomerTypeEnum.REGULAR.name().equals(customerDao.getCustomerType())) {
			searchValue = CryptoUtil.decrypt(customerDao.getMobileNumber(), SalesConstants.MOBILE_NO);
		} else if (CustomerTypeEnum.INSTITUTIONAL.name().equals(customerDao.getCustomerType())
				&& !StringUtils.isEmpty(customerDao.getInstiTaxNo())) {
			searchValue = CryptoUtil.decrypt(customerDao.getInstiTaxNo(), SalesConstants.INSTI_TAX_NO);
		} else if (CustomerTypeEnum.INTERNATIONAL.name().equals(customerDao.getCustomerType())) {
			searchValue = CryptoUtil.decrypt(customerDao.getPassportId(), SalesConstants.PASSPORT_ID);
		} else if (CustomerTypeEnum.ONETIME.name().equals(customerDao.getCustomerType())) {

			if (!StringUtils.isEmpty(customerDao.getMobileNumber())
					&& (!SalesConstants.MOB_NO_TEN_NINES.equals(customerDao.getMobileNumber())
							&& !SalesConstants.MOB_NO_TEN_ZEROS.equals(customerDao.getMobileNumber()))) {
				searchValue = CryptoUtil.decrypt(customerDao.getMobileNumber(), SalesConstants.MOBILE_NO);
			} else {
				searchValue = String.valueOf(customerDao.getId());
			}

		}
		
         BusinessDayDto businessDate = businessDayService.getBusinessDay();
		
		if(paymentCode!=null && paymentCode.equalsIgnoreCase(PaymentCodeEnum.QCGC.getPaymentcode().toString()) 
				&& instrumentCashAmountDto.getPaymentDate() !=null && searchValue!=null && instrumentCashAmountDto.getCustomerIdentifier1()!=null ) {
			   
		   Calendar cal1 = Calendar.getInstance();
		   Calendar cal2 = Calendar.getInstance();
		   cal1.setTime(businessDate.getBusinessDate());
		   cal2.setTime(instrumentCashAmountDto.getPaymentDate());
           if(searchValue.equalsIgnoreCase(instrumentCashAmountDto.getCustomerIdentifier1()) && cal1.equals(cal2) ) {
			return instrumentCashAmountDto;
		   }
		}
		
		if (searchValue != null) {
			CashPaymentRuleDetails cashPaymentRuleDetails = getCashLimitConfig();
			
			CashLimitResponseDto cashLimitResponseDto = getCashLimit(customerDao.getCustomerType(), searchValue,
					CashLimitTxnTypeEnum.getCashLimitTxnTypeBasedOnTxnTypeAndSubTxnType(salesTxnDao.getTxnType(),
							salesTxnDao.getSubTxnType()).name(),
					businessDate.getBusinessDate(), instrumentCashAmountDto.getPaymentDate(), customerDao.getUlpId());

			// check amount to throw error
			checkCashAndPmlaLimit(instrumentCashAmountDto, isEligibleAmountCheck, cashPaymentRuleDetails,
					cashLimitResponseDto);

			// used for QCGC (as cashElement)
			BigDecimal cashElement = instrumentCashAmountDto.getTotalCashAmount();

			/// in some cases, daily cash limit check is skipped
			if (cashLimitResponseDto.getMaxCashLimit() != null) {
				instrumentCashAmountDto.setTotalCashAmount(
						cashLimitResponseDto.getMaxCashLimit().subtract(instrumentCashAmountDto.getTotalPaidAmount()));
			}
			// used for QCGC (as cashElement)
			instrumentCashAmountDto.setTotalPaidAmount(cashElement);

			// PMLA cash limit
			instrumentCashAmountDto.setTotalPmlaCashAmount(cashLimitResponseDto.getMaxCashPmlaLimit()
					.subtract(instrumentCashAmountDto.getTotalPmlaCashAmount()));
		}
		return instrumentCashAmountDto;
	}

	private void checkCashAndPmlaLimit(InstrumentCashAmountDto instrumentCashAmountDto, boolean isEligibleAmountCheck,
			CashPaymentRuleDetails cashPaymentRuleDetails, CashLimitResponseDto cashLimitResponseDto) {
		// if not eligible payment check, then throw error.
		// use total paid amount for cash limit check, as that will contain all cash
		// paid for current transaction.
		
		if (!isEligibleAmountCheck && cashLimitResponseDto.getMaxCashLimit() != null
				&& instrumentCashAmountDto.getTotalPaidAmount().compareTo(cashLimitResponseDto.getMaxCashLimit()) > 0) {
			throw new ServiceException(SalesConstants.CASH_PAID_BY_CUSTOMER_EXCEEDS_LIMIT, SalesConstants.ERR_SALE_208,
					Map.of("maxCashLimit", cashLimitResponseDto.getMaxCashLimit(), "totalCashPaid",
							instrumentCashAmountDto.getTotalCashAmount()));
		}

		// PMLA limit check
		if (!isEligibleAmountCheck && instrumentCashAmountDto.getTotalPmlaCashAmount()
				.compareTo(cashLimitResponseDto.getMaxCashPmlaLimit()) > 0) {
			throw new ServiceException(
					String.format(SalesConstants.CASH_PAID_BY_CUSTOMER_EXCEEDS_PMLA_LIMIT,
							cashPaymentRuleDetails.getPmlaSettings().getCashAmountMaxCap()),
					SalesConstants.ERR_SALE_341, "PMLA limit is reached",
					Map.of("maxCashPmlaLimit", cashPaymentRuleDetails.getPmlaSettings().getCashAmountMaxCap()));
		}
	}

	/**
	 * This method will get the cash paid based on inputs.
	 * 
	 * @param instrumentCashAmountDto
	 * @param paymentCode
	 * @param instrumentNo
	 * @return InstrumentCashAmountDto
	 */
	private InstrumentCashAmountDto getCashPaidBasedOnPaymentCodeAndInstrumentNo(
			InstrumentCashAmountDto instrumentCashAmountDto, String paymentCode, String instrumentNo) {

		if (PaymentCodeEnum.QCGC.getPaymentcode().equals(paymentCode)) {
			BigDecimal totalCashPaid = instrumentCashAmountDto.getTotalCashAmount();
			BigDecimal totalPaidAmount = instrumentCashAmountDto.getTotalPaidAmount();
			BigDecimal totalPmlaAmount = instrumentCashAmountDto.getTotalPmlaCashAmount();

			instrumentCashAmountDto = getCashPaidForTheInstrument(instrumentNo);

			// totalCash paid in current payment
			if (instrumentCashAmountDto != null
					&& BigDecimal.ZERO.compareTo(instrumentCashAmountDto.getTotalCashAmount()) < 0) {
				if (totalCashPaid.compareTo(instrumentCashAmountDto.getTotalCashAmount()) > 0) {
					totalCashPaid = instrumentCashAmountDto.getTotalCashAmount();
				} else {
					totalCashPaid = totalCashPaid
							.multiply(instrumentCashAmountDto.getTotalCashAmount().divide(
									instrumentCashAmountDto.getTotalPaidAmount(), DomainConstants.PRICE_SCALE,
									DomainConstants.ROUNDIND_MODE))
							.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
				}
				totalPaidAmount = totalPaidAmount.add(totalCashPaid);
				totalPmlaAmount = totalPmlaAmount.add(totalCashPaid);
				instrumentCashAmountDto.setTotalCashAmount(totalCashPaid);
				instrumentCashAmountDto.setTotalPmlaCashAmount(totalPmlaAmount);
				instrumentCashAmountDto.setTotalPaidAmount(totalPaidAmount);// use total paid amount for cash limit
																			// check

			}

		}

		if (instrumentCashAmountDto == null) {
			instrumentCashAmountDto = new InstrumentCashAmountDto();
		}

		return instrumentCashAmountDto;
	}

	@Override
	public InstrumentCashAmountDto getCashPaidForTheInstrument(String instrumentNo) {
		// call eposs with same, if currently in POSS APP
		// if in EPOSS application, then create and execute query
		List<InstrumentCashAmountDto> instrumentCashAmountDtoList = new ArrayList<>();
		if (CommonUtil.isEpossApp()) {
			log.info("In EPOSS to get cash for instrument:");
			instrumentCashAmountDtoList = customerPaymentRepository.getByInstrumentNoAndTxnType(instrumentNo,
					CashLimitTxnTypeEnum.GIFT_CARD.name());

		} else {

			try {
				// if in POSS application, then call to EPOSS.
				log.info("In POSS, call EPOSS to get cash for instrument:");
				Map<String, String> requestParamters = Map.of("instrumentNo", instrumentNo);
				InstrumentCashAmountDto instrumentCashAmountDto = callEpossToGetCashDetails(requestParamters,
						"instrument-cash", InstrumentCashAmountDto.class);
				if (instrumentCashAmountDto != null)
					instrumentCashAmountDtoList.add(instrumentCashAmountDto);

			} catch (Exception e) {
				// if in POSS application and EPOSS call failed, then create and execute query
				// call function.
				log.info("In POSS, call EPOSS failed to get cash for instrument:\n" + e.toString());
				instrumentCashAmountDtoList = customerPaymentRepository.getByInstrumentNoAndTxnType(instrumentNo,
						CashLimitTxnTypeEnum.GIFT_CARD.name());
			}
		}
		return CollectionUtil.isEmpty(instrumentCashAmountDtoList) ? null : instrumentCashAmountDtoList.get(0);
	}

	@Override
	public CashPaidDetailsDto getTotalCashPaid(String searchType, String searchValue, String businessDate,
			String locationCode) {
		String regex = null;
		// input validation
		switch (searchType) {

		case MOBILE_NO:
			regex = RegExConstants.MOBILE_REGEX;
			break;

		case ULP_ID:
			regex = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_50;
			break;
		default:
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid search type: " + searchType);

		}
		searchFieldPatternCheck(searchType, searchValue, regex);
		
		//For Daily Cash Limit
		CashPaidDetailsDto dailyCashLimitCashPaid=customerPaymentRepository.getPaidAmountBySearchTypeAndsearchValueAndPaymentDateAndLocationCode(
				searchType, searchValue, CalendarUtils.convertStringToDate(businessDate, CalendarUtils.SQL_DATE_FORMAT),
				locationCode);
		
		return dailyCashLimitCashPaid;
				
	}

	private void searchFieldPatternCheck(String searchType, String value, String regex) {

		if (!Pattern.matches(regex, value)) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid " + searchType + " value: " + value);
		}

	}

	@Override
	public TotalCashPaidDetailsDto getPmlaOfCustomer(String ulpId, String businessDate) {
		TotalCashPaidDetailsDto totalCashPaidDetailsDto=customerPaymentRepository.getPmlaOfCustomer(
				ulpId,CalendarUtils.convertStringToDate(businessDate, CalendarUtils.SQL_DATE_FORMAT));;
		return totalCashPaidDetailsDto;
	}

}
