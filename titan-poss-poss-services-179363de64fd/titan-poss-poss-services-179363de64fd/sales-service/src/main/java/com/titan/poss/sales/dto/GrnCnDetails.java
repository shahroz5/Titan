/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GrnCnDetails {

	private String locationCode;
	private Date docDate;
	private List<String> returningItemIds;
	private Boolean isCMGoldRate;
}
