import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { AppBar, Snackbar } from "@mui/material";
import { Button } from "@mui/material";
import AddCar from "./AddCar";
import EditCar from "./EditCar";

export default function Carlist() {

    // state variables
    const [cars, setCars] = useState([]);
    const [msg, setMsg] = useState('');
    const [open, setOpen] = useState(false);

    // conlumns for cars ag-grid
    const columns = [
        { field: "brand" },
        { field: "model" },
        { field: "color" },
        { field: "fuel" },
        { field: "year" },
        { field: "price" },
        {
            filterable: false,
            sortable: false,
            width: 100,
            Cell: row => <EditCar updateCar={updateCar} car={row.original}/>
        },
        {
            cellRenderer: params =>
                <Button size="small" color="error" onClick={() => deleteCar(params)}>
                    POISTA
                </Button>,
            width: 120
        }

    ]

    const saveCar = (car) => {
        fetch("http://carrestapi.herokuapp.com/cars/", {
            method: 'POST',
            headers: {
                'Content-Type': 'applicatin/json'
            },
            body: JSON.stringify(car)
        })
        fetch(REST_URL)
            .then(response => response.json())
            .then(responseData => {
                console.log("responseData:" + responseData._embedded.cars);
                setCars(responseData._embedded.cars);
            })
            .catch(error => console.error(error));
    }

    // call getCars() function when rendering the component very first time
    useEffect(() => getCars(), []);

    // app is using carrestapi application which is deployed to heroku
    const REST_URL = "http://carrestapi.herokuapp.com/cars/";

    const getCars = () => {
        fetch(REST_URL)
            .then(response => response.json())
            .then(responseData => {
                console.log("responseData:" + responseData._embedded.cars);
                setCars(responseData._embedded.cars);
            })
            .catch(error => console.error(error));
    }

    const deleteCar = (params) => {
        console.log("params: " + params.data._links.car.href);
        fetch(params.data._links.car.href, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setMsg('Auto on poistettu onnistuneesti!');
                    setOpen(true);
                    getCars();
                } else {
                    alert('jokin meni vikaan');
                }
            })
            .catch(error => console.error(error));
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'applicatin/json'
            },
            body: JSON.stringify(car)
        })
        fetch(REST_URL)
            .then(response => response.json())
            .then(responseData => {
                console.log("responseData:" + responseData._embedded.cars);
                setCars(responseData._embedded.cars);
            })
            .catch(error => console.error(error));
            
    }

    return (
        <>
            <AddCar saveCar={saveCar}/>
            <div className="ag-theme-material"
                style={{ height: '700px', width: '105%', margin: 'auto' }} >
                <AgGridReact
                    rowData={cars}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={25}>
                </AgGridReact>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message={msg}>

                </Snackbar>
            </div>
        </>
    );

}