/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class DataSyncAuditDtoThreadLocal {

	private DataSyncAuditDtoThreadLocal() {

	}

	private static final ThreadLocal<List<DataSyncAuditDto>> syncData = new ThreadLocal<>();

	/*
	 * To add the next data to the existing list, if we use set method it will
	 * updates the existing value every time, so first getting the existing values
	 * and adding to the list
	 */
	public static void setSyncData(DataSyncAuditDto data) {
		syncData.get().add(data);
	}

	/*
	 * To add the first sync data to the list before having called
	 * setSyncData(SyncData data) as initially it will give null pointer exception
	 * 
	 */
	public static void setIntialSyncData(List<DataSyncAuditDto> data) {
		syncData.set(data);
	}

	// To read the value stored in a ThreadLocal
	public static List<DataSyncAuditDto> getSyncData() {
		return syncData.get();
	}

	// To remove the value stored in a ThreadLocal
	public static void unsetSyncData() {
		syncData.remove();
	}
}
