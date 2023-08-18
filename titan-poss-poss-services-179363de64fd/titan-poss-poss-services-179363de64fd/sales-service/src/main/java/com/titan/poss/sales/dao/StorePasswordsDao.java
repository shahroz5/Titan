/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;
import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO class for password details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "store_passwords")
@EqualsAndHashCode(callSuper = false)
public class StorePasswordsDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "password")
	private String password;

	//change to date
	@Column(name = "password_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date passwordDate;

	@Column(name = "context_type")
	private String contextType;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "password_details", columnDefinition = "NVARCHAR")
	private String passwordDetails;

}

