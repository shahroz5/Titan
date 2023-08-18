/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.ProductPriceMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ProductPriceMappingIngestionProcessor implements ItemProcessor<ProductPriceMappingDto, ProductPriceMappingDto> {

	@Override
	public ProductPriceMappingDto process(ProductPriceMappingDto item) throws Exception {
		item.setId(item.getId());
		item.setProductGroupCode(item.getProductGroupCode());
		item.setFromBand(item.getFromBand());
		item.setToBand(item.getToBand());
		item.setFromPrice(item.getFromPrice());
		item.setToPrice(item.getToPrice());
		item.setMargin(item.getMargin());
		item.setCreatedBy(item.getCreatedBy());
		item.setCreatedDate(item.getCreatedDate());
		item.setLastModifiedBy(item.getLastModifiedBy());
		item.setLastModifiedDate(item.getLastModifiedDate());
		item.setSrcSyncId(0);
		item.setDestSyncId(0);
		return item;
	}

}
