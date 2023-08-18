/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.BaseGepItemDetailsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GepItemDetailsDto extends BaseGepItemDetailsDto {

	private String itemCode;
	private String binCode;
	private String lotNumber;
	private String itemId;
	private Object priceDetails;
	private String inventoryId;
	private String cashMemoDetailsId;
	private Integer rowId;
	private BigDecimal unitWeight;
	private BigDecimal totalWeight;
	private BigDecimal purity;
	private TaxCalculationResponseDto taxDetails;
	private BigDecimal totalTax;
	private Short quantity;
	private BigDecimal totalValue;
	private BigDecimal finalValue;
	private JsonData discountDetails;
	private JsonData itemDetails;
	private Boolean isSaleable;
	private Date refDocDate;
	private boolean isRequestApproval;
	private BigDecimal netRefundValue;
	
	private BigDecimal sgst;
	private BigDecimal cgst;
	private BigDecimal sgstPercentage;
	private BigDecimal cgstPercentage;
}
