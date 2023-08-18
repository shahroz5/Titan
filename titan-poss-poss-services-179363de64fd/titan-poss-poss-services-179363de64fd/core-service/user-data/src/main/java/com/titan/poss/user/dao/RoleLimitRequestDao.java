/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.user.dao;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DAO for <b>role_limit_request</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "role_limit_request")
@EqualsAndHashCode(callSuper = false)
public class RoleLimitRequestDao extends AuditableEntity implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Integer id;

	@Column(name = "req_doc_no")
	private Integer reqDocNo;

	@Column(name = "req_fiscal_year")
	private Short reqFiscalYear;

	@Column(name = "req_location_code")
	private String reqLocationCode;

	@Column(name = "owner_type")
	private String ownerType;

	@Column(name = "req_doc_date")
	private Date reqDocDate;

	@Column(name = "request_remarks", columnDefinition = "NVARCHAR")
	private String requestRemarks;

	@Column(name = "requester_name")
	private String requesterName;

	@Column(name = "requester_contact_no")
	private String requesterContactNo;

	@Column(name = "status")
	private String status;

	@Column(name = "approved_by")
	private String approvedBy;

	@Column(name = "approval_remarks", columnDefinition = "NVARCHAR")
	private String approvalRemarks;

	@Column(name = "approval_date")
	private Date approvalDate;

	@Column(name = "role_name")
	private String roleName;

	@Column(name = "address", columnDefinition = "NVARCHAR")
	private String address;
}
