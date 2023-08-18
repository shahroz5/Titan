package com.titan.poss.sales.dto;

import java.math.BigDecimal;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class GRNMultipleDiscountDto extends BaseDiscountDetailsDto {

	private BigDecimal discountValue;
}
