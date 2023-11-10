package com.example.clinica_ucu.model.response;

public class NewFuncionarioResponse {

    DefaultResponse response;
    String message;

    public NewFuncionarioResponse(DefaultResponse response, String message) {
        this.response = response;
        this.message = message;
    }

    public DefaultResponse getResponse() {
        return response;
    }

    public void setResponse(DefaultResponse response) {
        this.response = response;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
