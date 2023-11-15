package com.example.clinica_ucu.model;

import java.sql.Date;

public class Cupos {

    private String Fecha;
    private Integer CitasDisponibles;
    private Integer Anio;
    private String Semestre;

    public Cupos() {
    }

    public Cupos(String fecha, Integer citasDisponibles, Integer anio, String semestre) {
        Fecha = fecha;
        CitasDisponibles = citasDisponibles;
        Anio = anio;
        Semestre = semestre;
    }

    public String getFecha() {
        return Fecha;
    }

    public void setFecha(String fecha) {
        Fecha = fecha;
    }

    public Integer getCitasDisponibles() {
        return CitasDisponibles;
    }

    public void setCitasDisponibles(Integer citasDisponibles) {
        CitasDisponibles = citasDisponibles;
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

}
