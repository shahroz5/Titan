/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.DigiGoldTransactionEnum;
import com.titan.poss.core.dto.BrandConfigDetails;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.DigiGoldOtpResponseDto;
import com.titan.poss.core.dto.DigiGoldRedeemDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.DigiGoldNonTanishqOtherDetailsDto;
import com.titan.poss.sales.dto.DigiGoldTanishqOtherDetails;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.RedeemTypeAndProductGroupListDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.DigiGoldPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.DigiGoldTanishqService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesDigiGoldTanishqService")
public class DigiGoldTanishqServiceImpl implements DigiGoldTanishqService {

	public DigiGoldTanishqServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.DIGI_GOLD_TANISHQ.getPaymentcode(), this);
	}

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

    private static final String MOBILE_NO = "mobileNo";

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {
		DigiGoldPaymentFieldsDto digiGoldPaymentFieldsDto = (DigiGoldPaymentFieldsDto) MapperUtil
				.getDtoMapping(paymentCreateDto, DigiGoldPaymentFieldsDto.class);
		// validate fields
		digiGoldPaymentFieldsDto.validateFields(digiGoldPaymentFieldsDto);

		// validate otherDetails json
		DigiGoldTanishqOtherDetails digiGoldTanishqOtherDetails = getDigiGoldTanishqOtherDetails(
				paymentCreateDto.getOtherDetails());
		digiGoldTanishqOtherDetails.validateFields(digiGoldTanishqOtherDetails);

		SalesPaymentDto salesPaymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(paymentCreateDto,
				SalesPaymentDto.class);
		salesPaymentDto.setOtherDetails(paymentCreateDto.getOtherDetails());
		salesPaymentDto.setInstrumentNo(digiGoldTanishqOtherDetails.getMobileNo());
		salesPaymentDto.setStatus(PaymentStatusEnum.OPEN.name());

		return salesPaymentDto;
	}

	private DigiGoldNonTanishqOtherDetailsDto getDigiGoldNonTanishqOtherDetails(JsonData otherDetails) {
		return MapperUtil.mapObjToClass(otherDetails.getData(), DigiGoldNonTanishqOtherDetailsDto.class);
	}

	private DigiGoldTanishqOtherDetails getDigiGoldTanishqOtherDetails(JsonData otherDetails) {
		return MapperUtil.mapObjToClass(otherDetails.getData(), DigiGoldTanishqOtherDetails.class);
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		DigiGoldTanishqOtherDetails digiGoldTanishqOtherDetails = getDigiGoldTanishqOtherDetails(
				salesPaymentDto.getOtherDetails());
		// Amount validation
		if (BigDecimal
				.valueOf(Math.round(digiGoldTanishqOtherDetails.getSellingPrice()
						.multiply(digiGoldTanishqOtherDetails.getTanishqGoldrams()).doubleValue()))
				.compareTo(salesPaymentDto.getAmount()) != 0) {
			Map<BigDecimal, BigDecimal> errorMap = new HashMap<>();
			errorMap.put(salesPaymentDto.getAmount(), BigDecimal.valueOf(Math.round(digiGoldTanishqOtherDetails
					.getSellingPrice().multiply(digiGoldTanishqOtherDetails.getTanishqGoldrams()).doubleValue())));
			throw new ServiceException("Mismatch in total amount and grams to redeem", "ERR-SALE-322", errorMap);
		}
		// verify OTP
		DigiGoldOtpResponseDto otpResponse = integrationService.verifyDigiGoldOtp(
				digiGoldTanishqOtherDetails.getMobileNo(), digiGoldTanishqOtherDetails.getTotalGrams(),
				salesPaymentDto.getReference1(), salesTxnDao.getId());
		if (BooleanUtils.isFalse(otpResponse.getStatus()))
			throw new ServiceException("Invalid OTP", "ERR-CORE-042", otpResponse.getMessage());

		BrandConfigDetails brandConfigDetails = getBrandDetails();
		CustomerTxnDaoExt customerTxnDaoExt = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxnDao.getId());
		if (BooleanUtils.isTrue(brandConfigDetails.getIsCustomerMandatoryForDigiGold())) {
			if (!digiGoldTanishqOtherDetails.getMobileNo().equalsIgnoreCase(CryptoUtil.decrypt(customerTxnDaoExt.getMobileNumber(),MOBILE_NO))) {
				throw new ServiceException("Customer is set mandatory for payment type", "ERR-SALE-319");
			}
		}
		List<PaymentDetailsDaoExt> payments = paymentDetailsRepository
				.findBySalesTxnDaoIdAndPaymentCode(salesTxnDao.getId(), PaymentCodeEnum.DIGI_GOLD_TANISHQ.name());

		if (!CollectionUtil.isEmpty(payments)) {
			payments.forEach(payment -> {
				DigiGoldTanishqOtherDetails tanishq = getDigiGoldTanishqOtherDetails(
						MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class));
				if (tanishq.getMobileNo().equalsIgnoreCase(digiGoldTanishqOtherDetails.getMobileNo()))
					throw new ServiceException(
							"Digi Gold Payment already exists for the entered mobile number. Please delete and add payment",
							"ERR-SALE-321");
			});
		}
		return salesPaymentDto;
	}

	private BrandConfigDetails getBrandDetails() {
		BrandDto brandDto = engineService.getBrand();
		return MapperUtil.getObjectMapperInstance().convertValue(brandDto.getConfigDetails().getData(),
				BrandConfigDetails.class);
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {
		RedeemTypeAndProductGroupListDto redeemTypeAndProductGroupListDto = paymentUtil
				.productGroupCodeCheckForPayement(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnType(), paymentCode, null, null);
		// check amount
		List<PaymentItemMappingDaoExt> paymentItemMapList = paymentUtil.amountCheckForPayment(
				redeemTypeAndProductGroupListDto.getValidAmount(), paymentDetailsDao.getAmount(), paymentDetailsDao,
				redeemTypeAndProductGroupListDto.getItemValueAndPgcDetails());

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode); // DIGI GOLD TANISHQ

		return Map.of(paymentDetailsDao, paymentItemMapList);

	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		return null;
	}

	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		// check if related discount is present, if yes then payment deletion is not
		// allowed
		List<DiscountDetailsDaoExt> relatedDiscountList = discountDetailsRepository.findAllBySalesTxnIdAndRefPaymentId(
				paymentDetailsDao.getSalesTxnDao().getId(), paymentDetailsDao.getId());
		if (!CollectionUtil.isEmpty(relatedDiscountList)) {
			throw new ServiceException(SalesConstants.PLEASE_DELETE_RELATED_DISCOUNT_BEFORE_DELETING_PAYMENT,
					SalesConstants.ERR_SALE_324, "Discounts related to payment to be deleted first.");
		}

		// if COMPLETED then REVERSED with CN
		paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, true);
		paymentDetailsRepository.save(paymentDetailsDao);

	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {
		DigiGoldTanishqOtherDetails digiGoldTanishqOtherDetails = getDigiGoldTanishqOtherDetails(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class));
		DigiGoldRedeemDto digiGoldRedeemDto = integrationService.redeemDigiGoldBalance(
				DigiGoldTransactionEnum.TANISHQ.name(), digiGoldTanishqOtherDetails.getMobileNo(),
				digiGoldTanishqOtherDetails.getTanishqGoldrams(), paymentDetailsDao.getReference1(),
				paymentDetailsDao.getSalesTxnDao().getId());
		if (BooleanUtils.isFalse(digiGoldRedeemDto.getStatus())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
			List<PaymentDetailsDaoExt> payments = paymentDetailsRepository.findBySalesTxnDaoIdAndPaymentCode(
					paymentDetailsDao.getSalesTxnDao().getId(), PaymentCodeEnum.DIGI_GOLD_NON_TANISHQ.name());
			if (!CollectionUtil.isEmpty(payments)) {
				payments.forEach(payment -> {
					DigiGoldNonTanishqOtherDetailsDto tanishq = getDigiGoldNonTanishqOtherDetails(
							MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class));
					if (tanishq.getMobileNo().equalsIgnoreCase(digiGoldTanishqOtherDetails.getMobileNo()))
						integrationService.reverseDigiGoldRedemption(paymentDetailsDao.getSalesTxnDao().getId(),
								tanishq.getTransactionId());
				});
			}
			throw new ServiceException("Redemption Failed from Digi-Gold", "ERR-SALE-320",
					"TANISHQ:" + digiGoldRedeemDto.getMessage());
		} else {
			digiGoldTanishqOtherDetails.setTransactionId(digiGoldRedeemDto.getTransactionId());
			paymentDetailsDao.setOtherDetails(MapperUtil
					.getJsonString(new JsonData(paymentDetailsDao.getPaymentCode(), digiGoldTanishqOtherDetails)));
			paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
		}
		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		return paymentUtil.createCancelCN(paymentDetails, salesTxn, cancel, CNType.DIGI_GOLD_TANISHQ, Boolean.FALSE,
				docDate);
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
