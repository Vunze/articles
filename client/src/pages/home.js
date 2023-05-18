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
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { components } from "react-select";
import { confs } from "../confs.js";
import { default as ReactSelect } from "react-select";
import Button from 'react-bootstrap/esm/Button';


const Home = () => {
    const [articles, setArticles] = useState([]);
    const [sort, setSort] = useState("published");
    const [sortOrder, setSortOrder] = useState(false);
    const [optionSelected, setOptionSelected] = useState(null)
    const [filteredConfs, setFilteredConfs] = useState([])

    useEffect(() => {
        async function getData() {
            try {
              const {data} = await axios.get("/api/articles", {
                params: {
                  sort_by: sort,
                  order: sortOrder,
                }
              });
              console.log("Done")
              setArticles(data);          
            } catch (err) {
              console.log(err)
            }
        }
        console.log("Fetching articles")
        getData()
    }, []);

    useEffect(() => {
      setArticles([...articles].sort((a,b) => a[sort] - b[sort]))
    }, sort)

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

    const prettify_sort_option = () => {
      if (sort === "published") return "publication date"
      if (sort === "article_rate") return "article rating"
      if (sort === "author_rate") return "author rating"
    }

    const handleSortOrderClick = () => {
      setSortOrder(!sortOrder, articles)
    }
    
    return (
        <>
          <Container className="my-5" style={{ maxWidth: '800px' }} >
            <Row>
              <Col>
                <h2 className="text-center">ML articles</h2>
              </Col>
              <Col>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={"Sort by " + prettify_sort_option()}
                  variant="success"
                >
                  <Dropdown.Item onClick={()=>setSort("published")}>Publication Date</Dropdown.Item>
                  <Dropdown.Item>Article Rating</Dropdown.Item>
                  <Dropdown.Item>Author Rating</Dropdown.Item>
                </DropdownButton>
                <Button
                  variant="success"
                  onClick={handleSortOrderClick}
                >
                  {sortOrder ? "down" : "up"}
                </Button>
                {/* <ButtonGroup>                  
                  {sortOrders.map((order, ind) => (
                    <ToggleButton
                      key={ind}
                      id={`order-${ind}`}
                      type="radio"
                      variant={"success"}
                      name="Sort Order"
                      value={order.name}
                      checked={sortOrder===order.name}
                      onChange={(e) => setSortOrder(!sortOrder)}
                    >
                      {order.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup> */}
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
                
                (filteredConfs.length > 0
                  ? (sortOrder ? filteredConfs : filteredConfs.slice().reverse())
                  : (sortOrder ? articles : articles.slice().reverse())).map((article) => {
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