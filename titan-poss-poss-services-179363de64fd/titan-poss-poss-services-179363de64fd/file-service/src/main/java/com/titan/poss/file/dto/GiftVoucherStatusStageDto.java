/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GiftVoucherStatusStageDto {

	private Integer gvSerialNo;

	private Integer gvStatus;
	
	private String transitionStatus;

	private Date actBlockedDate;

	private Date validFrom;

	private Date validTill;

	private Integer validityDays;
	
	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;
	
	private String fileAuditId;

}
