/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for Stock Request Data
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class IssueStockDto extends StockDto {
	private Date reqDocDate;
	private Integer reqDocNo;
	private String reqLocationCode;
	private String requestType;
	private Object otherDetails;
	private Object carrierDetails;
    private String srcLocationDescription;
    private String destLocationDescription;
}
