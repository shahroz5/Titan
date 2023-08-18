/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLException;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.execchain.RequestAbortedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;
import com.titan.poss.core.dto.GiftCardBaseCancelActivateDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.gc.GiftCardActivateRequestDto;
import com.titan.poss.integration.dto.request.gc.GiftCardBalanceRequestDto;
import com.titan.poss.integration.dto.request.gc.GiftCardCancelActivateDto;
import com.titan.poss.integration.dto.request.gc.GiftCardRedeemRequestDto;
import com.titan.poss.integration.dto.request.gc.GiftCardReverseRedeemRequestDto;
import com.titan.poss.integration.dto.request.gc.QcConnectionPropertiesDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.GiftCardAuditDao;
import com.titan.poss.integration.intg.dao.VendorConfigDaoExt;
import com.titan.poss.integration.intg.repository.GiftCardAuditRepository;
import com.titan.poss.integration.intg.repository.VendorConfigRepositoryExt;
import com.titan.poss.integration.service.GiftCardService;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("IntegrationQwikCilverGiftCardService")
public class QwikCilverGiftCardServiceImpl implements GiftCardService {

	@Autowired
	private VendorConfigRepositoryExt vendorConfigRepository;

	@Autowired
	private GiftCardAuditRepository giftCardAuditRepository;

	private static final String GC = "gc";
	private static final String BALANCE_ENQUIRY = "balanceenquiry";
	private static final String CUSTOMERS = "customers";
	private static final String REDEEM = "redeem";
	private static final String REVERSE_REDEEM = "reverseRedeem";
	private static final String ACTIVATE = "activate";
	private static final String CANCEL_ACTIVATE = "cancelactivate";
	private static final String INITIALIZE = "initialize";
	private static final String TRANSACTION_ID = "TransactionId";
	private static final String TERMINAL_ID = "TerminalId";
	private static final String RESPONSE_CODE = "ResponseCode";
	private static final String RESPONSE_MESSAGE = "ResponseMessage";
	private static final String USER_NAME = "UserName";
	private static final String PASS_WORD = "Password";
	private static final String FORWARDING_ENTITY_ID = "ForwardingEntityId";
	private static final String FORWARDING_ENTITY_PASS_WORD = "ForwardingEntityPassword";
	private static final String DATE_AT_CLIENT = "DateAtClient";
	private static final String IS_FORWADING_ENTITY_EXISTS = "IsForwardingEntityExists";
	private static final String POS_ENTRY_MODE = "POSEntrymode";
	private static final String POS_TYPE_ID = "POSTypeId";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
	private static final String MERCHANT_OUTLET_NAME = "MerchantOutletName";
	private static final String ACQUIRER_ID = "AcquirerId";
	private static final String ORGANIZTION_NAME = "OrganizationName";
	private static final String POS_NAME = "POSName";
	private static final String CURRENT_BATCH_NUMBER = "CurrentBatchNumber";
	private static final String TERM_APP_VERSION = "TermAppVersion";
	private static final String CARD_NUMBER = "CardNumber";
	private static final String DATA = "data";
	private static final String EMPLOYEE_CODE_NOTES = "{DiscType~E}";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";

	@Override
	public GcResponseDto getBalance(VendorDao vendor, String cardNumber, String trackData, boolean otpRequired,
			GiftCardTypeEnum giftCardTypeEnum) {
		if (StringUtils.isEmpty(cardNumber)) {
			cardNumber = extractCardNumberFromTrackData(trackData);
		}
		if (giftCardTypeEnum.name().equalsIgnoreCase(GiftCardTypeEnum.EMPLOYEE_CODE.name())) {
			cardNumber = appendEmployeeCodePrefix(vendor, cardNumber);
		}
		VendorConfigDaoExt vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCode(vendor.getVendorCode(), CommonUtil.getLocationCode());
		QcConnectionPropertiesDto connectionProperties = getQcConnectionProperties(vendorConfig);

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + GC + "/" + BALANCE_ENQUIRY).build()
				.toUriString();
		String locationCode = CommonUtil.getLocationCode();

		HttpPost postRequest = getCommonPostHeaders(url, connectionProperties);

		GiftCardAuditDao giftCardAudit = getInitialGiftCardAuditData(url, BALANCE_ENQUIRY, locationCode, cardNumber,
				null, vendor);

		GiftCardBalanceRequestDto giftCardBalanceRequest = new GiftCardBalanceRequestDto();
		giftCardBalanceRequest.setCardNumber(cardNumber);
		giftCardBalanceRequest.setTrackData(trackData);
		giftCardBalanceRequest.setTransactionId(giftCardAudit.getSequenceNo().toString());
		if (giftCardTypeEnum.name().equalsIgnoreCase(GiftCardTypeEnum.GIFTCARD_CODE.name())
				&& BooleanUtils.isTrue(otpRequired)) {
			giftCardBalanceRequest.setNotes(buildNotes("ValType~GCRDM", null, null, null));
		} else if (giftCardTypeEnum.name().equalsIgnoreCase(GiftCardTypeEnum.EMPLOYEE_CODE.name())) {
			giftCardBalanceRequest.setNotes(EMPLOYEE_CODE_NOTES);
		}
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();

		try {
			String jsonStr = MapperUtil.getJsonString(giftCardBalanceRequest);
			giftCardAudit.setRequest(jsonStr);
			StringEntity entity = new StringEntity(jsonStr);
			postRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(postRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwCommonServiceException(ex);
		}
		GcResponseDto response = mapQcResponse(giftCardAudit, httpResponseUtil.getResponse(),
				giftCardAudit.getSequenceNo().toString(), httpResponseUtil.getHttpResponseCode(), cardNumber);

		if (response.getResponseCode().equalsIgnoreCase("0")) {
			saveGiftCardAuditData(giftCardAudit, httpResponseUtil.getResponse(), response.getApprovalCode(),
					httpResponseUtil.getHttpResponseCode());
		}
		return response;
	}

	@Override
	public GcCustomerResponseDto getCustomerInfo(VendorDao vendor, String giftCardNumber) {
		VendorConfigDaoExt vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCode(vendor.getVendorCode(), CommonUtil.getLocationCode());
		QcConnectionPropertiesDto connectionProperties = getQcConnectionProperties(vendorConfig);

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + GC + "/" + CUSTOMERS)
				.queryParam(CARD_NUMBER, giftCardNumber).build().toUriString();
		String locationCode = CommonUtil.getLocationCode();

		GiftCardAuditDao giftCardAudit = getInitialGiftCardAuditData(url, CUSTOMERS, locationCode, giftCardNumber, null,
				vendor);

		HttpGet getRequest = getCommonGetHeaders(url, connectionProperties);
		getRequest.addHeader(TRANSACTION_ID, giftCardAudit.getSequenceNo().toString());
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			giftCardAudit.setRequest(giftCardNumber);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(getRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwCommonServiceException(ex);
		}

		GcCustomerResponseDto response = mapCustomerResponseDto(giftCardAudit, httpResponseUtil.getResponse(),
				httpResponseUtil.getHttpResponseCode());
		if (response.getResponseCode().equalsIgnoreCase("0")) {
			saveGiftCardAuditData(giftCardAudit, httpResponseUtil.getResponse(), null,
					httpResponseUtil.getHttpResponseCode());
		}
		return response;
	}

	@Override
	public GcResponseDto redeemGiftCardBalanace(VendorDao vendor,
			GiftCardBaseRedeemRequestDto giftCardBaseRedeemRequestDto, GiftCardTypeEnum giftCardTypeEnum) {
		if (giftCardTypeEnum.name().equalsIgnoreCase(GiftCardTypeEnum.EMPLOYEE_CODE.name())) {
			giftCardBaseRedeemRequestDto
					.setCardNumber(appendEmployeeCodePrefix(vendor, giftCardBaseRedeemRequestDto.getCardNumber()));
		}
		GiftCardRedeemRequestDto giftCardRedeemRequestDto = new GiftCardRedeemRequestDto();
		MapperUtil.beanMapping(giftCardBaseRedeemRequestDto, giftCardRedeemRequestDto);
		VendorConfigDaoExt vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCode(vendor.getVendorCode(), CommonUtil.getLocationCode());
		QcConnectionPropertiesDto connectionProperties = getQcConnectionProperties(vendorConfig);

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + GC + "/" + REDEEM).build()
				.toUriString();
		String locationCode = CommonUtil.getLocationCode();

		GiftCardAuditDao giftCardAudit = getInitialGiftCardAuditData(url, REDEEM, locationCode,
				giftCardRedeemRequestDto.getCardNumber(), giftCardRedeemRequestDto.getInvoiceNumber(), vendor);

		HttpPost postRequest = getCommonPostHeaders(url, connectionProperties);
		postRequest.addHeader(TRANSACTION_ID, giftCardAudit.getSequenceNo().toString());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		if (StringUtils.isEmpty(giftCardRedeemRequestDto.getCardNumber())) {
			giftCardRedeemRequestDto
					.setCardNumber(extractCardNumberFromTrackData(giftCardRedeemRequestDto.getTrackData()));
		}
		if (giftCardTypeEnum.name().equalsIgnoreCase(GiftCardTypeEnum.GIFTCARD_CODE.name())) {
			giftCardRedeemRequestDto.setNotes(buildNotes("ValType~GCRDM",
					giftCardRedeemRequestDto.getAmount().toString(),
					giftCardRedeemRequestDto.getBillAmount().toString(), giftCardRedeemRequestDto.getInvoiceNumber()));
		} else {
			giftCardRedeemRequestDto.setNotes(EMPLOYEE_CODE_NOTES);
		}

		try {
			String jsonStr = MapperUtil.getJsonString(giftCardRedeemRequestDto);
			giftCardAudit.setRequest(jsonStr);
			StringEntity entity = new StringEntity(jsonStr);
			postRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(postRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			// calling the reverse redeem api in case of exceptions
			GiftCardReverseRedeemRequestDto giftCardReverseRedeemRequestDto = new GiftCardReverseRedeemRequestDto();
			giftCardReverseRedeemRequestDto.setCardNumber(giftCardRedeemRequestDto.getCardNumber());
			giftCardReverseRedeemRequestDto.setTrackData(giftCardRedeemRequestDto.getTrackData());
			giftCardReverseRedeemRequestDto.setInvoiceNumber(giftCardRedeemRequestDto.getInvoiceNumber());
			giftCardReverseRedeemRequestDto.setAmount(giftCardRedeemRequestDto.getAmount());
			giftCardReverseRedeemRequestDto.setBillAmount(giftCardRedeemRequestDto.getBillAmount());
			giftCardReverseRedeemRequestDto.setTransactionId(giftCardAudit.getSequenceNo().toString());
			reverseRedeem(vendor, giftCardReverseRedeemRequestDto, giftCardTypeEnum);
			throwCommonServiceException(ex);
		}
		GcResponseDto response = mapQcResponse(giftCardAudit, httpResponseUtil.getResponse(),
				giftCardAudit.getSequenceNo().toString(), httpResponseUtil.getHttpResponseCode(),
				giftCardRedeemRequestDto.getCardNumber());

		if (response.getResponseCode().equalsIgnoreCase("0")) {
			saveGiftCardAuditData(giftCardAudit, httpResponseUtil.getResponse(), response.getApprovalCode(),
					httpResponseUtil.getHttpResponseCode());
		}
		return response;
	}

	@Override
	public GcResponseDto reverseRedeem(VendorDao vendor,
			GiftCardBaseReverseRedeemRequestDto giftCardBaseReverseRedeemRequestDto,
			GiftCardTypeEnum giftCardTypeEnum) {
		if (giftCardTypeEnum.name().equalsIgnoreCase(GiftCardTypeEnum.EMPLOYEE_CODE.name())) {
			giftCardBaseReverseRedeemRequestDto.setCardNumber(
					appendEmployeeCodePrefix(vendor, giftCardBaseReverseRedeemRequestDto.getCardNumber()));
		}
		GiftCardReverseRedeemRequestDto giftCardRedeemRequestDto = new GiftCardReverseRedeemRequestDto();
		MapperUtil.beanMapping(giftCardBaseReverseRedeemRequestDto, giftCardRedeemRequestDto);
		VendorConfigDaoExt vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCode(vendor.getVendorCode(), CommonUtil.getLocationCode());
		QcConnectionPropertiesDto connectionProperties = getQcConnectionProperties(vendorConfig);

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + GC + "/" + REVERSE_REDEEM).build()
				.toUriString();
		String locationCode = CommonUtil.getLocationCode();

		GiftCardAuditDao giftCardAudit = getInitialGiftCardAuditData(url, REVERSE_REDEEM, locationCode,
				giftCardRedeemRequestDto.getCardNumber(), giftCardRedeemRequestDto.getInvoiceNumber(), vendor);

		HttpPost postRequest = getCommonPostHeaders(url, connectionProperties);
		postRequest.addHeader(TRANSACTION_ID, giftCardRedeemRequestDto.getTransactionId());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		if (StringUtils.isEmpty(giftCardRedeemRequestDto.getCardNumber())) {
			giftCardRedeemRequestDto
					.setCardNumber(extractCardNumberFromTrackData(giftCardRedeemRequestDto.getTrackData()));
		}
		if (giftCardTypeEnum.name().equalsIgnoreCase(GiftCardTypeEnum.GIFTCARD_CODE.name())) {
			giftCardRedeemRequestDto.setNotes(buildNotes("ValType~CNLRDM",
					giftCardRedeemRequestDto.getAmount().toString(),
					giftCardRedeemRequestDto.getBillAmount().toString(), giftCardRedeemRequestDto.getInvoiceNumber()));
		} else {
			giftCardRedeemRequestDto.setNotes(EMPLOYEE_CODE_NOTES);
		}

		try {
			String jsonStr = MapperUtil.getJsonString(giftCardRedeemRequestDto);
			giftCardAudit.setRequest(jsonStr);
			StringEntity entity = new StringEntity(jsonStr);
			postRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(postRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwCommonServiceException(ex);
		}
		GcResponseDto response = mapQcResponse(giftCardAudit, httpResponseUtil.getResponse(),
				giftCardAudit.getSequenceNo().toString(), httpResponseUtil.getHttpResponseCode(),
				giftCardRedeemRequestDto.getCardNumber());

		if (response.getResponseCode().equalsIgnoreCase("0")) {
			saveGiftCardAuditData(giftCardAudit, httpResponseUtil.getResponse(), response.getApprovalCode(),
					httpResponseUtil.getHttpResponseCode());
		}
		return response;
	}

	@Override
	public GcActivateResponseDto activateGiftCard(VendorDao vendor,
			GiftCardBaseActivateRequestDto giftCardBaseActivateRequestDto) {

		GiftCardActivateRequestDto giftCardActivateRequestDto = new GiftCardActivateRequestDto();
		MapperUtil.beanMapping(giftCardBaseActivateRequestDto, giftCardActivateRequestDto);
		VendorConfigDaoExt vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCode(vendor.getVendorCode(), CommonUtil.getLocationCode());
		QcConnectionPropertiesDto connectionProperties = getQcConnectionProperties(vendorConfig);

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + GC + "/" + ACTIVATE).build()
				.toUriString();
		String locationCode = CommonUtil.getLocationCode();

		GiftCardAuditDao giftCardAudit = getInitialGiftCardAuditData(url, ACTIVATE, locationCode,
				giftCardActivateRequestDto.getCardNumber(), giftCardActivateRequestDto.getInvoiceNumber(), vendor);

		HttpPost postRequest = getCommonPostHeaders(url, connectionProperties);
		postRequest.addHeader(TRANSACTION_ID, giftCardAudit.getSequenceNo().toString());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		if (StringUtils.isEmpty(giftCardActivateRequestDto.getCardNumber())) {
			giftCardActivateRequestDto
					.setCardNumber(extractCardNumberFromTrackData(giftCardActivateRequestDto.getTrackData()));
		}
		giftCardActivateRequestDto.setNotes(buildNotes("ValType~GCACT", giftCardActivateRequestDto.getAmount(), null,
				giftCardActivateRequestDto.getInvoiceNumber()));
		giftCardActivateRequestDto.setIdempotencyKey(giftCardAudit.getSequenceNo().toString());
		try {
			String jsonStr = MapperUtil.getJsonString(giftCardActivateRequestDto);
			giftCardAudit.setRequest(jsonStr);
			StringEntity entity = new StringEntity(jsonStr);
			postRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(postRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwCommonServiceException(ex);
		}
		GcActivateResponseDto response = mapQcActivateCardResponse(giftCardAudit, httpResponseUtil.getResponse(),
				giftCardAudit.getSequenceNo().toString(), httpResponseUtil.getHttpResponseCode());

		if (response.getResponseCode().equalsIgnoreCase("0")) {
			saveGiftCardAuditData(giftCardAudit, httpResponseUtil.getResponse(), response.getApprovalCode(),
					httpResponseUtil.getHttpResponseCode());
		}
		return response;
	}

	@Override
	public GcResponseDto cancelActivate(VendorDao vendor, GiftCardBaseCancelActivateDto giftCardCanceBaselActivateDto) {

		GiftCardCancelActivateDto giftCardCancelActivateDto = new GiftCardCancelActivateDto();
		MapperUtil.beanMapping(giftCardCanceBaselActivateDto, giftCardCancelActivateDto);

		VendorConfigDaoExt vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCode(vendor.getVendorCode(), CommonUtil.getLocationCode());
		QcConnectionPropertiesDto connectionProperties = getQcConnectionProperties(vendorConfig);

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + GC + "/" + CANCEL_ACTIVATE).build()
				.toUriString();
		String locationCode = CommonUtil.getLocationCode();

		GiftCardAuditDao giftCardAudit = getInitialGiftCardAuditData(url, CANCEL_ACTIVATE, locationCode,
				giftCardCancelActivateDto.getCardNumber(), giftCardCancelActivateDto.getOriginalInvoiceNumber(),
				vendor);

		HttpPost postRequest = getCommonPostHeaders(url, connectionProperties);
		postRequest.addHeader(TRANSACTION_ID, giftCardAudit.getSequenceNo().toString());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		if (StringUtils.isEmpty(giftCardCancelActivateDto.getCardNumber())) {
			giftCardCancelActivateDto
					.setCardNumber(extractCardNumberFromTrackData(giftCardCancelActivateDto.getTrackData()));
		}
		giftCardCancelActivateDto.setNotes(buildNotes("ValType~CNLACT", giftCardCancelActivateDto.getOriginalAmount(),
				null, giftCardCancelActivateDto.getOriginalInvoiceNumber()));
		try {
			String jsonStr = MapperUtil.getJsonString(giftCardCancelActivateDto);
			giftCardAudit.setRequest(jsonStr);
			StringEntity entity = new StringEntity(jsonStr);
			postRequest.setEntity(entity);
			httpResponseUtil = HttpClientUtil.sendHttpRequest(postRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwCommonServiceException(ex);
		}
		GcResponseDto response = mapQcResponse(giftCardAudit, httpResponseUtil.getResponse(),
				giftCardAudit.getSequenceNo().toString(), httpResponseUtil.getHttpResponseCode(),
				giftCardCancelActivateDto.getCardNumber());

		if (response.getResponseCode().equalsIgnoreCase("0")) {
			saveGiftCardAuditData(giftCardAudit, httpResponseUtil.getResponse(), response.getApprovalCode(),
					httpResponseUtil.getHttpResponseCode());
		}
		return response;
	}

	@Override
	public void initialize(VendorDao vendor) {

		JsonObject vendorMasterObject = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject();
		VendorConfigDaoExt vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCode(vendor.getVendorCode(), CommonUtil.getLocationCode());
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class);
		JsonObject vendorConfigObject = new JsonParser().parse(MapperUtil.getJsonString(jsonData.getData()))
				.getAsJsonObject();

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + INITIALIZE).build().toUriString();
		String locationCode = CommonUtil.getLocationCode();

		GiftCardAuditDao giftCardAudit = getInitialGiftCardAuditData(url, INITIALIZE, locationCode, null, null, vendor);

		HttpGet getRequest = new HttpGet(url);
		getRequest.addHeader(TERMINAL_ID, vendorConfigObject.get(TERMINAL_ID).getAsString());
		getRequest.addHeader(USER_NAME, vendorMasterObject.getAsJsonObject(DATA).get(USER_NAME).getAsString());
		String encryptedPassword = vendorMasterObject.getAsJsonObject(DATA).get(PASS_WORD).getAsString();
		getRequest.addHeader(PASS_WORD, CryptoUtil.decrypt(encryptedPassword, CommonConstants.PASS_WORD, false));
		getRequest.addHeader(FORWARDING_ENTITY_ID,
				vendorMasterObject.getAsJsonObject(DATA).get(FORWARDING_ENTITY_ID).getAsString());
		getRequest.addHeader(FORWARDING_ENTITY_PASS_WORD,
				vendorMasterObject.getAsJsonObject(DATA).get(FORWARDING_ENTITY_PASS_WORD).getAsString());
		getRequest.addHeader(DATE_AT_CLIENT,
				CalendarUtils.formatDateToString(CalendarUtils.getCurrentDate(), DATE_TIME_FORMAT));
		getRequest.addHeader(TRANSACTION_ID, giftCardAudit.getSequenceNo().toString());
		getRequest.addHeader(IS_FORWADING_ENTITY_EXISTS,
				vendorMasterObject.getAsJsonObject(DATA).get(IS_FORWADING_ENTITY_EXISTS).getAsString());
		getRequest.addHeader(POS_ENTRY_MODE,
				vendorMasterObject.getAsJsonObject(DATA).get(POS_ENTRY_MODE).getAsString());
		getRequest.addHeader(POS_TYPE_ID, vendorMasterObject.getAsJsonObject(DATA).get(POS_TYPE_ID).getAsString());
		getRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(getRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse()).getAsJsonObject();
			checkError(giftCardAudit, jsonObject.get(RESPONSE_CODE).toString(), httpResponseUtil.getHttpResponseCode(),
					httpResponseUtil.getResponse());
			JsonObject jsonWebPropertiesObject = jsonObject.get("ApiWebProperties").getAsJsonObject();
			QcConnectionPropertiesDto qcConfigProperties = MapperUtil.mapObjToClass(jsonWebPropertiesObject.toString(),
					QcConnectionPropertiesDto.class);
			qcConfigProperties
					.setPassword(CryptoUtil.encrypt(qcConfigProperties.getPassword(), CommonConstants.PASS_WORD));
			JsonData connectionjsonData = new JsonData();
			connectionjsonData.setType("QcgcConnectionDetails");
			connectionjsonData.setData(MapperUtil.getJsonString(qcConfigProperties));
			vendorConfig.setConnectionDetails(MapperUtil.getJsonString(connectionjsonData).replace("\\", "")
					.replace("\"{", "{").replace("\"}", "}"));
			vendorConfigRepository.save(vendorConfig);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException ex) {
			saveGiftCardAuditWhenException(giftCardAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwCommonServiceException(ex);
		}
		saveGiftCardAuditData(giftCardAudit, httpResponseUtil.getResponse(), null,
				httpResponseUtil.getHttpResponseCode());
	}

	private QcConnectionPropertiesDto getQcConnectionProperties(VendorConfigDaoExt vendorConfig) {

		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConnectionDetails()), JsonData.class);
		QcConnectionPropertiesDto qcConnectionProperties = MapperUtil.mapObjToClass(jsonData.getData(),
				QcConnectionPropertiesDto.class);
		qcConnectionProperties.setPassword(
				CryptoUtil.decrypt(qcConnectionProperties.getPassword(), CommonConstants.PASS_WORD, false));

		return qcConnectionProperties;
	}

	private GcResponseDto mapQcResponse(GiftCardAuditDao giftCardAudit, String response, String transactionId,
			Integer httpResponseCode, String cardNumber) {
		JsonObject jsonObject = new JsonParser().parse(response).getAsJsonObject();
		String responseCode = jsonObject.get(RESPONSE_CODE).toString().replace("\"", "");
		String responseMessage = jsonObject.get(RESPONSE_MESSAGE).toString().replace("\"", "");
		responseCode = checkError(giftCardAudit, responseCode, httpResponseCode, response);

		return GcResponseDto.builder().amount(jsonObject.get("Amount").toString().replace("\"", ""))
				.cardNumber(cardNumber).cardType(jsonObject.get("CardCreationType").toString().replace("\"", ""))
				.cardName(jsonObject.get("CardType").toString().replace("\"", ""))
				.cardExpiryDate(convertStringToDate(jsonObject.get("CardExpiry").toString().replace("\"", "")))
				.responseCode(responseCode).responseMessage(responseMessage)
				.approvalCode(jsonObject.get("ApprovalCode").toString().replace("\"", ""))
				.transactionId(transactionId.replace("\"", "")).build();
	}

	private GcActivateResponseDto mapQcActivateCardResponse(GiftCardAuditDao giftCardAudit, String response,
			String transactionId, Integer httpResponseCode) {
		JsonObject jsonObject = new JsonParser().parse(response).getAsJsonObject();
		String responseCode = jsonObject.get(RESPONSE_CODE).toString().replace("\"", "");
		String responseMessage = jsonObject.get(RESPONSE_MESSAGE).toString().replace("\"", "");
		responseCode = checkError(giftCardAudit, responseCode, httpResponseCode, response);

		return GcActivateResponseDto.builder().amount(jsonObject.get("Amount").toString().replace("\"", ""))
				.cardType(jsonObject.get("CardCreationType").toString().replace("\"", ""))
				.cardName(jsonObject.get("CardType").toString().replace("\"", ""))
				.cardExpiryDate(convertStringToDate(jsonObject.get("CardExpiry").toString().replace("\"", "")))
				.responseCode(responseCode).responseMessage(responseMessage)
				.cardNumber(jsonObject.get(CARD_NUMBER).toString().replace("\"", ""))
				.approvalCode(jsonObject.get("ApprovalCode").toString().replace("\"", ""))
				.invoiceNumber(jsonObject.get("InvoiceNumber").toString().replace("\"", ""))
				.batchNumber(jsonObject.get("ApiWebProperties").getAsJsonObject().get(CURRENT_BATCH_NUMBER).toString()
						.replace("\"", ""))
				.transactionId(transactionId).build();
	}

	private GcCustomerResponseDto mapCustomerResponseDto(GiftCardAuditDao giftCardAudit, String response,
			Integer httpStatusCode) {
		JsonObject jsonObject = new JsonParser().parse(response).getAsJsonObject();
		String responseCode = jsonObject.get(RESPONSE_CODE).toString().replace("\"", "");
		String responseMessage = jsonObject.get(RESPONSE_MESSAGE).toString().replace("\"", "");
		responseCode = checkError(giftCardAudit, responseCode, httpStatusCode, response);
		if (responseCode.equalsIgnoreCase("0")) {
			JsonArray cardsResponse = jsonObject.getAsJsonArray("CardsResponse").getAsJsonArray();
			JsonObject cardObject = cardsResponse.get(0).getAsJsonObject();

			return GcCustomerResponseDto.builder()
					.firstName(checkIfNull(jsonObject.get("FirstName").toString().replace("\"", "")))
					.phone(checkIfNull(jsonObject.get("Phone").toString().replace("\"", ""))).responseCode(responseCode)
					.responseMessage(responseMessage)
					.cardNumber(checkIfNull(cardObject.get(CARD_NUMBER).getAsString().replace("\"", "")))
					.cardExpiryDate(convertStringToDate(
							checkIfNull(cardObject.get("CardExpiryDate").getAsString().replace("\"", ""))))
					.cardBalance(checkIfNull(cardObject.get("OutstandingBalance").getAsString().replace("\"", "")))
					.cardProgramGroupName(
							checkIfNull(cardObject.get("CardProgramGroupName").getAsString().replace("\"", "")))
					.cardStatus(checkIfNull(cardObject.get("CardStatus").getAsString().replace("\"", ""))).build();
		} else {
			return GcCustomerResponseDto.builder().responseMessage(responseMessage).responseCode(responseCode).build();
		}
	}

	private String checkIfNull(String data) {
		return StringUtils.isEmpty(data) ? null : data;
	}

	private HttpPost getCommonPostHeaders(String url, QcConnectionPropertiesDto connectionProperties) {

		HttpPost postRequest = new HttpPost(url);
		postRequest.addHeader(MERCHANT_OUTLET_NAME, connectionProperties.getMerchantOutletName());
		postRequest.addHeader(ACQUIRER_ID, connectionProperties.getAcquirerId());
		postRequest.addHeader(ORGANIZTION_NAME, connectionProperties.getOrganizationName());
		postRequest.addHeader(POS_ENTRY_MODE, connectionProperties.getPosEntryMode().toString());
		postRequest.addHeader("POSTypeid", connectionProperties.getPosTypeId().toString());
		postRequest.addHeader(POS_NAME, connectionProperties.getPosName());
		postRequest.addHeader(TERM_APP_VERSION, connectionProperties.getTermAppVersion());
		postRequest.addHeader(CURRENT_BATCH_NUMBER, connectionProperties.getCurrentBatchNumber().toString());
		postRequest.addHeader(TERMINAL_ID, connectionProperties.getTerminalId());
		postRequest.addHeader("MID", connectionProperties.getMid());
		postRequest.addHeader(USER_NAME, connectionProperties.getUserName());
		postRequest.addHeader(PASS_WORD, connectionProperties.getPassword());
		postRequest.addHeader(FORWARDING_ENTITY_ID, connectionProperties.getForwardingEntityId());
		postRequest.addHeader(FORWARDING_ENTITY_PASS_WORD, connectionProperties.getForwardingEntityPassword());
		postRequest.addHeader(DATE_AT_CLIENT,
				CalendarUtils.formatDateToString(CalendarUtils.getCurrentDate(), DATE_TIME_FORMAT));
		postRequest.addHeader(IS_FORWADING_ENTITY_EXISTS,
				connectionProperties.getIsForwardingEntityExists().toString());
		postRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);

		return postRequest;
	}

	private HttpGet getCommonGetHeaders(String url, QcConnectionPropertiesDto connectionProperties) {

		HttpGet getRequest = new HttpGet(url);
		getRequest.addHeader(MERCHANT_OUTLET_NAME, connectionProperties.getMerchantOutletName());
		getRequest.addHeader(ACQUIRER_ID, connectionProperties.getAcquirerId());
		getRequest.addHeader(ORGANIZTION_NAME, connectionProperties.getOrganizationName());
		getRequest.addHeader(POS_ENTRY_MODE, connectionProperties.getPosEntryMode().toString());
		getRequest.addHeader("POSTypeid", connectionProperties.getPosTypeId().toString());
		getRequest.addHeader(POS_NAME, connectionProperties.getPosName());
		getRequest.addHeader(TERM_APP_VERSION, connectionProperties.getTermAppVersion());
		getRequest.addHeader(CURRENT_BATCH_NUMBER, connectionProperties.getCurrentBatchNumber().toString());
		getRequest.addHeader(TERMINAL_ID, connectionProperties.getTerminalId());
		getRequest.addHeader("MID", connectionProperties.getMid());
		getRequest.addHeader(USER_NAME, connectionProperties.getUserName());
		getRequest.addHeader(PASS_WORD, connectionProperties.getPassword());
		getRequest.addHeader(FORWARDING_ENTITY_ID, connectionProperties.getForwardingEntityId());
		getRequest.addHeader(FORWARDING_ENTITY_PASS_WORD, connectionProperties.getForwardingEntityPassword());
		getRequest.addHeader(DATE_AT_CLIENT,
				CalendarUtils.formatDateToString(CalendarUtils.getCurrentDate(), DATE_TIME_FORMAT));
		getRequest.addHeader(IS_FORWADING_ENTITY_EXISTS, connectionProperties.getIsForwardingEntityExists().toString());
		getRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);

		return getRequest;
	}

	/**
	 * Gets the initial gift card audit data.
	 *
	 * @param url             the url
	 * @param transactionType the transaction type
	 * @param locationCode    the location code
	 * @param cardNumber      the card number
	 * @param invoiceNumber   the invoice number
	 * @param vendor          the vendor
	 * @return the initial gift card audit data
	 */
	private GiftCardAuditDao getInitialGiftCardAuditData(String url, String transactionType, String locationCode,
			String cardNumber, String invoiceNumber, VendorDao vendor) {
		GiftCardAuditDao giftCardAudit = new GiftCardAuditDao();
		Integer maxId = giftCardAuditRepository.getMaxSeqNo(locationCode);
		giftCardAudit.setSequenceNo(++maxId);
		giftCardAudit.setRequestTime(CalendarUtils.getCurrentDate());
		giftCardAudit.setUrl(url);
		giftCardAudit.setVendor(vendor);
		giftCardAudit.setTransactionType(transactionType);
		giftCardAudit.setLocationCode(locationCode);
		giftCardAudit.setCardNumber(cardNumber);
		giftCardAudit.setInvoiceNumber(invoiceNumber);
		return giftCardAuditRepository.save(giftCardAudit);
	}

	/**
	 * Save gift card audit data.
	 *
	 * @param giftCardAudit    the gift card audit
	 * @param response         the response
	 * @param referenceNumber  the reference number
	 * @param httpResponseCode the http response code
	 */
	private void saveGiftCardAuditData(GiftCardAuditDao giftCardAudit, String response, String referenceNumber,
			Integer httpResponseCode) {
		giftCardAudit.setResponse(response);
		giftCardAudit.setResponseTime(CalendarUtils.getCurrentDate());
		giftCardAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - giftCardAudit.getRequestTime().getTime());
		giftCardAudit.setHttpStatus(httpResponseCode);
		giftCardAudit.setTransactionStatus(true);
		giftCardAudit.setReferenceNumber(referenceNumber);
		giftCardAuditRepository.save(giftCardAudit);
	}

	/**
	 * Save gift card audit when exception.
	 *
	 * @param giftCardAudit    the gift card audit
	 * @param httpResponseCode the http response code
	 * @param e                the e
	 */
	private void saveGiftCardAuditWhenException(GiftCardAuditDao giftCardAudit, Integer httpResponseCode, Exception e) {

		giftCardAudit.setHttpStatus(httpResponseCode);
		giftCardAudit.setTransactionStatus(false);
		giftCardAudit.setResponseTime(CalendarUtils.getCurrentDate());
		giftCardAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - giftCardAudit.getRequestTime().getTime());
		giftCardAudit.setResponse(e.getMessage());
		giftCardAuditRepository.save(giftCardAudit);
	}

	private String checkError(GiftCardAuditDao giftCardAudit, String responseCode, Integer httpResponseCode,
			String response) {
		if (!responseCode.equalsIgnoreCase("0")) {

			giftCardAudit.setHttpStatus(httpResponseCode);
			giftCardAudit.setResponseTime(CalendarUtils.getCurrentDate());
			giftCardAudit
					.setTotalTime(CalendarUtils.getCurrentDate().getTime() - giftCardAudit.getRequestTime().getTime());
			giftCardAudit.setResponse(response);

			giftCardAudit.setTransactionStatus(false);
			giftCardAuditRepository.save(giftCardAudit);
			return mapErrorCode(responseCode);
		} else {
			return responseCode;
		}
	}

	/**
	 * @param responseCode
	 * @return
	 */
	private String mapErrorCode(String responseCode) {
		List<String> configErrorList = Arrays.asList("10019", "10064", "10096", "10123", "10124", "10128",
				"10150", "10173", "10174", "10176", "10177", "10178", "10179", "10180", "10181", "10182", "10183",
				"10184", "10185", "10186", "10189", "10190", "10196", "10197", "10207", "10208", "10227", "10228",
				"10230", "10231", "10232", "10271", "10312", "10313");

		if (configErrorList.contains(responseCode)) {
			return "ERR-INT-034";
		} else
			return "ERR-INT-" + responseCode;
	}

	private String buildNotes(String valType, String amount, String billAmount, String invNumber) {
		StringBuilder notesSb = new StringBuilder();
		notesSb.append("{" + valType);
		if (!StringUtils.isEmpty(amount)) {
			notesSb.append("|Amount~" + amount);
		}
		if (!StringUtils.isEmpty(billAmount)) {
			notesSb.append("|BillAmount~" + billAmount);
		}
		if (!StringUtils.isEmpty(invNumber)) {
			notesSb.append("|InvNumber~" + invNumber);
		}
		notesSb.append("}");
		return notesSb.toString();
	}

	private void throwCommonServiceException(Exception ex) {
		throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, ex, Map.of("vendorName", "Gift card"));
	}

	private void throwConnectionTimedoutException(Exception ex) {
		throw new ServiceException("Connection timed out", "ERR-INT-038", ex);
	}

	/**
	 * Extract card number from 26 digit track data.
	 *
	 * @param trackData the track data
	 * @return the string
	 */
	private String extractCardNumberFromTrackData(String trackData) {
		if (StringUtils.isEmpty(trackData)) {
			throw new ServiceException("Both track data and gift card number not present", "");
		}
		if (trackData.length() > 24) {
			List<Integer> trackDataLogic = Arrays.asList(2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24);
			StringBuilder cardNumberBuilder = new StringBuilder();
			for (int i = 0; i < trackDataLogic.size(); i++) {
				cardNumberBuilder.append(trackData.charAt(trackDataLogic.get(i) - 1));
			}
			return cardNumberBuilder.toString();
		} else {
			throw new ServiceException("Exception while extracting card number from track data", "ERR-INT-016");
		}
	}

	private Date convertStringToDate(String dateString) {
		return CalendarUtils.convertStringToDate(dateString, DATE_TIME_FORMAT);
	}

	/**
	 * @param vendor
	 * @return
	 */
	private String appendEmployeeCodePrefix(VendorDao vendor, String cardNumber) {
		JsonObject jsonObject = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject();
		return jsonObject.getAsJsonObject("data").get("EmployeeCodePrefix").getAsString() + cardNumber;
	}
}
