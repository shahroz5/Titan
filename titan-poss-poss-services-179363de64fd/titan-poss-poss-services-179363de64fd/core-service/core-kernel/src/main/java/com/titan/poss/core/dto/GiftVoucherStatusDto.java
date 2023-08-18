/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GiftVoucherStatusDto {
	
	private Integer serialNo;

	private String status;

	private Date activationDate;

	private Date validFrom;

	private Date validTill;

	private Integer validityDays;

	private String lastModifiedBy;

	private Date lastModifiedDate;

}
