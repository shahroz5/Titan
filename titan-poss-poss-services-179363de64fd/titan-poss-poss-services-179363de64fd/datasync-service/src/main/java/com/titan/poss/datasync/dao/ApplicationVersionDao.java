/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.joda.time.DateTime;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "application_version")
@EqualsAndHashCode(callSuper = false)
public class ApplicationVersionDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "poss_ui_version")
	private String possUiVersion;

	//    @Column(name = "eposs_ui_version")
	//    private String epossUiVersion;

	@Column(name = "poss_service_version")
	private String possServiceVersion;

	@Column(name = "database_version")
	private String databaseVersion;

	@Column(name = "status")
	private String status;

	@Column(name = "upgraded_on")
	private Date upgradedOn;

	@Column(name = "jars_version")
	private String jarsVersion;

	@Column(name = "reference_id")
	private String referenceId;

	//    @Column(name = "is_published")
	//    private boolean isPublished;

	//    @Column(name = "download_url")
	//    private String downloadUrl;

}
