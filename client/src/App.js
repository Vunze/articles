import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Article from './pages/article';
import ArticleCopy from './pages/articleRef';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="/">Machine Learning Articles</Navbar.Brand>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="articles/:id" element={<Article/>} />
        <Route path="articles/:id/:fromArticle" element={<ArticleCopy/>} />
      </Routes>
    </>
  );
}

export default App;