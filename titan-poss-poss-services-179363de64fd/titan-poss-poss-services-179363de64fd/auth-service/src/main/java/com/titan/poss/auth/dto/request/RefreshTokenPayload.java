/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RefreshTokenPayload {
	@PatternCheck(regexp = RegExConstants.GRANT_TYPE_REGEX, nullCheck = true)
	private String grantType;

	@PatternCheck(regexp = RegExConstants.REFRESH_TOKEN_REGEX, nullCheck = true)
	private String refreshToken;
}