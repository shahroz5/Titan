/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.response;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.product.dto.StoneDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LotNumberStoneMappingDto {

	@NotNull
	private String id;

	@NotNull
	@Size(max = 20, message = "LotNumberStoneMapping.lot_number max len: 20 min len: -1")
	private String lotNumber;

	@NotNull
	private ItemDto item;

	@NotNull
	private Integer lineItemNo;

	@NotNull
	private StoneDto stone;

	@NotNull
	private BigDecimal stoneWeight;

	@NotNull
	private Integer noOfStones;
}
