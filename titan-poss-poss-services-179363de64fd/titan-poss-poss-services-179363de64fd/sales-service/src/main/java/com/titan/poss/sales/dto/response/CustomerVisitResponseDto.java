/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

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
public class CustomerVisitResponseDto implements Comparable<CustomerVisitResponseDto> {

	private Integer walkins;

	private Integer noOfInvoice;

	private Date businessDate;

	private Integer purchaserCount;

	private Integer nonPurchaserCount;

	@Override
	public int compareTo(CustomerVisitResponseDto c) {
		if (getBusinessDate() == null || c.getBusinessDate() == null) {
			return 0;
		}
		return getBusinessDate().compareTo(c.getBusinessDate());
	}

}
