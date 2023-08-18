/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "product_category_master")
@EqualsAndHashCode(callSuper = false)
public class ProductCategoryDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "product_category_code")
	private String productCategoryCode;
		
	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "org_code")
	private String orgCode;
	
	@Column(name = "hallmark_details", columnDefinition = "NVARCHAR")
	private String hallmarkDetails;

	@Column(name = "hallmark_quantity", columnDefinition = "Integer")
	private Integer hallmarkQuantity;
	
	@Column(name = "is_conversion_allowed")
	private Boolean isConversionEnabled;

}
