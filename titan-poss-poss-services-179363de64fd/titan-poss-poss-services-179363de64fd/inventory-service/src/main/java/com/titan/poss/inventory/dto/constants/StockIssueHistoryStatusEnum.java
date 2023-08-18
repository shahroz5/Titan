/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum StockIssueHistoryStatusEnum {

	ISSUED, ACPT_REJECTED, APVL_REJECTED, ISSUE_REJECTED, CANCELLED, EXPIRED, CLOSED, REQUESTED, APVL_PENDING,
	ACKNOWLEDGE_PENDING, PUBLISHED;

	public static List<String> getAllStatus() {
		List<String> strList = new ArrayList<>();
		strList.add(StockIssueHistoryStatusEnum.ISSUED.toString());
		strList.add(StockIssueHistoryStatusEnum.ACPT_REJECTED.toString());
		strList.add(StockIssueHistoryStatusEnum.APVL_REJECTED.toString());
		strList.add(StockIssueHistoryStatusEnum.ISSUE_REJECTED.toString());
		strList.add(StockIssueHistoryStatusEnum.CANCELLED.toString());
		strList.add(StockIssueHistoryStatusEnum.EXPIRED.toString());
		strList.add(StockIssueHistoryStatusEnum.CLOSED.toString());
		strList.add(StockIssueHistoryStatusEnum.REQUESTED.toString());
		strList.add(StockIssueHistoryStatusEnum.APVL_PENDING.toString());
		strList.add(StockIssueHistoryStatusEnum.ACKNOWLEDGE_PENDING.toString());
		strList.add(StockIssueHistoryStatusEnum.PUBLISHED.toString());
		return strList;
	}

}
