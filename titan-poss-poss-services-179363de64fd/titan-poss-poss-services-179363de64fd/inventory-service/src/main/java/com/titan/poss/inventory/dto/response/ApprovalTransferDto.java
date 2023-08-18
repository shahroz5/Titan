/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class ApprovalTransferDto extends BaseStockDto {

	private Integer srcDocNo;
	private Date srcDocDate;
	private Integer destDocNo;
	private Date destDocDate;
	private String transferType;
	private Object courierDetails;
	private Object otherDetails;
	private Short totalIssuedQuantity;
	private BigDecimal totalIssuedValue;
	private BigDecimal totalIssuedWeight;
	private Short totalReceivedQuantity;
	private BigDecimal totalReceivedValue;
	private BigDecimal totalReceivedWeight;
}
