/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.titan.poss.config.dao.RangeMasterDao;
import com.titan.poss.config.dao.RuleMasterDao;
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
public class RuleProductBaseDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rule_type", referencedColumnName = "rule_type")
	@JoinColumn(name = "rule_id", referencedColumnName = "rule_id")
	public RuleMasterDao ruleMasterDao;

	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "product_category_code")
	private String productCategoryCode;

	@Column(name = "field_details", columnDefinition = "NVARCHAR")
	private String fieldDetails;

	@ManyToOne
	@JoinColumn(name = "range_id")
	private RangeMasterDao rangeId;
}
