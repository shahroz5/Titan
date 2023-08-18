/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dao;

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
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for Decisions ref required for Camunda BPM Diagram Processing
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name="workflow_decisions")
@EqualsAndHashCode(callSuper=false)
@ToString(callSuper = true)
public class WorkflowDecisionsDao extends AuditableEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;
	
	@Column(name = "workflow_type", columnDefinition = "NVARCHAR(100)")
	private String workflowType;

	@Column(name = "level")
	private Integer level;

	@Column(name = "approver_role_code", columnDefinition = "NVARCHAR(500)")
	private String approverRoleCode;
	
	@Column(name = "approver_email", columnDefinition = "NVARCHAR(2000)")
	private String approverEmail;
}
