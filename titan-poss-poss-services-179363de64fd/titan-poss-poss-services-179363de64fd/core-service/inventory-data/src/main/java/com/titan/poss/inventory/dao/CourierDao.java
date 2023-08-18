/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "courier_master")
@EqualsAndHashCode(callSuper = false)
public class CourierDao extends MasterAuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "courier_name")
	private String courierName;

	@Column(name = "address")
	private String address;

	@Column(name = "country_code")
	private String countryCode;

	@Column(name = "state_name")
	private String stateName;

	@Column(name = "town_name")
	private String townName;

	@Column(name = "mail_id")
	private String mailId;

	@Column(name = "phone_number")
	private String phoneNumber;

	@Column(name = "mobile_number")
	private String mobileNumber;

	@Column(name = "contact_person")
	private String contactPerson;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;
}
