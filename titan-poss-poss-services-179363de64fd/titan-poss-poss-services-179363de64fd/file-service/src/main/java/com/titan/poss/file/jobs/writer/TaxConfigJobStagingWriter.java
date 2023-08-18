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

import com.titan.poss.file.dto.TaxConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class TaxConfigJobStagingWriter implements ItemWriter<TaxConfigDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private TaxConfigJobWriter taxConfigJobWriter;

	@Override
	public void write(List<? extends TaxConfigDto> items) throws Exception {
		List<TaxConfigDto> list = new ArrayList<>();
		items.stream().forEach(item -> {
			if (item != null) {
				list.add(item);
			}
		});
		taxConfigJobWriter.taxConfigStagingWriter(dataSource).write(list);
	}
}
