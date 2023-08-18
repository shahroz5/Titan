package com.titan.poss.workflow.camundabpm;

import java.util.Map;

import lombok.Data;

@Data
public class EmailDto {		
    private String to;
    private String subject;
    private Map<String, Object> model;
}
