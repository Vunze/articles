import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import formatDate from '../context/formatDate';
import axios from "axios";

const Article = () => {
  const { id: articleId} = useParams();
  const [article, setArticle] = useState({});

  useEffect(() => {
    async function getData() {
      console.log(articleId)
      const { data } = await axios.get(`http://meatael.pythonanywhere.com/api/articles/${articleId}`);
      setArticle(data);
    }
    try {
      getData();
    } catch (err) {
      console.log("Error", err.message)
    }
  }, [articleId]);

  const pdf_link = (links) => {
    for (var i in links) {
      if (links[i].includes("pdf")) {
        return links[i]
      }
    }
    console.log(links)
    return links
  }

  const not_pdf_links = (links) => {
    links = links.split(", ")
    return links.filter(a => a !== pdf_link(links))
  }


  return (
      <>
        <Container className="my-5 text-justified" style={{ maxWidth: '800px' }}>
          <h1><a href={article.links && pdf_link(article.links)}>{article.title}</a></h1>
          <div className="text-secondary mb-1">{article.published && formatDate(article.published)}</div>
          <div className="text-secondary mb-4">{"Article rating - " + article.articleRating + ". Author rating - " + article.authorRating}</div>
          <div className='text-secondary mb-2'>{article.summary && article.summary}</div>
          <div className="text-secondary mb-5">- {article.authors}</div>
          <div className='text-secondary mb-6'>References</div>
          <ListGroup variant="flush" as="ol">
            {article.references && article.references.map((reference) => {
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
          <div className="text-secondary mb-6">{article.links && (not_pdf_links(article.links) ? "Other Links" : "")}</div>
          <div className="text-secondary mb-6">{article.links &&
          not_pdf_links(article.links).map((link) => {
            return <a href={link}>{link}</a>
          })}</div>
          <Link to="/" style={{ textDecoration: 'none' }}>Back to Home</Link>
        </Container>
      </>
  );
};

export default Article;
