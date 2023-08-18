/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "StoreSyncStaging")
@Table(name = "sync_staging")
@EqualsAndHashCode(callSuper = false)
public class SyncStaging extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "message", columnDefinition = "NVARCHAR")
	private String message;

	@Column(name = "status", columnDefinition = "NVARCHAR")
	private String status;
}
