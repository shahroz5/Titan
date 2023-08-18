/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.auth.domain;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class JwtTokenProps {
	private Date expiresAt;
	private boolean isApiKey;
	private String audience;
	private boolean isRefreshToken;
	private String ipAddress;
	private String upn;
	private String empCode;
	private String empName;
	private String loc;
	private String type;
	private List<String> scp;
	private String mobileNo;
	private String emailId;
	private String orgCode;
	private String brandCode;
	private String hostName;
	private Boolean isOffline;
	private Boolean isSso;

	private String appName;
	/**
	 * this field is for 30 days check if password is not changed, then it will be
	 * true
	 */
	private boolean forcePasswordChange;

}
