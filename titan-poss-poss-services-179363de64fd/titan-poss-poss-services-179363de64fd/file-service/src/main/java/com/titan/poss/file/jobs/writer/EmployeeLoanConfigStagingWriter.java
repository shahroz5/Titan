package com.titan.poss.file.jobs.writer;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class EmployeeLoanConfigStagingWriter implements ItemWriter<EmployeeLoanConfigWriterDto>{
	
	@Autowired
	private EmployeeLoanConfigJobWriter employeeLoanConfigWriter;
	
	@Autowired
	private DataSource dataSource;

	@Override
	public void write(List<? extends EmployeeLoanConfigWriterDto> items) throws Exception {
		List<EmployeeLoanConfigWriterDto> list = new ArrayList<>();
		for (EmployeeLoanConfigWriterDto empConfigDto : items) {
			if (empConfigDto != null) {
				list.add(empConfigDto);
			}
		}
		employeeLoanConfigWriter.employeeLoanStagingWriter(dataSource).write(list);		
	}

}
