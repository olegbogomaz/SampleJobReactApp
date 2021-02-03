import React from "react";
import { render } from "react-dom";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  state = {
    loading: true,
    error: "",
    jobs: null,
    city: null
  };
  loadData = () => {
    this.setState({ loading: true });
    return axios({
      url: "https://api.graphql.jobs",
      method: "post",
      data: {
        query:
          `
            query Jobs {
                jobs {
                  id
                  title
                  cities(where: { name_starts_with: "` +
          this.state.city +
          `" }) {
                    name
                    country {
                      name
                    }
                  }
                }
              }
            `
      }
    })
      .then((result) => {
        console.log(result);
        this.setState({
          jobs: result.data.data.jobs,
          loading: false,
          error: false
        });
      })
      .catch((error) => {
        console.error("error: ", error);
        this.setState({
          error: `${error}`,
          loading: false
        });
      });
  };
  componentDidMount() {
    this.loadData();
  }
  render() {
    const { loading, error, jobs } = this.state;
    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return (
        <p>
          There was an error loading the jobs.{" "}
          <Button onClick={this.loadData}>Try again</Button>
        </p>
      );
    }
    return (
      <div>
        <h1>Jobs</h1>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Enter City"
            aria-label="City"
            aria-describedby="basic-addon2"
            value={this.state.city}
            onChange={(e) => this.setState({ city: e.target.value })}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={this.loadData}>
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <ListGroup>
          {jobs.map((job) => (
            <ListGroup.Item key={job.id}>
              <p>
                <b>{job.title}</b>
              </p>
              {job.cities.map((city, index) => (
                <span>
                  <i>{city.name}</i>
                  {index === job.cities.length - 1 ? (
                    <span></span>
                  ) : (
                    <span>,</span>
                  )}
                </span>
              ))}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
