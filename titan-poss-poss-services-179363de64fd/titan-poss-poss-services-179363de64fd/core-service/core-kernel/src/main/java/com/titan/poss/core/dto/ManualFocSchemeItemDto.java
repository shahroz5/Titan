package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ManualFocSchemeItemDto {

	public String inventoryId;
	public String itemCode;
	public String lotNumber;
	public Short totalQuantity;
	public BigDecimal totalWeight;
	public BigDecimal unitWeight;
	public String manualFocStartDate;
	public String manualFocEndDate;
	public String approvedBy;
	
}
