/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.response.FileDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/* 
* @author Mindtree Ltd.
* @version 1.0
*/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoodsExchangeApprovalDetailsDto {
	
	private String approvedBy;
	
	private String approvalCode;
	
	private Date approvalDate;
	
	private String processType;
	
	private ListResponse<FileDetailsDto> fileList;

}
