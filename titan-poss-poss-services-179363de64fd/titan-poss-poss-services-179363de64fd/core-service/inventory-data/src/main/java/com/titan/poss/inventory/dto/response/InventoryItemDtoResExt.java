package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryItemDtoResExt {
	private BigDecimal availableWeight;
	private BigDecimal availableValue;
	private Short availableQuantity;
	private Boolean isBinToBinAllowed;
		
	private String id;
	private String itemCode;
	private String lotNumber;
	private Date mfgDate;
	private String productCategory;
	private String productGroup;
	private String productCategoryDesc;
	private String productGroupDesc;
	private String binCode;
	private String binGroupCode;
	private BigDecimal stdValue;
	private BigDecimal stdWeight;
	private BigDecimal itemLevelDiscount;
	private String currencyCode;
	private String weightUnit;
	private String status;
	private String imageURL;
	private Object itemDetails;
	private Object taxDetails;
	private Object totalWeightDetails;
}
