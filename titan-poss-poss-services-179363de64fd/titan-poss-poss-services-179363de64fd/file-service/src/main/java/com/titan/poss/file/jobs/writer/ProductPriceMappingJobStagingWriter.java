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

import com.titan.poss.file.dto.ProductPriceMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ProductPriceMappingJobStagingWriter implements ItemWriter<ProductPriceMappingDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private ProductPriceMappingJobWriter productPriceMappingMappingJobWriter;

	@Override
	public void write(List<? extends ProductPriceMappingDto> items) throws Exception {
		List<ProductPriceMappingDto> list = new ArrayList<>();
		items.stream().forEach(item -> {
			if (item != null) {
				list.add(item);
			}
		});
		productPriceMappingMappingJobWriter.productPriceMappingStagingWriter(dataSource).write(list);
	}
}
