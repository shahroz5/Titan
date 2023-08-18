/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import lombok.Data;

/**
 * 
 * Response DTO for the Issue of Pending FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocIssueResponseDto {

	private String id;

	private String txnType;

	private String subTxnType;

	private Integer docNo;

	private Short fiscalYear;

	private String status;

	private String refTxnId;

	private List<FocItemResponseDto> focItems;

}
