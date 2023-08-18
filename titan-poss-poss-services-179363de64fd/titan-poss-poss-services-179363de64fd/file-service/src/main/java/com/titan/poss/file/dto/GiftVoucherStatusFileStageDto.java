/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GiftVoucherStatusFileStageDto {

	private String gvSerialNumber;

	private String gvStatus;

	private String actBlockedDateActivatedOn;

	private String validFrom;

	private String validTill;

	private String validityDays;
	
	private String createdBy;

	private String createdDate;

	private String lastModifiedBy;

	private String lastModifiedDate;

}
