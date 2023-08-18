/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for raising request for cancel.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CancelAdvancePendingDto extends WorkflowBaseResponse {

	private String id;
	private Integer docNo;

	public CancelAdvancePendingDto(String id, Integer docNo, String requestNo) {
		super(requestNo);
		super.setRequestNo(requestNo);
		this.id = id;
		this.docNo = docNo;
	}

}
