/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Set;

import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * This is the DTO for notification sending API
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class NotificationDto {

	private Set<@PatternCheck(regexp = RegExConstants.EMAIL_REGEX) String> emailIds;
	private Set<@PatternCheck(regexp = RegExConstants.EMAIL_REGEX) String> cc;
	private Set<@PatternCheck(regexp = RegExConstants.EMAIL_REGEX) String> bcc;

	// disabling regex as in customer module there is no restriction on international no
	private String mobileNo;
	
	private String locationCode;
	
	private String emailSubject;
	
	@NotEmpty
	private List<@Valid NotificationTypeDataDto> notificationTypeData;

}
