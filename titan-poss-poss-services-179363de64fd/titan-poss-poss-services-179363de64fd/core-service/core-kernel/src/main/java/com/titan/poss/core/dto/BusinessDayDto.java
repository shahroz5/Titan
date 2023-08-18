/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

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
public class BusinessDayDto {

	private Date businessDate;

	private Integer fiscalYear;

	private String status;

}
