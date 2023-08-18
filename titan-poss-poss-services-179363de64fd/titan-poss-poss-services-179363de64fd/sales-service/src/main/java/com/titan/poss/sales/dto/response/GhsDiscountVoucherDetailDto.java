package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import com.titan.poss.sales.dto.BaseDiscountDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class GhsDiscountVoucherDetailDto extends BaseDiscountDetailsDto {

	private BigDecimal discountValue;
	private Boolean isGoldCoinAllowed;
}
