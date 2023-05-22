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
    const [searchInput, setSearchInput] = useState("")
    const [centralityFilter, setCentralityFilter] = useState(0)
    const [authorFilter, setAuthorFilter] = useState(0)

    useEffect(() => {
        async function getData() {
            try {
              const {data} = await axios.get("https://ml-articles-server.onrender.com/api/articles", {
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
          const {data} = await axios.post("https://ml-articles-server.onrender.com/api/articles/conf", {
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

    const handleSearch = (e) => {
      e.preventDefault();
      setSearchInput(e.target.value)
    }

    const prettify_sort_option = () => {
      if (sort === "published") return "publication date"
      if (sort === "articleRating") return "article rating"
      if (sort === "authorRating") return "author rating"
    }

    const handleSortOrderClick = () => {
      setSortOrder(!sortOrder, articles)
    }

    const sorted_articles = (arts) => {
      if (sort === "published") {
        arts = arts.sort((a,b) => new Date(formatDate(a["published"])) - new Date(b["published"]))
        return sortOrder ? arts : arts.slice().reverse()
      }
      return sortOrder ? arts.sort((a,b) => a[sort] - b[sort]) : arts.sort((a,b) => b[sort] - a[sort])
    }

    const conf_filter = (art) => {
      console.log(optionSelected)
      for (var elem in optionSelected) {
        if (art.conf && art.conf.match(optionSelected[elem]["value"])) {
          return art
        }
      }
      return null
    }
    
    return (
        <>
          <Container className="my-5" style={{ maxWidth: '800px' }} >
            <Row>
              <h2 className="text-center">ML articles</h2>
            </Row>
            <Row>
              <Col>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={"Sort by " + prettify_sort_option()}
                  variant="light"
                >
                  <Dropdown.Item onClick={()=>setSort("published")}>Publication Date</Dropdown.Item>
                  <Dropdown.Item onClick={()=>setSort("articleRating")}>Article Rating</Dropdown.Item>
                  <Dropdown.Item onClick={()=>setSort("authorRating")}>Author Rating</Dropdown.Item>
                </DropdownButton>
                <Button
                    variant="light"
                    onClick={handleSortOrderClick}
                  >
                    {sortOrder ? "↑" : "↓"}
                </Button>
              </Col>
              <Col>
                {"Conference filter "}
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
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  placeholder='Minimal article rating'
                  onChange={(e) => {setCentralityFilter(e.target.value)}}
                />
                </Col>
                <Col>
                <Form.Control
                  type="number"
                  placeholder='Minimal author rating'
                  onChange={(e) => {setAuthorFilter(e.target.value)}}
                />
              </Col>
            </Row>
            <Row>
                <Form.Control
                  type="text"
                  placeholder='Search by title'
                  onChange={handleSearch}
                  value={searchInput}
                />
            </Row>
          </Container>
          <Container style={{ maxWidth: '800px' }}>
            <ListGroup variant="flush" as="ol">
              {
                
                (filteredConfs.length > 0
                  ? (sortOrder ? filteredConfs : filteredConfs.slice().reverse())
                  : (sorted_articles(articles))).filter((article) => {
                    return article.authorRating >= authorFilter
                        && article.articleRating >= centralityFilter
                    }).filter((article) => {return article.title.toLowerCase().match(searchInput.toLowerCase())}).map((article) => {
                  // Map the articles to JSX
                  return (
                    <ListGroup.Item key={article._id}> 
                      <div className="fw-bold h3">
                        <Link to={`/articles/${article._id}`} style={{ textDecoration: 'none' }}>{article.title}</Link>
                      </div>
                      {article.conference ? "Presented on " + article.conference : ""}
                      <div>{article.authors.join(', ')} - <span className="text-secondary">{formatDate(article.published)}</span></div>
                      <div>{"Article rating - " + article.articleRating}</div>
                      <div>{"Author rating - " + article.authorRating}</div>
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
