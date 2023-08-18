/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.ProductPriceMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ProductPriceMappingSyncDto extends SyncableEntity {

	private String id;

	private Integer fromBand;

	private Integer toBand;

	private BigDecimal fromPrice;

	private BigDecimal toPrice;

	private BigDecimal margin;

	private String productGroup;

	private String correlationId;

	public ProductPriceMappingSyncDto() {

	}

	public ProductPriceMappingSyncDto getProductPriceMappingSyncDto(ProductPriceMappingDao productPriceMappingDao) {
		ProductPriceMappingSyncDto productPriceMappingSyncDto = (ProductPriceMappingSyncDto) MapperUtil
				.getObjectMapping(productPriceMappingDao, this);
		productPriceMappingSyncDto.setProductGroup(productPriceMappingDao.getProductGroup().getProductGroupCode());
		return productPriceMappingSyncDto;
	}

	public List<ProductPriceMappingSyncDto> getSyncDtoList(List<ProductPriceMappingDao> daoList) {
		List<ProductPriceMappingSyncDto> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ProductPriceMappingSyncDto syncDto = new ProductPriceMappingSyncDto();
			syncDtoList.add(syncDto.getProductPriceMappingSyncDto(dao));
		});
		return syncDtoList;
	}

	public ProductPriceMappingDao getProductPriceDao(ProductPriceMappingSyncDto productGroupSyncDto) {
		ProductPriceMappingDao productPriceMappingDao = new ProductPriceMappingDao();
		productPriceMappingDao = (ProductPriceMappingDao) MapperUtil.getObjectMapping(productGroupSyncDto,
				productPriceMappingDao);

		if (productGroupSyncDto.getProductGroup() != null) {
			ProductGroupDao productGroupDao = new ProductGroupDao();
			productGroupDao.setProductGroupCode(productGroupSyncDto.getProductGroup());
			productPriceMappingDao.setProductGroup(productGroupDao);
		} else {
			productPriceMappingDao.setProductGroup(null);
		}
		return productPriceMappingDao;
	}

	public List<ProductPriceMappingDao> getDaoList(List<ProductPriceMappingSyncDto> syncDtoList) {
		List<ProductPriceMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ProductPriceMappingSyncDto dto = new ProductPriceMappingSyncDto();
			daoList.add(dto.getProductPriceDao(syncDto));
		});

		return daoList;
	}

}
