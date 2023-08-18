/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BusinessDayWithPreviousDateDto extends BusinessDayDto {

	private Date previousBusinessDate;// populate only when status is 'BOD_IN_PROGRESS'

	public BusinessDayWithPreviousDateDto(Date businessDate, Integer fiscalYear, String status) {
		super(businessDate, fiscalYear, status);
	}

}
