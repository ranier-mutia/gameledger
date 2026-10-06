import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GAMES = [
  {
    id: 1,
    title: "Elden Ring",
    genre: "Action RPG",
    rating: "4.9",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.",
    image: "https://picsum.photos/id/10/800/400",
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    genre: "Sci-Fi RPG",
    rating: "4.5",
    description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power.",
    image: "https://picsum.photos/id/20/800/400",
  },
];

export function GameCarousel() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
      >
        {GAMES.map((game) => (
          <SwiperSlide key={game.id}>
            {/* Custom Content Div */}
            <div className="game-card">
              <img src={game.image} alt={game.title} className="game-image" />
              <div className="game-info">
                <span className="game-badge">{game.genre}</span>
                <h2>{game.title}</h2>
                <p>{game.description}</p>
                <div className="game-footer">
                  <span>Rating: ⭐ {game.rating}</span>
                  <button className="btn-details">View Game</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}