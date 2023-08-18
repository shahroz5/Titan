/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.workflow.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;
/**
 * DAO for <b>workflow_master</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name="workflow_master")
@EqualsAndHashCode(callSuper=false)
@ToString(callSuper = true)
public class WorkflowConfigDao extends MasterAuditableEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="workflow_type", columnDefinition="NVARCHAR(50)", nullable = false)
	private String workflowType; 
	
	@Column(name = "approval_level", nullable = false, length = 10)
	private Integer approvalLevel;
	
	@Column(name = "is_editable", nullable = false)
	private Boolean isEditable;
	
	@Column(name = "process_name", columnDefinition="NVARCHAR(50)", nullable = true)
	private String processName;
}
