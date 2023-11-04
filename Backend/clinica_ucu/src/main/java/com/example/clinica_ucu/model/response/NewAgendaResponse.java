package com.example.clinica_ucu.model.response;

public class NewAgendaResponse {
    DefaultResponse Response;
    String message;

    public NewAgendaResponse(DefaultResponse response, String message) {
        Response = response;
        this.message = message;
    }

    public DefaultResponse getResponse() {
        return Response;
    }

    public void setResponse(DefaultResponse response) {
        Response = response;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    

}
