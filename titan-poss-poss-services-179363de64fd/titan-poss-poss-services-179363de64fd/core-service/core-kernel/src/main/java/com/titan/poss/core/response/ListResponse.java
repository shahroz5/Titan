/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.response;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
public class ListResponse<T> {
	private List<T> results;

	public ListResponse(List<T> results) {
		this.results = results;
	}
}
