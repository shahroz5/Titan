/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.auth.dao;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.titan.poss.user.dao.base.BaseRole;

import lombok.Data;
import lombok.EqualsAndHashCode;

/*
* The persistent class for the role_master database table.
*/

@Data
@Entity(name = "AuthRole")
@Table(name = "role_master")
@EqualsAndHashCode(callSuper = false)
public class RoleDao extends BaseRole implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
}
