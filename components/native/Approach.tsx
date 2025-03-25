// import React from 'react';

// export const Approach = () => {
//   return (
//     <div className="grid grid-cols-3 gap-4 items-center mb-4">
//       {/* Вес */}
//       <div>
//         <label className="block text-sm text-muted-foreground mb-1">Вес (кг)</label>
//         <Input
//           type="number"
//           value={approach.weight ?? ''}
//           onChange={(e) => handleChange('weight', +e.target.value)}
//         />
//       </div>

//       {/* Повторения */}
//       <div>
//         <label className="block text-sm text-muted-foreground mb-1">Повторения</label>
//         <Input
//           type="number"
//           value={approach.reps ?? ''}
//           onChange={(e) => handleChange('reps', +e.target.value)}
//         />
//       </div>

//       {/* Ощущения */}
//       <div>
//         <label className="block text-sm text-muted-foreground mb-1">
//           Сложность: {approach.feeling ? '★'.repeat(approach.feeling) : '-'}
//         </label>
//         <Slider
//           min={1}
//           max={5}
//           step={1}
//           value={[approach.feeling ?? 3]}
//           onValueChange={(val) => handleChange('feeling', val[0])}
//         />
//         <div className="flex justify-between text-xs text-muted-foreground mt-1">
//           <span>Сложно</span>
//           <span>Легко</span>
//         </div>
//       </div>
//     </div>
//   );
// };
