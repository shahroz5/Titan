/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class UserSessionDetailsResultDto extends UserSessionDetailsBaseDto {

	private Integer id;

	private Date loginDate;

	private Date expiryDate;

	private String hostName;

	@Override
	public String toString() {
		return "UserSessionDetailsResultDto [id=" + id + ", getHostName()=" + getHostName() + ", expiryDate="
				+ expiryDate + ", hostName=" + hostName + ", getId()=" + getId() + ", getLoginDate()=" + getLoginDate()
				+ ", getExpiryDate()=" + getExpiryDate() + ", loginDate=" + loginDate + ", hashCode()=" + hashCode()
				+ "]";
	}

}
