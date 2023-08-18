/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "rule_metadata")
@EqualsAndHashCode(callSuper = false)
public class RuleMetadataDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "rule_type")
	private String ruleType;

	@Column(name = "rule_id")
	private Integer ruleId;

	@Column(name = "rule_group")
	private String ruleGroup;

	@Column(name = "product_group_mapping", columnDefinition = "BIT")
	private Boolean productGroupMapping;

	@Column(name = "product_category_mapping", columnDefinition = "BIT")
	private Boolean productCategoryMapping;

	@Column(name = "location_mapping", columnDefinition = "BIT")
	private Boolean locationMapping;

	@Column(name = "range_mapping", columnDefinition = "BIT")
	private Boolean rangeMapping;

	@Column(name = "product_level_value", columnDefinition = "BIT")
	private Boolean productLevelValue;

	@Column(name = "market_mapping", columnDefinition = "BIT")
	private Boolean marketMapping;

	@Column(name = "header_level_value", columnDefinition = "BIT")
	private Boolean headerLevelValue;

	@Column(name = "range_level_value", columnDefinition = "BIT")
	private Boolean rangeLevelValue;

	@Column(name = "org_code")
	private String orgCode;

	public RuleMetadataDao() {
		// Empty Constructor
	}

}
