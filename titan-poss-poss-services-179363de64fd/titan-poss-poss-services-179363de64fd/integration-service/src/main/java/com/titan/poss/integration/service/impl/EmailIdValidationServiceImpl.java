/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.util.Map;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.dto.EmailIdValidationResponseDto;
import com.titan.poss.core.enums.EmailIdVerificationEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.EmailIdVendorDetailsDto;
import com.titan.poss.integration.dto.request.EmailIdValidationRequestDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.EmailIdValidationDao;
import com.titan.poss.integration.intg.repository.EmailIdValidationRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.EmailIdValidationService;
import com.titan.poss.integration.util.HttpClientUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Primary
@Service("IntegrationEmailIdValidation")
public class EmailIdValidationServiceImpl implements EmailIdValidationService {
	
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String EMAILID_VERIFICATION = "EMAILID VERIFICATION";
	private static final String VENDOR_NAME = "vendorName";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";

	@Autowired
	private VendorRepository vendorRepository;
	
	@Autowired
	private EmailIdValidationRepository emailIdValidationRepository;

	@Override
	public EmailIdValidationResponseDto verifyEmailId(String vendorCode, String verificationType, String emailId) {
		EmailIdValidationRequestDto emailIdValidationRequestDto = new EmailIdValidationRequestDto();
		EmailIdValidationResponseDto emailIdValidationResponseDto = new EmailIdValidationResponseDto();
		emailIdValidationRequestDto.setVendorCode(vendorCode);
		emailIdValidationRequestDto.setEmailId(emailId);
		emailIdValidationRequestDto.setVerificationType(verificationType);
		String request = MapperUtil.getJsonString(emailIdValidationRequestDto);
		VendorDao vendor = validateVendor(vendorCode);
		String verifyEmailIdUrl = vendor.getBaseurl();
		EmailIdValidationDao emailIdValidationDao = getEmailIdDetails(vendor, verifyEmailIdUrl, emailId);
		
		EmailIdVendorDetailsDto emailIdVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(),
						 JsonData.class).getData(), EmailIdVendorDetailsDto.class));
		JSONObject jsonRequest = new JSONObject();
		try {
			jsonRequest = getEmailIdRequestData(emailIdVendorDetailsDto, emailIdValidationRequestDto, verificationType);
		} catch (Exception e) {
			setFinalEmailIdDetails(emailIdValidationDao, request, e.getMessage(), Boolean.FALSE, null);
			throw new ServiceException("Unable to parse Json Data", "ERR-CORE-003", e.getMessage());
		}
		HttpPost sendPostRequest = new HttpPost(emailIdValidationDao.getUrl());
		log.info("Url {}", emailIdValidationDao.getUrl());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			sendPostRequest.setEntity(new StringEntity(jsonRequest.toString()));
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalEmailIdDetails(emailIdValidationDao, request, e.getMessage(), Boolean.FALSE, httpResponseUtil.getHttpResponseCode());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, EMAILID_VERIFICATION));
		}
		JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse()).getAsJsonObject();
		log.info("JsonObject {}", jsonObject.toString());
//		JsonObject jsonValues = jsonObject.get("status").getAsJsonObject();
		
		if (httpResponseUtil.getHttpResponseCode()!=200) {
//			emailIdValidationResponseDto.setValidationStatus(Boolean.FALSE);
			setFinalEmailIdDetails(emailIdValidationDao, request, MapperUtil.getJsonString(httpResponseUtil.getResponseObj()),
					Boolean.FALSE, httpResponseUtil.getHttpResponseCode());
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, Map.of(VENDOR_NAME, EMAILID_VERIFICATION));
		} else {
			emailIdValidationResponseDto.setEmailId(jsonObject.get("emailId").getAsString());
			emailIdValidationResponseDto.setValidationStatus(jsonObject.get("validationstatus").getAsBoolean());
			emailIdValidationResponseDto.setInvalidationReason(jsonObject.get("invalidationreason")!=null?jsonObject.get("invalidationreason").getAsString():null);
			setFinalEmailIdDetails(emailIdValidationDao, request, MapperUtil.getJsonString(emailIdValidationResponseDto),
					Boolean.TRUE, httpResponseUtil.getHttpResponseCode());
		}
		return emailIdValidationResponseDto;
	}

	private JSONObject getEmailIdRequestData(EmailIdVendorDetailsDto emailIdVendorDetailsDto,
			EmailIdValidationRequestDto emailIdValidationRequestDto, String verificationType) {
		Integer sequenceNumber = emailIdValidationRepository.getMaxSeqNo(CommonUtil.getLocationCode());
		JSONObject json = new JSONObject();
		JSONObject header = new JSONObject();
		JSONObject request = new JSONObject();
		JSONObject emailIdDetails = new JSONObject();
		setConstantValuesInHeader(emailIdVendorDetailsDto, sequenceNumber, header);
		if (verificationType.equalsIgnoreCase(EmailIdVerificationEnum.EMAIL.name())) {
			header.put("function_sub_code", "EMAIL");
			emailIdDetails.put("email_id", emailIdValidationRequestDto.getEmailId());
		}
		json.put("headers", header);
		setValuesInRequest(request, emailIdDetails);
		json.put("request", request);
		return json;
	}

	private void setValuesInRequest(JSONObject request, JSONObject emailIdDetails) {
		request.put("email_id", emailIdDetails);
		request.put("consent", "YES");
		request.put("consent_message ", "ABS");
	}

	private void setConstantValuesInHeader(EmailIdVendorDetailsDto emailIdVendorDetailsDto, Integer sequenceNumber,
			JSONObject header) {
		header.put("client_code", emailIdVendorDetailsDto.getClientCode());
		header.put("sub_client_code", emailIdVendorDetailsDto.getSubClientCode());
		header.put("channel_code", emailIdVendorDetailsDto.getChannelCode());
		header.put("channel_version", emailIdVendorDetailsDto.getChannelVersion());
		header.put("stan", CommonUtil.getLocationCode() + sequenceNumber.toString());
		header.put("client_ip", emailIdVendorDetailsDto.getClientIp());
		header.put("transmission_datetime", Long.toString(CalendarUtils.getCurrentDate().getTime()));
		header.put("operation_mode", emailIdVendorDetailsDto.getOperationMode());
		header.put("run_mode", emailIdVendorDetailsDto.getRunMode());
		header.put("actor_type", emailIdVendorDetailsDto.getActorType());
		header.put("user_handle_type", emailIdVendorDetailsDto.getUserHandleType());
		header.put("user_handle_value", emailIdVendorDetailsDto.getUserHandleValue());
		header.put("location", emailIdVendorDetailsDto.getLocation());
		header.put("function_code", emailIdVendorDetailsDto.getFunctionCode());
	}

	private void setFinalEmailIdDetails(EmailIdValidationDao emailIdValidationDao, String request, String response,
			Boolean transactionStatus, Integer httpStatusCode) {
		emailIdValidationDao.setRequest(request);
		emailIdValidationDao.setTransactionStatus(transactionStatus);
		emailIdValidationDao.setHttpStatus(httpStatusCode);
		emailIdValidationDao.setResponse(response);
		emailIdValidationDao.setResponseTime(CalendarUtils.getCurrentDate());
		Long tempTime = CalendarUtils.getCurrentDate().getTime() - emailIdValidationDao.getRequestTime().getTime();
		emailIdValidationDao.setTotalTime(tempTime.intValue());
		emailIdValidationRepository.save(emailIdValidationDao);

	}

	private EmailIdValidationDao getEmailIdDetails(VendorDao vendor, String verifyEmailIdUrl, String emailId) {
		EmailIdValidationDao emailIdValidationDao = new EmailIdValidationDao();
		Integer maxId = emailIdValidationRepository.getMaxSeqNo(CommonUtil.getLocationCode());
		emailIdValidationDao.setSequenceNo(++maxId);
		emailIdValidationDao.setLocationCode(CommonUtil.getLocationCode());
		
		StringBuilder url = new StringBuilder();
		url.append(verifyEmailIdUrl);
		
		if (!StringUtil.isBlankJsonStr(vendor.getVendorDetails())) {
			JsonData vendorJsonData = MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class);
			String vendorRelativeUrl = JsonUtils.getValueFromJsonString(vendorJsonData.getData(), "relativeUrl");

			if (vendorRelativeUrl != null)
				url.append("/").append(vendorRelativeUrl);
		}
		url.append("/").append(emailId);

		emailIdValidationDao.setUrl(UriComponentsBuilder.fromUriString(url.toString()).build().toUriString());
		emailIdValidationDao.setVendor(vendor);
		emailIdValidationDao.setRequestTime(CalendarUtils.getCurrentDate());
		return emailIdValidationDao;

	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		if ((vendor == null) || (!vendor.getIsActive())) {
			throw new ServiceException("Vender Not Present", "ERR-INT-015");
		}
		return vendor;
	}

}
