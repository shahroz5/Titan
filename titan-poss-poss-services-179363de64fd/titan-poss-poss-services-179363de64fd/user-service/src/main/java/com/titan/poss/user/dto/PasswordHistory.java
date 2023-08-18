/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto;

import java.util.List;

import lombok.Data;

/**
 * This JsonData stores last passwords
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PasswordHistory {

	private List<String> passwords;
}
