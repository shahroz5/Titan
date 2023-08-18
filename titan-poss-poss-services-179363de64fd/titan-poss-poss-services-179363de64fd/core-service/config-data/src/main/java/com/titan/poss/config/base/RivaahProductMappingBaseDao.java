/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

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
public class RivaahProductMappingBaseDao extends SyncableEntity {

	@Column(name = "product_group_code")
	private String productGroupCode;

}
