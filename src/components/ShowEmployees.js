import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowEmployees = () => {
  const url = 'https://employee-mvc.azurewebsites.net/api/employees';
  const url2 = 'https://employee-mvc.azurewebsites.net/api/employee';
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    const respuesta = await axios.get(url);
    setEmployees(respuesta.data);
  }

  const openModal = (op, employeeId, firstName, lastName, role, salary) => {
    setEmployeeId('');
    setFirstName('');
    setLastName('');
    setRole('');
    setSalary('');
    setOperation(op);
    if (op === 1) {
      setTitle('Registrar Empleado');
    }
    else if (op === 2) {
      setTitle('Editar Empleado');
      setEmployeeId(employeeId);
      setFirstName(firstName);
      setLastName(lastName);
      setRole(role);
      setSalary(salary);
    }
    window.setTimeout(function () {
      document.getElementById('id').focus();
    }, 500);
  }
  const validar = () => {
    var parametros;
    var metodo;
    if (firstName.trim() === '') {
      show_alerta('Escribe el nombre del Empleado', 'warning');
    }
    else if (lastName.trim() === '') {
      show_alerta('Escribe el apellido del Empleado', 'warning');
    }
    else if (role.trim() === '') {
      show_alerta('Escribe el rol del Empleado', 'warning');
    }
    else if (salary === '') {
      show_alerta('Escribe el salario del Empleado', 'warning');
    }
    else {
      if (operation === 1) {
        parametros = { employeeId: employeeId, firstName: firstName.trim(), lastName: lastName.trim(), role: role.trim(), salary: salary };
        metodo = 'POST';
      }
      else {
        parametros = { employeeId: employeeId, firstName: firstName.trim(), lastName: lastName.trim(), role: role.trim(), salary: salary };
        metodo = 'PUT';
      }
      envarSolicitud(metodo, parametros);
    }
  }
  const envarSolicitud = async (metodo, parametros) => {
    let apiUrl = url2; // Url base
    if (metodo === 'PUT' || metodo === 'DELETE') {
      apiUrl += `/${parametros.employeeId}`; // Agregar el id al final de la URL
    }
    await axios({ method: metodo, url: apiUrl, data: parametros }).then(function (respuesta) {
      var tipo = respuesta.data[0];
      var msj = respuesta.data[1];
      show_alerta(msj, tipo);
      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getEmployees();
      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }
  const deleteEmployee = (id, firstName) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar el empleado ' + firstName + ' ?',
      icon: 'question', text: 'No se podrá dar marcha atrás',
      showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setEmployeeId(id);
        envarSolicitud('DELETE', { employeeId: id });
      }
      else {
        show_alerta('El producto NO fue eliminado', 'info');
      }
    });
  }
  return (
    <div className='App' onClick={(e) => e.stopPropagation()}>
      <div className='container-fluid'>
        <div classNAme='row mt-3 justify-content-center'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-12'>
            <div className='table-responsive'>
              <table className='table table-bordered table-auto text-center'>
                <thead>
                  <tr><th>#</th><th>NOMBRE</th><th>APELLIDO</th><th>ROL</th><th>SALARIO</th></tr>
                </thead>
                <tbody className='table-group-divider'>
                  {employees.map((employee, i) => (
                    <tr key={employee.id}>
                      <td> {employee.employeeId}</td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.role}</td>
                      <td>${new Intl.NumberFormat('es-mx').format(employee.salary)}</td>
                      <td>
                        <button onClick={() => openModal(2, employee.employeeId, employee.firstName, employee.lastName, employee.role, employee.salary)}
                          className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalEmployees'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button onClick={() => deleteEmployee(employee.employeeId, employee.firstName)} className='btn btn-danger'>
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalEmployees'>
                <i className='fa-solid fa-circle-plus'></i> Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id='modalEmployees' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              {/* <input type = 'hidden' id='id'></input> */}
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type='text' id='id' className='form-control' placeholder='id' value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  onClick={(e) => e.stopPropagation()}>
                </input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}>
                </input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input type='text' id='apellido' className='form-control' placeholder='Apellido' value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}>
                </input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input type='text' id='rol' className='form-control' placeholder='Rol' value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onClick={(e) => e.stopPropagation()}>
                </input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='text' id='salario' className='form-control' placeholder='Salario' value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  onClick={(e) => e.stopPropagation()}>
                </input>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowEmployees


