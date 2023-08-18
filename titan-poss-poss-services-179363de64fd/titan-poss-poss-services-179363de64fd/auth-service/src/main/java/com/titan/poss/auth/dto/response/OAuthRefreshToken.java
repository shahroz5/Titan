package com.titan.poss.auth.dto.response;

import lombok.Data;

@Data
public class OAuthRefreshToken {
	private String device;
	private String upn;
	private String expiresIn;
	private String expiresAt;
	private String issuedAt;
	private String tokenId;
	private String audience;
}