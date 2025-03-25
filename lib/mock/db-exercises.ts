interface Exercise {
  id: string;
  title: string;
  img: string;
  description: string;
}

export const exercises: Exercise[] = [
  {
    id: '0',
    title: 'Приседания со штангой',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqzFPofq8UXokBMeAUwxUDys2Pp4yd13ohzQ&s',
    description: 'Упражнение для развития мышц ног и ягодиц. Основное движение в пауэрлифтинге.',
  },
  {
    id: '1',
    title: 'Жим штанги лежа',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGY3uFFGeHROSSm91pumljwa9vq60qqsXVsQ&s',
    description: 'Упражнение для развития грудных мышц, трицепсов и передних дельт.',
  },
  {
    id: '2',
    title: 'Становая тяга',
    img: 'https://diary-workout.ru/stc/exr/20/img1280x800.jpg',
    description:
      'Упражнение для развития мышц спины, ног и ягодиц. Одно из основных в пауэрлифтинге.',
  },
  {
    id: '3',
    title: 'Подтягивания на перекладине',
    img: 'https://cross.expert/wp-content/uploads/2017/04/podtyagivanie-srednim-hvatom.jpg',
    description: 'Упражнение для развития широчайших мышц спины и бицепсов.',
  },
  {
    id: '4',
    title: 'Отжимания на брусьях',
    img: 'https://cross.expert/wp-content/uploads/2017/01/otzhimaniya-na-brusyah-zhim.jpg',
    description: 'Упражнение для развития трицепсов, грудных мышц и передних дельт.',
  },
  {
    id: '5',
    title: 'Жим гантелей сидя',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW1yXbC-jM6E3En2sDU0L9P17zd72_4pQPYw&s',
    description: 'Упражнение для развития плеч, особенно средних и передних пучков дельт.',
  },
  {
    id: '6',
    title: 'Выпады с гантелями',
    img: 'https://cross.expert/wp-content/uploads/2016/12/vypady-s-gantelyami-mushcy.jpeg',
    description: 'Упражнение для развития мышц ног и ягодиц. Улучшает баланс и координацию.',
  },
  {
    id: '7',
    title: 'Планка',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgvmZw0Diz3KcKDoZu5cJkOllIJ0tEnmXPuw&s',
    description: 'Упражнение для укрепления мышц кора, улучшения осанки и стабильности.',
  },
  {
    id: '8',
    title: 'Скручивания на пресс',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRhaey-48kYGHqiYfRR9U8_kjOgPmC-2C6uw&s',
    description: 'Упражнение для развития прямых мышц живота.',
  },
  {
    id: '9',
    title: 'Бег на беговой дорожке',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOIW8_dhq2Z28nTyX4kAVpyZkF9hIq_BvVxQ&s',
    description: 'Кардиоупражнение для улучшения выносливости и сжигания калорий.',
  },
];
