package org.group5.swp391.service;

import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;

public interface VNPayService {
    String createPayment(HttpServletRequest request, double amount, String subscriptionPlanId) throws UnsupportedEncodingException;

    String queryPayment(String vnp_TxnRef, String vnp_TransDate, HttpServletRequest req);
}
