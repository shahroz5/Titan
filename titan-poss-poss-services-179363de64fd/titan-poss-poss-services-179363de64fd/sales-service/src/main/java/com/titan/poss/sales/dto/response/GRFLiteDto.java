/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

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
public class GRFLiteDto {

	Integer docNo;
	Short fiscalYear;

	Integer cnDocNo;
	Short cnFiscalYear;
}
