/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CashMemoDetailsDto {

	private String locationCode;
	private Short fiscalYear;
	private Integer docNo;
	private Boolean isInterBrand;
	private Boolean isFullValueTEP;
}
