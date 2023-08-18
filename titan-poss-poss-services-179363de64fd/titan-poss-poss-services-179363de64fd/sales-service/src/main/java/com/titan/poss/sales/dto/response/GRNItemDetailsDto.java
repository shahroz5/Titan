/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import com.titan.poss.core.dto.LegacyCmDetailsDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class GRNItemDetailsDto extends GRNBaseItemDetailsDto {

	private BigDecimal totalTax;
	private BigDecimal totalDiscount;
	private String binCode;

	private PriceDetailsDto priceDetails;
	private TaxCalculationResponseDto taxDetails;
	private LegacyCmDetailsDto legacyCmDetails;

	private BigDecimal hallmarkCharges;
	private BigDecimal hallmarkDiscount;

	public GRNItemDetailsDto(String id, Integer rowId, String itemCode, String lotNumber, String productGroupCode,
			String productCategoryCode, BigDecimal inventoryWeight, BigDecimal totalWeight, Short totalQuantity,
			String employeeCode, BigDecimal unitValue, BigDecimal totalValue, BigDecimal finalValue,
			BigDecimal totalTax, BigDecimal totalDiscount, String priceDetails, String taxDetails, String binCode,
			BigDecimal hallmarkCharges, BigDecimal hallmarkDiscount) {
		super(id, rowId, itemCode, lotNumber, productGroupCode, productCategoryCode, inventoryWeight, totalWeight,
				totalQuantity, employeeCode, unitValue, totalValue, finalValue);
		this.totalTax = totalTax;
		this.totalDiscount = totalDiscount;
		this.priceDetails = MapperUtil.mapObjToClass(priceDetails, PriceDetailsDto.class);
		this.taxDetails = MapperUtil.mapObjToClass(taxDetails, TaxCalculationResponseDto.class);
		this.binCode = binCode;
		this.hallmarkCharges = hallmarkCharges;
		this.hallmarkDiscount = hallmarkDiscount;
	}

}
