import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Pagination } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { fetchData } from './actions/httpQuery';

const App = () => {
  const [products, setProducts] = useState([]);
  const [fullProducts, setFullProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(true);
  const [field, setField] = useState('');

  const loadingF = () => {
    if (loading) {
      return <h3>Loading...</h3>
    }
  }


  const getData = async () => {
    console.log('getData')

    setLoading(true)

    const fetchDataAndProcess = async () => {
      const data = await fetchData(
        {
          "action": "get_ids",
          "params": { "offset": page * 50 - 50 + 1, "limit": 50 }
        }
      )
      setProducts(await data?.result)
      console.log(data?.result);

      await getDataByID(await data?.result);
    }
    await fetchDataAndProcess();
    setLoading(false)

  }

  const getDataFilter = async (field, value) => {
    console.log('getDataFilter')
    console.log(typeof value)
    setPage(1)
    setLoading(true)
    if (field && value) {
      const fetchDataAndProcess = async () => {
        const data = await fetchData(
          {
            "action": "filter",
            "params": { [field]: field === 'price' ? +value :  value }
          }
        )
        setProducts(await data?.result)
        console.log(data?.result);
        await getDataByID(data?.result);
      };
      await fetchDataAndProcess();
    }
    if (value === undefined || value === '') {
      getData()
    }
    setLoading(false)
  }

  const getDataByID = async (products) => {
    console.log('getDataByID')
    console.log(value)
    setLoading(true)
    if (products) {
      const data = await fetchData(
        {
          "action": "get_items",
          "params": { "ids": products }
        }
      )
      const uniqueIds = new Set();
      const uniqueObjects = data?.result.filter(obj => {
        if (!uniqueIds.has(obj.id)) {
          uniqueIds.add(obj.id);
          return true;
        }
        return false;
      });

      console.log(uniqueObjects);
      console.log(data?.result);
      setFullProducts(uniqueObjects)
    }
    setLoading(false)
  }

  useEffect(() => {
    getData()

  }, []);

  useEffect(() => {

    if (value == undefined) {
      console.log("if (value == '') {")
      getData()
    }
  }, [page]);

  const newPage = (e) => {
    if (e === -1 && page === 1) {
      return;
    }
    setPage(page + e)
  }


  const handleChangeField = (event) => {
    setField(event.target.value);
  };


  const handleChangePage = (event, value) => {
    setPage(value);
  };


  return (
    <div>
      <Box sx={{ minWidth: 120, display: 'flex', marginTop: '10px' }}>

        <FormControl fullWidth sx={{ margin: '0 10px' }}>
          <InputLabel id="demo-simple-select-label">Выбразь значение поля</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={field}
            label="Выбразь значение поля"
            onChange={handleChangeField}
          >
            <MenuItem value={'product'}>Название</MenuItem>
            <MenuItem value={'price'}>Цена</MenuItem>
            <MenuItem value={'brand'}>Бренд</MenuItem>
          </Select>
        </FormControl>

        <TextField
          sx={{ margin: '0 10px' }}
          label="Значение"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          variant="outlined"
        />
        <Button onClick={() => getDataFilter(field, value)} variant='outlined' sx={{ margin: '0 10px', padding: '0 50px' }}>найти</Button>

      </Box>

      <Paper sx={{ width: '100%' }}>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Brand</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? loadingF()
                : (
                  fullProducts && (


                    value ?
                      fullProducts.slice(page * 50 - 50, page * 50).map((product, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{index + (page * 50 - 50) + 1}</TableCell>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.product}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.brand}</TableCell>
                          </TableRow>
                        )
                      }) :
                      fullProducts.map((product, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{index + (page * 50 - 50) + 1}</TableCell>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.product}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.brand}</TableCell>
                          </TableRow>
                        )
                      })

                  )
                )
              }



            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
      {products?.length > 50
        ? (<Pagination
          count={Math.ceil(products?.length > 0 && products?.length / 50)}
          page={page}
          onChange={handleChangePage}
        />)
        : (<div style={{ display: 'flex', alignItems: 'center', }}>
          <div onClick={() => newPage(-1)} style={{ fontSize: '30px', margin: '5px 10px', cursor: 'pointer' }}>{"<"}</div>
          <div style={{ fontSize: '25px' }}>{page}</div>
          <div onClick={() => newPage(+1)} style={{ fontSize: '30px', margin: '5px 10px', cursor: 'pointer' }}>{">"}</div>
        </div>)
      }
    </div >
  );
};



export default App;


