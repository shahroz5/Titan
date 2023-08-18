/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class AdvanceListDto extends BaseAdvanceDto {

	public AdvanceListDto(String id, String status, Integer customerId, Date docDate, Integer docNo, Short fiscalYear,
			String employeeCode, BigDecimal finalValue) {
		super(id, status, customerId, docDate, docNo, fiscalYear, employeeCode, finalValue);
	}

}
