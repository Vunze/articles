import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import formatDate from '../context/formatDate';
import axios from "axios";

const Article = () => {
  const { id: articleId } = useParams();
  const [article, setArticle] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const { data } = await axios.get(`/api/articles/${articleId}`);
      setArticle(data);
    }
    getData();
  }, [articleId]);
  
  
  return (
    <>
      <Container className="my-5 text-justified" style={{ maxWidth: '800px' }}>
        <h1>{article.title}</h1>
        <div className="text-secondary mb-4">{formatDate(article.published)}</div>
        {article.tags?.map((tag) => <span>{tag} </span>)}
        <div className="h4 mt-5">{article.title}</div>
        <div className="text-secondary mb-5">- {article.author}</div>
        <Link to="/" style={{ textDecoration: 'none' }}>; Back to Home</Link>
      </Container>
    </>
  );
};

export default Article;