import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import formatDate from '../context/formatDate';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Stack from 'react-bootstrap/Stack';
import Form from "react-bootstrap/Form";


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Article = () => {
  const { id: articleId} = useParams();
  const [article, setArticle] = useState({});
  const [show, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState("")


  const handleClose = () => {
    setShow(false)
    setSearchInput("")
  };
  const handleShow = () => setShow(true);

  const renderTooltipArticle = (props) => (
    <Tooltip id="article-tooltip" {...props}>
      Article rating is the sum of citations and references
    </Tooltip>
  );

  const renderTooltipAuthor = (props) => (
    <Tooltip id="author-tooltip" {...props}>
      Author rating is the average of H-indices of all authors
    </Tooltip>
  );

  useEffect(() => {
    async function getData() {
      console.log(articleId)
      const { data } = await axios.get(`https://meatael.pythonanywhere.com/api/articles/${articleId}`);
      console.log(data);
      setArticle(data);
    }
    try {
      getData();
    } catch (err) {
      console.log("Error", err.message)
    }
  }, [articleId]);

  const pdf_link = (links) => {
    links = links.split(", ")
    for (let i in links) {
      if (links[i].includes("pdf")) {
        return links[i]
      }
    }
    console.log(links)
    return links
  }

  const not_pdf_links = (links) => {
    let links1 = links.split(", ")
    return links1.filter(a => a !== pdf_link(links))
  }
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value)
}

  return (
      <>
        <Container className="my-4 text-justified" style={{ maxWidth: '800px' }}>
          <h1><a href={article.links && pdf_link(article.links)}>{article.title}</a></h1>
          <div className="text-secondary mb-1">{article.conference ? "Presented on " + article.conference : ""}</div>
          <div className="text-secondary mb-1">{article.published && formatDate(article.published)}</div>
          <Row>
            <Col>
              <OverlayTrigger
                placement='left'
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipArticle}
              >
                <div className="text-secondary mb-4">{"Article rating - " + article.articleRating}</div>
              </OverlayTrigger>
            </Col>
            <Col>
              <OverlayTrigger
                placement='left'
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipAuthor}
              >
                <div className="text-secondary mb-4" style={{display: "flex", alignItems: "end"}}>{"Author rating - " + article.authorRating}</div>
              </OverlayTrigger>
            </Col>
          </Row>
          <div className='text-secondary mb-2' style={{display: "flex", alignItems: "center", margin: 5}}>{article.summary && article.summary}</div>
          <div className="text-secondary mb-5">- {article.authors}</div>
          <Row>
            <Button variant="light" onClick={handleShow} style={{alignItems: "center"}}>
            Citations
            </Button>
            <Offcanvas show={show} onHide={handleClose} placement='bottom' scroll="true">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Articles that have cited this document</Offcanvas.Title>
              </Offcanvas.Header>
              <Form.Control type="text"
                                  placeholder='Search by title'
                                  onChange={handleSearch}
                                  value={searchInput}/>
              <ListGroup style={{overflowY: 'scroll'}}>
                {article.citations && article.citations.filter((article) => {
                        return article.paperId && article.title.toLowerCase().match(searchInput.toLowerCase())
                    }).map((citation) => {
                      console.log(citation);
                      return (
                        <ListGroup.Item key={citation.paperId}>
                          <div>
                            {<Link to={`/articles/${citation.paperId}/${citation.title}`} style={{ textDecoration: 'none' }}>{citation.title}</Link>}
                          </div>
                        </ListGroup.Item>
                      )
                })}
              </ListGroup>
            </Offcanvas>
          </Row>
          <Row>
            <Stack direction="horizontal" gap={4}>
              <div className='text-secondary mb-5'>{article.links && (not_pdf_links(article.links) ? "Other Links" : "")}</div>
              <div className='text-secondary mb-5'>{article.links &&
                not_pdf_links(article.links).map((link) => {
                  return <a href={link}>{link}</a>
                })}
              </div>
            </Stack>
          </Row>
          <Link to="/" style={{ display: "flex", alignItems: "center", marginTop: 25 }}>Back to Home</Link>
        </Container>
      </>
  );
};

export default Article;
