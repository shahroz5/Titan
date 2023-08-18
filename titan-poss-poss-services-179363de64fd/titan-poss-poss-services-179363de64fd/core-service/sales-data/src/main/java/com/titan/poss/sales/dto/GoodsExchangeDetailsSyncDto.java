/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.GoodsExchangeDao;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GoodsExchangeDetailsSyncDto extends SyncableEntity {

	private String metalType;

	private String itemType;

	private BigDecimal unitWeight;

	private BigDecimal purity;

	private BigDecimal unitValue;

	private String itemCode;

	private String binCode;

	private String lotNumber;

	private String taxDetails;

	private BigDecimal totalTax;

	private String inventoryId;

	private String priceDetails;

	private Short quantity;

	private Integer rowId;

	private BigDecimal totalWeight;

	private BigDecimal karat;

	private String preMeltingDetails;

	private BigDecimal totalValue;

	private BigDecimal finalValue;

	private String discountDetails;

	private String itemDetails;
	
	private String id;

	private String goodsExchange;

	private String cashMemoDetails;
	
	private BigDecimal valueOnRefund;
	
	public GoodsExchangeDetailsDao getGoodsExchangeDetailsDao(GoodsExchangeDetailsSyncDto syncDto) {
		GoodsExchangeDetailsDao gepDetails=(GoodsExchangeDetailsDao)MapperUtil.getObjectMapping(syncDto,new GoodsExchangeDetailsDao());
		if(syncDto.getGoodsExchange()!=null) {
			GoodsExchangeDao goodsDao=new GoodsExchangeDao();
			goodsDao.setId(syncDto.getGoodsExchange());
			gepDetails.setGoodsExchange(goodsDao);
		}
		if(syncDto.getCashMemoDetails()!=null) {
			CashMemoDetailsDao cmDetails=new CashMemoDetailsDao();
			cmDetails.setId(syncDto.getCashMemoDetails());
			gepDetails.setCashMemoDetails(cmDetails);
		}
		return gepDetails;
	}
	
	public List<GoodsExchangeDetailsDao> getGoodsExchangeDetailsDaoList(List<GoodsExchangeDetailsSyncDto> syncList){
		return syncList.stream().map(sync->sync.getGoodsExchangeDetailsDao(sync)).collect(Collectors.toList());
	}
}
