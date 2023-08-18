/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto;

import java.util.List;

import com.titan.poss.core.dto.SyncData;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class SyncDataThreadLocal {

	private SyncDataThreadLocal() {

	}

	private static final ThreadLocal<List<SyncData>> syncData = new ThreadLocal<>();

	/*
	 * To add the next data to the existing list, if we use set method it will
	 * updates the existing value every time, so first getting the existing values
	 * and adding to the list
	 */
	public static void setSyncData(SyncData data) {
		syncData.get().add(data);
	}

	/*
	 * To add the first sync data to the list before having called
	 * setSyncData(SyncData data) as initially it will give null pointer exception
	 * 
	 */
	public static void setIntialSyncData(List<SyncData> data) {
		syncData.set(data);
	}

	// To read the value stored in a ThreadLocal
	public static List<SyncData> getSyncData() {
		return syncData.get();
	}

	// To remove the value stored in a ThreadLocal
	public static void unsetSyncData() {
		syncData.remove();
	}
}
