/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.text.StrSubstitutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.SMSDto;
import com.titan.poss.integration.dto.request.SMSIndividualDto;
import com.titan.poss.integration.intg.dao.SMSIntgAudit;
import com.titan.poss.integration.intg.repository.SMSIntgAuditRepository;
import com.titan.poss.integration.service.SMSService;
import com.titan.poss.integration.service.VendorService;
import com.titan.poss.integration.service.factory.SMSFactory;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationSMSService")
public class SMSServiceImpl implements SMSService {

	@Autowired
	private VendorService vendorService;

	@Autowired
	private SMSFactory smsFactory;

	@Autowired
	private SMSIntgAuditRepository smsIntgAuditRepo;

	public static final char DEFAULT_ESCAPE = '$';
	private static final String DEFAULT_STR_PREFIX = "${";
	private static final String DEFAULT_STR_SUFFIX = "}";

	@Override
	public void sendSmsNotification(VendorDao vendors, SMSDto smsDto, List<SMSIntgAudit> smsIntgAud) {
		VendorDao vendor = vendorService.getActiveByVendorType(VendorTypeEnum.SMS);
		// String mobileNo, NotificationType notificationType,
//		Map<String, String> data, String content
		SMSService smsService = smsFactory.getSMSService(vendor);

		Set<String> missingFields = smsService.checkIfRequiredFieldsAreThere(vendor);
		if (!CollectionUtils.isEmpty(missingFields))
			throw new ServiceException("Some Required field(s) for SMS are missing: " + vendor.getVendorCode(),
					"ERR-INT-009", missingFields);

		// for loop & update content
		parseSMSLoop(smsDto);

		List<SMSIntgAudit> smsIntgAudits = setInitialSMSAuditAndSave(smsDto, vendor);

		smsService.sendSmsNotification(vendor, smsDto, smsIntgAudits);
	}

	private void parseSMSLoop(SMSDto smsDto) {
		List<SMSIndividualDto> smsIndvDtos = smsDto.getSmsIndvs();
		String content = null;
		if (!CollectionUtils.isEmpty(smsIndvDtos)) {
			for (int i = 0; i < smsIndvDtos.size(); i++) {
				SMSIndividualDto sid = smsIndvDtos.get(i);
				removeUnecessaryPlaceHolders(sid.getContent(),sid.getData());
				content = parseSMS(sid.getContent(), sid.getData());
				smsIndvDtos.get(i).setContent(content);
			}
			smsDto.setSmsIndvs(smsIndvDtos);
		}
	}

	private void removeUnecessaryPlaceHolders(String content, Map<String, String> data) {
		Pattern pattern = Pattern.compile("\\$\\{.*?\\}");
		Matcher matcher = pattern.matcher(content);  
		Set<String> necessaryPlaceHolders = new LinkedHashSet<String>();
		while (matcher.find())
			necessaryPlaceHolders.add(matcher.group().replaceAll("[${}]", ""));
		data.keySet().retainAll(necessaryPlaceHolders);		
	}

	private String parseSMS(String templateString, Map<String, String> data) {
		StrSubstitutor sub = new StrSubstitutor(data, DEFAULT_STR_PREFIX, DEFAULT_STR_SUFFIX, DEFAULT_ESCAPE);
		String result = sub.replace(templateString);
		String[] strArr = result.split("[ ]+");
		List<String> unParsedStr = new ArrayList<>();
		for (int i = 0; i < strArr.length; i++) {
			if (strArr[i].startsWith(DEFAULT_STR_PREFIX)) {
				unParsedStr.add(parseStringToRemoveUnwanted(strArr[i]));
			}
		}
		// if some elements there where variable is not replaced with value, throw error
		if (!unParsedStr.isEmpty())
			throw new ServiceException("SMS Template parsing failed", "ERR-INT-019", unParsedStr);

		return result;
	}

	private String parseStringToRemoveUnwanted(String str) {
		int end = str.lastIndexOf('}');
		end = (end == -1) ? str.length() : end;
		str = str.substring(2, end);
		return str;
	}

	private List<SMSIntgAudit> setInitialSMSAuditAndSave(SMSDto smsDto, VendorDao vendor) {
		List<SMSIndividualDto> smsIndvDtos = smsDto.getSmsIndvs();
		if (CollectionUtils.isEmpty(smsIndvDtos))
			return new ArrayList<>();

		List<SMSIntgAudit> smsIntgAuds = new ArrayList<>();
		for (int i = 0; i < smsIndvDtos.size(); i++) {
			SMSIndividualDto sid = smsIndvDtos.get(i);

			SMSIntgAudit smsIntgAudit = new SMSIntgAudit();
			smsIntgAudit.setMobileNo(smsDto.getMobileNo());
			smsIntgAudit.setVendor(vendor);
			smsIntgAudit.setVendorDetails(MapperUtil.getStringFromJson(vendor));
			smsIntgAudit.setReqValues(MapperUtil.getStringFromJson(sid.getData()));
			smsIntgAudit.setReqBody(sid.getContent());
			smsIntgAudit.setLocationCode(smsDto.getLocationCode());
			smsIntgAuds.add(smsIntgAudit);
		}
		return smsIntgAuditRepo.saveAll(smsIntgAuds);
	}

	@Override
	public Set<String> checkIfRequiredFieldsAreThere(VendorDao vendor) {
		return new HashSet<>();
	}

}
