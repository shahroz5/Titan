/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.user.notification.dao;

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
@Table(name = "notification_master")
@EqualsAndHashCode(callSuper = false)
public class NotificationDao extends MasterAuditableEntity {

	@Id
	@Column(name = "code")
	private String code;

	@Column(name = "message")
	private String message;

}
