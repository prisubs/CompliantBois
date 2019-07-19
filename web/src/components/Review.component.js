import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from './../'
import { SecondaryNavbar } from './'
import Calendar from 'react-calendar'
import { FieldGroup } from './'
import { VictoryPie } from 'victory'
import Thermometer from 'react-thermometer-component'
import {
  Page,
  Avatar,
  Icon,
  Grid,
  Card,
  Text,
  Table,
  Alert,
  Progress,
  colors,
  Dropdown,
  Button,
  StampCard,
  StatsCard,
  ProgressCard,
  Badge,
  AccountDropdown
} from 'tabler-react'
import * as d3 from 'd3'
import 'tabler-react/dist/Tabler.css'
import C3Chart from 'react-c3js'
import './../styles/predict.css'
// import StripeCheckout from 'react-stripe-checkout'
// import { CardElement } from 'react-stripe-elements'
// import { StripeProvider } from 'react-stripe-elements'
import './../styles/review.css'

export default class Review extends Component {
  state = {
    date: new Date(),
    ticker: '',
    rating: 'NULL',
    arrayvar: [],
    badheadlines: [],
    goodcount: 0,
    badcount: 0
  }

  onChangeDate = inputDate => this.setState({ date: inputDate })

  onChangeTicker = inputTicker => {
    this.setState({
      ticker: inputTicker.target.value
    })
  }

  onSubmit = event => {
    event.preventDefault()
    console.log('SUBMIT TAKING TOO LONG')
    const {
      date,
      ticker,
      rating,
      arrayvar,
      badheadlines,
      goodcount,
      badcount
    } = this.state
    const tickerObject = { date: date, ticker: ticker }
    let all_json
    var x = this.props
      .getTicker(tickerObject, this.handleRedirect, this.handleFailure)
      .then(responseJSON => {
        // do stuff with responseJSON here...
        console.log(responseJSON)
        all_json = responseJSON
        console.log('this is gonna be all json')
        console.log(all_json)
        console.log('THIS IS THE END OF ALL JSON!!!')
        this.setState({
          rating: all_json['rating']
        })

        this.setState({
          arrayvar: [...this.state.arrayvar, ...all_json['good_headlines']]
        })

        this.setState({
          badheadlines: [
            ...this.state.badheadlines,
            ...all_json['bad_headlines']
          ]
        })

        this.setState({
          goodcount: all_json['good_count']
        })

        this.setState({
          badcount: all_json['bad_count']
        })

        console.log(this.state.rating)
        console.log('Number of good headlines is')
        console.log(this.state.arrayvar.length)
        console.log('Number of bad headlines is')
        console.log(this.state.badheadlines.length)
      })

    console.log(x)

    /*
      console.error("yaaaaaaaaaaaaaaaaaaaaaaaah boi1")
    event.preventDefault()
    const { date, ticker, rating} = this.state
    const tickerObject = { date: date, ticker: ticker }
    let json_rating = [];
    json_rating = this.props.getTicker(tickerObject, this.handleRedirect, this.handleFailure)
    setTimeout( function(){


            console.error("yaaaaaaaaaaaaaaaaaaaaaaaah boi2")
    console.error(json_rating)
    let json_rating_two;
    json_rating.then(result => json_rating_two)
    console.error("JSON RATING TWO")
    while(typeof json_rating_two == 'undefined') {
        console.error("waiting for a response")
    }
    console.error("final json value:")
    console.error(json_rating_two)
     this.setState({
      rating: json_rating_two['rating']
    })
    console.log("THIS IS THE RATING BOIII")
    console.log(this.state.rating)


     }.bind(this), 5000);
    */
    //this.props.postTicker()
  }

  handleRedirect = () => {}

  handleFailure = () => {}

  createTable = () => {
    let table = []
    table.push(
      <thead>
        {' '}
        <tr>
          <th scope="col">#</th>
          <th scope="col">Good Headlines</th>
          <th scope="col">Bad Headlines</th>
        </tr>
      </thead>
    )
    // Outer loop to create parent
    let table_subroutine = []
    for (
      let i = 0;
      i < Math.max(this.state.arrayvar.length, this.state.badheadlines.length);
      i++
    ) {
      let children = []
      //Inner loop to create children
      children.push(<th scope="row">{i}</th>)
      if (i < this.state.arrayvar.length) {
        children.push(<td>{this.state.arrayvar[i]}</td>)
      }

      if (i < this.state.badheadlines.length) {
        children.push(<td>{this.state.badheadlines[i]}</td>)
      }
      //Create the parent and add the children
      table_subroutine.push(<tr>{children}</tr>)
    }
    table.push(<tbody>{table_subroutine}</tbody>)
    return table
  }
  createUShould = () => {
    let ushould
    if (this.state.rating === 'BUY') {
      ushould = (
        <span className="you-should-probably-green">
          You should {this.state.rating.toLowerCase()}, most of the news is
          positive{' '}
        </span>
      )
    } else if (this.state.rating === 'SELL') {
      ushould = (
        <span className="you-should-probably-red">
          You should {this.state.rating.toLowerCase()}, most of the news is
          negative{' '}
        </span>
      )
    } else {
      ushould = (
        <span className="you-should-probably">
          {this.state.rating.toLowerCase()}{' '}
        </span>
      )
    }
    return ushould
  }

  createCountGoodBad = () => {
    let object_gb

    object_gb = (
      <span className="you-should-probably">
        There were {this.state.goodcount} good headlines and{' '}
        {this.state.badcount} bad headlines.
      </span>
    )
    return object_gb
  }

  render() {
    const goodcountlocal = this.state.goodcount
    let pie

    if (goodcountlocal != 0) {
      pie = (
        <VictoryPie
          style={{
            labels: { fill: 'black', fontSize: 20, fontWeight: 'bold' }
          }}
          colorScale={['green', 'tomato']}
          innerRadius={100}
          height={350}
          data={[
            { x: '+', y: this.state.goodcount },
            { x: '-', y: this.state.badcount }
          ]}
        />
      )
    } else {
      pie = <hr />
    }

    let form
    const ratinglocal = this.state.rating
    if (ratinglocal === 'NULL') {
      form = (
        <div>
          <Calendar
            className="calendar"
            onChange={this.onChangeDate}
            value={this.state.date}
            maxDate={new Date(2019, 6, 11)}
            minDate={new Date(2019, 0, 11)}
          />

          <form className="input-field-form">
            <div className="smalltext-signup">
              <h4 className="n-o-ta"> Name of Ticker </h4>
            </div>

            <FieldGroup
              id="formControlsTicker"
              size="5"
              maxlength="5"
              label="Ticker"
              placeholder="XXXX"
              className="input-field-login"
              onChange={this.onChangeTicker}
            />
            <h3 className="n-o-t">
              By using our product you agree to our terms and services
            </h3>
            <div className="hr-div">
              <hr className="style-eight" />
            </div>

            <div className="button-div">
              <button
                className="submit-button signup-submit-button"
                type="submit"
                onClick={this.onSubmit}
              >
                Submit
              </button>
              <hr />
              <hr />
            </div>
          </form>
        </div>
      )
    } else {
      /*
      form = (
        <div class="div-sq-master">
          <div class="divSquare">
            <div className="align-sq-pie">
              {this.createUShould()}
              <div>{pie}</div>
            </div>
          </div>

          <div class="divSquare">{this.createCountGoodBad()}</div>

          <div className="simple-clear"></div>

          <div class="divSquare">
            <div className="align-sq">
              <table class="table table-striped table-bordered personaltable">
                {this.createTable()}
              </table>
            </div>
          </div>

          <div class="divSquare">
            <div className="align-sq">
              <Thermometer
                theme="light"
                value={
                  100 *
                  (this.state.goodcount /
                    (this.state.goodcount + this.state.badcount))
                }
                max="100"
                format="°"
                size="large"
                height="450"
                className="thermo"
              />
            </div>
          </div>
        </div>
      ) */
      form = (
        <div className="account-div">
          <Grid.Row cards={true}>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={6}
                total={this.state.rating}
                label="Based on our criteria"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={-3}
                total="17"
                label="Closed Today"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={9}
                total="7"
                label="New Replies"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={3}
                total="27.3k"
                label="Followers"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={-2}
                total="$95"
                label="Daily earnings"
              />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={2}>
              <StatsCard
                layout={1}
                movement={-1}
                total="621"
                label="Products"
              />
            </Grid.Col>
          </Grid.Row>

          <Grid.Row cards={true} className="pies-and-big-numbers">
            <Grid.Col sm={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Article Ratio </Card.Title>
                </Card.Header>
                <Card.Body>
                  <C3Chart
                    /*
                onrendered = { function() {
                        d3.selectAll(".c3-chart-arc text").each(function(v) {
                        var label = d3.select(this);
                        var pos = label.attr("transform").match(/-?\d+(\.\d+)?/g);


                        if (pos[0] < 0) {
                            pos[0] = pos[0] - 40
                        }
                        if (pos[0] >= 0) {
                            pos[0] = pos[0] + 100
                        }
                        //pos[1] = pos[1] - 40
                        label.attr("transform", "translate("+ pos[0]  +","+ pos[1] +")");
                        })
                 }
                }


    */

                    className="donut"
                    data={{
                      columns: [
                        // each columns data
                        ['Positive', this.state.goodcount],
                        ['Negative', this.state.badcount]
                      ],
                      type: 'donut', // default type of chart
                      colors: {
                        Positive: colors['green'],
                        Negative: colors['red']
                      },
                      names: {
                        // name of each serie
                        Positive: 'Positive Articles',
                        Negative: 'Negative Articles'
                      },
                      labels: {
                        Positive: 'Positive Articles',
                        Negative: 'Negative Articles'
                      }
                    }}
                    style={{ height: '12rem' }}
                    donut={{
                      label: {
                        show: true,
                        format: function(value, ratio, id, name, label) {
                          return 'Category: '.concat(id)
                        }
                      }
                    }}
                    tooltip={{
                      format: {
                        name: function(name, ratio, id, index) {
                          return ''
                        },
                        value: function(value, ratio, id, index) {
                          return Math.trunc(ratio * 100)
                            .toString()
                            .concat('%')
                        }
                      }
                    }}
                    legend={{
                      show: false //hide legend
                    }}
                    padding={{
                      bottom: 0,
                      top: 0
                    }}
                  />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col sm={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Sentiment Ratio</Card.Title>
                </Card.Header>
                <Card.Body>
                  <C3Chart
                    style={{ height: '12rem' }}
                    data={{
                      columns: [
                        // each columns data
                        ['data1', 63],
                        ['data2', 44],
                        ['data3', 12],
                        ['data4', 14]
                      ],
                      type: 'pie', // default type of chart
                      colors: {
                        data1: colors['blue-darker'],
                        data2: colors['blue'],
                        data3: colors['blue-light'],
                        data4: colors['blue-lighter']
                      },
                      names: {
                        // name of each serie
                        data1: 'A',
                        data2: 'B',
                        data3: 'C',
                        data4: 'D'
                      }
                    }}
                    legend={{
                      show: false //hide legend
                    }}
                    padding={{
                      bottom: 0,
                      top: 0
                    }}
                  />
                </Card.Body>
              </Card>
            </Grid.Col>

            <Grid.Col sm={6} className="big-numbers">
              <ProgressCard
                header="Number of Negative Articles"
                content={this.state.goodcount}
                progressColor="red"
                progressWidth={
                  100 *
                  (this.state.badcount /
                    (this.state.goodcount + this.state.badcount))
                }
              />
            </Grid.Col>

            <Grid.Col sm={6} className="big-numbers">
              <ProgressCard
                header="Number of Positive Articles"
                content={this.state.badcount}
                progressColor="green"
                progressWidth={
                  100 *
                  (this.state.goodcount /
                    (this.state.goodcount + this.state.badcount))
                }
              />
            </Grid.Col>
          </Grid.Row>
        </div>
      )
    }

    return <div className="center-review-div">{form}</div>
  }
}