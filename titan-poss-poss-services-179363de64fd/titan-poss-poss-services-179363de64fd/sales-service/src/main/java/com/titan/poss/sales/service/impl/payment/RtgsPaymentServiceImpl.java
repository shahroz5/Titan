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
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.RtgsPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.RtgsPaymentService;

/**
 * Service class for RTGS payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesRtgsPaymentService")
public class RtgsPaymentServiceImpl implements RtgsPaymentService {

	public RtgsPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.RTGS.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		RtgsPaymentFieldsDto rtgsPaymentFieldsDto = (com.titan.poss.sales.dto.validators.RtgsPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, RtgsPaymentFieldsDto.class);
		// validate fields
		rtgsPaymentFieldsDto.validateFields(rtgsPaymentFieldsDto);

		SalesPaymentDto paymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(paymentCreateDto,
				SalesPaymentDto.class);
		paymentDto.setStatus(PaymentStatusEnum.COMPLETED.name());

		return paymentDto;
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// min/amount for location defined in NAP-3683? Not used : as told by Adarsh
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {
		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode); // RTGS

		// set bankName
		String bankName = paymentDetailsDao.getReference1();

		String reference2ForBankName = StringUtils.isEmpty(paymentDetailsDao.getReference2()) ? bankName
				: bankName + " - " + paymentDetailsDao.getReference2();
		bankName = StringUtils.isEmpty(bankName) ? paymentDetailsDao.getReference2() : reference2ForBankName;

		String reference3ForBankName = StringUtils.isEmpty(paymentDetailsDao.getReference3()) ? bankName
				: bankName + " - " + paymentDetailsDao.getReference3();
		bankName = StringUtils.isEmpty(bankName) ? paymentDetailsDao.getReference3() : reference3ForBankName;

		// if bankName is not empty, only then set it
		paymentDetailsDao.setBankName(StringUtils.isEmpty(bankName) ? null : bankName);

		return Map.of(paymentDetailsDao, new ArrayList<>());
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// no trigger payment for RTGS
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// no validate payment for RTGS
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// no validate payment for RTGS
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
		// no confirm payment for RTGS
		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		Map<String, Integer> cnDocs = new HashMap<>();

		if (cancelType == CancellationTypeEnum.CANCEL_WITH_RETURN)
			cnDocs = paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, true, docDate);

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
