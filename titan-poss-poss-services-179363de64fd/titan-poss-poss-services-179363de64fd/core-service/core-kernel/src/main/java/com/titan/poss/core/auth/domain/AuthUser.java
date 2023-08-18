/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.auth.domain;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AuthUser extends User {

	public AuthUser(String username, String password, Collection<? extends GrantedAuthority> authorities,
			String locationCode, String locType, String org, String mobile) {
		super(username, password, authorities);
		if (locType.equals(UserTypeEnum.L1.toString()) || locType.equals(UserTypeEnum.L2.toString())
				|| locType.equals(UserTypeEnum.L3.toString()) || locType.equals(UserTypeEnum.API.toString())) {
			this.locationCode = locationCode;
		} else if (locType.equals(UserTypeEnum.REG.toString())) {
			this.regionCode = locationCode;
		}

		this.locCommonCode = locationCode;
		this.orgCode = org;
		this.mobileNo = mobile;
		this.locType = locType;
	}

	public AuthUser(String applicationName, String password, Collection<? extends GrantedAuthority> authorities,
			String applicationCode, boolean isApiKey, String validUpto) {
		super(applicationName, password, authorities);
		this.applicationName = applicationName;
		this.applicationCode = applicationCode;
		this.validUpto = validUpto;
		this.isApiKey = isApiKey;
	}

	private static final long serialVersionUID = 3102294056807388456L;

	private String locationCode;
	private String regionCode;
	private String orgCode;
	private String locType;
	private boolean isApiKey = false;
	private String applicationCode;
	private String applicationName;
	private String validUpto;
	private String mobileNo;
	private String emailId;
	private String employeeCode;
	private String employeeName;
	private String locCommonCode;
	private String hostName;
	private String brandCode;
	private String token;
	private Boolean forcePasswordChange;
	private Boolean isOffline;
	private AppTypeEnum appName;

	public Boolean isACorpUser() {
		return this.locType.equals(UserTypeEnum.ORG.name());
	}

	public Boolean isARegionUser() {
		return this.locType.equals(UserTypeEnum.REG.name());
	}

	public Boolean isAStoreUser() {
		return (this.locType.equals(UserTypeEnum.L1.name()) || this.locType.equals(UserTypeEnum.L2.name())
				|| this.locType.equals(UserTypeEnum.L3.name()));
	}

	public Boolean isAnAPIUser() {
		return this.locType.equals(UserTypeEnum.API.name());
	}

	public Boolean isAnL3StoreUser() {
		Boolean isValid = false;
		if (this.locType.equals(UserTypeEnum.L3.name()))
			isValid = true;
		return isValid;
	}

	public String getLocCommonCode() {
		return this.locCommonCode;
	}

	public Boolean isALegacyUser() {
		Boolean isValid = false;
		if (this.locType.equalsIgnoreCase(UserTypeEnum.API.name()))
			isValid = true;
		return isValid;
	}
}
