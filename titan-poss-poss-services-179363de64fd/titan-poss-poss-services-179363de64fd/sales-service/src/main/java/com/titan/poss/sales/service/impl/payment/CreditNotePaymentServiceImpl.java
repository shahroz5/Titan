/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
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
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DigiGoldTanishqDiscountDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.GhsSchemeTypeEnum;
import com.titan.poss.core.dto.CNPriorityDetails;
import com.titan.poss.core.dto.CNPriorityDetailsData;
import com.titan.poss.core.dto.DigigoldDetails;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCreditNoteDetails;
import com.titan.poss.core.dto.LocationOtpDetails;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.AllowedCategoryForCN;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.EghsCNDetails;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.CNWorkflowStatus;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SalesOtpTypeEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteRedeemDto;
import com.titan.poss.sales.dto.request.FrozenRatesDetails;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CoinOfferDiscountDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.GepPurityDiscountDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.KaratExchangeDiscountDto;
import com.titan.poss.sales.dto.response.RivaahGhsDiscountDetailsExtDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.CreditNotePaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CreditNotePaymentService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.DiscountFacadeService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OtpService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for CN payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesCnPaymentServiceImpl")
public class CreditNotePaymentServiceImpl implements CreditNotePaymentService {

	public CreditNotePaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), this);
	}

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private OtpService otpService;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private CommonTransactionService commonTxnService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private CommonPaymentService commonPaymentService;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private DiscountFacadeService discountFacadeService;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private CustomerDocumentsRepository customerDocumentsRepository;

	private static final String CN_AMOUNT_CONST = "cnAmount";

	private static final String ERR_SALE_165 = "ERR-SALE-165";
	private static final String THE_CREDIT_NOTE_IS_LINKED_WITH_OTHER_TRANSACTION = "The credit note is linked with other transaction.";

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		CreditNotePaymentFieldsDto creditNotePaymentFieldsDto = (CreditNotePaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, CreditNotePaymentFieldsDto.class);
		// validate fields
		creditNotePaymentFieldsDto.validateFields(creditNotePaymentFieldsDto);

		SalesPaymentDto salesPaymentDto = SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
		salesPaymentDto.setOtherDetails(paymentCreateDto.getOtherDetails());

		return salesPaymentDto;
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		String locationCode = CommonUtil.getStoreCode();
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationCode);
		if (locationCacheDto == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023, "Credit note details is not present for location " + locationCode);
		}
		// if 'isRateProtectedCN' is true, then check it's allowed
		checkLocationToAllowRateFreezeCN(paymentCode, salesTxnDao, salesPaymentDto, locationCacheDto);

		// get customer attached to CN.
		// CN query required here? or this check to be moved to payment validations.
		CreditNoteDaoExt creditNoteDaoExt = creditNoteRepository
				.findByIdAndLocationCode(salesPaymentDto.getReference3(), locationCode);

		if (creditNoteDaoExt == null) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_NOT_FOUND, SalesConstants.ERR_SALE_154,
					"Credit note not found.");
		}

		// validate 'CHEQUE' realization date(as per UAT defect 3649)
		CNPaymentDetailsDto cnPaymentDetailsDto = null;

		if (!StringUtil.isBlankJsonStr(creditNoteDaoExt.getPaymentDetails())) {
			JsonData paymentDetails = MapperUtil.mapObjToClass(creditNoteDaoExt.getPaymentDetails(), JsonData.class);
			cnPaymentDetailsDto = MapperUtil.mapObjToClass(paymentDetails.getData(), CNPaymentDetailsDto.class);
		}

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		if (cnPaymentDetailsDto != null && BooleanUtils.isTrue(cnPaymentDetailsDto.isCheque())) {

			if (locationCacheDto.getPaymentDetails().getRealisationDays() == null) {
				throw new ServiceException(SalesConstants.CHEQUE_REALIZATION_DAYS_NOT_PRESENT_FOR_THE_LOCATION,
						SalesConstants.ERR_SALE_397);
			}
			
			if (!salesTxnDao.getTxnType().equals(TransactionTypeEnum.AB.name())
					&& !salesTxnDao.getSubTxnType().equals(SubTxnTypeEnum.NEW_AB.name())) {
				if (cnPaymentDetailsDto.getChequeDate()!=null && Math.abs(CalendarUtils.getDayDiff(cnPaymentDetailsDto.getChequeDate(),
						businessDate)) < locationCacheDto.getPaymentDetails().getRealisationDays()) {
					throw new ServiceException(
							SalesConstants.DYNAMIC_PAYMENTCODE_REALISATION_DAYS_HAS_NOT_PASSED_FOR_DYNAMIC_TXNTYPE,
							SalesConstants.ERR_SALE_390, "Realisation days has not passed for the credit note",
							Map.of(SalesConstants.PAYMENT_CODE, PaymentCodeEnum.CHEQUE.getPaymentcode(), "txnType",
									creditNoteDaoExt.getRefDocType()));
				}
			}
		}
		checkDigiGoldPartialRedemption(creditNoteDaoExt, locationCacheDto, salesPaymentDto);
		
		//Ingore in case of AB to CM conversion
		if(salesTxnDao.getRefTxnId()!= null && !salesTxnDao.getRefTxnId().equals(creditNoteDaoExt.getLinkedTxn()))
		{
			// if third party CN, only then
			if (!salesTxnDao.getCustomerId().equals(creditNoteDaoExt.getCustomerId())) {
				// location check for OTP
				Boolean isOtpMandatoryForTxn = getOtpRequiredBasedOnTxn(locationCacheDto, salesTxnDao.getTxnType(),
						salesTxnDao.getSubTxnType());
				LocationCreditNoteDetails locCNDetails = locationCacheDto.getCnDetails();
				Boolean isWithoutOTP = salesPaymentDto.getIsWithoutOtp() == null ? false
						: salesPaymentDto.getIsWithoutOtp();
				Boolean isFileUploadRequired = locCNDetails.getIsUploadMandatoryforThirdPartyCNWithoutOTP() == null ? false
						: locCNDetails.getIsUploadMandatoryforThirdPartyCNWithoutOTP();
				// if OTP is mandatory, then validate OTP.
				if (isWithoutOTP && isFileUploadRequired && paymentCode.equals(PaymentCodeEnum.CREDIT_NOTE.name())) {

					Optional<List<CustomerDocumentsDao>> customerDocuments = customerDocumentsRepository
							.findByTxnIdAndDocumentTypeAndLocationCode(salesTxnDao.getId(), "CN_REDEMPTION", locationCode);
					if (!customerDocuments.isPresent()) {
						throw new ServiceException(SalesConstants.UPLOAD_CUSTOMER_ID_PROOF_FOR_CN_REDEMPTION,
								SalesConstants.ERR_SALE_440, "Please upload the customer ID proof for CN redemption");
					}

				} else if (!isWithoutOTP && BooleanUtils.isTrue(isOtpMandatoryForTxn)) {
					if (salesPaymentDto.getReference1() == null) {
						throw new ServiceException(SalesConstants.PLEASE_PROVIDE_OTP, SalesConstants.ERR_SALE_238,
								"Please provide OTP for the Credit Note payment.");
					}
					// validate OTP
					otpService.validateOTP(salesPaymentDto.getReference3(), SalesOtpTypeEnum.CN.name(),
							salesPaymentDto.getReference1());
				}

				// check - max no. of third party CNs allowed.
				//checkThirdPartyCNLimit(locationCacheDto, salesTxnDao);
			}
		}
		// check - max no. of third party CNs allowed.
		if(!(creditNoteDaoExt.getCustomerId().equals(salesTxnDao.getCustomerId()))) {
			checkThirdPartyCNLimit(locationCacheDto, salesTxnDao);		
		}
		
			
		return salesPaymentDto;
	}

	private void checkLocationToAllowRateFreezeCN(String paymentCode, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto, LocationCacheDto locationCacheDto) {

		if (StringUtil.isBlankJsonData(salesPaymentDto.getOtherDetails())) {
			return;
		}
		Boolean isRateProtectedCN = JsonUtils.getValueFromJson(salesPaymentDto.getOtherDetails().getData(),
				"isRateProtectedCN", Boolean.class);
		if (BooleanUtils.isNotTrue(isRateProtectedCN)) {
			return;
		}

		if (locationCacheDto.getGrfDetails() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"GRF details not configured for location: " + CommonUtil.getStoreCode());
		}

		boolean isCNValid = true;
		if ((CNType.ADV.name().equals(salesPaymentDto.getInstrumentType())
				&& isGrfCnAllowed(salesTxnDao, locationCacheDto))
				|| (CNType.GRN.name().equals(salesPaymentDto.getInstrumentType())
						&& isGrnCnAllowed(salesTxnDao, locationCacheDto))) {
			isCNValid = false;
		}

		if (!isCNValid) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_088,
					"Frozen rate(GRF) CN can be used in transaction as per location configuration.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentCode));
		}

	}

	private boolean isGrnCnAllowed(SalesTxnDaoExt salesTxnDao, LocationCacheDto locationCacheDto) {
		return (!BooleanUtils.isTrue(locationCacheDto.getGrnDetails().getIsGrnAllowedInCm())
				&& TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType()))
				|| (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
						&& !BooleanUtils.isTrue(locationCacheDto.getGrnDetails().getIsGrnAllowedInAdvanceBooking()))
				|| (TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())
						&& !BooleanUtils.isTrue(locationCacheDto.getGrnDetails().getIsGrnAllowedInCustomerOrder()));
	}

	private boolean isGrfCnAllowed(SalesTxnDaoExt salesTxnDao, LocationCacheDto locationCacheDto) {
		return (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())
				&& !BooleanUtils.isTrue(locationCacheDto.getGrfDetails().getIsGRFAllowedInCM()))
				|| (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
						&& !BooleanUtils.isTrue(locationCacheDto.getGrfDetails().getIsGRFAllowedInAdvanceBooking()))
				|| (TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())
						&& !BooleanUtils.isTrue(locationCacheDto.getGrfDetails().getIsGRFAllowedInCustomerOrder()));
	}

	/**
	 * @param creditNoteDaoExt
	 * @param locationCacheDto
	 * @param salesPaymentDto
	 */
	private void checkDigiGoldPartialRedemption(CreditNoteDaoExt creditNoteDaoExt, LocationCacheDto locationCacheDto,
			SalesPaymentDto salesPaymentDto) {
		// Digi Gold CN Partial Redemption check
		if (creditNoteDaoExt.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_TANISHQ.name())
				|| creditNoteDaoExt.getCreditNoteType().equalsIgnoreCase(CNType.DIGI_GOLD_NON_TANISHQ.name())) {
			DigigoldDetails digiGoldDetails = locationCacheDto.getDigigoldDetails();
			if (BooleanUtils.isFalse(digiGoldDetails.getIsCNPartialRedemptionAllowedForDigiGold())
					&& creditNoteDaoExt.getAmount().compareTo(salesPaymentDto.getAmount()) != 0) {
				throw new ServiceException("Partial Redemption is not enabled for the credit note", "ERR-SALE-332",
						creditNoteDaoExt.getCreditNoteType());
			}

		}
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		String locationCode = CommonUtil.getStoreCode();
		// validate CN details
		CreditNoteDaoExt creditNoteDaoExt = verifyAndGetCNDetails(paymentDetailsDao, paymentDetailsDao.getReference3(),
				locationCode);
        // validate CN details for product selected for transaction
		String id=paymentDetailsDao.getSalesTxnDao().getId();
		List<CashMemoDetailsDaoExt> cashMemo=cashMemoDetailsRepository.findByCashMemoDaoId(id);
		if(!cashMemo.isEmpty()){
			for(CashMemoDetailsDaoExt productCashMemo:cashMemo) {
				String productGroupId=productCashMemo.getProductGroupCode();
				if (creditNoteDaoExt.getPaymentDetails() != null) {
					JsonData CNdetails = MapperUtil.mapObjToClass(creditNoteDaoExt.getPaymentDetails(), JsonData.class);
					if(CNdetails.getData()!= null) {
						CNPaymentDetailsDto paymentsDetails = MapperUtil.mapObjToClass(CNdetails.getData(),
								CNPaymentDetailsDto.class);
						if(paymentsDetails.getPaymentCodes()!= null) {
							Map<String, String> paymentCodes = paymentsDetails.getPaymentCodes();
							if (paymentCodes.containsKey(PaymentCodeEnum.QCGC.getPaymentcode())
									&& productGroupId.equalsIgnoreCase("73")) {
								throw new ServiceException("CreditNote is not valid for the selected product group for transaction ",
										"ERR-SALE-480");
							}
						}
					}
				}
			}
		}
		boolean isMetalRateSave = false;
		// if 'isRateProtected' is true, then validate based on NAP-6396 & NAP-6406
//		CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto = getCNOtherDetails(
//				paymentDetailsDao.getOtherDetails());
//		if (creditNoteOtherDetailsDto!= null && creditNoteOtherDetailsDto.getIsRateProtectedCN()!= null && BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsRateProtectedCN())) {
			 isMetalRateSave = validateFrozenRateCNForTxn(paymentDetailsDao);
		//}
		

		JsonData jsonData = getDiscountValueInCreditNote(creditNoteDaoExt);
		BigDecimal discountAmount = new BigDecimal(jsonData.getType());
		

		// check if CN is already added.
		List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepository.getAllPaymentCodePayments(paymentCode,
				paymentDetailsDao.getSalesTxnDao().getId(),
				List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name()),
				paymentDetailsDao.getSalesTxnDao().getLocationCode());

		paymentDetailsList.forEach(paymentDao -> {
			if (paymentDetailsDao.getReference3().equals(paymentDao.getReference3())) {
				throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_FOR_PAYMENT,
						SalesConstants.ERR_SALE_034, "Credit Note is already added as payment.",
						Map.of(SalesConstants.PAYMENT_CODE, paymentCode));
			}
		});

		CreditNotePaymentOtherDetailsDto cnOtherDetails = getCNOtherDetails(paymentDetailsDao.getOtherDetails());
		checkIfGhsDiscountExists(jsonData, cnOtherDetails, creditNoteDaoExt);
		if (jsonData.getData() != null && cnOtherDetails!=null &&cnOtherDetails.getFrozenRateDetails()!=null) {
			cnOtherDetails.setIsDiscountPresent(true);
		}
		
		paymentDetailsDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), cnOtherDetails)));

		// pending - check if CN is added in other txn?

		// if discount is not present or if its a payment for TCS.
		if (discountAmount.compareTo(BigDecimal.ZERO) <= 0
				|| BooleanUtils.isTrue(paymentDetailsDao.getIsTcsPayment())) {
			// compare CN amount and due amount.
			// if due amount is >= credit note amount, then CN should be utilized
			// completely.
			if (dueAmount.compareTo(creditNoteDaoExt.getAmount()) >= 0
					&& paymentDetailsDao.getAmount().compareTo(creditNoteDaoExt.getAmount()) != 0) {
				throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_AMOUNT_AND_INPUT_AMOUNT_DO_NOT_MATCH,
						SalesConstants.ERR_SALE_032, "Input amount should match credit note amount.",
						Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
			} else if (dueAmount.compareTo(creditNoteDaoExt.getAmount()) < 0
					&& BigDecimal.ZERO.compareTo(dueAmount.subtract(paymentDetailsDao.getAmount())) != 0
					&& !(BooleanUtils.isTrue(cnOtherDetails.getIsLinkedCn())
							|| BooleanUtils.isTrue(cnOtherDetails.getIsRateProtectedCN()))) {
				// if credit note amount is greater then due amount, then after adding it as
				// payment, due amount should be zero. If not, throw error.
				// ignore check for linked CN.
				throw new ServiceException(
						SalesConstants.CREDIT_NOTE_OR_GHS_PAYMENT_SHOULD_MATCH_REMAINING_AMOUNT_OF_TRANSACTION,
						SalesConstants.ERR_SALE_144, "Due amount can be paid completely with Credit note.");
			}
		} else if (dueAmount.compareTo(creditNoteDaoExt.getAmount().add(discountAmount)) >= 0
				&& paymentDetailsDao.getAmount().compareTo(creditNoteDaoExt.getAmount()) != 0) {
			// if discount is present and still due amount is greater, then complete CN
			// should be utilized.
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_AMOUNT_AND_INPUT_AMOUNT_DO_NOT_MATCH,
					SalesConstants.ERR_SALE_032, "Input amount should match credit note amount.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
		}

		// check for priority of CNs
		checkCNPriority(paymentDetailsDao, paymentDetailsList, creditNoteDaoExt);

		// if GHS bonus or discount exists, check with other payments
		ghsValidationsForCn(paymentDetailsDao, paymentDetailsList);

		// cash limit check
		cashLimitCheck(paymentDetailsDao, creditNoteDaoExt);
		cnOtherDetails = getCNOtherDetails(paymentDetailsDao.getOtherDetails());

		// to save metalRate or discounTxnDetails
		if (isMetalRateSave || (GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(cnOtherDetails.getSchemeType())
				&& !StringUtils.isEmpty(cnOtherDetails.getDiscountId()))) {
			salesTxnRepositoryExt.save(paymentDetailsDao.getSalesTxnDao());
		}

		return Map.of(paymentDetailsDao, new ArrayList<>());
	}

	private void ghsValidationsForCn(PaymentDetailsDaoExt currentPaymentDetails,
			List<PaymentDetailsDaoExt> cnPaymentDetailsList) {
		CreditNotePaymentOtherDetailsDto cnOtherDetails = getCNOtherDetails(currentPaymentDetails.getOtherDetails());
		// check if ghs discount exists
		// customer check - do not allow third party discount
		if (BooleanUtils.isNotTrue(cnOtherDetails.getIsGhsDiscountPresent())
				|| !currentPaymentDetails.getSalesTxnDao().getCustomerId().equals(cnOtherDetails.getCnOwnerId())) {
			return;
		}

		// filter CN with GHS discount
		if (!CollectionUtil.isEmpty(cnPaymentDetailsList)) {
			List<PaymentDetailsDaoExt> tempCnPaymentList = new ArrayList<>();
			for (PaymentDetailsDaoExt paymentDao : cnPaymentDetailsList) {
				CreditNotePaymentOtherDetailsDto otherD = MapperUtil.mapObjToClass(
						MapperUtil.mapObjToClass(paymentDao.getOtherDetails(), JsonData.class).getData(),
						CreditNotePaymentOtherDetailsDto.class);
				if (currentPaymentDetails.getSalesTxnDao().getCustomerId().equals(otherD.getCnOwnerId())
						&& BooleanUtils.isTrue(otherD.getIsGhsDiscountPresent())) {
					tempCnPaymentList.add(paymentDao);
				}
			}
			cnPaymentDetailsList = tempCnPaymentList;
		}
		// get GHS payments also
		List<PaymentDetailsDaoExt> ghsPaymentDetailsList = paymentDetailsRepository.getAllPaymentCodePayments(
				PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), currentPaymentDetails.getSalesTxnDao().getId(),
				PaymentStatusEnum.getPaidPaymentStatus(), currentPaymentDetails.getSalesTxnDao().getLocationCode());
		// combine same customer CN with GHS discount
		List<PaymentDetailsDaoExt> paymentList = Stream.of(cnPaymentDetailsList, ghsPaymentDetailsList)
				.flatMap(Collection::stream).collect(Collectors.toList());

		Set<String> isRivaahDetailsExists = new HashSet<>();
		boolean isRivaahGhsExists = false;

		if (GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(cnOtherDetails.getSchemeType())) {
			isRivaahGhsExists = true;
			isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_IS_RIVAAH_GHS);
			if (commonPaymentService.isRivaahDiscountPresent(cnOtherDetails.getDiscountMcPct(),
					cnOtherDetails.getDiscountUcpPct())) {
				// new Rivaah GHS has discount %
				isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_HAS_RIVAAH_GHS_DISCOUNT);
			}
		} else if (cnOtherDetails.getBonus() != null && cnOtherDetails.getBonus().signum() > 0) {
			// new GHS has bonus
			isRivaahDetailsExists.add(SalesConstants.NEW_PAYMENT_HAS_GHS_BONUS);
		}
        if(cnOtherDetails.getSchemeType() !=null && cnOtherDetails.getSchemeCode() !=null) {
       
		    commonPaymentService.checkGhsAndCNClubbing(currentPaymentDetails, paymentList, isRivaahGhsExists,
		 		isRivaahDetailsExists, cnOtherDetails.getSchemeType(), cnOtherDetails.getSchemeCode());

		    // Rivaah ghs discount
		    checkIfRivaahGhsDiscountIsApplicable(currentPaymentDetails, cnOtherDetails);
        }

		// set CN other details
		currentPaymentDetails.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(currentPaymentDetails.getPaymentCode(), cnOtherDetails)));

	}

	private void checkIfRivaahGhsDiscountIsApplicable(PaymentDetailsDaoExt paymentDetails,
			CreditNotePaymentOtherDetailsDto cnOtherDetails) {
		if (!DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(cnOtherDetails.getDiscountType())) {
			return;
		}

		RivaahGhsDiscountDto rivaahGhsDiscountDto = null;

		DiscountBillLevelRequestDto discountBillLevelRequestDto = new DiscountBillLevelRequestDto();
		discountBillLevelRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		discountBillLevelRequestDto.setDiscountType(cnOtherDetails.getDiscountType());
		rivaahGhsDiscountDto = new RivaahGhsDiscountDto();
		rivaahGhsDiscountDto.setSchemeCode(cnOtherDetails.getSchemeCode());
		rivaahGhsDiscountDto.setMakingChargeDiscountPercent(new BigDecimal(cnOtherDetails.getDiscountMcPct()));
		rivaahGhsDiscountDto.setUcpDiscountPercent(new BigDecimal(cnOtherDetails.getDiscountUcpPct()));
		rivaahGhsDiscountDto.setExcludeProductGroup(cnOtherDetails.getProductGroupCodesRestricted());
		rivaahGhsDiscountDto.setAccountNo(paymentDetails.getInstrumentNo());
		rivaahGhsDiscountDto.setPaymentCode(paymentDetails.getPaymentCode());
		discountBillLevelRequestDto.setRivaahGhsDetails(new RivaahGhsDiscountDetailsDto(List.of(rivaahGhsDiscountDto)));
		discountBillLevelRequestDto.setItemDetails(new ArrayList<>());

		// call engine API to get discount id
		DiscountBillLevelResponseDto discountBillLevelResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);

		if (CollectionUtil.isEmpty(discountBillLevelResponseDto.getDiscountDetails())) {
			// if GHS Rivaah not applicable then remove discount details
			cnOtherDetails.setDiscountType(null);
			cnOtherDetails.setDiscountId(null);
			cnOtherDetails.setDiscountCode(null);

			return;
		}

		setDiscountBasicDetails(paymentDetails, cnOtherDetails, cnOtherDetails.getDiscountType(),
				discountBillLevelResponseDto);

	}

	private void setDiscountBasicDetails(PaymentDetailsDaoExt paymentDetails,
			CreditNotePaymentOtherDetailsDto cnOtherDetails, String discountType,
			DiscountBillLevelResponseDto discountBillLevelResponseDto) {
		// set discount id to GHS other details
		cnOtherDetails.setDiscountType(discountType);
		cnOtherDetails.setDiscountId(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountId());
		cnOtherDetails.setDiscountCode(discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountCode());

		// update discountTxnDetails
		DiscountTransactionDetails discountTxnDetails = discountUtilService
				.getDiscountTxnDetails(paymentDetails.getSalesTxnDao());

		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType)
				&& checkPreviousDiscount(cnOtherDetails, discountTxnDetails)) {
			if (discountTxnDetails.getRivaahGhsDiscountDetails() == null) {
				discountTxnDetails.setRivaahGhsDiscountDetails(new RivaahGhsDiscountDetailsExtDto());
			}
			cnOtherDetails.setIsRivaahDiscountApplicable(true);
			discountTxnDetails.getRivaahGhsDiscountDetails().setIsRivaahDiscountApplicable(true);
			paymentDetails.getSalesTxnDao().setDiscountTxnDetails(
					MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
		}
	}

	private boolean checkPreviousDiscount(CreditNotePaymentOtherDetailsDto cnOtherDetails,
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
			if (new BigDecimal(cnOtherDetails.getDiscountMcPct())
					.compareTo(rivaahGhs.getMakingChargeDiscountPercent()) > 0
					|| new BigDecimal(cnOtherDetails.getDiscountUcpPct())
							.compareTo(rivaahGhs.getUcpDiscountPercent()) > 0) {
				isGreanterThanPreviousDiscount = true;
				break;
			}
		}

		return isGreanterThanPreviousDiscount;
	}

	private void checkIfGhsDiscountExists(JsonData jsonData, CreditNotePaymentOtherDetailsDto cnOtherDetails,
			CreditNoteDaoExt cn) {
		if (jsonData.getData() != null) {
			CreditNoteDiscountDetailsDto discountDetails = MapperUtil.mapObjToClass(jsonData.getData(),
					CreditNoteDiscountDetailsDto.class);

			if (discountDetails.getGhsAccountDiscount() != null && commonPaymentService.isGhsDiscountPresent(
					discountDetails.getGhsAccountDiscount().getDiscountValue(),
					discountDetails.getGhsAccountDiscount().getDiscountMcPct(),
					discountDetails.getGhsAccountDiscount().getDiscountUcpPct())) {
				cnOtherDetails.setIsGhsDiscountPresent(true);
				cnOtherDetails.setSchemeCode(discountDetails.getGhsAccountDiscount().getSchemeCode());
				cnOtherDetails.setSchemeType(discountDetails.getGhsAccountDiscount().getSchemeType());
				cnOtherDetails.setBonus(discountDetails.getGhsAccountDiscount().getDiscountValue());
				cnOtherDetails.setDiscountMcPct(discountDetails.getGhsAccountDiscount().getDiscountMcPct());
				cnOtherDetails.setDiscountUcpPct(discountDetails.getGhsAccountDiscount().getDiscountUcpPct());
				cnOtherDetails.setDiscountType(discountDetails.getGhsAccountDiscount().getDiscountType());
				cnOtherDetails.setDiscountCode(discountDetails.getGhsAccountDiscount().getDiscountCode());
				cnOtherDetails.setDiscountId(discountDetails.getGhsAccountDiscount().getDiscountId());
				cnOtherDetails.setProductGroupCodesRestricted(
						discountDetails.getGhsAccountDiscount().getProductGroupCodesRestricted());
			}
		}
	}

	/**
	 * This method will check for cash limit.
	 * 
	 * @param paymentDetailsDao
	 */
	private void cashLimitCheck(PaymentDetailsDaoExt paymentDetailsDao, CreditNoteDaoExt creditNoteDaoExt) {
		Calendar cal1 = Calendar.getInstance();
		Calendar cal2 = Calendar.getInstance();
		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		cal2.setTime(creditNoteDaoExt.getOriginalDocDate());
		// if CN does not have cash element, then limit check is not required.
		if (creditNoteDaoExt.getCashCollected() == null
				|| BigDecimal.ZERO.compareTo(creditNoteDaoExt.getCashCollected()) == 0) {
			paymentDetailsDao.setCashCollected(BigDecimal.ZERO);
			return;
		}
		if (paymentDetailsDao.getAmount().compareTo(creditNoteDaoExt.getCashCollected()) < 0) {
			paymentDetailsDao.setCashCollected(paymentDetailsDao.getAmount());
		} else {
			paymentDetailsDao.setCashCollected(creditNoteDaoExt.getCashCollected());
		}

		// if dates are equal, then no cash limit check needed
		if (cal1.compareTo(cal2) == 0 &&   (paymentDetailsDao.getSalesTxnDao().getCustomerId() !=null && 
				creditNoteDaoExt.getCustomerId() !=null && 
				paymentDetailsDao.getSalesTxnDao().getCustomerId().compareTo(creditNoteDaoExt.getCustomerId()) ==0 )) {
			return;
		}

		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				CommonUtil.getLocationCode(), null);

		BigDecimal totalCashPaid = BigDecimal.ZERO;

		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.getCashCollectedByTransactionIdAndPaymentCodes(paymentDetailsDao.getSalesTxnDao().getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), CommonUtil.getLocationCode(), null);
		
		CashPaymentDetailsDto cashPaymentDetails = commonPaymentService.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
	    totalCashPaid=totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
	    totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());
		
		if (cal2.before(cal1) ||  (paymentDetailsDao.getSalesTxnDao().getCustomerId() !=null && 
				creditNoteDaoExt.getCustomerId() !=null && 
				paymentDetailsDao.getSalesTxnDao().getCustomerId().compareTo(creditNoteDaoExt.getCustomerId()) !=0 )) {
			totalCashPaid = totalCashPaid.add(paymentDetailsDao.getCashCollected());
			log.info("inside credi note cash limit {}",totalCashPaid);
		}
		if ((cal2.get(Calendar.MONTH) < cal1.get(Calendar.MONTH) || cal2.get(Calendar.YEAR) < cal1.get(Calendar.YEAR) ) ||  (paymentDetailsDao.getSalesTxnDao().getCustomerId() !=null && 
				creditNoteDaoExt.getCustomerId() !=null && 
				paymentDetailsDao.getSalesTxnDao().getCustomerId().compareTo(creditNoteDaoExt.getCustomerId()) !=0 )) {
			totalPmlaCashAmount = totalPmlaCashAmount.add(paymentDetailsDao.getCashCollected());
			log.info("inside credi note pmla cash limit {}",totalPmlaCashAmount);
		}
		log.info("inside credi note cash limit {} {}",totalCashPaid,totalPmlaCashAmount);

		if (totalCashPaid == null || BigDecimal.ZERO.compareTo(totalCashPaid) == 0) {
			return;
		}

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid,
				creditNoteDaoExt.getDocDate(), totalCashPaid, totalPmlaCashAmount);
		instrumentCashAmountDto = customerPaymentService.cashLimitCheck(instrumentCashAmountDto,
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), null, paymentDetailsDao.getSalesTxnDao(),
				paymentDetailsDao.getSalesTxnDao().getCustomerId(), false);

		// if instrumentCashAmountDto is NULL OR
		// instrumentCashAmountDto.getTotalCashAmount() is NULL, then Credit Note cash
		// element should be ignored.
		// i.e, clear cashCollected in paymentDetailsDao
		if (instrumentCashAmountDto == null || instrumentCashAmountDto.getTotalCashAmount() == null) {
			paymentDetailsDao.setCashCollected(null);
		}
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// no trigger payment in CN.
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// no validate payment in CN
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// no update payment in CN.
		return null;
	}

	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		CreditNoteDaoExt creditNoteDaoExt = creditNoteRepository
				.findByIdAndLocationCode(paymentDetailsDao.getReference3(), CommonUtil.getLocationCode());
		CreditNotePaymentOtherDetailsDto cnOtherDetails = getCNOtherDetails(paymentDetailsDao.getOtherDetails());
		// check discount and payment
		checkRelatedDiscountsAndPayment(paymentDetailsDao, creditNoteDaoExt, cnOtherDetails);

		// if payment is a GRF/GRN CN(i.e, 'isRateProtectedCN' is true), then ask UI
		// team to call price update in such scenarios.

		// current implementation : a new CN will be generated.
		if (PaymentStatusEnum.OPEN.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.FAILED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		} else if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {

			if (paymentDetailsDao.getAmount().compareTo(creditNoteDaoExt.getAmount()) == 0) {

				creditNoteDaoExt.setStatus(CNStatus.OPEN.name());
				creditNoteDaoExt.setUtilisedAmount(BigDecimal.ZERO);
				creditNoteRepository.save(creditNoteDaoExt);
				// set payment status to 'REVERSED'.
				paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());

			} else {

				// if payment is completed and CN is partially utilized
				CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();
				creditNoteIndvCreateDto.setCreditNoteType(creditNoteDaoExt.getCreditNoteType());
				creditNoteIndvCreateDto.setAmount(paymentDetailsDao.getAmount());
				creditNoteIndvCreateDto.setRemarks(paymentDetailsDao.getPaymentCode() + " payment reversed.");
				creditNoteIndvCreateDto.setCashCollected(paymentDetailsDao.getCashCollected());

				// set discount details of exists
				setDiscountDetailsForCN(paymentDetailsDao, creditNoteDaoExt, creditNoteIndvCreateDto);
				if (cnOtherDetails.getFrozenRateDetails() != null) {
					creditNoteIndvCreateDto.setFrozenRateDetails(MapperUtil.getStringFromJson(
							new JsonData(SalesConstants.FROZEN_RATE_DETAILS, cnOtherDetails.getFrozenRateDetails())));
				}
				
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
				cnDto.setDocDate(paymentDetailsDao.getSalesTxnDao().getDocDate());
				
				List<CreditNoteResponse> cnListResponse = creditNoteService.createNewCreditNote(cnDto);
				// payment status to be 'REVERSED' or 'REVERSED_WITH_CN'?
				paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());
				paymentDetailsDao.setRemarks("CN Doc No: " + cnListResponse.get(0).getDocNo()); // CN number to be
																								// stored?

				cnOtherDetails.setCreditNoteNo(cnListResponse.get(0).getDocNo());

			}

		}

		boolean isSalesTxnSave = removeRivaahDetailsFromTxn(paymentDetailsDao, cnOtherDetails);
		if (isSalesTxnSave)
			commonTxnService.saveSalesTxn(paymentDetailsDao.getSalesTxnDao());
		paymentDetailsDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), cnOtherDetails)));
		paymentDetailsRepository.save(paymentDetailsDao);

	}

	private boolean removeRivaahDetailsFromTxn(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNotePaymentOtherDetailsDto cnOtherDetails) {
		boolean isSalesTxnSave = false;

		if (!commonPaymentService.isRivaahDiscountPresent(cnOtherDetails.getDiscountMcPct(),
				cnOtherDetails.getDiscountUcpPct())) {
			return isSalesTxnSave;
		}

		List<PaymentDetailsDaoExt> ghsPaymentDetailsList = paymentDetailsRepository.getAllPaymentCodePayments(
				paymentDetailsDao.getPaymentCode(), paymentDetailsDao.getSalesTxnDao().getId(),
				PaymentStatusEnum.getPaidPaymentStatus(), paymentDetailsDao.getSalesTxnDao().getLocationCode());
		// get valid CN payments also
		List<PaymentDetailsDaoExt> cnPaymentDetailsList = getValidCreditNotePayments(
				paymentDetailsDao.getSalesTxnDao());
		// combine same customer CN with GHS discount
		List<PaymentDetailsDaoExt> paymentList = Stream.of(cnPaymentDetailsList, ghsPaymentDetailsList)
				.flatMap(Collection::stream).collect(Collectors.toList());
		boolean isRivaahGhsPaymentWithDiscountPresent = getIsGhsRivaahDiscountPresentInOtherPayment(paymentDetailsDao,
				paymentList);

		// clear discountTxnDetails in sales_trnasaction
		DiscountTransactionDetails discountTxnDetails = discountUtilService
				.getDiscountTxnDetails(paymentDetailsDao.getSalesTxnDao());
		if (discountTxnDetails == null || discountTxnDetails.getRivaahGhsDiscountDetails() == null
				|| CollectionUtil.isEmpty(discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs())) {
			if (discountTxnDetails != null && !isRivaahGhsPaymentWithDiscountPresent) {
				discountTxnDetails.setRivaahGhsDiscountDetails(null);
				paymentDetailsDao.getSalesTxnDao().setDiscountTxnDetails(MapperUtil
						.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
				cnOtherDetails.setIsRivaahGhsDiscountRefresh(Boolean.TRUE);// for UI screen refresh on delete(this field
																			// is useless otherwise)
				isSalesTxnSave = true;
			}
			return isSalesTxnSave;
		}

		RivaahGhsDiscountDto rivaahGhsDiscountToRemove = null;
		for (RivaahGhsDiscountDto rivaahGhsDiscountDto : discountTxnDetails.getRivaahGhsDiscountDetails()
				.getRivaahGhs()) {
			if (rivaahGhsDiscountDto.getAccountNo()
					.equals(paymentDetailsDao.getInstrumentNo() + "_" + paymentDetailsDao.getReference2())) {
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

	private boolean getIsGhsRivaahDiscountPresentInOtherPayment(PaymentDetailsDaoExt paymentDetailsDao,
			List<PaymentDetailsDaoExt> paymentList) {
		boolean isRivaahGhsPaymentWithDiscountPresent = false;
		for (PaymentDetailsDaoExt paymentDetails : paymentList) {
			String schemeType = null;
			String discountId;
			JsonData jsonData = MapperUtil.mapObjToClass(paymentDetails.getOtherDetails(), JsonData.class);
			if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDetails.getPaymentCode())) {
				GhsPaymentOtherDetailsDto otherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						GhsPaymentOtherDetailsDto.class);
				discountId = otherDetails.getDiscountId();
				schemeType = paymentDetails.getReference3();
			} else {
				CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						CreditNotePaymentOtherDetailsDto.class);
				discountId = cnOtherDetails.getDiscountId();
				schemeType = cnOtherDetails.getSchemeType();
			}

			// if other GHS payments with Rivaah GHS discounts exists
			if (!paymentDetailsDao.getId().equals(paymentDetails.getId())
					&& GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(schemeType) && !StringUtils.isEmpty(discountId)) {
				isRivaahGhsPaymentWithDiscountPresent = true;
			}

		}

		return isRivaahGhsPaymentWithDiscountPresent;
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

	private void setDiscountDetailsForCN(PaymentDetailsDaoExt paymentDetailsDao, CreditNoteDaoExt creditNoteDaoExt,
			CreditNoteIndvCreateDto creditNoteIndvCreateDto) {
		if (!StringUtil.isBlankJsonStr(creditNoteDaoExt.getDiscountDetails())) {
			CreditNoteDiscountDetailsDto cnDiscounts = MapperUtil.mapObjToClass(creditNoteDaoExt.getDiscountDetails(),
					CreditNoteDiscountDetailsDto.class);

			// carry utilized discount only for GEP Exchange Offer
			if (!CollectionUtils.isEmpty(cnDiscounts.getGepPurityDiscount())) {
				BigDecimal utilzationFactor = paymentDetailsDao.getAmount().divide(creditNoteDaoExt.getAmount(),
						DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
				for (GepPurityDiscountDto gepDiscount : cnDiscounts.getGepPurityDiscount()) {
					// discountValue = (discountValue*utlzFactor)
					gepDiscount.setDiscountValue(gepDiscount.getDiscountValue().multiply(utilzationFactor)
							.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
				}
			}
			if (cnDiscounts.getDigiGoldDiscount() != null) {
				DigiGoldTanishqDiscountDto digiGoldDiscount = cnDiscounts.getDigiGoldDiscount();
				BigDecimal utilzationFactor = paymentDetailsDao.getAmount().divide(creditNoteDaoExt.getAmount(),
						DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
				digiGoldDiscount.setDiscountValue(digiGoldDiscount.getDiscountValue().multiply(utilzationFactor)
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
				cnDiscounts.setDigiGoldDiscount(digiGoldDiscount);
			}

			// set discount json to new CN(all discounts, as discounts will not be used)
			creditNoteIndvCreateDto.setDiscountDetails(new JsonData("CN_DISCOUNT_DETAILS", cnDiscounts));
			creditNoteIndvCreateDto.setGepConfigDetailsDao(creditNoteDaoExt.getGepConfigDetailsDao());
		}
	}

	private void checkRelatedDiscountsAndPayment(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNoteDaoExt creditNoteDaoExt, CreditNotePaymentOtherDetailsDto cnOtherDetails) {
		// check if related discount is present, if yes then payment deletion is not
		// allowed

		// get all discounts added by payment id
		List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository.findAllBySalesTxnIdAndRefPaymentId(
				paymentDetailsDao.getSalesTxnDao().getId(), paymentDetailsDao.getId());

		int count = 0;
		for (DiscountDetailsDaoExt discountDetails : discountDetailsList) {

			if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountDetails.getDiscountType())) {
				count++;
				discountFacadeService.deleteTransactionLevelDiscount(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnDao().getTxnType(),
						paymentDetailsDao.getSalesTxnDao().getSubTxnType(), discountDetails.getId());

			}
		}
		cnOtherDetails.setIsRivaahGhsDiscountRefresh(count > 0);

		if (!CollectionUtil.isEmpty(discountDetailsList) && discountDetailsList.size() != count) {
			throw new ServiceException(SalesConstants.PLEASE_DELETE_RELATED_DISCOUNT_BEFORE_DELETING_PAYMENT,
					SalesConstants.ERR_SALE_324, "Discounts related to payment to be deleted first.");
		}

		// check if related payment is present, if yes then payment deletion is not
		// allowed
		List<PaymentDetailsDaoExt> relatedPayment = paymentDetailsRepository.findBySalesTxnDaoIdAndReference3(
				paymentDetailsDao.getSalesTxnDao().getId(), paymentDetailsDao.getId());
		if (!CollectionUtil.isEmpty(relatedPayment)) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_DELETED, SalesConstants.ERR_SALE_035,
					"Payments related to current payment to be deleted first.");
		}

		// do not allow to delete if CN is linked to sales reference. and status of the
		// Credit note is 'OPEN'.
		if (checkIfCnIsLinkedToCurrentRefTxn(creditNoteDaoExt.getLinkedTxn(),
				paymentDetailsDao.getSalesTxnDao().getRefTxnId())
				&& CNStatus.OPEN.name().equals(creditNoteDaoExt.getStatus())) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_DELETED, SalesConstants.ERR_SALE_035,
					"Credit note is linked to another payment.");
		}
	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {

		// if payment status is not OPEN do not allow redemption.
		if (!SalesUtil.paymentStatusCheckForRedemption(paymentDetailsDao.getStatus())) {
			return paymentDetailsDao;
		}

		CreditNoteDaoExt creditNoteDaoExt = creditNoteRepository
				.findByIdAndLocationCode(paymentDetailsDao.getReference3(), CommonUtil.getStoreCode());

		// check if CN is still in OPEN status.
		// pending - status update to failed is required?
		if (!CNStatus.OPEN.name().equals(creditNoteDaoExt.getStatus())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, "Credit note is used in other txn",
					Map.of(SalesConstants.DOC_NO, creditNoteDaoExt.getDocNo().toString()));
		}

		checkForWorkflowStatus(creditNoteDaoExt);

		CreditNotePaymentOtherDetailsDto cnOtherDetails = getCNOtherDetails(paymentDetailsDao.getOtherDetails());

		checkAndConfirmGhsDiscount(paymentDetailsDao, cnOtherDetails);

		// check if related discounts are confirmed
		List<DiscountDetailsDaoExt> relatedDiscountList = discountDetailsRepository.findAllBySalesTxnIdAndRefPaymentId(
				paymentDetailsDao.getSalesTxnDao().getId(), paymentDetailsDao.getId());
		if (!CollectionUtil.isEmpty(relatedDiscountList)) {
			relatedDiscountList.forEach(discountDao -> {
				if (!DiscountSalesStatusEnum.CONFIRMED.name().equals(discountDao.getStatus())) {
					throw new ServiceException(SalesConstants.PLEASE_CONFIRM_RELATED_DISCOUNT_BEFORE_COMPLETING_PAYMENT,
							SalesConstants.ERR_SALE_325, "discount related to payment should be confirmed first.");
				}
			});
		}

		// if linked CN, then throw error.
		if (BooleanUtils.isTrue(cnOtherDetails.getIsLinkedCn())) {
			throw new ServiceException(SalesConstants.LINKED_CREDIT_NOTES_CANNOT_BE_REDEEMED_INDIVIDUALLY,
					SalesConstants.ERR_SALE_162, SalesConstants.LINKED_CREDIT_NOTES_CANNOT_BE_REDEEMED_INDIVIDUALLY
							+ " Kinldy call linked CN redeem API.");
		}

		FrozenRatesDetails frozenRatesDetails = null;
		// if 'isRateProtectedCN', then amount to be checked for redemption
		if (BooleanUtils.isTrue(cnOtherDetails.getIsRateProtectedCN())) {
			AmountDetailsDto amountDetailsDto = commonPaymentService.validPaymentForRateFreezedCN(paymentDetailsDao,
					creditNoteDaoExt, cnOtherDetails, true);
			if (cnOtherDetails.getFrozenRateDetails().getWeight().compareTo(amountDetailsDto.getTotalWeight()) > 0) {
				BigDecimal remainingWeight = cnOtherDetails.getFrozenRateDetails().getWeight()
						.subtract(amountDetailsDto.getTotalWeight());
				// Update payment frozen weight with proper weight used.
				cnOtherDetails.getFrozenRateDetails().setWeight(amountDetailsDto.getTotalWeight());
				// frozen rate details for child CN
				frozenRatesDetails = new FrozenRatesDetails(cnOtherDetails.getFrozenRateDetails().getMetal(),
						cnOtherDetails.getFrozenRateDetails().getRatePerUnit(), remainingWeight);
			}
		}

		BigDecimal remainingAmount = creditNoteDaoExt.getAmount().subtract(paymentDetailsDao.getAmount());
		CreditNoteRedeemDto cnRedeemDto = new CreditNoteRedeemDto();
		cnRedeemDto.setId(creditNoteDaoExt.getId());
		// pending - is it necessary to set customer id?
		cnRedeemDto.setCustomerId(creditNoteDaoExt.getCustomerId());
		// for 'isRateProtectedCN', amount will be set in validate function call
		cnRedeemDto.setUtilizedAmount(paymentDetailsDao.getAmount());
		// setting salesTxn also, for linked CN redemption validation
		cnRedeemDto.setSalesTxn(paymentDetailsDao.getSalesTxnDao());
		cnRedeemDto.setFrozenRatesDetails(frozenRatesDetails);
		try {
			// expect residual amount in response
			CreditNoteResponse newCn = creditNoteService.redeemCreditNote(cnRedeemDto);
			if (newCn != null) {
				cnOtherDetails.setNewCnId(newCn.getId());// used for sync
				if (CNStatus.CANCELLED.name().equals(newCn.getStatus())) {
					cnOtherDetails.setRefundAmount(newCn.getAmount());
				} else {
					cnOtherDetails.setNewCNNumber(newCn.getDocNo());
					cnOtherDetails.setRemainingAmount(remainingAmount);
				}

			}
			paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());

			// set CN other details
			paymentDetailsDao.setOtherDetails(
					MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), cnOtherDetails)));

			// save payment
			paymentDetailsRepository.save(paymentDetailsDao);
		} catch (ServiceException e) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
			throw new ServiceException(e.getMessage(), e.getErrorCode(), e.toString());
		}

		return paymentDetailsDao;
	}

	private void checkAndConfirmGhsDiscount(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNotePaymentOtherDetailsDto cnOtherDetails) {
		// update discounts to completed
		// if bonus is present
		if (commonPaymentService.isGhsDiscountPresent(cnOtherDetails.getBonus(), cnOtherDetails.getDiscountMcPct(),
				cnOtherDetails.getDiscountUcpPct())) {
			// get all discounts added by payment id
			List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository
					.findAllBySalesTxnIdAndRefPaymentId(paymentDetailsDao.getSalesTxnDao().getId(),
							paymentDetailsDao.getId());

			for (DiscountDetailsDaoExt discountDetails : discountDetailsList) {
				discountFacadeService.confirmTransactionLevelDiscount(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnDao().getTxnType(),
						paymentDetailsDao.getSalesTxnDao().getSubTxnType(), cnOtherDetails.getDiscountType(),
						discountDetails.getId());
			}
		}
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		// for weight of rate freezed CN
		Map<String, BigDecimal> utilizatedWeightMap = new HashMap<>();
		List<String> creditNoteIds = new ArrayList<>();

		for (PaymentDetailsDaoExt payment : paymentDetails) {
			creditNoteIds.add(payment.getReference3());
			CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto = getCNOtherDetails(payment.getOtherDetails());
			// to generate rate freezed CN with proper utilized weight
			if (BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsRateProtectedCN())) {
				utilizatedWeightMap.put(payment.getReference3(),
						creditNoteOtherDetailsDto.getFrozenRateDetails().getWeight());
			}

		}

		// pending: how to include discount in new CN created?
		List<CreditNoteResponse> creditnotes = creditNoteService.createNewCNFromOld(creditNoteIds, cancel, docDate,
				utilizatedWeightMap);

		Map<String, Integer> docnos = new HashMap<>();
		creditnotes.forEach(cn -> docnos.put(cn.getId(), cn.getDocNo()));

		return docnos;
	}

	private CreditNoteDaoExt verifyAndGetCNDetails(PaymentDetailsDaoExt paymentDetailsDao, String creditNoteId,
			String locationCode) {

		CreditNoteDaoExt creditNoteDaoExt = creditNoteRepository.findByIdAndLocationCode(creditNoteId, locationCode);

		if (creditNoteDaoExt == null) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_NOT_FOUND, SalesConstants.ERR_SALE_154,
					"Credit note not found.");
		}

		// if DV added, and Credit note contains discount, then CN is not allowed.
		checkDiscontAndGhsDv(paymentDetailsDao, creditNoteDaoExt);

		// gold rate protected CN not allowed

		if (!Integer.valueOf(paymentDetailsDao.getInstrumentNo()).equals(creditNoteDaoExt.getDocNo())
				|| !paymentDetailsDao.getInstrumentType().equals(creditNoteDaoExt.getCreditNoteType())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit Note details are incorrect.");
		}

		if (!CNStatus.OPEN.name().equals(creditNoteDaoExt.getStatus())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
					SalesConstants.ERR_SALE_157, "Credit note used as payment should be in OPEN status.",
					Map.of(SalesConstants.DOC_NO, creditNoteDaoExt.getDocNo().toString()));
		}

		// if CN is for eGHS payment, then should not be used.
		if (!StringUtil.isBlankJsonStr(creditNoteDaoExt.getEghsDetails())) {
			JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDaoExt.getEghsDetails(), JsonData.class);
			EghsCNDetails eghsCNDetails = MapperUtil.mapObjToClass(jsonData.getData(), EghsCNDetails.class);
			if (eghsCNDetails != null && BooleanUtils.isTrue(eghsCNDetails.getIsPaymentForEGHS())) {
				throw new ServiceException(SalesConstants.CREDIT_NOTE_IS_GENERATED_FOR_EGHS,
						SalesConstants.ERR_SALE_233,
						"Credit note is generated for EGHS. Cannot be used as payment in current transaction.");
			}
		}

		checkForWorkflowStatus(creditNoteDaoExt);

		// payment amount should not exceed CN amount
		if (paymentDetailsDao.getAmount().compareTo(creditNoteDaoExt.getAmount()) > 0) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_AMOUNT_IS_LESS_THAN_THE_UTILIZED_AMOUNT,
					SalesConstants.ERR_SALE_161, "Payment should be less or equal to CN amount. CN amount: "
							+ creditNoteDaoExt.getAmount() + " Payment amount: " + paymentDetailsDao.getAmount());
		}

		CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto = getCNOtherDetails(
				paymentDetailsDao.getOtherDetails());

		// check CN type, if it can be added or not - based on linked txn
		// CN linked txn should match ref txn of sales. If not throw error.
		if (checkIfCnIsLinkedToOtherTxn(creditNoteDaoExt.getLinkedTxn(),
				paymentDetailsDao.getSalesTxnDao().getRefTxnId(), creditNoteOtherDetailsDto)) {
			throw new ServiceException(THE_CREDIT_NOTE_IS_LINKED_WITH_OTHER_TRANSACTION, ERR_SALE_165,
					"Credit note tried to add as payment is linked to other transaction.");
		}

		// check for frozen rate, if present then validate.
		checkFrozenRateDetails(paymentDetailsDao, creditNoteDaoExt, creditNoteOtherDetailsDto);

		// check if configuration exists
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(locationCode);
		engineService.getRuleFieldValues(RuleTypeEnum.valueOf(creditNoteDaoExt.getCreditNoteType().toUpperCase()),
				ruleRequestListDto);

		// pending - check for Cheque realization date if CN is generated for cheque. -
		// required?

		creditNoteOtherDetailsDto.setCnOwnerId(creditNoteDaoExt.getCustomerId());
		creditNoteOtherDetailsDto.setCnAmount(creditNoteDaoExt.getAmount());
		creditNoteOtherDetailsDto
				.setRemainingAmount(creditNoteDaoExt.getAmount().subtract(paymentDetailsDao.getAmount()));

		creditNoteOtherDetailsDto.setOriginalDocDate(creditNoteDaoExt.getOriginalDocDate());
		// set instrument date
		paymentDetailsDao.setInstrumentDate(creditNoteDaoExt.getDocDate());
		// set other details to payment dao
		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), creditNoteOtherDetailsDto)));

		// set fiscal year to reference2 (required in reports)
		paymentDetailsDao.setReference2(String.valueOf(creditNoteDaoExt.getFiscalYear()));

		return creditNoteDaoExt;

	}

	private void checkFrozenRateDetails(PaymentDetailsDaoExt paymentDetailsDao, CreditNoteDaoExt creditNoteDaoExt,
			CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto) {
		JsonData frozenData = MapperUtil.mapObjToClass(creditNoteDaoExt.getFrozenRateDetails(), JsonData.class);
		if (!StringUtil.isBlankJsonData(frozenData)) {

			// Check if GRF/GRN CN belongs to transaction customer.
			if (!paymentDetailsDao.getSalesTxnDao().getCustomerId().equals(creditNoteDaoExt.getCustomerId())) {
				throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_USED_FOR_OTHER_CUSTOMER,
						SalesConstants.ERR_SALE_091, "Freeze rate CN cannot be used for other customers.");
			}

			if (paymentDetailsDao.getAmount().compareTo(creditNoteDaoExt.getAmount()) != 0) {
				throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_AMOUNT_AND_INPUT_AMOUNT_DO_NOT_MATCH,
						SalesConstants.ERR_SALE_032,
						"Credit note: if frozen rate details are present then, cannot utilize CN partially",
						Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
			}
			// check if 'isRateProtectedCN' was not passed as true in request, if yes then
			// have to throw error.
			// Else, set 'isRateProtectedCN' to true.
			if (!BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsRateProtectedCN())) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"Credit Note should be passed as 'isRateProtectedCN' true.");
			}

			FrozenRatesDetails frozenRatesDetails = MapperUtil.mapObjToClass(frozenData.getData(),
					FrozenRatesDetails.class);
			if (frozenRatesDetails.getMetal() == null) {
				throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE,
						SalesConstants.ERR_CORE_036, "Metal type of frozen rate details in CN is null.");
			}
			// set frozen details to CN payment other details.
			creditNoteOtherDetailsDto.setFrozenRateDetails(frozenRatesDetails);
			creditNoteOtherDetailsDto.setIsRateProtectedCN(true);
		} else {
			// check if 'isRateProtectedCN' was passed as true in request, if yes then
			// have to throw error.
			// Else, set 'isRateProtectedCN' to false.
			if (BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsRateProtectedCN())) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"Credit Note cannot be passed as 'isRateProtectedCN' true.");
			}
			creditNoteOtherDetailsDto.setIsRateProtectedCN(false);
			creditNoteOtherDetailsDto.setFrozenRateDetails(null);
		}
	}

	/**
	 * @param creditNoteDaoExt
	 */
	private void checkForWorkflowStatus(CreditNoteDaoExt creditNoteDaoExt) {
		// workflow status check - workflow status should be null, if not
		// such CN is not allowed as payment.
		// if status is 'REJECTED', then can it be used?
		if(creditNoteDaoExt.getWorkflowStatus()!=null && CNWorkflowStatus.getOnlyWorkFlowStatus().contains(creditNoteDaoExt.getWorkflowStatus())  ){
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_IS_REQUESTED_FOR_APPROVAL,
					SalesConstants.ERR_SALE_158,
					"Request is raised for the Credit Note no. -" + creditNoteDaoExt.getDocNo()
							+ ". Cannot be used as payment. CN approval status: "
							+ creditNoteDaoExt.getWorkflowStatus(),
					Map.of(SalesConstants.DOC_NO, creditNoteDaoExt.getDocNo().toString()));
		}

		CNResponeDtoExt cnEpossResponseDto = null;
		// check for IBT transfer as well.
		try {
			cnEpossResponseDto = epossCallService.callEposs(HttpMethod.GET,
					SalesUtil.CREDITNOTE_EPOSS_URL + "/" + creditNoteDaoExt.getId(),
					Map.of("srcBtqCode", creditNoteDaoExt.getLocationCode()), null, CNResponeDtoExt.class);
		} catch (ServiceException e) {
			// ignore exception from EPOSS
		}

		if (cnEpossResponseDto != null && creditNoteDaoExt.getWorkflowStatus()!=null && CNWorkflowStatus.getOnlyWorkFlowStatus().contains(creditNoteDaoExt.getWorkflowStatus())) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_IS_REQUESTED_FOR_APPROVAL,
					SalesConstants.ERR_SALE_158,
					"Request is raised for the Credit Note no. -" + creditNoteDaoExt.getDocNo()
							+ ". Cannot be used as payment. CN approval status: "
							+ creditNoteDaoExt.getWorkflowStatus(),
					Map.of(SalesConstants.DOC_NO, creditNoteDaoExt.getDocNo().toString()));
		}

	}

	/**
	 * @param paymentDetailsDao
	 * @param creditNoteDaoExt
	 */
	private void checkDiscontAndGhsDv(PaymentDetailsDaoExt paymentDetailsDao, CreditNoteDaoExt creditNoteDaoExt) {
		if (!StringUtil.isBlankJsonStr(creditNoteDaoExt.getDiscountDetails())
				&& !StringUtil.isBlankJsonStr(paymentDetailsDao.getSalesTxnDao().getDiscountTxnDetails())) {

			JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getSalesTxnDao().getDiscountTxnDetails(),
					JsonData.class);

			DiscountTransactionDetails discountTxnDetails = MapperUtil.mapObjToClass(jsonData.getData(),
					DiscountTransactionDetails.class);
			if (discountTxnDetails !=null && discountTxnDetails.getGhsDiscountDetails() != null
					&& !CollectionUtils.isEmpty(discountTxnDetails.getGhsDiscountDetails().getVoucherDetails())) {
				String message = "Credit Note with discount not allowed when DV is added.";
				throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294, message,
						Map.of(SalesConstants.REMARKS, message));
			}
		}
	}

	private boolean checkIfCnIsLinkedToOtherTxn(SalesTxnDaoExt cNLinkedTxn, SalesTxnDaoExt refTxn,
			CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto) {

		if (creditNoteOtherDetailsDto == null) {
			creditNoteOtherDetailsDto = new CreditNotePaymentOtherDetailsDto();
		}

		boolean isCnLinkedToOtherTxn = false;

		if ((!StringUtils.isEmpty(cNLinkedTxn) && StringUtils.isEmpty(refTxn)) || (!StringUtils.isEmpty(cNLinkedTxn)
				&& !StringUtils.isEmpty(refTxn) && (!cNLinkedTxn.getId().equals(refTxn.getId())))) {
			isCnLinkedToOtherTxn = true;
		}

		// if CN is not linked and isLinkedCN is passed as true, then throw error.
		if (creditNoteOtherDetailsDto.getIsLinkedCn() != null
				&& (!StringUtils.isEmpty(cNLinkedTxn) && !StringUtils.isEmpty(refTxn)
						&& (!cNLinkedTxn.getId().equals(refTxn.getId())))
				&& BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsLinkedCn())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit Note is not linked to current transaction.");
		}

		// set isLinkedCN
		if (StringUtils.isEmpty(refTxn) || StringUtils.isEmpty(cNLinkedTxn)) {
			creditNoteOtherDetailsDto.setIsLinkedCn(false);
		} else {
			creditNoteOtherDetailsDto.setIsLinkedCn(refTxn.getId().equals(cNLinkedTxn.getId()));
		}

		return isCnLinkedToOtherTxn;
	}

	private boolean checkIfCnIsLinkedToCurrentRefTxn(SalesTxnDaoExt cNLinkedTxn, SalesTxnDaoExt refTxn) {
		boolean isEqual = false;
		if (!StringUtils.isEmpty(cNLinkedTxn) && !StringUtils.isEmpty(refTxn)
				&& (cNLinkedTxn.getId().equals(refTxn.getId()))) {
			isEqual = true;
		}

		return isEqual;
	}

	private LocationOtpDetails getLocationOtpDetails(LocationCacheDto locationCacheDto) {
		LocationOtpDetails locationOtpDetails = locationCacheDto.getOtpDetails();

		if (locationOtpDetails == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"OTP details is not present for location " + CommonUtil.getLocationCode());
		}
		return locationOtpDetails;
	}

	private Boolean getOtpRequiredBasedOnTxn(LocationCacheDto locationCacheDto, String txnType, String subTxnType) {

		LocationOtpDetails locationOtpDetails = getLocationOtpDetails(locationCacheDto);
		Boolean isOtpMandatoryForTxn = null;
		String errorForTxnType = null;

		if (SubTxnTypeEnum.GIFT_SALE.name().equals(subTxnType)) {// for Gift Sale
			isOtpMandatoryForTxn = locationOtpDetails.getIsOTPrequiredforGC();
			errorForTxnType = "Gift Sale";

		} else if (TransactionTypeEnum.CM.name().equals(txnType)) {// for CM
			isOtpMandatoryForTxn = locationOtpDetails.getIsOTPallowedCM();
			errorForTxnType = "Cash Memo";

		} else if (TransactionTypeEnum.AB.name().equals(txnType)) {// for AB
			isOtpMandatoryForTxn = locationOtpDetails.getIsOTPallowedAB();
			errorForTxnType = "Advance Booking";

		} else if (TransactionTypeEnum.ADV.name().equals(txnType)) {// for Advance/GRF
			isOtpMandatoryForTxn = locationOtpDetails.getIsOTPallowedAdvance();
			errorForTxnType = "Accept Advance/GRF";

		} else if (TransactionTypeEnum.CO.name().equals(txnType)) {// for CO
			isOtpMandatoryForTxn = locationOtpDetails.getIsOTPallowedCO();
			errorForTxnType = "Customer Order";

		} else {
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060,
					"Invalid transaction type: " + txnType);
		}

		if (isOtpMandatoryForTxn == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023, "OTP details for " + errorForTxnType + " is not present for location "
							+ CommonUtil.getLocationCode());
		}

		return isOtpMandatoryForTxn;

	}

	private LocationCreditNoteDetails getLocationCNDetails(LocationCacheDto locationCacheDto) {

		LocationCreditNoteDetails locationCNDetails = locationCacheDto.getCnDetails();
		if (locationCNDetails == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Credit note details is not present for location " + CommonUtil.getLocationCode());
		}
		return locationCNDetails;
	}

	private void checkThirdPartyCNLimit(LocationCacheDto locationCacheDto, SalesTxnDaoExt salesTxnDao) {
		// max third party CN used in current transaction.
		LocationCreditNoteDetails locationCNDetails = getLocationCNDetails(locationCacheDto);

		// if max CNs allowed is not present, then throw error
		if (StringUtils.isEmpty(locationCNDetails.getMaxNoOfCN())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration for max third praty CN allowed is not present for location "
							+ CommonUtil.getLocationCode());
		}

		// get current total of third party CNs in txn
		Integer totalCNsAdded = paymentDetailsRepository.getTotalNumberOfCNAddedForCurrentTxnWhereCustomerIdIsDifferent(
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), salesTxnDao.getId(),
				List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name()),
				CommonUtil.getLocationCode());
		// if total 3rd party Cns is equal to max CNs allowed, then throw error.
		if (totalCNsAdded.equals(locationCNDetails.getMaxNoOfCN())) {
			throw new ServiceException(SalesConstants.MAX_LIMIT_REACHED_FOR_CURRENT_PAYMENT_TYPE,
					SalesConstants.ERR_SALE_164, "Max limit reached in current transaction for payment code: "
							+ PaymentCodeEnum.CREDIT_NOTE.getPaymentcode());
		}
	}

	private void checkCNPriority(PaymentDetailsDaoExt paymentDetailsDao, List<PaymentDetailsDaoExt> paymentDetailsList,
			CreditNoteDaoExt creditNote) {
		// get priority details
		CNPriorityDetails cnPriorityDetails = getPriorityFromConfigs();

		// current CN priority
		CNPriorityDetailsData currentCNPriorityDetails = getPriorityOfCurrentCN(paymentDetailsDao, cnPriorityDetails,
				creditNote);

		// value map has CN id and CN type
		Map<PaymentDetailsDaoExt, Map<String, String>> paymentsWoLinkedCNsMap = getCNPaymentListForPriorityCheck(
				paymentDetailsList);
		// if no non linked CNs added to current txn, then no other check required.
		if (CollectionUtils.isEmpty(paymentsWoLinkedCNsMap)) {
			return;
		}

		// if utilized amount is same as CN amount for all CNs(including the one which
		// is being added), then no priority check.
		if (!checkIfCNsArePartiallyUtilized(paymentDetailsDao, paymentsWoLinkedCNsMap.keySet(), creditNote)) {
			return;
		}

		// CN priority for other CN payments added
		Map<CNPriorityDetailsData, List<PaymentDetailsDaoExt>> priorityAndRespectivePayments = getCnPriorityWithPayments(
				paymentsWoLinkedCNsMap, cnPriorityDetails);

		// get the least priority item from map (max priority value)
		CNPriorityDetailsData minPriorityData = new CNPriorityDetailsData("", 0);

		for (Map.Entry<CNPriorityDetailsData, List<PaymentDetailsDaoExt>> priorityAndPaymentList : priorityAndRespectivePayments
				.entrySet()) {
			if ((priorityAndPaymentList.getKey().getPriority() > minPriorityData.getPriority())) {
				minPriorityData = priorityAndPaymentList.getKey();
			}
		}

		// if priority of an already added CN is less than priority of CN to be added,
		// then throw error
		if (minPriorityData.getPriority() > currentCNPriorityDetails.getPriority()) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_166, "CN cannot be used. Delete Credit notes added with lower priority.");
		} else if (minPriorityData.getPriority() == currentCNPriorityDetails.getPriority()) {
			// if priority is equal, then check for amount (lesser the amount of CN [amount
			// in credit_note table] - higher the priority)
			List<PaymentDetailsDaoExt> paymentList = priorityAndRespectivePayments.get(minPriorityData);
			// sort in ascending order of credit note amount.
			Collections.sort(paymentList,
					Comparator.comparing(paymentRecord -> JsonUtils.getValueFromJson(
							MapperUtil.mapObjToClass(paymentRecord.getOtherDetails(), JsonData.class).getData(),
							CN_AMOUNT_CONST, BigDecimal.class)));

			// Amount of CN to be added should not be less than CNs already present in the
			// transaction
			if ((JsonUtils.getValueFromJson(MapperUtil
					.mapObjToClass(paymentList.get(paymentList.size() - 1).getOtherDetails(), JsonData.class).getData(),
					CN_AMOUNT_CONST, BigDecimal.class)).compareTo(creditNote.getAmount()) > 0) {
				throw new ServiceException(SalesConstants.CREDIT_NOTE_CANNOT_BE_USED_AS_PAYMENT,
						SalesConstants.ERR_SALE_166,
						"CN cannot be used. Delete Credit notes added with lower priority.");
			}

		}

	}

	/**
	 * @param paymentDetailsList
	 * @return List<PaymentDetailsDaoExt>
	 */
	private Map<PaymentDetailsDaoExt, Map<String, String>> getCNPaymentListForPriorityCheck(
			List<PaymentDetailsDaoExt> paymentDetailsList) {
		// if no other CNs added to current txn, then no other check required.
		if (CollectionUtils.isEmpty(paymentDetailsList)) {
			return new HashMap<>();
		}

		Map<PaymentDetailsDaoExt, Map<String, String>> otherPaymentCnDetails = new HashMap<>();
		for (PaymentDetailsDaoExt payment : paymentDetailsList) {
			CreditNotePaymentOtherDetailsDto cnOtherDetails = getCNOtherDetails(payment.getOtherDetails());

			// 1. ignore 'isRateProtectedCN' from list. As per NAP-6396, such CNs should not
			// participate in priority check.
			// 2. filter payment list to exclude linked CNs.(if exists)
			if (BooleanUtils.isTrue(cnOtherDetails.getIsRateProtectedCN())
					|| BooleanUtils.isTrue(cnOtherDetails.getIsLinkedCn())) {
				continue;
			}
			if (!otherPaymentCnDetails.containsKey(payment)) {

				otherPaymentCnDetails.put(payment,
						Map.of("cnId", payment.getReference3(), "cnType", payment.getInstrumentType()));
			}

		}

		return otherPaymentCnDetails;
	}

	/**
	 * This method will get priority of current CN.
	 * 
	 * @param paymentDetailsDao
	 * @param cnPriorityDetails
	 * @return CNPriorityDetailsData
	 */
	private CNPriorityDetailsData getPriorityOfCurrentCN(PaymentDetailsDaoExt paymentDetailsDao,
			CNPriorityDetails cnPriorityDetails, CreditNoteDaoExt creditNote) {
		CNPriorityDetailsData currentCNPriorityDetails = null;

		for (CNPriorityDetailsData cnPriorityDetailsData : cnPriorityDetails.getPriorityDetails()) {
			if (creditNote.getCreditNoteType().equals(cnPriorityDetailsData.getCnType())) {
				currentCNPriorityDetails = cnPriorityDetailsData;
				break;
			}
		}

		if (currentCNPriorityDetails == null) {
			throw new ServiceException(SalesConstants.NO_PRIORITY_DETAILS_FOUND_FOR_THE_CREDIT_NOTE,
					SalesConstants.ERR_SALE_145,
					"No priority details found for CN type: " + creditNote.getCreditNoteType());
		}

		CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto = getCNOtherDetails(
				paymentDetailsDao.getOtherDetails());
		creditNoteOtherDetailsDto.setCnPriority(currentCNPriorityDetails.getPriority());
		// set priority of CN in other details, for UI purpose.
		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), creditNoteOtherDetailsDto)));

		return currentCNPriorityDetails;
	}

	private CreditNotePaymentOtherDetailsDto getCNOtherDetails(String otherDetails) {
		if (otherDetails == null) {
			return new CreditNotePaymentOtherDetailsDto();
		}
		JsonData jsonData = MapperUtil.mapObjToClass(otherDetails, JsonData.class);
		return MapperUtil.mapObjToClass(jsonData.getData(), CreditNotePaymentOtherDetailsDto.class);
	}

	/**
	 * This method gets CN priority from configs.
	 * 
	 * @return CNPriorityDetails
	 */
	private CNPriorityDetails getPriorityFromConfigs() {
		String locatioCode = CommonUtil.getLocationCode();
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(locatioCode);
		Object objResponse = engineService.getRuleFieldValues(RuleTypeEnum.CN_PRIORITY_CONFIG, ruleRequestListDto);

		CNPriorityDetails cnPriorityDetails = MapperUtil.mapObjToClass(objResponse, CNPriorityDetails.class);

		if (StringUtils.isEmpty(cnPriorityDetails) || CollectionUtils.isEmpty(cnPriorityDetails.getPriorityDetails())) {
			throw new ServiceException(SalesConstants.NO_PRIORITY_DETAILS_FOUND_FOR_THE_CREDIT_NOTE,
					SalesConstants.ERR_SALE_145,
					SalesConstants.NO_PRIORITY_DETAILS_FOUND_FOR_THE_CREDIT_NOTE + "for location: " + locatioCode);
		}
		return cnPriorityDetails;
	}

	/**
	 * This method gets CN priority and payment details map.
	 * 
	 * @param paymentDetailsList
	 * @param cnPriorityDetails
	 * @return Map<CNPriorityDetailsData, List<PaymentDetailsDaoExt>>
	 */
	private Map<CNPriorityDetailsData, List<PaymentDetailsDaoExt>> getCnPriorityWithPayments(
			Map<PaymentDetailsDaoExt, Map<String, String>> paymentsWoLinkedCNsMap,
			CNPriorityDetails cnPriorityDetails) {
		Map<CNPriorityDetailsData, List<PaymentDetailsDaoExt>> priorityAndRespectivePayments = new HashMap<>();
		cnPriorityDetails.getPriorityDetails().forEach(cnPriority -> {

			List<PaymentDetailsDaoExt> paymentListWrtPriority = new ArrayList<>();

			paymentsWoLinkedCNsMap.forEach((paymentDao, creditNote) -> {
				if (cnPriority.getCnType().equals(creditNote.get("cnType"))) {
					paymentListWrtPriority.add(paymentDao);
				}
			});

			// if payments are done, then add to map
			if (!CollectionUtils.isEmpty(paymentListWrtPriority)) {
				priorityAndRespectivePayments.put(cnPriority, paymentListWrtPriority);
			}

		});
		return priorityAndRespectivePayments;
	}

	/**
	 * This methods will check if CNs are partially used.
	 * 
	 * @param paymentDetailsDao
	 * @param paymentDetailsList
	 * @return boolean
	 */
	private boolean checkIfCNsArePartiallyUtilized(PaymentDetailsDaoExt paymentDetailsDao,
			Set<PaymentDetailsDaoExt> paymentDetailsList, CreditNoteDaoExt creditNote) {
		boolean isCNPartiallyUtilized = paymentDetailsDao.getAmount().compareTo(creditNote.getAmount()) != 0;

		// when, current CN is not partially utilized,
		// check if any other CN added is partially utilized.
		if (!isCNPartiallyUtilized) {
			for (PaymentDetailsDaoExt paymentDao : paymentDetailsList) {
				isCNPartiallyUtilized = paymentDao.getAmount()
						.compareTo(JsonUtils.getValueFromJson(
								MapperUtil.mapObjToClass(paymentDao.getOtherDetails(), JsonData.class).getData(),
								CN_AMOUNT_CONST, BigDecimal.class)) != 0;
				// if any CN is partially utilized, then break out.
				if (isCNPartiallyUtilized) {
					break;
				}
			}
		}

		return isCNPartiallyUtilized;

	}

	private JsonData getDiscountValueInCreditNote(CreditNoteDaoExt creditNoteDao) {
		BigDecimal discountAmount = BigDecimal.ZERO;

		if (StringUtil.isBlankJsonStr(creditNoteDao.getDiscountDetails())) {
			return new JsonData(discountAmount.toString(), null);
		}
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getDiscountDetails(), JsonData.class);
		if (StringUtil.isBlankJsonData(jsonData) || jsonData.getData() == null) {
			return new JsonData(discountAmount.toString(), null);
		}

		CreditNoteDiscountDetailsDto discountDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				CreditNoteDiscountDetailsDto.class);

		discountAmount = getCoinOfferDiscount(discountAmount, discountDetails);
		discountAmount = getKaratDiscount(discountAmount, discountDetails);
		discountAmount = getGepPurityDiscount(discountAmount, discountDetails);
		discountAmount = getDigiGoldDiscount(discountAmount, discountDetails);

		if (discountDetails.getGhsAccountDiscount() != null
				&& discountDetails.getGhsAccountDiscount().getDiscountValue() != null) {
			discountAmount = discountAmount.add(discountDetails.getGhsAccountDiscount().getDiscountValue());
		}

		return new JsonData(discountAmount.toString(), discountDetails);
	}

	private BigDecimal getDigiGoldDiscount(BigDecimal discountAmount, CreditNoteDiscountDetailsDto discountDetails) {
		if (discountDetails != null && discountDetails.getDigiGoldDiscount() != null) {
			discountAmount = discountDetails.getDigiGoldDiscount().getDiscountValue();
		}
		return discountAmount;
	}

	private BigDecimal getGepPurityDiscount(BigDecimal discountAmount, CreditNoteDiscountDetailsDto discountDetails) {
		if (!CollectionUtil.isEmpty(discountDetails.getGepPurityDiscount())) {
			for (GepPurityDiscountDto gepPurityDiscount : discountDetails.getGepPurityDiscount()) {
				if (gepPurityDiscount.getDiscountValue() != null) {
					discountAmount = discountAmount.add(gepPurityDiscount.getDiscountValue());
				}
			}
		}
		return discountAmount;
	}

	private BigDecimal getKaratDiscount(BigDecimal discountAmount, CreditNoteDiscountDetailsDto discountDetails) {
		if (!CollectionUtil.isEmpty(discountDetails.getKaratageExchangeDiscount())) {
			for (KaratExchangeDiscountDto karatDiscount : discountDetails.getKaratageExchangeDiscount()) {
				if (karatDiscount.getOneKTDiscountValue() != null) {
					discountAmount = discountAmount.add(karatDiscount.getOneKTDiscountValue());
				}
				if (karatDiscount.getTwoKTDiscountValue() != null) {
					discountAmount = discountAmount.add(karatDiscount.getTwoKTDiscountValue());
				}
			}
		}
		return discountAmount;
	}

	private BigDecimal getCoinOfferDiscount(BigDecimal discountAmount, CreditNoteDiscountDetailsDto discountDetails) {
		if (!CollectionUtil.isEmpty(discountDetails.getCoinOfferDiscount())) {
			for (CoinOfferDiscountDto coinDiscount : discountDetails.getCoinOfferDiscount()) {
				if (coinDiscount.getDiscountValue() != null) {
					discountAmount = discountAmount.add(coinDiscount.getDiscountValue());
				}
			}
		}
		return discountAmount;
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	public boolean validateFrozenRateCNForTxn(PaymentDetailsDaoExt paymentDetailsDao) {

		CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto = getCNOtherDetails(
				paymentDetailsDao.getOtherDetails());
		if (!BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsRateProtectedCN())) {
			return false;
		}

		// validate CN for transaction
		validateIfRateFreezedCNAllowedInTxn(paymentDetailsDao, creditNoteOtherDetailsDto);

		// Check if GRF/GRN CN belongs to transaction customer. -- moved to earlier
		// functions.
//		List<PaymentDetailsDaoExt> ghsPaymentList = paymentDetailsRepository.findAllBySalesTxnDaoId(paymentDetailsDao.getSalesTxnDao().getRefTxnId().getId());
//		if(ghsPaymentList.isEmpty())
//		{
			// Check for allowed category
			if (creditNoteOtherDetailsDto.getAllowedCategory() == null || !AllowedCategoryForCN.getAllowedCategory()
					.contains(creditNoteOtherDetailsDto.getAllowedCategory())) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"Proper Allowed category is required.");
			}
//		}

		// No items should be added in transaction. Exception: convert AB/CO to CM and
		// CN is linked to AB/CO
		if ((TransactionTypeEnum.CM.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())
				&& cashMemoDetailsRepository.countByCashMemoDaoId(paymentDetailsDao.getSalesTxnDao().getId()) != 0
				&& !(!StringUtils.isEmpty(paymentDetailsDao.getSalesTxnDao().getRefTxnId())
						&& BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsLinkedCn())))
				|| ((TransactionTypeEnum.AB.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())
						|| TransactionTypeEnum.CO.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType()))
						&& orderDetailsRepository.countByOrderId(paymentDetailsDao.getSalesTxnDao().getId()) != 0)) {
			throw new ServiceException(SalesConstants.REMOVE_ALL_ITEMS_AND_PAYMENTS_TO_ADD_RATE_PROTECTED_CREDIT_NOTE,
					SalesConstants.ERR_SALE_361, "Remove all items to add GRF/GRN CN.");
		}

		// No other payment should be added in transaction.
		// pending: for AB/CO to CM non frozen scenarios
		if (BigDecimal.ZERO.compareTo(paymentDetailsRepository.getPaidAmountByTransactionIdAndPaymentCode(
				paymentDetailsDao.getSalesTxnDao().getId(), null, paymentDetailsDao.getSalesTxnDao().getLocationCode(),
				null)) != 0) {
			throw new ServiceException(SalesConstants.REMOVE_ALL_ITEMS_AND_PAYMENTS_TO_ADD_RATE_PROTECTED_CREDIT_NOTE,
					SalesConstants.ERR_SALE_361, "Remove all payments to add GRF/GRN CN.");
		}

		// Update metal rate to sales transaction table.
		// update not needed when linked CN is added:
		if (!BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsLinkedCn())) {
			MetalRateListDto metalRateListDto = getValidMetalRatefromCN(paymentDetailsDao, creditNoteOtherDetailsDto);
			paymentDetailsDao.getSalesTxnDao().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateListDto));
			return true;
		}

		// update not needed when linked CN is added:
		return false;
	}

	private void validateIfRateFreezedCNAllowedInTxn(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto) {
		// frozen CN allowed only in NEW_CM & NEW_AB
		// pending: AB to CM Non frozen AB scenarios
		if (TransactionTypeEnum.CM.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())
				&& (!SubTxnTypeEnum.NEW_CM.name().equals(paymentDetailsDao.getSalesTxnDao().getSubTxnType())
						|| (paymentDetailsDao.getSalesTxnDao().getRefTxnId() != null
								&& !BooleanUtils.isTrue(creditNoteOtherDetailsDto.getIsLinkedCn())))) {
			// when CN is linked, then allow as this will be part of convert AB/CO to CM.
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_088, "Frozen rate(GRF/GRN) CN can be used in new CM only.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
		}

		// (for NEW_AB: should NOT allow when AB is 'NON FROZEN' (NAP-9132))
		if ((TransactionTypeEnum.AB.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())
				|| TransactionTypeEnum.CO.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType()))) {
			OrderDaoExt orderDao = orderRepository.getOne(paymentDetailsDao.getSalesTxnDao().getId());
			if (!BooleanUtils.isTrue(orderDao.getIsFrozenRate()) && !BooleanUtils.isTrue(orderDao.getIsBestRate())) {
				throw new ServiceException(SalesConstants.DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT,
						SalesConstants.ERR_SALE_088, "Frozen rate(GRF) CN can be used in new CM only.",
						Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
			}
		}

	}

	private MetalRateListDto getValidMetalRatefromCN(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto) {
		MetalRateListDto metalRateListDto;
		if (StringUtil.isBlankJsonStr(paymentDetailsDao.getSalesTxnDao().getMetalRateDetails())) {
			metalRateListDto = commonTxnService.getMetalRate();
		} else {
			metalRateListDto = commonTxnService
					.mapMetalRateJsonToDto(paymentDetailsDao.getSalesTxnDao().getMetalRateDetails());
		}
		// details
		for (Map.Entry<String, StandardPriceResponseDto> metalrate : metalRateListDto.getMetalRates().entrySet()) {
			if (metalrate.getKey().equals(creditNoteOtherDetailsDto.getFrozenRateDetails().getMetal())) {
				metalrate.getValue().setRatePerUnit(creditNoteOtherDetailsDto.getFrozenRateDetails().getRatePerUnit());
			} 
		}
    	if (metalRateListDto.getMetalRates().isEmpty()) {
			throw new ServiceException(SalesConstants.CREDIT_NOTE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_166, "Metal rate not found.");
		}
		return metalRateListDto;
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

	}

}
