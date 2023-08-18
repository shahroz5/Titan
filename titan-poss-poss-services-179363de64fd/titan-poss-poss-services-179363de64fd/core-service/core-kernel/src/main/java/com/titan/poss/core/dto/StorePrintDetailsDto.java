/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StorePrintDetailsDto extends StoreDetails {

	private static final long serialVersionUID = 1L;

	private String stateTaxCode;
	private String gstId;
	private String brandCode;
	private String townName;
	private String description;
	private String regionCode;
}
