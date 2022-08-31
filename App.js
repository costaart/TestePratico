import { Col, Pagination, Row } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { AiFillFilter, AiOutlineFilter } from 'react-icons/ai';
import './App.css';
import Field from './components/Field';
import Title from './components/Title';
const App = () => {
  const [data, setData] = useState();
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [preview, setPreview] = useState(false);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [sorted, setSorted] = useState(false);
  const pageSize = 12;
  const [maxIndex, setMaxIndex] = useState(pageSize);
  const [minIndex, setMinIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemVariants = {
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'circOut',
      },
    },
    hidden: {
      opacity: 0,
      x: 200,
      transition: {
        duration: 0.3,
        ease: 'circOut',
      },
    },
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    modifyDataTable();
  }, [data, searchText]);

  async function getData() {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const results = await response.json();
    setData(results);
  }

  function translateStatus(status) {
    switch (status) {
      case 'Alive':
        return 'Vivo';
      case 'unknown':
        return 'Desconhecido';
      case 'Dead':
        return 'Morto';
    }
  }

  function translateGender(gender) {
    switch (gender) {
      case 'Male':
        return 'Masculino';
      case 'Female':
        return 'Feminino';
      case 'unknown':
        return 'Desconhecido';
    }
  }

  function modifyDataTable() {
    if (data !== undefined) {
      let results = [...data.results];
      let fields = [];
      results.forEach((item) => {
        let itemName = item.name.toUpperCase();
        if (itemName.includes(searchText)) {
          fields.push(item);
        }
      });

      setSearchData(fields);
    }
  }

  function compareName(a, b) {
    const name1 = a.name.toUpperCase();
    const name2 = b.name.toUpperCase();

    let comparison = 0;

    if (name1 > name2) {
      comparison = 1;
    } else if (name1 < name2) {
      comparison = -1;
    }
    return comparison;
  }

  function createData() {
    let results = [...searchData];
    return results.map(
      (item, index) =>
        index >= minIndex &&
        index < maxIndex && (
          <tr
            onMouseEnter={() => {
              setName(item.name);
              setImage(item.image);
              setPreview(true);
            }}
            onMouseLeave={() => setPreview(false)}
          >
            <td>{item.name}</td>
            <td>{translateStatus(item.status)}</td>
            <td>{translateGender(item.gender)}</td>
          </tr>
        ),
    );
  }

  function changePage(page) {
    setCurrentPage(page);
    setMinIndex((page - 1) * pageSize);
    setMaxIndex(page * pageSize);
  }

  return (
    <div className="app">
      <Row justify="center">
        <Col xs={{ span: 6 }}>
          <Row justify="center">
            <Col xs={{ span: 24 }}>
              <Row justify="center">
                <Field>
                  <h1>Rick and Morty</h1>
                </Field>

                <Field style={{ width: '100%' }}>
                  <input
                    style={{ width: '100%' }}
                    onChange={(e) =>
                      setSearchText(e.target.value.toUpperCase())
                    }
                    placeholder="Procure algum personagem..."
                  />
                </Field>
              </Row>
            </Col>
            <Col xs={{ span: 24 }}>
              <Row justify="center">
                {searchData.length > 0 ? (
                  <Field style={{ marginTop: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>
                            <span
                              className="filter-icon"
                              onClick={() => {
                                const data = [...searchData];
                                if (!sorted) {
                                  data.sort(compareName);
                                  setSearchData(data);
                                  setSorted(true);
                                } else {
                                  data.reverse(compareName);
                                  setSearchData(data);
                                  setSorted(false);
                                }
                              }}
                            >
                              {!sorted ? <AiOutlineFilter /> : <AiFillFilter />}
                            </span>
                            Nome
                          </th>
                          <th>Condição</th>
                          <th>Gênero</th>
                        </tr>
                      </thead>
                      <tbody>{createData()}</tbody>
                    </table>
                  </Field>
                ) : (
                  <Title as="h2">Nenhum personagem encontrado.</Title>
                )}
              </Row>
            </Col>
            <Col xs={{ span: 24 }}>
              <Row>
                <Field>
                  <Pagination
                    className="paginator"
                    current={currentPage}
                    total={searchData.length}
                    pageSize={pageSize}
                    onChange={(page) => changePage(page)}
                  />
                </Field>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={{ span: 6 }}>
          <Row justify="center">
            <Field
              variants={itemVariants}
              animate={preview ? 'show' : 'hidden'}
            >
              <img src={image} width="250px" height="250px" />
            </Field>
            <Field
              animate={
                preview
                  ? {
                      x: [200, 0],
                      opacity: [0, 1],
                      transition: {
                        duration: 0.3,
                        delay: 0.2,
                        ease: 'circOut',
                      },
                    }
                  : {
                      x: [0, 200],
                      opacity: [1, 0],
                    }
              }
            >
              <Title as="h2">{name}</Title>
            </Field>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default App;
