/*  
	 * Copyright 2019. Titan Company Limited
	 * All rights reserved.
	 */
package com.titan.poss.location.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


import com.titan.poss.location.base.PincodeBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "pincode_master")
@EqualsAndHashCode(callSuper = false)
public class PincodeDao extends PincodeBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

}
