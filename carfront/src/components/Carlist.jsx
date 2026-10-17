import { useEffect, useState } from "react";
import { SERVER_URL } from "../constants";
import { DataGrid, Toolbar, ExportCsv, ExportPrint } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import AddCar from "./AddCar";
import EditCar from "./EditCar";

// Grid toolbar with CSV export and print buttons
function CustomToolbar() {
  return (
    <Toolbar>
      <ExportCsv
        render={<Button size="small" startIcon={<FileDownloadIcon />} />}
      >
        Export CSV
      </ExportCsv>
      <ExportPrint render={<Button size="small" startIcon={<PrintIcon />} />}>
        Print
      </ExportPrint>
    </Toolbar>
  );
}

function Carlist(props) {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const columns = [
    { field: "brand", headerName: "Brand", width: 200 },
    { field: "model", headerName: "Model", width: 200 },
    { field: "color", headerName: "Color", width: 200 },
    { field: "year", headerName: "Year", width: 200 },
    { field: "price", headerName: "Price", width: 200 },
    {
      field: "_links.car.href",
      headerName: "",
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (row) => <EditCar data={row} updateCar={updateCar} />,
    },
    {
      field: "_links.self.href",
      headerName: "",
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (row) => (
        <IconButton aria-label="delete" onClick={() => onDelClick(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  const fetchCars = () => {
    // Read the token from session storage and send it with the request
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/cars", {
      headers: { Authorization: token },
    })
      .then((response) => {
        // An expired or unknown token: go back to the login form
        if (response.status === 401) {
          props.logOut();
          throw new Error("Session expired");
        }
        return response.json();
      })
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCars();
    // Load the list once, when the page first appears
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelClick = (url) => {
    if (window.confirm("Are you sure to delete?")) {
      const token = sessionStorage.getItem("jwt");
      fetch(url, {
        method: "DELETE",
        headers: { Authorization: token },
      })
        .then((response) => {
          if (response.ok) {
            fetchCars();
            setOpen(true);
          } else {
            alert("Sorry, something went wrong!");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  // Add a new car
  const addCar = (car) => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(car),
    })
      .then((response) => {
        if (response.ok) {
          fetchCars();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => console.error(err));
  };

  // Update an existing car
  const updateCar = (car, link) => {
    const token = sessionStorage.getItem("jwt");
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(car),
    })
      .then((response) => {
        if (response.ok) {
          fetchCars();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" mt={2} mb={2}>
        <AddCar addCar={addCar} />
        <Button onClick={props.logOut}>Log out</Button>
      </Stack>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={cars}
          columns={columns}
          disableRowSelectionOnClick={true}
          getRowId={(row) => row._links.self.href}
          slots={{ toolbar: CustomToolbar }}
          showToolbar
        />
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          message="Car Deleted Successfully!"
        />
      </div>
    </>
  );
}

export default Carlist;
