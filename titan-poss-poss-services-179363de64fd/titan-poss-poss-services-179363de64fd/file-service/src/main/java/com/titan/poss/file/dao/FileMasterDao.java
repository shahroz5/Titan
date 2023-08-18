/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.file.dao;

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
 * DAO for <b>file_audit</b> table.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "file_master")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class FileMasterDao extends AuditableEntity implements java.io.Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;

	@Column(name = "file_group")
	private String fileGroup;
	
	@Column(name = "file_name")
	private String fileName;

	@Column(name = "job_name")
	private String jobName;

	@Column(name = "file_prefix")
	private String filePrefix;
	
	@Column(name = "file_extension")
	private String fileExtension;

	@Column(name = "file_type")
	private String fileType;

	@Column(name = "export_import")
	private String exportImport;

	@Column(name = "is_encrypted")
	private Boolean isEncrypted;
	
	@Column(name = "sync_upload")
	private Boolean syncUpload;
	
	@Column(name = "reset_sequence_no")
	private Boolean resetSequenceNo;
	
	@Column(name = "email_ids")
	private String emailIds;
	
	@Column(name = "retry_limit")
	private Integer retryLimit;

}
