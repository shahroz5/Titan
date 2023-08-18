/**
 * 
 */

/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.EmailDto;
import com.titan.poss.integration.dto.request.EmailIndividualDto;
import com.titan.poss.integration.intg.dao.EmailIntgAudit;
import com.titan.poss.integration.intg.repository.EmailIntgAuditRepository;
import com.titan.poss.integration.service.EmailService;
import com.titan.poss.integration.service.VendorService;
import com.titan.poss.integration.service.factory.EmailFactory;

import freemarker.template.Configuration;
import freemarker.template.Template;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationEmailService")
public class EmailServiceImpl implements EmailService {

	@Autowired
	VendorService vendorService;

	@Autowired
	private EmailFactory emailFactory;

	@Autowired
	Configuration freemarkerConfig;

	@Autowired
	EmailIntgAuditRepository emailIntgAuditRepo;

	private static final String MAIL_SUBJECT = "You got a mail";

	@Override
	public void sendEmailNotification(VendorDao vend, EmailDto emailDto, List<EmailIntgAudit> emailIntgAud) {

		// Repo find By Type And Is Active True
		VendorDao vendor = vendorService.getActiveByVendorType(VendorTypeEnum.EMAIL);
		EmailService emailService = emailFactory.getEmailService(vendor);

		// check required fields are not null, not blank
		Set<String> missingFields = emailService.checkIfRequiredFieldsAreThere(vendor);
		if (!CollectionUtils.isEmpty(missingFields))
			throw new ServiceException("Some Required field(s) for Email are missing: " + vendor.getVendorCode(),
					"ERR-INT-021", missingFields);

		emailDto.setSubject(null!=emailDto.getSubject()? emailDto.getSubject() :MAIL_SUBJECT);

		parseHtmlTemplateLoop(emailDto);

		List<EmailIntgAudit> emailIntgAudits = setInitialEmailAuditAndSave(emailDto, vendor);
		emailService.sendEmailNotification(vendor, emailDto, emailIntgAudits);
	}

	private void parseHtmlTemplateLoop(EmailDto emailDto) {
		List<EmailIndividualDto> emailIndvDtos = emailDto.getEmailIndvs();
		String html = null;
		if (!CollectionUtils.isEmpty(emailIndvDtos)) {
			for (int i = 0; i < emailIndvDtos.size(); i++) {
				EmailIndividualDto eid = emailIndvDtos.get(i);
				html = getHtmlFromTemplate(eid.getTemplateName(), eid.getData());
				emailIndvDtos.get(i).setHtml(html);
			}
			emailDto.setEmailIndvs(emailIndvDtos);
		}

	}

	private String getHtmlFromTemplate(String templateName, Object data) {
		String html = null;
		try {
			Template t = freemarkerConfig.getTemplate(templateName);
			html = FreeMarkerTemplateUtils.processTemplateIntoString(t, data);
		} catch (Exception e) {
			String exceptionClassName = e.getClass().getSimpleName();
			String errorMssg = e.getMessage();
			String remarks;
			if (exceptionClassName.equals("TemplateNotFoundException"))
				remarks = "Template Not Found :- " + templateName;
			else if (exceptionClassName.equals("InvalidReferenceException") && errorMssg.contains("null or missing"))
				remarks = "Value(s) for some placeholder(s) are missing";
			else
				remarks = e.getLocalizedMessage();
			throw new ServiceException("Email Template parsing failed", "ERR-INT-022", remarks);
		}
		return html;
	}

	private List<EmailIntgAudit> setInitialEmailAuditAndSave(EmailDto emailDto, VendorDao vendor) {

		List<EmailIndividualDto> emailIndvDtos = emailDto.getEmailIndvs();
		if (CollectionUtils.isEmpty(emailIndvDtos))
			return new ArrayList<>();

		List<EmailIntgAudit> emailIntgAudits = new ArrayList<>();

		for (int i = 0; i < emailIndvDtos.size(); i++) {
			EmailIndividualDto eid = emailIndvDtos.get(i);

			EmailIntgAudit emailIntgAudit = new EmailIntgAudit();
			emailIntgAudit.setVendor(vendor);
			emailIntgAudit.setVendorDetails(MapperUtil.getStringFromJson(vendor));
			emailIntgAudit.setRecipient(MapperUtil.getStringFromJson(emailDto.getRecipient()));
			emailIntgAudit.setReqValues(MapperUtil.getStringFromJson(eid.getData()));
			emailIntgAudit.setLocationCode(emailDto.getLocationCode());

			emailIntgAudits.add(emailIntgAudit);
		}
		return emailIntgAudits;
	}

	@Override
	public Set<String> checkIfRequiredFieldsAreThere(VendorDao vendor) {
		return new HashSet<>();
	}

}
