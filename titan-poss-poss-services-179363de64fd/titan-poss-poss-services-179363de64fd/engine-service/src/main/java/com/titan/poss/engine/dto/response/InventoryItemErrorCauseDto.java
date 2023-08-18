/*   Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.dto.response;

import lombok.Data;

/**
 * Dto for inventory item error cause.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class InventoryItemErrorCauseDto {

	private Boolean isSaleable;
	private Boolean isReturnable;
	private Boolean isJewelleryItem;// pending - currently not used
	private String itemNature;// pending - currently not used
	private String binGroupCode;
}
