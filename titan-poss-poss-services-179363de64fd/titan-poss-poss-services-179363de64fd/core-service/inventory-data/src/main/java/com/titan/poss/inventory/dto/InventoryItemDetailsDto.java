/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class InventoryItemDetailsDto {

	private BigDecimal stoneValue;
	private Integer docNo;
	private Date docDate;
	private String hallMarkRemarks1;
	private String hallMarkingCode;
	private String hallMarkingCentreName;
	private String hallMarkRemarks;
	private Date hallMarkedDate;
	private Boolean isHallMarking;
	private Boolean sold;
 
}
