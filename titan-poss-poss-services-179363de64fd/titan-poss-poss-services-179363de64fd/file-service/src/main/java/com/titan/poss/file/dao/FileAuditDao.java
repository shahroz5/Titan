/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.file.dao;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>file_audit</b> table.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "file_audit")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class FileAuditDao implements java.io.Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "file_id", columnDefinition = "uniqueidentifier", updatable = false)
	private String fileId;

	@OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.MERGE)
	@JoinColumn(name = "file_master_id", nullable = false)
	private FileMasterDao fileMaster;

	@Column(name = "file_path")
	private String filePath;

	@Column(name = "file_server")
	private String fileServer;

	@Column(name = "file_name", nullable = false)
	private String fileName;

	@Column(name = "sequence_no")
	private Integer sequenceNo;

	@Column(name = "processed_date")
	private Date processedDate;

	@Column(name = "success_count")
	private Integer successCount;

	@Column(name = "failure_count")
	private Integer failureCount;

	@Column(name = "total_count")
	private Integer totalCount;

	@Column(name = "status")
	private String status;

	@Column(name = "start_time")
	private Date startTime;

	@Column(name = "end_time")
	private Date endTime;

	@Column(name = "error_log_file_path")
	private String errorLogFilePath;

	@Column(name = "manual_job")
	private Boolean manualJob;

	@Column(name = "total_time")
	private Long totalTime;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "warning_count")
	private Integer warningCount;

	@Column(name = "remarks")
	private String remarks;

}
