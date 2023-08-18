/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
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
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.EventCashMemoDto;
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
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.GhsDiscountVoucherRedeemResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.service.CashMemoEpossService;
import com.titan.poss.sales.service.IntegrationService;

import feign.Response;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesIntegrationService")
public class IntegrationServiceImpl implements IntegrationService {

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private CashMemoEpossService cashMemoEpossService;

	@Override
	public GcResponseDto getGiftCardBalance(String vendorCode, String cardNumber, String trackData,
			Boolean otpRequired) {

		return integrationServiceClient.getGiftCardBalance(vendorCode, cardNumber, trackData, otpRequired,
				GiftCardTypeEnum.GIFTCARD_CODE);
	}

	@Override
	public PaymentAuditDto savePaymentCardAuditData(String vendorCode, PaymentAuditDto unipayAuditDto) {

		return integrationServiceClient.savePaymentCardAuditData(vendorCode, unipayAuditDto);
	}

	@Override
	public PaymentCreateResponseDto createPaymentLink(String vendorCode, String paymentId,
			PaymentRequestDto paymentRequestDto) {

		return integrationServiceClient.createPaymentLink(vendorCode, paymentId, paymentRequestDto);
	}

	@Override
	public PaymentVerifyResponseDto verifyPaymentStatus(String vendorCode, String transactionId) {

		return integrationServiceClient.verifyPaymentStatus(vendorCode, transactionId);
	}

	@Override
	public CustomerDto searchLoyaltyCustomer(String vendorCode, String customerSearchType, String value) {

		return integrationServiceClient.searchLoyaltyCustomer(vendorCode, customerSearchType, null, value);
	}

	@Override
	public GcActivateResponseDto activateGiftCard(String vendorCode,
			GiftCardBaseActivateRequestDto giftCardActivateRequestDto) {

		return integrationServiceClient.activateGiftCard(vendorCode, giftCardActivateRequestDto);
	}

	@Override
	public GcResponseDto cancelActivateGiftCard(String vendorCode,
			GiftCardBaseCancelActivateDto giftCardCancelActivateDto) {

		return integrationServiceClient.cancelActivateGiftCard(vendorCode, giftCardCancelActivateDto);
	}

	@Override
	public RedeemPointsDto redeemLoyaltyPoints(String vendorCode, UlpRedeemLoyaltyPointsDto redeemLoyaltyPointsDto) {

		return integrationServiceClient.redeemLoyaltyPoints(vendorCode, redeemLoyaltyPointsDto);
	}

	@Override
	public UlpReverseRedeemResponseDto reverseRedeemedLoyaltyPoints(String vendorCode,
			UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto) {

		return integrationServiceClient.reverseRedeemedLoyaltyPoints(vendorCode, reverseRedeemLoyaltyPointsDto);
	}

	@Override
	public UlpBalanceResponseDto getLoyaltyPointsBalance(String vendorCode, String ulpNo) {

		return integrationServiceClient.getLoyaltyPointsBalance(vendorCode, ulpNo);
	}

	@Override
	public CustomerDto createLoyaltyCustomer(String vendorCode, CustomerAddDto customerAddDto) {

		return integrationServiceClient.createLoyaltyCustomer(vendorCode, null, customerAddDto);
	}

	@Override
	public GcCustomerResponseDto getGiftCardCustomerInfo(String vendorCode, String giftCardNumber) {

		return integrationServiceClient.getGiftCardCustomerInfo(vendorCode, giftCardNumber);
	}

	@Override
	public GcResponseDto redeemGiftCardBalance(String vendorCode, GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto,
			GiftCardTypeEnum giftCardTypeEnum) {

		return integrationServiceClient.redeemGiftCardBalance(vendorCode, giftCardRedeemRequestDto, giftCardTypeEnum);
	}

	@Override
	public ApiResponseDto callEpossAPI(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody) {

		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(httpMethod);
		epossApiReqDto.setRelativeUrl(relativeUrl);
		epossApiReqDto.setRequestParams(requestParams);
		epossApiReqDto.setReqBody(reqBody);
		log.trace("reqBody :- {}", MapperUtil.getJsonString(reqBody));
		return integrationServiceClient.callEpossAPI(epossApiReqDto);
	}

	@Override
	public Response callEpossAPIWoError(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody) {

		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(httpMethod);
		epossApiReqDto.setRelativeUrl(relativeUrl);
		epossApiReqDto.setRequestParams(requestParams);
		epossApiReqDto.setReqBody(reqBody);

		return integrationServiceClient.callEpossAPIWoError(epossApiReqDto);

	}

	@Override
	public UlpBaseResponseDto updateLoyaltyCustomer(String vendorCode, CustomerUpdateDto customerULPUpdateDto) {

		return integrationServiceClient.updateLoyaltyCustomer(vendorCode, customerULPUpdateDto);
	}

	@Override
	public Response runThirdPartyAPI(HttpMethod httpMethod, String url, Map<String, String> requestParams,
			Object reqBody) {

		ThirdPartyApiReqDto thirdPartyApiReqDto = new ThirdPartyApiReqDto();
		thirdPartyApiReqDto.setHttpMethod(httpMethod);
		thirdPartyApiReqDto.setUrl(url);
		thirdPartyApiReqDto.setRequestParams(requestParams);
		thirdPartyApiReqDto.setReqBody(reqBody);

		return integrationServiceClient.runThirdPartyAPI(thirdPartyApiReqDto);

	}

	@Override
	public BusinessDayActivityDto bodAtGhs(String vendorCode, BusinessDateDto businessDateDto) {

		return integrationServiceClient.bodAtGhs(vendorCode, businessDateDto);
	}

	@Override
	public BusinessDayActivityDto eodAtGhs(String vendorCode, BusinessDateDto businessDateDto) {

		return integrationServiceClient.eodAtGhs(vendorCode, businessDateDto);
	}

	@Override
	public GhsAccountDetailsResponseDto getGhsAccountDetails(String vendorCode, int accountNo) {

		return integrationServiceClient.getGhsAccountDetails(vendorCode, accountNo);
	}

	@Override
	public GhsRedeemAccountResponseDto redeemGhsAccount(String vendorCode, GhsRedeemAccountDto ghsRedeemAccountDto) {

		return integrationServiceClient.redeemGhsAccount(vendorCode, ghsRedeemAccountDto);
	}

	@Override
	public GhsCashResponseDto getCashCollectedAtGHS(String vendorCode, String ulpId, String mobileNo,
			String businessDate) {

		return integrationServiceClient.getCashCollectedAtGHS(vendorCode, ulpId, mobileNo, businessDate);
	}

	@Override
	public ListResponse<GhsDocsResponseDto> getGhsDocs(int customerId, int accountNo, String vendorCode) {

		return integrationServiceClient.getGhsDocs(customerId, accountNo, vendorCode);
	}

	@Override
	public void uploadFileToOnlineBucket(String filePath) {

		integrationServiceClient.uploadFileToOnlineBucket(filePath);
	}

	@Override
	public void runScheduler(String code, String token) {
		try {
			integrationServiceClient.runScheduler(token, code, null);
		} catch (Exception e) {
			log.info("Scheduler run failed for code: {}, reason : {}", code,
					e.getLocalizedMessage() + " \nDetails: " + e.getMessage());
		}
	}

	public void runSchedulerSynchronous(String code, String token) {
		integrationServiceClient.runScheduler(token, code, null);
	}

	@Override
	public Response getFileInByteArrayResponse(String filePath) {
		return integrationServiceClient.getFileInByteArrayResponse(filePath);
	}

	@Override
	public PresignedUrlDto getPresignedUrlOfObjects(Set<String> objectKeys, String documentType) {
		return integrationServiceClient.getPresignedUrlOfObjects(objectKeys, documentType);
	}

	@Override
	public void updateTempFile(String documentType, String oldDocumentPath, String newDocumentPath) {
		integrationServiceClient.updateTempFile(documentType, oldDocumentPath, newDocumentPath);
	}

	@Override
	public void deleteFileByPath(String filePath) {
		integrationServiceClient.deleteFileByPath(filePath);
	}

	@Override
	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenueEod(BusinessDateDto businessDate, String vendorCode) {
		return integrationServiceClient.getGhsTodayRevenueForEod(businessDate, vendorCode);
	}

	@Override
	public GcResponseDto reverseRedeemGiftCardBalance(String vendorCode,
			GiftCardBaseReverseRedeemRequestDto giftCardReverseRedeemRequestDto, GiftCardTypeEnum giftCardTypeEnum) {

		return integrationServiceClient.reverseRedeemGiftCardBalance(vendorCode, giftCardReverseRedeemRequestDto,
				giftCardTypeEnum);
	}

	@Override
	public VendorDto getVendorByType(String vendorType) {
		return integrationServiceClient.getVendorByType(vendorType);
	}

	@Override
	public UlpDiscountResponseDto availLoyaltyDiscounts(String vendorCode, UlpDiscountDto discountDto) {

		return integrationServiceClient.availLoyaltyDiscounts(vendorCode, discountDto);
	}

	@Override
	public UlpBaseResponseDto reverseAvailedDiscount(String vendorCode, UlpBillCancellationDto billCancellationDto) {

		return integrationServiceClient.reverseAvailedDiscount(vendorCode, billCancellationDto);
	}

	@Override
	public GhsDiscountVoucherResponseDto getDiscountVoucherDetails(String vendorCode, Integer discountVoucherNo,
			Integer accountNo) {

		return integrationServiceClient.getDiscountVoucherDetails(vendorCode, discountVoucherNo, accountNo);
	}

	@Override
	public GhsDiscountVoucherRedeemResponseDto redeemGhsDiscountVoucher(String vendorCode, String discountVoucherNo,
			Integer accountNo, String transactionId) {

		return integrationServiceClient.redeemGhsDiscountVoucher(vendorCode, discountVoucherNo, accountNo,
				transactionId);
	}

	@Override
	public void updateDiscountVoucher(String vendorCode, String discountVoucherNo, int accountNo, String transactionId,
			String status) {

		integrationServiceClient.updateDiscountVoucher(vendorCode, discountVoucherNo, accountNo, transactionId, status);

	}

	@Override
	public Boolean resendPaymentLink(String vendorCode, String transactionId, String notifyBy) {
		return integrationServiceClient.resendPaymentLink(vendorCode, transactionId, notifyBy);
	}

	@Override
	public void transferCnToLegacy(String srcCNId, String locationCode) {
		integrationServiceClient.transferCreditNote(srcCNId, locationCode);
	}

	@Override
	public DigiGoldBalanceResponseDto getDigiGoldBalance(String mobileNo, String transactionId) {
		return integrationServiceClient.fetchBalance(VendorCodeEnum.SAFE_GOLD.name(), mobileNo, transactionId);
	}

	@Override
	public DigiGoldSellingPriceDto sellingPrice(String mobileNo, String transactionId) {
		return integrationServiceClient.sellingPrice(VendorCodeEnum.SAFE_GOLD.name(), mobileNo, transactionId);
	}

	@Override
	public BooleanResponse sendDigiGoldOtp(String mobileNo, BigDecimal tanishqGoldGrams, BigDecimal nonTanishqGoldGrams,
			String transactionId, String referenceId) {
		return integrationServiceClient.sendOtp(VendorCodeEnum.SAFE_GOLD.name(), mobileNo, tanishqGoldGrams,
				nonTanishqGoldGrams, transactionId, referenceId);
	}

	@Override
	public DigiGoldOtpResponseDto verifyDigiGoldOtp(String mobileNo, BigDecimal totalGrams, String otp,
			String transactionId) {
		return integrationServiceClient.verifyOtp(VendorCodeEnum.SAFE_GOLD.name(), mobileNo, totalGrams, otp,
				transactionId);
	}

	@Override
	public DigiGoldRedeemDto redeemDigiGoldBalance(String transactionType, String mobileNo, BigDecimal goldrams,
			String otp, String transactionId) {
		return integrationServiceClient.redeemGold(VendorCodeEnum.SAFE_GOLD.name(), transactionType, mobileNo, goldrams,
				otp, transactionId);
	}

	@Override
	public void reverseDigiGoldRedemption(String transactionId, String digiGoldTransactionId) {
		integrationServiceClient.cancelTransaction(VendorCodeEnum.SAFE_GOLD.name(), digiGoldTransactionId,
				transactionId);
	}

	@Override
	public GhsCreditNoteTransferDto cnTransferEghs(GhsCreditNoteTransferDto ghsCreditNoteRequest) {
		return integrationServiceClient.transferCreditNotesToGhs(VendorCodeEnum.GHS.name(), ghsCreditNoteRequest);
	}

	@Override
	public GhsAccountMasterUpdateDto updateGhsAccountMaster(String vendorCode,
			GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto) {
		return integrationServiceClient.updateGhsAccountMaster(vendorCode, ghsAccountMasterUpdateDto);
	}

	@Override
	public EinvoiceIrnDetailsResponseDto generateIrn(String vendorCode, String transactionType,
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto) {
		return integrationServiceClient.generateIrn(vendorCode, transactionType, einvoiceIrnDetailsDto);
	}

	@Override
	public EinvoiceGstVerifyResponseDto verifyGstIn(String vendorCode, String gstIn) {
		return integrationServiceClient.verifyGstIn(vendorCode, gstIn);
	}

	@Override
	public EventResponseDto cashMemoDetails(String vendorCode, String txnId, String subTxnType, String status,
			Boolean isScheduled, EventCashMemoDto eventCashMemoDto) {
		return integrationServiceClient.cashMemoDetails(vendorCode, txnId, subTxnType, status, isScheduled,
				eventCashMemoDto);
	}

	@Override
	public void sendNotification(NotificationDto notificationDto) {
		integrationServiceClient.sendNotification(notificationDto);

	}

	@Override
	public CashMemoEntities callLegacyCashMemo(String locationCode, Integer docNo, Short fiscalYear,Boolean isGRNAllowed) {
		Object cashMemoObject = integrationServiceClient.getCashMemoDetails(locationCode, docNo, fiscalYear,isGRNAllowed);
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		CashMemoEntities cashMemoEntities = mapper.convertValue(cashMemoObject, new TypeReference<CashMemoEntities>() {
		});

		log.info("customer pan number: "+ cashMemoEntities.getCustomer().getCustomer().getCustTaxNo());
		if (cashMemoEntities.getOriginalTxn() != null) {
			cashMemoEntities = cashMemoEpossService.persistLegacyCm(cashMemoEntities,null);
			log.info("customer pan number: "+ cashMemoEntities.getCustomer().getCustomer().getCustTaxNo());	
		}
		return cashMemoEntities;
	}
	
	@Override
	public CashMemoEntities callLegacyTepCashMemo(String locationCode, Integer docNo, Short fiscalYear,Boolean isInterBrand,
			Boolean isFullValueTEP,List<CashMemoDetailsDao> cmDetailsList) {
		Object cashMemoObject = integrationServiceClient.getTepCashMemoDetails(locationCode, docNo, fiscalYear,isInterBrand,isFullValueTEP);
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		CashMemoEntities cashMemoEntities = mapper.convertValue(cashMemoObject, new TypeReference<CashMemoEntities>() {
		});

		if (cashMemoEntities.getOriginalTxn() != null) {
			cashMemoEntities = cashMemoEpossService.persistLegacyCm(cashMemoEntities,cmDetailsList);
		}
		return cashMemoEntities;
	}
	@Override
	public List<CmForCustomerLegacyDto> callLegacyGetCmForCustomer(String locationCode, String itemCode, String customerMobileNo, String customerId,
			Boolean isMigratedIgnored) {
		List<CmForCustomerLegacyDto> cashMemoObject = integrationServiceClient.getCMforCustomer(locationCode, itemCode, customerMobileNo,customerId,isMigratedIgnored);
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<CmForCustomerLegacyDto> cashMemoEntities = mapper.convertValue(cashMemoObject, new TypeReference<List<CmForCustomerLegacyDto>>() {
		});

//		if (cashMemoEntities.getOriginalTxn() != null) {
//			cashMemoEntities = cashMemoEpossService.persistLegacyCm(cashMemoEntities);
//		}
		return cashMemoEntities;
	}
	@Override
	public BooleanResponse updateGhsAccountMasterStatus(String vendorCode, Integer accountNo, String status) {
		return integrationServiceClient.updateGhsAccountMasterStatus(vendorCode, accountNo, status);
	}

	@Override
	public void updateLegacyGV(GVRequestUpdateDto gvRequest) {
		log.info("GV req in sales: " + MapperUtil.getStringFromJson(gvRequest));
		List<GVStatusDto> giftVoucherUpdate = integrationServiceClient.getGiftVoucherUpdate(gvRequest);
		Map<BigInteger, GVStatusDto> giftStatusLegacyMap = new HashMap<>();
		Boolean isFailed = Boolean.FALSE;
		GVStatusDto gvStatusDtoFailed = null;
		for (GVStatusDto gvStatusDto : giftVoucherUpdate) {
			if ("FAILED".equalsIgnoreCase(gvStatusDto.getResult())) {
				giftStatusLegacyMap.put(gvStatusDto.getSerialNo(), gvStatusDto);
				gvStatusDtoFailed = gvStatusDto;
				isFailed = Boolean.TRUE;
			}
		}
		if (Boolean.TRUE.equals(isFailed)) {

			throw new ServiceException("GV isn't available for redemption, status: {status} , remark: {remark}",
					"ERR-PAY-048", giftStatusLegacyMap,
					Map.of("status", gvStatusDtoFailed.getResult(), "remark", gvStatusDtoFailed.getMessage()));
		}
	}

	@Override
	public StringResponse checkCNStatus(int ghsDocNo, int fiscalYear, String vendorCode) {

		return integrationServiceClient.checkCNStatus(ghsDocNo, fiscalYear, vendorCode);
	}

	@Override
	public Object getGiftVoucher(GVRequestDto giftStatusReq) {
		return integrationServiceClient.getGiftVoucher(giftStatusReq);
	}

	@Override
	public BooleanResponse checkBODStatus(String vendorCode, BusinessDateDto businessDateDto, String locationCode) {
		return integrationServiceClient.checkBODStatus(vendorCode, businessDateDto, locationCode);
	}
	
	@Override
	public BoutiqueGoldPriceMasterDto updateGR(String vendorCode,BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto)
	{
		return integrationServiceClient.updateGR(vendorCode, boutiqueGoldPriceMasterDto);
	}
	
    @Override
    public ServiceCashCollectedDto getCashCollectedAtServicePoss(String mobileNo,String locationCode, String businessDate) {
        return integrationServiceClient.getCashCollectedAtServicePoss(mobileNo, locationCode, businessDate);
        
    }
    
    @Override
    public Map<String, List<ServicePossRevenueDto>> getServiceTodayRevenueForEod(ServicePossRequestDto servicePossRequestDto) {
		return integrationServiceClient.getServiceTodayRevenueForEod(servicePossRequestDto);
	}


}
