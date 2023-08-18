package com.titan.poss.sales.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseLegacyDiscountDetailsDto {
	
	private String discountId;
	private String discountCode;
	private String discountType;

}
