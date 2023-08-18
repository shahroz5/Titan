package com.titan.poss.sales.dto.print;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.sales.dto.response.CustomerPrintDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.TepDiscountRecoveryDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TepGrandTotal {
	
	private short totalQuantity;
	
	private BigDecimal totalGrossWeight;
	
	private BigDecimal totalMetalWeight;
	
	private BigDecimal totalStoneWeight;
	
	private BigDecimal totalMetalValue;
	
	private BigDecimal totalStoneValue;
	
	private BigDecimal totalDeductionAmount;
	
	private BigDecimal totalRefundDeductionAmount;
	
	private BigDecimal totalRefundValue;
	
	private BigDecimal totalDiscountRecovered;

}
