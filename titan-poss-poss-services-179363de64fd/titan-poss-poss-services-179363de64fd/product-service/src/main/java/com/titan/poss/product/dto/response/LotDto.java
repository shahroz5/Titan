/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LotDto {

	@NotNull(message = "Please provide the itemCode")
	private String itemCode;

	@NotNull(message = "Please provide the lotNumber")
	@Size(max = 20, message = "LotNumber.lot_number max len: 20 min len: -1")
	private String lotNumber;

	@NotNull(message = "Please provide the mfgDate")
	private Date mfgDate;

	@NotNull(message = "Please provide the stoneDetails")
	@Size(max = 4000, message = "LotNumber.stone_details max len: 4000 min len: -1")
	private String stoneDetails;

	private String parentLotNumber;

	private String parentItemCode;

	private BigDecimal stoneValue;

}
