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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.LocationPaymentDetails;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
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
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.RedeemTypeAndProductGroupListDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.response.UlpOtherDetailsDto;
import com.titan.poss.sales.dto.validators.UlpPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.UlpPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for Ulp payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesUlpPaymentService")
public class UlpPaymentServiceImpl implements UlpPaymentService {

	public UlpPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.ENCIRCLE.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CustomerService customerService;

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
		UlpPaymentFieldsDto ulpPaymentFieldsDto = (UlpPaymentFieldsDto) MapperUtil.getDtoMapping(paymentCreateDto,
				UlpPaymentFieldsDto.class);
		// validate fields
		ulpPaymentFieldsDto.validateFields(ulpPaymentFieldsDto);

		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {

		// isUlpAllowed check - NAP-2328
		LocationPaymentDetails locationPaymentDetails = paymentUtil.getPaymentDetailsFromLocation().getPaymentDetails();

		if (locationPaymentDetails.getIsUlpAllowed() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Payment details for 'isUlpAllowed' not found at location: " + CommonUtil.getLocationCode());
		}

		if (!BooleanUtils.isTrue(locationPaymentDetails.getIsUlpAllowed())) {
			throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
					"ULP payment not allowed as per location configuration for location: "
							+ CommonUtil.getLocationCode());
		}

		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		// if 'ENCIRCLE' payment is already added, then throw error.
		BigDecimal encirclePayment = paymentDetailsRepository.getPaidAmountByTransactionIdAndPaymentCode(
				paymentDetailsDao.getSalesTxnDao().getId(), List.of(PaymentCodeEnum.ENCIRCLE.getPaymentcode()),
				CommonUtil.getLocationCode(), null);
		if (BigDecimal.ZERO.compareTo(encirclePayment) != 0) {
			throw new ServiceException(SalesConstants.DYNAMIC_PAYMENT_CODE_CANNOT_BE_USED_MULTIPLE_TIMES,
					SalesConstants.ERR_SALE_290, "Encircle payment cannot be used multiple times.",
					Map.of(SalesConstants.PAYMENT_CODE, paymentCode + " payment"));
		}

		// vendor code to be saved somewhere?

		CustomerDetailsDto customerSearchDto = checkIfCustomerEligibleForLoyaltyPayment(paymentCode,
				paymentDetailsDao.getSalesTxnDao().getCustomerId());

		checkAmountWithLoyaltyPoints(customerSearchDto.getUlpId(), paymentDetailsDao.getAmount());

		// store ULP Id for future reference?
		UlpOtherDetailsDto ulpOtherDetailsDto = new UlpOtherDetailsDto();
		ulpOtherDetailsDto.setUlpId(customerSearchDto.getUlpId());
		paymentDetailsDao.setOtherDetails(MapperUtil.getStringFromJson(new JsonData(paymentCode, ulpOtherDetailsDto)));

		// cfa mapping check
		RedeemTypeAndProductGroupListDto redeemTypeAndProductGroupListDto = paymentUtil
				.productGroupCodeCheckForPayement(paymentDetailsDao.getSalesTxnDao().getId(),
						paymentDetailsDao.getSalesTxnType(), paymentCode, null, null);

		// check amount
		List<PaymentItemMappingDaoExt> paymentItemMapList = paymentUtil.amountCheckForPayment(
				redeemTypeAndProductGroupListDto.getValidAmount(), paymentDetailsDao.getAmount(), paymentDetailsDao,
				redeemTypeAndProductGroupListDto.getItemValueAndPgcDetails());

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode); // ENCIRCLE

		return Map.of(paymentDetailsDao, paymentItemMapList);
	}

	private CustomerDetailsDto checkIfCustomerEligibleForLoyaltyPayment(String paymentCode, Integer customerId) {
		CustomerDetailsDto customerSearchDto = customerService.getCustomer(customerId);

		if ((!CustomerTypeEnum.REGULAR.name().equals(customerSearchDto.getCustomerType())
				&& !CustomerTypeEnum.INSTITUTIONAL.name().equals(customerSearchDto.getCustomerType()))
				|| (CustomerTypeEnum.INSTITUTIONAL.name().equals(customerSearchDto.getCustomerType()))
						&& StringUtils.isEmpty(customerSearchDto.getUlpId())) {
			throw new ServiceException(SalesConstants.CUSTOMER_IS_NOT_ELIGIBLE_FOR_PAYMENT, SalesConstants.ERR_SALE_024,
					"Customer is not eligible for payment: " + paymentCode);
		}

		return customerSearchDto;
	}

	private void checkAmountWithLoyaltyPoints(String ulpId, BigDecimal amount) {
		UlpBalanceResponseDto ulpBalanceResponseDto = integrationService
				.getLoyaltyPointsBalance(VendorCodeEnum.ULP_NETCARROTS.name(), ulpId);

		if (!"0".equals(ulpBalanceResponseDto.getResponseCode())) {
			throw new ServiceException(null, ulpBalanceResponseDto.getResponseCode(),
					ulpBalanceResponseDto.getResponseMessage());
		}

		if (amount.compareTo(ulpBalanceResponseDto.getBalancePoints()) > 0) {
			throw new ServiceException(SalesConstants.AMOUNT_EXCEEDS_ACCOUNT_BALANCE, SalesConstants.ERR_SALE_041,
					"Amount exceeds loyalty point balance.");
		}

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

		// if OPEN then delete, else if IN_PROGRESS then reverse the redeem and
		// 'REVERSE' status.
		if (PaymentStatusEnum.OPEN.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.FAILED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
			paymentDetailsRepository.save(paymentDetailsDao);
		} else if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.IN_PROGRESS.name().equals(paymentDetailsDao.getStatus())) {
			// reverse REDEEM - reference number stored in reference1
			// ulp id needs to be saved in save? -- currently in other details

			UlpOtherDetailsDto ulpOtherDetailsDto = getUlpOtherDetial(paymentDetailsDao.getOtherDetails());

			UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto = new UlpReverseRedeemedLoyaltyPointsDto();
			reverseRedeemLoyaltyPointsDto.setUlpId(ulpOtherDetailsDto.getUlpId());
			reverseRedeemLoyaltyPointsDto.setRedeemedPoints(paymentDetailsDao.getAmount().intValue());
			reverseRedeemLoyaltyPointsDto.setRefernceNumber(paymentDetailsDao.getReference1());

			UlpReverseRedeemResponseDto ulpReverseRedeemResponseDto = integrationService
					.reverseRedeemedLoyaltyPoints(VendorCodeEnum.ULP_NETCARROTS.name(), reverseRedeemLoyaltyPointsDto);

			// check response code
			if ("0".equals(ulpReverseRedeemResponseDto.getResponseCode())) {
				if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
					paymentDetailsDao.setStatus(PaymentStatusEnum.REVERSED.name());
				} else {
					// if IN_PROGRESS, change status to CANCELLED
					paymentDetailsDao.setStatus(PaymentStatusEnum.CANCELLED.name());
				}
				// will the reference number in response be a different one?
				paymentDetailsDao.setReference3(ulpReverseRedeemResponseDto.getReferenceNumber());
				paymentDetailsRepository.save(paymentDetailsDao);
			} else {
				throw new ServiceException(null, ulpReverseRedeemResponseDto.getResponseCode(),
						ulpReverseRedeemResponseDto.getResponseMessage());
			}
		}

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
		// No trigger for Loyalty payment.
		return paymentDetailsDao;
	}

	/**
	 * This method will validate payment by paymentDetails and otp.
	 * 
	 * @param paymentDetailsDao
	 * @param otp
	 * @return SalesPaymentDto
	 */
	@Transactional
	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {

		// Pending: Can OTP be validated again, if failed previously?

		// if reference number from is present, OTP is present and status is IN_PROGESS
		// then check for OTP
		if (!StringUtils.isEmpty(paymentDetailsDao.getReference1())
				&& !StringUtils.isEmpty(paymentDetailsDao.getReference2())
				&& PaymentStatusEnum.IN_PROGRESS.name().equals(paymentDetailsDao.getStatus())) {
			if (paymentDetailsDao.getReference2().equals(otp)) {
				paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
			} else {
				// else don't update status but throw OTP invalid error
				throw new ServiceException(SalesConstants.INVALID_OTP, SalesConstants.ERR_CORE_042,
						"Invalid OTP for " + paymentDetailsDao.getPaymentCode() + " payment.");
			}

		}

		paymentDetailsRepository.save(paymentDetailsDao);

		return (SalesPaymentDto) MapperUtil.getObjectMapping(paymentDetailsDao, new SalesPaymentDto());
	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {

		// if payment status is not OPEN do not allow redemption.
		if (!SalesUtil.paymentStatusCheckForRedemption(paymentDetailsDao.getStatus())) {
			return paymentDetailsDao;
		}

		UlpOtherDetailsDto ulpOtherDetailsDto = getUlpOtherDetial(paymentDetailsDao.getOtherDetails());

		UlpRedeemLoyaltyPointsDto ulpRedeemLoyaltyPointsDto = new UlpRedeemLoyaltyPointsDto();
		ulpRedeemLoyaltyPointsDto.setUlpId(ulpOtherDetailsDto.getUlpId());
		ulpRedeemLoyaltyPointsDto.setRedeemedPoints(paymentDetailsDao.getAmount().intValue());

		RedeemPointsDto redeemPointsDto = integrationService.redeemLoyaltyPoints(VendorCodeEnum.ULP_NETCARROTS.name(),
				ulpRedeemLoyaltyPointsDto);

		// if response code is not zero then failed.
		if ("0".equals(redeemPointsDto.getResponseCode())) {

			// if OTP (or authorization code) is not present then update status to
			// COMPLETED.
			if (StringUtils.isEmpty(redeemPointsDto.getAuthorizationCode())) {
				paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
			} else { // update status to IN_PROGRESS if auth code is present.
				paymentDetailsDao.setStatus(PaymentStatusEnum.IN_PROGRESS.name());
			}

			paymentDetailsDao.setReference1(redeemPointsDto.getRedemptionReferenceNumber());
			paymentDetailsDao.setReference2(redeemPointsDto.getAuthorizationCode());
		} else {
			paymentDetailsDao.setStatus(PaymentStatusEnum.FAILED.name());
			// need to throw error?
		}

		paymentDetailsRepository.save(paymentDetailsDao);

		if (!"0".equals(redeemPointsDto.getResponseCode())) {
			throw new ServiceException(null, redeemPointsDto.getResponseCode(), redeemPointsDto.getResponseMessage());
		}

		return paymentDetailsDao;

	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {

		// PENDING cancel discount applied also if applied any ulp discount

		paymentDetails.forEach(payment -> {

			UlpOtherDetailsDto uod = getUlpOtherDetial(payment.getOtherDetails());
			String ulpId = uod.getUlpId();

			UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto = new UlpReverseRedeemedLoyaltyPointsDto();
			reverseRedeemLoyaltyPointsDto.setUlpId(ulpId);
			reverseRedeemLoyaltyPointsDto.setRedeemedPoints(payment.getAmount().intValue());
			reverseRedeemLoyaltyPointsDto.setRefernceNumber(payment.getReference1());

			UlpReverseRedeemResponseDto ulpReverseRedeemResponseDto = integrationService
					.reverseRedeemedLoyaltyPoints(VendorCodeEnum.ULP_NETCARROTS.name(), reverseRedeemLoyaltyPointsDto);

			// check response code
			if (!"0".equals(ulpReverseRedeemResponseDto.getResponseCode())) {
				throw new ServiceException(null, ulpReverseRedeemResponseDto.getResponseCode(),
						ulpReverseRedeemResponseDto.getResponseMessage());
			}

		});

		return new HashMap<>();
	}

	private UlpOtherDetailsDto getUlpOtherDetial(String otherDetails) {

		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(otherDetails), JsonData.class);

		return MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(), UlpOtherDetailsDto.class);

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
