/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncTimeDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.MaterialDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@MappedSuperclass
public class ItemMaterialMappingBaseDao extends MasterSyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_code", referencedColumnName = "item_code")
	private ItemDao item;

	@Column(name = "material_code")
	private String material;

	@Column(name = "no_of_materials", columnDefinition = "decimal")
	private BigDecimal noOfMaterials;

}
