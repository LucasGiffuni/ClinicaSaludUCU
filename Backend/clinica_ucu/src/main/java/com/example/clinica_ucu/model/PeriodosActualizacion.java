package com.example.clinica_ucu.model;

import java.sql.Date;

public class PeriodosActualizacion {

    private Integer Anio;
    private String Semestre;
    private Date Fch_Inicio;
    private Date Fch_Fin;

    public PeriodosActualizacion(Integer anio, String semestre, Date fch_Inicio, Date fch_Fin) {
        Anio = anio;
        Semestre = semestre;
        Fch_Inicio = fch_Inicio;
        Fch_Fin = fch_Fin;
    }

    public Integer getAnio() {
        return Anio;
    }

    public void setAnio(Integer anio) {
        Anio = anio;
    }

    public String getSemestre() {
        return Semestre;
    }

    public void setSemestre(String semestre) {
        Semestre = semestre;
    }

    public Date getFch_Inicio() {
        return Fch_Inicio;
    }

    public void setFch_Inicio(Date fch_Inicio) {
        Fch_Inicio = fch_Inicio;
    }

    public Date getFch_Fin() {
        return Fch_Fin;
    }

    public void setFch_Fin(Date fch_Fin) {
        Fch_Fin = fch_Fin;
    }

}
