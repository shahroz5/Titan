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

import com.titan.poss.file.dto.PayerBankDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PayerBankJobStagingWriter implements ItemWriter<PayerBankDto>{

@Autowired
private DataSource dataSource;

@Autowired
private PayerBankJobWriter payerBankJobWriter;

@Override
public void write(List<? extends PayerBankDto> items) throws Exception {
	List<PayerBankDto> list = new ArrayList<>();
	items.stream().forEach(item -> {
		if (item != null) {
			list.add(item);
		}
	});
	payerBankJobWriter.payerBankStagingWriter(dataSource).write(list);
}
}
