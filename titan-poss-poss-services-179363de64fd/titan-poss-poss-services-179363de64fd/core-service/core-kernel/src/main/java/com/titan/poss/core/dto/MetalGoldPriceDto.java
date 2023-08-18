package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class MetalGoldPriceDto {
	
	private String locationCode; 
	
	private String metalTypeCode; 
	
	private BigDecimal corporatePrice;
	
	private String goldPriceType;
	
	private Long applicableDate;
	
	private String loginId;
	
	private Long createdDate;
	
	private String lastModifiedId;

	private Long lastModifiedDate;
	
	
}
