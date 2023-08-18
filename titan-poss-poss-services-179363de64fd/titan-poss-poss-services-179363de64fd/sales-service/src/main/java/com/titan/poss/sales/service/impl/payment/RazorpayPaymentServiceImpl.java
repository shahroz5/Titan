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
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentRequestOtherDetails;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.RazorpayOtherDetailsDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.RazropayPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.PaymentRequestService;
import com.titan.poss.sales.service.RazorpayPaymentService;

/**
 * Service class for 'RAZOR PAY' payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesRazorpayPaymentService")
public class RazorpayPaymentServiceImpl implements RazorpayPaymentService {

	public RazorpayPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.RAZOR_PAY.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private PaymentRequestService paymentRequestService;

	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {

		RazropayPaymentFieldsDto razorpayPaymentFieldsDto = (RazropayPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, RazropayPaymentFieldsDto.class);
		razorpayPaymentFieldsDto.validateFields(paymentCreateDto);

		// validate otherDetails json
		RazorpayOtherDetailsDto razorpayOtherDetailsDto = getRazorpayOtherDetails(paymentCreateDto.getOtherDetails());
		razorpayOtherDetailsDto.validateFields(razorpayOtherDetailsDto);

		SalesPaymentDto salesPaymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(paymentCreateDto,
				SalesPaymentDto.class);
		salesPaymentDto.setOtherDetails(paymentCreateDto.getOtherDetails());
		salesPaymentDto.setStatus(PaymentStatusEnum.COMPLETED.name());

		return salesPaymentDto;
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {

		// Location check for RAZOR PAY payment: Not there in NAP-7866, but it's raised
		// as defect(UAT_2082) and expecting to have online/offline scenario same as
		// AIRPAY

		// Location check moved to payments, due to UAT defect 2082 as the requirement
		// cannot be validated in two separate functions.

		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		RazorpayOtherDetailsDto razorpayOtherDetails = getRazorpayOtherDetails(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));

		// validate payment requests
		// check payment request table for validations.
		PaymentRequestsDao paymentRequestDao = paymentUtil.checkPaymentRequest(paymentDetailsDao,
				razorpayOtherDetails.getPaymentRequestId());

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode);// RAZOR PAY

		// added to use on deletion
		if (paymentDetailsDao.getInstrumentDate() == null) {
			paymentDetailsDao.setInstrumentDate(businessDayService.getBusinessDay().getBusinessDate());
		}

		PaymentRequestOtherDetails paymentRequestOtherDetails = paymentRequestService
				.getOtherDetails(paymentRequestDao.getOtherDetails());
		paymentDetailsDao.setReference1(paymentRequestOtherDetails.getReference1());// vendor ref id (if payment is
																					// triggered)
		if (paymentRequestDao.getReferenceId() == null) {
			paymentDetailsDao.setReference2(paymentRequestOtherDetails.getReference2());
			paymentDetailsDao.setReference3(paymentRequestOtherDetails.getReference3());
		} else {
			paymentDetailsDao.setInstrumentNo(paymentRequestOtherDetails.getReference1());// vendor ref id
			paymentDetailsDao.setReference2(paymentRequestDao.getReferenceId());// Razorpay transaction id
		}

		// this will set bankName for RAZORPAY without integration
		paymentUtil.setBankNameForAirpayOrRazorPay(paymentDetailsDao, paymentRequestDao.getReferenceId() != null);

		// update payment request table.(calling through service as it involves
		// datasync)
		paymentRequestService.closePendingPayment(paymentRequestDao.getId(), paymentDetailsDao.getAmount(), false,
				null);

		return Map.of(paymentDetailsDao, new ArrayList<>());
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {

		return paymentDetailsDao;
	}

	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {

		return mapPaymentDaotoDto(paymentDetailsDao);

	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {

		return mapPaymentDaotoDto(paymentDetailsDao);
	}

	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {
		RazorpayOtherDetailsDto razorpayOtherDetails = getRazorpayOtherDetails(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));
		// check payment request table for validations.

		/*
		 * PaymentRequestsDao paymentRequestDao =
		 * paymentUtil.checkPaymentRequest(paymentDetailsDao,
		 * razorpayOtherDetails.getPaymentRequestId());
		 */

		PaymentRequestsDao paymentRequestDao = paymentRequestsRepository
				.findOneByIdAndLocationCode(razorpayOtherDetails.getPaymentRequestId(), CommonUtil.getStoreCode());
		// i. if offline or payment without integration, then do not generate CN.
		if (paymentRequestDao.getReferenceId() == null) {
			paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, false);
		}
		// ii. if online or payment with integration, then make the request available
		// again payment_requests table.
		else {
			paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);
			// paymentRequestService.reversePayment(paymentRequestDao);
		}

		paymentDetailsRepository.save(paymentDetailsDao);

	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {
		// confirm payment not required
		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		// payment with or without integration
		return paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, cnType, false, docDate);

	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {

		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	private SalesPaymentDto mapPaymentDaotoDto(PaymentDetailsDaoExt paymentDetailsDao) {
		SalesPaymentDto salesPaymentDto = (SalesPaymentDto) MapperUtil.getObjectMapping(paymentDetailsDao,
				new SalesPaymentDto());

		if (!StringUtils.isEmpty(paymentDetailsDao.getOtherDetails())) {
			salesPaymentDto
					.setOtherDetails(MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));
		}

		return salesPaymentDto;
	}

	private RazorpayOtherDetailsDto getRazorpayOtherDetails(JsonData otherDetails) {

		return MapperUtil.mapObjToClass(otherDetails.getData(), RazorpayOtherDetailsDto.class);
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		RazorpayOtherDetailsDto razorpayOtherDetails = getRazorpayOtherDetails(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());

		if (razorpayOtherDetails.getPaymentRequestId() != null) {
			PaymentRequestsDao paymentRequestDao = paymentRequestsRepository
					.findOneByIdAndLocationCode(razorpayOtherDetails.getPaymentRequestId(), CommonUtil.getStoreCode());
			// reverse only if it's payment with integration
			if (paymentRequestDao.getReferenceId() != null)
				paymentRequestService.reversePayment(paymentRequestDao);
		}

		paymentDetailsRepository.save(paymentDetailsDao);

	}

}
