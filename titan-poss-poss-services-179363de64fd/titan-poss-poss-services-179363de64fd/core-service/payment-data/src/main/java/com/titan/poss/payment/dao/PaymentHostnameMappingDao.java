/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "payment_hostname_mapping")
@EqualsAndHashCode(callSuper = false)
public class PaymentHostnameMappingDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "host_name")
	private String hostName;

	@Column(name = "device_id")
	private String deviceId;

	@Column(name = "payment_code")
	private String paymentCode;
	
	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;
}
