/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for additional inventory item details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemInvDetailsDto {

	private String inventoryId;

	private String binGroupCode;

	private String lotNumber;

	private String binCode;

	private Short quantity;

	private Date mfgDate;

	private Date stockInwardDate;

	private Boolean isHallmarked;
	
	private long age;

}
