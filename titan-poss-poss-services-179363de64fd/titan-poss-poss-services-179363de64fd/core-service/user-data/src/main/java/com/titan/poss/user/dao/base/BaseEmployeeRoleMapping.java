/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dao.base;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.SyncTimeDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/*
* The persistent class BaseRoleMaster for the role_master database table.
*/
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class BaseEmployeeRoleMapping extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	@Column(name = "is_primary", nullable = false)
	private Boolean isPrimary;

	@Column(name = "start_date")
	@Temporal(TemporalType.DATE)
	private Date startDate;

	@Column(name = "expiry_date")
	@Temporal(TemporalType.DATE)
	private Date expiryDate;
}
