/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import lombok.Data;

/**
	 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DataAuditDto {

	private String id;
	
	private String data;
	
	private String errorMessage;
	
	private String fileId;
	
	private String primaryData;
	
	private String errorType;

}
