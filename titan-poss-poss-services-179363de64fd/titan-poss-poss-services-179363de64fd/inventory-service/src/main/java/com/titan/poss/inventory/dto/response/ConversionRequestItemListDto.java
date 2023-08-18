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
public class ConversionRequestItemListDto {

	private String itemCode;
	private String lotNumber;
	private BigDecimal stdValue;
	private BigDecimal stdWeight;
	private String binCode;
	private String productGroup;
	private String productCategory;
	private String productGroupDesc;
	private String productCategoryDesc;
	private String imageURL;
	private Date mfgDate;
	private Object itemDetails;
	private String inventoryId;
	private String weightUnit;
	public boolean studded;
}
