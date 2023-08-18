/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.dto.PayerBankDto;
import com.titan.poss.core.dto.PaymentDetails;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.CardPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CardPaymentService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for card payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesCardPaymentService")
public class CardPaymentServiceImpl implements CardPaymentService {

	public CardPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.CARD.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonPaymentService paymentUtil;

	private static final String ERR_SALE_017 = "ERR-SALE-017";
	private static final String PAYEE_BANK_IS_NOT_REGISTERED = "Payee bank is not registered.";

	private static final String ERR_SALE_056 = "ERR-SALE-056";
	private static final String PLEASE_PROVIDE_PAYER_BANK = "Please provide payer bank.";

	private static final String ERR_SALE_057 = "ERR-SALE-057";
	private static final String PLEASE_PROVIDE_INSTRUMENT_TYPE = "Please provide instrument type.";

	private static final List<String> INSTRUMENT_TYPE = List.of("CC", "DC", "PC");

	/**
	 * This method will validate input fields of payment create DTO.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		CardPaymentFieldsDto cardPaymentFieldsDto = (CardPaymentFieldsDto) MapperUtil.getDtoMapping(paymentCreateDto,
				CardPaymentFieldsDto.class);
		// validate fields
		cardPaymentFieldsDto.validateFields(cardPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.COMPLETED.name());

	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// location check?
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// check card bank(reference1) and insrtumentType
		checkPayerBankAndInstrumentType(paymentCode, paymentDetailsDao);

		// payee Bank validation
		payeeBankValidation(paymentCode, paymentDetailsDao.getBankName());

		return Map.of(paymentDetailsDao, new ArrayList<>());
	}

	private void checkPayerBankAndInstrumentType(String paymentCode, PaymentDetailsDaoExt paymentDetailsDao) {

		PayerBankDto payerBankDto = engineService.getPayerBankDetails(paymentCode);

		if (StringUtils.isEmpty(payerBankDto.getPaymentDetails())) {
			return;
		}

		PaymentDetails paymentDetails = (PaymentDetails) MapperUtil.getObjectMapping(payerBankDto.getPaymentDetails(),
				new PaymentDetails());

		// Card bank name(reference1)
		if (BooleanUtils.isTrue(paymentDetails.getIsBankMandatory())
				&& StringUtils.isEmpty(paymentDetailsDao.getReference1())) {
			throw new ServiceException(PLEASE_PROVIDE_PAYER_BANK, ERR_SALE_056, "Please provide payer bank name.");
		}
		if (BooleanUtils.isTrue(paymentDetails.getIsCardMandatory())
				&& StringUtils.isEmpty(paymentDetailsDao.getInstrumentType())) {
			throw new ServiceException(PLEASE_PROVIDE_INSTRUMENT_TYPE, ERR_SALE_057, "Please provide card type.");
		} else if (!StringUtils.isEmpty(paymentDetailsDao.getInstrumentType())
				&& !INSTRUMENT_TYPE.contains(paymentDetailsDao.getInstrumentType().toUpperCase())) {
			// instrumentType validation - ask?
			throw new ServiceException(SalesConstants.INVALID_INSTRUMENT_TYPE, SalesConstants.ERR_SALE_019,
					"Invalid instrument type: " + paymentDetailsDao.getInstrumentType());
		}

	}

	/**
	 * This method validates if selected payee bank is available in current location
	 * or not.
	 * 
	 * @param paymentCode
	 * @param payeeBankName
	 */
	private void payeeBankValidation(String paymentCode, String payeeBankName) {

		ListResponse<String> payeeBankList = engineService.payeeBankList(paymentCode);

		if (payeeBankList.getResults().isEmpty()) {
			throw new ServiceException(PAYEE_BANK_IS_NOT_REGISTERED, ERR_SALE_017,
					"No payee(EDC) bank is registered for the location: " + CommonUtil.getLocationCode());
		}

		if (!payeeBankList.getResults().contains(payeeBankName)) {
			throw new ServiceException(PAYEE_BANK_IS_NOT_REGISTERED, ERR_SALE_017,
					payeeBankName + " is not registered as payee bank at location: " + CommonUtil.getLocationCode());
		}
	}

	/**
	 * This method will validate and update payment details based on payment status
	 * and payment update DTO.
	 * 
	 * @param paymentCode
	 * @param status
	 * @param paymentUpdateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// later
		return null;
	}

	/**
	 * This method will void transactions based payment id
	 * 
	 * @param paymentDetailsDao
	 */
	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		List<PaymentDetailsDaoExt> cashBackPaymentList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
						paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.CASHBACK.getPaymentcode(),
						PaymentGroupEnum.REGULAR.name(), null, CommonUtil.getLocationCode(),
						List.of(PaymentStatusEnum.COMPLETED.name()));

		if (!CollectionUtil.isEmpty(cashBackPaymentList)) {
			// pick first element from the list, as only one valid 'CASHBACK' payment can be
			// present for the transaction.
			PaymentDetailsDaoExt cashBackPayment = cashBackPaymentList.get(0);

			// if payment id is present in any 'CASHBACK' payment in reference3, then
			// restrict payment.
			// in such cases, 'CASHBACK' should be deleted first.
			if (paymentDetailsDao.getId().equalsIgnoreCase(cashBackPayment.getReference3())) {
				throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_DELETED, SalesConstants.ERR_SALE_035,
						" Please delete " + PaymentCodeEnum.CASHBACK.getPaymentcode() + " payment first.");
			}
		}

		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
		}

	}

	/**
	 * This method will trigger payment or attach card payment to respective
	 * 'CASHBACK' payment.
	 * 
	 * @param paymentDetailsDao
	 * @param salesPaymentDto
	 * @return PaymentDetailsDao
	 */
	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {

		List<PaymentDetailsDaoExt> cashBackPaymentList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
						paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.CASHBACK.getPaymentcode(),
						PaymentGroupEnum.REGULAR.name(), null, CommonUtil.getLocationCode(),
						List.of(PaymentStatusEnum.COMPLETED.name()));

		// return if no 'CASHBANK' payment found.
		if (CollectionUtil.isEmpty(cashBackPaymentList)) {
			return paymentDetailsDao;
		}

		// pick first element from the list, as only one valid 'CASHBACK' payment can be
		// present for the transaction.
		PaymentDetailsDaoExt cashBackPaymentDao = cashBackPaymentList.get(0);

		// 'CASHBACK' payment is mapped to other payment reference3, then
		// return.
		if (!StringUtils.isEmpty(cashBackPaymentDao.getReference3())) {
			return paymentDetailsDao;
		}

		// if 'CASHBACK' swipe amount matches 'CARD' payment amount
		// and paymentBankName of both payments are then, save 'CARD' payment id as
		// reference3 in 'CASHBACK' payment.
		BigDecimal swipeAmount = BigDecimal.valueOf(Long.valueOf(cashBackPaymentDao.getReference2()));
		if (cashBackPaymentDao.getBankName().equals(paymentDetailsDao.getReference1())
				&& swipeAmount.compareTo(paymentDetailsDao.getAmount()) == 0) {
			cashBackPaymentDao.setReference3(paymentDetailsDao.getId().toUpperCase());
			paymentDetailsRepository.save(cashBackPaymentDao);
		}

		return paymentDetailsDao;
	}

	/**
	 * This method will validate payment by paymentDetails and OTP.
	 * 
	 * @param paymentDetailsDao
	 * @param otp
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {

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
		// pending
		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		// deduct from revenue, reflect on next day banking
		if (cancelType == CancellationTypeEnum.CANCEL_WITH_RETURN) {

			paymentUtil.createPaymentReversal(paymentDetails, cancel);
		}

		return new HashMap<>();
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

	}

}
