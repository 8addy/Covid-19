import React, { Component } from 'react';
import './App.css';
import Chart from './components/Chart';
import { Box } from './components/Box';
import Switch from 'react-switch';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: 0,
      recovered: 0,
      deaths: 0,
      countries: [],
      loading: false,
      optionState: 'Morocco',
      checked: false
    };
    this.API = 'https://covid19.mathdro.id/api';
  }

  componentWillMount() {
    const isAlreadyChecked = localStorage.getItem('checked');
    this.setState({
      checked:
        isAlreadyChecked !== null
          ? isAlreadyChecked === 'true'
            ? true
            : false
          : false
    });
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ loading: true });
    const responseCountries = await fetch(`${this.API}/countries`);
    const countriesData = await responseCountries.json();
    const response = await fetch(`${this.API}/countries/Morocco`);
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
    this.setState({ optionState: e.target.value });
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

  changeThemeHandler = () => {
    this.setState(prevState => {
      return { checked: !prevState.checked };
    });
    localStorage.setItem('checked', this.state.checked);
  };

  render() {
    const {
      confirmed,
      recovered,
      deaths,
      loading,
      optionState,
      checked
    } = this.state;
    return (
      <div className={checked ? 'dark-mode' : null}>
        {loading && (
          <div className="loading">
            <div className="loader">Loading...</div>
          </div>
        )}
        <nav className={checked ? 'navbar navbar-dark' : 'navbar'}>
          <h1>Covid-19 Statistics</h1>
          <label>
            <Switch
              onChange={this.changeThemeHandler}
              checked={checked}
              className="react-switch"
              handleDiameter={28}
              offColor="#08f"
              onColor="#0ff"
              offHandleColor="#0ff"
              onHandleColor="#08f"
              uncheckedIcon={<img src={require('./images/dark.png')} alt="" />}
              checkedIcon={<img src={require('./images/white.png')} alt="" />}
            />
          </label>
        </nav>
        <div className="container">
          <select
            value={optionState}
            onChange={this.fetchByCountry}
            className={checked ? 'select dark-select' : 'select'}
          >
            <option value="worldwide">Worldwide</option>
            {this.getCountries()}
          </select>
          <div className="boxes">
            <Box
              class={checked ? 'confirmed dark-boxes' : 'confirmed'}
              label="Confirmed"
              value={confirmed}
              checked={checked}
            />
            <Box
              class={checked ? 'deaths dark-boxes' : 'deaths'}
              label="Deaths"
              value={deaths}
              checked={checked}
            />
            <Box
              class={checked ? 'recovered dark-boxes' : 'recovered'}
              label="Recovered"
              value={recovered}
              checked={checked}
            />
          </div>
          <Chart values={{ confirmed, deaths, recovered }} checked={checked} />
        </div>
      </div>
    );
  }
}

export default App;
