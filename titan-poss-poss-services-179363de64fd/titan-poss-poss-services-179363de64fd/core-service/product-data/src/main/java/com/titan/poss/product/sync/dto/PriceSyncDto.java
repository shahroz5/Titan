/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.dao.PriceGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PriceSyncDto extends MasterSyncableEntity {

	private String id;

	private String item;

	private String priceGroup;

	private BigDecimal makingCharge;
	
	private String correlationId;
	
	public PriceDao getPriceDao(PriceSyncDto syncDto) {
		PriceDao priceDao = (PriceDao) MapperUtil.getObjectMapping(syncDto, new PriceDao());
		
		PriceGroupDao priceGroupDao = new PriceGroupDao();
		priceGroupDao.setPriceGroup(syncDto.getPriceGroup());
		
		priceDao.setPriceGroup(priceGroupDao);
		
		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(syncDto.getItem());
		
		priceDao.setItem(itemDao); 
		
		return priceDao;
	}
	
	public List<PriceDao> getDao(List<PriceSyncDto> syncDtoList){
		List<PriceDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			PriceSyncDto dto = new PriceSyncDto();			
			daoList.add(dto.getPriceDao(syncDto));
		});
		
		return daoList;
	}
	
}
