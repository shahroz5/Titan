/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dto for employee list
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiteEmployeeListDto {
	private String employeeCode;
	private String empName;
	private String locationCode;
	private String mobileNo;
	private Boolean isLoginActive;
}
