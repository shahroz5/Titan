/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.List;

import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.OrderDao;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SalesJobStaggingDto {

	private List<SalesTxnDao> salesTransactionLisToBeUpdated;
	private List<OrderDao> orderDaoList;
	private List<OrderDetailsDaoExt> orderDetailsDaoList;
	private List<CustomerDocumentsDao> customerDocsUpdated;
	private List<CreditNoteDaoExt> creditNoteList;
	private List<InventoryDetailsDao> inventoryDetailsList;

}
