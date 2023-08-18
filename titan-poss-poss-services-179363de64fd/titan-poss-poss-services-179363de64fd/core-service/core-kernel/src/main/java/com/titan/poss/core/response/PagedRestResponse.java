/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.response;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagedRestResponse<T> {
	private T results;
	private int pageNumber;
	private int pageSize;
	private int totalPages;
	private long totalElements;

	public PagedRestResponse(T results, Page<?> page) {
		this.results = results;
		loadFields(page);
	}

	@SuppressWarnings("unchecked")
	public PagedRestResponse(Page<?> page) {
		this.results = (T) page.getContent();
		loadFields(page);
	}

	private void loadFields(Page<?> page) {
		this.pageNumber = page.getNumber();
		this.pageSize = page.getSize();
		this.totalPages = page.getTotalPages();
		this.totalElements = page.getTotalElements();
	}
}
