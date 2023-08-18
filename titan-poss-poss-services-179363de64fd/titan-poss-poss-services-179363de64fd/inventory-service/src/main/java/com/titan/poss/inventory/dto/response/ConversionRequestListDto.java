/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ConversionRequestListDto {

	private Integer id;
	private Integer srcDocNo;
	private String status;
	private Date createdDate;
	private Short totalQuantity;
	private BigDecimal totalWeight;
	private BigDecimal totalValue;
	private Object otherDetails;
	private String approvalRemarks;

}
