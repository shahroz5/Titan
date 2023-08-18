/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl.email;

import static com.titan.poss.integration.util.URLUtil.getPortNumberInInt;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.MissingFieldCheckDto;
import com.titan.poss.integration.dto.request.EmailDto;
import com.titan.poss.integration.dto.request.EmailIndividualDto;
import com.titan.poss.integration.intg.dao.EmailIntgAudit;
import com.titan.poss.integration.intg.repository.EmailIntgAuditRepository;
import com.titan.poss.integration.service.GmailEmailService;
import com.titan.poss.integration.service.impl.JavaMailSend;
import com.titan.poss.integration.util.VendorUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("GmailEmailService")
public class GmailEmailServiceImpl implements GmailEmailService {

	private static final String USER_NAME = "userName";
	private static final String PASS_WORD = "password";

	@Autowired
	private JavaMailSend javaMailSend;

	@Autowired
	EmailIntgAuditRepository emailIntgAuditRepo;

	@Override
	@Async
	public void sendEmailNotification(VendorDao vendor, EmailDto emailDto, List<EmailIntgAudit> emailIntgAudits) {

		JavaMailSenderImpl emailSender = getJavaMailObject(vendor);

		List<EmailIndividualDto> emailIndvDtos = emailDto.getEmailIndvs();
		if (!CollectionUtils.isEmpty(emailIndvDtos)) {
			for (int i = 0; i < emailIndvDtos.size(); i++) {
				EmailIndividualDto eid = emailIndvDtos.get(i);
				EmailIntgAudit eia = sendIndividualEMail(emailDto, eid, emailSender, vendor.getRetryCount(),
						emailIntgAudits.get(i));
				emailIntgAudits.set(i, eia);
			}
			emailIntgAuditRepo.saveAll(emailIntgAudits);
		}

	}

	private EmailIntgAudit sendIndividualEMail(EmailDto emailDto, EmailIndividualDto eid,
			JavaMailSenderImpl emailSender, Integer retryCount, EmailIntgAudit emailIntgAudit) {

		return javaMailSend.sendEmailNotification(emailDto, eid, emailSender, retryCount, emailIntgAudit);
	}

	@SuppressWarnings("unchecked")
	private JavaMailSenderImpl getJavaMailObject(VendorDao vendor) {

		JavaMailSenderImpl jmailSender = new JavaMailSenderImpl();
		jmailSender.setHost(vendor.getBaseurl());
		jmailSender.setPort(getPortNumberInInt(vendor.getPort()));
		JsonObject jsonObject = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject()
				.getAsJsonObject("data");
		String userName = jsonObject.get(USER_NAME).getAsString();
		String encryptedPassword = jsonObject.get(PASS_WORD).getAsString();
		String decryptedPassword = CryptoUtil.decrypt(encryptedPassword, PASS_WORD);
		jmailSender.setUsername(userName);
		jmailSender.setPassword(decryptedPassword);

		jmailSender.setProtocol(vendor.getWebServiceType());

		String timeOut = String.valueOf(vendor.getTimeOutSeconds() * 1000);
		Properties props = new Properties();
		props.put("mail.smtp.timeout", timeOut);
		props.put("mail.smtp.connectiontimeout", timeOut);
		props.put("mail.smtp.writetimeout", timeOut);

		JsonElement element = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject().get("data")
				.getAsJsonObject().get("properties");
		if (element != null) {
			JsonObject object = element.getAsJsonObject();

			HashMap<String, Object> propertiesMap = new Gson().fromJson(object.toString(), HashMap.class);
			if (!propertiesMap.isEmpty()) {
				propertiesMap.forEach(props::put);
			}
		}
		jmailSender.setJavaMailProperties(props);

		return jmailSender;
	}

	@Override
	public Set<String> checkIfRequiredFieldsAreThere(VendorDao vendor) {

		List<MissingFieldCheckDto> fieldsCheck = new ArrayList<>();

		fieldsCheck.addAll(VendorUtil.checkCommonMissingFieldInHeader(vendor, fieldsCheck));

		JsonElement jsonElement = new JsonParser().parse(vendor.getVendorDetails());
		JsonObject jsonObjectData = null;
		if (jsonElement != null)
			jsonObjectData = jsonElement.getAsJsonObject().getAsJsonObject("data");

		if (jsonObjectData != null) {
			fieldsCheck.addAll(VendorUtil.checkCommonMissingJsonFieldInHeader(fieldsCheck, jsonObjectData));

		} else {
			fieldsCheck.add(new MissingFieldCheckDto(null, "vendor details"));
		}
		return VendorUtil.listMissingFields(fieldsCheck);

	}

}
