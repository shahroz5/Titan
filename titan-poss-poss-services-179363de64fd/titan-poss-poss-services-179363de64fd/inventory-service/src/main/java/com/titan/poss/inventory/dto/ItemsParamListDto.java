/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ItemsParamListDto {
	private Integer headerId;

	private String itemCode;

	private String lotNumber;

	private String binGroupCode;

	private String status;

	private String type;

	private String productGroup;

	private List<String> productCategory;

	private String sortParameter;

	private List<String> binCodeList;

	private List<String> productGroupList;

	private List<String> productGroups;
	// Return : srcocation code
	// Purchase : dest. location code
	private String locationCode;

	private List<String> binGroupList;
	
	private Date businessDate;
}
