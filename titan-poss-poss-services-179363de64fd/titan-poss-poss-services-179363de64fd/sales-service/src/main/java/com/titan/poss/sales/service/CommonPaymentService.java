/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MetalRateWithWeightDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.PaymentDetailsForUnipayDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.ItemValueAndProductCodeDetailsDto;
import com.titan.poss.sales.dto.response.RedeemTypeAndProductGroupListDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CommonPaymentService {

	/**
	 * @param totalWeightDetailsDto
	 * @param metalRateWithWeightMap
	 */
	void validateMetalWeightForEdit(WeightDetailsDto totalWeightDetailsDto,
			Map<String, MetalRateWithWeightDto> metalRateWithWeightMap);

	/**
	 * @param totalWeightDetailsDto
	 * @param metalRateWithWeightMap
	 */
	void validateMetalWeightInConfirm(WeightDetailsDto totalWeightDetailsDto,
			Map<String, MetalRateWithWeightDto> metalRateWithWeightMap);

	/**
	 * This method will get 'AIRPAY' or 'RAZOR PAY' payment status.
	 * 
	 * @param paymentDetailsDao
	 * @param businessDate
	 */
	void getAirpayOrRazorPayPaymentStatus(PaymentDetailsDaoExt paymentDetailsDao, Date businessDate);

	/**
	 * @param instrumentDate
	 */
	void chequeorDdDateValidation(Date instrumentDate);

	/**
	 * @param paymentDetailsDao
	 * @param withCN
	 * @return
	 */
	PaymentDetailsDaoExt deletePaymentOpenDeleteElseReverse(PaymentDetailsDaoExt paymentDetailsDao, boolean withCN);

	/**
	 * @param paymentDetailsDao
	 * @return
	 */
	GiftCardBaseRedeemRequestDto setCardRedeemRequest(PaymentDetailsDaoExt paymentDetailsDao);

	/**
	 * @param paymentDetails
	 * @param cancel
	 */
	void createPaymentReversal(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel);

	/**
	 * @param paymentDetails
	 * @param salesTxn
	 * @param cancelDao
	 * @param cnType
	 * @param isSingle
	 * @param docDate
	 * @return Map<String, Integer>
	 */
	Map<String, Integer> createCancelCN(List<PaymentDetailsDaoExt> paymentDetails, SalesTxnDaoExt salesTxn,
			CancelDaoExt cancelDao, CNType cnType, boolean isSingle, Date docDate);

	/**
	 * @param cnType
	 * @param totalAmtList
	 * @param salesTxn
	 * @param cancelTxn
	 * @param docDate
	 * @return Map<String, Integer>
	 */
	Map<String, Integer> createCN(CNType cnType, List<CreditNoteIndvCreateDto> totalAmtList, SalesTxnDaoExt salesTxn,
			CancelDaoExt cancelTxn, Date docDate, String paymentId);

	/**
	 * This method will get locations details after validating payment details.
	 * 
	 * @return LocationCacheDto
	 */
	LocationCacheDto getPaymentDetailsFromLocation();

	/**
	 * @param payments
	 * @return
	 */
	BigDecimal getTotalAmtFromPaymentDetails(List<PaymentDetailsDaoExt> payments);

	/**
	 * @param payments
	 * @return
	 */
	BigDecimal getTotalOtherModeFromPaymentDetails(List<PaymentDetailsDaoExt> payments);

	/**
	 * @param payments
	 * @return
	 */
	List<PaymentDetailsForUnipayDto> getPaymentsByPaymentCode(List<PaymentDetailsDaoExt> payments);

	/**
	 * This method is used to check product group mapping. OfferId is used only for
	 * 'CASHBACK' payment
	 * 
	 * @param transactionId
	 * @param transactionType
	 * @param paymentCode
	 * @param cardNumber
	 * @param offerId
	 * @return RedeemTypeAndProductGroupListDto
	 */
	RedeemTypeAndProductGroupListDto productGroupCodeCheckForPayement(String transactionId, String transactionType,
			String paymentCode, String cardNumber, String offerId);

	/**
	 * This method will get list of product group codes of all the items in
	 * transactions.
	 * 
	 * @param transactionType
	 * @param transactionId
	 * @param validProductGroupCodeList
	 * @param paymentCode
	 * @param cardNumber
	 * @param isExcludePGC
	 * @return Map<String,ItemValueAndProductCodeDetailsDto>
	 */
	Map<String, ItemValueAndProductCodeDetailsDto> getItemProductGroupCodes(String transactionType,
			String transactionId, List<String> validProductGroupCodeList, String paymentCode, String cardNumber,
			boolean isExcludePGC);

	/**
	 * This method will check the payment that can be done for the items based on
	 * product group code config. If payment check, then throw error.
	 * 
	 * @param paymentCode
	 * @param itemValueAndPgcDetails
	 * @param transactionId
	 * @return BigDecimal
	 */
	BigDecimal getValidPaymentForItems(String paymentCode,
			Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails, String transactionId);

	/**
	 * This method will check for valid payment.
	 * 
	 * @param validAmount
	 * @param inputAmount
	 * @param paymentDetailsDao
	 * @param itemValueAndPgcDetails
	 * @return List<PaymentItemMappingDao>
	 */
	List<PaymentItemMappingDaoExt> amountCheckForPayment(BigDecimal validAmount, BigDecimal inputAmount,
			PaymentDetailsDaoExt paymentDetailsDao,
			Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails);

	/**
	 * This method will validate payment based on redemption type & card/voucher
	 * balance and also check for valid payment.
	 * 
	 * @param inputAmount
	 * @param giftBalance
	 * @param validAmount
	 * @param redemptionType
	 * @param paymentDetailsDao
	 * @param itemValueAndPgcDetails
	 * @return List<PaymentItemMappingDao>
	 */
	List<PaymentItemMappingDaoExt> paymentCheckBasedOnRedemptionType(BigDecimal inputAmount, BigDecimal giftBalance,
			BigDecimal validAmount, String redemptionType, PaymentDetailsDaoExt paymentDetailsDao,
			Map<String, ItemValueAndProductCodeDetailsDto> itemValueAndPgcDetails);

	BigDecimal getTotalCashCollectedFromPaymentDetails(List<PaymentDetailsDaoExt> payments);

	/**
	 * This method will get total transaction value and due amount from customer.
	 * 
	 * @param salesTxnDao
	 * @param isTcsPayment
	 * @return AmountDetailsDto
	 */
	AmountDetailsDto getTxnValueAndDueAmount(SalesTxnDaoExt salesTxnDao, Boolean isTcsPayment);

	/**
	 * This method will get final value based on transaction type.
	 * 
	 * @param salesTxnDao
	 * @return AmountDetailsDto
	 */
	AmountDetailsDto getTxnFinalValue(SalesTxnDaoExt salesTxnDao);

	/**
	 * This method is used to reverse QCGC redemption.
	 * 
	 * @param paymentDetailsDao
	 */
	void reverseQCGC(PaymentDetailsDaoExt paymentDetailsDao);

	/**
	 * This method will set bank name for 'AIRPAY' and RAZOR PAY payments.
	 * 
	 * @param paymentDetailsDao
	 * @param isOnlinePayment
	 */
	void setBankNameForAirpayOrRazorPay(PaymentDetailsDaoExt paymentDetailsDao, Boolean isOnlinePayment);

	/**
	 * This method will check if hostname is valied for the payment.
	 * 
	 * @param paymentCode
	 * @param ignoreError
	 * @return boolean
	 * 
	 */
	boolean hostNameMappingCheck(String paymentCode, Boolean ignoreError);

	/**
	 * This method will return rate protected CN if exists, else returns null;
	 * 
	 * @param salesTxnDao
	 * @return PaymentDetailsDaoExt
	 */
	PaymentDetailsDaoExt getMetalRateProtectedCNIfExists(SalesTxnDaoExt salesTxnDao);

	/**
	 * This method will be called in all actions taken on CONFIRM to validate if
	 * transaction meets all the required config validation for rate freezed CN.
	 * Will be called in discount redemption, payment redemption and on transaction
	 * confirmation.
	 * 
	 * @param salesTxnDao
	 * @param paymentDetailsDao
	 */
	void validTxnForRateFreezedCN(SalesTxnDaoExt salesTxnDao, PaymentDetailsDaoExt paymentDetailsDao);

	/**
	 * This method will be called on redemption of rate freezed CN to validate
	 * configuration.
	 * 
	 * @param paymentDetailsDao
	 * @param creditNoteDaoExt
	 * @param cnOtherDetails
	 * @param isRedeemCN        -- should be true only when called form CN payment
	 *                          confirm function
	 * @return AmountDetailsDto
	 */
	AmountDetailsDto validPaymentForRateFreezedCN(PaymentDetailsDaoExt paymentDetailsDao,
			CreditNoteDaoExt creditNoteDaoExt, CreditNotePaymentOtherDetailsDto cnOtherDetails, boolean isRedeemCN);

	/**
	 * This method will check the minimum utilization for the payment.(used of GHS
	 * payment currently)
	 * 
	 * @param paymentDetailsDao
	 * @param balance
	 * @param minUtilizationPct
	 * @param remainingOrPaymentAmount
	 * @return BigDecimal
	 */
	BigDecimal checkMinUtilization(PaymentDetailsDaoExt paymentDetailsDao, BigDecimal balance,
			BigDecimal minUtilizationPct, BigDecimal remainingOrPaymentAmount);

	/**
	 * This method will validate payment for AIRPAY/RAZORPAY.
	 * 
	 * @param paymentDetailsDao
	 * @param paymentRequestId
	 * @return PaymentRequestsDao
	 */
	PaymentRequestsDao checkPaymentRequest(PaymentDetailsDaoExt paymentDetailsDao, String paymentRequestId);

	/**
	 * This method is used to check if the payment(GHS Account or CN) has GHS Rivaah
	 * discount in it.
	 * 
	 * @param discountMcPct
	 * @param discountUcpPct
	 * @return boolean
	 */
	boolean isRivaahDiscountPresent(Integer discountMcPct, Integer discountUcpPct);

	/**
	 * This method is used to check if the payment(GHS Account or CN) has GHS bonus
	 * or GHS Rivaah discount in it.
	 * 
	 * @param bonus
	 * @param discountMcPct
	 * @param discountUcpPct
	 * @return boolean
	 */
	boolean isGhsDiscountPresent(BigDecimal bonus, Integer discountMcPct, Integer discountUcpPct);

	/**
	 * This method will check if existing payments can be clubbed with current
	 * payment(GHS and CN with GHS bonus or GHS rivaah discount)
	 * 
	 * @param paymentDetailsDao
	 * @param paymentDetailsList
	 * @param isRivaahGhsExists
	 * @param isRivaahDetailsExists
	 * @param schemeType
	 * @param schemeCode
	 */
	void checkGhsAndCNClubbing(PaymentDetailsDaoExt paymentDetailsDao, List<PaymentDetailsDaoExt> paymentDetailsList,
			boolean isRivaahGhsExists, Set<String> isRivaahDetailsExists, String schemeType, String schemeCode);
	/**
	 * This method will get the payment details for the CN generation.
	 * 
	 * @param paymentDetails
	 * @param cnPaymentDetails
	 * @return CNPaymentDetailsDto
	 */
	CNPaymentDetailsDto getPaymentDetailsForCNGeneration(List<PaymentDetailsDaoExt> paymentDetails,
			CNPaymentDetailsDto cnPaymentDetails);
	
	CashPaymentDetailsDto   getPaymentDetailsAndCheckCNAndQCGCPayment(List<PaymentDetailsDaoExt> paymentDetails);
}
