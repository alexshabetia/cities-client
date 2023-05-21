import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCitiesByOptionalName, updateCity } from "../slices/cities";
import Pagination from "@material-ui/lab/Pagination";
import { selectCities, selectTotalCount } from "../selectors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./CitiesTable.css";

const CitiesTable = () => {
  const [searchName, setSearchName] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editedCity, setEditedCity] = useState(null);
  const [validUrl, setValidUrl] = useState(true);

  const cities = useSelector(selectCities);
  const count = useSelector(selectTotalCount);
  const dispatch = useDispatch();

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
    setPage(1);
  };

  const handleValidation = (e) => {
    const reg = new RegExp(
      "^(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})$"
    );
    setValidUrl(reg.test(e.target.value));
  };

  const initFetch = useCallback(() => {
    dispatch(
      getAllCitiesByOptionalName({ page: page - 1, size: pageSize, name: null })
    );
  }, [dispatch]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  useEffect(() => {
    dispatch(
      getAllCitiesByOptionalName({
        page: page - 1,
        size: pageSize,
        name: searchName,
      })
    );
  }, [page, pageSize, searchName]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleClickOpen = (row) => {
    setEditedCity(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const doUpdate = async () => {
    let result = dispatch(
      updateCity({ uuid: editedCity.uuid, data: editedCity })
    ).catch((e) => {
      console.log(e);
    });
    await result;
    dispatch(
      getAllCitiesByOptionalName({
        page: page - 1,
        size: pageSize,
        name: searchName,
      })
    );
    handleClose();
  };

  return (
    <div className="m-5">
      <Box component="form">
        <TextField
          id="outlined-basic"
          label="Search by name containing"
          size="small"
          sx={{ width: "350px" }}
          value={searchName}
          variant="outlined"
          onChange={onChangeSearchName}
        />
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={() => setSearchName("")}
        >
          <ClearIcon />
        </IconButton>
      </Box>
      <div className="mt-3 flex-space-between">
        <Pagination
          className="my-3"
          count={count}
          page={page}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel id="page-size-select-helper-label">
            Items per Page
          </InputLabel>
          <Select
            labelId="page-size-select-label"
            id="page-size-select"
            value={pageSize}
            label="Items per Page"
            onChange={handlePageSizeChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Photo</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((row) => (
              <TableRow
                key={row.uuid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <img
                    src={row.photo}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "no-image.png";
                    }}
                    width="100"
                    height="100"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => {
                      handleClickOpen(row);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit city</DialogTitle>
        <DialogContent>
          <DialogContentText>Change city name and photo</DialogContentText>
          <div className="flex-space-between">
            <div>
              <TextField
                autoFocus
                id="outlined-basic"
                label="City name"
                size="small"
                sx={{ mt: 3, width: "320px" }}
                value={editedCity ? editedCity.name : ""}
                variant="outlined"
                onChange={(e) => {
                  setEditedCity({
                    uuid: editedCity.uuid,
                    name: e.target.value,
                    photo: editedCity.photo,
                  });
                }}
              />
              <TextField
                multiline
                id="outlined-basic"
                label="City photo link"
                size="small"
                sx={{ mt: 3, width: "320px" }}
                value={editedCity ? editedCity.photo : ""}
                variant="outlined"
                error={!validUrl}
                helperText={validUrl ? "" : "Incorrect URL"}
                onChange={(e) => {
                  handleValidation(e);
                  setEditedCity({
                    uuid: editedCity.uuid,
                    name: editedCity.name,
                    photo: e.target.value,
                  });
                }}
              />
            </div>
            <img
              src={editedCity?.photo}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "no-image.png";
              }}
              width="200"
              height="200"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!validUrl} onClick={doUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CitiesTable;
