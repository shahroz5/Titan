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
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.response.JsonData;
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
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.DDPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.DDPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for DD payment
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesDDPaymentService")
public class DDPaymentServiceImpl implements DDPaymentService {

	public DDPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.DD.getPaymentcode(), this);
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
		DDPaymentFieldsDto dDPaymentFieldsDto = (DDPaymentFieldsDto) MapperUtil.getDtoMapping(paymentCreateDto,
				DDPaymentFieldsDto.class);
		// validate fields
		dDPaymentFieldsDto.validateFields(dDPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.COMPLETED.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// date validity validation
		paymentUtil.chequeorDdDateValidation(salesPaymentDto.getInstrumentDate());

		return salesPaymentDto;
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

		// pending: Update in realisation process?

		SalesPaymentDto salesPaymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(paymentUpdateDto,
				SalesPaymentDto.class);
		salesPaymentDto.setStatus(status);
		return salesPaymentDto;

	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// hard code 'DD' to instrumentType also
		paymentDetailsDao.setInstrumentType(paymentCode);// DD

		return Map.of(paymentDetailsDao, new ArrayList<>());
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
		// Payment trigger is no there for DD
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

		paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, false);
		paymentDetailsRepository.save(paymentDetailsDao);

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

	/**
	 * This method will validate payment by paymentDetails and otp.
	 * 
	 * @param paymentDetailsDao
	 * @param otp
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// Payment validate is not there for DD
		return new SalesPaymentDto();
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		// deduct from revenue, reflect on next day banking
		
		Map<String, Integer> cnDocs = new HashMap<>();
		
		if (cancelType == CancellationTypeEnum.CANCEL_WITH_RETURN) {

			//paymentUtil.createPaymentReversal(paymentDetails, cancel);
			Map<String, CreditNoteIndvCreateDto> ddGrps = new HashMap<>();

			paymentDetails.forEach(payment -> {
				String dd = payment.getBankName();

				CreditNoteIndvCreateDto cnDto = ddGrps.get(dd);
				
				// if null, new group set, else add to existing
				cnDto = cnDto == null ? new CreditNoteIndvCreateDto(BigDecimal.ZERO, BigDecimal.ZERO) : cnDto;

				cnDto.setAmount(cnDto.getAmount().add(payment.getAmount()));
				if (payment.getCashCollected() != null) {
					cnDto.setCashCollected(cnDto.getCashCollected().add(payment.getCashCollected()));
				}
				cnDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", paymentUtil.getPaymentDetailsForCNGeneration(List.of(payment), null)));
				ddGrps.put(dd, cnDto);
			});

			cnDocs = paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, false, docDate);
			
		} else if (cancelType == CancellationTypeEnum.CANCEL_WITH_CN) {
			Map<String, CreditNoteIndvCreateDto> ddGrps = new HashMap<>();

			paymentDetails.forEach(payment -> {
				String dd = payment.getBankName();

				CreditNoteIndvCreateDto cnDto = ddGrps.get(dd);
				
				// if null, new group set, else add to existing
				cnDto = cnDto == null ? new CreditNoteIndvCreateDto(BigDecimal.ZERO, BigDecimal.ZERO) : cnDto;

				cnDto.setAmount(cnDto.getAmount().add(payment.getAmount()));
				if (payment.getCashCollected() != null) {
					cnDto.setCashCollected(cnDto.getCashCollected().add(payment.getCashCollected()));
				}
				cnDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", paymentUtil.getPaymentDetailsForCNGeneration(List.of(payment), null)));
				ddGrps.put(dd, cnDto);
			});

			cnDocs = paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, false, docDate);

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
