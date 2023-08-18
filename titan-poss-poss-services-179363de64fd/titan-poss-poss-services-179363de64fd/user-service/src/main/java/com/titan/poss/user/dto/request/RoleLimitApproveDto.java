/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.dto.request;

import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.user.dto.constants.RoleLimitRequestStatus;

import lombok.Data;

/**
 * DTO class for role limit approval by Admin request body
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RoleLimitApproveDto {

	@NotNull
	@ValueOfEnum(enumClass = RoleLimitRequestStatus.class)
	private String status;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = true)
	private String approvalRemarks;

	@Valid
	private Set<RoleLimitReqDto> roles;
}
