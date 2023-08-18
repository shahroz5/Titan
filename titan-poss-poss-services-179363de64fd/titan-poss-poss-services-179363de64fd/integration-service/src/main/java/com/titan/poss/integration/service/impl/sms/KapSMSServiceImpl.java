
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl.sms;



import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.integration.constants.HardCodedConstants;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.MissingFieldCheckDto;
import com.titan.poss.integration.dto.request.SMSDto;
import com.titan.poss.integration.dto.request.SMSIndividualDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.SMSIntgAudit;
import com.titan.poss.integration.intg.repository.SMSIntgAuditRepository;
import com.titan.poss.integration.service.KapSMSService;
import com.titan.poss.integration.service.VendorService;
import com.titan.poss.integration.util.HttpClientUtil;
import com.titan.poss.integration.util.VendorUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("KapSMSService")
@Slf4j
public class KapSMSServiceImpl implements KapSMSService {

	@Autowired
	VendorService vendorService;

	@Autowired
	SMSIntgAuditRepository smsIntgAuditRepo;

	private static final String SENDER_ID = "senderid";
	private static final String USER_NAME = "userName";
	private static final String PASS_WORD = "password";

	private static final Logger LOGGER = LoggerFactory.getLogger(KapSMSService.class);

	private static final String SUCCESS_RESPONSE_BODY = StringUtils.EMPTY;

	@Override
	@Async
	public void sendSmsNotification(VendorDao vendor, SMSDto smsDto, List<SMSIntgAudit> smsIntgAudits) {

		List<SMSIndividualDto> smsIndvDtos = smsDto.getSmsIndvs();
		if (!CollectionUtils.isEmpty(smsIndvDtos)) {
			for (int i = 0; i < smsIndvDtos.size(); i++) {
				SMSIndividualDto sid = smsIndvDtos.get(i);
				SMSIntgAudit sia = sendIndividualSms(vendor, smsDto.getMobileNo(), sid.getContent(),
						smsIntgAudits.get(i));
				smsIntgAudits.set(i, sia);

			}

			smsIntgAuditRepo.saveAll(smsIntgAudits);
		}
	}

	private SMSIntgAudit sendIndividualSms(VendorDao vendor, String mobileNo, String content,
			SMSIntgAudit smsIntgAudit) {

		Boolean isSuccess = null;

		String newUrl = generateURL(vendor, mobileNo, content);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		String stacktrace = StringUtils.EMPTY;
		try {
			httpResponseUtil = HttpClientUtil.getRequest(newUrl, null, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (IOException ex) {
			LOGGER.error("Exception\n +" + ex, ex);
			isSuccess = false;
			stacktrace = ExceptionUtils.getStackTrace(ex);
		}
		if (isSuccess != null) {
			int length = stacktrace.length();
			if (length > HardCodedConstants.RESPONSE_LENGTH)
				stacktrace = stacktrace.substring(0, HardCodedConstants.RESPONSE_LENGTH);
			smsIntgAudit.setResponse(stacktrace);
		} else {
			isSuccess = true;
			String responseBody = httpResponseUtil.getResponse();
			String responseBodyTrimmed = null;
			if (StringUtils.isNotBlank(responseBody)) {
				responseBodyTrimmed = StringUtil.removeSpace(responseBody);
				int length = stacktrace.length();
				if (length > HardCodedConstants.RESPONSE_LENGTH)
					responseBody = responseBody.substring(0, HardCodedConstants.RESPONSE_LENGTH);
			}
			int httpStatus = httpResponseUtil.getHttpResponseCode();
			Boolean isSmsContentWiseSuccess = responseBody == null
					|| StringUtil.equalWithNullCheck(responseBodyTrimmed, SUCCESS_RESPONSE_BODY);
			Boolean isHttpStatusWiseSuccess = HttpStatus.valueOf(httpStatus).is2xxSuccessful();
			if (!isHttpStatusWiseSuccess || !isSmsContentWiseSuccess) {
				isSuccess = false;
				smsIntgAudit.setResponse(responseBody);
			}
			smsIntgAudit.setHttpStatus((short) httpStatus);
		}
		smsIntgAudit.setStatus(isSuccess);
		smsIntgAudit.setResponseTime(httpResponseUtil.getResponseTime());

		return smsIntgAudit;
	}

	private String generateURL(VendorDao vendor, String mobileNo, String content) {
		String newUrlWoParam = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();

		JsonObject jsonObject = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject()
				.getAsJsonObject("data");
		String userName = jsonObject.get(USER_NAME).getAsString();
		String encryptedPassword = jsonObject.get(PASS_WORD).getAsString();
		String decryptedPassword = CryptoUtil.decrypt(encryptedPassword, PASS_WORD);
		String senderId = jsonObject.get(SENDER_ID).getAsString();
		
		log.info("decrypted Password is " +decryptedPassword);
		

		content = URLEncoder.encode(content, StandardCharsets.UTF_8).replace("\\+", "%20");
		return UriComponentsBuilder.fromUriString(newUrlWoParam).queryParam("username", userName)
				.queryParam("pass", decryptedPassword).queryParam(SENDER_ID, senderId)
				.queryParam("dest_mobileno", mobileNo).queryParam("message", content)
				.queryParam("response", "Y")
				.build().toUriString();
	}

	@Override
	public Set<String> checkIfRequiredFieldsAreThere(VendorDao vendor) {

		List<MissingFieldCheckDto> fieldsCheck = new ArrayList<>();

		fieldsCheck.addAll(VendorUtil.checkCommonMissingFieldInHeader(vendor, fieldsCheck));

		// check variable inside JSON
		JsonElement jsonElement = new JsonParser().parse(vendor.getVendorDetails());
		JsonObject jsonObject = null;
		if (jsonElement != null)
			jsonObject = jsonElement.getAsJsonObject().getAsJsonObject("data");

		if (jsonObject != null) {

			fieldsCheck.addAll(VendorUtil.checkCommonMissingJsonFieldInHeader(fieldsCheck, jsonObject));

			String senderId = JsonUtils.getValueFromJsonWithNullCheck(jsonObject, SENDER_ID);
			fieldsCheck.add(new MissingFieldCheckDto(senderId, SENDER_ID));

		} else {
			fieldsCheck.add(new MissingFieldCheckDto(null, "vendor details"));
		}

		return VendorUtil.listMissingFields(fieldsCheck);
	}

}
