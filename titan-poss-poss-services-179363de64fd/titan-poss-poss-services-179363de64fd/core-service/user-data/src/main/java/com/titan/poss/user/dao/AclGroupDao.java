/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dao;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>acl_group_master</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "acl_group_master")
@EqualsAndHashCode(callSuper = false)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class AclGroupDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "acl_group_code")
	private String aclGroupCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_acl_group_code", referencedColumnName = "acl_group_code")
//	@JsonManagedReference
	private AclGroupDao parentAclGroup;

	@Column(name = "is_leaf")
	private Boolean isLeaf;

	@Column(name = "is_corp_can_access")
	private Boolean isCorpCanAccess;

	@Column(name = "access_type", nullable = false)
	private String accessType;

	@Override
	public String toString() {
		return "AclGroupDao [aclGroupCode=" + aclGroupCode + ", description=" + description + ", parentAclGroup="
				+ parentAclGroup + ", isLeaf=" + isLeaf + ", isCorpCanAccess=" + isCorpCanAccess + "]";
	}

}
