package com.example.clinica_ucu.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public class Funcionario {
    @JsonProperty(value = "CI")
    private String CI;

    @JsonProperty(value = "Nombre")
    private String Nombre;

    @JsonProperty(value = "Apellido")
    private String Apellido;

    @JsonProperty(value = "Fch_Nacimiento")
    private String Fch_Nacimiento;

    @JsonProperty(value = "Direccion")
    private String Direccion;

    @JsonProperty(value = "Telefono")
    private String Telefono;
    @JsonProperty(value = "Email")
    private String Email;

    @JsonProperty(value = "LogId")
    private String LogId;

    public String getCI() {
        return CI;
    }

    public String getNombre() {
        return Nombre;
    }

    public String getApellido() {
        return Apellido;
    }

    @JsonFormat(pattern = "dd MMM yyyy")
    public String getFch_Nacimiento() {
        return Fch_Nacimiento;
    }

    public String getDireccion() {
        return Direccion;
    }

    public String getTelefono() {
        return Telefono;
    }

    public String getEmail() {
        return Email;
    }

    public String getLogId() {
        return LogId;
    }


    

    public void setCI(String cI) {
        CI = cI;
    }

    public void setNombre(String nombre) {
        Nombre = nombre;
    }

    public void setApellido(String apellido) {
        Apellido = apellido;
    }

    public void setFch_Nacimiento(String fch_Nacimiento) {
        Fch_Nacimiento = fch_Nacimiento;
    }

    public void setDireccion(String direccion) {
        Direccion = direccion;
    }

    public void setTelefono(String telefono) {
        Telefono = telefono;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public void setLogId(String logId) {
        LogId = logId;
    }

    @Override
    public String toString() {
        return "Funcionario [CI=" + CI + ", Nombre=" + Nombre + ", Apellido=" + Apellido + ", Fch_Nacimiento="
                + Fch_Nacimiento + ", Direccion=" + Direccion + ", Telefono=" + Telefono + ", Email=" + Email
                + ", LogId=" + LogId + "]";
    }

}
