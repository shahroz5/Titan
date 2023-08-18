/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for getting other Request Details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OtherRequestDto extends StockDto {

	private Integer id;
	private Integer reqDocNo;
	private String srcLocationCode;
	private String destLocationCode;
	private String status;
	private Date reqDocDate;
	private String requestType;
}
