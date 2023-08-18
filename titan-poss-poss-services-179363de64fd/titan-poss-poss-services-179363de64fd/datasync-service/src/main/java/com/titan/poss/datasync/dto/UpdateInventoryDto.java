/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import java.util.List;

import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDao;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UpdateInventoryDto {

	private List<InventoryDetailsDao> inventoryDetails;
	private Integer docNo;
	private DocTypeEnum docType;

}
