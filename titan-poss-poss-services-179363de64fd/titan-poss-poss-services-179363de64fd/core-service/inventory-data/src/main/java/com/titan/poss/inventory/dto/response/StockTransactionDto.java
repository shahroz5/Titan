/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.inventory.dao.InventoryDetailsDao;

import lombok.Data;
import java.util.Date;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StockTransactionDto {

	private String id;
	private String transactionType;
	private String locationCode;
	private Integer docNo;
	private Date docDate;
	private String status;
	private Short fiscalYear;
	private BigDecimal totalWeight;
	private BigDecimal totalValue;
	private String remarks;
	private String employeeCode;
	private List<String> itemIds;

}
