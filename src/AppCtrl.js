'use strict';
import axios from 'axios'
import React from 'react';

export default class AppCtrl extends React.Component {
    constructor(element) {
        super();
        this.element = element;
    }

    getApi() {
        const _this = this;
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        axios.get('http://www.mocky.io/v2/5c9105cb330000112b649af8,')
            .then(function (response) {
                let general = Object.assign({}, _this.element.state)
                var furnitureStyle = general.furnitureStyle
                var productList = general.productList
                var isLoading = general.isLoading
                var productListAll = general.productListAll
                let data = response.data
                furnitureStyle = data.furniture_styles
                productList = data.products
                productListAll = productList
                isLoading = false
                _this.element.setState({ furnitureStyle, productList, isLoading, productListAll })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}