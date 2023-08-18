/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MergedCnGrfLiteDto extends CnGrfLiteDto {

	private Integer customerId;
	private String customerName;
	private String docDate;
	private String docDateStr;
}
