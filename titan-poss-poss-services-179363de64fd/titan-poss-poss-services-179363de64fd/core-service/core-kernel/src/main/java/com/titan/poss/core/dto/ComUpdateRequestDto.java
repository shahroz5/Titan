/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/

package com.titan.poss.core.dto;

import java.util.Date;

import lombok.Data;

/**
 * DTO class for request structure of stock Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ComUpdateRequestDto {
	
	private String COMLocationCode;
	private String STNLocationCode;
	private String COMOrderNo;
	private String Status;
	private Integer STNDocNo;
	private Date STNDocDate;
	
}
