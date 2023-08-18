/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.integration.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>integration_master</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "vendor_master")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE vendor_master SET is_active = 0 WHERE id = ?")
@ToString(callSuper = true)
@JsonIgnoreProperties({ "createdBy", "createdDate", "lastModifiedBy", "lastModifiedDate" })
public class VendorDao extends MasterAuditableEntity implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "vendor_code", unique = true, nullable = false, length = 10)
	private String vendorCode;

	@Column(name = "vendor_type", nullable = false, length = 40)
	private String vendorType;

	@Column(name = "vendor_name", nullable = false, length = 40)
	private String vendorName;

	@Column(name = "web_service_type", nullable = false, length = 10)
	private String webServiceType;

	@Column(name = "base_url", nullable = false, length = 100)
	private String baseurl;

	@Column(name = "port", nullable = false, length = 5)
	private String port;

	@Column(name = "retry_count", nullable = false, length = 5)
	private Integer retryCount;

	@Column(name = "time_out_seconds", nullable = false, length = 5)
	private Integer timeOutSeconds;

	@Column(name = "vendor_details", columnDefinition = "NVARCHAR", nullable = true, length = 200)
	private String vendorDetails;

	@Column(name = "is_active")
	private Boolean isActive;

}
