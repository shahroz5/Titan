/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncableEntity;

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
public class RangeMasterBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "from_range", columnDefinition = "DECIMAL")
	private BigDecimal fromRange;

	@Column(name = "to_range", columnDefinition = "DECIMAL")
	private BigDecimal toRange;

	@Column(name = "range_type")
	private String rangeType;

	@Column(name = "row_id")
	private Integer rowId;
}
