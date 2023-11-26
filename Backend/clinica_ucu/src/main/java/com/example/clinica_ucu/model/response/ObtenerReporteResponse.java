package com.example.clinica_ucu.model.response;

import java.util.List;

import com.example.clinica_ucu.model.Funcionario;

public class ObtenerReporteResponse {
    DefaultResponse Response;
    List<Funcionario> funcionarios;

    public DefaultResponse getResponse() {
        return Response;
    }

    public void setResponse(DefaultResponse response) {
        Response = response;
    }

    public List<Funcionario> getFuncionarios() {
        return funcionarios;
    }

    public void setFuncionarios(List<Funcionario> funcionarios) {
        this.funcionarios = funcionarios;
    }

}
