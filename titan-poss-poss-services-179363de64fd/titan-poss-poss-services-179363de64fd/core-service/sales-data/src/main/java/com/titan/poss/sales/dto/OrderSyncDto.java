/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.Column;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.OrderDao;
import com.titan.poss.sales.dao.SalesTxnDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderSyncDto extends SyncableEntity {

	private Short totalQuantity;

	private BigDecimal totalWeight;

	private BigDecimal totalValue;

	private BigDecimal totalDiscount;

	private BigDecimal totalTax;

	private String taxDetails;

	private BigDecimal finalValue;

	private BigDecimal paidValue;

	private BigDecimal roundingVariance;

	private String discountDetails;

	private BigDecimal minValue;

	private Boolean isFrozenRate;

	private Boolean isBestRate;

	private Date rateFrozenDate;

	private String cancellationDetails;

	private String activationDetails;

	private Short totalDeliveredQuantity;

	private BigDecimal totalDeliveredWeight;

	private String orderWeightDetails;

	private String deliveredWeightDetails;

	private Date suspendedDate;

	private String id;

	private String salesTxn;

	private String bestRateConfigDetails;

	private BigDecimal hallmarkCharges;

	private BigDecimal hallmarkDiscount;
	
	private String nomineeDetails;
	
	private String collectedBy;
	
	private BigDecimal totalOrderValue;

	private String cnDetails;

	public OrderDao getOrderDao(OrderSyncDto syncDto) {
		OrderDao dao = (OrderDao) MapperUtil.getObjectMapping(syncDto, new OrderDao());
		SalesTxnDao salesDao = new SalesTxnDao();
		salesDao.setId(syncDto.salesTxn);
		dao.setSalesTxn(salesDao);
		return dao;
	}

	public List<OrderDao> getOrderDaoList(List<OrderSyncDto> syncList) {
		return syncList.stream().map(sync -> sync.getOrderDao(sync)).collect(Collectors.toList());
	}
}
