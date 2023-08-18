/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UserSessionDto {

	private Integer id;

	private Date loginDate;

	private Date expiryDate;

	private String hostName;

}
