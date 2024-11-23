import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import { Button, FormHelperText, Grid, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import HandleError from '../ErrorHandler'


function RecordCreate(props) {
    const [operation_id, setOperationId] = useState("101")
    const [first_value, setFirstValue] = useState('')
    const [hasFirstValue, setHasFirstValue] = useState(true)
    const [hasSecondValue, setHasSecondValue] = useState(true)
    const [second_value, setSecondValue] = useState('')

    const min_value = -1000000000000;
    const max_value = 1000000000000;

    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const verifyStorage = () => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
    }

    useEffect(() => {
        verifyStorage()
    }, [])

    const handleCancel = () => {
        navigate("/dashboard");
    }

    const fetchUserBalance = () => {
        axiosInstance.get('/calculator/balance')
            .then(function (response) {
                props.setBalance(response.data);
            })
            .catch(function (error) {
                HandleError(error, 'Error while trying to fetch balance')
                verifyStorage()
            })
    }

    const handleSelect = (event, newValue) => {
        setOperationId(newValue)
        setFirstValue('')
        setSecondValue('')
        
        if(newValue < 105) {
            setHasFirstValue(true)
            setHasSecondValue(true)
        }

        if(newValue == 105) {
            setHasFirstValue(true)
            setHasSecondValue(false)
        }

        if(newValue == 106) {
            setHasFirstValue(false)
            setHasSecondValue(false)
        }

    }

    const handleSave = () => {
        setIsSaving(true);

        if (first_value > max_value || first_value < min_value) {

            HandleError(null, 'First value not allowed!', 'Max value is: ' + max_value + ' Min Value is: ' + min_value)
            setIsSaving(false);
            return;
        }

        if (second_value > max_value || second_value < min_value) {
            HandleError(null, 'Second value not allowed!', 'Max value is: ' + max_value + ' Min Value is: ' + min_value)
            setIsSaving(false);
            return;
        }

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
                navigate("/dashboard");

            })
            .catch(function (error) {
                HandleError(error, 'Error while trying to save record');
                setIsSaving(false);
                verifyStorage();
                fetchUserBalance();
            });
    }

    return (
            <div className="container-sm" style={{width: 49.5 +'rem'}}>
                <h2 className="text-center mt-5 mb-3">Create New Record</h2>
                <div className="card">
                    <div className="card-body">
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                            alignItems="center" justify="center">
                            <Grid item xs={12} sm={12} md={12}>
                                <FormHelperText>Choose the operation to perform</FormHelperText>
                                <ToggleButtonGroup exclusive color="success" value={operation_id} onChange={handleSelect} aria-label="Operations">
                                    <ToggleButton value="101">Addition</ToggleButton>
                                    <ToggleButton value="102">Subtraction</ToggleButton>
                                    <ToggleButton value="103">Multiplication</ToggleButton>
                                    <ToggleButton value="104">Division</ToggleButton>
                                    <ToggleButton value="105">Square Root</ToggleButton>
                                    <ToggleButton value="106">Random String</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>

                            <Grid item xs={6} sm={6} md={6}>
                                <TextField fullWidth id="first_value" data-testid="first-value" disabled={!hasFirstValue} type='number' label="First Value" variant="outlined" 
                                    value={first_value} onChange={(event) => { setFirstValue(event.target.value) }}/>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <TextField fullWidth id="second_value" disabled={!hasSecondValue} type='number' label="Second Value" variant="outlined" 
                                    value={second_value} onChange={(event) => { setSecondValue(event.target.value) }}/>
                            </Grid>

                            <Grid item xs={9} sm={9} md={9}>
                                <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                            </Grid>

                            <Grid item xs={3} sm={3} md={3}>
                                <Button variant="contained" fullWidth disabled={isSaving} 
                                    onClick={handleSave}> Save Record 
                                </Button>
                            </Grid>
                        </Grid>

                    </div>
                </div>
            </div>
        
    );
}

export default RecordCreate;