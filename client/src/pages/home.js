import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import formatDate from '../context/formatDate';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { components } from "react-select";
import { confs } from "../confs.js";
import { default as ReactSelect } from "react-select";


const Home = () => {
    const [articles, setArticles] = useState([]);
    const [sort, setSort] = useState("published");
    const [sortOrder, setSortOrder] = useState("Newest");
    const [optionSelected, setOptionSelected] = useState(null)
    const [filteredConfs, setFilteredConfs] = useState([])
    const sortOrders = [
      {name : "Newest", value : "1"},
      {name : "Oldest", value : "2"},
    ];

    useEffect(() => {
        async function getData() {
            try {
              const {data} = await axios.get("/api/articles", {
                params: {
                  sort_by: sort,
                  order: sortOrder,
                }
              });
              setArticles(data);          
            } catch (err) {
              console.log(err)
            }
        }
        getData()
    }, [sortOrder, sort]);    

    const getConfsArray = (confDict) => {
      let confArr = []
      for (let i in confDict) {
        confArr.push(confDict[i].value)
      }
      return confArr;
    }

    useEffect(() => {
      async function getData() {
        try {
          const {data} = await axios.post("/api/articles/conf", {
            body: {
              confs: getConfsArray(optionSelected)
            }
          });
          setFilteredConfs(data);
        } catch (err) {
          console.log("Error", err.message)
        }
      }
      optionSelected ? getData() : setFilteredConfs([])
    }, [optionSelected])

    const Option = (props) => {
      return (
        <div>
          <components.Option {...props}>
            <input
              type="checkbox"
              checked={props.isSelected}
              onChange={() => null}
            />{" "}
            <label>{props.label}</label>
          </components.Option>
        </div>
      );
    };

    const handleChange = (selected) => {
      setOptionSelected(selected);
    }
    
    return (
        <>
          <Container className="my-5" style={{ maxWidth: '800px' }} >
            <Row>
              <Col>
                <h2 className="text-center">ML articles</h2>
              </Col>
              <Col>
                <ButtonGroup>
                  {sortOrders.map((order, ind) => (
                    <ToggleButton
                      key={ind}
                      id={`order-${ind}`}
                      type="radio"
                      variant={ind % 2 ? "info" : "info"}
                      name="Sort Order"
                      value={order.name}
                      checked={sortOrder===order.name}
                      onChange={(e) => setSortOrder(e.currentTarget.value)}
                    >
                      {order.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </Col>
              <Col>
                <span
                  className="d-inline-block"
                  data-toggle="popover"
                  data-trigger="focus"
                  data-content="Select conference(s)"
                >
                  <ReactSelect
                    options={confs}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option
                    }}
                    onChange={handleChange}
                    allowSelectAll={true}
                    value={optionSelected}
                  />
                </span>
              </Col>
            </Row>
          </Container>
          <Container style={{ maxWidth: '800px' }}>
            <ListGroup variant="flush" as="ol">
              {
                
                (filteredConfs.length > 0 ? filteredConfs : articles).map((article) => {
                  // Map the articles to JSX
                  return (
                    <ListGroup.Item key={article._id}> 
                      <div className="fw-bold h3">
                        <Link to={`/articles/${article._id}`} style={{ textDecoration: 'none' }}>{article.title}</Link>
                      </div>
                      {article.conference ? "Presented on " + article.conference : ""}
                      <div>{article.authors.join(', ')} - <span className="text-secondary">{formatDate(article.published)}</span></div>
                    </ListGroup.Item>
                  );
                })
              }
              
            </ListGroup>
          </Container>
        </>
      );
}



export default Home;