/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.user.dao;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;

import com.titan.poss.user.dao.base.BaseAcl;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>acl_master</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity(name = "UserAcl")
@Table(name = "acl_master")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE acl_master SET is_active = 0 WHERE role_code = ?")
@ToString(callSuper = true)
public class AclDao extends BaseAcl implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

}
