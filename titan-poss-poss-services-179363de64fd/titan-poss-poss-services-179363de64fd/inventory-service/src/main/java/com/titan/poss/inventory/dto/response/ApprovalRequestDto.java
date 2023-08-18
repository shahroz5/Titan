/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for getting Approval Request Details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class ApprovalRequestDto extends BaseStockDto {

	private Integer reqDocNo;
	private Short totalRequestedQuantity;
	private BigDecimal totalRequestedWeight;
	private BigDecimal totalRequestedValue;
	private Short totalAcceptedQuantity;
	private BigDecimal totalAcceptedWeight;
	private BigDecimal totalAcceptedValue;
	private Short totalApprovedQuantity;
	private Date reqDocDate;
	private Date createdDate;
	private String requestType;
	private Object otherDetails;
	private Object carrierDetails;
	private String requestRemarks;
	private String approvalRemarks;
}
