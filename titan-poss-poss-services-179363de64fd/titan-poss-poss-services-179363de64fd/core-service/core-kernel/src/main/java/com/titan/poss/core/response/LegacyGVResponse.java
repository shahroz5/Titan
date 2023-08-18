/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.response;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LegacyGVResponse {

	private String itemCode;

	private BigInteger serialNo;

	private String issuedTo;

	private String region;

	private String customerName;

	private String customerType;

	private BigDecimal denomination;

	private Integer quantity;

	private BigDecimal value;

	private Integer status;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date redeemedOn;

	private String redeemedAt;

	private String docType;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date validFrom;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date validTill;

	private String openedFor;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date createdDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date lastModifiedDate;

	private String loginId;

	private String lastModifiedId;

	private String locationCode;

	private BigDecimal discount;

	private String remark;

	private String excludes;

	private BigDecimal discountPercentage;

	private Integer validityDays;

}
