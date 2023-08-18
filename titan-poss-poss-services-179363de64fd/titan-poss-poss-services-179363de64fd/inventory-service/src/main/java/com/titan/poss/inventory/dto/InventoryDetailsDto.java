package com.titan.poss.inventory.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class InventoryDetailsDto {
	private String id;
	private String bin;
	private String destinationBin;
	private String destinationBinGroup;
	private String itemCode;
	private String locationCode;
	private String lotNumber;
	private String serialNumber;
	private String prodCategory;
	private String prodGroup;
	private BigDecimal totalWeight;
	private Short totalQuantity;
	private BigDecimal totalValue;
	private String lastModifiedBy;
	private Date lastModifiedDate;

}
