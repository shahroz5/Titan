/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class ListInventoryItemsDto {

	private List<String> binCode;

	private String itemCode;

	private List<String> productCategory;

	private List<String> productGroup;

	private String binGroupCode;

	private String lotNumber;
}
