/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/

package com.titan.poss.inventory.dto.request;

import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * DTO class for request structure of stock Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ComStockRequestDto {
    
	@NotNull(message = "Item code can not be null")
	private String itemCode;
	
	@NotNull(message = "Source location code can not be null")
	private String sourceLocationCode;
	
	@NotNull(message = "Destination location code can not be null")
	private String destinationLocationCode;
	
	@NotNull(message = "Lot number can not be null")
	private String lotNumber;
	
	@NotNull(message = "Bincode can not be null")
	private String binCode;
	
	@NotNull(message = "Quantity can not be null")
	private Short quantity;
	
	@NotNull(message = "Fiscal year can not be null")
	private Short fiscalYear;
	
	@NotNull(message = "Customer order number  can not be null")
	private String comOrderNo;
	
	@NotNull(message = "Customer order date can not be null")
	private Date comOrderDateTime;
	
	@NotNull(message = "Unit weight can not be null")
	private String unitWeight;
	
}
