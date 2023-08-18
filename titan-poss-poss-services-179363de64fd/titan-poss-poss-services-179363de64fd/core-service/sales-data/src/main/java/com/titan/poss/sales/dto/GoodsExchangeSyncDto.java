/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GoodsExchangeDao;
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
public class GoodsExchangeSyncDto extends SyncableEntity{

	private String salesTxn;
	
	private String id;

	private BigDecimal totalValue;

	private BigDecimal finalValue;

	private Short totalQuantity;

	private BigDecimal totalTax;

	private String taxDetails;

	private BigDecimal totalWeight;

	private BigDecimal roundingVariance;

	private String exchangeDetails;

	private Date approvedDate;
	
	private String reason;

	private String refundDetails;

	private String processId;
	
	private String paymentType;
	
	private Boolean isMigrated;
	
	private BigDecimal refundValue;
	
	private String tepExceptionDetails;
	
	private Boolean isOverriding;
	
	public GoodsExchangeDao getGoodsExchangeDao(GoodsExchangeSyncDto goodsSyncDto) {
		GoodsExchangeDao gepDao=(GoodsExchangeDao)MapperUtil.getObjectMapping(goodsSyncDto, new GoodsExchangeDao());
		SalesTxnDao salesTxnDao=new SalesTxnDao();
		if(goodsSyncDto.getId()!=null)
			salesTxnDao.setId(goodsSyncDto.getId());
		return gepDao;
	}
}
