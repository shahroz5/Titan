/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "report_fields_role_mapping")
@EqualsAndHashCode(callSuper = false)
public class ReportFieldsRoleMappingDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "report_field_id")
	private ReportFieldsDao reportField;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "report_master_id")
	private ReportMasterDao reportMaster;

	@Column(name = "role_code")
	private String roleCode;

	@Column(name = "is_excluded")
	private Boolean isExcluded;

	@Column(name = "is_masked")
	private Boolean isMasked;
}
