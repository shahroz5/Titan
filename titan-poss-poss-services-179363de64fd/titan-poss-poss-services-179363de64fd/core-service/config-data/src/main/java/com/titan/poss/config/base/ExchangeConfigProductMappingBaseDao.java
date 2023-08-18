/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncTimeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigProductMappingBaseDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "percent_value", columnDefinition = "DECIMAL")
	private BigDecimal percentValue;

	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;

	@Column(name = "product_category_code")
	private String productCategoryCode;
}
