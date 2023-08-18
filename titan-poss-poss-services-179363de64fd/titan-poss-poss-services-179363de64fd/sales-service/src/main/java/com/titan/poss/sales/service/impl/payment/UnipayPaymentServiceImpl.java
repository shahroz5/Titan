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

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.PaymentAuditDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.JsonUtils;
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
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.request.UnipayOtherDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.UnipayPaymentAddFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.UnipayPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for Unipay payment implementation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesUnipayPaymentService")
public class UnipayPaymentServiceImpl implements UnipayPaymentService {

	public UnipayPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.UNIPAY.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private CreditNoteService creditNoteService;

	/**
	 * This method will validate input fields of payment create dto.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		UnipayPaymentAddFieldsDto unipayPaymentAddFieldsDto = new UnipayPaymentAddFieldsDto();
		unipayPaymentAddFieldsDto.setAmount(paymentCreateDto.getAmount());

		unipayPaymentAddFieldsDto.validateFields(unipayPaymentAddFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// Enable UNIPAY in location master
		// check isEnableUnipayForIntegration is false, if yes then UNIPAY payment is
		// not allowed -- removed. UAT defect 3513

		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// UNIPAY host name mapping check
		paymentUtil.hostNameMappingCheck(paymentCode, false);

		// As per story: NAP-2321
		// set instrument type
		paymentDetailsDao.setInstrumentType("CC");

		// set banName same as payment code
		paymentDetailsDao.setBankName(paymentCode);

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

		// amount check?, audit details, reference1 - bankInvoiceNumber.

		// validate fields - don't(as it's payment would have already happened through
		// third party, throwing error is not right)

		validateUnipayOtherDetails(paymentUpdateDto.getOtherDetails(), status, paymentDetailsDao.getId(),
				paymentDetailsDao.getSalesTxnDao().getId());

		SalesPaymentDto paymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(paymentUpdateDto,
				SalesPaymentDto.class);
		paymentDto.setStatus(status);

		return paymentDto;
	}

	private void validateUnipayOtherDetails(JsonData otherDetails, String status, String paymentId, String salesTxnId) {

		UnipayOtherDetailsDto unipayOtherDetails = null;
		unipayOtherDetails = MapperUtil.mapObjToClass(otherDetails.getData(), UnipayOtherDetailsDto.class);

		PaymentAuditDto cardPaymentAuditDto = MapperUtil.mapObjToClass(unipayOtherDetails, PaymentAuditDto.class);

		cardPaymentAuditDto.setTransactionType(status);
		cardPaymentAuditDto.setInvoiceNumber(salesTxnId);
		cardPaymentAuditDto.setPaymentId(paymentId);
		cardPaymentAuditDto.setRequest(MapperUtil.getStringFromJson(unipayOtherDetails.getRequest()));
		cardPaymentAuditDto.setResponse(MapperUtil.getStringFromJson(unipayOtherDetails.getResponse()));

		integrationService.savePaymentCardAuditData(VendorCodeEnum.PAYMENT_UNIPAY.name(), cardPaymentAuditDto);

	}

	/**
	 * This method will void transactions based payment id
	 * 
	 * @param paymentDetailsDao
	 */
	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		// if COMPLETED then REVERSE, else DELETED
		paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);

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
		// No trigger implementation - Unipay
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
		// Valiadte payment no required in Unipay
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

		// looping on each payment
		for (PaymentDetailsDaoExt payment : paymentDetails) {

			// if payment is voided, then no need to generate CN
			if (BooleanUtils.isTrue(payment.getIsVoid())) {
				continue;
			}

			// Creating CreditNoteIndvCreateDto and setting attributes
			CreditNoteIndvCreateDto creditNoteIndvCreateDto = new CreditNoteIndvCreateDto();
			creditNoteIndvCreateDto.setCreditNoteType(cnType.toString());
			creditNoteIndvCreateDto.setAmount(payment.getAmount());
			creditNoteIndvCreateDto.setRemarks(payment.getPaymentCode() + " payment reversed.");
			creditNoteIndvCreateDto.setCashCollected(payment.getCashCollected());

			// creating CNPaymentDetailsDto object to set HostName and Unipay ID
			CNPaymentDetailsDto cnPayment = new CNPaymentDetailsDto();
			JsonData jsonData = MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class);
			Object response = JsonUtils.getValueFromJson(jsonData.getData(), "response", Object.class);
			cnPayment.setUnipayID(JsonUtils.getValueFromJson(response, "utid", String.class));
			cnPayment.setHostname(payment.getHostName());
			cnPayment.setPaymentId(payment.getId());
			cnPayment.setBankInvoiceNo(JsonUtils.getValueFromJson(response, "bankInvoiceNumber", String.class));
			cnPayment.setTxnDate(JsonUtils.getValueFromJson(response, "txnDate", String.class));
			cnPayment.setBankName(JsonUtils.getValueFromJson(response, "acquirerBank", String.class));
			
			log.info("cnPayment DTO ........................................{}", cnPayment);
			// Map of PaymentCode and InstrumentType
			Map<String, String> payments = new HashMap<>();
			payments.put(payment.getPaymentCode(), payment.getInstrumentType());
			cnPayment.setPaymentCodes(payments);
			if (payment.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.UNIPAY.name())) {
				creditNoteIndvCreateDto.setIsUnipay(true);
			}

			// Setting payment Details for creditNoteIndvCreateDto Obj
			creditNoteIndvCreateDto.setPaymentDetails(new JsonData("CN_PAYMENT_DETAILS", cnPayment));
			CreditNoteCreateDto cnDto = new CreditNoteCreateDto();
			cnDto.setSalesTxn(salesTxn);
			cnDto.setCancelTxn(cancel);// for bill cancellation
			cnDto.setCNIndividual(List.of(creditNoteIndvCreateDto));
			cnDto.setCustomerId(payment.getSalesTxnDao().getCustomerId());
			cnDto.setDocDate(docDate);
			List<CreditNoteResponse> cnListResponse = creditNoteService.createNewCreditNote(cnDto);
			cnDocs.put(cnListResponse.get(0).getId(), cnListResponse.get(0).getDocNo());
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
