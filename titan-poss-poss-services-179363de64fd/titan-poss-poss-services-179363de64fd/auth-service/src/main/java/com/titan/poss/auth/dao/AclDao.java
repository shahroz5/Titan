/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.dao;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.titan.poss.user.dao.base.BaseAcl;

import lombok.Data;
import lombok.EqualsAndHashCode;

/*
* The persistent class for the acl_master database table.
*/

@Data
@Entity(name = "AuthAclMaster")
@Table(name = "acl_master")
@EqualsAndHashCode(callSuper = false)
public class AclDao extends BaseAcl implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

}
