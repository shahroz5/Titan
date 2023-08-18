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
@Table(name = "user_saved_queries")
@EqualsAndHashCode(callSuper = false)
public class UserSavedQueriesDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "saved_query", columnDefinition = "nvarchar")
	private String savedQuery;

	@Column(name = "query_name")
	private String queryName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "report_master_id")
	private ReportMasterDao reportMaster;

}
