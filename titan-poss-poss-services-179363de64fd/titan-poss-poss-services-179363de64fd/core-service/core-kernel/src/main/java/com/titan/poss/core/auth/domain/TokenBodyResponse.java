/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.auth.domain;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TokenBodyResponse {
	private String aud;
	String[] scp = new String[4];
	private String upn;
	private float nbf;
	private boolean apiKey;
	private String iss;
	private String name;
	private float exp;
	private float iat;
	private String email;
	private String loc;
	private String status;
	private String host;
	private String brand;

}
