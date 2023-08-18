/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GiftDetailsResponseDto {

	private BigInteger serialNo;

	private String giftCode;

	private String regionCode;

	private BigDecimal denomination;

	private Integer quantity;

	private BigDecimal totalValue;

	private String status;

	private Date mfgDate;

	private String locationCode;

	private Integer validityDays;

	private Date activationDate;

	private Date validFrom;

	private Date validTill;

	private GiftDetailsDto giftDetails;
	
	private GiftVoucherRedeemDetailsDto giftVoucherRedeemDetails;

	private String remarks;

	private List<String> excludes;

	private String indentNo;

	private String extendCount;
	
	private String createdBy;
	
	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private String fileAuditId;


}
