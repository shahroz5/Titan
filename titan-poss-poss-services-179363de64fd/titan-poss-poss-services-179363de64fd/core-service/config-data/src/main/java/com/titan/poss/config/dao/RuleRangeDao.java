/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.config.base.RuleRangeBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "rule_range_mapping")
@EqualsAndHashCode(callSuper = false)
public class RuleRangeDao extends RuleRangeBaseDao {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne
	@JoinColumn(name = "range_id")
	private RangeMasterDao rangeId;

}
