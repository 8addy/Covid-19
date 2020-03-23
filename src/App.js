import React, { Component } from 'react';
import './App.css';
import Chart from './components/Chart';
import { Box } from './components/Box';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: 0,
      recovered: 0,
      deaths: 0,
      countries: [],
      loading: false
    };
    this.API = 'https://covid19.mathdro.id/api';
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ loading: true });
    const responseCountries = await fetch(`${this.API}/countries`);
    const countriesData = await responseCountries.json();
    const response = await fetch(`${this.API}`);
    const resData = await response.json();
    const countriesArray = Object.keys(countriesData.countries);
    this.setState({
      loading: false,
      confirmed: resData.confirmed.value,
      recovered: resData.recovered.value,
      deaths: resData.deaths.value,
      countries: countriesArray
    });
  };

  getCountries = () => {
    return this.state.countries.map((country, i) => {
      return (
        <option key={i} value={country}>
          {country}
        </option>
      );
    });
  };

  fetchByCountry = async e => {
    if (e.target.value === 'worldwide') {
      this.setState({ loading: true });
      const response = await fetch(`${this.API}`);
      const resData = await response.json();
      this.setState({
        loading: false,
        confirmed: resData.confirmed.value,
        recovered: resData.recovered.value,
        deaths: resData.deaths.value
      });
      return;
    }
    try {
      this.setState({ loading: true });
      const response = await fetch(`${this.API}/countries/${e.target.value}`);
      const resData = await response.json();
      this.setState({
        loading: false,
        confirmed: resData.confirmed.value,
        recovered: resData.recovered.value,
        deaths: resData.deaths.value
      });
    } catch (error) {
      this.setState({
        loading: false,
        confirmed: 'No data available!!',
        recovered: 'No data available!!',
        deaths: 'No data available!!'
      });
    }
  };

  render() {
    const { confirmed, recovered, deaths, loading } = this.state;
    return (
      <>
        {loading && (
          <div className="loading">
            <div className="loader">Loading...</div>
          </div>
        )}
        <div className="container">
          <h1>Covid-19 news tracking</h1>
          <select onChange={this.fetchByCountry} className="select">
            <option value="worldwide">Worldwide</option>
            {this.getCountries()}
          </select>
          <div className="boxes">
            <Box class="confirmed" label="Confirmed" value={confirmed} />
            <Box class="deaths" label="Deaths" value={deaths} />
            <Box class="recovered" label="Recovered" value={recovered} />
          </div>
          <Chart values={{ confirmed, deaths, recovered }} />
        </div>
      </>
    );
  }
}

export default App;
