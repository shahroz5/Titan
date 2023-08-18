/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ReturnSalesTxnDto {

	private Integer docNo;
	private Short fiscalYear;
	private Date docDate;
	private String docDateStr;
	private Integer cnDocNo;

}
