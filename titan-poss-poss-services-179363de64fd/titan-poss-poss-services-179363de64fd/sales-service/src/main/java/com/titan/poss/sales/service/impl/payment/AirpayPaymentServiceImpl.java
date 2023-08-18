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
import com.titan.poss.sales.dto.AirpayOtherDetailsDto;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentRequestOtherDetails;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.AirpayPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentRequestsRepository;
import com.titan.poss.sales.service.AirpayPaymentService;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.PaymentRequestService;

/**
 * Service class for 'AIRPAY' payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesAirpayPaymentService")
public class AirpayPaymentServiceImpl implements AirpayPaymentService {

	public AirpayPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.AIRPAY.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private PaymentRequestsRepository paymentRequestsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private PaymentRequestService paymentRequestService;

	@Autowired
	private BusinessDayService businessDayService;

	/**
	 * This method will validate input fields of payment create DTO.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {

		AirpayPaymentFieldsDto airpayPaymentFieldsDto = (AirpayPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, AirpayPaymentFieldsDto.class);
		// validate fields
		airpayPaymentFieldsDto.validateFields(airpayPaymentFieldsDto);

		// validate otherDetails json
		AirpayOtherDetailsDto airpayOtherDetailsDto = getAirPayOtherDetails(paymentCreateDto.getOtherDetails());
		airpayOtherDetailsDto.validateFields(airpayOtherDetailsDto);

		// removed check for offline AIRPAY: PLEASE_PROVIDE_REFERENCE1, ERR_SALE_028
		SalesPaymentDto salesPaymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(paymentCreateDto,
				SalesPaymentDto.class);
		salesPaymentDto.setOtherDetails(paymentCreateDto.getOtherDetails());
		salesPaymentDto.setStatus(PaymentStatusEnum.COMPLETED.name());

		return salesPaymentDto;
	}

	/**
	 * This method will validate location config details for the given payment code,
	 * payment group and input fields.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param salesPaymentDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// validations - Location enable check: Enable Airpay should be checked in the
		// location master. This would mean that the location is authorized to use
		// Airpay as a payment option with integration or else it will be without
		// integration

		// Location check moved to payments, due to UAT defect 2082 as the requirement
		// cannot be validated in two separate functions.

		return salesPaymentDto;

	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {
		AirpayOtherDetailsDto airpayOtherDetails = getAirPayOtherDetails(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));

		// check payment request table for validations.
		PaymentRequestsDao paymentRequestDao = paymentUtil.checkPaymentRequest(paymentDetailsDao,
				airpayOtherDetails.getPaymentRequestId());

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode);// AIRPAY

		// added to use on deletion
		if (paymentDetailsDao.getInstrumentDate() == null) {
			paymentDetailsDao.setInstrumentDate(businessDayService.getBusinessDay().getBusinessDate());
		}

		// concatenate 'reference1, reference2 and reference3' with '-' and paymentCode
		// & add to bankName (based on online and offline scenarios) - done in
		PaymentRequestOtherDetails paymentRequestOtherDetails = paymentRequestService
				.getOtherDetails(paymentRequestDao.getOtherDetails());
		paymentDetailsDao.setReference1(paymentRequestOtherDetails.getReference1());// vendor ref id (if payment is
																					// triggered)
		if (paymentRequestDao.getReferenceId() == null) {
			paymentDetailsDao.setReference2(paymentRequestOtherDetails.getReference2());
			paymentDetailsDao.setReference3(paymentRequestOtherDetails.getReference3());
		} else {
			paymentDetailsDao.setInstrumentNo(paymentRequestOtherDetails.getReference1());// vendor ref id
			paymentDetailsDao.setReference2(paymentRequestDao.getReferenceId());// Airpay transaction id
		}

		// this will set bankName for AIRPAY without integration
		// if reference id exists, the it's an online payment.
		paymentUtil.setBankNameForAirpayOrRazorPay(paymentDetailsDao, paymentRequestDao.getReferenceId() != null);

		// update payment request table.(calling through service as it involves
		// datasync)
		paymentRequestService.closePendingPayment(paymentRequestDao.getId(), paymentDetailsDao.getAmount(), false,
				null);

		return Map.of(paymentDetailsDao, new ArrayList<>());
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

		return paymentDetailsDao;
	}

	private AirpayOtherDetailsDto getAirPayOtherDetails(JsonData otherDetails) {

		return MapperUtil.mapObjToClass(otherDetails.getData(), AirpayOtherDetailsDto.class);
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

		return mapPaymentDaoToDto(paymentDetailsDao);
	}

	/**
	 * This method will void transactions based payment id
	 * 
	 * @param paymentDetailsDao
	 */
	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		// paymentDetailsDao =
		// paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);
		AirpayOtherDetailsDto airpayOtherDetails = getAirPayOtherDetails(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));
		// check payment request table for validations.
		PaymentRequestsDao paymentRequestDao = paymentRequestsRepository
				.findOneByIdAndLocationCode(airpayOtherDetails.getPaymentRequestId(), CommonUtil.getStoreCode());
		/*
		 * PaymentRequestsDao paymentRequestDao =
		 * paymentUtil.checkPaymentRequest(paymentDetailsDao,
		 * airpayOtherDetails.getPaymentRequestId());
		 */
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

	/**
	 * This method will validate payment by paymentDetails and otp.
	 * 
	 * @param paymentDetailsDao
	 * @param otp
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {

		return mapPaymentDaoToDto(paymentDetailsDao);
	}

	private SalesPaymentDto mapPaymentDaoToDto(PaymentDetailsDaoExt paymentDetailsDao) {
		SalesPaymentDto salesPaymentDto = (SalesPaymentDto) MapperUtil.getObjectMapping(paymentDetailsDao,
				new SalesPaymentDto());

		if (!StringUtils.isEmpty(paymentDetailsDao.getOtherDetails())) {
			salesPaymentDto
					.setOtherDetails(MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));
		}

		return salesPaymentDto;
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

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		AirpayOtherDetailsDto airpayOtherDetails = getAirPayOtherDetails(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());

		if (airpayOtherDetails.getPaymentRequestId() != null) {
			PaymentRequestsDao paymentRequestDao = paymentRequestsRepository
					.findOneByIdAndLocationCode(airpayOtherDetails.getPaymentRequestId(), CommonUtil.getStoreCode());
			// reverse only if it's payment with integration
			if (paymentRequestDao.getReferenceId() != null)
				paymentRequestService.reversePayment(paymentRequestDao);
		}

		paymentDetailsRepository.save(paymentDetailsDao);

	}

}
