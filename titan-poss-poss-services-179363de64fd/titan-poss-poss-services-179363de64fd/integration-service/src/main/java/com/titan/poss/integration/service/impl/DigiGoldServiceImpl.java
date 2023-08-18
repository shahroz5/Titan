/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.io.StringReader;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.lang.BooleanUtils;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.domain.constant.DigiGoldTransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DigiGoldTransactionEnum;
import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldOtpResponseDto;
import com.titan.poss.core.dto.DigiGoldRedeemDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.DigiGoldVendorDetailsDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.DigiGoldAuditDao;
import com.titan.poss.integration.intg.repository.DigiGoldAuditRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.DigiGoldService;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationDigiGoldService")
public class DigiGoldServiceImpl implements DigiGoldService {

	private static final String INVALID_VENDOR = "Vendor is not active";
	private static final String ERR_INT_017 = "ERR-INT-017";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String AUTHORIZATION = "Authorization";
	private static final String BEARER = "Bearer ";
	private static final String DECRYPTION_ERROR = "Error while decryption of digiGold response";
	private static final String ERR_INT_085 = "ERR-INT-085";
	private static final String DATA = "data";
	private static final String TANISHQ_GOLD_BALANCE = "distributor_gold_balance";
	private static final String OTHER_GOLD_BALANCE = "other_gold_balance";
	private static final String CURRENT_PRICE = "current_price";
	private static final String GOLD_AMOUNT_LIMIT = "gold_amount_limit";
	private static final String MOBILE_NO = "mobile_no";
	private static final String OTP = "otp";
	private static final String CODE = "code";
	private static final String STATUS = "status";
	private static final String MESSAGE = "message";
	private static final String SERVICE_UNAVAILBLE = "DigiGold service not availble";
	private static final String SERVICE_FUNCTION = "Service is not functioning";
	private static final String GOLD_BALANCE_ERROR = "Gold balance is not available";
	private static final String ERR_INT_090 = "ERR-INT-090";
	private static final String SELLING_PRICE_ERROR = "Selling price is not available";
	private static final String ERR_INT_091 = "ERR-INT-091";
	private static final String GOLD_AMOUNT_NULL = "Both the gold amounts can't be ZERO or NULL";
	private static final String ERR_INT_093 = "ERR-INT-093";
	private static final String OTP_PRICE_ERROR = "redeem amount is more than available amount";
	private static final String ERR_INT_086 = "ERR-INT-086";
	private static final String TANISHQ = "Tanishq";
	private static final String NON_TANISHQ = "NonTanishq";
	private static final String GOLD_AMOUNT = "gold_amount";
	private static final String DISTRIBUTOR_TXN_ID = "distributor_transaction_id";
	private static final String TXN_ID = "tx_id";
	private static final String REDEEMED = "Redemption Completed";
	private static final String REFUNDED = "transaction has been cancelled";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";
	private static final String VENDOR_NAME = "vendorName";
	private static final String DIGI_GOLD = "DIGI GOLD";

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private DigiGoldAuditRepository digiGoldAuditRepository;

	@Override
	public DigiGoldSellingPriceDto sellingPrice(String vendorCode, String mobileNo, String transactionId) {
		VendorDao vendor = validateVendor(vendorCode);
		DigiGoldSellingPriceDto digiGoldSellingPriceDto = new DigiGoldSellingPriceDto();
		DigiGoldVendorDetailsDto digiGoldVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DigiGoldVendorDetailsDto.class));
		String sellingPriceUrl = UriComponentsBuilder
				.fromUriString(vendor.getBaseurl() + digiGoldVendorDetailsDto.getSellingPriceUrl()).build()
				.toUriString();
		JSONObject requestJson = new JSONObject();
		requestJson.put(MOBILE_NO, mobileNo);
		String request = requestJson.toString();
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor, sellingPriceUrl);
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(sellingPriceUrl);
		HttpGet sendGetRequest = new HttpGet(uriBuilder.toUriString());
		sendGetRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendGetRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendGetRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.SELLING_PRICE.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));

		}
		digiGoldSellingPriceDto.setMobileNo(mobileNo);
		getSellingPriceResponse(httpResponseUtil, digiGoldVendorDetailsDto, transactionId, digiGoldAudit, request,
				digiGoldSellingPriceDto);
		return digiGoldSellingPriceDto;
	}

	private void getSellingPriceResponse(HttpResponseUtil httpResponseUtil,
			DigiGoldVendorDetailsDto digiGoldVendorDetailsDto, String transactionId, DigiGoldAuditDao digiGoldAudit,
			String request, DigiGoldSellingPriceDto digiGoldSellingPriceDto) {
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonReader reader1 = new JsonReader(new StringReader(httpResponseUtil.getResponse()));
			reader1.setLenient(true);
			JsonObject jsonObject = new JsonParser().parse(reader1).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonReader reader2 = new JsonReader(new StringReader(new String(ciphertext)));
			reader2.setLenient(true);
			JsonObject json = new JsonParser().parse(reader2).getAsJsonObject();
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()
					&& json.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.SELLING_PRICE.name());
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, json.get(MESSAGE).getAsString(),
						Map.of(VENDOR_NAME, DIGI_GOLD));
			}
			if (json.get(CURRENT_PRICE) != null && !json.get(CURRENT_PRICE).isJsonNull()) {
				digiGoldSellingPriceDto.setSellingPrice(json.get(CURRENT_PRICE).getAsBigDecimal());
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.TRUE, transactionId,
						DigiGoldTransactionTypeEnum.SELLING_PRICE.name());
			} else {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.SELLING_PRICE.name());
				throw new ServiceException(SELLING_PRICE_ERROR, ERR_INT_091);
			}
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.SELLING_PRICE.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}

	}

	@Override
	public DigiGoldBalanceResponseDto fetchBalance(String vendorCode, String mobileNo, String transactionId) {
		VendorDao vendor = validateVendor(vendorCode);
		DigiGoldVendorDetailsDto digiGoldVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DigiGoldVendorDetailsDto.class));
		String fetchBalanceUrl = UriComponentsBuilder
				.fromUriString(vendor.getBaseurl() + digiGoldVendorDetailsDto.getFetchBalanceUrl()).build()
				.toUriString();
		JSONObject requestJson = new JSONObject();
		requestJson.put(MOBILE_NO, mobileNo);
		String request = requestJson.toString();
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor,
				fetchBalanceUrl.substring(0, fetchBalanceUrl.length() - 1));
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(fetchBalanceUrl).path(mobileNo);
		HttpGet sendGetRequest = new HttpGet(uriBuilder.toUriString());
		sendGetRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendGetRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendGetRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.FETCH_BALANCE.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		return getFetchBalanceResponse(vendor, httpResponseUtil, digiGoldVendorDetailsDto, digiGoldAudit, request,
				mobileNo, transactionId);

	}

	private DigiGoldBalanceResponseDto getFetchBalanceResponse(VendorDao vendor, HttpResponseUtil httpResponseUtil,
			DigiGoldVendorDetailsDto digiGoldVendorDetailsDto, DigiGoldAuditDao digiGoldAudit, String request,
			String mobileNo, String transactionId) {
		DigiGoldBalanceResponseDto digiGoldBalanceResponseDto = new DigiGoldBalanceResponseDto();
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse().trim()).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonObject json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()
					&& json.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.FETCH_BALANCE.name());
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, json.get(MESSAGE).getAsString(),
						Map.of(VENDOR_NAME, DIGI_GOLD));
			}
			if ((json.get(TANISHQ_GOLD_BALANCE) == null || json.get(TANISHQ_GOLD_BALANCE).isJsonNull()
					|| json.get(TANISHQ_GOLD_BALANCE).getAsBigDecimal().equals(BigDecimal.ZERO))
					&& (json.get(OTHER_GOLD_BALANCE) == null || json.get(OTHER_GOLD_BALANCE).isJsonNull()
							|| json.get(OTHER_GOLD_BALANCE).getAsBigDecimal().equals(BigDecimal.ZERO))) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.FETCH_BALANCE.name());
				throw new ServiceException(GOLD_BALANCE_ERROR, ERR_INT_090);
			} else {
				if (json.get(TANISHQ_GOLD_BALANCE) != null && !json.get(TANISHQ_GOLD_BALANCE).isJsonNull())
					digiGoldBalanceResponseDto
							.setTanishqGoldBalanceInGrams(json.get(TANISHQ_GOLD_BALANCE).getAsBigDecimal());
				if (json.get(OTHER_GOLD_BALANCE) != null && !json.get(OTHER_GOLD_BALANCE).isJsonNull())
					digiGoldBalanceResponseDto
							.setNonTanishqGoldBalanceInGrams(json.get(OTHER_GOLD_BALANCE).getAsBigDecimal());
				digiGoldBalanceResponseDto.setMobileNo(mobileNo);
				DigiGoldAuditDao reference = setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(),
						Boolean.TRUE, transactionId, DigiGoldTransactionTypeEnum.FETCH_BALANCE.name());
				digiGoldBalanceResponseDto.setReferenceId(reference.getId());
				return digiGoldBalanceResponseDto;
			}
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.FETCH_BALANCE.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}

	}

	@Override
	public BooleanResponse sendOtp(String vendorCode, String mobileNo, BigDecimal tanishqGoldGms,
			BigDecimal nonTanishqGoldGrams, String transactionId, String referenceId) {
		if ((tanishqGoldGms == null || tanishqGoldGms.equals(BigDecimal.ZERO))
				&& (nonTanishqGoldGrams == null || nonTanishqGoldGrams.equals(BigDecimal.ZERO)))
			throw new ServiceException(GOLD_AMOUNT_NULL, ERR_INT_093);
		validateGoldAmount(referenceId, tanishqGoldGms, nonTanishqGoldGrams);
		BooleanResponse booleanResponse = new BooleanResponse();
		booleanResponse.setStatus(Boolean.FALSE);
		VendorDao vendor = validateVendor(vendorCode);
		DigiGoldVendorDetailsDto digiGoldVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DigiGoldVendorDetailsDto.class));
		String fetchBalanceUrl = UriComponentsBuilder
				.fromUriString(vendor.getBaseurl() + digiGoldVendorDetailsDto.getFetchBalanceUrl()).build()
				.toUriString();
		BigDecimal goldAmount = BigDecimal.ZERO;
		if (tanishqGoldGms != null)
			goldAmount = tanishqGoldGms;
		if (nonTanishqGoldGrams != null)
			goldAmount = nonTanishqGoldGrams;
		if (tanishqGoldGms != null && nonTanishqGoldGrams != null)
			goldAmount = tanishqGoldGms.add(nonTanishqGoldGrams);
		JSONObject requestJson = new JSONObject();
		requestJson.put(MOBILE_NO, mobileNo);
		requestJson.put(TANISHQ_GOLD_BALANCE, tanishqGoldGms);
		requestJson.put(OTHER_GOLD_BALANCE, nonTanishqGoldGrams);
		String request = requestJson.toString();
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(fetchBalanceUrl)
				.path(mobileNo + digiGoldVendorDetailsDto.getSendOtpUrl()).queryParam(GOLD_AMOUNT_LIMIT, goldAmount);
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor,
				fetchBalanceUrl + digiGoldVendorDetailsDto.getSendOtpUrl().substring(1));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.GENERATE_OTP.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));

		}
		getSendOtpResponse(httpResponseUtil, digiGoldVendorDetailsDto, digiGoldAudit, request, booleanResponse,
				transactionId);
		return booleanResponse;
	}

	private void getSendOtpResponse(HttpResponseUtil httpResponseUtil,
			DigiGoldVendorDetailsDto digiGoldVendorDetailsDto, DigiGoldAuditDao digiGoldAudit, String request,
			BooleanResponse booleanResponse, String transactionId) {
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse().trim()).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonObject json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()
					&& json.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.GENERATE_OTP.name());
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, json.get(MESSAGE).getAsString(),
						Map.of(VENDOR_NAME, DIGI_GOLD));
			}
			if (json.get(CODE) == null || json.get(CODE).isJsonNull()) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.TRUE, transactionId,
						DigiGoldTransactionTypeEnum.GENERATE_OTP.name());
				booleanResponse.setStatus(Boolean.TRUE);
			} else {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.GENERATE_OTP.name());
				booleanResponse.setStatus(Boolean.FALSE);
			}
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.GENERATE_OTP.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}

	}

	private void validateGoldAmount(String referenceId, BigDecimal tanishqGoldGms, BigDecimal nonTanishqGoldGms) {
		Optional<DigiGoldAuditDao> digiGoldOptional = digiGoldAuditRepository.findById(referenceId);
		if (digiGoldOptional.isPresent()) {
			DigiGoldAuditDao digiGoldFetchBalance = digiGoldOptional.get();
			JsonObject jsonFetchBalance = new JsonParser().parse(digiGoldFetchBalance.getResponse().trim())
					.getAsJsonObject();
			BigDecimal tanishqAvailableGms = jsonFetchBalance.get(TANISHQ_GOLD_BALANCE).getAsBigDecimal();
			BigDecimal nonTanishqAvailableGms = jsonFetchBalance.get(OTHER_GOLD_BALANCE).getAsBigDecimal();
			if (tanishqGoldGms != null && tanishqGoldGms.compareTo(tanishqAvailableGms) > 0)
				throw new ServiceException(OTP_PRICE_ERROR, ERR_INT_086);
			if (nonTanishqGoldGms != null && nonTanishqGoldGms.compareTo(nonTanishqAvailableGms) > 0) {
				throw new ServiceException(OTP_PRICE_ERROR, ERR_INT_086);
			}
		}
	}

	@Override
	public DigiGoldOtpResponseDto verifyOtp(String vendorCode, String mobileNo, BigDecimal goldGrams, String otp,
			String transactionId) {
		if (goldGrams == null || goldGrams.equals(BigDecimal.ZERO))
			throw new ServiceException(GOLD_AMOUNT_NULL, ERR_INT_093);
		DigiGoldOtpResponseDto digiGoldOtpResponseDto = new DigiGoldOtpResponseDto();
		digiGoldOtpResponseDto.setStatus(Boolean.FALSE);
		VendorDao vendor = validateVendor(vendorCode);
		DigiGoldVendorDetailsDto digiGoldVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DigiGoldVendorDetailsDto.class));
		String fetchBalanceUrl = UriComponentsBuilder
				.fromUriString(vendor.getBaseurl() + digiGoldVendorDetailsDto.getFetchBalanceUrl()).build()
				.toUriString();
		JSONObject requestJson = new JSONObject();
		requestJson.put(MOBILE_NO, mobileNo);
		requestJson.put(OTP, otp);
		requestJson.put(GOLD_AMOUNT_LIMIT, goldGrams);
		String request = requestJson.toString();
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(fetchBalanceUrl)
				.path(mobileNo + digiGoldVendorDetailsDto.getVerifyOtpUrl()).queryParam(GOLD_AMOUNT_LIMIT, goldGrams)
				.queryParam(OTP, otp);
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor,
				fetchBalanceUrl + digiGoldVendorDetailsDto.getVerifyOtpUrl().substring(1));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, otp,
					DigiGoldTransactionTypeEnum.VERIFY_OTP.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		getVerifyOtpResponse(httpResponseUtil, digiGoldVendorDetailsDto, digiGoldOtpResponseDto, digiGoldAudit, request,
				transactionId);
		return digiGoldOtpResponseDto;
	}

	private void getVerifyOtpResponse(HttpResponseUtil httpResponseUtil,
			DigiGoldVendorDetailsDto digiGoldVendorDetailsDto, DigiGoldOtpResponseDto digiGoldOtpResponseDto,
			DigiGoldAuditDao digiGoldAudit, String request, String transactionId) {
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse().trim()).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonObject json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()
					&& json.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.VERIFY_OTP.name());
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, json.get(MESSAGE).getAsString(),
						Map.of(VENDOR_NAME, DIGI_GOLD));
			}
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()) {
				digiGoldOtpResponseDto.setMessage(json.get(MESSAGE).getAsString());
			}
			if (json.get(CODE) == null || json.get(CODE).isJsonNull()) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.TRUE, transactionId,
						DigiGoldTransactionTypeEnum.VERIFY_OTP.name());
				digiGoldOtpResponseDto.setStatus(Boolean.TRUE);
			} else {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.VERIFY_OTP.name());
				digiGoldOtpResponseDto.setStatus(Boolean.FALSE);
			}
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.VERIFY_OTP.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}
	}

	@Override
	public DigiGoldRedeemDto redeemGold(String vendorCode, String transactionType, String mobileNo,
			BigDecimal goldGrams, String otp, String transactionId) {
		if (goldGrams == null || goldGrams.equals(BigDecimal.ZERO))
			throw new ServiceException(GOLD_AMOUNT_NULL, ERR_INT_093);
		VendorDao vendor = validateVendor(vendorCode);
		DigiGoldVendorDetailsDto digiGoldVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DigiGoldVendorDetailsDto.class));
		String fetchBalanceUrl = UriComponentsBuilder
				.fromUriString(vendor.getBaseurl() + digiGoldVendorDetailsDto.getFetchBalanceUrl()).build()
				.toUriString();
		JSONObject requestJson = new JSONObject();
		requestJson.put(MOBILE_NO, mobileNo);
		requestJson.put(OTP, otp);
		requestJson.put(GOLD_AMOUNT_LIMIT, goldGrams);
		String request = requestJson.toString();
		if (transactionType.equalsIgnoreCase(DigiGoldTransactionEnum.TANISHQ.name())) {
			return redeemTanishqGold(vendor, digiGoldVendorDetailsDto, request, fetchBalanceUrl, mobileNo, goldGrams,
					otp, transactionId);
		} else {
			return redeemOtherGold(vendor, digiGoldVendorDetailsDto, request, fetchBalanceUrl, mobileNo, goldGrams, otp,
					transactionId);
		}
	}

	private DigiGoldRedeemDto redeemTanishqGold(VendorDao vendor, DigiGoldVendorDetailsDto digiGoldVendorDetailsDto,
			String request, String fetchBalanceUrl, String mobileNo, BigDecimal goldGrams, String otp,
			String transactionId) {
		DigiGoldRedeemDto digiGoldRedeemDto = new DigiGoldRedeemDto();
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(fetchBalanceUrl)
				.path(mobileNo + digiGoldVendorDetailsDto.getTanishqRedeemUrl()).queryParam(GOLD_AMOUNT, goldGrams)
				.queryParam(DISTRIBUTOR_TXN_ID, TANISHQ).queryParam(OTP, otp);
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor,
				fetchBalanceUrl + digiGoldVendorDetailsDto.getTanishqRedeemUrl().substring(1));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_TANISHQ_GOLD.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse().trim()).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonObject jsonObj = new JsonObject();
			try {
				JsonArray json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonArray();
				jsonObj = json.get(0).getAsJsonObject();
			} catch (Exception e) {
				jsonObj = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			}
			if (jsonObj.get(MESSAGE) != null && !jsonObj.get(MESSAGE).isJsonNull())
				digiGoldRedeemDto.setMessage(jsonObj.getAsJsonObject().get(MESSAGE).getAsString());
			getRedeemTanishqGoldResponse(jsonObj, digiGoldRedeemDto, request, digiGoldAudit, transactionId);
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_TANISHQ_GOLD.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		if (BooleanUtils.isTrue(digiGoldRedeemDto.getStatus())) {
			checkStatus(vendor.getVendorCode(), digiGoldRedeemDto.getTransactionId(), transactionId, digiGoldRedeemDto);
		}
		return digiGoldRedeemDto;
	}

	private void getRedeemTanishqGoldResponse(JsonObject json, DigiGoldRedeemDto digiGoldRedeemDto, String request,
			DigiGoldAuditDao digiGoldAudit, String transactionId) {
		if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()
				&& json.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
			setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_TANISHQ_GOLD.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, json.get(MESSAGE).getAsString(),
					Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		if (json.get(TXN_ID) != null && !json.get(TXN_ID).isJsonNull()) {
			digiGoldRedeemDto.setStatus(Boolean.TRUE);
			digiGoldRedeemDto.setTransactionId(json.get(TXN_ID).getAsString());
			setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.TRUE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_TANISHQ_GOLD.name());
		} else {
			digiGoldRedeemDto.setStatus(Boolean.FALSE);
			setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_TANISHQ_GOLD.name());
		}

	}

	private DigiGoldRedeemDto redeemOtherGold(VendorDao vendor, DigiGoldVendorDetailsDto digiGoldVendorDetailsDto,
			String request, String fetchBalanceUrl, String mobileNo, BigDecimal goldGrams, String otp,
			String transactionId) {
		DigiGoldRedeemDto digiGoldRedeemDto = new DigiGoldRedeemDto();
		digiGoldRedeemDto.setStatus(Boolean.FALSE);
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(fetchBalanceUrl)
				.path(mobileNo + digiGoldVendorDetailsDto.getOtherRedeemUrl()).queryParam(GOLD_AMOUNT, goldGrams)
				.queryParam(DISTRIBUTOR_TXN_ID, NON_TANISHQ).queryParam(OTP, otp);
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor,
				fetchBalanceUrl + digiGoldVendorDetailsDto.getOtherRedeemUrl().substring(1));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, otp,
					DigiGoldTransactionTypeEnum.REDEEM_NON_TANISHQ_GOLD.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse().trim()).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonObject jsonObj = new JsonObject();
			try {
				JsonArray json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonArray();
				jsonObj = json.get(0).getAsJsonObject();
			} catch (Exception e) {
				jsonObj = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			}
			if (jsonObj.get(MESSAGE) != null && !jsonObj.get(MESSAGE).isJsonNull())
				digiGoldRedeemDto.setMessage(jsonObj.get(MESSAGE).getAsString());
			getRedeemOtherGoldResponse(jsonObj, digiGoldRedeemDto, request, digiGoldAudit, transactionId);
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_NON_TANISHQ_GOLD.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		if (BooleanUtils.isTrue(digiGoldRedeemDto.getStatus())) {
			checkStatus(vendor.getVendorCode(), digiGoldRedeemDto.getTransactionId(), transactionId, digiGoldRedeemDto);
		}
		return digiGoldRedeemDto;
	}

	private void getRedeemOtherGoldResponse(JsonObject jsonObject, DigiGoldRedeemDto digiGoldRedeemDto, String request,
			DigiGoldAuditDao digiGoldAudit, String transactionId) {
		if (jsonObject.get(MESSAGE) != null && !jsonObject.get(MESSAGE).isJsonNull()
				&& jsonObject.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
			setFinalDigiGoldDetails(digiGoldAudit, request, jsonObject.toString(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_NON_TANISHQ_GOLD.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, jsonObject.get(MESSAGE).getAsString(),
					Map.of(VENDOR_NAME, DIGI_GOLD));
		}
		if (jsonObject.get(TXN_ID) != null && !jsonObject.get(TXN_ID).isJsonNull()) {
			digiGoldRedeemDto.setStatus(Boolean.TRUE);
			digiGoldRedeemDto.setTransactionId(jsonObject.get(TXN_ID).getAsString());
			setFinalDigiGoldDetails(digiGoldAudit, request, jsonObject.toString(), Boolean.TRUE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_NON_TANISHQ_GOLD.name());
		} else {
			digiGoldRedeemDto.setStatus(Boolean.FALSE);
			setFinalDigiGoldDetails(digiGoldAudit, request, jsonObject.toString(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.REDEEM_NON_TANISHQ_GOLD.name());
		}
	}

	private DigiGoldRedeemDto checkStatus(String vendorCode, String transactionId, String referenceId,
			DigiGoldRedeemDto digiGoldRedeemDto) {
		VendorDao vendor = validateVendor(vendorCode);
		DigiGoldVendorDetailsDto digiGoldVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DigiGoldVendorDetailsDto.class));
		JSONObject requestJson = new JSONObject();
		requestJson.put(TXN_ID, transactionId);
		String request = requestJson.toString();
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor,
				vendor.getBaseurl() + digiGoldVendorDetailsDto.getVerifyTxnUrl1().substring(1)
						+ digiGoldVendorDetailsDto.getVerifyTxnUrl2().substring(1));
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(vendor.getBaseurl())
				.path(digiGoldVendorDetailsDto.getVerifyTxnUrl1() + transactionId
						+ digiGoldVendorDetailsDto.getVerifyTxnUrl2());
		HttpGet sendGetRequest = new HttpGet(uriBuilder.toUriString());
		sendGetRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendGetRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendGetRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, referenceId,
					DigiGoldTransactionTypeEnum.VERIFY_TRANSACTION.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));

		}
		getVerifyTransactionResponse(httpResponseUtil, digiGoldRedeemDto, request, referenceId,
				digiGoldVendorDetailsDto, digiGoldAudit);
		return digiGoldRedeemDto;

	}

	private void getVerifyTransactionResponse(HttpResponseUtil httpResponseUtil, DigiGoldRedeemDto digiGoldRedeemDto,
			String request, String transactionId, DigiGoldVendorDetailsDto digiGoldVendorDetailsDto,
			DigiGoldAuditDao digiGoldAudit) {
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse().trim()).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonObject json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()
					&& json.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.VERIFY_TRANSACTION.name());
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, json.get(MESSAGE).getAsString(),
						Map.of(VENDOR_NAME, DIGI_GOLD));

			}
			if (json.get(STATUS) == null) {
				if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull())
					digiGoldRedeemDto.setMessage(json.get(MESSAGE).getAsString());
				digiGoldRedeemDto.setStatus(Boolean.FALSE);
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.VERIFY_TRANSACTION.name());
			} else {
				Integer status = json.get(STATUS).getAsInt();
				if (status == 1) {
					digiGoldRedeemDto.setStatus(Boolean.TRUE);
					digiGoldRedeemDto.setMessage(REDEEMED);
					setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.TRUE, transactionId,
							DigiGoldTransactionTypeEnum.VERIFY_TRANSACTION.name());
				} else if (status == 3) {
					digiGoldRedeemDto.setStatus(Boolean.FALSE);
					digiGoldRedeemDto.setMessage(REFUNDED);
					setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
							DigiGoldTransactionTypeEnum.VERIFY_TRANSACTION.name());
				} else {
					if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull())
						digiGoldRedeemDto.setMessage(json.get(MESSAGE).getAsString());
					digiGoldRedeemDto.setStatus(Boolean.FALSE);
					setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
							DigiGoldTransactionTypeEnum.VERIFY_TRANSACTION.name());
				}
			}
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.VERIFY_TRANSACTION.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}

	}

	@Override
	public DigiGoldRedeemDto cancelTransaction(String vendorCode, String transactionIdDigiGold, String transactionId) {
		DigiGoldRedeemDto digiGoldRedeemDto = new DigiGoldRedeemDto();
		digiGoldRedeemDto.setTransactionId(transactionIdDigiGold);
		VendorDao vendor = validateVendor(vendorCode);
		DigiGoldVendorDetailsDto digiGoldVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				DigiGoldVendorDetailsDto.class));
		JSONObject requestJson = new JSONObject();
		requestJson.put(TXN_ID, transactionIdDigiGold);
		String request = requestJson.toString();
		DigiGoldAuditDao digiGoldAudit = getInitialDigiGoldDetails(vendor,
				vendor.getBaseurl() + digiGoldVendorDetailsDto.getCancelTxnUrl1().substring(1)
						+ digiGoldVendorDetailsDto.getCancelTxnUrl2().substring(1));
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(vendor.getBaseurl())
				.path(digiGoldVendorDetailsDto.getCancelTxnUrl1() + transactionIdDigiGold
						+ digiGoldVendorDetailsDto.getCancelTxnUrl2());
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BEARER + digiGoldVendorDetailsDto.getAuthorizationToken());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalDigiGoldDetails(digiGoldAudit, request, e.getMessage(), Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.CANCEL_TRANSACTION.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage(), Map.of(VENDOR_NAME, DIGI_GOLD));

		}
		getCancelTransactionResponse(httpResponseUtil, digiGoldRedeemDto, request, transactionId,
				digiGoldVendorDetailsDto, digiGoldAudit);
		return digiGoldRedeemDto;
	}

	private void getCancelTransactionResponse(HttpResponseUtil httpResponseUtil, DigiGoldRedeemDto digiGoldRedeemDto,
			String request, String transactionId, DigiGoldVendorDetailsDto digiGoldVendorDetailsDto,
			DigiGoldAuditDao digiGoldAudit) {
		if (httpResponseUtil.getHttpResponseCode() == 200
				|| (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse().trim()).getAsJsonObject();
			byte[] ciphertext = decryptDigiGoldResponse(digiGoldVendorDetailsDto, jsonObject.get(DATA).getAsString());
			JsonObject json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull()
					&& json.get(MESSAGE).getAsString().equalsIgnoreCase(SERVICE_FUNCTION)) {
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.CANCEL_TRANSACTION.name());
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, json.get(MESSAGE).getAsString(),
						Map.of(VENDOR_NAME, DIGI_GOLD));
			}
			if (json.get(MESSAGE) != null && !json.get(MESSAGE).isJsonNull())
				digiGoldRedeemDto.setMessage(json.get(MESSAGE).getAsString());
			if (json.get(CODE) == null || json.get(CODE).isJsonNull()) {
				digiGoldRedeemDto.setStatus(Boolean.TRUE);
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.TRUE, transactionId,
						DigiGoldTransactionTypeEnum.CANCEL_TRANSACTION.name());
			} else {
				digiGoldRedeemDto.setMessage(json.get(MESSAGE).getAsString());
				digiGoldRedeemDto.setStatus(Boolean.FALSE);
				setFinalDigiGoldDetails(digiGoldAudit, request, json.toString(), Boolean.FALSE, transactionId,
						DigiGoldTransactionTypeEnum.CANCEL_TRANSACTION.name());
			}
		} else {
			setFinalDigiGoldDetails(digiGoldAudit, request, SERVICE_UNAVAILBLE, Boolean.FALSE, transactionId,
					DigiGoldTransactionTypeEnum.CANCEL_TRANSACTION.name());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE, Map.of(VENDOR_NAME, DIGI_GOLD));
		}
	}

	private byte[] decryptDigiGoldResponse(DigiGoldVendorDetailsDto digiGoldVendorDetailsDto, String data) {
		try {
			byte[] base64Data = Base64.getDecoder().decode(data);
			byte[] sessionKey = DatatypeConverter.printHexBinary(
					MessageDigest.getInstance("MD5").digest(digiGoldVendorDetailsDto.getEncryptionKey().getBytes()))
					.toLowerCase().getBytes();
			byte[] iv = Arrays.copyOfRange(base64Data, 0, 16);
			byte[] plaintext = Arrays.copyOfRange(base64Data, 16, base64Data.length);
			Cipher cipher = Cipher.getInstance(digiGoldVendorDetailsDto.getFunctionality());
			cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(sessionKey, "AES"), new IvParameterSpec(iv));
			return cipher.doFinal(plaintext);
		} catch (Exception e) {
			throw new ServiceException(DECRYPTION_ERROR, ERR_INT_085, e.getMessage());
		}
	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException(INVALID_VENDOR, ERR_INT_017);
		}
		return vendor;
	}

	private DigiGoldAuditDao getInitialDigiGoldDetails(VendorDao vendor, String generateIrnUrl) {
		DigiGoldAuditDao digiGoldAuditDao = new DigiGoldAuditDao();
		digiGoldAuditDao.setLocationCode(CommonUtil.getLocationCode());
		digiGoldAuditDao.setUrl(generateIrnUrl);
		digiGoldAuditDao.setVendor(vendor);
		digiGoldAuditDao.setRequestTime(CalendarUtils.getCurrentDate());
		return digiGoldAuditDao;
	}

	private DigiGoldAuditDao setFinalDigiGoldDetails(DigiGoldAuditDao digiGoldAuditDao, String request, String response,
			Boolean transactionStatus, String transactionId, String transactionType) {
		digiGoldAuditDao.setRequest(request);
		digiGoldAuditDao.setResponse(response);
		digiGoldAuditDao.setTransactionStatus(transactionStatus);
		digiGoldAuditDao.setTransactionId(transactionId);
		digiGoldAuditDao.setTransactionType(transactionType);
		digiGoldAuditDao.setHttpStatus(200);
		digiGoldAuditDao.setResponseTime(CalendarUtils.getCurrentDate());
		digiGoldAuditDao
				.setTotalTime(CalendarUtils.getCurrentDate().getTime() - digiGoldAuditDao.getRequestTime().getTime());
		return digiGoldAuditRepository.save(digiGoldAuditDao);
	}

	@Override
	public Object testApi(String testString) {
		try {
			byte[] base64Data = Base64.getDecoder().decode(testString);
			byte[] sessionKey = DatatypeConverter
					.printHexBinary(
							MessageDigest.getInstance("MD5").digest("28cded8eb78b60732fe8f5c30ca2e822".getBytes()))
					.toLowerCase().getBytes();
			byte[] iv = Arrays.copyOfRange(base64Data, 0, 16);
			byte[] plaintext = Arrays.copyOfRange(base64Data, 16, base64Data.length);
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(sessionKey, "AES"), new IvParameterSpec(iv));
			byte[] ciphertext = cipher.doFinal(plaintext);
			JsonObject json = new JsonObject();
			try {
				JsonArray jsonArray = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonArray();
				json = jsonArray.get(0).getAsJsonObject();
			} catch (Exception e) {
				json = new JsonParser().parse(new String(ciphertext).trim()).getAsJsonObject();
			}
			ObjectMapper objectMapper = new ObjectMapper();
			Object event = objectMapper.readValue(json.toString(), Object.class);
			return event;
		} catch (Exception e) {
			throw new ServiceException("ERROR", "ERROR", e.getMessage());
		}
	}

	@Override
	public Boolean checkFile(MultipartFile reqFile) {
		if (reqFile == null)
			return Boolean.TRUE;
		else
			return Boolean.FALSE;
	}

}
