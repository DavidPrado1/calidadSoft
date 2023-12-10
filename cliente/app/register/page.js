"use client";

import axios from "axios";
import React, { useState } from "react";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState("");
  const [fecha_nac, setFecha_nac] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3001/users", {
        nombre,
        apellido,
        correo,
        password,
        foto,
        fecha_nac
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container container-fluid">
      <div className="row mt-5 d-flex justify-content-center">
        <div className="col-10 col-lg-5 ">
          <form
            className="border border-secondary rounded p-4"
            onSubmit={submitHandler}
          >
            <h1 className="mb-4">Registro</h1>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="nombre_field">
                Nombres
              </label>
              <input
                type="text"
                id="nombre_field"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="apellido_field">
                Apellidos
              </label>
              <input
                type="text"
                id="apellido_field"
                className="form-control"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="correo_field">
                Correo
              </label>
              <input
                type="email"
                id="correo_field"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="password_field">
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="fecha_nac_field">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fecha_nac_field"
                className="form-control"
                value={fecha_nac}
                onChange={(e) => setFecha_nac(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-block w-100 btn-primary btn-block mb-4"
            >Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
