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

import com.titan.poss.core.enums.CNType;
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
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.CashPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CashPaymentService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesCashPaymentService")
public class CashPaymentServiceImpl implements CashPaymentService {

	public CashPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.CASH.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private BusinessDayService businessDayService;

	/**
	 * This method will validate input fields of payment create dto.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {

		// if other fields except amount are given, then should throw error?
		CashPaymentFieldsDto cashPaymentFieldsDto = (CashPaymentFieldsDto) MapperUtil.getDtoMapping(paymentCreateDto,
				CashPaymentFieldsDto.class);
		cashPaymentFieldsDto.validateFields(cashPaymentFieldsDto);

		// other validations pending

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

		// CASH limit check
		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				CommonUtil.getLocationCode(), null);
//
//		totalCashPaid = totalCashPaid.add(paymentDetailsDao.getAmount());

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

		totalCashPaid = totalCashPaid.add(paymentDetailsDao.getAmount());

		totalPmlaCashAmount = totalPmlaCashAmount.add(paymentDetailsDao.getAmount());

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
				totalCashPaid, totalPmlaCashAmount);
		customerPaymentService.cashLimitCheck(instrumentCashAmountDto, PaymentCodeEnum.CASH.getPaymentcode(), null,
				paymentDetailsDao.getSalesTxnDao(), paymentDetailsDao.getSalesTxnDao().getCustomerId(), false);

		// hard code 'CASH' to instrumentType also
		paymentDetailsDao.setInstrumentType(paymentCode);// CASH

		// set amount to cash collected
		paymentDetailsDao.setCashCollected(paymentDetailsDao.getAmount());

		return Map.of(paymentDetailsDao, new ArrayList<>());
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

		// validate input status - should be 'COMPLETED' only
		if (!PaymentStatusEnum.COMPLETED.name().equals(status)) {
			throw new ServiceException(SalesConstants.INVALID_INPUT_STATUS, SalesConstants.ERR_SALE_036);
		}

		// CASH limit check
		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				CommonUtil.getLocationCode(), null);
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
	    

		// totalCashPaid = (totalCashPaid - paymentDetailsDao.amount) +
		// paymentUpdateDto.amount

		totalCashPaid = totalCashPaid.subtract(paymentDetailsDao.getAmount()).add(paymentUpdateDto.getAmount());
		totalPmlaCashAmount = totalPmlaCashAmount.subtract(paymentDetailsDao.getAmount())
				.add(paymentUpdateDto.getAmount());
		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
				totalCashPaid, totalPmlaCashAmount);
		customerPaymentService.cashLimitCheck(instrumentCashAmountDto, PaymentCodeEnum.CASH.getPaymentcode(), null,
				paymentDetailsDao.getSalesTxnDao(), paymentDetailsDao.getSalesTxnDao().getCustomerId(), false);

		SalesPaymentDto paymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(paymentUpdateDto,
				SalesPaymentDto.class);
		paymentDto.setStatus(status);
		// set amount to cash collected
		paymentDto.setCashCollected(paymentUpdateDto.getAmount());

		return paymentDto;
	}

	/**
	 * This method will void transactions based payment id
	 * 
	 * @param paymentDetailsDao
	 */
	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
		}

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
		// pending
		return paymentDetailsDao;
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

		return null;
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

		if (cancelType == CancellationTypeEnum.CANCEL_WITH_RETURN) {

			paymentUtil.createPaymentReversal(paymentDetails, cancel);
		}

		return new HashMap<>();
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		// CASH limit check
		// get all cash paid for current transaction.
//		BigDecimal totalCashPaid = paymentDetailsRepository.getCashCollectedByTransactionIdAndPaymentCode(
//				salesTxnDao.getId(), PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(),
//				CommonUtil.getLocationCode(), null);
		Calendar cal1 = Calendar.getInstance();
		cal1.setTime(businessDayService.getBusinessDay().getBusinessDate());
		BigDecimal totalCashPaid = BigDecimal.ZERO;

		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepository
				.getCashCollectedByTransactionIdAndPaymentCodes(salesTxnDao.getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), CommonUtil.getLocationCode(), null);
		
		CashPaymentDetailsDto cashPaymentDetails = paymentUtil.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
	    totalCashPaid=totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
	    totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());
		

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
				totalCashPaid, totalPmlaCashAmount);

		instrumentCashAmountDto = customerPaymentService.cashLimitCheck(instrumentCashAmountDto,
				PaymentCodeEnum.CASH.getPaymentcode(), null, salesTxnDao, customerId, true);
		return instrumentCashAmountDto;
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

	}

}
