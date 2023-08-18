/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dao.base;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.core.dao.TimeSyncableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/*
* The persistent class baseUserLogin for the user_login database table.
*/
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BaseUserLogin extends TimeSyncableEntity {

	@Id
	@Column(name = "user_name", unique = true, nullable = false, length = 50)
	private String userName;

	@JsonIgnore
	@Column(name = "password", columnDefinition = "NVARCHAR")
	private String password;

	@Column(name = "failed_attempts")
	private Integer failedAttempts;

	@Column(name = "salt", length = 20)
	private String salt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "password_changed_date", nullable = true, length = 23)
	private Date passwordChangedDate;

	@Column(name = "is_locked", nullable = false)
	private Boolean isLocked;

	@Column(name = "is_login_active", nullable = false)
	private Boolean isLoginActive;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "last_login_date", nullable = true, length = 23)
	private Date lastLoginDate;

	@Column(name = "password_history", columnDefinition = "NVARCHAR")
	private String passwordHistory;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "last_modified_by")
	private String lastModifiedBy;

}
