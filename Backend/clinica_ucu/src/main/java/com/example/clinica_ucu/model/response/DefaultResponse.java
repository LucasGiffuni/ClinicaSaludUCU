package com.example.clinica_ucu.model.response;

public class DefaultResponse {

    DefaultResponseData Response;

    public DefaultResponseData getDefaultResponse() {
        return Response;
    }

    public void setDefaultResponse(String code, String message) {
        DefaultResponseData df = new DefaultResponseData();
        df.setCode(code);
        df.setMessage(message);
        this.Response = df;
    }

}
