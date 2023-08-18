/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.intg.dao;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>scheduler_history</b> table.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "scheduler_history")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SchedulerHistoryDao extends AuditableEntity implements java.io.Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;

	@Column(name = "code", nullable = false)
	private String code;

	@Column(name = "last_run_time", nullable = false)
	private Date lastRunTime;

	@Column(name = "next_run_time", nullable = false)
	private Date nextRunTime;

	@Column(name = "businessDate", nullable = true)
	private Date businessDate;

	@Column(name = "location_code", nullable = true)
	private String locationCode;

	@Column(name = "status", nullable = false)
	private String status;

	@Column(name = "manual_job")
	private Boolean manualJob;
}
