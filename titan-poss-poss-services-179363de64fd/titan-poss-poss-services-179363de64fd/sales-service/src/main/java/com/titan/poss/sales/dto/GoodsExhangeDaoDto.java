/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;
import java.util.List;

import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GoodsExhangeDaoDto {

	private GoodsExchangeDaoExt goodsExchange;

	// used to hold cnDocNo.
	private Integer cnDocNo;

	// used for workflow reqDocNo.
	private Integer reqDocNo;
	
	// cm doc date
	private Date refDocDate;
	
	//updated inventoryDetails
	private List<InventoryDetailsDao> inventoryList;

}
