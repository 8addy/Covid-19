import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: 0,
      recovered: 0,
      deaths: 0,
      countries: []
    };
    this.API = 'https://covid19.mathdro.id/api';
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const responseCountries = await fetch(`${this.API}/countries`);
    const countriesData = await responseCountries.json();
    const response = await fetch(`${this.API}`);
    const resData = await response.json();
    const countriesArray = Object.keys(countriesData.countries);
    this.setState({
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
      const response = await fetch(`${this.API}`);
      const resData = await response.json();
      this.setState({
        confirmed: resData.confirmed.value,
        recovered: resData.recovered.value,
        deaths: resData.deaths.value
      });
      return;
    }
    try {
      const response = await fetch(`${this.API}/countries/${e.target.value}`);
      const resData = await response.json();
      this.setState({
        confirmed: resData.confirmed.value,
        recovered: resData.recovered.value,
        deaths: resData.deaths.value
      });
    } catch (error) {
      this.setState({
        confirmed: 'No data available!!',
        recovered: 'No data available!!',
        deaths: 'No data available!!'
      });
    }
  };

  render() {
    const { confirmed, recovered, deaths } = this.state;
    return (
      <div className="container">
        <h1>Covid-19 news tracking</h1>
        <select onChange={this.fetchByCountry} className="select">
          <option value="worldwide">Worldwide</option>
          {this.getCountries()}
        </select>
        <div className="boxes">
          <div className="box confirmed">
            <h3>Confirmed</h3>
            <p>{confirmed && confirmed}</p>
          </div>
          <div className="box deaths">
            <h3>Deaths</h3>
            <p>{deaths && deaths}</p>
          </div>
          <div className="box recovered">
            <h3>Recovered</h3>
            <p>{recovered && recovered}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
