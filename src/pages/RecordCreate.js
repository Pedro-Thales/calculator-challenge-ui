import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../components/Layout"


function ProjecCreate(props) {
    const [operation_id, setOperationId] = useState(101)
    const [first_value, setFirstValue] = useState('')
    const [second_value, setSecondValue] = useState('')

    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
    }, [])

    const fetchUserBalance = () => {
        axiosInstance.get('/calculator/balance')
            .then(function (response) {
                props.setBalance(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const handleSelect = (e) => {setOperationId(e.target.value)}

    const handleSave = () => {
        setIsSaving(true);
        axiosInstance.post('calculator/calculate', {
            operation_id: operation_id,
            amount: 1,
            first_value: first_value,
            second_value: second_value

        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Record saved successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setOperationId('')
                setFirstValue('')
                setSecondValue('')
                fetchUserBalance();

            })
            //TODO get error response to show message correctly
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occured! ' + error,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false)
                fetchUserBalance();
            });
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Create New Record</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-info float-right"
                            to="/dashboard">View All Records
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label> Select the operation:  
                                    <select value={operation_id} onChange={handleSelect}>
                                        <option value="101">Addition</option>
                                        <option value="102">Subtraction</option>
                                        <option value="103">Multiplication</option>
                                        <option value="104">Division</option>
                                        <option value="105">Square Root</option>
                                        <option value="106">Random String</option>
                                    </select>
                                </label>
                                
                            </div>
                                <div className="form-group">
                                    <label htmlFor="first_value">First Value of operation</label>
                                    <input
                                        value={first_value}
                                        onChange={(event) => { setFirstValue(event.target.value) }}
                                        className="form-control"
                                        id="first_value"
                                        name="first_value"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="second_value">Second Value of operation</label>
                                    <input
                                        value={second_value}
                                        onChange={(event) => { setSecondValue(event.target.value) }}
                                        className="form-control"
                                        id="second_value"
                                        name="second_value"/>
                                </div>
                            <button
                                disabled={isSaving}
                                onClick={handleSave}
                                type="button"
                                className="btn btn-outline-primary mt-3">
                                Save Record
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjecCreate;