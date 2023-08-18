/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class DiscountExcludeItemMappingJobStagingWriter implements ItemWriter<DiscountExcludeItemMappingDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private DiscountExcludeItemMappingJobWriter discountExcludeItemMappingJobWriter;

	@Override
	public void write(List<? extends DiscountExcludeItemMappingDto> items) throws Exception {
		List<DiscountExcludeItemMappingDto> list = new ArrayList<>();
		items.stream().forEach(item -> {
			if (item != null) {
				list.add(item);
			}
		});
		discountExcludeItemMappingJobWriter
				.discountExcludeItemMappingStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED, dataSource)
				.write(list);
	}

}
