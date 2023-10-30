package com.example.clinica_ucu.model;

import java.io.Serializable;

public class TokenInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    private final String jwtToken;

    public TokenInfo(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getJwtToken() {
        return this.jwtToken;
    }
}
