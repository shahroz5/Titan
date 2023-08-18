/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayActivityDto;
import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldOtpResponseDto;
import com.titan.poss.core.dto.DigiGoldRedeemDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.dto.EinvoiceGstVerifyResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EventCashMemoDto;
import com.titan.poss.core.dto.EventResponseDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.dto.GhsCashResponseDto;
import com.titan.poss.core.dto.GhsCreditNoteTransferDto;
import com.titan.poss.core.dto.GhsDocsResponseDto;
import com.titan.poss.core.dto.GhsRedeemAccountDto;
import com.titan.poss.core.dto.GhsRedeemAccountResponseDto;
import com.titan.poss.core.dto.GhsTodayRevenueDto;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;
import com.titan.poss.core.dto.GiftCardBaseCancelActivateDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.PaymentAuditDto;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.ServiceCashCollectedDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.GhsDiscountVoucherRedeemResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dto.CashMemoEntities;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface IntegrationService {

	/**
	 * This method will do bod at ghs
	 * 
	 * @param vendorCode
	 * @param businessDateDto
	 * @return BusinessDayActivityDto
	 */
	BusinessDayActivityDto bodAtGhs(String vendorCode, BusinessDateDto businessDateDto);

	/**
	 * This method will do eod at ghs
	 * 
	 * @param vendorCode
	 * @param businessDateDto
	 * @return BusinessDayActivityDto
	 */
	BusinessDayActivityDto eodAtGhs(String vendorCode, BusinessDateDto businessDateDto);

	/**
	 * This method will retuen Gift card details.
	 * 
	 * @param vendorCode
	 * @param cardNumber
	 * @param trackData
	 * @param otpRequired
	 * @return GcResponseDto
	 */
	GcResponseDto getGiftCardBalance(String vendorCode, String cardNumber, String trackData, Boolean otpRequired);

	/**
	 * This method is used for Unipay audit.
	 * 
	 * @param vendorCode
	 * @param unipayAuditDto
	 * @return UnipayAuditDto
	 */
	PaymentAuditDto savePaymentCardAuditData(String vendorCode, PaymentAuditDto unipayAuditDto);

	/**
	 * This method is used to initiate Airpay payment.
	 * 
	 * @param vendorCode
	 * @param paymentId
	 * @param paymentRequestDto
	 * @return PaymentCreateResponseDto
	 */
	PaymentCreateResponseDto createPaymentLink(String vendorCode, String paymentId,
			PaymentRequestDto paymentRequestDto);

	/**
	 * This method will verify the status of Airpay payment based on transaction id.
	 * 
	 * @param vendorCode
	 * @param transactionId
	 * @return PaymentVerifyResponseDto
	 */
	PaymentVerifyResponseDto verifyPaymentStatus(String vendorCode, String transactionId);

	/**
	 * This method will return loyalty customer details. value - Mobile no. or ULP
	 * 
	 * @param vendorCode
	 * @param customerSearchType
	 * @param value
	 * @return CustomerDto
	 */
	CustomerDto searchLoyaltyCustomer(String vendorCode, String customerSearchType, String value);

	/**
	 * This method will activate gift card.
	 * 
	 * @param vendorCode
	 * @param giftCardActivateRequestDto
	 * @return GcActivateResponseDto
	 */
	GcActivateResponseDto activateGiftCard(String vendorCode,
			GiftCardBaseActivateRequestDto giftCardActivateRequestDto);

	/**
	 * This method will cancel gift card.
	 * 
	 * @param vendorCode
	 * @param giftCardCancelActivateDto
	 * @return GcResponseDto
	 */
	GcResponseDto cancelActivateGiftCard(String vendorCode, GiftCardBaseCancelActivateDto giftCardCancelActivateDto);

	/**
	 * This method will redeem loyalty points.
	 * 
	 * @param vendorCode
	 * @param redeemLoyaltyPointsDto
	 * @return RedeemPointsDto
	 */
	RedeemPointsDto redeemLoyaltyPoints(String vendorCode, UlpRedeemLoyaltyPointsDto redeemLoyaltyPointsDto);

	/**
	 * This method will cancel redeem loyalty points and returns reference number.
	 * 
	 * @param vendorCode
	 * @param reverseRedeemLoyaltyPointsDto
	 * @return UlpReverseRedeemResponseDto
	 */
	UlpReverseRedeemResponseDto reverseRedeemedLoyaltyPoints(String vendorCode,
			UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto);

	/**
	 * This method will return loyalty point balance.
	 * 
	 * @param vendorCode
	 * @param ulpNo
	 * @return UlpBalanceResponseDto
	 */
	UlpBalanceResponseDto getLoyaltyPointsBalance(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "ulp_no", required = true) String ulpNo);

	/**
	 * This method will give gift card/voucher customer details along with balance.
	 * 
	 * @param vendorCode
	 * @param giftCardNumber
	 * @return GcCustomerResponseDto
	 */
	GcCustomerResponseDto getGiftCardCustomerInfo(String vendorCode, String giftCardNumber);

	/**
	 * This method will redeem gift card.
	 * 
	 * @param vendorCode
	 * @param giftCardRedeemRequestDto
	 * @return GcResponseDto
	 */
	GcResponseDto redeemGiftCardBalance(String vendorCode, GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto,
			GiftCardTypeEnum giftCardTypeEnum);

	/**
	 * This method is used to reverse the redeemed gift card.
	 * 
	 * @param vendorCode
	 * @param giftCardReverseRedeemRequestDto
	 * @param giftCardTypeEnum
	 * @return GcResponseDto
	 */
	GcResponseDto reverseRedeemGiftCardBalance(String vendorCode,
			GiftCardBaseReverseRedeemRequestDto giftCardReverseRedeemRequestDto, GiftCardTypeEnum giftCardTypeEnum);

	/**
	 * This method will call EPOSS APIs' based on input given.
	 * 
	 * @param httpMethod
	 * @param relativeUrl
	 * @param requestParams
	 * @param reqBody
	 * @return EpossApiResponseDto
	 */
	ApiResponseDto callEpossAPI(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody);

	Response callEpossAPIWoError(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody);

	Response runThirdPartyAPI(HttpMethod httpMethod, String url, Map<String, String> requestParams, Object reqBody);

	CustomerDto createLoyaltyCustomer(String vendorCode, CustomerAddDto customerULPAddDto);

	UlpBaseResponseDto updateLoyaltyCustomer(String vendorCode, CustomerUpdateDto customerULPUpdateDto);

	/**
	 * This method will get GHS account details based on account number.
	 * 
	 * @param vendorCode
	 * @param accountNo
	 * @return GhsAccountDetailsResponseDto
	 */
	GhsAccountDetailsResponseDto getGhsAccountDetails(String vendorCode, int accountNo);

	/**
	 * This method will redeem GHS account based on request.
	 * 
	 * @param vendorCode
	 * @param ghsRedeemAccountDto
	 * @return GhsRedeemAccountResponseDto
	 */
	GhsRedeemAccountResponseDto redeemGhsAccount(String vendorCode, GhsRedeemAccountDto ghsRedeemAccountDto);

	/**
	 * This method will update CM/AB doc number to GHS account based on request.
	 * 
	 * @param vendorCode
	 * @param ghsAccountMasterUpdateDto
	 * @return GhsAccountMasterUpdateDto
	 */
	GhsAccountMasterUpdateDto updateGhsAccountMaster(String vendorCode,
			GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto);

	/**
	 * This method will get the 'CASH' collected details at GHS.
	 * 
	 * @param vendorCode
	 * @param ulpId
	 * @param mobileNo
	 * @param businessDate
	 * @return GhsCashResponseDto
	 */
	GhsCashResponseDto getCashCollectedAtGHS(String vendorCode, String ulpId, String mobileNo, String businessDate);

	/**
	 * This method will get list of documents uploaded at GHS.
	 * 
	 * @param customerId
	 * @param accountNo
	 * @param vendorCode
	 * @return ListResponse<GhsDocsResponseDto>
	 */
	ListResponse<GhsDocsResponseDto> getGhsDocs(int customerId, int accountNo, String vendorCode);

	/**
	 * 
	 * @param filePath
	 * @return BooleanResponse
	 */
	void uploadFileToOnlineBucket(String filePath);

	void updateTempFile(String documentType, String oldDocumentPath, String newDocumentPath);

	void runScheduler(String code, String token);

	Response getFileInByteArrayResponse(String filePath);

	void deleteFileByPath(String filePath);

	PresignedUrlDto getPresignedUrlOfObjects(Set<String> objectKeys, String documentType);

	/**
	 * This method will be used to get today revenue from GHS.
	 * 
	 * @param businessDateDto
	 * @param vendorCode
	 * @return ListResponse<GhsTodayRevenueDto>
	 */
	ListResponse<GhsTodayRevenueDto> getGhsTodayRevenueEod(BusinessDateDto businessDateDto, String vendorCode);

	VendorDto getVendorByType(String vendorType);

	/**
	 * Method to Update ULP discount flag as Availed
	 * 
	 * @param vendorCode
	 * @param discountDto
	 * @return
	 */
	UlpDiscountResponseDto availLoyaltyDiscounts(String vendorCode, UlpDiscountDto discountDto);

	/**
	 * Method to reverse availed ULP discount flag
	 * 
	 * @param vendorCode
	 * @param billCancellationDto
	 * @return
	 */
	UlpBaseResponseDto reverseAvailedDiscount(String vendorCode, UlpBillCancellationDto billCancellationDto);

	/**
	 * This method will get discount voucher details.
	 * 
	 * @param vendorCode
	 * @param discountVoucherNo
	 * @param accountNo
	 * @return GhsDiscountVoucherResponseDto
	 */
	GhsDiscountVoucherResponseDto getDiscountVoucherDetails(String vendorCode, Integer discountVoucherNo,
			Integer accountNo);

	/**
	 * This method will redeem discount voucher.
	 * 
	 * @param vendorCode
	 * @param discountVoucherNo
	 * @param accountNo
	 * @param transactionId
	 * @return GhsDiscountVoucherRedeemResponseDto
	 */
	GhsDiscountVoucherRedeemResponseDto redeemGhsDiscountVoucher(String vendorCode, String discountVoucherNo,
			Integer accountNo, String transactionId);

	/**
	 * This method will reverse the redemption of discount voucher.
	 * 
	 * @param vendorCode
	 * @param discountVoucherNo
	 * @param transactionId
	 * @param status
	 */
	void updateDiscountVoucher(String vendorCode, String discountVoucherNo, int accountNo, String transactionId,
			String status);

	/**
	 * This method will resend the payment link.
	 * 
	 * @param vendorCode
	 * @param transactionId
	 * @param notifyBy
	 * @return Boolean
	 */
	Boolean resendPaymentLink(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "transactionId", required = true) String transactionId,
			@RequestParam(name = "notifyBy", required = true) String notifyBy);

	/**
	 * @param srcCNId
	 * @param locationCode
	 */
	void transferCnToLegacy(String srcCNId, String locationCode);

	/**
	 * @param mobileNo
	 * @param transactionId
	 * @return DigiGoldBalanceResponseDto
	 */
	DigiGoldBalanceResponseDto getDigiGoldBalance(String mobileNo, String transactionId);

	/**
	 * @param mobileNo
	 * @param tanishqGoldGrams
	 * @param nonTanishqGoldGrams
	 * @param transactionId
	 * @param referenceId
	 * @return BooleanResponse
	 */
	BooleanResponse sendDigiGoldOtp(String mobileNo, BigDecimal tanishqGoldGrams, BigDecimal nonTanishqGoldGrams,
			String transactionId, String referenceId);

	/**
	 * @param mobileNo
	 * @param transactionId
	 * @return DigiGoldSellingPriceDto
	 */
	DigiGoldSellingPriceDto sellingPrice(String mobileNo, String transactionId);

	/**
	 * @param mobileNo
	 * @param totalGrams
	 * @param otp
	 * @param transactionId
	 * @return DigiGoldOtpResponseDto
	 */
	DigiGoldOtpResponseDto verifyDigiGoldOtp(String mobileNo, BigDecimal totalGrams, String otp, String transactionId);

	/**
	 * @param paymentCode
	 * @param mobileNo
	 * @param tanishqGoldrams
	 * @param otp
	 * @param transactionId
	 * @return DigiGoldRedeemDto
	 */
	DigiGoldRedeemDto redeemDigiGoldBalance(String transactionType, String mobileNo, BigDecimal goldrams, String otp,
			String transactionId);

	/**
	 * @param transactionId
	 * @param digiGoldTransactionId
	 */
	void reverseDigiGoldRedemption(String transactionId, String digiGoldTransactionId);

	/**
	 * @param ghsCreditNoteRequest
	 * @return
	 */
	GhsCreditNoteTransferDto cnTransferEghs(GhsCreditNoteTransferDto ghsCreditNoteRequest);

	EinvoiceIrnDetailsResponseDto generateIrn(String vendorCode, String transactionType,
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto);

	EinvoiceGstVerifyResponseDto verifyGstIn(String vendorCode, String gstIn);

	EventResponseDto cashMemoDetails(String vendorCode, String txnId, String subTxnType, String status,
			Boolean isScheduled, EventCashMemoDto eventCashMemoDto);

	void sendNotification(NotificationDto notificationDto);

	CashMemoEntities callLegacyCashMemo(String locationCode, Integer docNo, Short fiscalYear,Boolean isGRNAllowed);
	
	CashMemoEntities callLegacyTepCashMemo(String locationCode, Integer docNo, Short fiscalYear,
			Boolean isInterBrand,Boolean isFullValueTEP,List<CashMemoDetailsDao> cmDetailsList);

	/**
	 * This method will Hold/Open the account to/from a transaction in which it is
	 * added.
	 * 
	 * @param vendorCode
	 * @param accountNo
	 * @param status
	 * @return BooleanResponse
	 */
	BooleanResponse updateGhsAccountMasterStatus(String vendorCode, Integer accountNo, String status);
	
	void updateLegacyGV(GVRequestUpdateDto gvRequest);
	
	StringResponse checkCNStatus(int ghsDocNo, int fiscalYear, String vendorCode);
	BooleanResponse checkBODStatus(String vendorCode, BusinessDateDto businessDateDto, String locationCode);
	BoutiqueGoldPriceMasterDto updateGR(String vendorCode,BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto);


	Object getGiftVoucher(GVRequestDto giftStatusReq);

	List<CmForCustomerLegacyDto> callLegacyGetCmForCustomer(String locationCode, String itemCode, String customerMobileNo,
			String customerId, Boolean isMigratedIgnored);
	
	/**
	 * This method will get the 'CASH' collected details at Service.
	 * 
	 * @param locationCode
	 * @param mobileNo
	 * @param businessDate
	 * @return ServiceCashCollectedDto
	 */
    ServiceCashCollectedDto getCashCollectedAtServicePoss(String mobileNo,String locationCode, String businessDate);

	Map<String, List<ServicePossRevenueDto>> getServiceTodayRevenueForEod(ServicePossRequestDto servicePossRequestDto);

}
