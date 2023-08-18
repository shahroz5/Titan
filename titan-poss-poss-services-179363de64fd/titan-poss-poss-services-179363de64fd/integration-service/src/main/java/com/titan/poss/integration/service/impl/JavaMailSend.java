/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import static com.titan.poss.core.utils.CollectionUtil.getArrayFromCollection;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.titan.poss.integration.constants.HardCodedConstants;
import com.titan.poss.integration.dto.request.EmailDto;
import com.titan.poss.integration.dto.request.EmailIndividualDto;
import com.titan.poss.integration.dto.request.RecipientDto;
import com.titan.poss.integration.intg.dao.EmailIntgAudit;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class JavaMailSend {

	private static final Logger LOGGER = LoggerFactory.getLogger(JavaMailSend.class);

	public EmailIntgAudit sendEmailNotification(EmailDto emailDto, EmailIndividualDto eid,
			JavaMailSenderImpl emailSender, Integer retryCount, EmailIntgAudit emailIntgAudit) {

		int responseLengthPerEachRound = HardCodedConstants.RESPONSE_LENGTH / retryCount;

		long startTimeInMillis = System.currentTimeMillis();
		Set<String> responses = new HashSet<>();
		boolean status = false;
		for (Integer i = 0; i < retryCount; i++) {
			String response = null;
			response = sendMail(emailDto, eid, emailSender);
			if (response != null) {
				int length = response.length();
				if (length > responseLengthPerEachRound) {
					LOGGER.info("Email Response StackTrace : "+response);
					response = response.substring(0, responseLengthPerEachRound);
				}
				responses.add(response);
			} else {
				status = true;
				break;
			}
		}
		if (!status) {
			emailIntgAudit.setResponse(new Gson().toJson(responses));
		}
		emailIntgAudit.setResponseTime(System.currentTimeMillis() - startTimeInMillis);
		emailIntgAudit.setStatus(status);
		return emailIntgAudit;
	}

	private String sendMail(EmailDto emailDto, EmailIndividualDto eid, JavaMailSenderImpl emailSender) {
		String response = null;
		try {
			MimeMessage message = emailSender.createMimeMessage();
			MimeMessageHelper helper = null;

			helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
					StandardCharsets.UTF_8.name());

			RecipientDto recipient = emailDto.getRecipient();
			helper.setTo(getArrayFromCollection(recipient.getTo()));
			helper.setCc(getArrayFromCollection(recipient.getCc()));
			helper.setBcc(getArrayFromCollection(recipient.getBcc()));

			helper.setSubject(emailDto.getSubject());
			helper.setFrom(new InternetAddress(emailSender.getUsername(), "Titan Admin"));
			Map<String, File> fileAttachments = eid.getFileAttachments();
			if (fileAttachments != null) {
				for (Map.Entry<String, File> documentAttachment : fileAttachments.entrySet()) {
					if (documentAttachment.getValue() != null && documentAttachment.getValue().exists())
						helper.addAttachment(documentAttachment.getValue().getName(),
								documentAttachment.getValue());
				}
			}
			
			Map<String, byte[]> attachments = eid.getAttachments();
			if (attachments != null) {
				for (Map.Entry<String, byte[]> attachment : attachments.entrySet()) {
					if (attachment.getValue() != null && attachment.getValue().length > 0)
						helper.addAttachment(attachment.getKey(), new ByteArrayResource(attachment.getValue()));
				}
			}

			helper.setText(eid.getHtml(), true);

			emailSender.send(message);
		} catch (Exception ex) {
			LOGGER.error("Exception\n", ex);
			return ExceptionUtils.getStackTrace(ex);
		}
		return response;
	}
}
