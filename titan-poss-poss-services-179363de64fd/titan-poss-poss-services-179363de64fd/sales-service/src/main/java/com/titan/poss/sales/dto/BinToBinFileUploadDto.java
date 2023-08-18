/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BinToBinFileUploadDto {
	
	private String itemCode;

	private String lotNumber;
	
}
