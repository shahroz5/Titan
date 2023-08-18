/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Map;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.dto.EinvoiceGstVerifyResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnCancelDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceItemDetailsDto;
import com.titan.poss.core.dto.EinvoiceRetryCancellationDto;
import com.titan.poss.core.dto.EinvoiceRetryDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.EinvoiceVendorConfigDetails;
import com.titan.poss.integration.dto.EinvoiceVendorDetailsDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.EinvoiceAuditDao;
import com.titan.poss.integration.intg.repository.EinvoiceAuditRepository;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.EinvoiceService;
import com.titan.poss.integration.util.EinvoiceErrorUtil;
import com.titan.poss.integration.util.HttpClientUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationEinvoiceService")
@Slf4j
public class EinvoiceServiceImpl implements EinvoiceService {

	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String DATE_FORMAT = "yyyy-MM-dd hh:mm:ss";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";
	private static final String NAME = "Name";
	private static final String ADDRESS = "Address";
	private static final String LOCATION = "Location";
	private static final String ACCESS_TOKEN = "access_token";
	private static final String RESPONSE_OBJECT = "responseObject";
	private static final String MESSAGE = "message";
	private static final String SUCCESS = "success";
	private static final String ERROR = "error";
	private static final String LEGAL_NAME = "LglNm";
	private static final String ADD = "Addr1";
	private static final String CANCEL = "cancel";
	private static final String E_INVOICE = "E-INVOICE";
	private static final String VENDOR_NAME = "vendorName";
	private static final String JSON_DATA_IS_NOT_PROPER="Json data is not proper";

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private VendorConfigRepository vendorConfigRepository;

	@Autowired
	private EinvoiceAuditRepository einvoiceAuditRepository;

	@Override
	public EinvoiceGstVerifyResponseDto verifyGstIn(String vendorCode, String gstIn) {
		EinvoiceGstVerifyResponseDto einvoiceGstVerifyResponseDto = new EinvoiceGstVerifyResponseDto();
		VendorDao vendor = validateVendor(vendorCode);
		EinvoiceVendorDetailsDto einvoiceVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				EinvoiceVendorDetailsDto.class));
		VendorConfigDao vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCodeAndIsActive(vendor.getVendorCode(), CommonUtil.getLocationCode(), true);
		EinvoiceVendorConfigDetails einvoiceVendorConfigDetails = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendorConfig.getConfigDetails(), JsonData.class).getData(),
				EinvoiceVendorConfigDetails.class));
		String verifyUrl = UriComponentsBuilder.fromUriString(einvoiceVendorDetailsDto.getCancelIrnUrl()).build()
				.toUriString();
		EinvoiceAuditDao einvoiceAudit = getInitialEinvoiceDetails(vendor, verifyUrl);
		String authorizationHeader = null;
		authorizationHeader = getEinvoiceToken(vendor, gstIn, einvoiceVendorConfigDetails, einvoiceVendorDetailsDto);
		String base64Encoded = null;
		JSONObject json = new JSONObject();
		try {
			json.put("BpId", einvoiceVendorConfigDetails.getBpId());
			json.put("Action", einvoiceVendorDetailsDto.getVerifyGstAction());
			JSONArray jsonArray = new JSONArray();
			JSONObject jsonData = new JSONObject();
			jsonData.put("gstin", gstIn);
			jsonArray.put(jsonData);
			json.put("Docs", jsonArray);
			String dataToBase64Encode = json.toString();
			base64Encoded = new String(Base64.getEncoder().encode(dataToBase64Encode.getBytes()));
		} catch (Exception e) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, json.toString(), e.getMessage(), Boolean.FALSE, gstIn,
					EinvoiceTransactionTypeEnum.GSTIN_VERIFY.name());
			throw new ServiceException("Unable to parse Json Data", "ERR-CORE-003", e.getMessage());
		}
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(verifyUrl).queryParam(ACCESS_TOKEN,
				authorizationHeader);
		JSONObject jsonRequest = new JSONObject();
		jsonRequest.put("bpId", einvoiceVendorConfigDetails.getBpId());
		jsonRequest.put("data", base64Encoded);

		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		StringEntity entity = null;
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			entity = new StringEntity(jsonRequest.toString());
			sendPostRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			log.info("responselog in try : {}",httpResponseUtil);
		} catch (Exception e) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, json.toString(), e.getMessage(), Boolean.FALSE, gstIn,
					EinvoiceTransactionTypeEnum.GSTIN_VERIFY.name());
			log.info("responselog inside catch: ");
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, E_INVOICE));
		}
		log.info("responselog outside try: {}",httpResponseUtil);
		JsonObject jsonResponse = new JsonParser().parse(httpResponseUtil.getResponse()).getAsJsonObject();
		if (jsonResponse.get(RESPONSE_OBJECT) == null || jsonResponse.get(RESPONSE_OBJECT).isJsonNull()) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, json.toString(), jsonResponse.toString(), Boolean.FALSE, gstIn,
					EinvoiceTransactionTypeEnum.GSTIN_VERIFY.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, jsonResponse.toString(),
					Map.of(VENDOR_NAME, E_INVOICE));
		}
		JsonObject jsonObject = new JsonParser()
				.parse(new String(Base64.getDecoder()
						.decode(jsonResponse.get(RESPONSE_OBJECT).getAsJsonObject().get("data").getAsString())))
				.getAsJsonObject();
		if (jsonObject.get("get_docs") != null) {
			JsonArray jsonArrayResponse = jsonObject.get("get_docs").getAsJsonArray();
			JsonObject result = jsonArrayResponse.get(0).getAsJsonObject();
			if (result.get("status") != null && result.get(MESSAGE) != null) {
				Integer status = result.get("status").getAsInt();
				if (status == 0) {
					einvoiceGstVerifyResponseDto.setGstIn(gstIn);
					einvoiceGstVerifyResponseDto.setStatus(Boolean.FALSE);
					einvoiceGstVerifyResponseDto.setErrorMessage(result.get(MESSAGE).getAsString());
					setFinalEinvoiceAuditDetails(einvoiceAudit, json.toString(), result.toString(), Boolean.FALSE,
							gstIn, EinvoiceTransactionTypeEnum.GSTIN_VERIFY.name());
				}
			} else {
				einvoiceGstVerifyResponseDto.setGstIn(gstIn);
				einvoiceGstVerifyResponseDto.setStatus(Boolean.TRUE);
				setFinalEinvoiceAuditDetails(einvoiceAudit, json.toString(), result.toString(), Boolean.TRUE, gstIn,
						EinvoiceTransactionTypeEnum.GSTIN_VERIFY.name());
			}
		}
		return einvoiceGstVerifyResponseDto;
	}

	@Override
	public EinvoiceIrnDetailsResponseDto generateIrn(String vendorCode, String transactionType,
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto) {
		log.info("inside generate irn method");
		EinvoiceRetryDto einvoiceRetryDto = new EinvoiceRetryDto();
		einvoiceRetryDto.setTransactionType(transactionType);
		einvoiceRetryDto.setEinvoiceIrnDetailsDto(einvoiceIrnDetailsDto);
		String request = MapperUtil.getJsonString(einvoiceRetryDto);
		EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = new EinvoiceIrnDetailsResponseDto();
		einvoiceIrnDetailsResponseDto.setReferenceId(einvoiceIrnDetailsDto.getTransactionId());
		einvoiceIrnDetailsResponseDto.setTransactionType(transactionType);
		VendorDao vendor = validateVendor(vendorCode);
		log.info("vendor {}",vendor);
		EinvoiceVendorDetailsDto einvoiceVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				EinvoiceVendorDetailsDto.class));
		log.info("einvoiceVendorDetailsDto {}",einvoiceVendorDetailsDto);
		VendorConfigDao vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCodeAndIsActive(vendor.getVendorCode(), CommonUtil.getLocationCode(), true);
		EinvoiceVendorConfigDetails einvoiceVendorConfigDetails = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendorConfig.getConfigDetails(), JsonData.class).getData(),
				EinvoiceVendorConfigDetails.class));
		
		log.info("einvoiceVendorConfigDetails {}",einvoiceVendorConfigDetails);
		
		String generateIrnUrl = UriComponentsBuilder.fromUriString(einvoiceVendorDetailsDto.getGenerateIrnUrl()).build()
				.toUriString();
		EinvoiceAuditDao einvoiceAudit = getInitialEinvoiceDetails(vendor, generateIrnUrl);
		String authorizationHeader = null;
		String base64Encoded = null;
		String dataToBase64Encode;
		String invoiceTransactionId = einvoiceIrnDetailsDto.getDocNo() + "/" + transactionType + "/"
				+ CommonUtil.getLocationCode();
		einvoiceAudit.setInvoiceTransactionId(invoiceTransactionId);
		einvoiceAudit.setInvoiceTransactionStatus(Boolean.TRUE);
		JsonObject json = new JsonObject();
		String taxRequest=null;
		
		try {
			log.info("before generate json");
			json = getIrnRequestData(einvoiceVendorDetailsDto, einvoiceVendorConfigDetails, einvoiceIrnDetailsDto,
					transactionType);
			taxRequest= json.toString();
			dataToBase64Encode = json.toString();
			base64Encoded = new String(Base64.getEncoder().encode(dataToBase64Encode.getBytes()));
			log.info("taxRequest {}",taxRequest);
		
		} catch (Exception e) {

			setFinalEinvoiceAuditDetails(einvoiceAudit, request, e.getMessage(), Boolean.FALSE,
					einvoiceIrnDetailsDto.getTransactionId(), transactionType);
			einvoiceIrnDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnDetailsResponseDto.setErrorMessage(e.getMessage());
			return einvoiceIrnDetailsResponseDto;
		}
		try {
			log.debug("Inventory Issue :: Before getEinvoiceToken");
			authorizationHeader = getEinvoiceToken(vendor, einvoiceIrnDetailsDto.getTransactionId(),
					einvoiceVendorConfigDetails, einvoiceVendorDetailsDto);
			log.debug("Inventory Issue :: After getEinvoiceToken :: {}", authorizationHeader);		
		} catch (Exception e) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, request, e.getMessage(), Boolean.FALSE,
					einvoiceIrnDetailsDto.getTransactionId(), transactionType);
			einvoiceIrnDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnDetailsResponseDto.setErrorMessage(e.getMessage());
			return einvoiceIrnDetailsResponseDto;
		}
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(generateIrnUrl).queryParam(ACCESS_TOKEN,
				authorizationHeader);
		JSONObject jsonRequest = new JSONObject();
		jsonRequest.put("bpId", einvoiceVendorConfigDetails.getBpId());
		jsonRequest.put("data", base64Encoded);
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		StringEntity entity = null;
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			entity = new StringEntity(jsonRequest.toString());
			sendPostRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			log.info("httpResponseUtil {}",httpResponseUtil.toString());
		} catch (Exception e) {
			einvoiceAudit.setTaxRequest(taxRequest);
			setFinalEinvoiceAuditDetails(einvoiceAudit, request, e.getMessage(), Boolean.FALSE,
					einvoiceIrnDetailsDto.getTransactionId(), transactionType);
			einvoiceIrnDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnDetailsResponseDto.setErrorMessage(e.getMessage());
			return einvoiceIrnDetailsResponseDto;
		}
		JsonObject jsonResponse = new JsonParser().parse(httpResponseUtil.getResponse()).getAsJsonObject();
		if (jsonResponse.get(RESPONSE_OBJECT) == null || jsonResponse.get(RESPONSE_OBJECT).isJsonNull()) {
			einvoiceAudit.setTaxRequest(taxRequest);
			setFinalEinvoiceAuditDetails(einvoiceAudit, request, jsonResponse.toString(), Boolean.FALSE,
					einvoiceIrnDetailsDto.getTransactionId(), transactionType);
			einvoiceIrnDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnDetailsResponseDto.setErrorMessage(jsonResponse.toString());
			return einvoiceIrnDetailsResponseDto;
		}
		JsonObject jsonObject = new JsonParser()
				.parse(new String(Base64.getDecoder()
						.decode(jsonResponse.get(RESPONSE_OBJECT).getAsJsonObject().get("data").getAsString())))
				.getAsJsonObject();
		if (jsonObject.get("docs") != null) {
			JsonArray jsonArrayResponse = jsonObject.get("docs").getAsJsonArray();
			JsonObject result = jsonArrayResponse.get(0).getAsJsonObject();
			if (result.get(SUCCESS) != null) {
				JsonObject jsonObjectSuccess = result.get(SUCCESS).getAsJsonObject();
				einvoiceIrnDetailsResponseDto.setInvoiceNumber(jsonObjectSuccess.get("Irn").getAsString());
				einvoiceIrnDetailsResponseDto.setQrCodeValue(jsonObjectSuccess.get("SignedQRCode").getAsString());
				einvoiceIrnDetailsResponseDto.setAcknowledgementNo(jsonObjectSuccess.get("AckNo").getAsString());
				einvoiceIrnDetailsResponseDto.setAcknowledgementDate(
						CalendarUtils.convertStringToDate(jsonObjectSuccess.get("AckDt").getAsString(), DATE_FORMAT));
				einvoiceIrnDetailsResponseDto.setStatus(Boolean.TRUE);
				einvoiceAudit.setInvoiceTransactionStatus(Boolean.TRUE);
				einvoiceAudit.setTaxRequest(taxRequest);
				setFinalEinvoiceAuditDetails(einvoiceAudit, request,
						MapperUtil.getJsonString(einvoiceIrnDetailsResponseDto), Boolean.TRUE,
						einvoiceIrnDetailsDto.getTransactionId(), transactionType);
			} else {
				einvoiceIrnDetailsResponseDto
						.setErrorMessage(result.get(ERROR).getAsJsonObject().get(MESSAGE).getAsString());
				einvoiceIrnDetailsResponseDto.setStatus(Boolean.FALSE);
				einvoiceAudit.setTaxRequest(taxRequest);
				setFinalEinvoiceAuditDetails(einvoiceAudit, request, result.get(ERROR).getAsJsonObject().toString(),
						Boolean.FALSE, einvoiceIrnDetailsDto.getTransactionId(), transactionType);
			}
		}
		return einvoiceIrnDetailsResponseDto;
	}

	private JsonObject getIrnRequestData(EinvoiceVendorDetailsDto einvoiceVendorDetailsDto,
			EinvoiceVendorConfigDetails einvoiceVendorConfigDetails, EinvoiceIrnDetailsDto einvoiceIrnDetailsDto,
			String transactionType) {
		
		try {
		
		Boolean isInterState = true;
		if (einvoiceIrnDetailsDto.getSellerGstn().substring(0, 2)
				.equalsIgnoreCase(einvoiceIrnDetailsDto.getBuyerGstn().substring(0, 2))) {
				isInterState = false;
		}
		JsonObject json = new JsonObject();
			
		JsonObject docsObject = new JsonObject();
		docsObject.addProperty("Version", einvoiceVendorDetailsDto.getVersion());
		docsObject.addProperty("UserGstin", einvoiceIrnDetailsDto.getUserGstin());
		docsObject.addProperty("Irn", einvoiceIrnDetailsDto.getIrn());
		docsObject.addProperty("ErpRefid", einvoiceIrnDetailsDto.getErpRefid());
		JsonObject tranDtls = new JsonObject();
		tranDtls.addProperty("TaxSch", einvoiceVendorDetailsDto.getTaxSch());
		tranDtls.addProperty("SupTyp", einvoiceVendorDetailsDto.getSupTyp());
		tranDtls.addProperty("RegRev", einvoiceIrnDetailsDto.getRegRev());
		tranDtls.addProperty("EcmGstin", einvoiceIrnDetailsDto.getEcmGstin());
		docsObject.add("TranDtls", tranDtls);
		JsonObject docDtls = new JsonObject();
		if (transactionType.equalsIgnoreCase(EinvoiceTransactionTypeEnum.GRN.name()))
			docDtls.addProperty("Typ", einvoiceVendorDetailsDto.getDocTypeGrn());
		else
			docDtls.addProperty("Typ", einvoiceVendorDetailsDto.getDocTypeOthers());
		docDtls.addProperty("No",
				"DOC/DF/" + einvoiceIrnDetailsDto.getSellerlocation() + "/" + einvoiceIrnDetailsDto.getDocNo());
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
		docDtls.addProperty("Dt", simpleDateFormat.format(einvoiceIrnDetailsDto.getDocDate()));
		docsObject.add("DocDtls", docDtls);
		docsObject.addProperty("ExpDtls", einvoiceIrnDetailsDto.getExpDtls());
		JsonObject sellerDtls = new JsonObject();
		 sellerDtls.addProperty("Gstin", einvoiceIrnDetailsDto.getSellerGstn());
		 sellerDtls.addProperty("TrdNm", einvoiceIrnDetailsDto.getSellerTrdNm());
//		sellerDtls.addProperty("Gstin", "29AAACT5131A1ZT");
		if (einvoiceIrnDetailsDto.getSellerName() == null || einvoiceIrnDetailsDto.getSellerName().length() < 3
				|| einvoiceIrnDetailsDto.getSellerName().length() > 100)
			sellerDtls.addProperty(LEGAL_NAME, NAME);
		else
			sellerDtls.addProperty(LEGAL_NAME, einvoiceIrnDetailsDto.getSellerName());
		if (einvoiceIrnDetailsDto.getSellerAddress1() == null)
			sellerDtls.addProperty(ADD, ADDRESS);
		else
			sellerDtls.addProperty(ADD, einvoiceIrnDetailsDto.getSellerAddress1());
		sellerDtls.addProperty("Addr2", einvoiceIrnDetailsDto.getSellerAddress2());
		if (einvoiceIrnDetailsDto.getSellerlocation() == null || einvoiceIrnDetailsDto.getSellerlocation().length() < 3
				|| einvoiceIrnDetailsDto.getSellerlocation().length() > 100)
			sellerDtls.addProperty("Loc", LOCATION);
		else
			sellerDtls.addProperty("Loc", einvoiceIrnDetailsDto.getSellerlocation());
		 sellerDtls.addProperty("Pos", einvoiceIrnDetailsDto.getSellerGstn().substring(0, 2));
//		sellerDtls.addProperty("Pos", "29");
		 sellerDtls.addProperty("Pin", einvoiceIrnDetailsDto.getSellerPinCode().intValue());
//		sellerDtls.addProperty("Pin", 571234);
		 sellerDtls.addProperty("Stcd", einvoiceIrnDetailsDto.getSellerGstn().substring(0, 2));
//			sellerDtls.addProperty("Stcd", "29");
		 sellerDtls.addProperty("State", einvoiceIrnDetailsDto.getSellerState());
		 sellerDtls.addProperty("Ph", einvoiceIrnDetailsDto.getSellerPh());
		 sellerDtls.addProperty("Em", einvoiceIrnDetailsDto.getSellerEm());

		docsObject.add("SellerDtls", sellerDtls);
		JsonObject buyerDtls = new JsonObject();
		buyerDtls.addProperty("Gstin", einvoiceIrnDetailsDto.getBuyerGstn());
		buyerDtls.addProperty("TrdNm", einvoiceIrnDetailsDto.getBuyerTrdNm());
		if (einvoiceIrnDetailsDto.getBuyerName() == null || einvoiceIrnDetailsDto.getBuyerName().length() < 3
				|| einvoiceIrnDetailsDto.getBuyerName().length() > 100)
			buyerDtls.addProperty(LEGAL_NAME, NAME);
		else
			buyerDtls.addProperty(LEGAL_NAME, einvoiceIrnDetailsDto.getBuyerName());
		if (einvoiceIrnDetailsDto.getBuyerAddress1() == null)
			buyerDtls.addProperty(ADD, ADDRESS);
		else
			buyerDtls.addProperty(ADD, einvoiceIrnDetailsDto.getBuyerAddress1());
		buyerDtls.addProperty("Addr2", einvoiceIrnDetailsDto.getBuyerAddress2());
		if (einvoiceIrnDetailsDto.getBuyerlocation() == null || einvoiceIrnDetailsDto.getBuyerlocation().length() < 3
				|| einvoiceIrnDetailsDto.getBuyerlocation().length() > 100)
			buyerDtls.addProperty("Loc", LOCATION);
		else
			buyerDtls.addProperty("Loc", einvoiceIrnDetailsDto.getBuyerlocation());
		buyerDtls.addProperty("Pin", einvoiceIrnDetailsDto.getBuyerPinCode().intValue());
		buyerDtls.addProperty("Pos", einvoiceIrnDetailsDto.getBuyerGstn().substring(0, 2));
		buyerDtls.addProperty("Stcd", einvoiceIrnDetailsDto.getBuyerGstn().substring(0, 2));
		buyerDtls.addProperty("State", einvoiceIrnDetailsDto.getBuyerState());
		buyerDtls.addProperty("Ph", einvoiceIrnDetailsDto.getBuyerPh());
		buyerDtls.addProperty("Em", einvoiceIrnDetailsDto.getBuyerEm());
		docsObject.add("BuyerDtls", buyerDtls);
		docsObject.addProperty("DispDtls", einvoiceIrnDetailsDto.getDispDtls());
		docsObject.addProperty("ShipDtls", einvoiceIrnDetailsDto.getShipDtls());
		JsonArray itemList = new JsonArray();
		BigDecimal assessableValue = BigDecimal.ZERO;
		BigDecimal cgstValue = BigDecimal.ZERO;
		BigDecimal sgstValue = BigDecimal.ZERO;
		BigDecimal igstValue = BigDecimal.ZERO;
		BigDecimal cessValue = BigDecimal.ZERO;
		BigDecimal discount = BigDecimal.ZERO;
		BigDecimal totInvoiceValue = BigDecimal.ZERO;
		BigDecimal totInvoiceValueFc = BigDecimal.ZERO;
		for (EinvoiceItemDetailsDto einvoiceItem : einvoiceIrnDetailsDto.getEinvoiceItemDetailsDto()) {
			einvoiceItem.setDiscount(BigDecimal.ZERO);
			JsonObject itemListObject = new JsonObject();
			itemListObject.addProperty("SlNo", einvoiceItem.getSerialNo().toString());
			itemListObject.addProperty("IsServc", "N");
			itemListObject.addProperty("PrdDesc", einvoiceItem.getPrdDesc());
			itemListObject.addProperty("HsnCd", einvoiceItem.getHsnCode());
			itemListObject.addProperty("Qty", einvoiceItem.getQuantity());
			itemListObject.addProperty("FreeQty", einvoiceItem.getFreeQty()==null?Integer.valueOf(0):einvoiceItem.getFreeQty());
			itemListObject.addProperty("Unit", einvoiceItem.getUnit());
			itemListObject.addProperty("UnitPrice",einvoiceItem.getUnitPrice().setScale(2, RoundingMode.UP).doubleValue());
			BigDecimal totalAmount = einvoiceItem.getUnitPrice()
					.multiply(BigDecimal.valueOf(einvoiceItem.getQuantity()));
			itemListObject.addProperty("Discount", einvoiceItem.getDiscount().doubleValue());
			itemListObject.addProperty("PreTaxVal", einvoiceItem.getPreTaxVal().doubleValue());
			if (isInterState) {
				itemListObject.addProperty("IgstAmt", einvoiceItem.getIgstAmount().setScale(2, RoundingMode.UP).doubleValue());
				itemListObject.addProperty("IgstRt", einvoiceItem.getIgstRate().setScale(2, RoundingMode.UP).doubleValue());
				itemListObject.addProperty("GstRt", einvoiceItem.getIgstRate().setScale(2, RoundingMode.UP).doubleValue());
			} else {
				itemListObject.addProperty("CgstAmt", einvoiceItem.getCgstAmount().setScale(2, RoundingMode.UP).doubleValue());
				itemListObject.addProperty("SgstAmt", einvoiceItem.getSgstAmount().setScale(2, RoundingMode.UP).doubleValue());
				itemListObject.addProperty("CgstRt", einvoiceItem.getCgstRate().setScale(2, RoundingMode.UP).doubleValue());
				itemListObject.addProperty("SgstRt", einvoiceItem.getSgstRate().setScale(2, RoundingMode.UP).doubleValue());
				itemListObject.addProperty("GstRt", einvoiceItem.getCgstRate().add(einvoiceItem.getSgstRate()).setScale(2, RoundingMode.UP).doubleValue());
			}
			itemListObject.addProperty("CesRt", einvoiceItem.getCessRate().setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("CesAmt", einvoiceItem.getCessAmount().setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("CesNonAdvlAmt", einvoiceItem.getCesNonAdvlAmt().setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("StateCesRt", einvoiceItem.getStateCesRt().setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("StateCesAmt", einvoiceItem.getStateCesAmt().setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("StateCesNonAdvlAmt", einvoiceItem.getStateCesNonAdvlAmt().setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("OthChrg", einvoiceItem.getOthChrg().setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("OrdLineRef", einvoiceItem.getOrdLineRef());
			itemListObject.addProperty("OrgCntry", einvoiceItem.getOrgCntry());
			itemListObject.addProperty("PrdSlno", einvoiceItem.getPrdSlno());
			itemListObject.addProperty("BchDtls", einvoiceItem.getBchDtls());
			BigDecimal assAmount = totalAmount.subtract(einvoiceItem.getDiscount());
			itemListObject.addProperty("TotAmt", totalAmount.setScale(2, RoundingMode.UP).doubleValue());
			BigDecimal totalItemValue = BigDecimal.ZERO;
			if (isInterState) {
				totalItemValue = assAmount.add(einvoiceItem.getCessAmount()).add(einvoiceItem.getIgstAmount());
			} else {
				totalItemValue = assAmount.add(einvoiceItem.getCgstAmount()).add(einvoiceItem.getSgstAmount())
						.add(einvoiceItem.getCessAmount());
			}
			itemListObject.addProperty("AssAmt", assAmount.setScale(2, RoundingMode.UP).doubleValue());
			itemListObject.addProperty("TotItemVal", totalItemValue.setScale(2, RoundingMode.UP).doubleValue());
			itemList.add(itemListObject);
			assessableValue = assessableValue.add(assAmount);
			cgstValue = cgstValue.add(einvoiceItem.getCgstAmount());
			sgstValue = sgstValue.add(einvoiceItem.getSgstAmount());
			igstValue = igstValue.add(einvoiceItem.getIgstAmount());
			cessValue = cessValue.add(einvoiceItem.getCessAmount());
			discount = discount.add(einvoiceItem.getDiscount());
			totInvoiceValueFc = totInvoiceValueFc.add(totalItemValue);
		}
		docsObject.add("ItemList", itemList);
		docsObject.addProperty("AddlDocDtls", einvoiceIrnDetailsDto.getAddlDocDtls());
		JsonObject valDtls = new JsonObject();
		valDtls.addProperty("AssVal", assessableValue.setScale(2, RoundingMode.UP).doubleValue());
		if (isInterState) {
			valDtls.addProperty("IgstVal", igstValue.setScale(2, RoundingMode.UP).doubleValue());
		} else {
			valDtls.addProperty("CgstVal", cgstValue.setScale(2, RoundingMode.UP).doubleValue());
			valDtls.addProperty("SgstVal", sgstValue.setScale(2, RoundingMode.UP).doubleValue());
		}
		valDtls.addProperty("CesVal", cessValue.setScale(2, RoundingMode.UP).doubleValue());
		valDtls.addProperty("StCesVal", einvoiceIrnDetailsDto.getStCesVal().setScale(2, RoundingMode.UP).doubleValue());
		valDtls.addProperty("Discount", discount.setScale(2, RoundingMode.UP).doubleValue());
		valDtls.addProperty("OthChrg", einvoiceIrnDetailsDto.getOtherCharge().setScale(2, RoundingMode.UP).doubleValue());
		BigDecimal totInvoiceValueFcToSend = totInvoiceValueFc.add(einvoiceIrnDetailsDto.getOtherCharge());
		totInvoiceValue = BigDecimal.valueOf(Math.round(totInvoiceValueFcToSend.doubleValue()));
		valDtls.addProperty("TotInvVal", totInvoiceValue.setScale(2, RoundingMode.UP).doubleValue());
		valDtls.addProperty("TotInvValFc", totInvoiceValueFcToSend.setScale(2, RoundingMode.UP).doubleValue());
		BigDecimal roundOffAmount = BigDecimal.ZERO;
		if (totInvoiceValue.doubleValue() > totInvoiceValueFcToSend.doubleValue())
			roundOffAmount = totInvoiceValue.subtract(totInvoiceValueFcToSend);
		else
			roundOffAmount = totInvoiceValueFcToSend.subtract(totInvoiceValue);
		valDtls.addProperty("RndOffAmt", roundOffAmount.setScale(2, RoundingMode.UP).doubleValue());
		valDtls.addProperty("MnHsn", einvoiceIrnDetailsDto.getMnHsn());
		docsObject.add("ValDtls", valDtls);
		docsObject.addProperty("RefDtls", einvoiceIrnDetailsDto.getRefDtls());
		docsObject.addProperty("PayDtls", einvoiceIrnDetailsDto.getRefDtls());
		JsonArray jsonArray = new JsonArray();
		jsonArray.add(docsObject);
		json.addProperty("BpId", einvoiceVendorConfigDetails.getBpId());
		json.addProperty("ServiceType",einvoiceIrnDetailsDto.getServiceType());
		json.addProperty("Id",einvoiceIrnDetailsDto.getId());
		json.addProperty("Secrt",einvoiceIrnDetailsDto.getSecrt());
		json.addProperty("BatchId",einvoiceIrnDetailsDto.getBatchId());
		json.addProperty("Gstin",einvoiceIrnDetailsDto.getGstin());
		json.add("Docs", jsonArray);
	
		return json;
		}
		catch(Exception e) {
			throw new ServiceException("Unable to parse Json Data", "ERR-CORE-003", e.getMessage());
		}
	
	}

	@Override
	public EinvoiceIrnCancelDetailsResponseDto cancelIrn(String transactionId, String cancelTxnId, String vendorCode,
			String invoiceRefNumber, String docNo, String reason, String remarks) {
		EinvoiceRetryCancellationDto einvoiceRetryCancellationDto = new EinvoiceRetryCancellationDto();
		einvoiceRetryCancellationDto.setInvoiceRefNumber(invoiceRefNumber);
		einvoiceRetryCancellationDto.setTransactionId(transactionId);
		einvoiceRetryCancellationDto.setCancelTxnId(cancelTxnId);
		einvoiceRetryCancellationDto.setReason(reason);
		einvoiceRetryCancellationDto.setRemarks(remarks);
		einvoiceRetryCancellationDto.setDocNo(docNo);
		String request = MapperUtil.getJsonString(einvoiceRetryCancellationDto);
		VendorDao vendor = validateVendor(vendorCode);
		EinvoiceIrnCancelDetailsResponseDto einvoiceIrnCancelDetailsResponseDto = new EinvoiceIrnCancelDetailsResponseDto();
		EinvoiceVendorDetailsDto einvoiceVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				EinvoiceVendorDetailsDto.class));
		VendorConfigDao vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCodeAndIsActive(vendor.getVendorCode(), CommonUtil.getLocationCode(), true);
		EinvoiceVendorConfigDetails einvoiceVendorConfigDetails = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendorConfig.getConfigDetails(), JsonData.class).getData(),
				EinvoiceVendorConfigDetails.class));
		String cancelIrnUrl = UriComponentsBuilder.fromUriString(einvoiceVendorDetailsDto.getCancelIrnUrl()).build()
				.toUriString();
		EinvoiceAuditDao einvoiceAudit = getInitialEinvoiceDetails(vendor, cancelIrnUrl);
		String invoiceTransactionId = docNo + "/" + EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name() + "/"
				+ CommonUtil.getLocationCode();
		einvoiceAudit.setInvoiceTransactionId(invoiceTransactionId);
		einvoiceAudit.setInvoiceTransactionStatus(Boolean.FALSE);
		String authorizationHeader = null;
		String base64Encoded = null;
		JSONObject json = new JSONObject();
		try {
			json.put("BpId", einvoiceVendorConfigDetails.getBpId());
			json.put("action", einvoiceVendorDetailsDto.getCancelIrnAction());
			JSONArray jsonArray = new JSONArray();
			JSONObject jsonData = new JSONObject();
			jsonData.put("Irn", invoiceRefNumber);
			jsonData.put("CnlRsn", EinvoiceErrorUtil.getEinvoiceErrorConstants().get(reason));
			if (remarks != null)
				jsonData.put("CnlRem", remarks);
			else
				jsonData.put("CnlRem", CANCEL);
			jsonArray.put(jsonData);
			json.put("Docs", jsonArray);
			String dataToBase64Encode = json.toString();
			base64Encoded = new String(Base64.getEncoder().encode(dataToBase64Encode.getBytes()));
		} catch (Exception e) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
			einvoiceIrnCancelDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnCancelDetailsResponseDto.setErrorMessage(e.getMessage());
			return einvoiceIrnCancelDetailsResponseDto;
		}
		try {
			authorizationHeader = getEinvoiceToken(vendor, transactionId, einvoiceVendorConfigDetails,
					einvoiceVendorDetailsDto);
		} catch (Exception e) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
			einvoiceIrnCancelDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnCancelDetailsResponseDto.setErrorMessage(e.getMessage());
			return einvoiceIrnCancelDetailsResponseDto;
		}
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(cancelIrnUrl).queryParam(ACCESS_TOKEN,
				authorizationHeader);
		JSONObject jsonRequest = new JSONObject();
		jsonRequest.put("bpId", einvoiceVendorConfigDetails.getBpId());
		jsonRequest.put("data", base64Encoded);

		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		StringEntity entity = null;
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			entity = new StringEntity(jsonRequest.toString());
			sendPostRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
			einvoiceIrnCancelDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnCancelDetailsResponseDto.setErrorMessage(e.getMessage());
			return einvoiceIrnCancelDetailsResponseDto;
		}
		JsonObject jsonResponse = new JsonParser().parse(httpResponseUtil.getResponse()).getAsJsonObject();
		if (jsonResponse.get(RESPONSE_OBJECT) == null || jsonResponse.get(RESPONSE_OBJECT).isJsonNull()) {
			setFinalEinvoiceAuditDetails(einvoiceAudit, request, jsonResponse.toString(), Boolean.FALSE, transactionId,
					EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
			einvoiceIrnCancelDetailsResponseDto.setStatus(Boolean.FALSE);
			einvoiceIrnCancelDetailsResponseDto.setErrorMessage(jsonResponse.toString());
			return einvoiceIrnCancelDetailsResponseDto;
		}
		JsonObject jsonObject = new JsonParser()
				.parse(new String(Base64.getDecoder()
						.decode(jsonResponse.get(RESPONSE_OBJECT).getAsJsonObject().get("data").getAsString())))
				.getAsJsonObject();
		if (jsonObject.get("can_docs") != null) {
			JsonArray jsonArrayResponse = jsonObject.get("can_docs").getAsJsonArray();
			JsonObject result = jsonArrayResponse.get(0).getAsJsonObject();
			if (result.get(SUCCESS) != null) {
				JsonObject jsonObjectSuccess = result.get(SUCCESS).getAsJsonObject();
				einvoiceIrnCancelDetailsResponseDto.setInvoiceNumber(jsonObjectSuccess.get("Irn").getAsString());
				einvoiceIrnCancelDetailsResponseDto.setStatus(Boolean.TRUE);
				setFinalEinvoiceAuditDetails(einvoiceAudit, request, jsonObjectSuccess.toString(), Boolean.TRUE,
						transactionId, EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
			} else {
				einvoiceIrnCancelDetailsResponseDto.setInvoiceNumber(result.get("Irn").getAsString());
				einvoiceIrnCancelDetailsResponseDto.setStatus(Boolean.FALSE);
				einvoiceIrnCancelDetailsResponseDto
						.setErrorMessage(result.get(ERROR).getAsJsonObject().get(MESSAGE).getAsString());
				setFinalEinvoiceAuditDetails(einvoiceAudit, request, result.get(ERROR).getAsJsonObject().toString(),
						Boolean.FALSE, transactionId, EinvoiceTransactionTypeEnum.BILL_CANCELLATION.name());
			}
		}
		return einvoiceIrnCancelDetailsResponseDto;
	}

	private String getEinvoiceToken(VendorDao vendor, String transactionId,
			EinvoiceVendorConfigDetails einvoiceVendorConfigDetails,
			EinvoiceVendorDetailsDto einvoiceVendorDetailsDto) {
		String tokenUrl = UriComponentsBuilder.fromUriString(einvoiceVendorDetailsDto.getTokenUrl()).build()
				.toUriString();
		EinvoiceAuditDao einvoiceAudit = getInitialEinvoiceDetails(vendor, tokenUrl);
		String plainCredentials = einvoiceVendorDetailsDto.getClientId() + ":"
				+ einvoiceVendorDetailsDto.getClientSecretKey();
		String base64Credentials = new String(Base64.getEncoder().encode(plainCredentials.getBytes()));
		String authorizationHeader = "Basic " + base64Credentials;
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(tokenUrl)
				.queryParam("grant_type", "password").queryParam("username", einvoiceVendorConfigDetails.getUserName())
				.queryParam("password", einvoiceVendorConfigDetails.getPassword());
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.addHeader("Authorization", authorizationHeader);
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			log.debug("Inventory Issue :: Before HttpClientUtil.sendHttpRequest");
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			log.info("httpResponseUtil {}",httpResponseUtil.toString());
		} catch (Exception e) {
			log.debug("Inventory Issue :: Before setFinalEinvoiceAuditDetails :: " + e.getMessage());
			setFinalEinvoiceAuditDetails(einvoiceAudit, authorizationHeader, e.getMessage(), Boolean.FALSE,
					transactionId, EinvoiceTransactionTypeEnum.AUTHORIZATION.name());
			log.debug("Inventory Issue :: After setFinalEinvoiceAuditDetails :: " + e.getMessage());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, E_INVOICE));
		}
		JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse()).getAsJsonObject();
		setFinalEinvoiceAuditDetails(einvoiceAudit, authorizationHeader, jsonObject.toString(), Boolean.TRUE,
				transactionId, EinvoiceTransactionTypeEnum.AUTHORIZATION.name());
		return jsonObject.get(ACCESS_TOKEN).getAsString();
	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException("Vendor is not active", "ERR-INT-017");
		}
		return vendor;
	}

	private EinvoiceAuditDao getInitialEinvoiceDetails(VendorDao vendor, String generateIrnUrl) {
		EinvoiceAuditDao einvoiceAudit = new EinvoiceAuditDao();
		einvoiceAudit.setLocationCode(CommonUtil.getLocationCode());
		einvoiceAudit.setUrl(generateIrnUrl);
		einvoiceAudit.setVendor(vendor);
		einvoiceAudit.setRequestTime(CalendarUtils.getCurrentDate());
		return einvoiceAudit;
	}

	private void setFinalEinvoiceAuditDetails(EinvoiceAuditDao einvoiceAudit, String request, String response,
			Boolean transactionStatus, String transactionId, String transactionType) {
		einvoiceAudit.setRequest(request);
		einvoiceAudit.setResponse(response);
		einvoiceAudit.setTransactionStatus(transactionStatus);
		einvoiceAudit.setTransactionId(transactionId);
		einvoiceAudit.setTransactionType(transactionType);
		einvoiceAudit.setHttpStatus(200);
		einvoiceAudit.setResponseTime(CalendarUtils.getCurrentDate());
		einvoiceAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - einvoiceAudit.getRequestTime().getTime());
		einvoiceAuditRepository.save(einvoiceAudit);
	}

}
