/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.GiftDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GiftDetailsSyncDto extends SyncableEntity{

	private String instrumentNo;

	private String binCode;

	private Integer rowId;

	private BigDecimal totalValue;

	private BigDecimal totalTax;

	private String taxDetails;

	private String vendorCode;
	
	private String giftCode;

	private String giftType;

	private BigDecimal finalValue;

	private String referenceDetails;

	private Boolean isGiftActivated;
	
	private String itemId;

	private String cashMemoDao;
	
	public GiftDetailsDao getGiftDetailsDao(GiftDetailsSyncDto syncDto) {
		GiftDetailsDao dao=(GiftDetailsDao)MapperUtil.getObjectMapping(syncDto,new GiftDetailsDao());
		CashMemoDao cshMemoDao=new CashMemoDao();
		cshMemoDao.setId(syncDto.getCashMemoDao());
		dao.setCashMemoDao(cshMemoDao);
		return dao;
	}
	
	public List<GiftDetailsDao> getGiftDetailsDaoList(List<GiftDetailsSyncDto> syncDtoList){
		List<GiftDetailsDao> daoList=new ArrayList<>();
		syncDtoList.forEach(sync->daoList.add(getGiftDetailsDao(sync)));
		return daoList;
	}
}
