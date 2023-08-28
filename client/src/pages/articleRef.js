import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import formatDate from '../context/formatDate';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Stack from 'react-bootstrap/Stack';
import Form from "react-bootstrap/Form";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const ArticleCopy = () => {
  const { id: articleId, title: flag} = useParams();
  const [authors, setAuthors] = useState([]);
  const [degreeCentrality, setDegreeCentrality] = useState(0)
  const [authorRating, setAuthorRating] = useState(0)
  const [citations, setCitations] = useState([])
  const [title, setTitle] = useState("")
  const [pubDate, setPubDate] = useState(null)
  const [summary, setSummary] = useState(null)
  const [link, setLink] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [show, setShow] = useState(false);



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
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value)
  }

  const semanticLink = "https://api.semanticscholar.org/graph/v1/paper/"
        + articleId
        + "?fields=title,publicationDate,url,openAccessPdf,isOpenAccess,citations,references,referenceCount,citationCount,tldr,authors.name,authors.hIndex"
  const navigate = useNavigate();

  const calcAuthorRating = (a) => {
    var sum = 0
    var i = 0
    for (i in a) {
        sum += a[i]["hIndex"]
    }
    return Math.round(sum / i)
  }

  const authorsNames = (a) => {
    var res = []
    for (var i in a) {
        res.push(a[i]["name"])
    }
    return res;
  }
  

  useEffect(() => {
    async function getData() {
      fetch(semanticLink)
      .then(response => response.json())
      .then(data => {
        if (data["citations"]) setCitations(data["citations"])
        if (data["authors"]) {
            setAuthors(authorsNames(data['authors']));
            setAuthorRating(calcAuthorRating(data['authors']))
        }
        if (data['citationCount'] && data['referenceCount']) setDegreeCentrality(data["citationCount"] + data["referenceCount"]);
        setTitle(data['title'])
        setPubDate(data["publicationDate"])
        if (data["tldr"] && data["tldr"]["text"]) setSummary(data['tldr']["text"])
        if (data["isOpenAccess"]) {
            setLink(data["openAccessPdf"]["url"])
        } else {
            setLink(data["url"])
        }
        console.log(`successfully fetched ${data["title"]}`)
      })
    }
    try {
        if (articleId) getData();
    } catch (err) {
        console.log("Error", err.message)
    }
  }, [articleId]);
  
  return (
    <>
      {articleId ? <Container className="my-5 text-justified" style={{ maxWidth: '800px' }}>
        <h1><a href={link}>{title}</a></h1>
        <div className="text-secondary mb-1">{pubDate && formatDate(pubDate)}</div>
        <Row>
            <Col md="auto">
              <OverlayTrigger
                placement='right'
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipArticle}
                style={{display:"flex"}}
              >
                <div className="text-secondary mb-4">{"Article rating - " + (degreeCentrality !== Infinity ? degreeCentrality : "")}</div>
              </OverlayTrigger>
            </Col>
            <Col/>
            <Col md="auto">
              <OverlayTrigger
                placement='left'
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipAuthor}
              >
                <div className="text-secondary mb-4" style={{display: "flex", alignItems: "end"}}>{"Author rating - " + (authorRating !== Infinity ? authorRating : '')}</div>
              </OverlayTrigger>
            </Col>
          </Row>
        <div className='text-secondary mb-2' style={{display: "flex", alignItems: "center", margin: 5}}>{summary ? summary : ""}</div>
        <div className="text-secondary mb-5">- {authors && authors.join(", ")}</div>
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
                {citations && citations.filter((article) => {
                        return article.title.toLowerCase().match(searchInput.toLowerCase())
                    }).map((citation) => {
                      console.log(citation);
                      return (
                        <ListGroup.Item key={citation.paperId}>
                          <div>
                            {citation.paperId ? <Link to={`/articles/${citation.paperId}/${citation.title}`} style={{ textDecoration: 'none' }}>{citation.title}</Link> : ""}
                          </div>
                        </ListGroup.Item>
                      )
                })}
              </ListGroup>
            </Offcanvas>
          </Row>
          <Link to="/" style={{ display: "flex", alignItems: "center", marginTop: 25 }}>Back to Home</Link>
      </Container> : "article not found"}
    </>
  );
};

export default ArticleCopy;