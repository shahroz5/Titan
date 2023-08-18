/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.auth.dao;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.TimeAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/*
* The persistent class for the employee_master database table.
*/

@Data
@Entity
@Table(name = "user_session")
@EqualsAndHashCode(callSuper = false)
public class UserSessionDao extends TimeAuditableEntity implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "login_date", nullable = false, length = 23)
	private Date loginDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "logout_date", length = 23)
	private Date logoutDate;

	@Column(name = "token", nullable = false, length = 20)
	private String token;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "expiry_date", nullable = false, length = 23)
	private Date expiryDate;

	@Column(name = "is_active", nullable = false)
	private boolean isActive;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_name", nullable = false)
	private UserLoginDao userLogin;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "last_modified_by")
	private String lastModifiedBy;

	@Column(name = "host_name")
	private String hostName;

	@Override
	public String toString() {
		return "UserSessionDao [id=" + id + ", loginDate=" + loginDate + ", logoutDate=" + logoutDate + ", token="
				+ token + ", expiryDate=" + expiryDate + ", isActive=" + isActive + ", createdBy=" + createdBy
				+ ", lastModifiedBy=" + lastModifiedBy + ", hostName=" + hostName + "]";
	}

}
