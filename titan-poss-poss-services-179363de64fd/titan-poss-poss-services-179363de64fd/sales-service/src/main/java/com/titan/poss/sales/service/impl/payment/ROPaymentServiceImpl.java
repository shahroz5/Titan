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
import org.springframework.util.StringUtils;

import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentRequestEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.ROOtherDetailsDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.ROPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.PaymentRequestService;
import com.titan.poss.sales.service.ROPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for RO Payment implementation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesROPaymentService")
public class ROPaymentServiceImpl implements ROPaymentService {

	public ROPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.RO_PAYMENT.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;

	@Autowired
	private PaymentRequestService paymentRequestService;

	@Autowired
	private CommonPaymentService paymentUtil;

	private static final String ERR_SALE_098 = "ERR-SALE-098";
	private static final String REQUEST_IS_NOT_APPROVED = "Request is not approved.";

	/**
	 * This method will validate input fields of payment create dto.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		ROPaymentFieldsDto rOPaymentFieldsDto = (ROPaymentFieldsDto) MapperUtil.getDtoMapping(paymentCreateDto,
				ROPaymentFieldsDto.class);
		// validate fields
		rOPaymentFieldsDto.validateFields(rOPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.COMPLETED.name());
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {
		// RO payment request check, amount check.
		PaymentRequestsDao paymentRequestDao = paymentRequestsRepository
				.findOneByIdAndLocationCode(paymentDetailsDao.getReference2(), CommonUtil.getLocationCode());

		if (StringUtils.isEmpty(paymentRequestDao)) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Please provide valid reference");
		}

		// check payment request details.
		checkPaymentRequestApproval(paymentCode, paymentRequestDao, paymentDetailsDao);

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode); // RO PAYMENT

		// if reference id exists in paymentRequestDao then, workflowApproval
		// else, manual approval.
		ROOtherDetailsDto roOtherDetails = new ROOtherDetailsDto(
				paymentRequestDao.getReferenceId() == null ? Boolean.FALSE : Boolean.TRUE, null);

		// set other details
		paymentDetailsDao.setOtherDetails(MapperUtil.getStringFromJson(new JsonData(paymentCode, roOtherDetails)));

		// update status & utilized amount & save payment request(calling through
		// service as it involves datasync)
		paymentRequestService.closePendingPayment(paymentRequestDao.getId(), paymentDetailsDao.getAmount(), false,
				null);

		return Map.of(paymentDetailsDao, new ArrayList<>());
	}

	private void checkPaymentRequestApproval(String paymentCode, PaymentRequestsDao paymentRequestDao,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// check payment code
		if (!paymentCode.equals(paymentRequestDao.getPaymentCode())) {
			throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
					"Expected payment for: " + paymentCode + " found: " + paymentRequestDao.getPaymentCode());
		}

		// check status
		if (!PaymentRequestEnum.APPROVED.name().equals(paymentRequestDao.getStatus())) {
			throw new ServiceException(REQUEST_IS_NOT_APPROVED, ERR_SALE_098, "Payment request status should be: "
					+ PaymentRequestEnum.APPROVED.name() + ", found: " + paymentRequestDao.getStatus());
		}

		// check customer
		Integer customerId = paymentDetailsDao.getSalesTxnDao().getCustomerId();
		if (!paymentRequestDao.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId()
				.equals(customerId)) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_USED_FOR_OTHER_CUSTOMER,
					SalesConstants.ERR_SALE_091, "RO payment cannot be used for other customers");
		}

		// check amount - cannot be greater than approved amount
		if (paymentDetailsDao.getAmount().compareTo(paymentRequestDao.getAmount()) > 0) {
			throw new ServiceException(SalesConstants.AMOUNT_IS_NOT_IN_RANGE, SalesConstants.ERR_SALE_026,
					"Input amount exceeds RO payment amount");
		}

		// reference id check if exists
		if (!StringUtils.isEmpty(paymentRequestDao.getReferenceId())
				&& !paymentRequestDao.getReferenceId().equals(paymentDetailsDao.getReference1())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid value for field reference 1");
		}

		// payer bank check - approved by
		if (!paymentDetailsDao.getBankName().equals(paymentRequestDao.getApprovedBy())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid value for approved approved by");
		}

		// check requested date - requests should not be used after configured time

		// check approved date - Active RO Approved payment: - from location

	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// No location check for RO payment.
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

		// return if payment status is not 'COMPLETED'
		if (!PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			return;
		}

		// detach from payments and use again.
		PaymentRequestsDao paymentRequestDao = paymentRequestsRepository
				.findOneByIdAndLocationCode(paymentDetailsDao.getReference2(), CommonUtil.getLocationCode());

		if (StringUtils.isEmpty(paymentRequestDao)) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"Invalid value at reference2 field");
		}

		// reset status and Utilized amount of payment request.(calling through
		// service as it involves datasync)
		paymentRequestService.reversePayment(paymentRequestDao);

		// set payment status to 'REVERSED'
		paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());

		paymentDetailsRepository.save(paymentDetailsDao);
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
		// No trigger payment for RO
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
		// Validation of payment is not required for RO
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

		return paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, true, docDate);
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
