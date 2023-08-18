/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.intg.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>scheduler_master</b> table.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "scheduler_master")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SchedulerMasterDao extends AuditableEntity implements java.io.Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	@Id
	private String code;

	@Column(name = "cron_expression", nullable = false)
	private String cronExpression;

	@Column(name = "type", nullable = false)
	private String type;
	
	@Column(name = "is_active", nullable = false)
	private boolean isActive;
	
	@Column(name = "scheduler_gap", nullable = false)
	private Integer schedulerGap;
	
	@Column(name = "description", nullable = false)
	private String description;

}
