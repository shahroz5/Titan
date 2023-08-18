/*  
o * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.GhsExcludeProductGroupDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.GhsSchemeTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.dto.GhsDetails;
import com.titan.poss.core.dto.GhsRedeemAccountDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationOtpDetails;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.GhsAccountDetailsStatusEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.AccountDetailsDaoExt;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.GhsAccountDiscountDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SalesOtpTypeEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteRedeemDto;
import com.titan.poss.sales.dto.response.AccountOtherDetailsDto;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.ItemValueAndProductCodeDetailsDto;
import com.titan.poss.sales.dto.response.RivaahGhsDiscountDetailsExtDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.GhsPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.AccountDetailsRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.DiscountFacadeService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.GhsPaymentService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.OtpService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for GHS Payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesGhsPaymentService")
public class GhsPaymentServiceImpl implements GhsPaymentService {

	public GhsPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), this);
	}

	@Autowired
	private AccountDetailsRepositoryExt accountDetailsRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private CommonTransactionService commonTxnService;

	@Autowired
	private OtpService otpService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private DiscountFacadeService discountFacadeService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private CustomerDocumentsRepository customerDocumentsRepository;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {

		(new GhsPaymentFieldsDto()).validateFields(paymentCreateDto);

		// set status to 'OPEN'
		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {

		// 1. isGHS allowed check - checked at Facade layer

		String locationCode = CommonUtil.getStoreCode();
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationCode);
		GhsDetails ghsLocationDetails = getGhsLocationDetails(locationCacheDto);

		AccountDetailsDaoExt accountDetails = getAccountDetails(salesPaymentDto.getInstrumentNo(), locationCode);
		// 2. if AB/CO and GHS is of type 'RIVAAH_GHS', then check for allowed config
		if (GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(accountDetails.getScheme())
				&& (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
						|| TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType()))) {

			Integer noOfDaysToAdd = null;
			if (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())) {
				noOfDaysToAdd = ghsLocationDetails.getNoOfDaysToBlockAdvanceBooking();
			} else if (TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())) {
				noOfDaysToAdd = ghsLocationDetails.getNoOfDaysToBlockCustomerConfig();
			}
			if (noOfDaysToAdd == null) {
				// throw error
				throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_023,
						"No. of days to block GHS account not found for location : " + locationCode);
			}
			// Enrollment date check for AB/CO: NAP-8814
			Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
			log.info("Business date: {}, enroll date: {}, no. of days: {}, added date: {}", businessDate,
					accountDetails.getEnrolledDate(), noOfDaysToAdd, CalendarUtils
							.addDate(CalendarUtils.getStartOfDay(accountDetails.getEnrolledDate()), noOfDaysToAdd));

			if (businessDate.compareTo(CalendarUtils
					.addDate(CalendarUtils.getStartOfDay(accountDetails.getEnrolledDate()), noOfDaysToAdd)) > 0) {
				throw new ServiceException(
						SalesConstants.DURATION_IS_CROSSED_TO_REDEEM_THE_ACCOUNT_IN_DYNAMIC_TRANSACTION_TYPE,
						SalesConstants.ERR_SALE_370, "Limit crossed to use account in " + salesTxnDao.getTxnType(),
						Map.of("transactionType", salesTxnDao.getTxnType()));
			}
		}

		// 3. isOTP required check
		// 'isOTPrequiredforGHSRedemption' in otpDetails
		LocationOtpDetails otpDetails = getOtpLocationDetails(locationCacheDto);

		if (BooleanUtils.isTrue(otpDetails.getIsOTPrequiredforGHSRedemption())) {
			// if txn customer and account customer are not same, then validate OTP. -
			// removed, as no such point is mentioned in NAP-2319

			// if OTP is mandatory, then validate OTP.
			if (BooleanUtils.isNotTrue(salesPaymentDto.getIsWithoutOtp())) {
				if (salesPaymentDto.getReference1() == null) {
					throw new ServiceException(SalesConstants.PLEASE_PROVIDE_OTP, SalesConstants.ERR_SALE_238,
							"Please provide OTP for GHS payment.");
				}
				// validate OTP
				otpService.validateOTP(accountDetails.getId(), SalesOtpTypeEnum.GHS.name(),
						salesPaymentDto.getReference1());
			} else if (BooleanUtils.isTrue(salesPaymentDto.getIsWithoutOtp())
					&& BooleanUtils.isTrue(ghsLocationDetails.getIsUploadMandatoryforGHSWithoutOTP())) {

				Optional<List<CustomerDocumentsDao>> customerDocuments = customerDocumentsRepository
						.findByTxnIdAndDocumentTypeAndLocationCode(salesTxnDao.getId(), "GHS_REDEMPTION", locationCode);
				if (!customerDocuments.isPresent()) {
					throw new ServiceException(SalesConstants.KINDLY_UPLOAD_DYNAMIC_DOCUMENT_BEFORE_DYNAMIC_ACTION,
							SalesConstants.ERR_SALE_297, "Please upload the customer ID proof for GHS redemption",
							Map.of("document", "ID Proof", "action", "GHS Redemption"));
				}

			}

		} else {
			// clear OTP if validation is not required.
			salesPaymentDto.setReference1(null);
		}

		// 4. if txn customer is not same as GHS customer(can be checked by mobile
		// number) then, check if consent form is uploaded based on
		// 'isConsentLetterUploadMandatory' field in 'ghsDetails'.
		// doubt: Where to check if consent form is updated or not.
		// -- should this check be moved to paymentConfigValidations?(as mobile number
		// have to fetched in payment config, why to do it here again.)

		// consent upload check to be done at confirmation
		return salesPaymentDto;
	}

	@Transactional // as the method calls customer update and discount service also
	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		String locationCode = CommonUtil.getStoreCode();
		boolean isDueAmountRecalculationRequired = false;
		// 1. Get account details by making repo call to account details.
		AccountDetailsDaoExt accountDetails = getValidAccountDetails(paymentDetailsDao, locationCode);

		// 7. Get all GHS accounts added to current txn.
		List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepository.getAllPaymentCodePayments(paymentCode,
				paymentDetailsDao.getSalesTxnDao().getId(),
				List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name()), locationCode);

		// 8. get GHS other details
		GhsPaymentOtherDetailsDto ghsOtherDetailsDto = getGHSOtherDetails(paymentDetailsDao.getOtherDetails());

		// 9. If list is empty,
		// 9a. Then only GHS account of txn customer is allowed for payment(update to
		// GHs customer if not same)
		if (checkPaymentAndCustomer(paymentDetailsDao, accountDetails, paymentDetailsList)) {
			// for first GHS account that is added.
			// update customer (all in one function)
			// if GHS is added in order, then customer change is not required here.
			List<PaymentDetailsDaoExt> ghsPayment = new ArrayList<>();
			if (paymentDetailsDao.getSalesTxnDao().getRefTxnId() != null) {
				ghsPayment = paymentDetailsRepository.getAllPaymentCodePayments(
						PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(),
						paymentDetailsDao.getSalesTxnDao().getRefTxnId().getId(),
						List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name()), locationCode);
			}

			// if GHS Payment not added in Order(AB/CO), only then update customer allowed
			if (CollectionUtil.isEmpty(ghsPayment)) {
				// Customer dependent discounts should be removed to update customer
				commonTxnService.discountValidationsOnCustomerUpdate(paymentDetailsDao.getSalesTxnDao(),
						accountDetails.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
				commonTxnService.updateCustomerDetails(
						accountDetails.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId(),
						paymentDetailsDao.getSalesTxnDao(), true, true);
			}

			isDueAmountRecalculationRequired = true;
		} else {
			existingAccountValidation(paymentDetailsDao, paymentDetailsList, ghsOtherDetailsDto);
		}

		// apply discount(bonus) if present & check for invalid payments
		if ((accountDetails.getDiscount() != null && accountDetails.getDiscount().signum() > 0)
				|| paymentUtil.isRivaahDiscountPresent(ghsOtherDetailsDto.getDiscountMcPct(),
						ghsOtherDetailsDto.getDiscountUcpPct())) {

			// apply discounts
			isDueAmountRecalculationRequired = applyDiscount(paymentDetailsDao, accountDetails.getDiscount(),
					ghsOtherDetailsDto);

		}

		if (isDueAmountRecalculationRequired) {
			dueAmount = recalculateAmount(paymentDetailsDao);
		}

		// check amount than can be redeemed (with min utilization)
		List<PaymentItemMappingDaoExt> paymentItemMapList = checkAmount(paymentDetailsDao, dueAmount, accountDetails,
				ghsOtherDetailsDto);

		// 11. Check amount: to be picked based on remaining amount.
		// if remaining amount > (discount + GHS amount),
		// -------- then discount + GHS amount
		// if remaining amount < (discount + GHS amount),
		// --------- then discount + GHS amount - (remaining amount+discount)

		// doubts
		// i. What to do if remaining amount is less than discount amount?
		// ii. What are the rules applicable for discount?
		// iii. What's the logic to apply discounts?
		// iv. Where to do consent form check for other customer's GHS account?
		// v. Where to do 'photo identity card' check for the customer in current txn?

		// set cash collected
		// set whichever is less out of payment and cash collected
		paymentDetailsDao
				.setCashCollected(paymentDetailsDao.getAmount().compareTo(accountDetails.getCashCollected()) < 0
						? paymentDetailsDao.getAmount()
						: accountDetails.getCashCollected());
		// cash limit check
		cashLimitCheck(paymentDetailsDao, locationCode);

		// if RIVAAH GHS, then change instrument type
		if (GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(accountDetails.getScheme())) {
			paymentDetailsDao.setInstrumentType("RIVAAH ACCOUNT");

			// to save discounTxnDetails
			if (!StringUtils.isEmpty(ghsOtherDetailsDto.getDiscountId())) {
				salesTxnRepositoryExt.save(paymentDetailsDao.getSalesTxnDao());
			}
		} else {
			// set instrumentType same as paymentCode
			paymentDetailsDao.setInstrumentType(paymentCode);// GHS ACCOUNT
		}

		// set is same customer account to reference3
		ghsOtherDetailsDto.setIsSameCustomerAccount(paymentDetailsDao.getSalesTxnDao().getCustomerId()
				.equals(accountDetails.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId()));

		paymentDetailsDao.setOtherDetails(MapperUtil.getStringFromJson(new JsonData(paymentCode, ghsOtherDetailsDto)));

		return Map.of(paymentDetailsDao, paymentItemMapList);
	}

	private boolean checkPaymentAndCustomer(PaymentDetailsDaoExt paymentDetailsDao, AccountDetailsDaoExt accountDetails,
			List<PaymentDetailsDaoExt> paymentDetailsList) {
		return CollectionUtil.isEmpty(paymentDetailsList) && !paymentDetailsDao.getSalesTxnDao().getCustomerId()
				.equals(accountDetails.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
	}

	/**
	 * @param paymentDetailsDao
	 * @return
	 */
	private BigDecimal recalculateAmount(PaymentDetailsDaoExt paymentDetailsDao) {
		BigDecimal dueAmount;
		AmountDetailsDto amountDetailsDto = paymentUtil.getTxnValueAndDueAmount(paymentDetailsDao.getSalesTxnDao(),
				paymentDetailsDao.getIsTcsPayment());
		// if TCS amount is present, payment is invalid
		if (BigDecimal.ZERO.compareTo(amountDetailsDto.getTcsAmount()) < 0) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Clear TCS amount to add payment.",
					Map.of(SalesConstants.REMARKS, "Clear TCS amount to add payment."));
		}

		dueAmount = amountDetailsDto.getAmountDue();
		return dueAmount;
	}

	/**
	 * @param paymentDetailsDao
	 * @param paymentDetailsList
	 * @param ghsOtherDetailsDto
	 */
	private void existingAccountValidation(PaymentDetailsDaoExt paymentDetailsDao,
			List<PaymentDetailsDaoExt> ghsPaymentDetailsList, GhsPaymentOtherDetailsDto ghsOtherDetailsDto) {

		for (PaymentDetailsDaoExt paymentDao : ghsPaymentDetailsList) {
			// check for GHS
			if (paymentDetailsDao.getInstrumentNo().equals(paymentDao.getInstrumentNo())) {
				throw new ServiceException(SalesConstants.ACCOUNT_IS_ALREADY_ADDED_FOR_PAYMENT,
						SalesConstants.ERR_SALE_214, "GHS Account is already added as payment.");
			}
		}

		Set<String> isRivaahDetailsExists = new HashSet<>();
		boolean isRivaahGhsExists = false;

		if (GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(paymentDetailsDao.getReference3())) {
			isRivaahGhsExists = true;
			isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_IS_RIVAAH_GHS);
			if (paymentUtil.isRivaahDiscountPresent(ghsOtherDetailsDto.getDiscountMcPct(),
					ghsOtherDetailsDto.getDiscountUcpPct())) {
				// new Rivaah GHS has discount %
				isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_HAS_RIVAAH_GHS_DISCOUNT);
			}
		}else if(GhsSchemeTypeEnum.GRAMMAGE_SCHEME.name().equals(paymentDetailsDao.getReference3())) {
			isRivaahGhsExists = true;
			isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_IS_GRAMMAGE_GHS);
			if (paymentUtil.isRivaahDiscountPresent(ghsOtherDetailsDto.getDiscountMcPct(),
					ghsOtherDetailsDto.getDiscountUcpPct())) {
				// new Rivaah GHS has discount %
				isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_HAS_GRAMMAGE_GHS_DISCOUNT);
			}			
		}
		else if (ghsOtherDetailsDto.getBonus() != null && ghsOtherDetailsDto.getBonus().signum() > 0) {
			// new GHS has bonus
			isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_HAS_GHS_BONUS);
		}

		// get valid CN payments also
		List<PaymentDetailsDaoExt> cnPaymentDetailsList = paymentDetailsRepository.getAllPaymentCodePayments(
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), paymentDetailsDao.getSalesTxnDao().getId(),
				PaymentStatusEnum.getPaidPaymentStatus(), paymentDetailsDao.getSalesTxnDao().getLocationCode());
		// filter CN with GHs discount
		if (!CollectionUtil.isEmpty(cnPaymentDetailsList)) {
			List<PaymentDetailsDaoExt> tempCnPaymentList = new ArrayList<>();
			for (PaymentDetailsDaoExt paymentDao : cnPaymentDetailsList) {
				CreditNotePaymentOtherDetailsDto otherD = MapperUtil.mapObjToClass(
						MapperUtil.mapObjToClass(paymentDao.getOtherDetails(), JsonData.class).getData(),
						CreditNotePaymentOtherDetailsDto.class);
				if (paymentDetailsDao.getSalesTxnDao().getCustomerId().equals(otherD.getCnOwnerId())
						&& BooleanUtils.isTrue(otherD.getIsGhsDiscountPresent())) {
					tempCnPaymentList.add(paymentDao);
				}
			}
			cnPaymentDetailsList = tempCnPaymentList;
		}
		// combine same customer CN with GHS discount
		List<PaymentDetailsDaoExt> paymentList = Stream.of(cnPaymentDetailsList, ghsPaymentDetailsList)
				.flatMap(Collection::stream).collect(Collectors.toList());

		paymentUtil.checkGhsAndCNClubbing(paymentDetailsDao, paymentList, isRivaahGhsExists, isRivaahDetailsExists,
				paymentDetailsDao.getReference3(), ghsOtherDetailsDto.getSchemeCode());

	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {

		// save payment id into discount details
		GhsPaymentOtherDetailsDto ghsOtherDetails = getGHSOtherDetails(paymentDetailsDao.getOtherDetails());
		List<DiscountDetailsDaoExt> discountDetailsDaoList = null;
		if (!CollectionUtil.isEmpty(ghsOtherDetails.getDiscountTxnIdList())) {
			discountDetailsDaoList = discountDetailsRepository.findAllById(ghsOtherDetails.getDiscountTxnIdList());
			for (DiscountDetailsDaoExt discountDetailsDao : discountDetailsDaoList) {
				if (List.of(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name(),
						DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())
						.contains(discountDetailsDao.getDiscountType())) {
					discountDetailsDao.setRefPayment(paymentDetailsDao);
				}
			}
		}

		if (!CollectionUtil.isEmpty(discountDetailsDaoList)) {
			discountDetailsRepository.saveAll(discountDetailsDaoList);
		}

		// hold the account for current transaction
		integrationService.updateGhsAccountMasterStatus(VendorCodeEnum.GHS.name(),
				Integer.valueOf(paymentDetailsDao.getInstrumentNo()), GhsAccountDetailsStatusEnum.HOLD.name());

		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// no validate payment for 'GHS ACCOUNT'
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// no update in 'GHS ACCOUNT' payment allowed
		return null;
	}

	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		GhsPaymentOtherDetailsDto ghsOtherDetailsDto = getGHSOtherDetails(paymentDetailsDao.getOtherDetails());
		// if bonus exists, then TCS should be cleared first
		if (ghsOtherDetailsDto.getBonus() != null && ghsOtherDetailsDto.getBonus().signum() > 0) {
			commonTxnService.checkIfTcsAmountIsAdded(paymentDetailsDao.getSalesTxnDao(), false);
		}

		// do not allow delete for own account, when other accounts are present
		boolean isRivaahGhsPaymentWithDiscountPresent = false;
		if (BooleanUtils.isTrue(ghsOtherDetailsDto.getIsSameCustomerAccount())) {
			isRivaahGhsPaymentWithDiscountPresent = checkForOtherGHSAccountsAndDV(paymentDetailsDao);
		}

		boolean isReleaseAccount = false;
		if (PaymentStatusEnum.OPEN.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.FAILED.name().equals(paymentDetailsDao.getStatus())) {

			paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
			isReleaseAccount = true;
		} else if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {

			CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();
			creditNoteIndvCreateDto.setCreditNoteType(CNType.GHS.toString());
			creditNoteIndvCreateDto.setAmount(paymentDetailsDao.getAmount());
			creditNoteIndvCreateDto.setRemarks(paymentDetailsDao.getPaymentCode() + " payment reversed.");
			creditNoteIndvCreateDto.setCashCollected(paymentDetailsDao.getCashCollected());

			// set discount details of present.
			setGhsDiscountDetails(ghsOtherDetailsDto, creditNoteIndvCreateDto, paymentDetailsDao.getReference3());
			
			// set payment details
			CNPaymentDetailsDto cNPaymentDetailsDto = new CNPaymentDetailsDto();
			cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
			cNPaymentDetailsDto.setRTGS(false);
			cNPaymentDetailsDto.setCheque(false);
			Map<String, String> payments = new HashMap<>();
			payments.put(paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getInstrumentType());
			cNPaymentDetailsDto.setPaymentCodes(payments);
			creditNoteIndvCreateDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cNPaymentDetailsDto));

			CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
			cnDto.setSalesTxn(paymentDetailsDao.getSalesTxnDao());
			cnDto.setCNIndividual(List.of(creditNoteIndvCreateDto));
			cnDto.setCustomerId(paymentDetailsDao.getSalesTxnDao().getCustomerId());

			cnDto.setRefDocNo(paymentDetailsDao.getSalesTxnDao().getDocNo());
			cnDto.setRefDocType(paymentDetailsDao.getSalesTxnDao().getTxnType());
			cnDto.setRefFiscalYear(paymentDetailsDao.getSalesTxnDao().getFiscalYear());
			cnDto.setDocDate(paymentDetailsDao.getSalesTxnDao().getDocDate());
			
			List<CreditNoteResponse> cnListResponse = creditNoteService.createNewCreditNote(cnDto);

			CreditNoteDaoExt creditNoteDao = creditNoteRepository.findByIdAndLocationCode(cnListResponse.get(0).getId(),
					CommonUtil.getLocationCode());
			AccountDetailsDaoExt accountDetails = new AccountDetailsDaoExt();
			accountDetails.setId(ghsOtherDetailsDto.getAccountId());
			// set account id
			creditNoteDao.setAccountDetailsDao(accountDetails);
			creditNoteRepository.save(creditNoteDao);

			paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED_WITH_CN.name());
			paymentDetailsDao.setRemarks("CN Doc No: " + cnListResponse.get(0).getDocNo()); // CN number to be
																							// stored?

			GhsPaymentOtherDetailsDto ghsOtherDetails = getGHSOtherDetails(paymentDetailsDao.getOtherDetails());
			ghsOtherDetails.setCreditNoteNo(cnListResponse.get(0).getDocNo());
			paymentDetailsDao.setOtherDetails(
					MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), ghsOtherDetails)));

			finalConfirmForGhsPayments(paymentDetailsDao.getSalesTxnDao(), paymentDetailsDao);

		}

		// if bonus is present, then delete it
		boolean isSalesTxnSave = removeRivaahDetailsFromTxn(paymentDetailsDao, ghsOtherDetailsDto,
				isRivaahGhsPaymentWithDiscountPresent);

		// clear passbook number
		paymentDetailsDao.setReference2(null);
		if (isSalesTxnSave)
			commonTxnService.saveSalesTxn(paymentDetailsDao.getSalesTxnDao());
		paymentDetailsRepository.save(paymentDetailsDao);

		if (isReleaseAccount) {
			// release account from current transaction
			integrationService.updateGhsAccountMasterStatus(VendorCodeEnum.GHS.name(),
					Integer.valueOf(paymentDetailsDao.getInstrumentNo()), GhsAccountDetailsStatusEnum.OPEN.name());
		}
	}

	private boolean removeRivaahDetailsFromTxn(PaymentDetailsDaoExt paymentDetailsDao,
			GhsPaymentOtherDetailsDto ghsOtherDetailsDto, boolean isRivaahGhsPaymentWithDiscountPresent) {
		boolean isSalesTxnSave = false;

		if (!paymentUtil.isGhsDiscountPresent(ghsOtherDetailsDto.getBonus(), ghsOtherDetailsDto.getDiscountMcPct(),
				ghsOtherDetailsDto.getDiscountUcpPct())) {
			return isSalesTxnSave;
		}
		// get all discounts added by payment id
		List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository.findAllBySalesTxnIdAndRefPaymentId(
				paymentDetailsDao.getSalesTxnDao().getId(), paymentDetailsDao.getId());

		for (DiscountDetailsDaoExt discountDetails : discountDetailsList) {

			if (List.of(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name(),
					DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()).contains(discountDetails.getDiscountType())) {
				discountFacadeService.deleteTransactionLevelDiscount(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnDao().getTxnType(),
						paymentDetailsDao.getSalesTxnDao().getSubTxnType(), discountDetails.getId());
			}
		}

		// clear discountTxnDetails in sales_trnasaction
		DiscountTransactionDetails discountTxnDetails = discountUtilService
				.getDiscountTxnDetails(paymentDetailsDao.getSalesTxnDao());
		if (discountTxnDetails == null || discountTxnDetails.getRivaahGhsDiscountDetails() == null
				|| CollectionUtil.isEmpty(discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs())) {
			if (discountTxnDetails != null && !isRivaahGhsPaymentWithDiscountPresent) {
				discountTxnDetails.setRivaahGhsDiscountDetails(null);
				paymentDetailsDao.getSalesTxnDao().setDiscountTxnDetails(MapperUtil
						.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
				isSalesTxnSave = true;
			}
			return isSalesTxnSave;
		}

		RivaahGhsDiscountDto rivaahGhsDiscountToRemove = null;
		for (RivaahGhsDiscountDto rivaahGhsDiscountDto : discountTxnDetails.getRivaahGhsDiscountDetails()
				.getRivaahGhs()) {
			if (rivaahGhsDiscountDto.getAccountNo().equals(paymentDetailsDao.getInstrumentNo())) {
				rivaahGhsDiscountToRemove = rivaahGhsDiscountDto;
				break;
			}
		}

		if (rivaahGhsDiscountToRemove == null) {
			return isSalesTxnSave;
		}

		updateDiscountTxnDetails(isRivaahGhsPaymentWithDiscountPresent, discountTxnDetails, rivaahGhsDiscountToRemove);

		paymentDetailsDao.getSalesTxnDao().setDiscountTxnDetails(
				MapperUtil.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
		// save salesTxn
		isSalesTxnSave = true;

		return isSalesTxnSave;
	}

	private void updateDiscountTxnDetails(boolean isRivaahGhsPaymentWithDiscountPresent,
			DiscountTransactionDetails discountTxnDetails, RivaahGhsDiscountDto rivaahGhsDiscountToRemove) {
		discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs().remove(rivaahGhsDiscountToRemove);
		if (CollectionUtil.isEmpty(discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs())) {

			if (isRivaahGhsPaymentWithDiscountPresent) {
				// for other GHS accounts with discount
				discountTxnDetails.setRivaahGhsDiscountDetails(new RivaahGhsDiscountDetailsExtDto(true));
			} else {
				discountTxnDetails.setRivaahGhsDiscountDetails(null);
			}

		} else if (isRivaahGhsPaymentWithDiscountPresent) {
			// for other GHS accounts with discount
			discountTxnDetails.getRivaahGhsDiscountDetails().setIsRivaahDiscountApplicable(true);
		}
	}

	private void setGhsDiscountDetails(GhsPaymentOtherDetailsDto ghsOtherDetailsDto,
			CreditNoteIndvCreateDto creditNoteIndvCreateDto, String schemeType) {
		// similar function is in OrderServiceImpl also
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

		creditNoteIndvCreateDto.setDiscountDetails(new JsonData("CN_DISCOUNT_DETAILS", ghsAccountDiscountObj));
	}

	/**
	 * @param paymentDetailsDao
	 */
	private boolean checkForOtherGHSAccountsAndDV(PaymentDetailsDaoExt paymentDetailsDao) {

		boolean isRivaahGhsPaymentWithDiscountPresent = false;

		List<PaymentDetailsDaoExt> ghsPaymentDetailsList = paymentDetailsRepository.getAllPaymentCodePayments(
				paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getSalesTxnDao().getId(),
				PaymentStatusEnum.getPaidPaymentStatus(), paymentDetailsDao.getSalesTxnDao().getLocationCode());
		// get valid CN payments also
		List<PaymentDetailsDaoExt> cnPaymentDetailsList = getValidCreditNotePayments(
				paymentDetailsDao.getSalesTxnDao());
		// combine same customer CN with GHS discount
		List<PaymentDetailsDaoExt> paymentList = Stream.of(cnPaymentDetailsList, ghsPaymentDetailsList)
				.flatMap(Collection::stream).collect(Collectors.toList());

		// filter by isSameCustomerAccount, where other customer account is added.
		List<PaymentDetailsDaoExt> paymentDetailsListOfOtherCustomers = new ArrayList<>();

		for (PaymentDetailsDaoExt paymentDetails : paymentList) {
			Boolean isSameCustomerAccount = null;
			String schemeType = null;
			String discountId;
			JsonData jsonData = MapperUtil.mapObjToClass(paymentDetails.getOtherDetails(), JsonData.class);
			if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDetails.getPaymentCode())) {
				GhsPaymentOtherDetailsDto otherDetails = getGHSOtherDetails(paymentDetails.getOtherDetails());
				isSameCustomerAccount = otherDetails.getIsSameCustomerAccount();
				discountId = otherDetails.getDiscountId();
				schemeType = paymentDetails.getReference3();
			} else {
				CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						CreditNotePaymentOtherDetailsDto.class);
				discountId = cnOtherDetails.getDiscountId();
				schemeType = cnOtherDetails.getSchemeType();

			}
			if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDetails.getPaymentCode())
					&& !BooleanUtils.isTrue(isSameCustomerAccount)) {
				paymentDetailsListOfOtherCustomers.add(paymentDetails);
			}

			// if other GHS payments with Rivaah GHS discounts exists
			if (!paymentDetailsDao.getId().equals(paymentDetails.getId())
					&& GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(schemeType) && !StringUtils.isEmpty(discountId)) {
				isRivaahGhsPaymentWithDiscountPresent = true;
			}

		}

		// if other customer accounts are still present, then delete them first.
		if (CollectionUtil.isNotEmpty(paymentDetailsListOfOtherCustomers)) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_DELETED, SalesConstants.ERR_SALE_035,
					"GHS accounts of other customers should be deleted first.");
		}

		// if DV is added, then check for DV customer..if txn customer is
		// different from it,then throw error to delete DV first.
		// if payment details list size is 1(the last GHS account), then only check for
		// DV.
		if (ghsPaymentDetailsList.size() == 1
				&& !StringUtil.isBlankJsonStr(paymentDetailsDao.getSalesTxnDao().getDiscountTxnDetails())) {
			DiscountTransactionDetails discountTransactionDetails = discountUtilService
					.getDiscountTxnDetails(paymentDetailsDao.getSalesTxnDao());
			// if DV is present, pick first DV and check if isSameCustomer is 'true', else
			// throw error that GHS payment cannot be deleted.
			if (discountTransactionDetails.getGhsDiscountDetails() != null
					&& !CollectionUtils.isEmpty(discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails())
					&& !BooleanUtils.isTrue(discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails()
							.get(0).getIsSameCustomer())) {
				throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_DELETED, SalesConstants.ERR_SALE_035,
						"GHS account cannot be deleted as DV of other cusomer is added.");
			}

		}

		return isRivaahGhsPaymentWithDiscountPresent;
	}

	private List<PaymentDetailsDaoExt> getValidCreditNotePayments(SalesTxnDaoExt salesTxn) {
		List<PaymentDetailsDaoExt> cnPaymentDetailsList = paymentDetailsRepository.getAllPaymentCodePayments(
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), salesTxn.getId(),
				PaymentStatusEnum.getPaidPaymentStatus(), salesTxn.getLocationCode());
		// filter CN with Rivaah GHS discount
		if (!CollectionUtil.isEmpty(cnPaymentDetailsList)) {
			List<PaymentDetailsDaoExt> tempCnPaymentList = new ArrayList<>();
			for (PaymentDetailsDaoExt paymentDao : cnPaymentDetailsList) {
				CreditNotePaymentOtherDetailsDto otherD = MapperUtil.mapObjToClass(
						MapperUtil.mapObjToClass(paymentDao.getOtherDetails(), JsonData.class).getData(),
						CreditNotePaymentOtherDetailsDto.class);
				// if Rivaah discount is valid, then discount id will be presnet
				if (salesTxn.getCustomerId().equals(otherD.getCnOwnerId())
						&& DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(otherD.getDiscountType())
						&& !StringUtils.isEmpty(otherD.getDiscountId())) {
					tempCnPaymentList.add(paymentDao);
				}
			}
			cnPaymentDetailsList = tempCnPaymentList;
		}
		return cnPaymentDetailsList;
	}

	@Transactional
	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {
		// generate CN first in some status 'REDEMPTION_PENDING'
		String locationCode = CommonUtil.getLocationCode();
		AccountDetailsDaoExt accountDetails = getAccountDetails(paymentDetailsDao.getInstrumentNo(), locationCode);

		// check if account is redeemed.
		try {
			GhsAccountDetailsResponseDto ghsAccountDetailsResponseDto = integrationService
					.getGhsAccountDetails(VendorCodeEnum.GHS.name(), Integer.valueOf(accountDetails.getAccountNo()));
			if (!GhsAccountDetailsStatusEnum.OPEN.name().equals(ghsAccountDetailsResponseDto.getStatus())
					&& !GhsAccountDetailsStatusEnum.HOLD.name().equals(ghsAccountDetailsResponseDto.getStatus())) {
				throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
						SalesConstants.ERR_SALE_212,
						"Status of GHS account " + paymentDetailsDao.getInstrumentNo() + "  is "
								+ accountDetails.getStatus(),
						Map.of(SalesConstants.REASON, "Status of GHS account is " + accountDetails.getStatus()));
			}
		} catch (ServiceException e) {
			throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
					SalesConstants.ERR_SALE_212, e.getMessage(),
					Map.of(SalesConstants.REASON, " Account not available for redemption."));
		}

		// get GHS other details
		GhsPaymentOtherDetailsDto ghsOtherDetailsDto = getGHSOtherDetails(paymentDetailsDao.getOtherDetails());

		// update discounts to completed
		// if bonus is present
		if (paymentUtil.isGhsDiscountPresent(ghsOtherDetailsDto.getBonus(), ghsOtherDetailsDto.getDiscountMcPct(),
				ghsOtherDetailsDto.getDiscountUcpPct())) {
			// get all discounts added by payment id
			List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository
					.findAllBySalesTxnIdAndRefPaymentId(paymentDetailsDao.getSalesTxnDao().getId(),
							paymentDetailsDao.getId());

			for (DiscountDetailsDaoExt discountDetails : discountDetailsList) {
				discountFacadeService.confirmTransactionLevelDiscount(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnDao().getTxnType(),
						paymentDetailsDao.getSalesTxnDao().getSubTxnType(), ghsOtherDetailsDto.getDiscountType(),
						discountDetails.getId());
			}
		}

		// if there is a CN with same account id and txn id and the status is
		// 'REDEMPTION_PENDING', then reuse the same.
		// NOTE: for the generated CN, ref doc no., ref doc type & ref fiscal year will
		// be updated at Confirm API (of respective transaction). Also, same transaction
		// reference details will be passed to e-GHS application.
		CreditNoteDaoExt creditNoteDao = creditNoteRepository.findOneBySalesTxnIdAndAccountDetailsDaoIdAndStatus(
				paymentDetailsDao.getSalesTxnDao().getId(), accountDetails.getId(), CNStatus.REDEMPTION_PENDING.name());

		BigDecimal remainingAmount = BigDecimal.ZERO;
		if (creditNoteDao == null || creditNoteDao.getAmount().compareTo(accountDetails.getBalance()) != 0) {
			CreditNoteCreateDto cnDto = setCreditNoteDto(paymentDetailsDao, accountDetails, ghsOtherDetailsDto);

			// should be within txn?
			List<CreditNoteResponse> cnDocNoList = creditNoteService.createNewCreditNote(cnDto);
			creditNoteDao = creditNoteRepository.findByIdAndLocationCode(cnDocNoList.get(0).getId(),
					CommonUtil.getLocationCode());
			// update status for the CN
			creditNoteDao.setStatus(CNStatus.REDEMPTION_PENDING.name());
			// set account id
			creditNoteDao.setAccountDetailsDao(accountDetails);
			remainingAmount= creditNoteDao.getAmount().subtract(paymentDetailsDao.getAmount());
			creditNoteRepository.save(creditNoteDao);
		}

		log.info("GHS redemption CN number: {}", creditNoteDao.getDocNo());
		
		

		// call redemption api
		GhsRedeemAccountDto ghsRedeemAccountDto = new GhsRedeemAccountDto();
		ghsRedeemAccountDto.setAccountNo(Integer.valueOf(accountDetails.getAccountNo()));
		ghsRedeemAccountDto.setRedemptionAmount(creditNoteDao.getAmount());
		ghsRedeemAccountDto.setBusinessDate(creditNoteDao.getDocDate());
		ghsRedeemAccountDto.setFiscalYear(creditNoteDao.getFiscalYear().intValue());
		CreditNoteRedeemDto cnRedeemDto = new CreditNoteRedeemDto();
		cnRedeemDto.setId(creditNoteDao.getId());
		// pending - is it necessary to set customer id?
		cnRedeemDto.setCustomerId(creditNoteDao.getCustomerId());
		cnRedeemDto.setUtilizedAmount(paymentDetailsDao.getAmount());
		// setting salesTxn also, else CN redemption is failing
		cnRedeemDto.setSalesTxn(paymentDetailsDao.getSalesTxnDao());

		try {
			integrationService.redeemGhsAccount(VendorCodeEnum.GHS.name(), ghsRedeemAccountDto);
			// update CN
			CreditNoteResponse newCn = creditNoteService.redeemCreditNote(cnRedeemDto);
			// pending- use GhsPaymentOtherDetailsDto to store refundAmount.
			paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());

			// set new CN no. to other details
			if (newCn != null) {
				if (CNStatus.CANCELLED.name().equals(newCn.getStatus())) {
					ghsOtherDetailsDto.setRefundAmount(newCn.getAmount());
				} else {
					ghsOtherDetailsDto.setNewCNNumber(newCn.getDocNo());
					ghsOtherDetailsDto.setRemainingAmount(remainingAmount);
				}

			}
			// set CN id to other details
			ghsOtherDetailsDto.setCreditNoteId(creditNoteDao.getId());
			paymentDetailsDao.setOtherDetails(
					MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), ghsOtherDetailsDto)));

			paymentDetailsRepository.save(paymentDetailsDao);

		} catch (ServiceException e) {
			// doubt - is it required to set credit not status??
			// set payment status
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
			// throw error
			throw e;
		}
		return paymentDetailsDao;
	}

	/**
	 * @param paymentDetailsDao
	 * @return
	 */
	private CreditNoteCreateDto setCreditNoteDto(PaymentDetailsDaoExt paymentDetailsDao,
			AccountDetailsDaoExt accountDetails, GhsPaymentOtherDetailsDto ghsOtherDetailsDto) {

		CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();

		// if grammage account, then
		// balance = accumulated gold weight * current txn gold rate.
//		if (GhsSchemeTypeEnum.GRAMMAGE_SCHEME.name().equals(accountDetails.getScheme())) {
//			AccountOtherDetailsDto accountOtherDetails = MapperUtil.mapObjToClass(
//					MapperUtil.mapObjToClass(accountDetails.getOtherDetails(), JsonData.class).getData(),
//					AccountOtherDetailsDto.class);
//			MetalRateListDto metalRate = MapperUtil.mapObjToClass(ghsOtherDetailsDto.getMetalRateDetails(),
//					MetalRateListDto.class);
//			balance = accountOtherDetails.getAccumulatedGoldWeight()
//					.multiply(metalRate.getMetalRates().get(MetalTypeCodeEnum.J.name()).getRatePerUnit())
//					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
//			// if GRAMMAGE account set frozen rate
//			FrozenRatesDetails frozenRatesDetails = new FrozenRatesDetails(MetalTypeCodeEnum.J.name(),
//					metalRate.getMetalRates().get(MetalTypeCodeEnum.J.name()).getRatePerUnit(),
//					accountOtherDetails.getAccumulatedGoldWeight());
//			creditNoteIndvCreateDto.setFrozenRateDetails(
//					MapperUtil.getStringFromJson(new JsonData(SalesConstants.FROZEN_RATE_DETAILS, frozenRatesDetails)));
//		}

		creditNoteIndvCreateDto.setCreditNoteType(CNType.GHS.toString());
		creditNoteIndvCreateDto.setAmount(ghsOtherDetailsDto.getBalance());
		creditNoteIndvCreateDto.setRemarks(paymentDetailsDao.getPaymentCode() + " as payment.");
		// set payment details
		CNPaymentDetailsDto cNPaymentDetailsDto = new CNPaymentDetailsDto();
		cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
		cNPaymentDetailsDto.setRTGS(false);
		cNPaymentDetailsDto.setCheque(false);
		Map<String, String> payments = new HashMap<>();
		payments.put(paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getInstrumentType());
		cNPaymentDetailsDto.setPaymentCodes(payments);
		creditNoteIndvCreateDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cNPaymentDetailsDto));

		// discount details
		setGhsDiscountDetails(ghsOtherDetailsDto, creditNoteIndvCreateDto, paymentDetailsDao.getReference3());

		CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
		cnDto.setSalesTxn(paymentDetailsDao.getSalesTxnDao());
		cnDto.setCNIndividual(List.of(creditNoteIndvCreateDto));
		cnDto.setCustomerId(accountDetails.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
		return cnDto;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		Map<String, Integer> cnDocNoList = new HashMap<>();
		// please use docDate for CN generations. Helps for EOD.
		for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetails) {
			GhsPaymentOtherDetailsDto ghsOtherDetailsDto = getGHSOtherDetails(paymentDetailsDao.getOtherDetails());
			CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();
			creditNoteIndvCreateDto.setCreditNoteType(CNType.GHS.toString());
			creditNoteIndvCreateDto.setAmount(paymentDetailsDao.getAmount());
			creditNoteIndvCreateDto.setRemarks(paymentDetailsDao.getPaymentCode() + " payment reversed.");
			creditNoteIndvCreateDto.setCashCollected(paymentDetailsDao.getCashCollected());

			// set discount details of present.
			setGhsDiscountDetails(ghsOtherDetailsDto, creditNoteIndvCreateDto, paymentDetailsDao.getReference3());
			
			// set payment details
			CNPaymentDetailsDto cNPaymentDetailsDto = new CNPaymentDetailsDto();
			cNPaymentDetailsDto.setIsGeneratedForUnipayDeletion(false);
			cNPaymentDetailsDto.setRTGS(false);
			cNPaymentDetailsDto.setCheque(false);
			Map<String, String> payments = new HashMap<>();
			payments.put(paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getInstrumentType());
			cNPaymentDetailsDto.setPaymentCodes(payments);
			creditNoteIndvCreateDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cNPaymentDetailsDto));

			CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
			cnDto.setSalesTxn(paymentDetailsDao.getSalesTxnDao());
			cnDto.setCancelTxn(cancel);// for bill cancellation
			cnDto.setCNIndividual(List.of(creditNoteIndvCreateDto));
			cnDto.setCustomerId(paymentDetailsDao.getSalesTxnDao().getCustomerId());
			cnDto.setDocDate(docDate);
			cnDto.setRefDocNo(paymentDetailsDao.getSalesTxnDao().getDocNo());
			cnDto.setRefDocType(paymentDetailsDao.getSalesTxnDao().getTxnType());
			cnDto.setRefFiscalYear(paymentDetailsDao.getSalesTxnDao().getFiscalYear());

			List<CreditNoteResponse> cnListResponse = creditNoteService.createNewCreditNote(cnDto);
			cnDocNoList.put(cnListResponse.get(0).getId(), cnListResponse.get(0).getDocNo());

			CreditNoteDaoExt creditNoteDao = creditNoteRepository.findByIdAndLocationCode(cnListResponse.get(0).getId(),
					CommonUtil.getLocationCode());
			AccountDetailsDaoExt accountDetails = new AccountDetailsDaoExt();
			accountDetails.setId(ghsOtherDetailsDto.getAccountId());
			// set account id
			creditNoteDao.setAccountDetailsDao(accountDetails);
			creditNoteRepository.save(creditNoteDao);

			finalConfirmForGhsPayments(salesTxn, paymentDetailsDao);

		}

		return cnDocNoList;
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	@SuppressWarnings("unchecked")
	private AccountDetailsDaoExt getValidAccountDetails(PaymentDetailsDaoExt paymentDetailsDao, String locationCode) {

		// 1. if DV is added, then account redemption is blocked.
		List<DiscountDetailsDaoExt> openDiscountDetailsList = discountDetailsRepository
				.findAllByDiscountTypeAndSalesTxnId(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name(),
						paymentDetailsDao.getSalesTxnDao().getId(), null);
		if (!CollectionUtil.isEmpty(openDiscountDetailsList)) {
			throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
					SalesConstants.ERR_SALE_212,
					"Unable to redeem GHS Account - '" + paymentDetailsDao.getInstrumentNo()
							+ "', after entering GHS Discount voucher. Please close and open fresh CM.",
					Map.of(SalesConstants.REASON,
							"Unable to redeem after entering GHS Discount voucher. Please close and open fresh CM."));
		}

		// 2. Get account details by making repo call to account details.
		AccountDetailsDaoExt accountDetails = getAccountDetails(paymentDetailsDao.getInstrumentNo(), locationCode);

		GhsPaymentOtherDetailsDto otherDetails = new GhsPaymentOtherDetailsDto();
		otherDetails.setAccountId(accountDetails.getId());
		otherDetails
				.setCustomerId(accountDetails.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
		otherDetails.setInstallmentAmount(accountDetails.getBalance());
		otherDetails.setMinUtilizationPct(accountDetails.getMinUtilizationPct());
		AccountOtherDetailsDto accountOtherDetailsDto = MapperUtil.mapObjToClass(
				MapperUtil.mapObjToClass(accountDetails.getOtherDetails(), JsonData.class).getData(),
				AccountOtherDetailsDto.class);
		otherDetails.setSchemeCode(accountOtherDetailsDto.getSchemeCode());
		otherDetails.setDiscountMcPct(accountOtherDetailsDto.getDiscountMcPct());
		otherDetails.setDiscountUcpPct(accountOtherDetailsDto.getDiscountUcpPct());
		otherDetails.setBonus(accountDetails.getDiscount());

		// get CFA restriction details
		if (!StringUtil.isBlankJsonStr(accountDetails.getCfaDetails())) {
			JsonData cfaJson = MapperUtil.mapObjToClass(accountDetails.getCfaDetails(), JsonData.class);
			otherDetails.setProductGroupCodesRestricted(MapperUtil.mapObjToClass(cfaJson.getData(), List.class));
		}

		checkGHSPaymentInputs(paymentDetailsDao, accountDetails, locationCode);

		// set scheme of account to reference3
		paymentDetailsDao.setReference3(accountDetails.getScheme());

		paymentDetailsDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), otherDetails)));

		return accountDetails;
	}

	/**
	 * @param paymentDetailsDao
	 * @param dueAmount
	 * @param accountDetails
	 * @param otherDetails
	 */
	private List<PaymentItemMappingDaoExt> checkAmount(PaymentDetailsDaoExt paymentDetailsDao, BigDecimal dueAmount,
			AccountDetailsDaoExt accountDetails, GhsPaymentOtherDetailsDto otherDetails) {

		// check due amount - if it's less than or equal to zero, then GHS account
		// cannot be used as payment
		if (dueAmount.signum() <= 0) {
			throw new ServiceException(SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER,
					SalesConstants.ERR_SALE_030, SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER);
		}

		// product group restriction check.
		Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails = paymentUtil.getItemProductGroupCodes(
				paymentDetailsDao.getSalesTxnType(), paymentDetailsDao.getSalesTxnDao().getId(),
				otherDetails.getProductGroupCodesRestricted() == null ? List.of()
						: otherDetails.getProductGroupCodesRestricted(),
				paymentDetailsDao.getPaymentCode(), null, true);// isExcludePGC is true for 'GHS ACCOUNT' and is false
																// for many other applicable
																// payments get valid amount

		BigDecimal validAmount = paymentUtil.getValidPaymentForItems(paymentDetailsDao.getPaymentCode(),
				itemValueAndPgcDetails, paymentDetailsDao.getSalesTxnDao().getId());

		// 6. Amount should not be greater than balance.
		BigDecimal balance = accountDetails.getBalance();

		// if GRAMMAGE account, then
		// balance = accumulated gold weight * current gold rate.
		if (GhsSchemeTypeEnum.GRAMMAGE_SCHEME.name().equals(accountDetails.getScheme())) {
			AccountOtherDetailsDto accountOtherDetails = MapperUtil.mapObjToClass(
					MapperUtil.mapObjToClass(accountDetails.getOtherDetails(), JsonData.class).getData(),
					AccountOtherDetailsDto.class);
			MetalRateListDto metalRate = commonTxnService.getMetalRate();
			// set in other details (as it can be different from txn metal rates)
			otherDetails.setMetalRateDetails(metalRate);

			balance = accountOtherDetails.getAccumulatedGoldWeight()
					.multiply(metalRate.getMetalRates().get(MetalTypeCodeEnum.J.name()).getRatePerUnit())
					.setScale(0, RoundingMode.HALF_UP);
		}

		otherDetails.setBalance(balance);

		// correct amount is due amount based on, which is lesser out of the two.
		// if difference between validAmount & dueAmount <1 and dueAmount > validAmount,
		// then pick dueAmount.
		// This is to make sure roundOff will not affect payment.
		BigDecimal tempValue = (validAmount.compareTo(dueAmount) < 0
				&& ((dueAmount.subtract(validAmount)).compareTo(new BigDecimal(1)) >= 0)) ? validAmount : dueAmount;

		// set payment amount out if which ever is less in balance or tempValue
		// base rule: payment is the least out of: dueAmount, validAmount and balance
		paymentDetailsDao.setAmount(tempValue.compareTo(balance) < 0 ? tempValue : balance);

		// 7.Check for configuration percentage: input amount should not be <
		// configuration %
		// of GHS amount(exception: input can be less if remaining balance is less than
		// residualAmount for 100% utilization).
		// save residualAmount to other details.
		// pending: set based on residual amount config
		otherDetails.setRefundAmount(paymentUtil.checkMinUtilization(paymentDetailsDao, balance,
				accountDetails.getMinUtilizationPct(), paymentDetailsDao.getAmount()));

		// check redemption amount
		List<PaymentItemMappingDaoExt> paymentItemMapList = paymentUtil.amountCheckForPayment(validAmount,
				paymentDetailsDao.getAmount(), paymentDetailsDao, itemValueAndPgcDetails);

		// set other details
		paymentDetailsDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), otherDetails)));

		return paymentItemMapList;
	}

	/**
	 * @param paymentDetailsDao
	 * @param accountDetails
	 */
	private void checkGHSPaymentInputs(PaymentDetailsDaoExt paymentDetailsDao, AccountDetailsDaoExt accountDetails,
			String locationCode) {
		// 3. check if pass-book number(reference 2) is valid.
		if (!paymentDetailsDao.getReference2().equals(accountDetails.getPassbookNo())) {
			throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
					SalesConstants.ERR_SALE_212,
					"Please enter appropriate pass book number for GHS account: " + paymentDetailsDao.getInstrumentNo(),
					Map.of(SalesConstants.REASON, "Invalid Passbook number"));
		}

		// 4. If 'isRedeemable' is not true, then throw error.
		if (!BooleanUtils.isTrue(accountDetails.getIsRedeemable())) {
			throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
					SalesConstants.ERR_SALE_212,
					"Status of GHS account " + paymentDetailsDao.getInstrumentNo() + "  is "
							+ accountDetails.getStatus(),
					Map.of(SalesConstants.REASON, "Status of GHS account is " + accountDetails.getStatus()));
		}

		// 5. If proof not available, then throw error. - removed as the check is not
		// done in legacy POSS.

		// 6. Check for maturity location.
		// 6a. If maturity location is null, then enrollment location should
		// match current location.
		// 6b. Else maturity location should match current location.
		// else throw error
		if ((StringUtils.isEmpty(accountDetails.getMaturityLocationCode())
				&& !locationCode.equals(accountDetails.getEnrolledLocationCode()))
				|| (!StringUtils.isEmpty(accountDetails.getMaturityLocationCode())
						&& !locationCode.equals(accountDetails.getMaturityLocationCode()))) {
			throw new ServiceException(SalesConstants.ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON,
					SalesConstants.ERR_SALE_212,
					"GHS account " + paymentDetailsDao.getInstrumentNo() + " cannot be used as payment in location "
							+ locationCode,
					Map.of(SalesConstants.REASON, "GHS account cannot be used as payment at current location."));
		}
	}

	/**
	 * @param paymentDetailsDao
	 * @return AccountDetailsDao
	 */
	private AccountDetailsDaoExt getAccountDetails(String accountNumber, String locationCode) {
		AccountDetailsDaoExt accountDetails = accountDetailsRepository
				.findOneByAccountnoAccountTypeLocationCode(accountNumber, VendorCodeEnum.GHS.name(), locationCode);
		if (accountDetails == null) {
			throw new ServiceException(SalesConstants.ACCOUNT_DETAILS_NOT_FOUND, SalesConstants.ERR_SALE_211,
					"GHS account details not found for no. " + accountNumber + " at location " + locationCode);
		}
		return accountDetails;
	}

	private GhsPaymentOtherDetailsDto getGHSOtherDetails(String otherDetails) {
		if (StringUtil.isBlankJsonStr(otherDetails)) {
			return new GhsPaymentOtherDetailsDto();
		}
		JsonData jsonData = MapperUtil.mapObjToClass(otherDetails, JsonData.class);
		return MapperUtil.mapObjToClass(jsonData.getData(), GhsPaymentOtherDetailsDto.class);
	}

	private GhsDetails getGhsLocationDetails(LocationCacheDto locationCacheDto) {

		if (locationCacheDto.getGhsDetails() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"GHS details are not present for the location " + locationCacheDto.getLocationCode());
		}

		return locationCacheDto.getGhsDetails();
	}

	private LocationOtpDetails getOtpLocationDetails(LocationCacheDto locationCacheDto) {

		if (locationCacheDto.getOtpDetails() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"OTP details are not present for the location " + locationCacheDto.getLocationCode());
		}

		if (locationCacheDto.getOtpDetails().getIsOTPrequiredforGHSRedemption() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"OTP for GHS redemption configuration is are not present for the location "
							+ locationCacheDto.getLocationCode());
		}

		return locationCacheDto.getOtpDetails();
	}

	private void cashLimitCheck(PaymentDetailsDaoExt paymentDetailsDao, String locationCode) {
		// if account has no cash element, then skip check
		if (paymentDetailsDao.getCashCollected() == null
				|| BigDecimal.ZERO.compareTo(paymentDetailsDao.getCashCollected()) == 0) {
			return;
		}

		// CASH limit check
		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				locationCode, null);

		Calendar cal1 = Calendar.getInstance();
		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		BigDecimal totalCashPaid = BigDecimal.ZERO;

		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.getCashCollectedByTransactionIdAndPaymentCodes(paymentDetailsDao.getSalesTxnDao().getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), CommonUtil.getLocationCode(), null);

		CashPaymentDetailsDto cashPaymentDetails = paymentUtil.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
	    totalCashPaid=totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
	    totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());
	    

		totalCashPaid = totalCashPaid.add(paymentDetailsDao.getCashCollected());

		totalPmlaCashAmount = totalPmlaCashAmount.add(paymentDetailsDao.getCashCollected());
		if (totalCashPaid == null || BigDecimal.ZERO.compareTo(totalCashPaid) == 0) {
			return;
		}

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
				totalCashPaid, totalPmlaCashAmount);
		customerPaymentService.cashLimitCheck(instrumentCashAmountDto, PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(),
				null, paymentDetailsDao.getSalesTxnDao(), paymentDetailsDao.getSalesTxnDao().getCustomerId(), false);

	}

	// public function because all changes should be within transaction.
	public boolean applyDiscount(PaymentDetailsDaoExt paymentDetails, BigDecimal bonus,
			GhsPaymentOtherDetailsDto ghsOtherDetailsDto) {

		boolean isDueAmountRecalculationRequired = false;

		String discountType = paymentUtil.isRivaahDiscountPresent(ghsOtherDetailsDto.getDiscountMcPct(),
				ghsOtherDetailsDto.getDiscountUcpPct()) ? DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
						: DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name();
		RivaahGhsDiscountDto rivaahGhsDiscountDto = null;

		DiscountBillLevelRequestDto discountBillLevelRequestDto = new DiscountBillLevelRequestDto();
		discountBillLevelRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		discountBillLevelRequestDto.setDiscountType(discountType);
		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType)) {
			rivaahGhsDiscountDto = new RivaahGhsDiscountDto();
			rivaahGhsDiscountDto.setSchemeCode(ghsOtherDetailsDto.getSchemeCode());
			rivaahGhsDiscountDto.setMakingChargeDiscountPercent(new BigDecimal(ghsOtherDetailsDto.getDiscountMcPct()));
			rivaahGhsDiscountDto.setUcpDiscountPercent(new BigDecimal(ghsOtherDetailsDto.getDiscountUcpPct()));
			rivaahGhsDiscountDto.setExcludeProductGroup(ghsOtherDetailsDto.getProductGroupCodesRestricted());
			rivaahGhsDiscountDto.setAccountNo(paymentDetails.getInstrumentNo());
			rivaahGhsDiscountDto.setPaymentCode(paymentDetails.getPaymentCode());
			discountBillLevelRequestDto
					.setRivaahGhsDetails(new RivaahGhsDiscountDetailsDto(List.of(rivaahGhsDiscountDto)));
		}
		discountBillLevelRequestDto.setItemDetails(new ArrayList<>());

		// call engine API to get discount id
		DiscountBillLevelResponseDto discountBillLevelResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);

		// throw error only for system discount
		if (CollectionUtil.isEmpty(discountBillLevelResponseDto.getDiscountDetails())) {
			// throw error
			if (!DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType))
				throw new ServiceException("Discount doesn't exist", "ERR-DISC-006",
						"Discount Type: " + discountType + ", is not configured.");
			else {
				// for RIVAAH discount can be ignore
				return isDueAmountRecalculationRequired;
			}
		} else {
			setDiscountBasicDetails(paymentDetails, ghsOtherDetailsDto, discountType, discountBillLevelResponseDto);

		}

		// no need to call discount on payment for Rivaah GHS
		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType)) {
			return isDueAmountRecalculationRequired;
		}

		// set up request DTO
		DiscountBillLevelItemDetailsDto discountBillLevelItemDetailsDto = new DiscountBillLevelItemDetailsDto();
		discountBillLevelItemDetailsDto
				.setDiscountCode(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountCode());
		discountBillLevelItemDetailsDto.setDiscountType(discountType);
		discountBillLevelItemDetailsDto
				.setDiscountId(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountId());
		discountBillLevelItemDetailsDto.setDiscountValue(bonus == null ? BigDecimal.ZERO : bonus);
		discountBillLevelItemDetailsDto.setIsEdited(false);
		GhsExcludeProductGroupDetailsDto ghsBasicDetails = new GhsExcludeProductGroupDetailsDto();
		ghsBasicDetails.setAccountNo(paymentDetails.getInstrumentNo());
		ghsBasicDetails.setMakingChargeDiscountPercent(new BigDecimal(ghsOtherDetailsDto.getDiscountMcPct()));
		ghsBasicDetails.setUcpDiscountPercent(new BigDecimal(ghsOtherDetailsDto.getDiscountUcpPct()));
		ghsBasicDetails.setBonus(discountBillLevelItemDetailsDto.getDiscountValue());
		ghsBasicDetails.setSchemeCode(ghsOtherDetailsDto.getSchemeCode());
		ghsBasicDetails.setSchemeType(paymentDetails.getReference3());
		ghsBasicDetails.setPaymentCode(paymentDetails.getPaymentCode());
		if (!CollectionUtil.isEmpty(ghsOtherDetailsDto.getProductGroupCodesRestricted())) {
			ghsBasicDetails.setGhsExcludeProductGroups(ghsOtherDetailsDto.getProductGroupCodesRestricted());
		}
		discountBillLevelItemDetailsDto
				.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS", ghsBasicDetails));

		DiscountBillLevelCreateDto discountCreateDto = new DiscountBillLevelCreateDto();
		discountCreateDto.setDiscountDetails(List.of(discountBillLevelItemDetailsDto));

		// apply discount
		DiscountResponseDto discountResponseDto = discountFacadeService.saveTransactionLevelDiscounts(
				paymentDetails.getSalesTxnDao().getId(), paymentDetails.getSalesTxnDao().getTxnType(),
				paymentDetails.getSalesTxnDao().getSubTxnType(), discountCreateDto, discountType);

		isDueAmountRecalculationRequired = true;
		if (!CollectionUtil.isEmpty(discountResponseDto.getDiscountTxnIdList())) {
			ghsOtherDetailsDto.setDiscountTxnIdList(discountResponseDto.getDiscountTxnIdList());
		}

		return isDueAmountRecalculationRequired;
	}

	private void setDiscountBasicDetails(PaymentDetailsDaoExt paymentDetails,
			GhsPaymentOtherDetailsDto ghsOtherDetailsDto, String discountType,
			DiscountBillLevelResponseDto discountBillLevelResponseDto) {
		// set discount id to GHS other details
		ghsOtherDetailsDto.setDiscountType(discountType);
		ghsOtherDetailsDto.setDiscountId(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountId());
		ghsOtherDetailsDto.setDiscountCode(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountCode());

		// update discountTxnDetails
		DiscountTransactionDetails discountTxnDetails = discountUtilService
				.getDiscountTxnDetails(paymentDetails.getSalesTxnDao());

		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType)
				&& checkPreviousDiscount(ghsOtherDetailsDto, discountTxnDetails)) {
			if (discountTxnDetails.getRivaahGhsDiscountDetails() == null) {
				discountTxnDetails.setRivaahGhsDiscountDetails(new RivaahGhsDiscountDetailsExtDto());
			}
			ghsOtherDetailsDto.setIsRivaahDiscountApplicable(true);
			discountTxnDetails.getRivaahGhsDiscountDetails().setIsRivaahDiscountApplicable(true);
			paymentDetails.getSalesTxnDao().setDiscountTxnDetails(
					MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
		}
	}

	private boolean checkPreviousDiscount(GhsPaymentOtherDetailsDto ghsOtherDetailsDto,
			DiscountTransactionDetails discountTxnDetails) {

		if (discountTxnDetails.getRivaahGhsDiscountDetails() == null
				|| BooleanUtils
						.isNotFalse(discountTxnDetails.getRivaahGhsDiscountDetails().getIsRivaahDiscountApplicable())
				|| CollectionUtil.isEmpty(discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs())) {
			return true;
		}

		boolean isGreanterThanPreviousDiscount = false;

		for (RivaahGhsDiscountDto rivaahGhs : discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs()) {
			// if previously it was false, and new GHS discount has higher %, then update to
			// true again
			if (new BigDecimal(ghsOtherDetailsDto.getDiscountMcPct())
					.compareTo(rivaahGhs.getMakingChargeDiscountPercent()) > 0
					|| new BigDecimal(ghsOtherDetailsDto.getDiscountUcpPct())
							.compareTo(rivaahGhs.getUcpDiscountPercent()) > 0) {
				isGreanterThanPreviousDiscount = true;
				break;
			}
		}

		return isGreanterThanPreviousDiscount;
	}

	private void finalConfirmForGhsPayments(SalesTxnDaoExt salesTxnDao, PaymentDetailsDaoExt paymentDetailsDao) {

		if (TransactionStatusEnum.CONFIRMED.name().equals(salesTxnDao.getStatus())) {
			return;
		}

		GhsPaymentOtherDetailsDto ghsOtherDetailsDto = getGHSOtherDetails(paymentDetailsDao.getOtherDetails());
		CreditNoteDaoExt creditNote = creditNoteRepository.findByIdAndLocationCode(ghsOtherDetailsDto.getCreditNoteId(),
				CommonUtil.getStoreCode());

		GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto = new GhsAccountMasterUpdateDto();
		ghsAccountMasterUpdateDto.setAccountNo(Integer.valueOf(paymentDetailsDao.getInstrumentNo()));
		ghsAccountMasterUpdateDto.setBusinessDate(salesTxnDao.getDocDate());
		ghsAccountMasterUpdateDto.setMaturedDocNo(salesTxnDao.getDocNo());
		ghsAccountMasterUpdateDto.setMaturedDocType(salesTxnDao.getTxnType());
		ghsAccountMasterUpdateDto.setFiscalYear(salesTxnDao.getFiscalYear().intValue());

		ghsAccountMasterUpdateDto.setRedemptionAmount(ghsOtherDetailsDto.getBalance());
		ghsAccountMasterUpdateDto.setGhsBonus(ghsOtherDetailsDto.getBonus());
		ghsAccountMasterUpdateDto.setIsNewCn(true);
		ghsAccountMasterUpdateDto.setCnDocNo(creditNote.getDocNo());

		ghsOtherDetailsDto.setIsFinalUpdateCompleted(true);
		paymentDetailsDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), ghsOtherDetailsDto)));

		log.info("Complete GHS redemption for account: {}, salels txn id: {} ", paymentDetailsDao.getInstrumentNo(),
				salesTxnDao.getId());
		try {
			integrationService.updateGhsAccountMaster(VendorCodeEnum.GHS.name(), ghsAccountMasterUpdateDto);
		} catch (Exception e) {
			log.info("Error on GHS redemption for account: {}, salels txn id: {}, error message: {} ",
					paymentDetailsDao.getInstrumentNo(), salesTxnDao.getId(), e.getLocalizedMessage());
			throw e;
		}
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		boolean isReleaseAccount = (PaymentStatusEnum.OPEN.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.FAILED.name().equals(paymentDetailsDao.getStatus()));

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

		if (isReleaseAccount) {
			// release account from current transaction
			integrationService.updateGhsAccountMasterStatus(VendorCodeEnum.GHS.name(),
					Integer.valueOf(paymentDetailsDao.getInstrumentNo()), GhsAccountDetailsStatusEnum.OPEN.name());
		}
	}
}
