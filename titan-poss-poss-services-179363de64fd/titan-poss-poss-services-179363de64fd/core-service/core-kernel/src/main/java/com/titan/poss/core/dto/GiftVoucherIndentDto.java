/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiftVoucherIndentDto {

	private Integer serialNo;

	private String giftCode;

	private String regionCode;

	private BigDecimal denomination;

	private Integer quantity;

	private BigDecimal totalValue;

	private String status;

	private Date mfgDate;

	private String locationCode;

	private Integer validityDays;

	private Date activationDate;

	private Date validFrom;

	private Date validTill;

	private String giftDetails;

	private String remarks;

	private String excludes;
	
	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;

}
