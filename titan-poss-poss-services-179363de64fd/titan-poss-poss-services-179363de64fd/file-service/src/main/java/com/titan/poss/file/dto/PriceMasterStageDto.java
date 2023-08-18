/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PriceMasterStageDto implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;
	
	private String id;

	private String itemCode;

	private BigDecimal makingCharges;

	private String priceGroup;

	private String loginId;
		
	private Date createdDate;
		
	private String lastModifiedId;
		
	private Date lastModifiedDate;

	private String fileAuditId;
	
	private String transferType;

}
