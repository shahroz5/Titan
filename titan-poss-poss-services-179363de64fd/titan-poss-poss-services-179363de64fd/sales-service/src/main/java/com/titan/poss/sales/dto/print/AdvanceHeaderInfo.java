/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AdvanceHeaderInfo {

	private String id;
	private Integer docNo;
	private Date docDate;
	private Integer customerId;

}
