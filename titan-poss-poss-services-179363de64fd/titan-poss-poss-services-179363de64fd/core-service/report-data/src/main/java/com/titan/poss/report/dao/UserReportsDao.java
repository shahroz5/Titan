/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "user_reports")
@EqualsAndHashCode(callSuper = false)
public class UserReportsDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "file_path")
	private String filePath;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "request_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date requestTime;

	@Column(name = "completion_time")
	private Date completionTime;

	@Column(name = "total_time")
	private Long totalTime;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "report_master_id")
	private ReportMasterDao reportMaster;

	@Column(name = "status")
	private String status;

	@Column(name = "error_message")
	private String errorMessage;

	@Column(name = "search_filters")
	private String searchFilter;

}
