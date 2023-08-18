/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
/**
 * The persistent class for the inv_doc_master database table.
 * 
 */
@Data
@Entity
@Table(name = "rule_metadata")
@EqualsAndHashCode(callSuper = false)
public class RuleMetadataDao extends AuditableEntity implements Serializable {

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

	@Column(name = "org_code")
	private String orgCode;

	@Column(name = "product_level_value", columnDefinition = "BIT")
	private Boolean productValueMapping;

	@Column(name = "header_level_value", columnDefinition = "BIT")
	private Boolean headerLevelValue;

	public RuleMetadataDao() {
		// Empty Constructor
	}

}
