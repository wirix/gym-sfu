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
];
