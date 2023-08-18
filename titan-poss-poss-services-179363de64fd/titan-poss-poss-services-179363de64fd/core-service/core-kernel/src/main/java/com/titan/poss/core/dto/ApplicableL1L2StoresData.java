/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ApplicableL1L2StoresData implements Serializable{

	private static final long serialVersionUID = 1L;

	private Boolean sameStore;
	
	private Boolean sameState;
	
	private Boolean acrossCountry;
	
	
	
}
