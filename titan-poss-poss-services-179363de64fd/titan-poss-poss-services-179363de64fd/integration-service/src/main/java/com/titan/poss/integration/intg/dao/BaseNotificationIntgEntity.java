/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.intg.dao;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.integration.dao.VendorDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The persistent class baseUserLogin for the user_login database table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BaseNotificationIntgEntity extends AuditableEntity {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "req_values", columnDefinition = "NVARCHAR", nullable = false, length = 200)
	private String reqValues;

	@Column(name = "status", nullable = false)
	private Boolean status;

	@Column(name = "vendor_details", columnDefinition = "NVARCHAR", nullable = false, length = 100)
	private String vendorDetails;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "vendor_code", nullable = false)
	private VendorDao vendor;

	@Column(name = "response", columnDefinition = "NVARCHAR", nullable = true, length = 4000)
	private String response;

	@Column(name = "location_code", nullable = false)
	private String locationCode;

	@Column(name = "http_status", nullable = false)
	private Short httpStatus;

	@Column(name = "response_time")
	private long responseTime;

}
