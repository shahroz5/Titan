/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.auth.domain;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OAuthToken {

	private String accessToken;
	private String tokenType;
	private String expiresIn;
	private String expiresAt;

	// extra for login as refresh is required
	private String refreshTokenId;
	private String refreshTokenExpiresIn;
	private String refreshTokenExpiresAt;
	private String refreshTokenIssuedAt;
}
