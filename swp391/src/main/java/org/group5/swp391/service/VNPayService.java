package org.group5.swp391.service;

import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface VNPayService {
    String createPayment(HttpServletRequest request, double amount, String subscriptionPlanId) throws UnsupportedEncodingException;

    Map<String, Object> queryPayment(String vnp_TxnRef, String vnp_TransDate, HttpServletRequest req);
}
