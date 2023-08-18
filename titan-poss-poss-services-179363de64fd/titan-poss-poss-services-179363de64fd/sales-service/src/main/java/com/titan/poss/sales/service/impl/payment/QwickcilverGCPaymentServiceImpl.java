/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.GiftCardDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.QwickcilverGCOtherDetailsDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.RedeemTypeAndProductGroupListDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.QwickcilverGCPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.QwcikcilverCardDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.QwickcilverGCPaymentService;
import com.titan.poss.sales.service.impl.PaymentFacadeServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for QwickcilverGC Payment implementation
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesQCGCPaymentService")
public class QwickcilverGCPaymentServiceImpl implements QwickcilverGCPaymentService {

	public QwickcilverGCPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.QCGC.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private BusinessDayService businessDayService;
	
	@Autowired
	private QwcikcilverCardDetailsRepositoryExt qwcikcilverCardDetailsRepositoryExt;
	
	@Autowired
	private CustomerService customerService;



	private static final String ERR_SALE_033 = "ERR-SALE-033";
	private static final String GIFT_CARD_NUMBER_AND_INPUT_CARD_NUMBER_DO_NOT_MATCH = "Gift card number and input card number do not match.";

	/**
	 * This method will validate input fields of payment create dto.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {

		QwickcilverGCPaymentFieldsDto qwickcilverGCPaymentFieldsDto = (QwickcilverGCPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, QwickcilverGCPaymentFieldsDto.class);
		// validate fields
		qwickcilverGCPaymentFieldsDto.validateFields(qwickcilverGCPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());

	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// check location master for min, max and multiple cards. - deleted from NAP
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// check if card is previously added and it's total payment amount exceeds
		// gift card amount
		BigDecimal totalPaidAmount = paymentDetailsRepository.getPaidAmountByPaymentCodeAndInstrumentNoAndSalesTxnDaoId(
				paymentCode, paymentDetailsDao.getInstrumentNo(), paymentDetailsDao.getSalesTxnDao().getId());
		if (BigDecimal.ZERO.compareTo(totalPaidAmount) != 0) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_FOR_PAYMENT,
					SalesConstants.ERR_SALE_034,
					"Gift Card " + paymentDetailsDao.getInstrumentNo() + " is already added for the payment.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentCode));
		}

		// get balance from integration and map it.
		BigDecimal giftCardAmount = getBalance(paymentDetailsDao);

		// cash limit check
		cashLimitCheck(paymentDetailsDao);

		// pending - get gift Card name and check CFA mapping - to do this need to
		RedeemTypeAndProductGroupListDto redeemTypeAndProductGroupListDto = paymentUtil
				.productGroupCodeCheckForPayement(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnType(), paymentCode, paymentDetailsDao.getInstrumentNo(), null);

		// CPG validation.
		if (!paymentDetailsDao.getBankName().equals(redeemTypeAndProductGroupListDto.getCPGName())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Bank name should be valid CPG name");
		}

		// check redemption amount
		List<PaymentItemMappingDaoExt> paymentItemMapList = paymentUtil.paymentCheckBasedOnRedemptionType(
				paymentDetailsDao.getAmount(), giftCardAmount, redeemTypeAndProductGroupListDto.getValidAmount(),
				redeemTypeAndProductGroupListDto.getRedemptionType(), paymentDetailsDao,
				redeemTypeAndProductGroupListDto.getItemValueAndPgcDetails());

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode); // QCGC

		return Map.of(paymentDetailsDao, paymentItemMapList);
	}

	/**
	 * This method will validate and update payment details based on payment status
	 * and payment update dto.
	 * 
	 * @param paymentCode
	 * @param status
	 * @param paymentUpdateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(paymentDetailsDao.getOtherDetails()), JsonData.class);

		SalesPaymentDto salesPaymentDto = (SalesPaymentDto) MapperUtil.getObjectMapping(paymentDetailsDao,
				new SalesPaymentDto());
		salesPaymentDto.setOtherDetails(jsonData);

		// pending
		return salesPaymentDto;
	}

	private BigDecimal getBalance(PaymentDetailsDaoExt paymentDetailsDao) {
		
		GiftCardDetailsDao qwcikcilverCardDetails;

		// track data to get balance
		if (paymentDetailsDao.getReference1().length() == 26) {
			qwcikcilverCardDetails = qwcikcilverCardDetailsRepositoryExt.findByTrackData(paymentDetailsDao.getReference1());
		} else {
			
			qwcikcilverCardDetails=qwcikcilverCardDetailsRepositoryExt.findByCardNumber(paymentDetailsDao.getInstrumentNo());
		}

		// card no. check
		if (!StringUtils.isEmpty(paymentDetailsDao.getInstrumentNo())
				&& !paymentDetailsDao.getInstrumentNo().equals(qwcikcilverCardDetails.getCardNumber())) {
			throw new ServiceException(GIFT_CARD_NUMBER_AND_INPUT_CARD_NUMBER_DO_NOT_MATCH, ERR_SALE_033,
					"Gift card and input card numbers do not match.");
		}

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		// cardExpiryDate check
		if (businessDate.after(qwcikcilverCardDetails.getCardExpiryDate())) {
			throw new ServiceException(SalesConstants.GIFT_CARD_OR_VOUCHER_HAS_EXPIRED, SalesConstants.ERR_SALE_027,
					"Gift Card has expired.");
		}

		// response code and message check?

		// card type validation
		if (!paymentDetailsDao.getReference2().equals(qwcikcilverCardDetails.getCardType())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Gift Card type is invalid.");
		}

		// card no. & transaction id
		paymentDetailsDao.setInstrumentNo(qwcikcilverCardDetails.getCardNumber());
		paymentDetailsDao.setReference3(qwcikcilverCardDetails.getTransactionId());

		// pending - required?
		paymentDetailsDao.setRemarks(qwcikcilverCardDetails.getCardName());

		QwickcilverGCOtherDetailsDto qwickcilverGCOtherDetailsDto = new QwickcilverGCOtherDetailsDto();
		// card expire date and card name
		qwickcilverGCOtherDetailsDto.setCardExpiryDate(qwcikcilverCardDetails.getCardExpiryDate());
		qwickcilverGCOtherDetailsDto.setCardName(qwcikcilverCardDetails.getCardName());

		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), qwickcilverGCOtherDetailsDto)));
		
		if (paymentDetailsDao.getReference1().length() == 26) {
			qwcikcilverCardDetailsRepositoryExt.deleteByTrackData(paymentDetailsDao.getReference1());
		} else {
			
			qwcikcilverCardDetailsRepositoryExt.deleteByCardNumber(paymentDetailsDao.getInstrumentNo());
		}

		return qwcikcilverCardDetails.getAmount();
	}

	/**
	 * This method will trigger payment.
	 * 
	 * @param paymentDetailsDao
	 * @param salesPaymentDto
	 * @return PaymentDetailsDao
	 */
	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// no implementation - for trigger payment in QCGC
		return paymentDetailsDao;
	}

	/**
	 * This method will void transactions based payment id
	 * 
	 * @param paymentDetailsDao
	 */
	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		// if OPEN then DELETE, if COMPLETED then reverse
		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentUtil.reverseQCGC(paymentDetailsDao);
		} else {
			paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);
		}

		// pending: pin or track data to be cleared?
		paymentDetailsDao.setReference1(null);

		paymentDetailsRepository.save(paymentDetailsDao);

	}

	/**
	 * This method will validate payment by paymentDetails and otp.
	 * 
	 * @param paymentDetailsDao
	 * @param otp
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// no validation for QCGC payment
		return new SalesPaymentDto();
	}

	/**
	 * This method will confirm payment based payment details and status.
	 * 
	 * @param paymentDetailsDao
	 * @param status
	 * @return PaymentDetailsDao
	 */
	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {

		// if payment status is not OPEN do not allow
		// redemption.
		if (!SalesUtil.paymentStatusCheckForRedemption(paymentDetailsDao.getStatus())) {
			return paymentDetailsDao;
		}

		GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto = paymentUtil.setCardRedeemRequest(paymentDetailsDao);

		GcResponseDto gcResponseDto = integrationService.redeemGiftCardBalance(VendorCodeEnum.QC_GC.name(),
				giftCardRedeemRequestDto, GiftCardTypeEnum.GIFTCARD_CODE);
		log.info("request details: card no- {} ,card pin- {},amount- {}",giftCardRedeemRequestDto.getCardNumber(),
				giftCardRedeemRequestDto.getCardPin(),giftCardRedeemRequestDto.getAmount());
		log.info("response details: card no- {} ,approval code- {},amount- {},expiry date-{} ,response code-{} response msg-{},",gcResponseDto.getCardNumber(),
				gcResponseDto.getApprovalCode(),gcResponseDto.getAmount(),gcResponseDto.getCardExpiryDate(),gcResponseDto.getResponseCode(),
				gcResponseDto.getResponseMessage());


		if (!"0".equals(gcResponseDto.getResponseCode())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);

			Map<String, String> errorCause = Map.of("cardNo", paymentDetailsDao.getInstrumentNo(), "errorMessage",
					gcResponseDto.getResponseMessage(), SalesConstants.PAYMENT_CODE,
					paymentDetailsDao.getPaymentCode());

			throw new ServiceException(null, gcResponseDto.getResponseCode(), errorCause);
		}

		QwickcilverGCOtherDetailsDto qwickcilverGCOtherDetailsDto = getOtherDetails(
				paymentDetailsDao.getOtherDetails());

		// set transaction ID, approval code and bill amount
		qwickcilverGCOtherDetailsDto.setTransactionId(gcResponseDto.getTransactionId());
		qwickcilverGCOtherDetailsDto.setApprovalCode(gcResponseDto.getApprovalCode());
		qwickcilverGCOtherDetailsDto.setBillAmount(BigDecimal.valueOf(giftCardRedeemRequestDto.getBillAmount()));

		paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), qwickcilverGCOtherDetailsDto)));

		paymentDetailsRepository.save(paymentDetailsDao);

		return paymentDetailsDao;
	}

	private QwickcilverGCOtherDetailsDto getOtherDetails(String otherDetails) {

		JsonData jsonData = MapperUtil.mapObjToClass(otherDetails, JsonData.class);
		return MapperUtil.mapObjToClass(jsonData.getData(), QwickcilverGCOtherDetailsDto.class);
	}

	/**
	 * Group by CPG group, & create credit note for sum of each group aggregation
	 * amount
	 *
	 */
	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		Map<String, CreditNoteIndvCreateDto> cpgGrps = new HashMap<>();
		if (paymentDetails == null || CollectionUtils.isEmpty(paymentDetails))
			return new HashMap<>();

		paymentDetails.forEach(payment -> {
			String cpg = payment.getBankName();

			CreditNoteIndvCreateDto cnDto = cpgGrps.get(cpg);
			
			// if null, new group set, else add to existing
			cnDto = cnDto == null ? new CreditNoteIndvCreateDto(BigDecimal.ZERO, BigDecimal.ZERO) : cnDto;

			cnDto.setAmount(cnDto.getAmount().add(payment.getAmount()));
			if (payment.getCashCollected() != null) {
				cnDto.setCashCollected(cnDto.getCashCollected().add(payment.getCashCollected()));
			}
			cnDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", paymentUtil.getPaymentDetailsForCNGeneration(List.of(payment), null)));
			cpgGrps.put(cpg, cnDto);
		});

		return paymentUtil.createCN(cnType, new ArrayList<>(cpgGrps.values()), salesTxn, cancel, docDate, null);
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	private void cashLimitCheck(PaymentDetailsDaoExt paymentDetailsDao) {
		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				CommonUtil.getLocationCode(), null);
//		Calendar cal1 = Calendar.getInstance();
//		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		BigDecimal totalCashPaid = BigDecimal.ZERO;

		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.getCashCollectedByTransactionIdAndPaymentCodes(paymentDetailsDao.getSalesTxnDao().getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), CommonUtil.getLocationCode(), null);
		
	    CashPaymentDetailsDto cashPaymentDetails = paymentUtil.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
	    totalCashPaid=totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
	    totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());

		
		// total cash paid of current QCGc payment cannot be taken as we will not have
		// that detail at the time of addition of payment. It will be picked from
		// customer_payment table if exists after below cashLimitCheck call.

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(paymentDetailsDao.getAmount(),
				null, totalCashPaid, totalPmlaCashAmount);
		instrumentCashAmountDto = customerPaymentService.cashLimitCheck(instrumentCashAmountDto,
				PaymentCodeEnum.QCGC.getPaymentcode(), paymentDetailsDao.getInstrumentNo(),
				paymentDetailsDao.getSalesTxnDao(), paymentDetailsDao.getSalesTxnDao().getCustomerId(), false);

		if (instrumentCashAmountDto != null && instrumentCashAmountDto.getPaymentDate() != null) {
			paymentDetailsDao.setInstrumentDate(instrumentCashAmountDto.getPaymentDate());
			// store cash element to cash collected
			paymentDetailsDao.setCashCollected(instrumentCashAmountDto.getTotalPaidAmount());
			log.info("instrumentCashAmountDto {}",instrumentCashAmountDto);
			if(instrumentCashAmountDto.getCustomerIdentifier1()!=null && instrumentCashAmountDto.getCustomerType() !=null) {
				Integer qcgcCustomerId=null;
				if(CustomerTypeEnum.REGULAR.name().equals(instrumentCashAmountDto.getCustomerType())) {
					qcgcCustomerId=customerService.searchCustomerWithoutUlpUpdate(SearchTypeEnum.MOBILE_NO,
						  instrumentCashAmountDto.getCustomerIdentifier1(),false);
			    }else if (CustomerTypeEnum.INSTITUTIONAL.name().equals(instrumentCashAmountDto.getCustomerType())) {
			    	qcgcCustomerId=customerService.searchCustomerWithoutUlpUpdate(SearchTypeEnum.INSTITUTIONAL_TAX_NO,
							  instrumentCashAmountDto.getCustomerIdentifier1(),false);
				}else if (CustomerTypeEnum.INTERNATIONAL.name().equals(instrumentCashAmountDto.getCustomerType())) {
			    	qcgcCustomerId=customerService.searchCustomerWithoutUlpUpdate(SearchTypeEnum.PASSPORT_ID,
							  instrumentCashAmountDto.getCustomerIdentifier1(),false);
				}
				log.info("qcgcCustomerId {}",qcgcCustomerId);
				if(qcgcCustomerId !=null) {
					QwickcilverGCOtherDetailsDto qwickcilverGCOtherDetailsDto = getOtherDetails(paymentDetailsDao.getOtherDetails());
					qwickcilverGCOtherDetailsDto.setQcgcOwnerId(qcgcCustomerId);
				    paymentDetailsDao.setOtherDetails(MapperUtil
							.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), qwickcilverGCOtherDetailsDto)));
				}
			}
			
		}

	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

	}
}
