/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class AvailableValues {
	private String itemId;

	private Short minQuantity; // minimum(inv_details_totalquantity,req_details_approved_quantiy)

	private BigDecimal minValue;// minimum(inv_details_totalweight,req_details_requested_Weight)

	private BigDecimal minWeight;// minimum(inv_details_totalvalue,req_details_requeested_value)

	private String inventoryId;

	private Integer headerId;

	private String status;

	private String lastModifiedBy;

	private Date lastModifiedDate;

	private String selectedWeightDetails;
	private BigDecimal stdValue;
	private String taxDetails;
	private String itemCode;


}
