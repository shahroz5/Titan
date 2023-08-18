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
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.dto.PanDocDetailsResponseDto;
import com.titan.poss.core.enums.PanDocVerificationEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.PanDocVendorDetailsDto;
import com.titan.poss.integration.dto.request.PanDocRequestDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.PanDocAuditDao;
import com.titan.poss.integration.intg.repository.PanDocAuditRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.PanDocService;
import com.titan.poss.integration.util.HttpClientUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Primary
@Service("IntegrationPanDocService")
public class PanDocServiceImpl implements PanDocService {
	
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String PAN_VERIFICATION = "PAN VERIFICATION";
	private static final String VENDOR_NAME = "vendorName";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private PanDocAuditRepository panDocAuditRepository;
  
	@Override
	public PanDocDetailsResponseDto verifyPanDetails(String vendorCode, String verificationType, String panCardNo) {
		PanDocRequestDto panDocRequestDto = new PanDocRequestDto();
		PanDocDetailsResponseDto panDocDetailsResponseDto = new PanDocDetailsResponseDto();
		panDocRequestDto.setVendorCode(vendorCode);
		panDocRequestDto.setPanNumber(panCardNo);
		panDocRequestDto.setVerificationType(verificationType);
		String request = MapperUtil.getJsonString(panDocRequestDto);
		VendorDao vendor = validateVendor(vendorCode);
		String verifyPanBaseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		PanDocAuditDao panAudit = getInitialPanDetails(vendor, verifyPanBaseUrl);

		PanDocVendorDetailsDto panDocVendorDetailsDto = (MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
				PanDocVendorDetailsDto.class));
		JSONObject jsonRequest = new JSONObject();
		try {
			jsonRequest = getPanRequestData(panDocVendorDetailsDto, panDocRequestDto, verificationType);
		} catch (Exception e) {
			setFinalPanAuditDetails(panAudit, request, e.getMessage(), Boolean.FALSE);
			throw new ServiceException("Unable to parse Json Data", "ERR-CORE-003", e.getMessage());
		}
		HttpPost sendPostRequest = new HttpPost(verifyPanBaseUrl);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			sendPostRequest.setEntity(new StringEntity(jsonRequest.toString()));
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			setFinalPanAuditDetails(panAudit, request, e.getMessage(), Boolean.FALSE);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, PAN_VERIFICATION));
		}
		JsonObject jsonObject = new JsonParser().parse(httpResponseUtil.getResponse()).getAsJsonObject();
		log.info("NSDL RESPONSE: {}", jsonObject);
		JsonObject jsonValues = jsonObject.get("response_status").getAsJsonObject();
		panDocDetailsResponseDto.setMessage(jsonValues.get("message").getAsString());
		if (jsonObject.get("verification_code") == null
				|| !jsonObject.get("verification_code").getAsString().equalsIgnoreCase("000")) {
			panDocDetailsResponseDto.setVerificationStatus(Boolean.FALSE);
			setFinalPanAuditDetails(panAudit, request, MapperUtil.getJsonString(panDocDetailsResponseDto),
					Boolean.FALSE);
		} else {
			panDocDetailsResponseDto.setVerificationStatus(Boolean.TRUE);
			JsonObject json = new JsonParser().parse(jsonObject.get("verified_data").getAsString()).getAsJsonObject();
			panDocDetailsResponseDto.setOwnerName(json.get("name").getAsString());
			setFinalPanAuditDetails(panAudit, request, MapperUtil.getJsonString(panDocDetailsResponseDto),
					Boolean.TRUE);
		}
		return panDocDetailsResponseDto;
	}

	private JSONObject getPanRequestData(PanDocVendorDetailsDto panDocVendorDetailsDto,
			PanDocRequestDto panDocRequestDto, String verificationType) {
		Integer sequenceNumber = panDocAuditRepository.getMaxSeqNo(CommonUtil.getLocationCode());
		JSONObject json = new JSONObject();
		JSONObject header = new JSONObject();
		JSONObject request = new JSONObject();
		JSONObject panDetails = new JSONObject();
		setConstantValuesInHeader(panDocVendorDetailsDto, sequenceNumber, header);
		if (verificationType.equalsIgnoreCase(PanDocVerificationEnum.NUMBER.name())) {
			header.put("function_sub_code", "NUMBER");
			panDetails.put("pan_number", panDocRequestDto.getPanNumber());
		}
		json.put("headers", header);
		setValuesInRequest(request, panDetails);
		json.put("request", request);
		return json;
	}

	private void setValuesInRequest(JSONObject request, JSONObject panDetails) {
		request.put("pan_details", panDetails);
		request.put("consent", "YES");
		request.put("consent_message ", "ABS");
	}

	private void setConstantValuesInHeader(PanDocVendorDetailsDto panDocVendorDetailsDto, Integer sequenceNumber,
			JSONObject header) {
		header.put("client_code", panDocVendorDetailsDto.getClientCode());
		header.put("sub_client_code", panDocVendorDetailsDto.getSubClientCode());
		header.put("channel_code", panDocVendorDetailsDto.getChannelCode());
		header.put("channel_version", panDocVendorDetailsDto.getChannelVersion());
		header.put("stan", CommonUtil.getLocationCode() + sequenceNumber.toString());
		header.put("client_ip", panDocVendorDetailsDto.getClientIp());
		header.put("transmission_datetime", Long.toString(CalendarUtils.getCurrentDate().getTime()));
		header.put("operation_mode", panDocVendorDetailsDto.getOperationMode());
		header.put("run_mode", panDocVendorDetailsDto.getRunMode());
		header.put("actor_type", panDocVendorDetailsDto.getActorType());
		header.put("user_handle_type", panDocVendorDetailsDto.getUserHandleType());
		header.put("user_handle_value", panDocVendorDetailsDto.getUserHandleValue());
		header.put("location", panDocVendorDetailsDto.getLocation());
		header.put("function_code", panDocVendorDetailsDto.getFunctionCode());
	}

	private void setFinalPanAuditDetails(PanDocAuditDao panAudit, String request, String response,
			Boolean transactionStatus) {
		panAudit.setRequest(request);
		panAudit.setTransactionStatus(transactionStatus);
		panAudit.setHttpStatus(200);
		panAudit.setResponse(response);
		panAudit.setResponseTime(CalendarUtils.getCurrentDate());
		Long tempTime = CalendarUtils.getCurrentDate().getTime() - panAudit.getRequestTime().getTime();
		panAudit.setTotalTime(tempTime.intValue());
		panDocAuditRepository.save(panAudit);

	}

	private PanDocAuditDao getInitialPanDetails(VendorDao vendor, String verifyPanBaseUrl) {
		PanDocAuditDao panAudit = new PanDocAuditDao();
		Integer maxId = panDocAuditRepository.getMaxSeqNo(CommonUtil.getLocationCode());
		panAudit.setSequenceNo(++maxId);
		panAudit.setLocationCode(CommonUtil.getLocationCode());
		panAudit.setUrl(verifyPanBaseUrl);
		panAudit.setVendor(vendor);
		panAudit.setRequestTime(CalendarUtils.getCurrentDate());
		return panAudit;

	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		if ((vendor == null) || (!vendor.getIsActive())) {
			throw new ServiceException("Vender Not Present", "ERR-INT-015");
		}
		return vendor;
	}

}
