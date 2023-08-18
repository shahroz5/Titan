/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.workflow.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import java.io.Serializable;
import java.util.Date;

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
@Table(name="workflow_process")
@EqualsAndHashCode(callSuper=false)
@ToString(callSuper = true)
public class WorkflowProcessDao extends AuditableEntity implements Serializable  {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="process_id", columnDefinition = "uniqueidentifier", nullable = false)
	private String processId;
	
	@Column(name = "workflow_type", columnDefinition="NVARCHAR(50)", nullable = false)
	private String workflowType;

	@Column(name = "process_name", columnDefinition="NVARCHAR(50)", nullable = false)
	private String processName;	
	
	@Column(name = "request_data", columnDefinition="NVARCHAR", nullable = true)
	private String requestData;

	@Column(name = "location_code", columnDefinition="NVARCHAR(50)", nullable = true)
	private String locationCode;

	@Column(name = "requestor_user_name", columnDefinition = "NVARCHAR(50)", nullable = true)
	private String requestorUserName;

	@Column(name = "requestor_remarks", columnDefinition = "NVARCHAR(300)", nullable = true)
	private String requestorRemarks;
	
	@Column(name = "approval_status", columnDefinition = "NVARCHAR(50)", nullable = true)
	private String approvalStatus;
	
	@Column(name = "approval_level", nullable = true)
	private Integer approvalLevel;
	
	@Column(name = "approved_data", columnDefinition="NVARCHAR", nullable = true)
	private String approvedData;
	
	@Column(name = "doc_no", nullable = true)
	private Integer docNo;
	
	@Column(name = "fiscal_year", nullable = true)
	private Short fiscalYear;
	
	@Column(name = "header_data", columnDefinition="NVARCHAR", nullable = true)
	private String headerData;
	
	@Column(name = "filter_values", columnDefinition="NVARCHAR(4000)", nullable = true)
	private String filterValues;
	
	@Column(name = "approver_remarks", columnDefinition="NVARCHAR(300)", nullable = true)
	private String approverRemarks;	
	
	@Column(name = "requestor_code", columnDefinition = "NVARCHAR(255)", nullable = true)
	private String requestorCode;
	
	@Column(name = "approver_name", columnDefinition = "NVARCHAR(255)", nullable = true)
	private String approverName;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "approved_date_time")
	private Date approvedDateTime;
	
	@Column(name = "approver_code", columnDefinition = "NVARCHAR(255)", nullable = true)
	private String approverCode;
	
	@Column(name = "email_content", columnDefinition = "NVARCHAR(2000)", nullable = true)
	private String emailContent;
}
