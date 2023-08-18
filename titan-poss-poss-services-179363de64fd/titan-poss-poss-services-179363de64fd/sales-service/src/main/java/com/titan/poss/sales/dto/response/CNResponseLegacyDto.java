/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CNResponseLegacyDto extends CNResponeDtoExt {

	private String destLocationCode;
	
	private Integer ibtDocNo;
	
	private Short ibtFiscalYear;
	
	
}
