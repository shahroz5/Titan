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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
import com.titan.poss.sales.dto.validators.WalletPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.WalletPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesWalletPaymentService")
public class WalletPaymentServiceImpl implements WalletPaymentService {

	public WalletPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.WALLET.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	/**
	 * This method will validate input fields of payment create dto.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		WalletPaymentFieldsDto walletPaymentFieldsDto = (WalletPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, WalletPaymentFieldsDto.class);
		// validate fields
		walletPaymentFieldsDto.validateFields(walletPaymentFieldsDto);

		// status change in update is required?
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

		// instrument type validation
		if (!paymentGroup.equals(paymentDetailsDao.getInstrumentType())) {
			throw new ServiceException(SalesConstants.INVALID_INSTRUMENT_TYPE, SalesConstants.ERR_SALE_019,
					"Invalid instrument type '" + paymentDetailsDao.getInstrumentType() + "' for " + paymentCode
							+ " payment.");
		}

		// instrument no. validation
		if (!paymentCode.equals(paymentDetailsDao.getInstrumentNo())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048, Map.of("fieldName",
					"instrumentNo", "expected", paymentCode, "found", paymentDetailsDao.getInstrumentNo()), null);

		}

		// NAP-2326:
		// concatenate 'instrumentNo' and 'reference1' with '-' & add to bankName
		paymentDetailsDao.setBankName(
				StringUtils.isEmpty(paymentDetailsDao.getReference1()) ? paymentDetailsDao.getInstrumentNo()
						: paymentDetailsDao.getInstrumentNo() + "-" + paymentDetailsDao.getReference1());

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

		paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, false);
		paymentDetailsRepository.save(paymentDetailsDao);
	}

	/**
	 * This method will trigger payment.
	 * 
	 * @param paymentDetailsDao
	 * @param paymentCreateDto
	 * @return PaymentDetailsDao
	 */
	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// Trigger payment not required for Wallet
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
		// Validation of Wallet payment - not required
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

		Map<String, Integer> cnDocs = new HashMap<>();

		if (cancelType == CancellationTypeEnum.CANCEL_WITH_RETURN
				|| cancelType == CancellationTypeEnum.CANCEL_WITH_CN) {
			cnDocs = paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, true, docDate);
		}

		return cnDocs;
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
