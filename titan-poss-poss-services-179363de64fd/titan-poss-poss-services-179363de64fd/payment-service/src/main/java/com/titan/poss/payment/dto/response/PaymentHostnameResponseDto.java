/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class PaymentHostnameResponseDto {

	private String id;
	private String locationCode;
	private String hostName;
	private String deviceId;
	private String paymentCode;
	private Boolean isActive;
	private Date createdDate;
}
