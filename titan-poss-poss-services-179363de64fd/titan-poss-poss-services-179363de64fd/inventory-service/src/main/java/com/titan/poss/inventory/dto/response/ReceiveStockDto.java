/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for Stock Transfer Data
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ReceiveStockDto extends StockDto {
	private String transferType;
	private Date courierReceivedDate;
	private Object carrierDetails;
	private String reasonForDelay;
}
