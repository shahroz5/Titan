/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class SalesHistoryReqDto {
 
	@Positive(message = "fiscalYear should be more than 0")
	private Short fiscalYear;
 
 	@Positive(message = "Doc No. should be more than 0")
	private Integer docNo;

 	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date fromDocDate;
 	
 	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date toDocDate;
 	
	private BigDecimal fromNetAmount;
	
	private BigDecimal toNetAmount;
}
