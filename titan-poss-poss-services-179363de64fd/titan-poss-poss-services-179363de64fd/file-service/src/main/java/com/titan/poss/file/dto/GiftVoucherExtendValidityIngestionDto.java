/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigInteger;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GiftVoucherExtendValidityIngestionDto {
	
	private BigInteger serialNo;

	private Date validTill;

	private String fileAuditId;
	
	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;

}
