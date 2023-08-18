/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayActivityDto;
import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.ComUpdateRequestDto;
import com.titan.poss.core.dto.ConfirmCustomerOrderDetailsDto;
import com.titan.poss.core.dto.CreditNoteLegacyResponseDto;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerTcsDetailsDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldOtpResponseDto;
import com.titan.poss.core.dto.DigiGoldRedeemDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.dto.EinvoiceGstVerifyResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnCancelDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.EventCancellationDto;
import com.titan.poss.core.dto.EventCashMemoDto;
import com.titan.poss.core.dto.EventGRNDto;
import com.titan.poss.core.dto.EventResponseDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
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
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationIntgDto;
import com.titan.poss.core.dto.PanDocDetailsResponseDto;
import com.titan.poss.core.dto.PaymentAuditDto;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.SchedulerMasterResponseDto;
import com.titan.poss.core.dto.ServiceCashCollectedDto;
import com.titan.poss.core.dto.ServiceMetalRequestDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.dto.ThirdPartyApiReqDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.enums.PanDocVerificationEnum;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.filter.FeignClientInterceptor;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.COResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherRedeemResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.response.StringResponse;

import feign.Response;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "integrationContextId", name = "integration-service", configuration = FeignClientInterceptor.class)
public interface IntegrationServiceClient {

	@GetMapping(value = "integration/v2/payment/gift-cards")
	GcResponseDto getGiftCardBalance(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "cardNumber", required = false) String cardNumber,
			@RequestParam(name = "trackData", required = false) String trackData,
			@RequestParam(name = "otpRequired", required = true) Boolean otpRequired,
			@RequestParam(name = "giftCardType", required = true) GiftCardTypeEnum giftCardType);

	@PostMapping(value = "integration/v2/payment/audit")
	PaymentAuditDto savePaymentCardAuditData(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody PaymentAuditDto unipayAuditDto);

	@PostMapping(value = "integration/v2/payment")
	PaymentCreateResponseDto createPaymentLink(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "paymentId", required = true) String paymentId,
			@RequestBody PaymentRequestDto paymentRequestDto);

	@GetMapping(value = "integration/v2/payment/resend")
	Boolean resendPaymentLink(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "transactionId", required = true) String transactionId,
			@RequestParam(name = "notifyBy", required = true) String notifyBy);

	@GetMapping(value = "integration/v2/payment")
	PaymentVerifyResponseDto verifyPaymentStatus(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "transactionId", required = true) String transactionId);

	@PostMapping(value = "integration/v2/notification")
	public void sendNotification(@RequestBody NotificationDto notificationDto);

	@PostMapping(value = "integration/v2/notification")
	public void sendNotificationWithApiUser(@RequestHeader(value = "Authorization") String bearerToken,
			@RequestBody NotificationDto notificationDto);

	@GetMapping(value = "integration/v2/notification//{notificationType}")
	NotificationIntgDto getNotificationDtoByType(
			@PathVariable("notificationType") @ValueOfEnum(enumClass = NotificationType.class) String notificationType);

	@GetMapping(value = "integration/v2/customers/loyalty-points")
	CustomerDto searchLoyaltyCustomer(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "customerSearchType", required = true) String customerSearchType,
			@RequestParam(name = "locationCode", required = false) String locationCode,
			@RequestParam(name = "value") String value);

	@GetMapping(value = "integration/v2/customers/loyalty-points")
	CustomerDto searchLoyaltyCustomerWithHeader(
			@RequestHeader(name = "Authorization", required = true) String authorization,
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "customerSearchType", required = true) String customerSearchType,
			@RequestParam(name = "locationCode", required = false) String locationCode,
			@RequestParam(name = "value") String value);

	@PostMapping(value = "integration/v2/sale/gift-cards")
	GcActivateResponseDto activateGiftCard(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody GiftCardBaseActivateRequestDto giftCardActivateRequestDto);

	@PutMapping(value = "integration/v2/sale/gift-cards")
	GcResponseDto cancelActivateGiftCard(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody GiftCardBaseCancelActivateDto giftCardCancelActivateDto);

	@PostMapping(value = "integration/v2/payment/loyalty-points")
	RedeemPointsDto redeemLoyaltyPoints(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody UlpRedeemLoyaltyPointsDto redeemLoyaltyPointsDto);

	@PutMapping(value = "integration/v2/payment/loyalty-points")
	UlpReverseRedeemResponseDto reverseRedeemedLoyaltyPoints(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto);

	@GetMapping(value = "integration/v2/payment/loyalty-points")
	UlpBalanceResponseDto getLoyaltyPointsBalance(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "ulp_no", required = true) String ulpNo);

	@GetMapping(value = "integration/v2/payment/gift-cards/customer")
	GcCustomerResponseDto getGiftCardCustomerInfo(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "giftCardNumber", required = true) String giftCardNumber);

	@GetMapping(value = "/integration/v2/payment/gift-cards")
	GcResponseDto getGiftCardBalanc(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "cardNumber", required = false) String cardNumber,
			@RequestParam(name = "trackData", required = false) String trackData,
			@RequestParam(name = "otpRequired", required = true) Boolean otpRequired,
			@RequestParam(name = "giftCardType", required = true) GiftCardTypeEnum giftCardType);

	@PostMapping(value = "integration/v2/payment/gift-cards")
	GcResponseDto redeemGiftCardBalance(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto,
			@RequestParam(name = "giftCardType", required = true) GiftCardTypeEnum giftCardType);

	@PostMapping(value = "integration/v2/payment/gift-cards/reverse-redeem")
	GcResponseDto reverseRedeemGiftCardBalance(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody GiftCardBaseReverseRedeemRequestDto giftCardReverseRedeemRequestDto,
			@RequestParam(name = "giftCardType", required = true) GiftCardTypeEnum giftCardTypeEnum);

	@PostMapping(value = "integration/v2/rest-client/eposs/api-user")
	ApiResponseDto callEpossAPIWHeader(@RequestHeader(value = "Authorization") String bearerToken,
			@RequestBody EpossApiReqDto epossApiReqDto);

	@PostMapping(value = "integration/v2/rest-client/eposs")
	ApiResponseDto callEpossAPI(@RequestBody EpossApiReqDto epossApiReqDto);

	@PostMapping(value = "integration/v2/rest-client/eposs")
	Response callEpossAPIWoError(@RequestBody EpossApiReqDto epossApiReqDto);

	@PostMapping(value = "integration/v2/rest-client")
	Response runThirdPartyAPI(@RequestBody ThirdPartyApiReqDto thirdPartyApiReqDto);

	@PostMapping(value = "integration/v2/customers/loyalty-points")
	CustomerDto createLoyaltyCustomer(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "locationCode", required = false) String locationCode,
			@RequestBody CustomerAddDto customerAddDto);

	@PostMapping(value = "integration/v2/ghs/credit-notes")
	public GhsCreditNoteTransferDto transferCreditNotesToGhs(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody GhsCreditNoteTransferDto ghsCreditNoteTransferDto);

//	@PostMapping(value = "integration/v2/ghs/credit-notes/customer")
//	public GhsCustomerDto saveCustomerGhs(@RequestParam(name = "vendorCode", required = true) String vendorCode,
//			@RequestBody Object customer);

	@PostMapping(value = "integration/v2/customers/loyalty-points")
	CustomerDto createLoyaltyCustomerWithHeader(
			@RequestHeader(name = "Authorization", required = true) String authorization,
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "locationCode", required = false) String locationCode,
			@RequestBody CustomerAddDto customerAddDto);

	@PutMapping(value = "integration/v2/customers/loyalty-points")
	UlpBaseResponseDto updateLoyaltyCustomer(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody CustomerUpdateDto customerULPUpdateDto);

	@PostMapping(value = "integration/v2/rest-client/eposs")
	Response getMetalPriceLocationList(@RequestBody EpossApiReqDto epossApiReqDto);

	@PostMapping("integration/v2/ghs/business-days/status")
	public BooleanResponse checkBODStatus(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody BusinessDateDto businessDateDto,
			@ApiParam(value = "locationCode", required = true) @RequestParam(name = "locationCode", required = true) String locationCode);
	
	
	@PutMapping(value = "integration/v2/ghs/business-days/gold-rate")
	BoutiqueGoldPriceMasterDto updateGR(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto);

	@PostMapping(value = "integration/v2/ghs/business-days/bod")
	BusinessDayActivityDto bodAtGhs(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody BusinessDateDto businessDateDto);

	@PostMapping(value = "integration/v2/ghs/business-days/eod")
	BusinessDayActivityDto eodAtGhs(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody BusinessDateDto businessDateDto);

	
	@PostMapping(value = "integration/v2/ghs/revenue/eod")
	ListResponse<GhsTodayRevenueDto> getGhsTodayRevenueForEod(@RequestBody BusinessDateDto businessDateDto,
			@RequestParam(name = "vendorCode", required = true) String vendorCode);

	@GetMapping(value = "integration/v2/vendors/{vendorCode}")
	VendorDto getVendor(
			@PathVariable(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode);

	@GetMapping(value = "integration/v2/vendors/vendor-type/{vendorType}")
	VendorDto getVendorByType(
			@PathVariable(name = "vendorType", required = true) @ValueOfEnum(enumClass = VendorTypeEnum.class) String vendorType);

	@PatchMapping(value = "integration/v2/vendors")
	VendorDto updateVendor(
			@RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestBody @Valid VendorUpdateDto vendorUpdateDto);

	@PostMapping(value = "integration/v2/legacy/outbound/gift-voucher/status")
	List<GVStatusDto> getGiftVoucherUpdate(@RequestBody GVRequestUpdateDto giftStatusReq);

	@PostMapping("integration/v2/scheduler/jobs")
	PagedRestResponse<List<SchedulerMasterResponseDto>> getSchedulersData(
			@RequestBody @Valid BusinessDateDto businessDate,
			@RequestParam(name = "schedulerCodes", required = false) @ValueOfEnum(enumClass = SchedulerCodeEnum.class) List<String> schedulerCodes);

	@GetMapping(value = "integration/v2/erp/inv")
	public void getInvoice(@RequestParam(name = "invNo", required = true) String invNo);

	@GetMapping(value = "integration/v2/erp/stn")
	public void getStn(@RequestParam(name = "stnNo", required = true) String stnNo);

	@GetMapping(value = "integration/v2/ghs/accounts")
	GhsAccountDetailsResponseDto getGhsAccountDetails(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "accountNo") int accountNo);

	@PostMapping(value = "integration/v2/ghs/accounts")
	GhsRedeemAccountResponseDto redeemGhsAccount(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody GhsRedeemAccountDto ghsRedeemAccountDto);

	@PutMapping(value = "integration/v2/ghs/accounts")
	GhsAccountMasterUpdateDto updateGhsAccountMaster(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestBody GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto);

	@GetMapping(value = "integration/v2/ghs/cash-payments")
	GhsCashResponseDto getCashCollectedAtGHS(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "ulpId") String ulpId, @RequestParam(name = "mobileNo") String mobileNo,
			@RequestParam(name = "businessDate") String businessDate);

	@GetMapping(value = "integration/v2/ghs/docs")
	ListResponse<GhsDocsResponseDto> getGhsDocs(@RequestParam(name = "customerId", required = true) int customerId,
			@RequestParam(name = "accountNo", required = true) int accountNo,
			@RequestParam(name = "vendorCode", required = true) String vendorCode);

	/** online bucket operation **/
	@PostMapping(value = "integration/v2/document/upload/file-path")
	void uploadFileToOnlineBucket(@RequestParam(value = "path") final String filePath);

	@GetMapping(value = "integration/v2/document/download/file-path")
	Response getFileInByteArrayResponse(@RequestParam(value = "path") String filePath);

	@GetMapping(value = "integration/v2/document/presigned-urls")
	PresignedUrlDto getPresignedUrlOfObjects(@RequestParam(value = "objectKeys") Set<String> objectKeys,
			@RequestParam(value = "documentType") String documentType);

	@PostMapping(value = "integration/v2/document/update")
	public void updateTempFile(@RequestParam(value = "documentType") String documentType,
			@RequestParam(value = "oldDocumentPath") String oldDocumentPath,
			@RequestParam(value = "newDocumentPath") String newDocumentPath);

	@DeleteMapping(value = "integration/v2/document/file-path")
	void deleteFileByPath(@RequestParam(value = "path") final String filePath);

	/** online bucket operation **/

	@PostMapping(value = "integration/v2/scheduler")
	void runScheduler(@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestParam(name = "schedulerCode", required = true) String schedulerCode,
			@RequestParam(name = "param", required = false) String param);

	@PostMapping(value = "integration/v2/event/cash-memo")
	public EventResponseDto cashMemoDetails(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "txnId", required = true) String txnId,
			@RequestParam(name = "subTxnType", required = true) String subTxnType,
			@RequestParam(name = "status", required = true) String status,
			@RequestParam(name = "isScheduled", required = true) Boolean isScheduled,
			@RequestBody EventCashMemoDto eventCashMemoDto);

	@PostMapping(value = "integration/v2/event/cancel")
	public EventResponseDto cancellationDetails(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "txnId", required = true) String txnId,
			@RequestParam(name = "cancelType", required = true) String cancelType,
			@RequestParam(name = "status", required = true) String status,
			@RequestParam(name = "isScheduled", required = true) Boolean isScheduled,
			@RequestBody EventCancellationDto eventCancellationDto);

	@PostMapping(value = "integration/v2/event/goods-return")
	public EventResponseDto goodsReturnDetails(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "txnId", required = true) String txnId,
			@RequestParam(name = "isScheduled", required = true) Boolean isScheduled,
			@RequestBody EventGRNDto eventGRNDto);

	@PostMapping(value = "integration/v2/einvoice/irn")
	public EinvoiceIrnDetailsResponseDto generateIrn(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "transactionType", required = true) String transactionType,
			@RequestBody EinvoiceIrnDetailsDto einvoiceIrnDetailsDto);

	@PostMapping(value = "integration/v2/einvoice/irn/cancel")
	public EinvoiceIrnCancelDetailsResponseDto cancelIrn(
			@RequestParam(name = "transactionId", required = true) String transactionId,
			@RequestParam(name = "cancelTxnId", required = true) String cancelTxnId,
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "invoiceRefNumber", required = true) String invoiceRefNumber,
			@RequestParam(name = "docNo", required = true) String docNo,
			@RequestParam(name = "reason", required = true) String reason,
			@RequestParam(name = "remarks", required = true) String remarks);

	@PostMapping(value = "integration/v2/einvoice/irn/verify")
	public EinvoiceGstVerifyResponseDto verifyGstIn(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "gstIn", required = false) String gstIn);

	@PostMapping(value = "integration/v2/scheduler")
	void runScheduler(@RequestParam(name = "schedulerCode", required = true) String schedulerCode);

	@PostMapping(value = "integration/v2/discounts/loyalty-points")
	UlpDiscountResponseDto availLoyaltyDiscounts(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Loyalty points dto", required = true) @RequestBody @Valid UlpDiscountDto discountDto);

	@PutMapping(value = "integration/v2/discounts/loyalty-points")
	UlpDiscountResponseDto reverseAvailedDiscount(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Loyalty points dto", required = true) @RequestBody @Valid UlpBillCancellationDto billCancellationDto);

	@GetMapping(value = "integration/v2/ghs/discount-vouchers")
	GhsDiscountVoucherResponseDto getDiscountVoucherDetails(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "discountVoucherNo", required = true) Integer discountVoucherNo,
			@RequestParam(name = "accountNo", required = true) Integer accountNo);

	@PostMapping(value = "integration/v2/ghs/discount-vouchers")
	GhsDiscountVoucherRedeemResponseDto redeemGhsDiscountVoucher(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "discountVoucherNo", required = true) String discountVoucherNo,
			@RequestParam(name = "accountNo", required = true) Integer accountNo,
			@RequestParam(name = "transactionId", required = true) String transactionId);

	@PutMapping(value = "integration/v2/ghs/discount-vouchers")
	void updateDiscountVoucher(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "discountVoucherNo", required = true) String discountVoucherNo,
			@RequestParam(name = "accountNo", required = true) int accountNo,
			@RequestParam(name = "transactionId", required = true) String transactionId,
			@RequestParam(name = "status", required = true) String status);

	@GetMapping(value = "integration/v2/legacy/outbound/cash-memo")
	public Object getCashMemoDetails(@RequestParam(name = "locationCode", required = true) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear,
			@RequestParam(name = "isGRNAllowed", required = false) Boolean isGRNAllowed);

	@GetMapping(value = "integration/v2/legacy/outbound/cash-memo/tep")
	public Object getTepCashMemoDetails(@RequestParam(name = "locationCode", required = true) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear,
			@RequestParam(name = "isInterBrand", required = true) Boolean isInterBrand,
			@RequestParam(name = "isFullValueTEP", required = true) Boolean isFullValueTEP);
	
	@GetMapping(value = "integration/v2/legacy/outbound/cash-memo/cmcustomer")
	public List<CmForCustomerLegacyDto> getCMforCustomer(@RequestParam(name = "locationCode", required = true) String locationCode,
			@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "customerMobileNo", required = false) String customerMobileNo,
			@RequestParam(name = "customerId", required = false) String customerId,
			@RequestParam(name = "isMigratedIgnored", required = false) Boolean isMigratedIgnored);

	@PostMapping(value = "integration/v2/legacy/outbound/credit-note")
	public CreditNoteLegacyResponseDto transferCreditNote(@RequestParam(name = "id", required = true) String id,
			@RequestParam(name = "destLocationCode", required = true) String destLocationCode);

	@PostMapping(value = "integration/v2/legacy/outbound/grn-items")
	public void updateGrnItemsLegacy(
			@ApiParam(name = "body", value = "Grn Update dto", required = true) @RequestBody(required = true) GrnLegacyUpdateDto updatedGrnDto);
	
	@PostMapping(value = "integration/v2/legacy/outbound/tep-items")
	public void updateTepItemsLegacy(
			@ApiParam(name = "body", value = "Tep Update dto", required = true) @RequestBody(required = true) TepLegacyUpdateDto updatedGrnDto);

	@PostMapping(value = "integration/v2/legacy/outbound/pmla")
	public PmlaLegacyResponseDto getPmlaDetails(
			@RequestParam(name = "dtBusinessDate", required = true) Date dtBusinessDate,
			@RequestParam(name = "ulpMembershipId", required = true) String ulpMembershipId);

	@GetMapping("integration/v2/digi-gold/price")
	public DigiGoldSellingPriceDto sellingPrice(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "mobileNo", required = true) String mobileNo,
			@RequestParam(name = "transactionId", required = true) String transactionId);

	@GetMapping("integration/v2/digi-gold/balance")
	public DigiGoldBalanceResponseDto fetchBalance(
			@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "mobileNo", required = true) String mobileNo,
			@RequestParam(name = "transactionId", required = true) String transactionId);

	@GetMapping("integration/v2/digi-gold/send-otp")
	public BooleanResponse sendOtp(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "mobileNo", required = true) String mobileNo,
			@RequestParam(name = "tanishqGoldGrams", required = false) BigDecimal tanishqGoldGrams,
			@RequestParam(name = "nonTanishqGoldGrams", required = false) BigDecimal nonTanishqGoldGrams,
			@RequestParam(name = "transactionId", required = true) String transactionId,
			@RequestParam(name = "referenceId", required = true) String referenceId);

	@GetMapping("integration/v2/digi-gold/verify-otp")
	public DigiGoldOtpResponseDto verifyOtp(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "mobileNo", required = true) String mobileNo,
			@RequestParam(name = "goldGrams", required = true) BigDecimal goldGrams,
			@RequestParam(name = "otp", required = true) String otp,
			@RequestParam(name = "transactionId", required = true) String transactionId);

	@GetMapping("integration/v2/digi-gold/redeem")
	public DigiGoldRedeemDto redeemGold(
			@RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestParam(name = "transactionType", required = true) String transactionType,
			@RequestParam(name = "mobileNo", required = true) String mobileNo,
			@RequestParam(name = "goldGrams", required = true) BigDecimal goldGrams,
			@RequestParam(name = "otp", required = true) String otp,
			@RequestParam(name = "transactionId", required = true) String transactionId);

	@GetMapping("integration/v2/digi-gold/cancel")
	public DigiGoldRedeemDto cancelTransaction(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "transactionIdDigiGold", required = true) String transactionIdDigiGold,
			@RequestParam(name = "transactionId", required = true) String transactionId);

	@PutMapping(value = "integration/v2/ghs/accounts/status")
	BooleanResponse updateGhsAccountMasterStatus(@RequestParam(name = "vendorCode", required = true) String vendorCode,
			@RequestParam(name = "accountNo", required = true) Integer accountNo,
			@RequestParam(name = "status", required = true) String status);

	@PostMapping("integration/v2/legacy/outbound/gift-voucher")
	public Object getGiftVoucher(@RequestBody GVRequestDto giftStatusReq);

	@GetMapping("integration/v2/ghs/credit-notes/status")
	public StringResponse checkCNStatus(
			@ApiParam(name = "ghsDocNo", value = "ghs doc number available in download list", required = true) @RequestParam(name = "ghsDocNo", required = true) int ghsDocNo,
			@ApiParam(name = "fiscalYear", value = "credit note fiscal year", required = true) @RequestParam(name = "fiscalYear", required = true) int fiscalYear,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode);

	@GetMapping("integration/v2/customer-order")
	public Object getCustomerOrderData(@RequestParam(name = "locationCode", required = true) String locationCode);

	@PostMapping("integration/v2/customer-order/stn-update-status")
	public Object updateStatus(@RequestBody ComUpdateRequestDto comUpdateRequestDto);

	@GetMapping("integration/v2/customer-order/com")
	public Object getCustomerOrderComData(@RequestParam(name = "locationCode", required = true) String locationCode);

	@PostMapping("integration/v2/customer-order/confirm")
	public List<COResponseDto> confirmCustomerOrder(
			@RequestBody @Valid ConfirmCustomerOrderDetailsDto confirmCustomerOrderDetailsDto);

	@PostMapping(value = "integration/v2/pan")
	public PanDocDetailsResponseDto verifyPanDetails(
			@RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestParam(name = "verificationType", required = true) @ValueOfEnum(enumClass = PanDocVerificationEnum.class) String verificationType,
			@RequestParam(name = "panCardNo", required = false) String panCardNo);

	@GetMapping(value = "integration/v2/legacy/inbound/legacy_view-tcs")
	public List<CustomerTcsDetailsDto> retrieveLegacyTcsPaymentDetails(
			@ApiParam(value = "value", required = true) @RequestParam(name = "searchField", required = true) String searchField,
			@ApiParam(value = "type of search", allowableValues = "MOBILE_NO, ULP_ID", required = true) @RequestParam(name = "searchType", required = true) @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@ApiParam(value = "fiscalYear", required = true) @RequestParam(name = "fiscalYear",required = true) Short fiscalYear,
			@ApiParam(value = "locationCode", required = true)@RequestParam(name = "locationCode",required = true) String locationCode);
	
	@PostMapping(value = "integration/v2/ghs/revenue")
	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenue(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode);
	
    @GetMapping(value = "integration/v2/service-poss/cash-payment")
    public ServiceCashCollectedDto getCashCollectedAtServicePoss(
    		@RequestParam(name = "mobileNo" ,required = true) String mobileNo,
   		    @RequestParam(name = "locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
   			@ApiParam(name = "businessDate", value = "Provide 'businessDate', format: yyyy-MM-dd", required = true) @RequestParam(name = "businessDate", required = true) String businessDate);
    
	@PostMapping(value = "integration/v2/service-poss/todays-revenue")
	public Map<String, List<ServicePossRevenueDto>> getServiceTodayRevenue(
			@RequestBody @Valid @ApiParam(required = true) ServicePossRequestDto servicePossRequestDto);
	
	@PostMapping(value = "integration/v2/service-poss/eod-revenue")
	public Map<String, List<ServicePossRevenueDto>>  getServiceTodayRevenueForEod(
			@RequestBody @Valid @ApiParam(required = true) ServicePossRequestDto servicePossRequestDto);
	
	@PostMapping(value = "integration/v2/service-poss/btqMetalRate")
	Object updateBtqMetalRate(
			@RequestBody @Valid @ApiParam(required = true) List<ServiceMetalRequestDto> serviceMetalRequestDtoList);
	
	@GetMapping(value = "integration/v2/document/download/file-path1")
	ResponseEntity<Resource> getFileInByteArrayResponse1(@RequestParam(value = "path") String filePath);
    
    }

