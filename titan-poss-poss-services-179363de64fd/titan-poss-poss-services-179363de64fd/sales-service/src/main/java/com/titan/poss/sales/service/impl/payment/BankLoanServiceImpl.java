/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
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
import com.titan.poss.sales.dto.validators.BankLoanPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.BankLoanService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for Bank Loan as Payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesBankLoanService")
public class BankLoanServiceImpl implements BankLoanService {

	public BankLoanServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.BANK_LOAN.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		BankLoanPaymentFieldsDto bankLoanPaymentFieldsDto = (BankLoanPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, BankLoanPaymentFieldsDto.class);
		// validate fields
		bankLoanPaymentFieldsDto.validateFields(bankLoanPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.COMPLETED.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// no location check
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// instrument no validation
		if (!paymentCode.equals(paymentDetailsDao.getInstrumentNo())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid instrument no: " + paymentDetailsDao.getInstrumentNo());
		}

		// payer bank validation?

		// set instrumentType same as paymentGroup
		paymentDetailsDao.setInstrumentType(paymentGroup); // BANK_LOAN

		// set bank name as 'paymentCode - reference 1'
		paymentDetailsDao.setBankName(paymentCode + " - " + paymentDetailsDao.getReference1());

		return Map.of(paymentDetailsDao, new ArrayList<>());
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// Trigger payment not required for Bank Loan
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// Validation of Bank Loan payment - not required
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// update payment for bank loan - required?
		return null;
	}

	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, false);
		paymentDetailsRepository.save(paymentDetailsDao);

	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {
		// confirm payment not required for Bank Loan
		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		return paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, false, docDate);
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
