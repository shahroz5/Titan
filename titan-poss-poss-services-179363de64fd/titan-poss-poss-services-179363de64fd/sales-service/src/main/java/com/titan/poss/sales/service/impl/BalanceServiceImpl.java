/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.transaction.Transactional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.enums.GhsAccountDetailsStatusEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.AccountDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.DiscountVoucherDao;
import com.titan.poss.sales.dao.GiftCardDetailsDao;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.AccountDetailsSyncDtoExt;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.constants.RivaahCardStatusEnum;
import com.titan.poss.sales.dto.response.AccountCustomerDetailsDto;
import com.titan.poss.sales.dto.response.AccountDetailsDto;
import com.titan.poss.sales.dto.response.AccountOtherDetailsDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.DiscountVoucherCustomerDetails;
import com.titan.poss.sales.dto.response.DiscountVoucherOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountVoucherResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.repository.AccountDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.DiscountVoucherRepository;
import com.titan.poss.sales.repository.QwcikcilverCardDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.BalanceService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.SalesSyncDataService;

/**
 * Service class for Balance.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesBalanceService")
public class BalanceServiceImpl implements BalanceService {

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private AccountDetailsRepositoryExt accountDetailsRepository;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepository;

	@Autowired
	private DiscountVoucherRepository discountVoucherRepository;

	@Autowired
	private BalanceServiceImpl balanceServiceImp;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CashMemoServiceImpl cashMemoServiceImpl;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerRepositoryExt customerRepo;
	
	@Autowired
	private CommonTransactionService commonTxnService;
	
	@Autowired
	private QwcikcilverCardDetailsRepositoryExt qwcikcilverCardDetailsRepositoryExt;

	@Value("${app.name}")
	private String appName;
	
	
	
	@Override
	public GcResponseDto giftCardBalance(String vendorCode, String cardNumber, String trackData, Boolean otpRequired) {
		// if otpRequired is null then set to false.
		if (otpRequired == null) {
			otpRequired = false;
		}

		// if otpRequired is true, then OTP will be triggered to customer's mobile
		// number.

		GcResponseDto gcResponseDto = integrationService.getGiftCardBalance(vendorCode, cardNumber, trackData,
				otpRequired);

		if (!"0".equals(gcResponseDto.getResponseCode())) {

			String paymentCode = PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode() + "/"
					+ PaymentCodeEnum.QCGC.getPaymentcode();

			Map<String, String> errorCause = Map.of("cardNo", cardNumber, "errorMessage",
					gcResponseDto.getResponseMessage(), SalesConstants.PAYMENT_CODE, paymentCode);
			throw new ServiceException(null, gcResponseDto.getResponseCode(), gcResponseDto.getResponseMessage(),
					errorCause);
		}
		else {
			
			GiftCardDetailsDao qwcikcilverCardDetails=qwcikcilverCardDetailsRepositoryExt.findByCardNumber(gcResponseDto.getCardNumber());
			
			if(qwcikcilverCardDetails==null)
				{
				qwcikcilverCardDetails = (GiftCardDetailsDao) MapperUtil.getObjectMapping(gcResponseDto,
						new GiftCardDetailsDao());
				qwcikcilverCardDetails.setAmount(new BigDecimal(gcResponseDto.getAmount()));
				qwcikcilverCardDetails.setCardName(gcResponseDto.getCardName());
				qwcikcilverCardDetails.setCardNumber(gcResponseDto.getCardNumber());
				qwcikcilverCardDetails.setCardExpiryDate(gcResponseDto.getCardExpiryDate());
				qwcikcilverCardDetails.setCardType(gcResponseDto.getCardType());
				qwcikcilverCardDetails.setApprovalCode(gcResponseDto.getApprovalCode());
				qwcikcilverCardDetails.setTransactionId(gcResponseDto.getTransactionId());	
				qwcikcilverCardDetails.setTrackData(trackData);
				}
			else {
				qwcikcilverCardDetails = (GiftCardDetailsDao) MapperUtil.getObjectMapping(gcResponseDto,
						qwcikcilverCardDetails);
				qwcikcilverCardDetails.setTrackData(trackData);
			}
			qwcikcilverCardDetailsRepositoryExt.save(qwcikcilverCardDetails);
		}

		return gcResponseDto;
	}

	@Override
	public BigDecimal loyaltyPointsBalance(String vendorCode, String ulpNo) {

		UlpBalanceResponseDto ulpBalanceResponseDto = integrationService.getLoyaltyPointsBalance(vendorCode, ulpNo);

		if (!"0".equals(ulpBalanceResponseDto.getResponseCode())) {
			throw new ServiceException(null, ulpBalanceResponseDto.getResponseCode(),
					ulpBalanceResponseDto.getResponseMessage());
		}

		return ulpBalanceResponseDto.getBalancePoints();
	}

	@Override
	public GcCustomerResponseDto getGiftCardCustomerInfo(String vendorCode, String giftCardNumber) {

		GcCustomerResponseDto gcCustomerResponseDto = integrationService.getGiftCardCustomerInfo(vendorCode,
				giftCardNumber);

		if (!"0".equals(gcCustomerResponseDto.getResponseCode())) {
			String paymentCode = PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode();
			Map<String, String> errorCause = Map.of("cardNo", giftCardNumber, "errorMessage",
					gcCustomerResponseDto.getResponseMessage(), SalesConstants.PAYMENT_CODE, paymentCode);
			throw new ServiceException(gcCustomerResponseDto.getResponseMessage(),
					gcCustomerResponseDto.getResponseCode(), gcCustomerResponseDto.getResponseMessage(), errorCause);
		}

		return gcCustomerResponseDto;
	}

	@Transactional
	public PublishResponse getAccountDetailsTransactional(String vendorCode, Integer accountNumber) {

		GhsAccountDetailsResponseDto ghsAccountDetailsResponseDto = null;
		String locationCode = CommonUtil.getStoreCode();
		MetalRateListDto metalRate = commonTxnService.getMetalRate();

			ghsAccountDetailsResponseDto = integrationService.getGhsAccountDetails(vendorCode, accountNumber);
			validateGHSAccount(ghsAccountDetailsResponseDto);
			ghsAccountDetailsResponseDto.setGoldRate(metalRate.getMetalRates().get(MetalTypeCodeEnum.J.name()).getRatePerUnit());
		
		if (!ghsAccountDetailsResponseDto.getStatus().equals(GhsAccountDetailsStatusEnum.OPEN.name())) {
			if (ghsAccountDetailsResponseDto.getStatus().equals(GhsAccountDetailsStatusEnum.HOLD.name())) {
				throw new ServiceException("This account is in hold, Kindly release the account from hold and redeem",
						"ERR-SALE-406");
			} else {
				throw new ServiceException("GH A/c no :{accountNo} is already added, Please remove to proceed further", "ERR-SALE-447",
						Map.of("accountNo", accountNumber.toString()));
			}
		}
		
		if(!ghsAccountDetailsResponseDto.getIsCancelAccount() && ghsAccountDetailsResponseDto.getRequestStatus()!=0) {
			throw new ServiceException("GH account is pending for refund request, Please contact the commercial team to cancel the refund request and redeem the account",
					"ERR-SALE-451");
		}

		if ((ghsAccountDetailsResponseDto.getMaturityLocationCode() != null
				&& !ghsAccountDetailsResponseDto.getMaturityLocationCode().equals(locationCode))
				|| (ghsAccountDetailsResponseDto.getMaturityLocationCode() == null
						&& !ghsAccountDetailsResponseDto.getEnrolledLocationCode().equals(locationCode))) {
			throw new ServiceException(
					"Account belongs to location '{locationCode}'. Please change the maturity location and try",
					"ERR-SALE-346", Map.of("locationCode", ghsAccountDetailsResponseDto.getMaturityLocationCode()));
		}

		AccountDetailsDaoExt accountDetails = accountDetailsRepository.findOneByAccountnoAccountTypeLocationCode(
				ghsAccountDetailsResponseDto.getAccountNo().toString(), vendorCode, locationCode);

		if (accountDetails == null) {
			accountDetails = (AccountDetailsDaoExt) MapperUtil.getObjectMapping(ghsAccountDetailsResponseDto,
					new AccountDetailsDaoExt());
			accountDetails.setAccountType(vendorCode);
			accountDetails.setAccountNo(ghsAccountDetailsResponseDto.getAccountNo().toString());
		} else {
			accountDetails = (AccountDetailsDaoExt) MapperUtil.getObjectMapping(ghsAccountDetailsResponseDto,
					accountDetails);
			accountDetails.setSrcSyncId(accountDetails.getSrcSyncId() + 1);
		}

		// search customer: PENDING - if not present need to create new customer.
		Integer customerId = customerService.searchCustomerWithoutUlpUpdate(SearchTypeEnum.MOBILE_NO,
				ghsAccountDetailsResponseDto.getMobileNo(),true);

		// set customer
		CustomerLocationMappingDao clm = getCustomerLocMapping(customerId, locationCode);
		accountDetails.setCustomerLocationMap(clm);

		// set other details
		setJsonForAccountDetails(ghsAccountDetailsResponseDto, accountDetails);

		// save details
		accountDetails = accountDetailsRepository.save(accountDetails);

		AccountDetailsDto ghsAccountDetailsDto = (AccountDetailsDto) MapperUtil
				.getDtoMapping(ghsAccountDetailsResponseDto, AccountDetailsDto.class);
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			syncDto = staggingAccountDetails(accountDetails, clm, SalesOperationCode.ACCOUNT_DETAILS);
		ghsAccountDetailsDto.setId(accountDetails.getId());
		ghsAccountDetailsDto.setCustomerId(customerId);

		PublishResponse transResponse = new PublishResponse();
		transResponse.setApiResponse(ghsAccountDetailsDto);
		transResponse.setSyncStagingDto(syncDto);
		return transResponse;
	}

	public void validateGHSAccount(GhsAccountDetailsResponseDto ghsAccountDetailsResponseDto) {
		
		if (ghsAccountDetailsResponseDto != null) {

			if (ghsAccountDetailsResponseDto.getStatus().equals("CLOSED")) {
				throw new ServiceException("Account is Transferred/Closed", "ERR-SALE-457");
			}
			if (ghsAccountDetailsResponseDto.getStatus().equals("MATURED")) {
				throw new ServiceException("Account is Matured", "ERR-SALE-458");
			}
			if (ghsAccountDetailsResponseDto.getStatus().equals("PRE_MATURED")) {
				throw new ServiceException("Account is Pre-Matured", "ERR-SALE-459");
			}
			if (ghsAccountDetailsResponseDto.getStatus().equals("SUSPENDED")) {
				throw new ServiceException("Account is Suspended", "ERR-SALE-460");
			}
			if (ghsAccountDetailsResponseDto.getStatus().equals("HOLD")) {
				throw new ServiceException("Account is on Hold", "ERR-SALE-461");
			}
			if(ghsAccountDetailsResponseDto.getMaturityLocationCode()!=null) {
				if (!ghsAccountDetailsResponseDto.getMaturityLocationCode().isBlank()
						&& !ghsAccountDetailsResponseDto.getMaturityLocationCode()
								.equals(CommonUtil.getStoreCode())) {
					throw new ServiceException("The selected GHS Account has different Maturity Location Code",
							"ERR-SALE-462");
				}
			}
			if (ghsAccountDetailsResponseDto.getIsCancelAccount()) {
				throw new ServiceException("The selected GHS Account is already matured / prematured.", "ERR-SALE-463");
			}
			if (ghsAccountDetailsResponseDto.getRequestStatus() == 1) {
				throw new ServiceException("The selected GHS Account is already matured / prematured", "ERR-SALE-463");
			}
			if (ghsAccountDetailsResponseDto.getRequestStatus() == 2) {
				throw new ServiceException("The selected GHS Account is already matured / prematured", "ERR-SALE-463");

			}
			if (ghsAccountDetailsResponseDto.getAccountCustomerId()==null) {
				throw new ServiceException("Customer details not available at e-GHS system", "ERR-SALE-464");

			}
			if (ghsAccountDetailsResponseDto.getIsChequeRealisationReq()) {
				throw new ServiceException("Account will not be allowed for maturity within cheque realization days",
						"ERR-SALE-465");

			}
			if(ghsAccountDetailsResponseDto.getIsGetACHdetailAvailable()) {
				throw new ServiceException("ACH is available for this account, Unable to Mature/Pre-Mature", "ERR-SALE-466");
			}
			if(ghsAccountDetailsResponseDto.getIsSIAutoDebitEnabled()) {
				throw new ServiceException("Redemption of this account has failed as Auto Debit through SI is enabled for this account. Please cancel the SI in the 'cancel SI' menu to proceed with this transaction", "ERR-SALE-467");
			}
	}
		else 
			throw new ServiceException("No data is present for the request", "ERR-SALE-468");
		
	}
	
	public SyncStagingDto staggingAccountDetails(AccountDetailsDaoExt accountDetails, CustomerLocationMappingDao clm,
			String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (clm != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(clm), 0));
		}
		if (accountDetails != null) {
			syncDataList.add(DataSyncUtil.createSyncData(new AccountDetailsSyncDtoExt(accountDetails), 1));
		}
		MessageRequest accountMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto accountStagingDto = new SyncStagingDto();
		accountStagingDto.setMessageRequest(accountMsgRequest);
		String accountMsgRqst = MapperUtil.getJsonString(accountMsgRequest);
		SyncStaging accountSyncStaging = new SyncStaging();
		accountSyncStaging.setMessage(accountMsgRqst);
		accountSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		accountSyncStaging = saleSyncStagingRepository.save(accountSyncStaging);
		accountStagingDto.setId(accountSyncStaging.getId());
		return accountStagingDto;
	}

	private CustomerLocationMappingDao getCustomerLocMapping(Integer customerId, String locationCode) {

		// no null check, as this will never fail
		return customerLocationMappingRepository.findByCustomerIdAndLocationCode(customerId, locationCode);
	}

	private void setJsonForAccountDetails(GhsAccountDetailsResponseDto ghsAccountDetailsResponseDto,
			AccountDetailsDaoExt accountDetails) {

		AccountOtherDetailsDto accountOtherDetailsDto = (AccountOtherDetailsDto) MapperUtil
				.getDtoMapping(ghsAccountDetailsResponseDto, AccountOtherDetailsDto.class);

		accountDetails
				.setOtherDetails(MapperUtil.getStringFromJson(new JsonData("OTHER_DETAILS", accountOtherDetailsDto)));

		AccountCustomerDetailsDto accountCustomerDetailsDto = (AccountCustomerDetailsDto) MapperUtil
				.getDtoMapping(ghsAccountDetailsResponseDto, AccountCustomerDetailsDto.class);
		accountDetails.setCustomerDetails(
				MapperUtil.getStringFromJson(new JsonData("CUSTOMER_DETAILS", accountCustomerDetailsDto)));

		// set CFA details
		if (!CollectionUtil.isEmpty(ghsAccountDetailsResponseDto.getCfaProductCodes())) {
			accountDetails.setCfaDetails(MapperUtil.getStringFromJson(
					new JsonData("CFA_RESTRICTED", ghsAccountDetailsResponseDto.getCfaProductCodes())));
		}
	}

	@Override
	public AccountDetailsDto getAccountDetails(String vendorCode, Integer accountNumber) {
		PublishResponse apiResponse = balanceServiceImp.getAccountDetailsTransactional(vendorCode, accountNumber);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			salesSyncDataService.publishSalesMessagesToQueue(apiResponse.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(apiResponse.getApiResponse(), new TypeReference<AccountDetailsDto>() {
		});
	}

	@Override
	public DiscountVoucherResponseDto getDiscountVoucherDetails(String vendorCode, Integer voucherNo,
			Integer accountNumber) {

		GhsDiscountVoucherResponseDto ghsDiscountVoucherResponseDto = integrationService
				.getDiscountVoucherDetails(vendorCode, voucherNo, accountNumber);

		String locationCode = CommonUtil.getStoreCode();
		DiscountVoucherDao discountVoucherDao = discountVoucherRepository.findOneByVoucherNoVoucherTypeLocationCode(
				ghsDiscountVoucherResponseDto.getVoucherNo().toString(), vendorCode, locationCode);

		if (discountVoucherDao == null) {
			discountVoucherDao = (DiscountVoucherDao) MapperUtil.getObjectMapping(ghsDiscountVoucherResponseDto,
					new DiscountVoucherDao());
			discountVoucherDao.setVoucherType(vendorCode);
			discountVoucherDao.setVoucherNo(ghsDiscountVoucherResponseDto.getVoucherNo().toString());
			discountVoucherDao.setAccountNo(ghsDiscountVoucherResponseDto.getAccountNo().toString());

		} else {
			discountVoucherDao = (DiscountVoucherDao) MapperUtil.getObjectMapping(ghsDiscountVoucherResponseDto,
					discountVoucherDao);
		}

		// search customer: PENDING - if not present need to create new customer.
		Integer customerId = customerService.searchCustomerWithoutUlpUpdate(SearchTypeEnum.MOBILE_NO,
				ghsDiscountVoucherResponseDto.getMobileNo(),true);

		// set customer
		CustomerLocationMappingDao clm = getCustomerLocMapping(customerId, locationCode);
		discountVoucherDao.setCustomerLocationMap(clm);

		// set other details
		setJsonFordiscountVoucher(ghsDiscountVoucherResponseDto, discountVoucherDao);

		// save details
		discountVoucherRepository.save(discountVoucherDao);

		DiscountVoucherResponseDto discountVoucherResponseDto = (DiscountVoucherResponseDto) MapperUtil
				.getDtoMapping(ghsDiscountVoucherResponseDto, DiscountVoucherResponseDto.class);
		discountVoucherResponseDto.setId(discountVoucherDao.getId());
		discountVoucherResponseDto.setCustomerId(
				discountVoucherDao.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());

		return discountVoucherResponseDto;
	}

	private void setJsonFordiscountVoucher(GhsDiscountVoucherResponseDto ghsDiscountVoucherResponseDto,
			DiscountVoucherDao discountVoucherDao) {

		DiscountVoucherCustomerDetails voucherCustomerDetailsDto = (DiscountVoucherCustomerDetails) MapperUtil
				.getDtoMapping(ghsDiscountVoucherResponseDto, DiscountVoucherCustomerDetails.class);
		discountVoucherDao.setCustomerDetails(
				MapperUtil.getStringFromJson(new JsonData("CUSTOMER_DETAILS", voucherCustomerDetailsDto)));

		DiscountVoucherOtherDetailsDto voucherOtherDetailsDto = (DiscountVoucherOtherDetailsDto) MapperUtil
				.getDtoMapping(ghsDiscountVoucherResponseDto, DiscountVoucherOtherDetailsDto.class);
		discountVoucherDao
				.setOtherDetails(MapperUtil.getStringFromJson(new JsonData("OTHER_DETAILS", voucherOtherDetailsDto)));
	}

	@Override
	public DigiGoldBalanceResponseDto getDigiGoldBalance(String mobileNo, String transactionId) {
		return integrationService.getDigiGoldBalance(mobileNo, transactionId);
	}

	@Override
	public DigiGoldSellingPriceDto sellingPrice(String mobileNo, String transactionId) {
		return integrationService.sellingPrice(mobileNo, transactionId);
	}

	@Override
	public BooleanResponse sendDigiGoldOtp(String mobileNo, BigDecimal tanishqGoldGrams, BigDecimal nonTanishqGoldGrams,
			String transactionId, String referenceId) {
		return integrationService.sendDigiGoldOtp(mobileNo, tanishqGoldGrams, nonTanishqGoldGrams, transactionId,
				referenceId);
	}

	@Override
	public CustomerCouponDto sendRivaahCardCoupon(Integer customerId, Boolean sendCoupon) {
		Set<Integer> customerSet = new HashSet<>();
		customerSet.add(customerId);
		List<Object[]> object = customerRepo.getCustomerNamesByIds(CommonUtil.getLocationCode(), customerSet);
		ApiResponseDto apiResponse = commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2], null,
				null, null);
		CustomerCouponDto customerCouponDto = new CustomerCouponDto();
		if (apiResponse != null && apiResponse.getResponse() != null)
			customerCouponDto = MapperUtil.getObjectMapperInstance().convertValue(apiResponse.getResponse(),
					CustomerCouponDto.class);
		if (BooleanUtils.isTrue(sendCoupon)) {
			if (customerCouponDto.getStatus().equalsIgnoreCase(RivaahCardStatusEnum.LIMIT_EXCEEDED.name()))
				throw new ServiceException("RIVAAH CARD can not be used more than the configured number of times",
						"ERR-SALE-356");
			BusinessDayDto businessDay = engineService.getBusinessDayInProgress();
			if (businessDay.getBusinessDate().after(customerCouponDto.getExpiryDate())) {
				commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2], null,
						RivaahCardStatusEnum.EXPIRED.name(), null);
				throw new ServiceException("RIVAAH CARD is expired", "ERR-SALE-356");
			}
			CustomerDetailsDto customer = customerService.getCustomer(customerId);
			Map<String, String> data = new HashMap<>();
			data.put("coupon", customerCouponDto.getCouponCode());
			data.put("attempts", customerCouponDto.getAttempts().toString());
			data.put("totalCount", customerCouponDto.getTotalCount().toString());
			data.put("expiryDate", customerCouponDto.getExpiryDate().toString());
			data.put("name", StringUtil.getNameForEmail(customer.getCustomerName()));
			cashMemoServiceImpl.sendNotificationToCustomer(customer, data);
		}
		return customerCouponDto;
	}

}
