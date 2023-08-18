/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity(name = "CustomerOtpExt")
@Table(name = "customer_otp")
@EqualsAndHashCode(callSuper = false)
public class CustomerOtpDaoExt extends MasterAuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "customer_id")
	private Integer customerId;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "otp_type")
	private String otpType;

	@Column(name = "otp_token")
	private String otpToken;

	@Column(name = "reference_id")
	private String refId;

	@Column(name = "expiry_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date expiryDate;

	@Column(name = "attempts")
	private Integer attempts;

	@Override
	public String toString() {
		return "CustomerOtpDaoExt [id=" + id + ", customerId=" + customerId + ", locationCode=" + locationCode
				+ ", otpType=" + otpType + ", otpToken=" + otpToken + ", refId=" + refId + "]";
	}

}
