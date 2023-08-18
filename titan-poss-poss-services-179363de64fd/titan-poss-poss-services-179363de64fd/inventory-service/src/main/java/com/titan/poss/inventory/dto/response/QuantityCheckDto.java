/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)

public class QuantityCheckDto {

	String itemId;
	String lotNumber;
	String itemCode;
	Short selectedQuantity;
	Short availableQuantity;
	String currentBinGroup;
	String previousBinGroup;
}
