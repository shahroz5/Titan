/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.workflow.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name="workflow_task")
@EqualsAndHashCode(callSuper=false)
@ToString(callSuper = true)
public class WorkflowTaskDao extends AuditableEntity implements java.io.Serializable {
		
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="task_id", columnDefinition = "uniqueidentifier", nullable = false)
	private String taskId;
	
	@Column(name="process_id", columnDefinition = "uniqueidentifier", nullable = false)
	private String processId;
	
	@Column(name = "task_status", columnDefinition="NVARCHAR(25)", nullable = false)
	private String taskStatus;
	
	@Column(name = "level", nullable = true)
	private Integer level;
	
	@Column(name = "approver_role_code", columnDefinition="NVARCHAR(255)", nullable = false)
	private String approverRoleCode;

	@Column(name = "approver_user_name", columnDefinition="NVARCHAR(50)", nullable = true)
	private String approverUserName;
	
	@Column(name = "approver_remarks", columnDefinition = "NVARCHAR(300)", nullable = true)
	private String approverRemarks;
	
	@Column(name = "approved_data", columnDefinition="NVARCHAR", nullable = true)
	private String approvedData;
	
	@Column(name = "task_name", columnDefinition="NVARCHAR(50)", nullable = true)
	private String taskName;
	
	@Column(name = "workflow_type", columnDefinition="NVARCHAR(50)", nullable = true)
	private String workflowType;
	
	@Column(name = "approval_level", nullable = true)
	private Integer approvalLevel;
	
	@Column(name = "filter_params", columnDefinition="NVARCHAR(4000)", nullable = true)
	private String filterParams;
	
	@Column(name = "approver_code", columnDefinition="NVARCHAR(255)", nullable = true)
	private String approverCode;
	
}
