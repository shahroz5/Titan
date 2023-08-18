/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.user.validator.RoleDuplicateCheckInReq;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class for role limit request by Store Manager
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@RoleDuplicateCheckInReq
public class RoleLimitRequestDto {

	@NotNull
	@Size(min = 1)
	private List<@Valid RoleLimitReqDto> roleLimitReqDto;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = true)
	private String requestRemarks;
}
