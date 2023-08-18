/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.integration.intg.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>notification_master</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "notification_master")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE notification_master SET is_active = 0 WHERE id = ?")
@ToString(callSuper = true)
public class Notification extends MasterAuditableEntity implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", unique = true, nullable = false, length = 10)
	private Integer id;

	@Column(name = "notification_type", unique = true, nullable = false, length = 20)
	private String notificationType;

	@Column(name = "is_email_required", nullable = false)
	private Boolean isEmailRequired;

	@Column(name = "is_sms_required", nullable = false)
	private Boolean isSMSRequired;

	@Column(name = "sms_content", columnDefinition = "NVARCHAR", nullable = true, length = 100)
	private String smsContent;

	@Column(name = "email_template_name", nullable = true, length = 40)
	private String emailTemplateName;

}
