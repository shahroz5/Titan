/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingDayActivityDto {
	
	private String errorMessage;
	
	private Date businessDate;

	private String status;

}
