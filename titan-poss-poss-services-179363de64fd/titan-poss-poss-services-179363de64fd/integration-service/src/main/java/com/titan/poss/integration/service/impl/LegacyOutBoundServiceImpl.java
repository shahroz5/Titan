/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CMLegacyPaymentResponseDto;
import com.titan.poss.core.dto.CMLegacyResponseDto;
import com.titan.poss.core.dto.CMVariantDto;
import com.titan.poss.core.dto.CessDetailDto;
import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.CreditNoteLegacyOutboundCustomerDto;
import com.titan.poss.core.dto.CreditNoteLegacyOutboundDetailsDto;
import com.titan.poss.core.dto.CreditNoteLegacyOutboundRequestDto;
import com.titan.poss.core.dto.CreditNoteLegacyResponseDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.ItemHallmarkDetailsDto;
import com.titan.poss.core.dto.ItemMasterLegacyDto;
import com.titan.poss.core.dto.ItemStoneMappingDto;
import com.titan.poss.core.dto.LotNumberDetailsDto;
import com.titan.poss.core.dto.LotNumberMasterDto;
import com.titan.poss.core.dto.MakingChargeDetailsDto;
import com.titan.poss.core.dto.MaterialPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.MultiMetalDetailsDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StonePriceDetailsDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.dto.ThirdPartyApiReqDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.SalesServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.CashMemoDetailsDto;
import com.titan.poss.integration.dto.request.LegacyCmDetailsDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.LegacyOutBoundService;
import com.titan.poss.integration.service.RestClientService;
import com.titan.poss.integration.util.HttpClientUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.CashMemoEntity;
import com.titan.poss.sales.dto.CustomerEpossSearchDto;
import com.titan.poss.sales.dto.InstitutionalCustomerCreateDto;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.LegacyOtherChargesDetailsDto;
import com.titan.poss.sales.dto.LegacyOtherChargesDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.RegularCustomerCreateDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.WeightDetailsDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
@Slf4j
public class LegacyOutBoundServiceImpl implements LegacyOutBoundService {

	@Autowired
	private RestClientService apiCaller;

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private SalesServiceClient salesServiceClient;

	@Autowired
	private EngineServiceClient engineClient;

	private static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
	private static final String LEGACY_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";

	private static final String ERR_INT_087 = "ERR-INT-087";
	private static final String CALL_FAIL = "Call to legacy EPOSS failed";

	private static final String ERR_INT_089 = "ERR-INT-089";
	private static final String UPDATE_FAIL = "Update to legacy EPOSS failed";

	private static final String ERR_INT_096 = "ERR-INT-096";
	private static final String INVALID_CASHMEMO = "CashMemo not found - {docNo} {locationCode} {fiscalYear}";
	private static final String ERR_INT_006 = "ERR-INT-006";
	private static final String RECORD_NOT_FOUND = "Record not found";
	private static final String ERR_INT_098 = "ERR-INT-098";
	private static final String INVALID_CASHMEMO_IN_LEGACY = "CashMemo not found in legacy - {docNo} {locationCode} {fiscalYear}";
	private static final String ERR_INT_21016 = "ERR-INT-21016";
	private static final String INVALID_REQUEST = "Inter Botique Transfer not allowed for this creditNote of type - {creditNoteType}";
	private static final String ERR_CORE_003 = "ERR-CORE-003";
	private static final String CUSTOMER = "customer";
	private static final String CUSTOMER_LOCATION_MAPPING = "customerLocationMapping";
	private static final String CUSTOMER_LOCATION_MAPPING_ID = "customerLocationMappingId";
	private static final String CUSTOMER_DETAILS = "customerDetails";
	private static final String EMAIL_VALIDATION_DETAILS = "emailValidationDetails";
	private static final String API_RESPONSE = "apiResponse";
	private static final String LOCATION_CODE = "locationCode";
	private static final String FISCAL_YEAR = "fiscalYear";
	private static final String CREATED_BY = "createdBy";
	private static final String CREATED_DATE = "createdDate";
	private static final String LAST_MODIFIED_BY = "lastModifiedBy";
	private static final String LAST_MODIFIED_DATE = "lastModifiedDate";
	private static final String BIRTHDAY = "birthday";
	private static final String CREDIT_NOTE = "creditNote";
	private static final String SALES_TXN = "salesTxn";
	private static final String FROZEN_RATE_DETAILS = "frozenRateDetails";
	private static final String DISCOUNT_DETAILS = "discountDetails";
	private static final String DOC_NO = "docNo";
	private static final String CREDIT_NOTE_TYPE = "creditNoteType";
	private static final String DOC_DATE = "docDate";
	private static final String AMOUNT = "amount";
	private static final String CASH_COLLECTED = "cashCollected";
	private static final String REMARKS = "remarks";
	private static final String TXN_TYPE = "txnType";
	private static final String PRINTS = "prints";
	private static final String CUSTOMER_ID = "customerId";
	private static final String CUSTOMER_NAME = "customerName";
	private static final String TITLE = "title";
	private static final String EMAIL_ID = "emailId";
	private static final String IS_ACTIVE = "isActive";
	private static final String MOBILE_NUMBER = "mobileNumber";
	private static final String ANNIVERSARY = "anniversary";
	private static final String SPOUSE_BIRTH_DAY = "spouseBirthday";
	private static final String ULP_ID = "ulpId";
	private static final String CAN_SEND_SMS = "canSendSMS";
	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String CATCHMENT_NAME = "catchmentName";
	private static final String IS_HARD_COPY_SUBMITTED = "isHardCopySubmitted";
	private static final String ID_PROOF = "idProof";
	private static final String ID_NUMBER = "idNumber";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String CITY = "city";
	private static final String STATE = "state";
	private static final String ADDRESS_LINES = "addressLines";
	private static final String PIN_CODE = "pincode";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";
	private static final String VENDOR_NAME = "vendorName";
	private static final String LEGACY = "LEGACY";
	private static final String GET_PMLA_URI = "api/PMLA/GetPMLA";
	private static final String BUSINESS_DATE = "dtBusinessDate";
	private static final String ULP_MEMBERSHIP_ID = "ulpMembershipId";

	public static final Map<Integer, String> cmStatus = Map.of(2, "CONFIRMED", 13, "DELETED", 1, "OPEN", 12, "REJECTED",
			3, "CANCELLED", 7, "CANCELLEDWithCN", 8, "CANCELLEDWithRefund");

	public static final Map<Integer, String> stateCode = Map.ofEntries(Map.entry(1, "KARNATAKA"),
			Map.entry(2, "TAMIL NADU"), Map.entry(3, "KERALA"), Map.entry(4, "ANDHRA PRADESH"), Map.entry(5, "GOA"),
			Map.entry(6, "PONDICHERRY"), Map.entry(7, "MAHARASHTRA"), Map.entry(8, "GUJARAT"),
			Map.entry(9, "MADHYA PRADESH"), Map.entry(10, "CHATTISGARH"), Map.entry(11, "DELHI"),
			Map.entry(12, "RAJASTHAN"), Map.entry(13, "UTTAR PRADESH"), Map.entry(14, "UTTARANCHAL"),
			Map.entry(15, "HIMACHAL PRADESH"), Map.entry(16, "JAMMU & KASHMIR"), Map.entry(17, "PUNJAB"),
			Map.entry(18, "HARYANA"), Map.entry(19, "CHANDIGARH"), Map.entry(20, "WEST BENGAL"), Map.entry(21, "BIHAR"),
			Map.entry(22, "ASSAM"), Map.entry(23, "JHARKHAND"), Map.entry(24, "ORISSA"),
			Map.entry(25, "TAMIL NADU - L3"), Map.entry(26, "WEST BENGAL - L3"), Map.entry(27, "GUJARAT - L 3"),
			Map.entry(28, "MADHYA PRADESH - L 3"), Map.entry(29, "UTTAR PRADESH - L 3"), Map.entry(30, "TRIPURA"),
			Map.entry(999, "NA"), Map.entry(1000, "UTTARAKHAND"), Map.entry(1001, "TELANGANA"),
			Map.entry(1002, "ODISHA"), Map.entry(1003, "SIKKIM"), Map.entry(1004, "Dadra and Nagar Haveli"),
			Map.entry(1005, "Arunachal Pradesh"), Map.entry(1006, "MANIPUR"), Map.entry(1007, "DAMAN AND DIU"),
			Map.entry(1008, "MIZORAM"), Map.entry(1009, "NAGALAND"), Map.entry(1010, "Meghalaya"));

	/**
	 * This method will List the GiftVouchar Details in Legacy
	 * 
	 * @param giftStatusReq
	 * @return List<LegacyGVResponse>
	 */
	@Override
	public List<LegacyGVResponse> getGiftVoucherService(GVRequestDto giftStatusReq) {
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		apiRequest.setReqBody(giftStatusReq);
		apiRequest.setHttpMethod(HttpMethod.POST);
		ApiResponseDto apiResponse = apiCaller.callLegacyAPI(apiRequest, "getGVUrl");
		if (Integer.valueOf(HttpStatus.SC_OK).compareTo(apiResponse.getHttpResponseCode()) == 0) {
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(apiResponse.getResponse()))
					.getAsJsonObject();
			return MapperUtil.jsonStrToList(jsonObject.get("gvDetails").toString(), LegacyGVResponse.class);
		} else {
			throw new ServiceException(CALL_FAIL, ERR_INT_087, apiResponse);
		}

	}

	/**
	 * This method will update Gift-Voucher status in Legacy
	 * 
	 * @param giftStatusReq
	 * @return List<GVStatusDto>
	 */
	@Override
	public List<GVStatusDto> getGiftVoucherUpdateService(GVRequestUpdateDto giftStatusReq) {
		log.info("GV req in integration: " + MapperUtil.getStringFromJson(giftStatusReq));
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		apiRequest.setReqBody(giftStatusReq);
		apiRequest.setHttpMethod(HttpMethod.POST);
		log.info("Legacy Update req :\n " + MapperUtil.getJsonFromString(MapperUtil.getJsonString(giftStatusReq)));
		ApiResponseDto apiResponse = apiCaller.callLegacyAPI(apiRequest, "UpdateGVUrl");
		if (Integer.valueOf(HttpStatus.SC_OK).compareTo(apiResponse.getHttpResponseCode()) == 0) {
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(apiResponse.getResponse()))
					.getAsJsonObject();
			return MapperUtil.jsonStrToList(jsonObject.get("gvStatus").toString(), GVStatusDto.class);
		} else {
			log.info("Response failed : " + apiResponse.toString());
			throw new ServiceException(UPDATE_FAIL, ERR_INT_089, apiResponse);
		}

	}

	@Override
	public CreditNoteLegacyResponseDto transferCreditNote(String id, String destLocationCode) {
		CreditNoteLegacyResponseDto creditNoteLegacyResponseDto = new CreditNoteLegacyResponseDto();
		CreditNoteLegacyOutboundRequestDto creditNoteTransfer = getCreditNoteDetails(id, destLocationCode);
		log.info("Legacy CN Request : " + MapperUtil.getJsonString(creditNoteTransfer));
		if (creditNoteTransfer.getCreditNote().getFrozenRateDetails() != null)
			throw new ServiceException("Gold rate is freezed please remove the gold rate before transfer ",
					"ERR-INT-21015");
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(creditNoteTransfer.getCreditNote().getLocationCode());

		Object ruleDetails = engineClient.getRuleValues(creditNoteTransfer.getCreditNote().getCreditNoteType(),
				ruleRequestListDto);
		log.info("ruleDetails......................."+ruleDetails);
		String string = MapperUtil.getStringFromJson(ruleDetails);
		log.info("String ..............................................."+string);
		try {
			JsonNode dataNode = MapperUtil.getObjectMapperInstance().readTree(string);
			if (!dataNode.path("isBoutiqueWiseTransferAllowed").asBoolean()) {

				throw new ServiceException(INVALID_REQUEST, ERR_INT_21016,
						Map.of("creditNoteType", creditNoteTransfer.getCreditNote().getCreditNoteType()));
			}
		} catch (IOException e) {
			throw new ServiceException("UNABLE TO PARSE JSON", ERR_CORE_003);
		}
		//Set NAP creditNoteType Name To Legacy creditNoteType Name
		if(creditNoteTransfer.getCreditNote().getCreditNoteType()!=null && creditNoteTransfer.getCreditNote().getCreditNoteType().equals(CNType.ADV.toString())){
			creditNoteTransfer.getCreditNote().setCreditNoteType("Advance");
		}
		else if(creditNoteTransfer.getCreditNote().getCreditNoteType()!=null && creditNoteTransfer.getCreditNote().getCreditNoteType().equals(CNType.BILL_CANCELLATION.toString())){
			creditNoteTransfer.getCreditNote().setCreditNoteType("BillCancellation");
		}
		else if(creditNoteTransfer.getCreditNote().getCreditNoteType()!=null && creditNoteTransfer.getCreditNote().getCreditNoteType().equals(CNType.CN_IBT.toString())){
			creditNoteTransfer.getCreditNote().setCreditNoteType("CNIntBTQ");
		}
		else if(creditNoteTransfer.getCreditNote().getCreditNoteType()!=null && creditNoteTransfer.getCreditNote().getCreditNoteType().equals(CNType.DIGI_GOLD_TANISHQ.toString())){
			creditNoteTransfer.getCreditNote().setCreditNoteType("Digi Gold Tanishq");
		}
		else if(creditNoteTransfer.getCreditNote().getCreditNoteType()!=null && creditNoteTransfer.getCreditNote().getCreditNoteType().equals(CNType.DIGI_GOLD_NON_TANISHQ.toString())){
			creditNoteTransfer.getCreditNote().setCreditNoteType("Digi Gold NonTanishq");
		}
		
		//Set NAP SrcCreditNoteType Name To Legacy SrcCreditNoteType Name
		if(creditNoteTransfer.getCreditNote().getSourceCnType()!=null && creditNoteTransfer.getCreditNote().getSourceCnType().equals(CNType.ADV.toString())){
			creditNoteTransfer.getCreditNote().setSourceCnType("Advance");
		}
		else if(creditNoteTransfer.getCreditNote().getSourceCnType()!=null && creditNoteTransfer.getCreditNote().getSourceCnType().equals(CNType.BILL_CANCELLATION.toString())){
			creditNoteTransfer.getCreditNote().setSourceCnType("BillCancellation");
		}
		else if(creditNoteTransfer.getCreditNote().getSourceCnType()!=null && creditNoteTransfer.getCreditNote().getSourceCnType().equals(CNType.CN_IBT.toString())){
			creditNoteTransfer.getCreditNote().setSourceCnType("CNIntBTQ");
		}
		else if(creditNoteTransfer.getCreditNote().getSourceCnType()!=null && creditNoteTransfer.getCreditNote().getSourceCnType().equals(CNType.DIGI_GOLD_TANISHQ.toString())){
			creditNoteTransfer.getCreditNote().setSourceCnType("Digi Gold Tanishq");
		}
		else if(creditNoteTransfer.getCreditNote().getSourceCnType()!=null && creditNoteTransfer.getCreditNote().getSourceCnType().equals(CNType.DIGI_GOLD_NON_TANISHQ.toString())){
			creditNoteTransfer.getCreditNote().setSourceCnType("Digi Gold NonTanishq");
		}
        
		Gson gson = new Gson();
		String jsonString = gson.toJson(creditNoteTransfer);
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		VendorDao vendorDao = vendorRepo.findByVendorCode(VendorCodeEnum.LEGACY_API.name());
		JsonObject jsonObj = new JsonParser().parse(vendorDao.getVendorDetails()).getAsJsonObject();
		String uri = vendorDao.getBaseurl()
				+ jsonObj.getAsJsonObject("data").get("creditNoteTransferUrl").getAsString();
		HttpPost sendPostRequest = new HttpPost(uri);
		sendPostRequest.addHeader("Content-Type", "application/json");
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			log.info("Request to Legacy" + jsonObject.toString());	
			sendPostRequest.setEntity(new StringEntity(jsonObject.toString()));
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendorDao.getRetryCount(),
					vendorDao.getTimeOutSeconds(), null);
			log.info("httpresponse...................\n "+MapperUtil.getStringFromJson(httpResponseUtil));
			} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, LEGACY));
		}
		creditNoteLegacyResponseDto.setCreditNoteLegacyOutboundRequestDto(creditNoteTransfer);
		if (httpResponseUtil.getHttpResponseCode() == 200) {
			try {
				salesServiceClient.updateCreditNoteLegacy(id, CommonUtil.getLocationCode(), destLocationCode);
				creditNoteLegacyResponseDto.setStatus(Boolean.TRUE);
				return creditNoteLegacyResponseDto;
			} catch (Exception e) {
				throw new ServiceException("Error while updating the credit note status after transferring to legacy",
						"ERR-INT-092", e.getMessage());
			}
		} else {
			creditNoteLegacyResponseDto.setStatus(Boolean.FALSE);
			creditNoteLegacyResponseDto.setErrorMessage(httpResponseUtil.getResponse());
			return creditNoteLegacyResponseDto;
		}

	}

	private CreditNoteLegacyOutboundRequestDto getCreditNoteDetails(String id, String destLocationCode) {
		Object responseObject = salesServiceClient.getCreditNoteDetailsForLegacy(id);
		log.info("response object ................."+responseObject);
		Gson gson = new Gson();
		String jsonString = gson.toJson(responseObject);
		log.info("json print..........................."+jsonString);		
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		CreditNoteLegacyOutboundRequestDto request = new CreditNoteLegacyOutboundRequestDto();
		CreditNoteLegacyOutboundCustomerDto customer = getCustomerDetails(jsonObject);
		request.setCustomer(customer);
		CreditNoteLegacyOutboundDetailsDto details = getCreditNoteDetails(jsonObject);
		request.setCreditNote(details);
		request.setDestBtqCode(destLocationCode);
		return request;
	}

	private CreditNoteLegacyOutboundDetailsDto getCreditNoteDetails(JsonObject object) {
		CreditNoteLegacyOutboundDetailsDto creditNoteDetails = new CreditNoteLegacyOutboundDetailsDto();
		JsonObject creditNote = new JsonObject();
		JsonObject salesTxn = new JsonObject();
		if (object.get(CREDIT_NOTE) != null && !object.get(CREDIT_NOTE).isJsonNull())
			creditNote = object.get(CREDIT_NOTE).getAsJsonObject();
		if (object.get(SALES_TXN) != null && !object.get(SALES_TXN).isJsonNull())
			salesTxn = object.get(SALES_TXN).getAsJsonObject();
		if (creditNote.get(LOCATION_CODE) != null && !creditNote.get(LOCATION_CODE).isJsonNull())
			creditNoteDetails.setLocationCode(creditNote.get(LOCATION_CODE).getAsString());
		if (creditNote.get(DOC_NO) != null && !creditNote.get(DOC_NO).isJsonNull()) {
			creditNoteDetails.setDocNo(creditNote.get(DOC_NO).getAsInt());
			creditNoteDetails.setSourceCnNo(creditNote.get(DOC_NO).getAsInt());
		}
		if (creditNote.get(FROZEN_RATE_DETAILS) != null && !creditNote.get(FROZEN_RATE_DETAILS).isJsonNull())
			creditNoteDetails.setFrozenRateDetails(creditNote.get(FROZEN_RATE_DETAILS).getAsString());

		if (creditNote.get(DISCOUNT_DETAILS) != null && !creditNote.get(DISCOUNT_DETAILS).isJsonNull()) {
			JsonObject jsonData = new JsonParser().parse(creditNote.get(DISCOUNT_DETAILS).getAsString())
					.getAsJsonObject();
			if (jsonData.get("data") != null && !jsonData.get("data").isJsonNull()) {
				JsonObject jsonObject = jsonData.get("data").getAsJsonObject();
				if (jsonObject.get("ghsAccountDiscount") != null && !jsonObject.get("ghsAccountDiscount").isJsonNull()) {
					JsonObject ghsJson = jsonObject.get("ghsAccountDiscount").getAsJsonObject();
					if (ghsJson.get("discountType") != null && ghsJson.get("discountValue") != null
							&& (ghsJson.get("discountType").getAsString()
									.equals(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name())
									|| ghsJson.get("discountType").getAsString()
											.equals(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()))) {
						creditNoteDetails.setGhsBonus(ghsJson.get("discountValue").getAsBigDecimal());
					}
				}
			}
		}

		if (creditNote.get(FISCAL_YEAR) != null && !creditNote.get(FISCAL_YEAR).isJsonNull()) {
			creditNoteDetails.setFiscalYear(creditNote.get(FISCAL_YEAR).getAsInt());
			creditNoteDetails.setSourceFiscalYear(creditNote.get(FISCAL_YEAR).getAsInt());
		}
		if (creditNote.get(CREDIT_NOTE_TYPE) != null && !creditNote.get(CREDIT_NOTE_TYPE).isJsonNull()) {
			creditNoteDetails.setCreditNoteType(creditNote.get(CREDIT_NOTE_TYPE).getAsString());
			creditNoteDetails.setSourceCnType(creditNote.get(CREDIT_NOTE_TYPE).getAsString());
		}
		if (creditNote.get(DOC_DATE) != null && !creditNote.get(DOC_DATE).isJsonNull())
			creditNoteDetails.setDocDate(getParsedDateFormat(creditNote.get(DOC_DATE)));
		creditNoteDetails.setStatus(2);
		if (creditNote.get(AMOUNT) != null && !creditNote.get(AMOUNT).isJsonNull())
			creditNoteDetails.setAmount(creditNote.get(AMOUNT).getAsBigDecimal());
		if (creditNote.get(CASH_COLLECTED) != null && !creditNote.get(CASH_COLLECTED).isJsonNull())
			creditNoteDetails.setTotalCashCollected(creditNote.get(CASH_COLLECTED).getAsBigDecimal());
		    log.info("legacy cashcollected.........{}",creditNoteDetails.getTotalCashCollected());
		if (creditNote.get(CREATED_BY) != null && !creditNote.get(CREATED_BY).isJsonNull())
			creditNoteDetails.setLoginId(creditNote.get(CREATED_BY).getAsString());
		if (creditNote.get(CREATED_DATE) != null && !creditNote.get(CREATED_DATE).isJsonNull())
			creditNoteDetails.setCreatedDate(getParsedDateFormat(creditNote.get(CREATED_DATE)));
		if (creditNote.get(LAST_MODIFIED_BY) != null && !creditNote.get(LAST_MODIFIED_BY).isJsonNull())
			creditNoteDetails.setLastModifiedId(creditNote.get(LAST_MODIFIED_BY).getAsString());
		if (creditNote.get(LAST_MODIFIED_DATE) != null && !creditNote.get(CREATED_BY).isJsonNull())
			creditNoteDetails.setLastModifiedDate(getParsedDateFormat(creditNote.get(LAST_MODIFIED_DATE)));
		if (creditNote.get(REMARKS) != null && !creditNote.get(REMARKS).isJsonNull())
			creditNoteDetails.setRemarks(creditNote.get(REMARKS).getAsString());
		if (salesTxn.get(DOC_NO) != null && !salesTxn.get(DOC_NO).isJsonNull())
			creditNoteDetails.setRefDocNo(salesTxn.get(DOC_NO).getAsInt());
		if (salesTxn.get(FISCAL_YEAR) != null && !salesTxn.get(FISCAL_YEAR).isJsonNull())
			creditNoteDetails.setRefFiscalYear(salesTxn.get(FISCAL_YEAR).getAsInt());
		if (salesTxn.get(TXN_TYPE) != null && !salesTxn.get(TXN_TYPE).isJsonNull())
			creditNoteDetails.setRefDocType(salesTxn.get(TXN_TYPE).getAsString());
		if (salesTxn.get(PRINTS) != null && !salesTxn.get(PRINTS).isJsonNull())
			creditNoteDetails.setNoOfTimesPrinted(salesTxn.get(PRINTS).getAsInt());
		if (object.get(CUSTOMER_LOCATION_MAPPING) != null && !object.get(CUSTOMER_LOCATION_MAPPING).isJsonNull()
				&& object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject().get(CUSTOMER_LOCATION_MAPPING_ID) != null)
			creditNoteDetails.setCustomerNo(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(CUSTOMER_ID).getAsInt());
		if (!StringUtils.isEmpty(creditNote.get("taxDetails"))) {
			TaxCalculationResponseDto taxCalculationResponseDto = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(creditNote.get("taxDetails").getAsString()),
					TaxCalculationResponseDto.class);
			creditNoteDetails = getTaxDetails(creditNoteDetails, taxCalculationResponseDto);
		}
		if (creditNote.get("isGrammage") == null && BooleanUtils.isFalse(creditNote.has("isGrammage"))) {

			creditNoteDetails.setIsGrammage(0);
		}
		if (creditNote.get("adjustedAmount") == null && BooleanUtils.isFalse(creditNote.has("adjustedAmount"))) {

			creditNoteDetails.setAdjustedAmount(0);
		}
		return creditNoteDetails;
	}

	private CreditNoteLegacyOutboundDetailsDto getTaxDetails(CreditNoteLegacyOutboundDetailsDto creditNoteDetails,
			TaxCalculationResponseDto taxCalculationResponseDto) {
		if (taxCalculationResponseDto != null) {
			Map<String, TaxDetailDto> data = taxCalculationResponseDto.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					TaxDetailDto sgstDetails = data.get("SGST");
					if (sgstDetails != null && sgstDetails.getTaxValue() != null)
						creditNoteDetails.setTotalTax2(sgstDetails.getTaxValue());

				}
				if (data.get("UTGST") != null) {
					TaxDetailDto utgstDetails = data.get("UTGST");
					if (utgstDetails != null && utgstDetails.getTaxValue() != null)
						creditNoteDetails.setTotalTax2(utgstDetails.getTaxValue());

				}
				if (data.get("CGST") != null) {
					TaxDetailDto cgstDetails = data.get("CGST");
					if (cgstDetails != null && cgstDetails.getTaxValue() != null)
						creditNoteDetails.setTotalTax1(cgstDetails.getTaxValue());

				}
				if (data.get("IGST") != null) {
					TaxDetailDto igstDetails = data.get("IGST");
					if (igstDetails != null && igstDetails.getTaxValue() != null) {
						creditNoteDetails.setTotalTax2(igstDetails.getTaxValue());

					}
				}
				if (creditNoteDetails.getTotalTax1() != null)
					creditNoteDetails.setTotalTax(creditNoteDetails.getTotalTax1());
				if (creditNoteDetails.getTotalTax2() != null)
					creditNoteDetails.setTotalTax(creditNoteDetails.getTotalTax2());
				if (creditNoteDetails.getTotalTax1() != null && creditNoteDetails.getTotalTax2() != null)
					creditNoteDetails
							.setTotalTax(creditNoteDetails.getTotalTax1().add(creditNoteDetails.getTotalTax2()));
			}
		}
		return creditNoteDetails;
	}

	private CreditNoteLegacyOutboundCustomerDto getCustomerDetails(JsonObject object) {
		CreditNoteLegacyOutboundCustomerDto customer = new CreditNoteLegacyOutboundCustomerDto();
		JsonObject customerDao = new JsonObject();
		JsonObject customerlocationMappingDao = new JsonObject();
		JsonObject customerDetails = new JsonObject();
		JsonObject emailDetails = new JsonObject();
		if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
			customerDao = object.get(CUSTOMER).getAsJsonObject();
			if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
				customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
						.getAsJsonObject().get("data").getAsJsonObject();
				if (new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString()).getAsJsonObject()
						.get("type").getAsString().equalsIgnoreCase(CustomerTypeEnum.INTERNATIONAL.name())) {
					customer.setIsNri(Boolean.TRUE);
					customer.setIsIndian(Boolean.FALSE);
				} else {
					customer.setIsNri(Boolean.FALSE);
					customer.setIsIndian(Boolean.TRUE);
				}
			}
			// System.out.println("Email
			// "+customerDao.get(EMAIL_VALIDATION_DETAILS).getAsString());
			if (customerDao.get(EMAIL_VALIDATION_DETAILS) != null
					&& !customerDao.get(EMAIL_VALIDATION_DETAILS).isJsonNull()
					&& !StringUtil.isBlankJsonStr(customerDao.get(EMAIL_VALIDATION_DETAILS).getAsString()))
				emailDetails = new JsonParser().parse(customerDao.get(EMAIL_VALIDATION_DETAILS).getAsString())
						.getAsJsonObject().get("data").getAsJsonObject();
			if (emailDetails.get(API_RESPONSE) != null && !emailDetails.get(API_RESPONSE).isJsonNull()
					&& emailDetails.get(API_RESPONSE).getAsJsonObject().get("validationstatus") != null)
				customer.setIsEmailValidationSuccess(
						emailDetails.get(API_RESPONSE).getAsJsonObject().get("validationstatus").getAsBoolean());
		}
		if (object.get(CUSTOMER_LOCATION_MAPPING) != null && !object.get(CUSTOMER_LOCATION_MAPPING).isJsonNull()) {
			customerlocationMappingDao = object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject();
		}
		if (customerDao.get(CUSTOMER_NAME) != null && !customerDao.get(CUSTOMER_NAME).isJsonNull())
			customer.setName(CryptoUtil.decrypt(customerDao.get(CUSTOMER_NAME).getAsString(), CUSTOMER_NAME));
		if (customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID) != null
				&& !customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID).isJsonNull())
			customer.setLocationCode(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(LOCATION_CODE).getAsString());
		if (customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID) != null
				&& !customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID).isJsonNull())
			customer.setCustomerNo(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(CUSTOMER_ID).getAsInt());
		if (customerDao.get(TITLE) != null && !customerDao.get(TITLE).isJsonNull())
			customer.setTitle(customerDao.get(TITLE).getAsString());
		if (customerDao.get(EMAIL_ID) != null && !customerDao.get(EMAIL_ID).isJsonNull())
			customer.setMailId(CryptoUtil.decrypt(customerDao.get(EMAIL_ID).getAsString(), EMAIL_ID));
		if (customerDao.get(IS_ACTIVE) != null && !customerDao.get(IS_ACTIVE).isJsonNull())
			customer.setIsActive(customerDao.get(IS_ACTIVE).getAsBoolean());
		if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
			customer.setMobileNo(CryptoUtil.decrypt(customerDao.get(MOBILE_NUMBER).getAsString(), MOBILE_NUMBER));
		if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull())
			customer.setBirthday(getParsedDate(customerDetails.get(BIRTHDAY)));
		if (customerDetails.get(ANNIVERSARY) != null && !customerDetails.get(ANNIVERSARY).isJsonNull())
			customer.setAnniversary(getParsedDate(customerDetails.get(ANNIVERSARY)));
		if (customerDetails.get(PIN_CODE) != null && !customerDetails.get(PIN_CODE).isJsonNull())
			customer.setPinCode(customerDetails.get(PIN_CODE).getAsString());
		if (customerDao.get(CREATED_BY) != null && !customerDao.get(CREATED_BY).isJsonNull())
			customer.setLoginId(customerDao.get(CREATED_BY).getAsString());
		if (customerDao.get(CREATED_DATE) != null && !customerDao.get(CREATED_DATE).isJsonNull())
			customer.setCreatedDate(getParsedDateFormat(customerDao.get(CREATED_DATE)));
		if (customerDao.get(LAST_MODIFIED_BY) != null && !customerDao.get(LAST_MODIFIED_BY).isJsonNull())
			customer.setLastModifiedId(customerDao.get(LAST_MODIFIED_BY).getAsString());
		if (customerDao.get(LAST_MODIFIED_DATE) != null && !customerDao.get(LAST_MODIFIED_DATE).isJsonNull())
			customer.setLastModifiedDate(getParsedDateFormat(customerDao.get(LAST_MODIFIED_DATE)));
		if (customerDetails.get(SPOUSE_BIRTH_DAY) != null && !customerDetails.get(SPOUSE_BIRTH_DAY).isJsonNull())
			customer.setSpouseBirthday(getParsedDate(customerDetails.get(SPOUSE_BIRTH_DAY)));
		if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull())
			customer.setUlpMembershipId(customerDao.get(ULP_ID).getAsString());
		if (customerDetails.get(CAN_SEND_SMS) != null && !customerDetails.get(CAN_SEND_SMS).isJsonNull())
			customer.setCanSendSms(customerDetails.get(CAN_SEND_SMS).getAsBoolean());
		if (customerDao.get(CUST_TAX_NO) != null && !customerDao.get(CUST_TAX_NO).isJsonNull())
			customer.setPanCardNo(CryptoUtil.decrypt(customerDao.get(CUST_TAX_NO).getAsString(), CUST_TAX_NO));
		if (customerDetails.get(CATCHMENT_NAME) != null && !customerDetails.get(CATCHMENT_NAME).isJsonNull())
			customer.setCatchmentArea(customerDetails.get(CATCHMENT_NAME).getAsString());
		if (customerDetails.get(IS_HARD_COPY_SUBMITTED) != null
				&& !customerDetails.get(IS_HARD_COPY_SUBMITTED).isJsonNull())
			customer.setIsHardCopySubmitted(customerDetails.get(IS_HARD_COPY_SUBMITTED).getAsBoolean());
		if (customerDetails.get(ID_PROOF) != null && !customerDetails.get(ID_PROOF).isJsonNull())
			customer.setIdProofType(customerDetails.get(ID_PROOF).getAsString());
		if (customerDetails.get(ID_NUMBER) != null && !customerDetails.get(ID_NUMBER).isJsonNull())
			customer.setIdProofNumber(customerDetails.get(ID_NUMBER).getAsString());
		if (customerDetails.get(CITY) != null && !customerDetails.get(CITY).isJsonNull())
			customer.setTownName(customerDetails.get(CITY).getAsString());
		if (customerDao.get(INSTI_TAX_NO) != null && !customerDao.get(INSTI_TAX_NO).isJsonNull())
			customer.setGstRegNo(CryptoUtil.decrypt(customerDao.get(INSTI_TAX_NO).getAsString(), INSTI_TAX_NO));
		if (customerDetails.get(CITY) != null && !customerDetails.get(CITY).isJsonNull())
			customer.setUlpCity(customerDetails.get(CITY).getAsString());
		if (customerDetails.get(STATE) != null && !customerDetails.get(STATE).isJsonNull())
			customer.setUlpState(customerDetails.get(STATE).getAsString());
		if (customerDetails.get("stateCode") == null && BooleanUtils.isFalse(customerDetails.has("stateCode"))) {

			customer.setStateCode(0);
		}
		if (customerDetails.get("townCode") == null && BooleanUtils.isFalse(customerDetails.has("townCode"))) {

			customer.setTownCode(0);
		}
		if (customerDetails.get(ADDRESS_LINES) != null && !customerDetails.get(ADDRESS_LINES).isJsonNull()) {
			JsonArray jsonArrayResponse = customerDetails.get(ADDRESS_LINES).getAsJsonArray();
			String address1 = null;
			String address2 = null;
			Integer size = jsonArrayResponse.size();
			if (size >= 1 && !StringUtils.isEmpty(jsonArrayResponse.get(0)))
				address1 = jsonArrayResponse.get(0).getAsString();
			if (size >= 2 && !StringUtils.isEmpty(jsonArrayResponse.get(1)))
				address1 = address1 + ", " + jsonArrayResponse.get(1).getAsString();
			customer.setAddress1(address1);
			if (size >= 3 && !StringUtils.isEmpty(jsonArrayResponse.get(2)))
				address2 = jsonArrayResponse.get(2).getAsString();
			if (size >= 4 && !StringUtils.isEmpty(jsonArrayResponse.get(3)))
				address2 = address2 + ", " + jsonArrayResponse.get(3).getAsString();
			customer.setAddress2(address2);
		}
		customer.setRefusedMobileNo(false);
		return customer;

	}

	private Date getParsedDate(JsonElement jsonElement) {
		Date dateToReturn = new Date();
		try {
			Long dateValue = jsonElement.getAsLong();
			dateToReturn = CalendarUtils.convertStringToDate(
					new SimpleDateFormat(DATE_FORMAT).format(java.sql.Date
							.valueOf(Instant.ofEpochMilli(dateValue).atZone(ZoneId.systemDefault()).toLocalDate())),
					DATE_FORMAT);
		} catch (Exception e) {
			dateToReturn = CalendarUtils.getCurrentDate();
		}
		return dateToReturn;
	}
	
	//convert timestamp legacy formate into datetime.
	private String getParsedDateFormat(JsonElement element) {
		Date dateToReturn = new Date();
		String dateTimeFormat;
		try {
			
			Long dateValue = element.getAsLong();
			dateToReturn = CalendarUtils.convertStringToDate(
					new SimpleDateFormat(LEGACY_DATE_FORMAT).format(java.sql.Date
							.valueOf(Instant.ofEpochMilli(dateValue).atZone(ZoneId.systemDefault()).toLocalDate())),
					LEGACY_DATE_FORMAT);
			dateTimeFormat = new SimpleDateFormat(LEGACY_DATE_FORMAT).format(dateToReturn);
			
			
			
					
		} catch (Exception e) {
			dateToReturn = CalendarUtils.getCurrentDate();
			dateTimeFormat = new SimpleDateFormat(LEGACY_DATE_FORMAT).format(dateToReturn);
		}
		return dateTimeFormat;
	}

	@Override
	public CashMemoEntities getCashMemoDetailsService(String locationCode, Short refFiscalYear, Integer refDocNo,
			Boolean isGRNAllowed) {
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		ThirdPartyApiReqDto apiRequestPayment = new ThirdPartyApiReqDto();
		CashMemoDetailsDto cmDetails = new CashMemoDetailsDto();
		cmDetails.setLocationCode(locationCode);
		cmDetails.setDocNo(refDocNo);
		cmDetails.setFiscalYear(refFiscalYear);
		apiRequest.setReqBody(cmDetails);
		apiRequest.setHttpMethod(HttpMethod.POST);
		Map<String, String> locationCodeParam = new HashMap<String, String>();
		locationCodeParam.put("locationcode", locationCode);
		locationCodeParam.put("docno", refDocNo.toString());
		locationCodeParam.put("fiscalyear", refFiscalYear.toString());
		apiRequestPayment.setRequestParams(locationCodeParam);
		apiRequestPayment.setHttpMethod(HttpMethod.POST);
		ApiResponseDto apiResponse = new ApiResponseDto();
		ApiResponseDto apiResponsePayment = new ApiResponseDto();
		List<CMLegacyPaymentResponseDto> legacyCMPayment = null;

		try {
			apiResponse = apiCaller.callLegacyAPI(apiRequest, "getCMUrl");

		} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, LEGACY));
		}

		if (apiResponse.getHttpResponseCode() == 200) {

			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			CMLegacyResponseDto legacyCM = mapper.convertValue(apiResponse.getResponse(),
					new TypeReference<CMLegacyResponseDto>() {
					});
			log.info(" dto RESPONSE  ........" + legacyCM);

			if (legacyCM.getCashMemo() == null) {
				throw new ServiceException(INVALID_CASHMEMO, ERR_INT_096,
						Map.of("docNo", "" + refDocNo, "locationCode", locationCode, "fiscalYear", "" + refFiscalYear));
			}

			// If isGRNAllowed false then go inside if block
			// If isGRNAllowed true or null, then it should not go inside this if block.
			if (BooleanUtils.isFalse(isGRNAllowed)) {
				try {
					apiResponsePayment = apiCaller.callLegacyAPI(apiRequestPayment, "getCMPaymentUrl");
					log.info("PAYMENT RESPONSE ........" + apiResponsePayment);
				} catch (Exception e) {
					throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, LEGACY));
				}
			}

			if (apiResponsePayment != null && apiResponsePayment.getHttpResponseCode() != null
					&& apiResponsePayment.getHttpResponseCode() == 200) {

				ObjectMapper objectMapper = new ObjectMapper();

				try {
					legacyCMPayment = objectMapper.readValue(apiResponsePayment.getResponse().toString(),
							new TypeReference<List<CMLegacyPaymentResponseDto>>() {
							});
				} catch (JsonParseException e) {

					e.printStackTrace();
				} catch (JsonMappingException e) {

					e.printStackTrace();
				} catch (IOException e) {

					e.printStackTrace();
				}

				log.info("PAYMENT dto RESPONSE  ........" + legacyCMPayment);
			}

			return mapToNapCM(legacyCM, legacyCMPayment);
		} else if (apiResponse.getHttpResponseCode() == 204) {
			throw new ServiceException(INVALID_CASHMEMO_IN_LEGACY, ERR_INT_098,
					Map.of("docNo", "" + refDocNo, "locationCode", locationCode, "fiscalYear", "" + refFiscalYear));
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, Map.of(VENDOR_NAME, LEGACY));
		}

	}

	@Override
	public CashMemoEntities getTepCashMemoDetailsService(String locationCode, Short refFiscalYear, Integer refDocNo,
			Boolean isInterBrand, Boolean isFullValueTEP) {
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		CashMemoDetailsDto cmDetails = new CashMemoDetailsDto();
		cmDetails.setLocationCode(locationCode);
		cmDetails.setDocNo(refDocNo);
		cmDetails.setFiscalYear(refFiscalYear);
		cmDetails.setIsInterBrand(isInterBrand);
		cmDetails.setIsFullValueTEP(isFullValueTEP);
		apiRequest.setReqBody(cmDetails);

		apiRequest.setHttpMethod(HttpMethod.POST);
		ApiResponseDto apiResponse = new ApiResponseDto();
		try {
			apiResponse = apiCaller.callLegacyAPI(apiRequest, "getTEPCMUrl");
		} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, LEGACY));
		}
		if (apiResponse.getHttpResponseCode() == 200) {
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			CMLegacyResponseDto legacyCM = mapper.convertValue(apiResponse.getResponse(),
					new TypeReference<CMLegacyResponseDto>() {
					});
			if (legacyCM.getCashMemo() == null) {
				throw new ServiceException(INVALID_CASHMEMO, ERR_INT_096,
						Map.of("docNo", "" + refDocNo, "locationCode", locationCode, "fiscalYear", "" + refFiscalYear));
			}
			log.info("API Response " + apiResponse.getResponse());
			log.info("Mapped Legacy CM " + legacyCM);
			return mapToNapCM(legacyCM, null);
		} else if (apiResponse.getHttpResponseCode() == 204) {
			throw new ServiceException(INVALID_CASHMEMO_IN_LEGACY, ERR_INT_098,
					Map.of("docNo", "" + refDocNo, "locationCode", locationCode, "fiscalYear", "" + refFiscalYear));
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, Map.of(VENDOR_NAME, LEGACY));
		}

	}

	private CashMemoEntities mapToNapCM(CMLegacyResponseDto legacyCm,
			List<CMLegacyPaymentResponseDto> legacyCMPayment) {
		CashMemoEntities cmEntities = new CashMemoEntities();
		CashMemoEntity originalTxn = new CashMemoEntity();
		CustomerTxnDao customerTxn = mapCustomerTxn(legacyCm);
		CashMemoDao cashMemo = mapCashMemo(legacyCm);
		List<CashMemoDetailsDao> cashMemoDetails = mapcashMemoDetails(legacyCm);
		List<PaymentDetailsDao> paymentCMDetails = mapCashMemoPaymentDetails(legacyCMPayment,legacyCm);
		log.info("Payment detaisl..........{}" + paymentCMDetails);
		CustomerEpossSearchDto customerDetails = mapCustomerDetails(legacyCm);
		mapLotNumberAndMultiMetalDetails(legacyCm, originalTxn);
		originalTxn.setCustomerTxn(customerTxn);
		originalTxn.setCashMemo(cashMemo);
		originalTxn.setCashMemoDetails(cashMemoDetails);
		originalTxn.setPaymentDetails(paymentCMDetails);
		cmEntities.setOriginalTxn(originalTxn);
		cmEntities.setCustomer(customerDetails);
		return cmEntities;
	}

	private List<PaymentDetailsDao> mapCashMemoPaymentDetails(List<CMLegacyPaymentResponseDto> legacyCMPayment,CMLegacyResponseDto legacyCm) {
		List<PaymentDetailsDao> payment = new ArrayList<>();
		if (legacyCMPayment != null && !legacyCMPayment.isEmpty()) {
			for (CMLegacyPaymentResponseDto legacyPayment : legacyCMPayment) {

				PaymentDetailsDao paymentDto = new PaymentDetailsDao();
				log.info("paymentDao........{}" + paymentDto);
				paymentDto.setAmount(legacyPayment.getAmount());
				paymentDto.setSalesTxnType(legacyPayment.getDocType());
				paymentDto.setRowId(legacyPayment.getLineItemNo());
				paymentDto.setPaymentCode(setPaymentCodeLegacyToNap(legacyPayment));
				paymentDto.setBankBranch(legacyPayment.getBranchName());
				paymentDto.setCreatedBy(legacyPayment.getLoginID());
				paymentDto.setCreatedDate(legacyPayment.getCreatedDate());
				paymentDto.setHostName(legacyPayment.getHostName());
				paymentDto.setBankName(legacyPayment.getIssuingBank());
				paymentDto.setRemarks(legacyPayment.getRemarks());
				if(legacyPayment.getPaymentCode()!=null && PaymentCodeEnum.ENCIRCLE.getPaymentcode().equalsIgnoreCase(legacyPayment.getPaymentCode()))
				{
					if(legacyCm.getCashMemo().getRrNo()!= null)
					paymentDto.setReference1(legacyCm.getCashMemo().getRrNo());
					if(legacyCm.getCustomerDetails().getUlpId()!=null)
					paymentDto.setInstrumentNo(legacyCm.getCustomerDetails().getUlpId());
				}
				else {
					paymentDto.setReference1(legacyPayment.getReference1());
					paymentDto.setInstrumentNo(legacyPayment.getInstrumentNo());
				}
				paymentDto.setReference2(legacyPayment.getReference2());
				paymentDto.setReference3(legacyPayment.getReference3());
				paymentDto.setPaymentDate(legacyPayment.getIssueDate());
				if(legacyPayment.getPaymentCode()!=null && PaymentCodeEnum.CASH.getPaymentcode().equalsIgnoreCase(legacyPayment.getPaymentCode())){
					log.info("legacy cash collected  {}",legacyPayment.getAmount());
					paymentDto.setCashCollected(legacyPayment.getAmount());
					log.info("payment cash collected ------------{}",paymentDto.getCashCollected());
					}
				log.info("paymentDao..........{}" + paymentDto);
				payment.add(paymentDto);

			}
		}

		return payment;
	}

	private String setPaymentCodeLegacyToNap(CMLegacyPaymentResponseDto legacyPayment) {
		String paymentCode="";
		if(legacyPayment!=null && legacyPayment.getPaymentCode()!=null) {

			paymentCode=legacyPayment.getPaymentCode();
			
			switch(paymentCode) {
			case "AIRPAY": paymentCode="AIRPAY";
				break;
			case "Cash": paymentCode="CASH";
				break;
			case "CASHBACKOFFER": paymentCode="CASHBACK";
				break;
			case "CC": paymentCode="CARD";
				break;
			case "Cheque": paymentCode="CHEQUE";
				break;
			case "CN": paymentCode="CREDIT NOTE";
				break;
			case "DD": paymentCode="DD";
				break;
			case "Encircle": paymentCode="ENCIRCLE";
				break;
			case "GHSAccount": paymentCode="GHS ACCOUNT";
				break;
			case "QCGC": paymentCode="QCGC";
				break;
			case "RO": paymentCode="RO PAYMENT";
				break;
			case "RTGS": paymentCode="RTGS";
				break;
			case "TataLoyaltyPoints": paymentCode="TATA LOYALTY POINTS";
				break;
			case "DigiGoldNonTanishq": paymentCode="DIGI GOLD NON TANISHQ";
				break;
			case "DigiGoldTanishq": paymentCode="DIGI GOLD TANISHQ";
				break;
			case "EmployeeLoan": paymentCode="EMPLOYEE LOAN";
				break;
			case "ValuAccess": paymentCode="VALUACCESS";
				break;
			case "Wallet": paymentCode="PHONEPE";
				break;
			default: paymentCode=legacyPayment.getPaymentCode().toUpperCase();
			}
		}
		return paymentCode;
	}

	private void mapLotNumberAndMultiMetalDetails(CMLegacyResponseDto legacyCm, CashMemoEntity originalTxn) {
		List<LotNumberDetailsDto> lotNumberDetailsList = new ArrayList<>();
		List<MultiMetalDetailsDto> multiMetalDetailsList = new ArrayList<>();
		List<ItemStoneMappingDto> itemStoneMappingList = new ArrayList<>();
		if (legacyCm.getCmVariant() != null && !legacyCm.getCmVariant().isEmpty()) {
			legacyCm.getCmVariant().forEach(cmVariant -> {
				if (cmVariant.getLotNumberDetailsList() != null && !cmVariant.getLotNumberDetailsList().isEmpty()) {
					lotNumberDetailsList.addAll(cmVariant.getLotNumberDetailsList());
				}

				if (cmVariant.getMultiMetalDetailsList() != null && !cmVariant.getMultiMetalDetailsList().isEmpty()) {
					multiMetalDetailsList.addAll(cmVariant.getMultiMetalDetailsList());
				}

				if (cmVariant.getItemStoneMappingList() != null && !cmVariant.getItemStoneMappingList().isEmpty()) {
					itemStoneMappingList.addAll(cmVariant.getItemStoneMappingList());
				}
			});
			originalTxn.setLotNumberDetailsList(lotNumberDetailsList);
			originalTxn.setMultiMetalDetailsList(multiMetalDetailsList);
			originalTxn.setItemStoneMappingList(itemStoneMappingList);
		}
	}

	private CustomerEpossSearchDto mapCustomerDetails(CMLegacyResponseDto legacyCm) {
		CustomerEpossSearchDto customerDetails = new CustomerEpossSearchDto();
		CustomerDao customer = (CustomerDao) MapperUtil.getObjectMapping(legacyCm.getCustomerDetails(),
				new CustomerDao());
		customer.setSrcSyncId(0);
		customer.setDestSyncId(0);
		if (legacyCm.getCustomerDetails().getGstRegNo() == null) {
			customer.setCustomerType(CustomerTypeEnum.REGULAR.name());
		} else {
			customer.setCustomerType(CustomerTypeEnum.INSTITUTIONAL.name());
		}
		if ((legacyCm.getCustomerDetails().getUlpId() == null || legacyCm.getCustomerDetails().getUlpId().isEmpty())
				&& (legacyCm.getCustomerDetails().getMobileNumber() == null
						|| legacyCm.getCustomerDetails().getMobileNumber().isEmpty())) {
			customer.setCustomerType(CustomerTypeEnum.ONETIME.name());
		}
		JsonData customerDetail = getCustomerDetailString(legacyCm);
		customer.setCustomerDetails(MapperUtil.getJsonString(customerDetail));
//		if(legacyCm.getCustomerDetails().getUlpId()!=null) {
//			VendorDao vendor=vendorRepo.findByVendorCode(VendorCodeEnum.ULP_NETCARROTS.name());
//			CustomerDto customerDto=netcarrotsService.searchLoyaltyCustomer(vendor, CustomerSearchTypeEnum.ULP_ID.toString(), legacyCm.getCashMemo().getLocationCode(), legacyCm.getCustomerDetails().getUlpId());
//			CustomerUlpDao customerUlp=(CustomerUlpDao)MapperUtil.getObjectMapping(customerDto, new CustomerUlpDao());
//			customerDetails.setCustomerUlp(customerUlp);
//		}
		if(legacyCm.getCustomerDetails().getPanCardNo()!=null)
			customer.setCustTaxNo(legacyCm.getCustomerDetails().getPanCardNo());
		customerDetails.setCustomer(customer);
		return customerDetails;
	}

	private CashMemoDao mapCashMemo(CMLegacyResponseDto legacyCm) {
		SalesTxnDao salesTxn = (SalesTxnDao) MapperUtil.getObjectMapping(legacyCm.getCashMemo(), new SalesTxnDao());
		salesTxn.setSrcSyncId(0);
		salesTxn.setDestSyncId(0);
		salesTxn.setTxnType(TransactionTypeEnum.CM.name());
		salesTxn.setEmployeeCode(legacyCm.getCashMemo().getLastModifiedBy());
		salesTxn.setStatus(cmStatus.get(legacyCm.getCashMemo().getStatus()));
		salesTxn.setCurrencyCode("INR");
		salesTxn.setWeightUnit("gms");
		salesTxn.setConfirmedTime(legacyCm.getCashMemo().getConfirmedTime());
		MetalRateListDto metalsRateListDto = getMetalRateListDto(legacyCm);
		salesTxn.setMetalRateDetails(MapperUtil.getJsonString(metalsRateListDto));
		// ManualBillTxnDetailsDto manualBillDetails=getManualDetails(legacyCm);
		CashMemoDao cashmemo = (CashMemoDao) MapperUtil.getObjectMapping(legacyCm.getCashMemo(), new CashMemoDao());
		cashmemo.setSrcSyncId(0);
		cashmemo.setDestSyncId(0);
		cashmemo.setIsMigrated(true);
		LegacyOtherChargesDetailsDto otherChargeDetailsDto = getCmOtherDetails(legacyCm);
		cashmemo.setOtherCharges(MapperUtil.getJsonString(otherChargeDetailsDto));
		TaxDetailsListDto taxDetails = getCmTaxDetails(legacyCm);
		cashmemo.setTaxDetails(MapperUtil.getJsonString(taxDetails));
		cashmemo.setLegacyBillLevelDiscount(legacyCm.getCashMemo().getLegacyBillLevelDiscount());
		if (legacyCm.getCashMemo().getIsNewCM() != null && legacyCm.getCashMemo().getIsNewCM() == true) {
			salesTxn.setSubTxnType("NEW_CM");
		} else {
			salesTxn.setSubTxnType("NEW_CM");
		}
		cashmemo.setSalesTxnDao(salesTxn);
		return cashmemo;
	}
	
	private LegacyOtherChargesDetailsDto getCmOtherDetails(CMLegacyResponseDto legacyCm) {
		LegacyOtherChargesDetailsDto otherDetails = new LegacyOtherChargesDetailsDto();
		if (legacyCm.getCashMemo() != null )
		{
			otherDetails.setType("LEGACYOTHERCHARGES");
			LegacyOtherChargesDto data = new LegacyOtherChargesDto();
			if(legacyCm.getCashMemo().getOtherChargesTax1() != null && legacyCm.getCashMemo().getOtherChargesTax2() != null) 
			{
			  data.setTaxValue(new BigDecimal(legacyCm.getCashMemo().getOtherChargesTax1()).add(new BigDecimal(legacyCm.getCashMemo().getOtherChargesTax2())));
			  log.info("....taxvalue..{}"+data);
			}
			if(legacyCm.getCashMemo().getOtherCharges() != null)
			{
				data.setValue(new BigDecimal(legacyCm.getCashMemo().getOtherCharges()));
			      log.info("value....{}"+data);
			}
			if(legacyCm.getCashMemo().getOtherChargesRemarks() != null)
			{
				data.setRemarks(legacyCm.getCashMemo().getOtherChargesRemarks());
		          log.info("remarks....{}"+data);
			}
	        otherDetails.setData(data);
	        
			
			
		}
		
		return otherDetails;
	}

	@Override
	public List<CmForCustomerLegacyDto> getCMforCustomer(String locationCode, String itemCode, String customerMobileNo,
			String customerId, Boolean isMigratedIgnored) {
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		List<CmForCustomerLegacyDto> legacyCM = new ArrayList<>();
		Map<String, String> cmReqParams = new HashMap<String, String>();
		if (customerMobileNo != null && !customerMobileNo.isEmpty()) {
			cmReqParams.put("searchField", customerMobileNo);
			cmReqParams.put("searchType", "MOBILE_NO");
		} else {
			cmReqParams.put("searchField", customerId);
			cmReqParams.put("searchType", "ULP_ID");
		}
		cmReqParams.put("Itemcode", itemCode);
		apiRequest.setRequestParams(cmReqParams);
		apiRequest.setHttpMethod(HttpMethod.POST);
		ApiResponseDto apiResponse = new ApiResponseDto();
		try {
			apiResponse = apiCaller.callLegacyAPI(apiRequest, "getCmForCustomerUrl");
			log.info("api response>>>>" + apiResponse);
		} catch (Exception e) {
			log.info("Exception>>>>" + e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, LEGACY));
		}

		if (apiResponse.getHttpResponseCode() == 200) {
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			try {
				legacyCM = mapper.readValue(apiResponse.getResponse().toString(),
						new TypeReference<List<CmForCustomerLegacyDto>>() {
						});
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
//			legacyCM = mapper.convertValue(apiResponse.getResponse(),
//					new TypeReference<ListResponse<CmForCustomerLegacyDto>>() {
//					});
			return legacyCM;
		} else if (apiResponse.getHttpResponseCode() == 204) {
			return legacyCM;
//			throw new ServiceException(INVALID_CASHMEMO_IN_LEGACY, ERR_INT_098,
//					Map.of("docNo", "" + refDocNo, "locationCode", locationCode, "fiscalYear", "" + refFiscalYear));
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, Map.of(VENDOR_NAME, LEGACY));
		}

	}

//	private ManualBillTxnDetailsDto getManualDetails(CMLegacyResponseDto legacyCm) {
//		ManualBillTxnDetailsDto manualBillDetails=new ManualBillTxnDetailsDto();
//		ManualBillResponseDto manualbillResponse=new ManualBillResponseDto();
//		manualBillDetails.setManualBillDetails(manualbillResponse);
//		return manualBillDetails;
//	}

	private TaxDetailsListDto getCmTaxDetails(CMLegacyResponseDto legacyCm) {
		TaxDetailsListDto taxDetails = new TaxDetailsListDto();
		List<TaxCalculationResponseDto> taxDetail = new ArrayList<>();
		if (legacyCm.getCmVariant() != null && !legacyCm.getCmVariant().isEmpty()) {
			legacyCm.getCmVariant().forEach(cmVariant -> {
				TaxCalculationResponseDto taxs = new TaxCalculationResponseDto();
				taxs.setTaxType("ITEMCHARGES");
				Map<String, TaxDetailDto> data = new HashMap<>();
				if (cmVariant.getCmVariantDetail().getTaxType1() != null
						&& cmVariant.getCmVariantDetail().getTax1() != null) {
					TaxDetailDto tax = new TaxDetailDto();
					tax.setTaxCode(cmVariant.getCmVariantDetail().getTaxType1());
					tax.setTaxValue(new BigDecimal(cmVariant.getCmVariantDetail().getTax1()));
					data.put(cmVariant.getCmVariantDetail().getTaxType1(), tax);
				}
				if (cmVariant.getCmVariantDetail().getTaxType2() != null
						&& cmVariant.getCmVariantDetail().getTax2() != null) {
					TaxDetailDto tax = new TaxDetailDto();
					tax.setTaxCode(cmVariant.getCmVariantDetail().getTaxType2());
					tax.setTaxValue(new BigDecimal(cmVariant.getCmVariantDetail().getTax2()));
					data.put(cmVariant.getCmVariantDetail().getTaxType2(), tax);
				}
				Map<String, CessDetailDto> cess = new HashMap<>();
				if (legacyCm.getCashMemo().getCessName() != null) {
					CessDetailDto cesses = new CessDetailDto();
					cesses.setCessCode(legacyCm.getCashMemo().getCessName());
					cesses.setCessPercentage(new BigDecimal(cmVariant.getCmVariantDetail().getCessPercentage()));
					cesses.setCessValue(new BigDecimal(cmVariant.getCmVariantDetail().getCessValue()));
					cess.put(legacyCm.getCashMemo().getCessName(), cesses);
				}
				taxs.setData(data);
				taxs.setCess(cess);
				taxDetail.add(taxs);
			});
		}
		taxDetails.setTaxes(taxDetail);
		return taxDetails;
	}

	private MetalRateListDto getMetalRateListDto(CMLegacyResponseDto legacyCm) {
		MetalRateListDto metalRateList = new MetalRateListDto();
		Map<String, StandardPriceResponseDto> metalRates = new HashMap<String, StandardPriceResponseDto>();
		if (legacyCm.getCashMemo().getGoldRate() != null) {
			StandardPriceResponseDto goldRateDetails = new StandardPriceResponseDto();
			if (legacyCm.getCashMemo().getBaseKaratage() != null)
				goldRateDetails.setKarat(new BigDecimal(legacyCm.getCashMemo().getBaseKaratage()));
			goldRateDetails.setRatePerUnit(new BigDecimal(legacyCm.getCashMemo().getGoldRate()));
			goldRateDetails.setMetalTypeCode("J");
			goldRateDetails.setApplicableDate(legacyCm.getCashMemo().getConfirmedTime());
			metalRates.put("J", goldRateDetails);
		}
		if (legacyCm.getCashMemo().getPlatinumRate() != null) {
			StandardPriceResponseDto platinumRateDetails = new StandardPriceResponseDto();
			platinumRateDetails.setKarat(BigDecimal.valueOf(0));
			platinumRateDetails.setRatePerUnit(new BigDecimal(legacyCm.getCashMemo().getPlatinumRate()));
			platinumRateDetails.setMetalTypeCode("L");
			platinumRateDetails.setPurity(new BigDecimal(legacyCm.getCashMemo().getBasePlatinumPurity()));
			platinumRateDetails.setApplicableDate(legacyCm.getCashMemo().getConfirmedTime());
			metalRates.put("L", platinumRateDetails);
		}
		if (legacyCm.getCashMemo().getSilverRate() != null) {
			StandardPriceResponseDto silverRateDetails = new StandardPriceResponseDto();
			silverRateDetails.setKarat(BigDecimal.valueOf(0));
			silverRateDetails.setRatePerUnit(new BigDecimal(legacyCm.getCashMemo().getSilverRate()));
			silverRateDetails.setMetalTypeCode("P");
			silverRateDetails.setPurity(new BigDecimal(legacyCm.getCashMemo().getBaseSilverPurity()));
			silverRateDetails.setApplicableDate(legacyCm.getCashMemo().getConfirmedTime());
			metalRates.put("P", silverRateDetails);
		}
		metalRateList.setMetalRates(metalRates);
		return metalRateList;
	}

	private List<CashMemoDetailsDao> mapcashMemoDetails(CMLegacyResponseDto legacyCm) {
		List<CashMemoDetailsDao> cashMemoDetailsList = new ArrayList<>();
		if (legacyCm.getCmVariant() != null && !legacyCm.getCmVariant().isEmpty()) {
			legacyCm.getCmVariant().forEach(cmVariant -> {
				CashMemoDetailsDao cashMemoDetails = (CashMemoDetailsDao) MapperUtil
						.getObjectMapping(cmVariant.getCmVariantDetail(), new CashMemoDetailsDao());
				if (cmVariant.getCmVariantDetail().getLotNumber() != null
						&& "null".equalsIgnoreCase(cmVariant.getCmVariantDetail().getLotNumber())) {
					cashMemoDetails.setLotNumber(null);
				}
				
				cashMemoDetails.setSrcSyncId(0);
				cashMemoDetails.setDestSyncId(0);
				cashMemoDetails.setItemInStock(Boolean.TRUE);
				cashMemoDetails.setCreatedBy(legacyCm.getCashMemo().getCreatedBy());
				cashMemoDetails.setCreatedDate(legacyCm.getCashMemo().getCreatedDate());
				cashMemoDetails.setLastModifiedBy(legacyCm.getCashMemo().getLastModifiedBy());
				TaxCalculationResponseDto taxDetails = getCmDetailsTaxDetails(cmVariant.getCmVariantDetail(),
						legacyCm.getCashMemo().getCessName());
				cashMemoDetails.setTaxDetails(MapperUtil.getJsonString(taxDetails));
				if(cmVariant.getCmVariantDetail().getGoldRate()==null) {
					cmVariant.getCmVariantDetail().setGoldRate(legacyCm.getCashMemo().getGoldRate());
				}
				if(cmVariant.getCmVariantDetail().getSilverRate()==null) {
					cmVariant.getCmVariantDetail().setSilverRate(legacyCm.getCashMemo().getSilverRate());
				}
				if(cmVariant.getCmVariantDetail().getPlatinumRate()==null) {
					cmVariant.getCmVariantDetail().setPlatinumRate(legacyCm.getCashMemo().getPlatinumRate());
				}
				PriceDetailsDto priceDetails = getPriceDetails(cmVariant);
				
				cashMemoDetails.setPriceDetails(MapperUtil.getJsonString(priceDetails));
				if (priceDetails.getItemHallmarkDetails() != null
						&& BooleanUtils.isTrue(priceDetails.getItemHallmarkDetails().getIsHallmarked())) {
					cashMemoDetails.setHallmarkCharges(priceDetails.getItemHallmarkDetails().getHallmarkingCharges());
					// hallmark FOC - not sure how to update
				}
				JsonData inventoryWeightDetails = getInventoryWeightDetails(cmVariant.getCmVariantDetail());
				cashMemoDetails.setInventoryWeightDetails(MapperUtil.getJsonString(inventoryWeightDetails));
				JsonData itemDetails = getItemDetails(cmVariant.getCmVariantDetail());
				cashMemoDetails.setItemDetails(MapperUtil.getJsonString(itemDetails));
				cashMemoDetails.setFinalValue(cmVariant.getCmVariantDetail().getTotalValue());
				JsonData measuredWeightDetails = getMeasuredWeightDetails(cmVariant.getCmVariantDetail(), cmVariant);
				cashMemoDetails.setMeasuredWeightDetails(MapperUtil.getJsonString(measuredWeightDetails));
				cashMemoDetails.setLastModifiedDate(legacyCm.getCashMemo().getLastModifiedDate());
				cashMemoDetails.setInventoryWeight(cmVariant.getCmVariantDetail().getInventoryStdWeight());
				cashMemoDetails.setLegacyTepDiscountRecovered(
						cmVariant.getCmVariantDetail().getIsTEPDiscountRecoveryAllowed());
				LegacyCmDetailsDto legacyCmDetails = (LegacyCmDetailsDto) MapperUtil
						.getDtoMapping(cmVariant.getCmVariantDetail(), LegacyCmDetailsDto.class);
				log.debug(" legacy CM Details {}", legacyCmDetails);
				cashMemoDetails.setLegacyCmDetails(MapperUtil.getJsonString(legacyCmDetails));
				if (cmVariant.getItemMasterList() != null && !cmVariant.getItemMasterList().isEmpty()) {
					ItemMasterLegacyDto itemMaster = cmVariant.getItemMasterList().get(0);
					cashMemoDetails.setProductCategoryCode(itemMaster.getProductCategory());
					cashMemoDetails.setProductGroupCode(itemMaster.getProductGroup());
					cashMemoDetails.setInventoryStdValue(itemMaster.getStdValue()
							.multiply(new BigDecimal(cmVariant.getCmVariantDetail().getTotalQuantity())));
				}
				cashMemoDetailsList.add(cashMemoDetails);
			});
		}
		return cashMemoDetailsList;
	}

	private JsonData getItemDetails(CMVariantDto cmVariantDetail) {
		Map<String, ItemInvDetailsDto> itemDetails = new HashMap<>();
		ItemInvDetailsDto item = new ItemInvDetailsDto();
		item.setBinCode(cmVariantDetail.getBinCode());
		// item.setBinGroupCode(cmVariantDetail.get);
		item.setLotNumber(cmVariantDetail.getLotNumber());
		// item.setMfgDate(cmVariantDetail.get);
		item.setQuantity(cmVariantDetail.getTotalQuantity());
		// item.setStockInwardDate(stockInwardDate);
		itemDetails.put("", item);
		JsonData itemsDetail = new JsonData();
		itemsDetail.setType("ITEM_DETAILS");
		itemsDetail.setData(itemDetails);
		return itemsDetail;
	}

	private JsonData getInventoryWeightDetails(CMVariantDto cmVariantDetail) {
		JsonData weightDetails = new JsonData();
		WeightDetailsDto weight = new WeightDetailsDto();
		if (cmVariantDetail.getGoldWeight() != null)
			weight.setGoldWeight(cmVariantDetail.getGoldWeight());
		else
			weight.setGoldWeight(BigDecimal.ZERO);
		if (cmVariantDetail.getOtherMaterialWeight() != null)
			weight.setMaterialWeight(cmVariantDetail.getOtherMaterialWeight());
		else
			weight.setMaterialWeight(BigDecimal.ZERO);
		if (cmVariantDetail.getPlatinumWeight() != null)
			weight.setPlatinumWeight(cmVariantDetail.getPlatinumWeight());
		else
			weight.setPlatinumWeight(BigDecimal.ZERO);
		if (cmVariantDetail.getSilverWeight() != null)
			weight.setSilverWeight(cmVariantDetail.getSilverWeight());
		else
			weight.setSilverWeight(BigDecimal.ZERO);
		if (cmVariantDetail.getStoneWeight() != null)
			weight.setStoneWeight(cmVariantDetail.getStoneWeight());
		else
			weight.setStoneWeight(BigDecimal.ZERO);
		weight.setDiamondWeight(BigDecimal.ZERO);
		weightDetails.setType("WEIGHT_DETAILS");
		weightDetails.setData(weight);
		return weightDetails;
	}

	private JsonData getMeasuredWeightDetails(CMVariantDto cmVariantDetail,
			com.titan.poss.core.dto.CashMemoDetailsDto cmVariant) {
//		JsonData weightDetails = new JsonData();
//		WeightDetailsDto weight = new WeightDetailsDto();
//		if (cmVariantDetail.getActualGoldWeight() != null)
//			weight.setGoldWeight(cmVariantDetail.getActualGoldWeight());
//		else
//			weight.setGoldWeight(BigDecimal.ZERO);
//		if (cmVariantDetail.getActualOtherMaterialWeight() != null)
//			weight.setMaterialWeight(cmVariantDetail.getActualOtherMaterialWeight());
//		else
//			weight.setMaterialWeight(BigDecimal.ZERO);
//		if (cmVariantDetail.getActualPlatinumWeight() != null)
//			weight.setPlatinumWeight(cmVariantDetail.getActualPlatinumWeight());
//		else
//			weight.setPlatinumWeight(BigDecimal.ZERO);
//		if (cmVariantDetail.getActualSilverWeight() != null)
//			weight.setSilverWeight(cmVariantDetail.getActualSilverWeight());
//		else
//			weight.setSilverWeight(BigDecimal.ZERO);
//		if (cmVariantDetail.getStoneWeight() != null)
//			weight.setStoneWeight(cmVariantDetail.getStoneWeight());
//		else
//			weight.setStoneWeight(BigDecimal.ZERO);
//		weight.setDiamondWeight(BigDecimal.ZERO);
//		weightDetails.setType("WEIGHT_DETAILS");
//		weightDetails.setData(weight);
//		return weightDetails;
		LotNumberMasterDto lotNumberMaster = cmVariant.getLotNumberMaster();
		BigDecimal measuredweight = cmVariantDetail.getTotalWeight();
		JsonData weightDetails = new JsonData();
		WeightDetailsDto weight = new WeightDetailsDto();
		if(cmVariant.getItemMasterList()!=null) {
			if (cmVariant.getItemMasterList().get(0).getPricingGroupType() != null) {

				switch (cmVariant.getItemMasterList().get(0).getPricingGroupType()) {
				case "GOLDPLAIN":
					weight.setGoldWeight(measuredweight);
					break;
				case "SILVERPLAIN":
					weight.setSilverWeight(measuredweight);
					break;
				case "PLATINUMPLAIN":
					weight.setPlatinumWeight(measuredweight);
					break;
				case "GOLDSTUDDED":
					BigDecimal stoneWeight = lotNumberMaster.getStoneWeight();
					BigDecimal diamondweight = lotNumberMaster.getDiamondWeight();
					weight.setDiamondWeight(diamondweight);
					weight.setStoneWeight(stoneWeight);
					weight.setGoldWeight(measuredweight.subtract(stoneWeight).subtract(diamondweight));
					break;
				case "PLATINUMSTUDDED":
					BigDecimal stoneWeights = lotNumberMaster.getStoneWeight();
					BigDecimal diamondweights = lotNumberMaster.getDiamondWeight();
					weight.setDiamondWeight(diamondweights);
					weight.setStoneWeight(stoneWeights);
					weight.setPlatinumWeight(measuredweight.subtract(stoneWeights).subtract(diamondweights));
					break;
				case "BI-METAL":
					BigDecimal actualGoldWeight = cmVariantDetail.getActualGoldWeight();
					BigDecimal actualPlatinumWeight = cmVariantDetail.getActualPlatinumWeight();
					weight.setGoldWeight(actualGoldWeight);
					weight.setPlatinumWeight(actualPlatinumWeight);
					break;
				}

			}
		}
		
		weightDetails.setType("WEIGHT_DETAILS");
		weightDetails.setData(weight);
		return weightDetails;

	}

	private PriceDetailsDto getPriceDetails(com.titan.poss.core.dto.CashMemoDetailsDto cmVariant) {
		CMVariantDto cmVariantDetail = cmVariant.getCmVariantDetail();
		LotNumberMasterDto lotNumberMaster = cmVariant.getLotNumberMaster();
		PriceDetailsDto priceDetails = new PriceDetailsDto();
		ItemMasterLegacyDto itemMasterLegacyDto = null;
		if (cmVariant.getItemMasterList() != null) {
			for (ItemMasterLegacyDto legacyItemMaster : cmVariant.getItemMasterList()) {
				if (cmVariantDetail.getItemCode().equalsIgnoreCase(legacyItemMaster.getItemCode())) {
					itemMasterLegacyDto = legacyItemMaster;
					break;
				}
			}
		}
		if (itemMasterLegacyDto != null) {
			priceDetails.setIsUcp("UCP".equalsIgnoreCase(itemMasterLegacyDto.getPricingType()));
		}
		MetalPriceDetailsDto metalPriceDetails = new MetalPriceDetailsDto();
		List<MetalPriceDto> metalPrices = new ArrayList<>();
		BigDecimal totalNetWeight = BigDecimal.ZERO;
		// for calculating GRN Gold Rate
		BigDecimal totalMetalValue = calculateGoldPrice(cmVariant);
		if (cmVariantDetail.getGoldPrice() != 0 || cmVariantDetail.getGoldRate() != 0) {
			MetalPriceDto metalPrice = new MetalPriceDto();
			if (cmVariantDetail.getGoldRate() == null)
				metalPrice.setRatePerUnit(BigDecimal.ZERO);
			else
				metalPrice.setRatePerUnit(new BigDecimal(cmVariantDetail.getGoldRate()));
			if (cmVariantDetail.getGoldPrice() == null)
				metalPrice.setMetalValue(BigDecimal.ZERO);
			else {
				metalPrice.setMetalValue(new BigDecimal(cmVariantDetail.getGoldPrice())
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
				totalMetalValue = totalMetalValue.add(metalPrice.getMetalValue());
			}
			if (cmVariantDetail.getActualGoldWeight() == null)
				metalPrice.setNetWeight(BigDecimal.ZERO);
			else {
				metalPrice.setNetWeight(cmVariantDetail.getActualGoldWeight());
				totalNetWeight = totalNetWeight.add(metalPrice.getNetWeight());
			}
			// metalPrice.setKarat(cmVariantDetail.get);
			metalPrice.setMetalTypeCode("J");
			metalPrice.setType("Gold");
			metalPrice.setWeightUnit("gms");
			// metalPrice.setPurity(cmVariantDetail.get);
			metalPrices.add(metalPrice);
		}
		if (cmVariantDetail.getSilverPrice() != null || cmVariantDetail.getSilverRate() != null) {
			MetalPriceDto metalPrice = new MetalPriceDto();
			if (cmVariantDetail.getSilverRate() == null)
				metalPrice.setRatePerUnit(BigDecimal.ZERO);
			else
				metalPrice.setRatePerUnit(new BigDecimal(cmVariantDetail.getSilverRate()));
			if (cmVariantDetail.getSilverPrice() == null)
				metalPrice.setMetalValue(BigDecimal.ZERO);
			else {
				metalPrice.setMetalValue(new BigDecimal(cmVariantDetail.getSilverPrice())
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
				totalMetalValue = totalMetalValue.add(metalPrice.getMetalValue());
			}
			if (cmVariantDetail.getSilverWeight() == null)
				metalPrice.setNetWeight(BigDecimal.ZERO);
			else {
				metalPrice.setNetWeight(cmVariantDetail.getSilverWeight());
				totalNetWeight = totalNetWeight.add(metalPrice.getNetWeight());
			}
			// metalPrice.setKarat(cmVariantDetail.get);
			metalPrice.setMetalTypeCode("P");
			metalPrice.setType("Silver");
			metalPrice.setWeightUnit("gms");
			// metalPrice.setPurity(cmVariantDetail.get);
			metalPrices.add(metalPrice);
		}
		if (cmVariantDetail.getPlatinumPrice() != null || cmVariantDetail.getPlatinumRate() != null) {
			MetalPriceDto metalPrice = new MetalPriceDto();
			if (cmVariantDetail.getPlatinumRate() == null)
				metalPrice.setRatePerUnit(BigDecimal.ZERO);
			else
				metalPrice.setRatePerUnit(new BigDecimal(cmVariantDetail.getPlatinumRate()));
			if (cmVariantDetail.getPlatinumPrice() == null)
				metalPrice.setMetalValue(BigDecimal.ZERO);
			else {
				metalPrice.setMetalValue(new BigDecimal(cmVariantDetail.getPlatinumPrice())
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
				totalMetalValue = totalMetalValue.add(metalPrice.getMetalValue());
			}
			if (cmVariantDetail.getPlatinumWeight() == null)
				metalPrice.setNetWeight(BigDecimal.ZERO);
			else {
				metalPrice.setNetWeight(cmVariantDetail.getPlatinumWeight());
				totalNetWeight = totalNetWeight.add(metalPrice.getNetWeight());
			}
			// metalPrice.setKarat(cmVariantDetail.get);
			metalPrice.setMetalTypeCode("L");
			metalPrice.setType("Platinum");
			metalPrice.setWeightUnit("gms");
			// metalPrice.setPurity(cmVariantDetail.get);
			metalPrices.add(metalPrice);
		}

		priceDetails.setNetWeight(totalNetWeight);
		StonePriceDetailsDto stonePriceDetails = setStoneDetails(cmVariantDetail, lotNumberMaster);
		ItemHallmarkDetailsDto itemHallmarkDetails = getHallmarkDetails(cmVariantDetail);
		MakingChargeDetailsDto makingChargeDetails = getMakingChargeDetails(cmVariantDetail);

		MaterialPriceDetailsDto materialDetails = new MaterialPriceDetailsDto();
		// materialDetails.setPreDiscountValue(preDiscountValue);
		materialDetails.setMaterialWeight(cmVariantDetail.getOtherMaterialWeight());
		// materialDetails.setWeightUnit(weightUnit);
		metalPriceDetails.setMetalPrices(metalPrices);
		metalPriceDetails.setPreDiscountValue(totalMetalValue);
		priceDetails.setMetalPriceDetails(metalPriceDetails);
		priceDetails.setMakingChargeDetails(makingChargeDetails);
		priceDetails.setMaterialDetails(materialDetails);
		priceDetails.setStonePriceDetails(stonePriceDetails);
		priceDetails.setItemHallmarkDetails(itemHallmarkDetails);
		return priceDetails;
	}

	public BigDecimal calculateGoldPrice(com.titan.poss.core.dto.CashMemoDetailsDto cmVariant) {
		CMVariantDto cmVariantDetail = cmVariant.getCmVariantDetail();
		LotNumberMasterDto lotNumberMaster = cmVariant.getLotNumberMaster();
		BigDecimal totalMetalValue = new BigDecimal("0.00");
		BigDecimal measuredweight = cmVariantDetail.getTotalWeight();
		Double goldRate = cmVariantDetail.getGoldRate();
		BigDecimal goldRates = new BigDecimal(goldRate);
		BigDecimal platinumRates=BigDecimal.ZERO;
		BigDecimal stoneWeight=BigDecimal.ZERO;
		BigDecimal diamondweight=BigDecimal.ZERO;
		BigDecimal weight=BigDecimal.ZERO;
		if(cmVariantDetail.getPlatinumRate()!=null) {
			platinumRates = new BigDecimal(cmVariantDetail.getPlatinumRate());
		}
        if(cmVariant.getItemMasterList()!=null)  {
			switch (cmVariant.getItemMasterList().get(0).getPricingGroupType()) {
			case "GOLDPLAIN":
				totalMetalValue = measuredweight.multiply(goldRates);
				break;
			case "SILVERPLAIN":
				Double silverRate = cmVariantDetail.getSilverRate();
				BigDecimal silverRates = new BigDecimal(silverRate);
				totalMetalValue = measuredweight.multiply(silverRates);
				break;
			case "PLATINUMPLAIN":
				totalMetalValue = measuredweight.multiply(platinumRates);
				break;
			case "GOLDSTUDDED":
				if (lotNumberMaster != null) {
					stoneWeight = lotNumberMaster.getStoneWeight();
					diamondweight = lotNumberMaster.getDiamondWeight();
					weight = diamondweight.add(stoneWeight);
				}		
				totalMetalValue = measuredweight.subtract(weight).multiply(goldRates);
				break;
			case "PLATINUMSTUDDED":
				if (lotNumberMaster != null) {
					stoneWeight = lotNumberMaster.getStoneWeight();
					diamondweight = lotNumberMaster.getDiamondWeight();
					weight = diamondweight.add(stoneWeight);
				}
				totalMetalValue = measuredweight.subtract(weight).multiply(platinumRates);
				break;
			case "BI-METAL":
				BigDecimal actualGoldWeight = cmVariantDetail.getActualGoldWeight();
				BigDecimal actualPlatinumWeight = cmVariantDetail.getActualPlatinumWeight();
				totalMetalValue = (actualGoldWeight.multiply(goldRates)).add(actualPlatinumWeight).add(platinumRates);
				break;
			}

		}

		return totalMetalValue;

	}

	private MakingChargeDetailsDto getMakingChargeDetails(CMVariantDto cmVariantDetail) {
		MakingChargeDetailsDto makingChargeDetails = new MakingChargeDetailsDto();
		makingChargeDetails.setPreDiscountValue(cmVariantDetail.getMakingCharges());
		makingChargeDetails.setWastagePct(cmVariantDetail.getWastagePercentage());
		return makingChargeDetails;
	}

	private ItemHallmarkDetailsDto getHallmarkDetails(CMVariantDto cmVariantDetail) {

		if (BooleanUtils.isNotTrue(cmVariantDetail.getIsHallMarking())) {
			return null;
		}
		ItemHallmarkDetailsDto itemHallmarkDetails = new ItemHallmarkDetailsDto();
		itemHallmarkDetails.setIsHallmarked(cmVariantDetail.getIsHallMarking());
		itemHallmarkDetails.setHmQuantity(cmVariantDetail.getHmQuantity());
		itemHallmarkDetails.setHallmarkingCharges(cmVariantDetail.getHmCharges());

		return itemHallmarkDetails;
	}

	private StonePriceDetailsDto setStoneDetails(CMVariantDto cmVariantDetail, LotNumberMasterDto lotNumberMaster) {
		StonePriceDetailsDto stonePriceDetails = new StonePriceDetailsDto();
		// stonePriceDetails.setNumberOfStones(numberOfStones);
		if (cmVariantDetail.getStoneValue() != null && cmVariantDetail.getStoneValue() > 0)
			stonePriceDetails.setPreDiscountValue(new BigDecimal(cmVariantDetail.getStoneValue()));
		stonePriceDetails.setStoneWeight(BigDecimal.ZERO);
		if (lotNumberMaster != null && ((lotNumberMaster.getStoneWeight() != null
				&& BigDecimal.ZERO.compareTo(lotNumberMaster.getStoneWeight()) < 0)
				|| (lotNumberMaster.getDiamondWeight() != null
						&& BigDecimal.ZERO.compareTo(lotNumberMaster.getDiamondWeight()) < 0))) {
			if (lotNumberMaster.getStoneWeight() != null
					&& BigDecimal.ZERO.compareTo(lotNumberMaster.getStoneWeight()) < 0) {
				stonePriceDetails
						.setStoneWeight(stonePriceDetails.getStoneWeight().add(lotNumberMaster.getStoneWeight()));
			}
			if (lotNumberMaster.getDiamondWeight() != null
					&& BigDecimal.ZERO.compareTo(lotNumberMaster.getDiamondWeight()) < 0) {
				stonePriceDetails
						.setStoneWeight(stonePriceDetails.getStoneWeight().add(lotNumberMaster.getDiamondWeight()));
			}
			if (BigDecimal.ZERO.compareTo(stonePriceDetails.getStoneWeight()) < 0) {
				stonePriceDetails.setWeightUnit("carat");
				stonePriceDetails.setStoneWeightForView(stonePriceDetails.getStoneWeight().divide(new BigDecimal(5),
						DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
				stonePriceDetails.setWeightUnitForView("gms");
			}
		}
		return stonePriceDetails;
	}

	private TaxCalculationResponseDto getCmDetailsTaxDetails(CMVariantDto cmVariantDetail, String cessCode) {
		TaxCalculationResponseDto taxDetails = new TaxCalculationResponseDto();
		if (cmVariantDetail.getTaxType1() != null || cmVariantDetail.getTaxType2() != null) {
			taxDetails.setTaxType("ITEMCHARGES");
			Map<String, TaxDetailDto> data = new HashMap<>();
			Map<String, CessDetailDto> cess = new HashMap<>();
			if (cmVariantDetail.getTaxType1() != null) {
				TaxDetailDto tax1 = new TaxDetailDto();
				tax1.setTaxCode(cmVariantDetail.getTaxType1());
				tax1.setTaxValue(new BigDecimal(cmVariantDetail.getTax1()));
				data.put(cmVariantDetail.getTaxType1(), tax1);
			}
			if (cmVariantDetail.getTaxType2() != null) {
				TaxDetailDto tax2 = new TaxDetailDto();
				tax2.setTaxCode(cmVariantDetail.getTaxType2());
				tax2.setTaxValue(new BigDecimal(cmVariantDetail.getTax2()));
				data.put(cmVariantDetail.getTaxType2(), tax2);
			}
			if (cessCode != null) {
				CessDetailDto cesses = new CessDetailDto();
				cesses.setCessCode(cessCode);
				cesses.setCessPercentage(new BigDecimal(cmVariantDetail.getCessPercentage()));
				cesses.setCessValue(new BigDecimal(cmVariantDetail.getCessValue()));
				cess.put(cessCode, cesses);
			}
			taxDetails.setData(data);
			taxDetails.setCess(cess);
		}
		return taxDetails;
	}

	private CustomerTxnDao mapCustomerTxn(CMLegacyResponseDto legacyCm) {
		CustomerTxnDao customerTxn = (CustomerTxnDao) MapperUtil.getObjectMapping(legacyCm.getCustomerDetails(),
				new CustomerTxnDao());
		customerTxn.setSrcSyncId(0);
		customerTxn.setDestSyncId(0);
		customerTxn.setIsEncrypted(false);
		customerTxn.setEmailId(legacyCm.getCustomerDetails().getEmailId());
		customerTxn.setInstiTaxNo(legacyCm.getCustomerDetails().getGstRegNo());
		if (legacyCm.getCustomerDetails().getGstRegNo() == null) {
			customerTxn.setCustomerType(CustomerTypeEnum.REGULAR.name());
		} else {
			customerTxn.setCustomerType(CustomerTypeEnum.INSTITUTIONAL.name());
		}
		JsonData customerDetails = getCustomerDetailString(legacyCm);
		customerTxn.setCustomerDetails(MapperUtil.getJsonString(customerDetails));
		return customerTxn;
	}

	private JsonData getCustomerDetailString(CMLegacyResponseDto legacyCm) {
		List<String> addressLines = new ArrayList<>();
		addressLines.add(legacyCm.getCustomerDetails().getAddress1());
		addressLines.add(legacyCm.getCustomerDetails().getAddress2());
		JsonData customerDetails = new JsonData();
		if (legacyCm.getCustomerDetails().getGstRegNo() == null) {
			customerDetails.setType(CustomerTypeEnum.REGULAR.name());
			RegularCustomerCreateDto regularCustomer = new RegularCustomerCreateDto();
			regularCustomer.setAddressLines(addressLines);
			if (legacyCm.getCustomerDetails().getAnniversary() != null)
				regularCustomer.setAnniversary(
						DateFormatUtils.format(legacyCm.getCustomerDetails().getAnniversary(), "yyyy-MM-dd"));
			if (legacyCm.getCustomerDetails().getBirthday() != null)
				regularCustomer
						.setBirthday(DateFormatUtils.format(legacyCm.getCustomerDetails().getBirthday(), "yyyy-MM-dd"));
			if (legacyCm.getCustomerDetails().getSpouseBirthday() != null)
				regularCustomer.setSpouseBirthday(
						DateFormatUtils.format(legacyCm.getCustomerDetails().getSpouseBirthday(), "yyyy-MM-dd"));
			regularCustomer.setCity(legacyCm.getCustomerDetails().getTownCode());
			regularCustomer.setCanSendSMS(legacyCm.getCustomerDetails().getCanSendSMS());
			regularCustomer.setCatchmentName(legacyCm.getCustomerDetails().getCatchmentArea());
			regularCustomer.setCountry("INDIA");
			if (legacyCm.getCustomerDetails().getPinCode() != null)
				regularCustomer.setPincode("" + legacyCm.getCustomerDetails().getPinCode());
			regularCustomer.setState(stateCode.get(legacyCm.getCustomerDetails().getStateCode()));
			if (legacyCm.getCustomerDetails().getResTelNo() != null)
				regularCustomer.setAltContactNo(legacyCm.getCustomerDetails().getResTelNo());
			if (legacyCm.getCustomerDetails().getOffTelNo() != null)
				regularCustomer.setAltContactNo(legacyCm.getCustomerDetails().getOffTelNo());
			regularCustomer.setIsHardCopySubmitted(legacyCm.getCustomerDetails().getIsHardCopySubmitted());
			regularCustomer.setIdProof(legacyCm.getCustomerDetails().getIdProof());
			regularCustomer.setIdNumber(legacyCm.getCustomerDetails().getIdNumber());
			if(legacyCm.getCustomerDetails().getForm60()!=null) {
				regularCustomer.setForm60Number(legacyCm.getCustomerDetails().getForm60());			
			}
			if(legacyCm.getCustomerDetails().getForm60IdType()!=null) {
				regularCustomer.setForm60IdType(legacyCm.getCustomerDetails().getForm60IdType());			
			}
			// regularCustomer.setZone();
			customerDetails.setData(regularCustomer);
		} else {
			customerDetails.setType(CustomerTypeEnum.INSTITUTIONAL.name());
			InstitutionalCustomerCreateDto institutionalCustomer = new InstitutionalCustomerCreateDto();
			institutionalCustomer.setAddressLines(addressLines);
			institutionalCustomer.setIsHardCopySubmitted(legacyCm.getCustomerDetails().getIsHardCopySubmitted());
			institutionalCustomer.setCatchmentName(legacyCm.getCustomerDetails().getCatchmentArea());
			// regularCustomer.setZone();
			if (legacyCm.getCustomerDetails().getPinCode() != null)
				institutionalCustomer.setPincode("" + legacyCm.getCustomerDetails().getPinCode());
			institutionalCustomer
					.setState(stateCode.get(Integer.parseInt(legacyCm.getCustomerDetails().getStateCode())));
			institutionalCustomer.setCity(legacyCm.getCustomerDetails().getTownCode());
			institutionalCustomer.setCountry("INDIA");
			institutionalCustomer.setIdProof(legacyCm.getCustomerDetails().getIdProof());
			institutionalCustomer.setIdNumber(legacyCm.getCustomerDetails().getIdNumber());
			// institutionalCustomer.setIsIndividualCustomer(legacyCm.getCustomerDetails().get);
			// institutionalCustomer.setAuthorizedName(authorizedName);
			if (legacyCm.getCustomerDetails().getResTelNo() != null)
				institutionalCustomer.setLandlineNumber(legacyCm.getCustomerDetails().getResTelNo());
			if (legacyCm.getCustomerDetails().getOffTelNo() != null)
				institutionalCustomer.setLandlineNumber(legacyCm.getCustomerDetails().getOffTelNo());
			if(legacyCm.getCustomerDetails().getForm60()!=null) {
				institutionalCustomer.setForm60Number(legacyCm.getCustomerDetails().getForm60());			
			}
			if(legacyCm.getCustomerDetails().getForm60IdType()!=null) {
				institutionalCustomer.setForm60IdType(legacyCm.getCustomerDetails().getForm60IdType());			
			}
			customerDetails.setData(institutionalCustomer);

		}
		return customerDetails;
	}

	@Override
	public void updateGrnItemsLegacyService(GrnLegacyUpdateDto updatedGrnDto) {
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		apiRequest.setReqBody(updatedGrnDto);
		apiRequest.setHttpMethod(HttpMethod.POST);
		try {
			apiCaller.callLegacyAPI(apiRequest, "UpdateGrnUrl");
		} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, LEGACY));
		}
	}

	@Override
	public void updateTepItemsLegacyService(TepLegacyUpdateDto updatedTepDto) {
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		apiRequest.setReqBody(updatedTepDto);
		apiRequest.setHttpMethod(HttpMethod.POST);
		try {
			apiCaller.callLegacyAPI(apiRequest, "UpdateTepUrl");

		} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, LEGACY));
		}
	}

	/**
	 * This method will get the Base URI to Legacy Nap API's
	 * 
	 * @param uriCode
	 * @return uri
	 */
	private String getNapURI() {
		VendorDao vendorDao = vendorRepo.findByVendorCode(VendorCodeEnum.LEGACY_API.name());
		return vendorDao.getBaseurl();
	}
	
	@Override
	public PmlaLegacyResponseDto getPmlaNapService(String dtBusinessDate, String ulpMembershipId) {
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		String uri = getNapURI();
		uri = uri + GET_PMLA_URI;
		apiRequest.setUrl(uri);
		apiRequest.setReqBody(null);
		apiRequest.setHttpMethod(HttpMethod.POST);
		Map<String, String> requestParams = new HashMap<>();

		requestParams.put(BUSINESS_DATE, dtBusinessDate);
		requestParams.put(ULP_MEMBERSHIP_ID, ulpMembershipId);

		apiRequest.setRequestParams(requestParams);
		ApiResponseDto apiResponse = null;
		try {
			apiResponse = apiCaller.runThirdPartyAPI(apiRequest);
		} catch (Exception e) {

			return new PmlaLegacyResponseDto();
		}
		if (ObjectUtils.isEmpty(apiResponse.getResponse()) || apiResponse.getHttpResponseCode() != HttpStatus.SC_OK) {
			return new PmlaLegacyResponseDto();
		}

		PmlaLegacyResponseDto pmlaLegacyResponseDto = MapperUtil.mapObjToClass(apiResponse.getResponse(),
				PmlaLegacyResponseDto.class);
		return pmlaLegacyResponseDto;
	}

	/*
	 * @Override public PmlaLegacyResponseDto getPmlaNapService(String
	 * dtBusinessDate, String ulpMembershipId) { ThirdPartyApiReqDto apiRequest =
	 * new ThirdPartyApiReqDto(); String uri = getNapURI(); uri = uri +
	 * GET_PMLA_URI; apiRequest.setUrl(uri); apiRequest.setReqBody(null);
	 * apiRequest.setHttpMethod(HttpMethod.POST); Map<String, String> requestParams
	 * = new HashMap<>();
	 * 
	 * requestParams.put(BUSINESS_DATE, dtBusinessDate);
	 * requestParams.put(ULP_MEMBERSHIP_ID, ulpMembershipId);
	 * 
	 * apiRequest.setRequestParams(requestParams); ApiResponseDto apiResponse =
	 * null; try { apiResponse = apiCaller.runThirdPartyAPI(apiRequest); } catch
	 * (Exception e) {
	 * 
	 * return new PmlaLegacyResponseDto(); } if
	 * (ObjectUtils.isEmpty(apiResponse.getResponse()) ||
	 * apiResponse.getHttpResponseCode() != HttpStatus.SC_OK) { return new
	 * PmlaLegacyResponseDto(); }
	 * 
	 * PmlaLegacyResponseDto pmlaLegacyResponseDto =
	 * MapperUtil.mapObjToClass(apiResponse.getResponse(),
	 * PmlaLegacyResponseDto.class); return pmlaLegacyResponseDto; }
	 * 
	 *//**
		 * This method will get the Base URI to Legacy Nap API's
		 * 
		 * @param uriCode
		 * @return uri
		 *//*
			 * private String getNapURI() { VendorDao vendorDao =
			 * vendorRepo.findByVendorCode(VendorCodeEnum.LEGACY_API.name()); return
			 * vendorDao.getBaseurl(); }
			 */
}
