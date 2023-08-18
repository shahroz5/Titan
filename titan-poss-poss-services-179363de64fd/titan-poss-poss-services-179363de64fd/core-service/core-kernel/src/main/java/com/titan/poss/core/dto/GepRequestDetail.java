/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GepRequestDetail {

	// will be removed need to take from DAY master.
	private Date buisnessDate;

	private String metalType;

	private String itemType;

	private BigDecimal purity;

}
