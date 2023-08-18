/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.util.List;

import com.titan.poss.sales.dto.DocNoFailAuditDto;

/**
 * Thread Local to maintain doc number fail details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class DocNoFailAuditThreadLocal {

	private DocNoFailAuditThreadLocal() {

	}

	private static final ThreadLocal<List<DocNoFailAuditDto>> docNoFailData = new ThreadLocal<>();

	/*
	 * To add the next data to the existing list, if we use set method it will
	 * updates the existing value every time, so first getting the existing values
	 * and adding to the list
	 */
	public static void setDocNoFailData(DocNoFailAuditDto data) {
		docNoFailData.get().add(data);
	}

	/*
	 * To add the data to the list before having called
	 * setDocNoFailData(DocNoFailAuditDto data) as initially it will give null
	 * pointer exception
	 * 
	 */
	public static void setIntialDocNoFailData(List<DocNoFailAuditDto> data) {
		docNoFailData.set(data);
	}

	// To read the value stored in a ThreadLocal
	public static List<DocNoFailAuditDto> getDocNoFailData() {
		return docNoFailData.get();
	}

	// To remove the value stored in a ThreadLocal
	public static void unsetDocNoFailData() {
		docNoFailData.remove();
	}
}
