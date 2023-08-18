/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.GiftCardTypeEnum;
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
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.QwickcilverGCOtherDetailsDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.RedeemTypeAndProductGroupListDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.GhsEVoucherPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.GhsEVoucherPaymentService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for GHS eVoucher payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesGhsEVoucherPaymentService")
public class GhsEVoucherPaymentServiceImpl implements GhsEVoucherPaymentService {

	public GhsEVoucherPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private BusinessDayService businessDayService;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		GhsEVoucherPaymentFieldsDto ghsEVoucherPaymentFieldsDto = (GhsEVoucherPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, GhsEVoucherPaymentFieldsDto.class);
		// validate fields
		ghsEVoucherPaymentFieldsDto.validateFields(ghsEVoucherPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// location check not required
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// check total count of GHS payment done for the current transaction.
		List<PaymentDetailsDaoExt> paymentDetailsDaoList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
						paymentDetailsDao.getSalesTxnDao().getId(), paymentCode, null, null,
						CommonUtil.getLocationCode(), PaymentStatusEnum.getPaidPaymentStatus());

		// check if card is already added
		paymentDetailsDaoList.forEach(paymentDetails -> {
			if (paymentDetailsDao.getInstrumentNo().equals(paymentDetails.getInstrumentNo())) {
				throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_FOR_PAYMENT,
						SalesConstants.ERR_SALE_034,
						"GHS EVOUCHER '" + paymentDetails.getInstrumentNo() + "' is used already used as payment.",
						Map.of(SalesConstants.PAYMENT_CODE, paymentCode));
			}
		});

		BigDecimal voucherBalance = getVoucherBalance(paymentDetailsDao);

		// note: paymentCode is send as GHS_EVOUCHER
		RedeemTypeAndProductGroupListDto redeemTypeAndProductGroupListDto = paymentUtil
				.productGroupCodeCheckForPayement(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnType(), PaymentCodeEnum.GHS_EVOUCHER.getPaymentcode(),
						paymentDetailsDao.getInstrumentNo(), null);

		// check redemption amount
		List<PaymentItemMappingDaoExt> paymentItemMapList = paymentUtil.paymentCheckBasedOnRedemptionType(
				paymentDetailsDao.getAmount(), voucherBalance, redeemTypeAndProductGroupListDto.getValidAmount(),
				redeemTypeAndProductGroupListDto.getRedemptionType(), paymentDetailsDao,
				redeemTypeAndProductGroupListDto.getItemValueAndPgcDetails());

		paymentDetailsDao.setInstrumentType(paymentCode);

		if (!paymentDetailsDao.getBankName().equals(redeemTypeAndProductGroupListDto.getCPGName())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Bank name should be valid CPG name");
		}

		return Map.of(paymentDetailsDao, paymentItemMapList);
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// no update for GHS voucher
		return null;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// no validate payment for GHS eVoucher
		return null;
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// no payment trigger for GHS eVoucher
		return paymentDetailsDao;
	}

	@Transactional
	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		// if OPEN then DELETE, if COMPLETED then reverse
		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentUtil.reverseQCGC(paymentDetailsDao);
		} else {
			paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);
		}

		// pending: OTP data to be cleared?
		paymentDetailsDao.setReference1(null);

		paymentDetailsRepository.save(paymentDetailsDao);

	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {

		// if payment status is not OPEN do not allow
		// redemption.
		if (!SalesUtil.paymentStatusCheckForRedemption(paymentDetailsDao.getStatus())) {
			return paymentDetailsDao;
		}

		GiftCardBaseRedeemRequestDto giftCardRedeemDto = paymentUtil.setCardRedeemRequest(paymentDetailsDao);

		GcResponseDto gcResponseDto = integrationService.redeemGiftCardBalance(VendorCodeEnum.QC_GC.name(),
				giftCardRedeemDto, GiftCardTypeEnum.GIFTCARD_CODE);

		if (!"0".equals(gcResponseDto.getResponseCode())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
			Map<String, String> errorCause = Map.of("cardNo", paymentDetailsDao.getInstrumentNo(), "errorMessage",
					gcResponseDto.getResponseMessage(), SalesConstants.PAYMENT_CODE,
					paymentDetailsDao.getPaymentCode());
			throw new ServiceException(null, gcResponseDto.getResponseCode(), errorCause);
		}

		QwickcilverGCOtherDetailsDto qwickcilverGCOtherDetailsDto = new QwickcilverGCOtherDetailsDto();

		qwickcilverGCOtherDetailsDto.setApprovalCode(gcResponseDto.getApprovalCode());
		qwickcilverGCOtherDetailsDto.setTransactionId(gcResponseDto.getTransactionId());
		qwickcilverGCOtherDetailsDto.setCardName(gcResponseDto.getCardName());
		qwickcilverGCOtherDetailsDto.setBillAmount(BigDecimal.valueOf(giftCardRedeemDto.getBillAmount()));

		paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
		paymentDetailsDao.setOtherDetails(MapperUtil
				.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), qwickcilverGCOtherDetailsDto)));

		paymentDetailsRepository.save(paymentDetailsDao);

		return paymentDetailsDao;
	}

	private BigDecimal getVoucherBalance(PaymentDetailsDaoExt paymentDetailsDao) {

		GcCustomerResponseDto getGiftCardCustomerInfo = integrationService
				.getGiftCardCustomerInfo(VendorCodeEnum.QC_GC.name(), paymentDetailsDao.getInstrumentNo());

		if (!"0".equals(getGiftCardCustomerInfo.getResponseCode())) {
			Map<String, String> errorCause = Map.of("cardNo", paymentDetailsDao.getInstrumentNo(), "errorMessage",
					getGiftCardCustomerInfo.getResponseMessage(), SalesConstants.PAYMENT_CODE,
					paymentDetailsDao.getPaymentCode());

			throw new ServiceException(null, getGiftCardCustomerInfo.getResponseCode(), errorCause);
		}

		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		// cardExpiryDate check
		if (businessDate.after(getGiftCardCustomerInfo.getCardExpiryDate())) {
			throw new ServiceException(SalesConstants.GIFT_CARD_OR_VOUCHER_HAS_EXPIRED, SalesConstants.ERR_SALE_027,
					"GHS eVoucher " + paymentDetailsDao.getInstrumentNo() + " has expired.");
		}

		// card status check
		if (!"ACTIVATED".equalsIgnoreCase(getGiftCardCustomerInfo.getCardStatus())) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT,
					SalesConstants.ERR_SALE_088,
					"GHS eVoucher with status: " + getGiftCardCustomerInfo.getCardStatus()
							+ ", cannot be used as payment.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentDetailsDao.getPaymentCode()));
		}

		return new BigDecimal(getGiftCardCustomerInfo.getCardBalance());
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		// doubt - for EOD payment deletion, CNtype to be 'ADVANCE'?

		return paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, CNType.EVOUCHER, false, docDate);
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
