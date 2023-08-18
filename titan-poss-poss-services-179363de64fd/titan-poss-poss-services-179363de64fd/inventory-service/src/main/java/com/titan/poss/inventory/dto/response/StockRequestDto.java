/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * DTO class for getting Stock Request Details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class StockRequestDto {

	private Integer id;
	private Integer reqDocNo;
	private String reqLocationCode;
	private String srcLocationCode;
	private String destLocationCode;
	private Short totalRequestedQuantity;
	private Short totalAcceptedQuantity;
	private Short totalApprovedQuantity;
	private String status;
	private Date reqDocDate;
	private String requestType;
	private String requestRemarks;
	private Date createdDate;
}
