package com.titan.poss.report.service;

import com.titan.poss.core.auth.domain.AuthUser;

public interface ReportNotificationService{
    void sendReportNotification(String reportId, String reportName, AuthUser securityPrincipal);

}
