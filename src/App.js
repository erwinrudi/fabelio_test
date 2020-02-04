import React from 'react';
import './App.css';
import { Input, FormControl, Select, MenuItem, Checkbox, ListItemText, InputLabel, InputAdornment, IconButton, Grid, Card, CardContent } from '@material-ui/core';
import AppCtrl from './AppCtrl.js';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { Clear } from '@material-ui/icons';
import NumberFormat from 'react-number-format';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      furnitureStyle: [],
      productList: [],
      productListAll: [],
      deliveryTime: [
        {
          value: 7,
          text: "1 Week"
        },
        {
          value: 14,
          text: "2 Week"
        },
        {
          value: 30,
          text: "1 Month"
        },
        {
          value: 9999,
          text: "More Than 1 Month"
        }
      ],
      search: {
        text: '',
        furnitureStyle: [],
        deliveryTime: []
      }
    }
    this.Ctrl = new AppCtrl(this)
  }



  componentDidMount() {
    this.Ctrl.getApi();
  }

  searchData(searchParam, data) {
    var flaggingSearch = {
      isSearchName: false,
      isSearchFurniture: false,
      isSearchDelivery: false
    }

    if (searchParam.text != "") {
      if (data.name.toLowerCase().includes(searchParam.text.toLowerCase())) {
        flaggingSearch.isSearchName = true
      }
    }
    if (searchParam.text == "") {
      flaggingSearch.isSearchName = true
    }

    if (searchParam.furnitureStyle.length != 0) {
      data.furniture_style.map(datas => {
        searchParam.furnitureStyle.map(search => {
          if (search == datas) {
            flaggingSearch.isSearchFurniture = true
          }
        })
      })
    }
    if (searchParam.furnitureStyle.length == 0) {
      flaggingSearch.isSearchFurniture = true
    }

    if (searchParam.deliveryTime.length != 0) {
      searchParam.deliveryTime.map(search => {
        if (search >= data.delivery_time) {
          flaggingSearch.isSearchDelivery = true
        }
      })
    }

    if (searchParam.deliveryTime.length == 0) {
      flaggingSearch.isSearchDelivery = true
    }


    if (flaggingSearch.isSearchFurniture && flaggingSearch.isSearchName && flaggingSearch.isSearchDelivery) {
      return true
    }
    return false
  }

  handleChange(property, event) {
    var value = event.target.value
    let search = this.state.search
    let product = this.state.productListAll
    let productList = this.state.productList
    productList = []
    search[property] = value
    this.setState({ search })

    for (var i = 0; i < product.length; i++) {
      var productSelect = product[i]
      if (this.searchData(search, productSelect)) {
        productList.push(productSelect)
      }
    }
    this.setState({ productList })
  }

  handleClickClear = () => {
    let search = this.state.search
    search['text'] = ''
    this.setState({ search })
  };

  componentDidUpdate() {
  }

  cutProductDescription(description) {
    if (description.length <= 114) {
      return description
    }
    else {
      var value = description.substring(0, 111)
      value = value + "..."
      return value
    }
  }

  selectedSelect(value) {
    let result = ""
    value.map(x => {
      let tempResult = this.state.deliveryTime.find(deliveryTime => deliveryTime.value == x);
      // debugger
      result = result + tempResult.text + ", "
    })

    return result
  }

  render() {
    let { isLoading, furnitureStyle, productList, deliveryTime, search } = this.state

    return (
      <React.Fragment>
        <div>
          <BlockUi tag="div" blocking={isLoading}>
            <div style={{
              padding: '30px'
            }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl >
                    <InputLabel >Search Furniture</InputLabel>
                    <Input
                      type='text'
                      value={search.text}
                      onChange={this.handleChange.bind(this, 'text')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={this.handleClickClear}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={6}>
                  <FormControl fullWidth={true}>
                    <InputLabel >Tag</InputLabel>
                    <Select
                      labelId="demo-mutiple-checkbox-label"
                      id="demo-mutiple-checkbox"
                      multiple
                      value={search.furnitureStyle}
                      onChange={this.handleChange.bind(this, 'furnitureStyle')}
                      input={<Input />}
                      renderValue={selected => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {furnitureStyle.map((x, index) => (
                        <MenuItem key={index} value={x}>
                          <Checkbox checked={search.furnitureStyle.indexOf(x) > -1} />
                          <ListItemText primary={x} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} >
                  <FormControl fullWidth={true}>
                    <InputLabel >Delivery Time</InputLabel>
                    <Select
                      labelId="demo-mutiple-checkbox-label"
                      id="demo-mutiple-checkbox"
                      multiple
                      value={search.deliveryTime}
                      onChange={this.handleChange.bind(this, 'deliveryTime')}
                      input={<Input />}
                      renderValue={selected => (
                        this.selectedSelect(selected)
                      )}
                      MenuProps={MenuProps}
                    >
                      {deliveryTime.map(x => (
                        <MenuItem key={x.value} value={x.value}>
                          <Checkbox checked={search.deliveryTime.indexOf(x.value) > -1} />
                          <ListItemText primary={x.text} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                {productList.map(product => (
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent style={{
                        minHeigt: '100px',
                        padding: '10px'
                      }}>
                        {/* <Paper  elevation={3} > */}
                        <Grid container>
                          <Grid style={{ fontWeight: '600' }} item xs={7}>{product.name}</Grid>
                          <Grid style={{ textAlign: 'right', fontWeight: '400', color: 'orange' }} item xs={5}>
                            <NumberFormat
                              value={product.price}
                              displayType="text"
                              thousandSeparator
                              prefix="Rp. "
                            />
                          </Grid>
                          <Grid style={{ marginTop: '10px' }} item xs={12}>
                            {this.cutProductDescription(product.description)}
                          </Grid>
                          <Grid style={{ marginTop: '10px' }} item xs={12}>
                            {product.furniture_style.map(x => {
                              return x + " "
                            })}
                          </Grid>
                          <Grid style={{ textAlign: 'right', marginTop: '20px', color: 'blue', fontWeight: '500', textDecoration: 'underline' }} item xs={12}>{product.delivery_time} Days</Grid>
                        </Grid>
                        {/* </Paper> */}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

              </Grid>
            </div>
          </BlockUi>
        </div>
      </React.Fragment>
    );
  }
}


