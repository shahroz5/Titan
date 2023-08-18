/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GepResponseDto extends BaseGepResponseDto {

	private String employeeCode;
	private String remarks;
	private String locationCode;
	private Date refDocDate;
	private Object approvalDetails;
	private Integer reqDocNo;
	private String tepExceptionDetails;
	private String subTxnType;	
	private String txnType;
}
