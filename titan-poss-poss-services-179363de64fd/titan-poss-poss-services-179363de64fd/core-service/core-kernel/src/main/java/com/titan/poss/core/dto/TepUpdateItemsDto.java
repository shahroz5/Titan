/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;


import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TepUpdateItemsDto {
	
	private Integer cmDocNo;
	
	private String cmLocationCode;
	
	private Short cmFiscalYear;
	
	private List<GrnItemDetials> items;
}
