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


const Home = () => {
    const [articles, setArticles] = useState([]);
    const [sort, setSort] = useState("published");
    const [sortOrder, setSortOrder] = useState("desc");
    const [confs, setConfs] = useState([]);
    const sortOrders = [
      {name : "Descending", value : "1"},
      {name : "Ascending", value : "2"},
    ];
    const confsFile = require("./result.txt");
    fetch(confsFile)
      .then(response => response.text())
      .then(text => setConfs([text]));

    const confToggle = React.forwardRef(( {children, onClick}, ref) => (
      <a
        href=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
        &#x25bc;
      </a>
    ));
    
    const confMenu = React.forwardRef(
      ({children, style, className, "aria-labelledby" : labeledBy}, ref) => {
        const [value, setValue] = useState("");
        return (
          <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
          >
            <Form.Control
              autoFocus
              className='mx-3 my-2 w-auto'
              placeholder='Type to filter..'
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            <ul className='list-unstyled'>
              {React.Children.toArray(children).filter(
                (child) =>
                  !value || child.props.children.toLowerCase().startsWith(value),
              )}
            </ul>
          </div>
        )
      }
    )

    useEffect(() => {
        async function getData() {
            const {data} = await axios.get("/api/articles", {
              params: {
                sort_by: sort,
                order: sortOrder,
              }
            });
            console.log(sort)
            console.log(sortOrder)
            // maybe data.data.articles
            setArticles(data);
        }
        getData()
    }, [sortOrder, sort]);
    
    return (
        <>
          <Container className="my-5" style={{ maxWidth: '800px' }} >
            {/* <Image
              src="fractals_one.png"
              width="150"
              style={{ borderRadius: '50%' }}
              className="d-block mx-auto img-fluid"
            /> */}
            <Row>
              <Col>
                <h2 className="text-center">ML articles</h2>
              </Col>
              <Col>
                <Dropdown>
                  <Dropdown.Toggle variant="warning" id="dropdown-basic">
                    {`Sort by ${sort}`}
                  </Dropdown.Toggle>
                  <DropdownMenu>
                    <Dropdown.Item onClick={() => setSort("relevancy")}>Relevancy</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSort("published")}>Published</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSort("announced")}>Announced</Dropdown.Item>
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col>
                <ButtonGroup>
                  {sortOrders.map((order, ind) => (
                    <ToggleButton
                      key={ind}
                      id={`order-${ind}`}
                      type="radio"
                      variant={ind % 2 ? "warning" : "secondary"}
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
                <Dropdown>
                  <Dropdown.Toggle as={confToggle} id="dropdown-custom-components">
                    Conference
                  </Dropdown.Toggle>
                  <DropdownMenu as={confMenu}>
                    {confs.map((name) => (
                      <Dropdown.Item>{name}</Dropdown.Item>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
          </Container>
          <Container style={{ maxWidth: '800px' }}>
            <ListGroup variant="flush" as="ol">
              {
                articles.map((article) => {
                  // Map the articles to JSX
                  return (
                    <ListGroup.Item key={article._id}> 
                      <div className="fw-bold h3">
                        <Link to={`/articles/${article._id}`} style={{ textDecoration: 'none' }}>{article.title}</Link>
                      </div>
                      <div>{article.author} - <span className="text-secondary">{formatDate(article.published)}</span></div>
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