import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import formatDate from '../context/formatDate';
import axios from "axios";

const ArticleCopy = () => {
  const { id: articleId, title: flag} = useParams();
  const [authors, setAuthors] = useState([]);
  const [degreeCentrality, setDegreeCentrality] = useState(0)
  const [authorRating, setAuthorRating] = useState(0)
  const [references, setReferences] = useState([])
  const [title, setTitle] = useState("")
  const [pubDate, setPubDate] = useState(null)
  const [summary, setSummary] = useState(null)
  const [link, setLink] = useState(null)
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
        if (data["references"]) setReferences(data["references"])
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
        <div className="text-secondary mb-4">{"Article rating - " + degreeCentrality + ". Author rating - " + authorRating}</div>
        <div className='text-secondary mb-2'>{summary ? summary : ""}</div>
        <div className="text-secondary mb-5">- {authors && authors.join(", ")}</div>
        {references.length > 0 ? <div className='text-secondary mb-6'>References</div> : ""}
        <ListGroup variant="flush" as="ol">
          {references.map((reference) => {
            if (reference.paperId)
            return (
              <ListGroup.Item key={reference.paperId}>
                <div>
                    {reference.paperId ? <Link to={`/articles/${reference.paperId}/${reference.title}`} style={{ textDecoration: 'none' }}>{reference.title}</Link> : ""}
                </div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
        {/* <div className="text-secondary mb-6">{article.links && (not_pdf_links(article.links) ? "Other Links" : "")}</div> */}
        {/* <div className="text-secondary mb-6">{article.links &&
                                              not_pdf_links(article.links).map((link) => {
                                                return <a href={link}>{link}</a>
                                              })}</div> */}
        <Link to="/" style={{ textDecoration: 'none' }}>Back to Home</Link>
      </Container> : "article not found"}
    </>
  );
};

export default ArticleCopy;