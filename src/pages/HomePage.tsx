import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const categories = [
    {
      id: 'dendrology',
      title: 'Дендрология',
      description:
        'Изучение древесных растений, их анатомии, физиологии, систематики и экологических характеристик',
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80',
      link: '/dendrology',
    },
    {
      id: 'flora',
      title: 'Флора',
      description:
        'Исследование видового разнообразия растений, их распространения и взаимодействия с окружающей средой',
      image:
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80',
      link: '/flora',
    },
    {
      id: 'floriculture',
      title: 'Цветоводство',
      description:
        'Искусство выращивания цветов, создания композиций и ухода за декоративными растениями',
      image:
        'https://images.unsplash.com/photo-1523810192022-5a0fb9aa7ff8?auto=format&fit=crop&q=80',
      link: '/floriculture',
    },
  ];

  return (
    <Box className='gradient-background' sx={{ minHeight: '100vh' }}>
      <header className='header'>
        <Container className='container'>
          <Typography variant='h1' component='h1'>
            Ботанический сад
          </Typography>
          <Typography variant='body1' component='p'>
            Погрузитесь в удивительный мир растений и откройте для себя
            природное разнообразие нашей планеты
          </Typography>
        </Container>
      </header>

      <section className='section'>
        <Container className='container'>
          <div className='category-grid'>
            {categories.map((category) => (
              <Link
                to={category.link}
                key={category.id}
                style={{ textDecoration: 'none' }}
              >
                <div className='category-card'>
                  <img
                    src={category.image}
                    alt={category.title}
                    className='category-image'
                  />
                  <div className='category-content'>
                    <h2 className='category-title'>{category.title}</h2>
                    <p className='category-description'>
                      {category.description}
                    </p>
                    <span className='btn-explore'>Исследовать</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </Box>
  );
};

export default HomePage;
