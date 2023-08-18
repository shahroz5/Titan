/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.client.methods.HttpPost;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationIntgDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.EmailDto;
import com.titan.poss.integration.dto.request.EmailIndividualDto;
import com.titan.poss.integration.dto.request.RecipientDto;
import com.titan.poss.integration.dto.request.SMSDto;
import com.titan.poss.integration.dto.request.SMSIndividualDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.Notification;
import com.titan.poss.integration.intg.repository.NotificationRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.EmailService;
import com.titan.poss.integration.service.NotificationService;
import com.titan.poss.integration.service.SMSService;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("NotificationService")
public class NotificationServiceImpl implements NotificationService {

	private static final Logger LOGGER = LoggerFactory.getLogger(NotificationServiceImpl.class);

	private static final String OFFICIAL_DOMAIN = "Titan";

	private static final String EMAIL_SUBJECT = "You got a mail";

	private static final String INCORRECT_DATA_IN_DB = "Incorrect data in Database.";
	private static final String ERR_CORE_036 = "ERR-CORE-036";
	
	private static final String INVALID_VENDOR = "Vendor is not active";
	private static final String ERR_INT_017 = "ERR-INT-017";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String TINY_URL = "TINY_URL";

	@Autowired
	EmailService emailService;
	

	@Autowired
	SMSService smsService;
	
	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	NotificationRepository notificationRepo;

	@Value("${poss.notification.isEmailNotificationToIndividual:true}")
	private boolean isEmailNotificationToIndividual;

	private List<EmailIndividualDto> emailIndvs = new ArrayList<>();
	private List<SMSIndividualDto> smsIndvs = new ArrayList<>();

	@Override
	public void sendNotification(NotificationDto notificationDto) {

		List<NotificationTypeDataDto> notificationTypeData = notificationDto.getNotificationTypeData();

		// clear global variables every time API calls happen
		clearGlobalList();

		// iterate through notifications & test which notification mode (SMS, EMail) is
		// eligible
		for (int i = 0; i < notificationTypeData.size(); i++) {
			// PENDING, ask Boban where to store
			tempAddOrgDomain(notificationDto);
			// get it from notification master
			Notification notification = getNotificationByType(notificationTypeData.get(i).getNotificationType());
			verifyIfAnyOneNotificationIsAllowedBy(notification, notificationDto,
					notificationDto.getNotificationTypeData().get(i));
		}

		// if null, try to get from loggedin user
		if (StringUtils.isBlank(notificationDto.getLocationCode())) {
			notificationDto.setLocationCode(CommonUtil.getLocationCode());
		}

		try{
			sendMail(notificationDto);
		}
		catch(Exception e) {
			System.out.println("Exception : "+e.getMessage());
		}
		
			sendSMS(notificationDto);
		
		

	}

	private void clearGlobalList() {
		emailIndvs.clear();
		smsIndvs.clear();
	}

	private void sendSMS(NotificationDto notificationDto) {

		if (CollectionUtils.isNotEmpty(smsIndvs)) {

			SMSDto smsDto = new SMSDto(notificationDto.getMobileNo(), smsIndvs, notificationDto.getLocationCode());
			smsService.sendSmsNotification(null, smsDto, null);
		}
	}

	private void sendMail(NotificationDto notificationDto) {

		if (CollectionUtils.isNotEmpty(emailIndvs)) {

			// allow email only if isEmailNotificationToIndividual
			RecipientDto recipient = new RecipientDto();
			if (isEmailNotificationToIndividual) {
				recipient.setTo(notificationDto.getEmailIds());
				recipient.setCc(notificationDto.getCc());
				recipient.setBcc(notificationDto.getBcc());
			}

			EmailDto emailDto = new EmailDto(recipient, (null!=notificationDto.getEmailSubject() ? notificationDto.getEmailSubject() : EMAIL_SUBJECT), emailIndvs, notificationDto.getLocationCode());

			if (!isEmailNotificationToIndividual) {
				emailDto.setRecipient(tempAddTeamsMail(emailDto.getRecipient()));
			}

			emailService.sendEmailNotification(null, emailDto, null);
		}
	}

	// PENDING remove for PRODUCTION
	private RecipientDto tempAddTeamsMail(RecipientDto recipient) {

		String cc = ApplicationPropertiesUtil.getProperty("tempMailCc");
		String bcc = ApplicationPropertiesUtil.getProperty("tempMailBcc");

		if (StringUtils.isNotBlank(cc))
			recipient.setCc(updateCopy(cc, recipient.getCc()));

		if (StringUtils.isNotBlank(bcc))
			recipient.setBcc(updateCopy(bcc, recipient.getBcc()));

		return recipient;
	}

	/**
	 * @param cc
	 * @param cc2
	 * @return
	 */
	private Set<String> updateCopy(String cc, Set<String> existing) {

		Set<String> finalList;
		if (CollectionUtils.isEmpty(existing)) {
			finalList = Set.of(cc);
		} else {
			existing.add(cc);
			finalList = existing;
		}

		return finalList;
	}

	private void verifyIfAnyOneNotificationIsAllowedBy(Notification notification, NotificationDto notificationDto,
			NotificationTypeDataDto ntd) {
		boolean canSendSMS = false;
		boolean canSendMail = false;

		StringBuilder remarks = new StringBuilder();
		// if email id present in DTO, email required checked & template is there
		if (CollectionUtils.isNotEmpty(notificationDto.getEmailIds())) {

			if (StringUtils.isBlank(notification.getEmailTemplateName()))
				throw new ServiceException(INCORRECT_DATA_IN_DB, ERR_CORE_036,
						"Notification Master >> email Template : " + notification.getEmailTemplateName());
			canSendMail = true;
		} else {

			remarks.append("isEmailRequired? ");
			remarks.append(notification.getIsEmailRequired());
			remarks.append(", email: ");
			remarks.append(notificationDto.getEmailIds() + " . ");

		}
		// if mobile no is present in DTO, SMS required checked & SMS template is there
		if (StringUtils.isNotBlank(notificationDto.getMobileNo()) && notification.getIsSMSRequired()) {

			if (StringUtils.isBlank(notification.getSmsContent()))
				throw new ServiceException(INCORRECT_DATA_IN_DB, ERR_CORE_036,
						"Notification Master >> SMS content : " + notification.getSmsContent());

			canSendSMS = true;
		} else {

			remarks.append("isSMSRequired? ");
			remarks.append(notification.getIsSMSRequired());
			remarks.append(", mobileNo: ");
			remarks.append(notificationDto.getMobileNo());
		}

		// when none of them is true, throw error also
		if (!canSendMail && !canSendSMS) {

			LOGGER.error("No notificaction sent: \n{}\n{}", notificationDto, notification);
			throw new ServiceException("Notification can't be send as both notification mode check failed",
					"ERR-INT-023", notification.getNotificationType() + ": <<" + remarks.toString() + ">>");
		}
		if (canSendMail) {
			// @formatter:off
			EmailIndividualDto emailIndv = new EmailIndividualDto(null, ntd.getAttachments(),
//			EmailIndividualDto emailIndv = new EmailIndividualDto(null, null, 
			// @formatter:on
					notification.getEmailTemplateName(), ntd.getData(),ntd.getFileAttachments());
			emailIndvs.add(emailIndv);
		}
		if (canSendSMS) {
			String filePath = ntd.getData().get("s3InvoiceUrl");
			if(StringUtils.isNotBlank(filePath)){
				String shortUrl = generateShortenUrl(TINY_URL, filePath);
				LOGGER.error("shortUrl"+shortUrl, shortUrl, shortUrl);
				ntd.getData().put("downloadInvoiceLink", shortUrl);
				ntd.getData().remove("s3InvoiceUrl");
			}
			SMSIndividualDto smsIndv = new SMSIndividualDto(notification.getSmsContent(), ntd.getData());
			smsIndvs.add(smsIndv);
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
	
	public String generateShortenUrl(String vendorCode,String downloadPath) {
		VendorDao vendor = validateVendor(vendorCode);	
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(vendor.getBaseurl())
				.queryParam("url", downloadPath);		
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return httpResponseUtil.getResponse();		
	}

	// PENDING need to remove from code
	private void tempAddOrgDomain(NotificationDto notificationDto) {

		for (int i = 0; i < notificationDto.getNotificationTypeData().size(); i++) {
			Map<String, String> data = notificationDto.getNotificationTypeData().get(i).getData();

			if (data == null)
				data = new HashMap<>();
			// PENDING remove hard coding
			data.put("orgName", OFFICIAL_DOMAIN);
			String copyRight = new StringBuilder(100).append("&copy; ").append(OFFICIAL_DOMAIN).append(" Company LTD.")
					.toString();
			data.put("copyright", copyRight);

			notificationDto.getNotificationTypeData().get(i).setData(data);
		}

	}

	@Override
	public Notification getNotificationByType(NotificationType notificationType) {

		List<Notification> notifications = notificationRepo
				.findAllByNotificationTypeAndIsActiveTrue(notificationType.name());
		if (notifications.isEmpty())
			throw new ServiceException("No active notification details found", "ERR-INT-006", notificationType.name());
		if (notifications.size() > 1)
			throw new ServiceException("More than one active notification details found", "ERR-INT-007",
					notificationType.name());
		return notifications.get(0);
	}

	@Override
	public NotificationIntgDto getNotificationDtoByType(String notificationTypeStr) {
		Notification notification = getNotificationByType(NotificationType.valueOf(notificationTypeStr));
		return (NotificationIntgDto) MapperUtil.getDtoMapping(notification, NotificationIntgDto.class);
	}

}