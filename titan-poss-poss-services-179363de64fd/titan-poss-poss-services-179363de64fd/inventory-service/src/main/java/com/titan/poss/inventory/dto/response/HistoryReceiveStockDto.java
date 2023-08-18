/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class HistoryReceiveStockDto extends ReceiveStockDto {

	private String remarks;
	private Integer reqDocNo;
	private Date reqDocDate;

}
