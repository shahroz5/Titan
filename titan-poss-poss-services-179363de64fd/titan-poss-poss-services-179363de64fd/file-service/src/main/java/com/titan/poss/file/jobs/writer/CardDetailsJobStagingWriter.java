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

import com.titan.poss.file.dto.CardDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class CardDetailsJobStagingWriter implements ItemWriter<CardDetailsDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private CardDetailsJobWriter cardDetailsJobWriter;
	
	private static final String WILL_BE_INJECTED = null;

	@Override
	public void write(List<? extends CardDetailsDto> items) throws Exception {
		List<CardDetailsDto> list = new ArrayList<>();
		items.stream().forEach(item -> {
			if (item != null) {
				list.add(item);
			}
		});
		cardDetailsJobWriter.cardDetailsStagingWriter(WILL_BE_INJECTED,dataSource).write(list);
	}
}
