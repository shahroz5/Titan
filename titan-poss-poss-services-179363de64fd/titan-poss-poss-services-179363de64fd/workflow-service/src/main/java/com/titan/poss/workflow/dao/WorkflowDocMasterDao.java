/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The persistent class for the workflow_doc_master table.
 *  
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name="workflow_doc_master")
@EqualsAndHashCode(callSuper=false)
public class WorkflowDocMasterDao extends AuditableEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", updatable = false, nullable = false)
	private Integer id;

	@Column(name = "doc_no")
	private Integer docNo;
	
	@Column(name = "location_code")
	private String locationCode;
	
	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "doc_type")
	private String docType;	

	@Column(name = "is_active")
	private Boolean isActive;
	
	public WorkflowDocMasterDao() {
		// Empty Constructor
	}
}
