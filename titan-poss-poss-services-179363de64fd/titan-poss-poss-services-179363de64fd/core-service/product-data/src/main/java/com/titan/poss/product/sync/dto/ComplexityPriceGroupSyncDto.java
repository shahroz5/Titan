/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ComplexityPriceGroupDao;
import com.titan.poss.product.dao.PriceGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ComplexityPriceGroupSyncDto extends MasterSyncableEntity  {

	private String id;

	private String complexityCode;

	private String priceGroup;

	private BigDecimal makingChargePunit;

	private BigDecimal makingChargePgram;

	private BigDecimal wastagePct;

	private BigDecimal makingChargePct;
	
	private String currencyCode;
	
	public ComplexityPriceGroupSyncDto getComplexityPriceGroupSyncDto(ComplexityPriceGroupDao ComplexityPriceGroupDao) {
		ComplexityPriceGroupSyncDto ComplexityPriceGroupSyncDto = (ComplexityPriceGroupSyncDto) MapperUtil
				.getObjectMapping(ComplexityPriceGroupDao, this);
		ComplexityPriceGroupSyncDto.setPriceGroup(ComplexityPriceGroupDao.getPriceGroup().getPriceGroup());
		ComplexityPriceGroupSyncDto.setComplexityCode(ComplexityPriceGroupDao.getComplexity().getComplexityCode());
		return ComplexityPriceGroupSyncDto;
	}
	
	public ComplexityPriceGroupDao getComplexityPriceGroupDao(ComplexityPriceGroupSyncDto syncDto) {
		ComplexityPriceGroupDao complexityPriceGroupDao = (ComplexityPriceGroupDao) MapperUtil.getObjectMapping(syncDto, new ComplexityPriceGroupDao());
		
		ComplexityDao complexityDao = new ComplexityDao();
		complexityDao.setComplexityCode(syncDto.getComplexityCode());
		
		PriceGroupDao priceGroupDao = new PriceGroupDao();
		priceGroupDao.setPriceGroup(syncDto.getPriceGroup());
		
		complexityPriceGroupDao.setPriceGroup(priceGroupDao);
		
		complexityPriceGroupDao.setComplexity(complexityDao);
		
		return complexityPriceGroupDao;
	}
	
	public List<ComplexityPriceGroupDao> getDao(List<ComplexityPriceGroupSyncDto> syncDtoList){
		List<ComplexityPriceGroupDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ComplexityPriceGroupSyncDto dto = new ComplexityPriceGroupSyncDto();			
			daoList.add(dto.getComplexityPriceGroupDao(syncDto));
		});
		
		return daoList;
	}
	
	public List<ComplexityPriceGroupSyncDto> getSyncDtoList(List<ComplexityPriceGroupDao> syncDtoList){
		List<ComplexityPriceGroupSyncDto> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ComplexityPriceGroupSyncDto dto = new ComplexityPriceGroupSyncDto();			
			daoList.add(dto.getComplexityPriceGroupSyncDto(syncDto));
		});
		
		return daoList;
	}
	
}
