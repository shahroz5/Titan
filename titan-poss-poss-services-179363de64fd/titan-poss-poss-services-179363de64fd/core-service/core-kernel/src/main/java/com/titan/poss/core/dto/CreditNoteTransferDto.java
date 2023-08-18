/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreditNoteTransferDto implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String id;

	private String srcLocationCode;

	private String destLocationCode;

	private String cnDetails;

	private String srcCnId;

	private String destCnId;

	private BigDecimal amount;

	private String status;
	
	private Integer docNo;
	
	private Short fiscalYear;
}
