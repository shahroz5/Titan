/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The persistent class for the inv_doc_master database table.
 * 
 */
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rule_master")
@EqualsAndHashCode(callSuper = false)
public class RuleMasterDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private RuleIdDao ruleIdDao;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "rule_details", columnDefinition = "NVARCHAR")
	private String ruleDetails;

}
