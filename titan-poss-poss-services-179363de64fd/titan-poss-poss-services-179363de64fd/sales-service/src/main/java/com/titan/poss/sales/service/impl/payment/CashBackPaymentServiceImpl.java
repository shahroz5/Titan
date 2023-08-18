/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.CashbackOfferRequestDto;
import com.titan.poss.core.dto.CashbackValueResponseDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
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
import com.titan.poss.sales.dto.response.CashbackOtherDetailsDto;
import com.titan.poss.sales.dto.response.CashbackUtilizedDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.RedeemTypeAndProductGroupListDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.CashbackPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CashBackPaymentService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.PaymentEpossService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for CASHBACK payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesCashBackPaymentService")
public class CashBackPaymentServiceImpl implements CashBackPaymentService {

	public CashBackPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.CASHBACK.getPaymentcode(), this);
	}

	@Autowired
	private EngineService engineService;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private PaymentEpossService paymentEpossService;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		CashbackPaymentFieldsDto cashbackPaymentFieldsDto = (CashbackPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, CashbackPaymentFieldsDto.class);
		// validate fields
		cashbackPaymentFieldsDto.validateFields(cashbackPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.COMPLETED.name());

	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// no location check in CASHBACK payment
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// as per NAP-2336, cashback not allowed in AB or CO
		if (!TransactionTypeEnum.CM.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())) {
			throw new ServiceException(SalesConstants.DYNAMIC_DISCOUN_TYPE_NOT_ALLOWED_IN_DYNAMIC_TRANSACTION_TYPE,
					SalesConstants.ERR_DISC_004,
					"Cashback allowed in Cash memo only. But tired to access in "
							+ paymentDetailsDao.getSalesTxnDao().getTxnType(),
					Map.of(SalesConstants.DISCOUNT_TYPE, paymentCode, "transactionType",
							paymentDetailsDao.getSalesTxnDao().getTxnType()));
		}

		// if CASHBACK payment is already added to current txn, the do not allow
		// payment.
		List<PaymentDetailsDaoExt> cashBackPaymentList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
						paymentDetailsDao.getSalesTxnDao().getId(), paymentCode, paymentGroup, null,
						CommonUtil.getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));

		if (!CollectionUtil.isEmpty(cashBackPaymentList)) {
			throw new ServiceException(SalesConstants.MAX_LIMIT_REACHED_FOR_CURRENT_PAYMENT_TYPE,
					SalesConstants.ERR_SALE_164,
					"Max limit has reached for payment code '" + paymentCode + "' in current transaction.");
		}

		// verify cash back details
		verifyCashBackDetails(dueAmount, totalTxnAmount, paymentDetailsDao);

		// check for product group mapping based on offer id(reference 1)
		RedeemTypeAndProductGroupListDto redeemTypeAndProductGroupListDto = paymentUtil
				.productGroupCodeCheckForPayement(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnType(), paymentCode, null, paymentDetailsDao.getReference1());
		// check amount
		List<PaymentItemMappingDaoExt> paymentItemMapList = paymentUtil.amountCheckForPayment(
				redeemTypeAndProductGroupListDto.getValidAmount(), paymentDetailsDao.getAmount(), paymentDetailsDao,
				redeemTypeAndProductGroupListDto.getItemValueAndPgcDetails());

		// set product group codes in other details
		CashbackOtherDetailsDto cashbackOtherDetailsDto = getCashbackOtherDetails(paymentDetailsDao.getOtherDetails());
		cashbackOtherDetailsDto.setProductGroups(redeemTypeAndProductGroupListDto.getProductGroups());
		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), cashbackOtherDetailsDto)));

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode);// CASHBACK

		// set instrument hash to check cashback utilization
		String decryptedCardNo = CryptoUtil.asymmetricDecrypt(paymentDetailsDao.getInstrumentNo(), "instrumentNo",
				false);
		String hashedCardNo = CryptoUtil.getMd5(decryptedCardNo);// hashed instrumentNo
		paymentDetailsDao.setInstrumentHash(hashedCardNo);

		// set masked instrumentNo -- removed in NAP-2336
		paymentDetailsDao.setInstrumentNo(null);

		return Map.of(paymentDetailsDao, paymentItemMapList);
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// no trigger payment in CASHBACK
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// No validate payment in CASHBACK
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// No Update payment in CASHBACK
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
		// No confirm payment in CASHBACK
		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		// refer: NAP-3838
		if (cancelType == CancellationTypeEnum.CANCEL_WITH_RETURN) {
			paymentUtil.createPaymentReversal(paymentDetails, cancel);
		}

		// refer: NAP-2023
		// TODO: If 'cancel with CN', then separate CN should be created for that CARD
		// with Cashback details.
		return Collections.emptyMap();
	}

	private void verifyCashBackDetails(BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		BigDecimal swipeAmount = BigDecimal.valueOf(Long.valueOf(paymentDetailsDao.getReference2()));

		// validate offer id and get details:
		CashbackOfferRequestDto cashbackOfferRequestDto = new CashbackOfferRequestDto();
		cashbackOfferRequestDto.setCardNumber(paymentDetailsDao.getInstrumentNo());
		cashbackOfferRequestDto.setBankName(paymentDetailsDao.getBankName());
		cashbackOfferRequestDto.setSwipeAmount(swipeAmount);
		cashbackOfferRequestDto.setInvoiceAmount(totalTxnAmount);

		// get discount amount - with offer Id(reference 1)
		CashbackValueResponseDto cashbackValueResponseDto = engineService
				.getCashbackValue(paymentDetailsDao.getReference1(), cashbackOfferRequestDto);

		// check - discount amount != that input amount, if true throw error
		if (paymentDetailsDao.getAmount().compareTo(cashbackValueResponseDto.getDiscountValue()) != 0) {
			throw new ServiceException(SalesConstants.AMOUNT_IS_NOT_IN_RANGE, SalesConstants.ERR_SALE_026,
					"Input amount is not in range.");
		}

		// amount check - (swipe amount(reference 2) + discount amount) should not be
		// greater than dueAmount
		if ((paymentDetailsDao.getAmount().add(swipeAmount)).compareTo(dueAmount) > 0) {
			throw new ServiceException(SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER,
					SalesConstants.ERR_SALE_030, "Payment (amount + swipeAmount) exceeds due amount.");
		}

		// check - isExcludeCashback, if false, cannot use CASHBACK as payment.
		if (!BooleanUtils.isTrue(cashbackValueResponseDto.getIsExcludeCashback())) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_088,
					"Cashback cannot be used as 'isExcludeCashback' is "
							+ cashbackValueResponseDto.getIsExcludeCashback(),
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
		}

		// check - payer_bank_name and bank name in response should be same.
		if (!paymentDetailsDao.getBankName().equals(cashbackValueResponseDto.getBankName())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Payer Bank Name is invalid.");
		}

		// check number of times the card is used.
		CashbackUtilizedDto cashbackUtilizedDto = paymentEpossService
				.getCashbackUtilized(paymentDetailsDao.getInstrumentNo(), paymentDetailsDao.getReference1());
		if (cashbackUtilizedDto.getUsageCount() >= cashbackValueResponseDto.getMaxUsageCount()) {
			throw new ServiceException(SalesConstants.MAX_LIMIT_REACHED_FOR_CURRENT_PAYMENT_TYPE,
					SalesConstants.ERR_SALE_164, "Max limit has reached for the offer ");
		}

		CashbackOtherDetailsDto cashbackOtherDetailsDto = (CashbackOtherDetailsDto) MapperUtil
				.getDtoMapping(cashbackValueResponseDto, CashbackOtherDetailsDto.class);

		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), cashbackOtherDetailsDto)));

	}

	private CashbackOtherDetailsDto getCashbackOtherDetails(String otherDetails) {
		JsonData jsonData = MapperUtil.mapObjToClass(otherDetails, JsonData.class);
		return MapperUtil.mapObjToClass(jsonData.getData(), CashbackOtherDetailsDto.class);
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
