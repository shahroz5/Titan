/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.config.base.RuleMarketMappingBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "rule_market_mapping")
@EqualsAndHashCode(callSuper = false)
public class RuleMarketMappingDao extends RuleMarketMappingBaseDao {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

}
