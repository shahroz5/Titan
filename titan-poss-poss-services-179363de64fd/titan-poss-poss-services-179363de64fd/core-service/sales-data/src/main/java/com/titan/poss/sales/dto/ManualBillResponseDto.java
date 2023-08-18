/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;

import com.titan.poss.core.dto.ManualBillVerifyDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Manual Bill Response Dto.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class ManualBillResponseDto extends ManualBillVerifyDto {

	private String processId;

	private String requestStatus;

	private Integer requestNo;

	private Date requestedDate;

	private String requestType;

}
