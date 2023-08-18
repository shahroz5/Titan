/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.titan.poss.core.dao.TimeAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "datasync_audit")
@EntityListeners(AuditingEntityListener.class)
@IdClass(DatasyncId.class)
public class DatasyncAuditDao extends TimeAuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Id
	private String destination; // Boutique code / EPOSS

	private String source;

	@Column(columnDefinition = "NVARCHAR")
	private String data;

	@Column(name = "operation_code")
	private String operation;

	@Column(name = "dataflow_direction")
	private String dataflowDirection; // IN or OUT

	@Column(name = "message_ref_id")
	private String messageRefId; // SNS Message ID

	private String status;

	@Column(name = "is_notified")
	private Boolean isNotified = false;

	@Column(name = "message_type")
	private String messageType;

	@Column(name = "exception")
	private String exception;

	@CreatedBy
	@Column(name = "created_by")
	private String createdBy;

	@LastModifiedBy
	@Column(name = "last_modified_by")
	private String lastModifiedBy;
	
	@Column(name="sync_time")
	private Long syncTime;
	
	@Column(name="retry_count")
	private Integer retryCount;
	
	@PrePersist
	private void onPrePersist() {
		if(this.syncTime==null) {
			this.syncTime=new Date().getTime();
		}
		if(this.retryCount==null) {
			this.retryCount=0;
		}
	}

}
