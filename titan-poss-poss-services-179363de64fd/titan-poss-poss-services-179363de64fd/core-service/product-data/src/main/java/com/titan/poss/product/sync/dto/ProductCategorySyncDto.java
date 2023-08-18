/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ProductCategoryDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductCategorySyncDto extends MasterSyncableEntity {

	private String productCategoryCode;

	private String description;

	private String orgCode;

	private String hallmarkDetails;

	private Boolean isConversionEnabled;
	private Integer hallmarkQuantity;

	 public ProductCategorySyncDto() {

	    }

	 

	    public ProductCategorySyncDto(ProductCategoryDao productCategoryDao) {
	        MapperUtil.getObjectMapping(productCategoryDao, this);
	    }

	 

	    public ProductCategoryDao getProductCategoryDao(ProductCategorySyncDto productCategorySyncDto) {
	    	ProductCategoryDao productCategoryDao = new ProductCategoryDao();
	        productCategoryDao = (ProductCategoryDao) MapperUtil.getObjectMapping(productCategorySyncDto, productCategoryDao);
	 
	        return productCategoryDao;
	    }
}
